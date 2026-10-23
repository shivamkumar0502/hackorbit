const { test } = require('node:test');
const assert = require('node:assert/strict');
const Module = require('node:module');
const original = Module._load;
let records = [], pool = [['_id1','easy'],['_id2','medium'],['_id3','hard']].map(([_id,difficulty]) => ({_id,difficulty,title: difficulty+' problem'})), accepted = [];
let seq = 0;
const chain = value => ({ sort() { return this; }, limit() { return this; }, populate() { return this; }, select() { return this; }, lean() { return Promise.resolve(value); } });
const matches = (s,q) => (!q._id || s._id === q._id) && s.userId === q.userId && (!q.status || s.status === q.status);
const Session = {
 find(q) { return chain(records.filter(s => matches(s,q)).slice().reverse()); },
 findOne(q) { return chain(records.find(s => matches(s,q)) || null); },
 async updateMany(q,u) { records.filter(s => matches(s,q) && s.endsAt <= q.endsAt.$lte).forEach(s => Object.assign(s,u.$set)); },
 async updateOne(q,u) { const s=records.find(s => matches(s,q)); if(s) Object.assign(s,u.$set); },
 async create(data) { const s={...data, _id:(++seq).toString(16).padStart(24,'0'),status:'active', async populate() { this.problems=this.problems.map(id=>pool.find(p=>p._id===id)); } }; records.push(s); return s; },
};
Module._load = function(id,parent,...args) {
 if(parent?.filename.endsWith('/routes/contest.js')) {
  if(id==='../models/contestSession') return Session;
  if(id==='../models/problem') return { find:()=>chain(pool) };
  if(id==='../models/submission') return { find:q=>chain(accepted.filter(s=>s.userId===q.userId && q.problemId.$in.includes(s.problemId) && s.createdAt>=q.createdAt.$gte && s.createdAt<=q.createdAt.$lte)) };
  if(id==='../middleware/userMiddleware') return (req,res,next)=>{ if(!req.headers['x-user']) return res.status(401).json({message:'Unauthorized'}); req.result={_id:req.headers['x-user']}; next(); };
 }
 return original.call(this,id,parent,...args);
};
const router = require('../src/routes/contest');
Module._load=original;
const express=require('express');
test('contest lifecycle validates durations, persists rounds, enforces ownership and counts only in-window accepted problems once',async()=>{
 const app=express(); app.use(express.json()); app.use('/api/contest',router);
 const server=app.listen(0,'127.0.0.1'); await new Promise(resolve=>server.once('listening',resolve));
 const base=`http://127.0.0.1:${server.address().port}/api/contest`;
 async function request(path='',body,user='one') {const response=await fetch(base+path,{method:body===undefined?'GET':'POST',headers:{'Content-Type':'application/json',...(user?{'x-user':user}:{})},...(body===undefined?{}:{body:JSON.stringify(body)})});return {status:response.status,data:await response.json()};}
 try {
  assert.equal((await request('',undefined,'')).status,401);
  assert.equal((await request('/start',{minutes:1})).status,400);
  const started=await request('/start',{minutes:30}); assert.equal(started.status,201); assert.equal(started.data.problems.length,3);
  assert.equal(+new Date(started.data.endsAt)-+new Date(started.data.startedAt),1800000);
  assert.equal((await request('/start',{minutes:90})).status,409);
  const s=records[0], time=new Date(+s.startedAt+1); await new Promise(resolve=>setTimeout(resolve,5));
  accepted=[{userId:'one',problemId:'_id1',createdAt:time},{userId:'one',problemId:'_id1',createdAt:time},{userId:'two',problemId:'_id2',createdAt:time},{userId:'one',problemId:'_id2',createdAt:new Date(+s.startedAt-1)},{userId:'one',problemId:'_id3',createdAt:new Date(+s.endsAt+1)}];
  const resumed=await request(); assert.equal(resumed.data[0].id,started.data.id); assert.deepEqual(resumed.data[0].solved,['_id1']);
  assert.equal((await request(`/${s._id}/finish`,{},'two')).status,404); assert.equal(s.status,'active');
  assert.equal((await request('/bad/finish',{})).status,400);
  assert.equal((await request(`/${s._id}/finish`,{})).data.status,'finished'); const finish=s.finishedAt;
  await request(`/${s._id}/finish`,{}); assert.equal(s.finishedAt,finish);
  assert.equal((await request('/start',{minutes:60})).status,201);
  records.at(-1).endsAt=new Date(Date.now()-1);
  assert.equal((await request()).data[0].status,'finished');
  assert.equal((await request('/start',{minutes:90})).status,201);
  records=[];pool=[];assert.equal((await request('/start',{minutes:30})).status,409);
 } finally {await new Promise(resolve=>server.close(resolve));}
});
