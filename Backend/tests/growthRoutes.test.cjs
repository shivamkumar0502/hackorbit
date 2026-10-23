const {test}=require('node:test');
const assert=require('node:assert/strict');
const Module=require('node:module');
const {createModels}=require('./helpers/memoryModels.cjs');
const {models,tables}=createModels();
const original=Module._load;
const host='a'.repeat(24),guest='b'.repeat(24),other='c'.repeat(24),p1='1'.repeat(24),p2='2'.repeat(24);
tables.Problem.push({_id:p1,title:'Array sum',tags:'array',difficulty:'easy',startCode:[{language:'JavaScript',initialCode:'// start'}]},{_id:p2,title:'Graph paths',tags:'graph',difficulty:'medium'});
Module._load=function(id,parent,...args){
 if(/\/routes\/(learn|peer|events)\.js$/.test(parent?.filename||'')){
  if(id==='../models/growth')return models;
  if(id==='../models/problem')return models.Problem;
  if(id==='../models/submission')return models.Submission;
  if(id==='../middleware/userMiddleware')return(req,res,next)=>{if(!req.headers['x-user'])return res.status(401).json({message:'Unauthorized'});req.result={_id:req.headers['x-user'],firstName:req.headers['x-user']===host?'Host':'Coder',role:req.headers['x-admin']==='yes'?'admin':'user'};next();};
 }
 return original.call(this,id,parent,...args);
};
const express=require('express'),learn=require('../src/routes/learn'),peer=require('../src/routes/peer'),events=require('../src/routes/events');Module._load=original;
test('learning, private peer rooms and scheduled contest HTTP lifecycle',async()=>{
 const app=express();app.use(express.json());app.use('/learn',learn);app.use('/peer',peer);app.use('/events',events);
 const server=app.listen(0,'127.0.0.1');await new Promise(resolve=>server.once('listening',resolve));const base=`http://127.0.0.1:${server.address().port}`;
 async function request(path,body,user=host,method=body===undefined?'GET':'POST',admin=false){const res=await fetch(base+path,{method,headers:{'Content-Type':'application/json',...(user?{'x-user':user}:{}),...(admin?{'x-admin':'yes'}:{})},...(body===undefined?{}:{body:JSON.stringify(body)})});return {status:res.status,data:await res.json()};}
 try{
  for(const path of ['/learn/daily','/peer','/events'])assert.equal((await request(path,undefined,'')).status,401);
  const daily=await request('/learn/daily');assert.equal(daily.status,200);assert.ok(daily.data.problem._id);assert.equal((await request('/learn/daily')).data.problem._id,daily.data.problem._id);assert.equal(tables.Daily.length,1);
  tables.Submission.push({_id:'accepted',userId:host,problemId:daily.data.problem._id,status:'accepted',createdAt:new Date()});
  assert.equal((await request('/learn/daily')).data.completed,true);assert.equal((await request('/learn/daily',undefined,guest)).data.completed,false);
  assert.equal((await request('/learn/roadmap/arrays',{read:true},host,'PUT')).status,200);const roadmap=(await request('/learn/roadmap')).data;assert.equal(roadmap[0].read,true);assert.equal(roadmap.flatMap(u=>u.problems).filter(p=>p.solved).length>=1,true);
  assert.equal((await request('/learn/roadmap/unknown',{read:true},host,'PUT')).status,400);
  assert.equal((await request(`/learn/revision/${p1}`,{notes:'Use a map',days:3,status:'revisit'},host,'PUT')).status,200);
  assert.equal((await request(`/learn/revision/${p1}`,undefined,guest)).data,null);
  assert.equal((await request(`/learn/revision/${p1}`,{notes:'x',days:-1},host,'PUT')).status,400);
  await request(`/learn/revision/${p1}`,{},guest,'DELETE');assert.equal((await request('/learn/revision')).data.length,1);
  assert.equal((await request('/peer',{problemId:p1,minutes:1})).status,400);
  const made=await request('/peer',{problemId:p1,minutes:30});assert.equal(made.status,201);const link=`/peer/${made.data.invite}`;assert.equal(made.data.code,'// start');
  assert.equal((await request(link,undefined,other)).status,404);
  assert.equal((await request(`${link}/control`,{action:'start'})).status,409);
  assert.equal((await request(`${link}/join`,{},guest)).status,200);
  assert.equal((await request(`${link}/join`,{},other)).status,409);
  assert.equal((await request(`${link}/control`,{action:'start'},guest)).status,403);
  const started=await request(`${link}/control`,{action:'start'});assert.equal(started.data.editor,'guest');assert.equal(+new Date(started.data.endsAt)-+new Date(started.data.startedAt),30*60000);
  assert.equal((await request(link,{code:'bad',version:started.data.version,language:'javascript'},host,'PATCH')).status,403);
  const saved=await request(link,{code:'console.log(1)',version:started.data.version,language:'javascript'},guest,'PATCH');assert.equal(saved.status,200);
  assert.equal((await request(link,{code:'stale',version:started.data.version,language:'javascript'},guest,'PATCH')).status,409);
  assert.equal((await request(link)).data.code,'console.log(1)');
  assert.equal((await request(`${link}/replay`,undefined,other)).status,404);
  const replay=(await request(`${link}/replay`,undefined,guest)).data.history;assert.equal(replay.at(-1).code,'console.log(1)');assert.equal(replay.at(-1).actor,'guest');assert.equal(replay.filter(s=>s.code==='stale').length,0);
  assert.equal((await request(`${link}/control`,{action:'end'})).data.status,'ended');
  assert.equal((await request(link,{code:'late',version:saved.data.version,language:'javascript'},guest,'PATCH')).status,409);
  assert.equal((await request(`${link}/control`,{action:'review',review:'Good approach; test empty arrays.'})).status,200);
  assert.match((await request(link,undefined,guest)).data.review,/empty arrays/);
  const second=await request('/peer',{problemId:p2,minutes:45});tables.Peer.find(r=>r.invite===second.data.invite).expiresAt=new Date(Date.now()-1);assert.equal((await request(`/peer/${second.data.invite}/join`,{},guest)).status,409);
  const historyRoom=await request('/peer',{problemId:p1});const historyPath=`/peer/${historyRoom.data.invite}`;let version=historyRoom.data.version;for(let i=0;i<122;i++){const r=await request(historyPath,{code:`// version ${i}`,language:'javascript',version},host,'PATCH');assert.equal(r.status,200);version=r.data.version;}const bounded=(await request(`${historyPath}/replay`)).data.history;assert.equal(bounded.length,120);assert.equal(bounded.at(-1).code,'// version 121');
  assert.equal((await request('/events',{title:'Denied'})).status,403);
  const config={title:'Weekly practice',startsAt:new Date(Date.now()+3600000).toISOString(),minutes:60,problemIds:[p1,p2]};
  assert.equal((await request('/events',{...config,problemIds:[p1,p1]},host,'POST',true)).status,400);
  const scheduled=await request('/events',config,host,'POST',true);assert.equal(scheduled.status,201);const eventPath=`/events/${scheduled.data.id}`;
  await request(`${eventPath}/join`,{});await request(`${eventPath}/join`,{},guest);await request(`${eventPath}/join`,{},guest);assert.equal(tables.Entry.length,2);
  const upcoming=await request(eventPath);assert.equal(upcoming.data.state,'upcoming');assert.deepEqual(upcoming.data.problems,[]);
  const event=tables.Event[0];event.startsAt=new Date(Date.now()-600000);event.endsAt=new Date(Date.now()+600000);tables.Entry.forEach(e=>e.joinedAt=event.startsAt);
  tables.Submission.length=0;tables.Submission.push({userId:host,problemId:p1,status:'accepted',createdAt:new Date()});const live=await request(eventPath);assert.equal(live.data.problems.length,2);assert.equal(live.data.leaderboard[0].score,100);assert.equal(live.data.leaderboard[0].isYou,true);
  assert.deepEqual((await request(eventPath,undefined,other)).data.problems,[]);
  event.endsAt=new Date(Date.now()-1);assert.equal((await request(`${eventPath}/join`,{},other)).status,409);
 }finally{await new Promise(resolve=>server.close(resolve));}
});
