const {test}=require('node:test');const assert=require('node:assert/strict');const Module=require('node:module');
const problem=require('../src/data/expandedProblems')[2];const {buildSource}=require('../src/utils/functionDriver');
const original=Module._load;let payload,stored,solved=0;
Module._load=function(id,parent,...args){if(parent?.filename.endsWith('/controllers/userSubmission.js')){
 if(id==='../models/problem')return {findById:async()=>({...problem,_id:'problem'})};
 if(id==='../models/submission')return {create:async body=>(stored={...body,save:async()=>{}})};
 if(id==='../models/user')return {updateOne:async()=>{solved++;}};
 if(id==='../utils/problemUtility')return {getLanguageById:()=>54,submitBatch:async rows=>{payload=rows;return rows.map((_,i)=>({token:String(i)}));},submitToken:async tokens=>tokens.map(()=>({status_id:3,stdout:'3',time:'0.01',memory:1024}))};
 }return original.call(this,id,parent,...args);};
const {runCode,submitCode}=require('../src/controllers/userSubmission');Module._load=original;
function response(){return {statusCode:200,status(n){this.statusCode=n;return this;},json(data){this.data=data;return this;}};}
test('Run/Submit send class code through the server driver, retain the user snippet and judge samples plus hidden cases',async()=>{
 const code=problem.referenceSolution.find(s=>s.language==='C++').solutionCode,req={params:{id:'problem'},body:{code,language:'cpp'},result:{_id:'user'}};
 const run=response();await runCode(req,run);assert.equal(run.statusCode,200);assert.equal(run.data.accepted,true);assert.equal(payload.length,problem.visibleTestCases.length);assert.equal(payload[0].source_code,buildSource(problem,code,'cpp'));assert.equal(stored,undefined);
 const submit=response();await submitCode(req,submit);assert.equal(submit.data.accepted,true);assert.equal(payload.length,problem.visibleTestCases.length+problem.hiddenTestCases.length);assert.equal(stored.code,code);assert.equal(stored.status,'accepted');assert.equal(solved,1);
});
