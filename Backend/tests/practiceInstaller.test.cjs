const {test}=require('node:test');const assert=require('node:assert/strict');const Module=require('node:module');const original=Module._load;
const docs=new Map();const completed=new Set();let fail=false;
const Problem={init:async()=>{},countDocuments:async()=>docs.size,updateOne:async(q,u)=>{if(fail)throw Error('write failed');if(u.$set){if(docs.has(q.seedKey))Object.assign(docs.get(q.seedKey),u.$set);return {matchedCount:docs.has(q.seedKey)?1:0};}if(docs.has(q.seedKey))return {upsertedCount:0};docs.set(q.seedKey,u.$setOnInsert);return {upsertedCount:1};}};
Module._load=function(id,parent,...args){if(parent?.filename.endsWith('/services/installPracticeProblems.js')){if(id==='../models/problem')return Problem;if(id==='../models/user')return {findOne:()=>({select(){return this;},lean:async()=>({_id:'a'.repeat(24)})})};if(id==='mongoose')return {models:{platformMigration:{exists:async q=>completed.has(q._id),updateOne:async q=>{completed.add(q._id);}}}};}return original.call(this,id,parent,...args);};
const install=require('../src/services/installPracticeProblems');Module._load=original;
test('core installer adds 58 once, preserves edits/deletions on restart and supports explicit restore',async()=>{
 assert.deepEqual(await install(),{added:58,total:58});const key=[...docs.keys()][0];docs.get(key).title='Admin edited title';docs.delete([...docs.keys()][1]);
 assert.deepEqual(await install(),{added:0,total:57});assert.equal(docs.get(key).title,'Admin edited title');
 assert.deepEqual(await install({force:true}),{added:1,total:58});assert.equal(docs.get(key).title,'Admin edited title');
 completed.clear();fail=true;await assert.rejects(install());assert.equal(completed.size,0);
 fail=false;docs.clear();completed.add('core-problems-v1');assert.deepEqual(await install(),{added:50,total:50});assert.ok(!docs.has('core-v1-array-total'),'upgrade must not restore core problems deleted by an administrator');
});
test('function upgrade updates existing expanded solutions without recreating deleted problems or overwriting titles',async()=>{
 const key=[...docs.keys()][0],deleted=[...docs.keys()][1];
 docs.get(key).title='Keep my title';docs.get(key).referenceSolution=[{language:'JavaScript',completeCode:'old'}];docs.delete(deleted);
 completed.add('core-problems-v1');completed.add('expanded-problems-v2');completed.delete('expanded-function-solutions-v3');
 assert.deepEqual(await install(),{added:0,total:49});assert.equal(docs.get(key).title,'Keep my title');assert.equal(docs.get(key).referenceSolution.length,3);assert.equal(docs.get(key).functionMode,true);assert.equal(docs.has(deleted),false);
});
