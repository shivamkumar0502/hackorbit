const {test}=require('node:test'),assert=require('node:assert/strict'),Module=require('node:module');
const {createModels}=require('./helpers/memoryModels.cjs');const {models,tables}=createModels();
const host='a'.repeat(24),guest='b'.repeat(24),stranger='c'.repeat(24),pid='1'.repeat(24),event='2'.repeat(24),invite='d'.repeat(32),call='e'.repeat(32);
const now=new Date();tables.Problem.push({_id:pid,title:'A problem',tags:'array',startCode:[],referenceSolution:[],visibleTestCases:[{input:'1',output:'1'}],hiddenTestCases:[]});tables.Submission.push({_id:'s',userId:host,problemId:pid,language:'java',status:'accepted',code:'class Solution {}',runtime:.1,memory:20,createdAt:now});tables.Event.push({_id:event,title:'Event',startsAt:new Date(+now-60000),endsAt:new Date(+now+60000),problems:[{problemId:pid}]});tables.Entry.push({_id:'entry',eventId:event,userId:host,displayName:'Host',joinedAt:new Date(+now-60000)});tables.Peer.push({_id:'room',invite,host,guest,expiresAt:new Date(+now+60000),status:'waiting',history:[]});
const original=Module._load;
Module._load=function(id,parent,...args){if(/\/routes\/(platformFeatures|peerMedia)\.js$/.test(parent?.filename||'')){
 if(id==='../models/platformFeatures')return {PublicProfile:models.PublicProfile,Report:models.Report,Signal:models.Signal,Review:models.Review,Rtc:models.Rtc};
 if(id==='../models/growth')return {Revision:models.Revision,Event:models.Event,Entry:models.Entry,Peer:models.Peer};
 if(id==='../models/problem')return models.Problem;if(id==='../models/submission')return models.Submission;
 if(id==='../middleware/userMiddleware')return (req,res,next)=>{const user=req.headers['x-user'];if(!user)return res.status(401).json({message:'Unauthorized'});req.result={_id:user,firstName:'Host',role:req.headers['x-admin']==='yes'?'admin':'user'};next();};
 }return original.call(this,id,parent,...args);};
const features=require('../src/routes/platformFeatures'),media=require('../src/routes/peerMedia');Module._load=original;
async function serverTest(fn){const app=require('express')();app.use(require('express').json());app.use('/features',features);app.use('/media',media);const server=app.listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));const base=`http://127.0.0.1:${server.address().port}`;async function req(path,body,user=host,method=body===undefined?'GET':'POST',admin=false){const r=await fetch(base+path,{method,headers:{'Content-Type':'application/json',...(user?{'x-user':user}:{}),...(admin?{'x-admin':'yes'}:{})},...(body===undefined?{}:{body:JSON.stringify(body)})});return {status:r.status,data:await r.json()};}try{await fn(req);}finally{await new Promise(r=>server.close(r));}}
test('public profiles require explicit enablement and expose no email, user ID, code or private submissions',()=>serverTest(async req=>{
 assert.equal((await req('/features/analytics',undefined,'')).status,401);assert.equal((await req('/features/public/my-handle',undefined,'')).status,404);
 const p={slug:'my-handle',enabled:false,displayName:'Coder',bio:'Hello',github:'https://github.com/coder',portfolio:''};
 assert.equal((await req('/features/profile',p,host,'PUT')).status,200);assert.equal((await req('/features/public/my-handle',undefined,'')).status,404);
 await req('/features/profile',{...p,enabled:true},host,'PUT');const publicProfile=await req('/features/public/my-handle',undefined,'');assert.equal(publicProfile.status,200);assert.equal(publicProfile.data.solved,1);for(const key of ['userId','emailId','code','recent','notes'])assert.equal(publicProfile.data[key],undefined);
 assert.equal((await req('/features/profile',{...p,github:'javascript:alert(1)'},host,'PUT')).status,400);assert.equal((await req('/features/profile',{...p,enabled:true},guest,'PUT')).status,409);
 await req('/features/profile',p,host,'PUT');assert.equal((await req('/features/public/my-handle',undefined,'')).status,404);
}));
test('analytics and spaced reviews are user-scoped; reports and admin quality updates enforce roles',()=>serverTest(async req=>{
 assert.equal((await req('/features/analytics')).data.solved,1);assert.equal((await req('/features/analytics',undefined,guest)).data.solved,0);
 tables.Revision.push({_id:'review',userId:host,problemId:pid,notes:'Private',reviewStep:0,updatedAt:now});
 assert.equal((await req('/features/review/'+pid,{remembered:true},guest)).status,404);const r=await req('/features/review/'+pid,{remembered:true});assert.equal(r.data.reviewStep,1);assert.ok(+new Date(r.data.dueAt)>Date.now()+2*86400000);
 assert.equal((await req('/features/report/'+pid,{category:'testcase',body:'A detailed testcase issue.'})).status,201);assert.equal((await req('/features/quality')).status,403);const q=await req('/features/quality',undefined,host,'GET',true);assert.equal(q.status,200);assert.ok(q.data.problems[0].issues.includes('Missing Java solution'));const id=q.data.reports[0]._id;
 assert.equal((await req('/features/quality/'+id,{status:'resolved'},guest,'PATCH')).status,403);assert.equal((await req('/features/quality/'+id,{status:'resolved',adminNote:'Reviewed.'},host,'PATCH',true)).status,200);
}));
test('contest signals require live event membership and matching problems; review stays admin-only',()=>serverTest(async req=>{
 const body={problemId:pid,kind:'code-paste'};assert.equal((await req(`/features/events/${event}/signals`,body,guest)).status,403);assert.equal((await req(`/features/events/${event}/signals`,{...body,problemId:'9'.repeat(24)})).status,400);assert.equal((await req(`/features/events/${event}/signals`,body)).status,200);assert.equal((await req(`/features/events/${event}/review`)).status,403);const r=await req(`/features/events/${event}/review`,undefined,host,'GET',true);assert.equal(r.data.participants[0].pastes,1);assert.equal((await req(`/features/events/${event}/review/${host}`,{decision:'follow-up',note:'Discuss approach.'},host,'PUT',true)).status,200);
}));
test('call signalling rejects strangers, stale sessions, invalid roles and expired rooms',()=>serverTest(async req=>{
 const offer={callId:call,kind:'offer',payload:{type:'offer',sdp:'v=0'}};
 assert.equal((await req('/media/'+invite,undefined,stranger)).status,403);assert.equal((await req('/media/'+invite,offer,guest)).status,403);assert.equal((await req('/media/'+invite,offer)).status,200);
 const received=await req('/media/'+invite,undefined,guest);assert.equal(received.data.callId,call);assert.equal(received.data.messages[0].kind,'offer');assert.equal((await req('/media/'+invite,undefined,host)).data.messages.length,0);
 assert.equal((await req('/media/'+invite,{callId:'f'.repeat(32),kind:'answer',payload:{type:'answer',sdp:'v=0'}},guest)).status,409);
 assert.equal((await req('/media/'+invite,{callId:call,kind:'answer',payload:{type:'answer',sdp:'v=0'}},guest)).status,200);
 assert.equal((await req('/media/'+invite,{callId:call,kind:'ice',payload:{candidate:'candidate:1',sdpMid:'0'}},guest)).status,200);
 assert.equal((await req('/media/'+invite+'?after='+received.data.messages[0].id,undefined,guest)).data.messages.length,0);
 tables.Peer[0].status='ended';assert.equal((await req('/media/'+invite,undefined,host)).status,409);
}));
test('admin code comparison is limited to registered users and in-window contest submissions',()=>serverTest(async req=>{
 tables.Entry.push({_id:'guest-entry',eventId:event,userId:guest,displayName:'Candidate',joinedAt:new Date(+now-30000)});
 tables.Submission.push({_id:'guest-s',userId:guest,problemId:pid,language:'java',status:'wrong',code:'candidate private code',createdAt:now});
 const path=`/features/events/${event}/compare?first=${host}&second=${guest}&problemId=${pid}&language=java`;
 assert.equal((await req(path)).status,403);const r=await req(path,undefined,host,'GET',true);assert.equal(r.status,200);assert.equal(r.data.first.code,'class Solution {}');assert.equal(r.data.second.code,'candidate private code');assert.equal((await req(path.replace(guest,stranger),undefined,host,'GET',true)).status,400);
}));
