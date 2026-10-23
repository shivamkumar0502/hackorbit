const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'); const os=require('node:os'); const path=require('node:path');
const {spawnSync}=require('node:child_process');
const problems=require('../src/data/expandedProblems');
const {buildSource}=require('../src/utils/functionDriver');
const which=command=>spawnSync('sh',['-c',`command -v ${command}`],{encoding:'utf8'}).stdout.trim();
const javac=process.env.JAVAC_PATH||which('javac');
function checked(command,args,options={}) {const run=spawnSync(command,args,{encoding:'utf8',timeout:90000,maxBuffer:4*1024*1024,...options});assert.equal(run.status,0,`${command}: ${run.stderr||run.error}`);return run.stdout.trim();}
test('every expanded problem publishes matching class templates, drivers, formatted examples and three native solutions',()=>{
 for(const p of problems){assert.equal(p.functionMode,true);assert.equal(p.codeVersion,3);assert.equal(p.startCode.length,3);assert.equal(p.referenceSolution.length,3);assert.ok(p.visibleTestCases[0].displayInput.includes(' = '));
 for(const s of p.referenceSolution){assert.match(s.solutionCode,/class Solution/);assert.ok(s.timeComplexity&&s.spaceComplexity);const language=({'C++':'cpp',Java:'java',JavaScript:'javascript'})[s.language];assert.equal(buildSource(p,s.solutionCode,language),s.completeCode);assert.doesNotMatch(p.startCode.find(x=>x.language===s.language).initialCode,/main\(|readFileSync|Scanner/);}
 }
});
test('server drivers preserve legacy programs, insert snippets literally and reject missing contracts',()=>{
 const p=problems[0];assert.equal(buildSource({functionMode:false},'program','cpp'),'program');
 assert.equal(buildSource(p,'int main() {}','cpp'),'int main() {}');
 assert.equal(buildSource(p,'public class Main {public static void main(String[] args) {}}','java'),'public class Main {public static void main(String[] args) {}}');
 assert.equal(buildSource(p,"const fs=require('fs');fs.readFileSync(0,'utf8');",'javascript'),"const fs=require('fs');fs.readFileSync(0,'utf8');");
 assert.ok(buildSource(p,'// $& $` $\'','cpp').includes('// $& $` $\''));
 assert.throws(()=>buildSource({functionMode:true},'class Solution {}','java'),/not configured/);
});
test('all 50 C++ references compile and pass every sample and hidden case through the actual drivers',{timeout:90000},()=>{
 const directory=fs.mkdtempSync(path.join(os.tmpdir(),'hackorbit-cpp-'));
 try {
 const sections=problems.map((p,i)=>{
 const code=p.referenceSolution.find(s=>s.language==='C++').completeCode.replace('#include <bits/stdc++.h>','').replace('int main()','int run()').replace(/\}\s*$/, 'return 0;\n}');
 return `namespace P${i} {\n${code}\n}`;
 });
 fs.writeFileSync(path.join(directory,'all.cpp'),'#include <bits/stdc++.h>\n'+sections.join('\n')+'\nint main(int argc,char** argv) { switch(atoi(argv[1])) { '+problems.map((_,i)=>`case ${i}: return P${i}::run();`).join(' ')+' } return 1; }\n');
 checked('g++',['-std=c++17','-O0',path.join(directory,'all.cpp'),'-o',path.join(directory,'all')]);
 let cases=0;for(const [i,p]of problems.entries())for(const tc of [...p.visibleTestCases,...p.hiddenTestCases]){assert.equal(checked(path.join(directory,'all'),[String(i)],{input:tc.input,timeout:5000}),tc.output.trim(),p.title+' C++ '+tc.input);++cases;}
 console.log(`C++: ${problems.length} programs, ${cases} cases passed.`);
 } finally {fs.rmSync(directory,{recursive:true,force:true});}
});
test('all 50 Java references compile and pass every sample and hidden case through the actual drivers',{timeout:90000,skip:!javac&&'Set JAVAC_PATH or install a JDK to validate Java'},()=>{
 const directory=fs.mkdtempSync(path.join(os.tmpdir(),'hackorbit-java-'));
 try {
 const sources=problems.map((p,i)=>{const folder=path.join(directory,`p${i}`);fs.mkdirSync(folder);const file=path.join(folder,'Main.java');fs.writeFileSync(file,`package p${i};\n`+p.referenceSolution.find(s=>s.language==='Java').completeCode);return file;});
 checked(javac,['-d',directory,...sources]);
 let cases=0;for(const [i,p]of problems.entries())for(const tc of [...p.visibleTestCases,...p.hiddenTestCases]){assert.equal(checked('java',['-cp',directory,`p${i}.Main`],{input:tc.input,timeout:5000}),tc.output.trim(),p.title+' Java '+tc.input);++cases;}
 console.log(`Java: ${problems.length} programs, ${cases} cases passed.`);
 } finally {fs.rmSync(directory,{recursive:true,force:true});}
});
