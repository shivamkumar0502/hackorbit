const {test}=require('node:test');const assert=require('node:assert/strict');const Module=require('node:module');
const problem=require('../src/data/expandedProblems')[2];const {buildSource}=require('../src/utils/functionDriver');
const original=Module._load;let payload,stored,solved=0,judgeStatus=3,revisionUpdates=[];
Module._load=function(id,parent,...args){if(parent?.filename.endsWith('/controllers/userSubmission.js')){
 if(id==='../models/problem')return {findById:async()=>({...problem,_id:'problem'})};
 if(id==='../models/submission')return {create:async body=>(stored={...body,save:async()=>{}})};
 if(id==='../models/growth')return {Revision:{updateOne:async(q,u)=>revisionUpdates.push({q,u})}};
 if(id==='../models/user')return {updateOne:async()=>{solved++;}};
 if(id==='../utils/problemUtility')return {getLanguageById:()=>54,submitBatch:async rows=>{payload=rows;return rows.map((_,i)=>({token:String(i)}));},submitToken:async tokens=>tokens.map(()=>({status_id:judgeStatus,stdout:'3',time:'0.01',memory:1024}))};
 }return original.call(this,id,parent,...args);};
const {runCode,submitCode,customRun}=require('../src/controllers/userSubmission');Module._load=original;
function response(){return {statusCode:200,status(n){this.statusCode=n;return this;},json(data){this.data=data;return this;}};}
test('Run/Submit send class code through the server driver, retain the user snippet and judge samples plus hidden cases',async()=>{
 const code=problem.referenceSolution.find(s=>s.language==='C++').solutionCode,req={params:{id:'problem'},body:{code,language:'cpp'},result:{_id:'user'}};
 const run=response();await runCode(req,run);assert.equal(run.statusCode,200);assert.equal(run.data.accepted,true);assert.equal(payload.length,problem.visibleTestCases.length);assert.equal(payload[0].source_code,buildSource(problem,code,'cpp'));assert.equal(stored,undefined);
 const submit=response();await submitCode(req,submit);assert.equal(submit.data.accepted,true);assert.equal(payload.length,problem.visibleTestCases.length+problem.hiddenTestCases.length);assert.equal(stored.code,code);assert.equal(stored.status,'accepted');assert.equal(solved,1);
});

test('custom runs execute the user input without saving, scoring, or scheduling revision',async()=>{
 const code=problem.referenceSolution.find(s=>s.language==='C++').solutionCode,req={params:{id:'problem'},body:{code,language:'cpp',stdin:'1 8',expected:'3'},result:{_id:'user'}};const previous=stored,score=solved;
 const out=response();await customRun(req,out);assert.equal(out.statusCode,200);assert.equal(out.data.matchesExpected,true);assert.equal(out.data.savedSubmission,false);assert.equal(payload.length,1);assert.equal(payload[0].stdin,'1 8');assert.equal(payload[0].expected_output,undefined);assert.equal(payload[0].enable_network,false);assert.equal(stored,previous);assert.equal(solved,score);assert.equal(revisionUpdates.length,0);
 req.body.stdin='x'.repeat(20001);const invalid=response();await customRun(req,invalid);assert.equal(invalid.statusCode,400);
});
test('wrong submissions queue a private one-day revision; execution errors never mark a topic as forgotten',async()=>{
 judgeStatus=4;const req={params:{id:'problem'},body:{code:'class Solution {}',language:'cpp'},result:{_id:'user'}};const out=response();await submitCode(req,out);assert.equal(out.data.status,'wrong');assert.equal(revisionUpdates.length,1);assert.equal(revisionUpdates[0].q.userId,'user');assert.equal(revisionUpdates[0].u.$set.reviewStep,0);assert.ok(revisionUpdates[0].u.$set.dueAt>Date.now()+23*3600000);
 judgeStatus=6;await submitCode(req,response());assert.equal(revisionUpdates.length,1);judgeStatus=3;
});
