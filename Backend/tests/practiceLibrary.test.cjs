const {test}=require('node:test');
const assert=require('node:assert/strict');
const {spawnSync}=require('node:child_process');
const {mkdtempSync,writeFileSync,rmSync}=require('node:fs');
const {tmpdir}=require('node:os');
const {join}=require('node:path');
const problems=require('../src/data/practiceProblems');
test('eight original problems have valid schema and JS/C++ solutions pass all published and hidden cases',()=>{
 const Problem=require('../src/models/problem');const dir=mkdtempSync(join(tmpdir(),'hackorbit-core-'));let checks=0;
 try{for(const [index,problem]of problems.entries()){
  assert.equal(new Problem({...problem,problemCreator:'a'.repeat(24)}).validateSync(),undefined);
  const cpp=problem.referenceSolution.find(item=>item.language==='C++').completeCode,source=join(dir,`${index}.cpp`),exe=join(dir,`p${index}`);writeFileSync(source,cpp);const compiled=spawnSync('g++',['-std=c++17','-O2',source,'-o',exe],{encoding:'utf8',timeout:20000});assert.equal(compiled.status,0,compiled.stderr);
  for(const item of [...problem.visibleTestCases,...problem.hiddenTestCases]){const js=spawnSync(process.execPath,['-e',problem.referenceSolution.find(s=>s.language==='JavaScript').completeCode],{input:item.input,encoding:'utf8',timeout:2000});assert.equal(js.status,0,js.stderr);assert.equal(js.stdout.trim(),item.output.trim(),problem.title);const run=spawnSync(exe,[],{input:item.input,encoding:'utf8',timeout:2000});assert.equal(run.status,0,run.stderr);assert.equal(run.stdout.trim(),item.output.trim(),problem.title);checks+=2;}
 }assert.equal(problems.length,8);assert.equal(new Set(problems.map(p=>p.seedKey)).size,8);assert.ok(checks>=64);
 }finally{rmSync(dir,{recursive:true,force:true});}
});
