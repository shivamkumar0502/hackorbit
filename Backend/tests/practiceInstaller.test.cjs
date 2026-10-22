const {test}=require('node:test');const assert=require('node:assert/strict');const Module=require('node:module');const original=Module._load;
const docs=new Map();let complete=false,fail=false;
const Problem={init:async()=>{},countDocuments:async()=>docs.size,updateOne:async(q,u)=>{if(fail)throw Error('write failed');if(docs.has(q.seedKey))return {upsertedCount:0};docs.set(q.seedKey,u.$setOnInsert);return {upsertedCount:1};}};
Module._load=function(id,parent,...args){if(parent?.filename.endsWith('/services/installPracticeProblems.js')){if(id==='../models/problem')return Problem;if(id==='../models/user')return {findOne:()=>({select(){return this;},lean:async()=>({_id:'a'.repeat(24)})})};if(id==='mongoose')return {models:{platformMigration:{exists:async()=>complete,updateOne:async()=>{complete=true;}}}};}return original.call(this,id,parent,...args);};
const install=require('../src/services/installPracticeProblems');Module._load=original;
test('core installer adds eight once, preserves edits/deletions on restart and supports explicit restore',async()=>{
 assert.deepEqual(await install(),{added:8,total:8});const key=[...docs.keys()][0];docs.get(key).title='Admin edited title';docs.delete([...docs.keys()][1]);
 assert.deepEqual(await install(),{added:0,total:7});assert.equal(docs.get(key).title,'Admin edited title');
 assert.deepEqual(await install({force:true}),{added:1,total:8});assert.equal(docs.get(key).title,'Admin edited title');
 complete=false;fail=true;await assert.rejects(install());assert.equal(complete,false);
});
