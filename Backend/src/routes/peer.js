const router = require('express').Router();
const { randomBytes } = require('node:crypto');
const mongoose = require('mongoose');
const { Peer } = require('../models/growth');
const Problem = require('../models/problem');
router.use(require('../middleware/userMiddleware'));
const wrap=fn=>async(req,res)=>{try{await fn(req,res);}catch(error){res.status(error.status||500).json({message:error.status?error.message:'Unable to update the interview room. Please retry.'});}};
const bad=(message,status=400)=>{throw Object.assign(new Error(message),{status});};
async function owned(req,withHistory=false) {
  if(!/^[a-f0-9]{32}$/.test(req.params.invite)) bad('Invalid room link.');
  const room=await Peer.findOne({invite:req.params.invite,$or:[{host:req.result._id},{guest:req.result._id}]}).select(withHistory?'':'-history');
  if(!room) bad('Room not found. Join with its invite link first.',404);
  return room;
}
function view(room,user) {
 const role=String(room.host)===String(user)?'host':'guest',now=new Date();
 return {invite:room.invite,role,hostName:room.hostName,guestName:room.guestName,hasGuest:Boolean(room.guest),problemId:room.problemId,code:room.code,language:room.language,version:room.version,editor:room.editor,status:room.status==='ended'||now>=room.expiresAt||room.endsAt&&now>=room.endsAt?'ended':room.status,startedAt:room.startedAt,endsAt:room.endsAt,expiresAt:room.expiresAt,minutes:room.minutes,review:room.review,serverNow:now};
}
router.get('/',wrap(async(req,res)=>{const rooms=await Peer.find({$or:[{host:req.result._id},{guest:req.result._id}]}).select('-history').sort({createdAt:-1}).limit(10);res.json(rooms.map(room=>view(room,req.result._id)));}));
router.post('/',wrap(async(req,res)=>{
 const {problemId,minutes=45}=req.body||{};
 if(!mongoose.isValidObjectId(problemId)||![30,45,60].includes(minutes)) return bad('Choose a problem and a 30, 45 or 60 minute duration.');
 if(await Peer.countDocuments({host:req.result._id,expiresAt:{$gt:new Date()},$or:[{status:'waiting'},{status:'active',endsAt:{$gt:new Date()}}]})>=5) return bad('You already have five open rooms. End a room first.',409);
 const problem=await Problem.findById(problemId).select('startCode');if(!problem) return bad('Problem not found.',404);
 const code=problem.startCode?.find(item=>item.language?.toLowerCase()==='javascript')?.initialCode||'// Discuss your approach, then write your solution here.\n';
 const room=await Peer.create({invite:randomBytes(16).toString('hex'),host:req.result._id,hostName:req.result.firstName,problemId,minutes,code,history:[{version:0,at:new Date(),actor:'host',event:'Room created',language:'javascript',code}],expiresAt:new Date(Date.now()+86400000)});
 res.status(201).json(view(room,req.result._id));
}));
router.post('/:invite/join',wrap(async(req,res)=>{
 if(!/^[a-f0-9]{32}$/.test(req.params.invite)) bad('Invalid invite link.');
 let room=await Peer.findOne({invite:req.params.invite});if(!room) bad('Room not found.',404);
 if(String(room.host)===String(req.result._id)||String(room.guest)===String(req.result._id)) return res.json(view(room,req.result._id));
 if(room.status!=='waiting'||Date.now()>=+room.expiresAt) bad('This invitation is closed.',409);
 room=await Peer.findOneAndUpdate({invite:req.params.invite,guest:null,status:'waiting',expiresAt:{$gt:new Date()}},{$set:{guest:req.result._id,guestName:req.result.firstName},$inc:{version:1}},{new:true});
 if(!room) bad('This room already has a candidate.',409);
 res.json(view(room,req.result._id));
}));
router.get('/:invite',wrap(async(req,res)=>res.json(view(await owned(req),req.result._id))));
router.get('/:invite/replay',wrap(async(req,res)=>{const room=await owned(req,true);res.json({history:room.history||[],review:room.review,hostName:room.hostName,guestName:room.guestName,limit:120});}));
router.patch('/:invite',wrap(async(req,res)=>{
 const room=await owned(req),current=view(room,req.result._id),{version,code,language}=req.body||{};
 if(current.status==='ended') bad('This interview has ended.',409);
 if(current.role!==room.editor) bad('Only the current editor can change code. Ask the host to hand over editing.',403);
 if(!Number.isInteger(version)||version<0||typeof code!=='string'||code.length>50000||!['javascript','cpp','java'].includes(language)) bad('Invalid code update. Maximum code size is 50000 characters.');
 const saved=await Peer.findOneAndUpdate({_id:room._id,version,editor:current.role,status:room.status,expiresAt:{$gt:new Date()},...(room.status==='active'?{endsAt:{$gt:new Date()}}:{})},{$set:{code,language},$inc:{version:1},$push:{history:{$each:[{version:version+1,at:new Date(),actor:current.role,event:'Code saved',code,language}],$slice:-120}}},{new:true});
 if(!saved) bad('Room changed elsewhere. Reload the shared version before saving again.',409);
 res.json(view(saved,req.result._id));
}));
router.post('/:invite/control',wrap(async(req,res)=>{
 const room=await owned(req),current=view(room,req.result._id),{action,editor,review}=req.body||{};
 if(current.role!=='host') bad('Only the host can control the interview.',403);
 if(current.status==='ended'&&action!=='review') bad('This interview has ended.',409);
 let update={},filter={_id:room._id,version:room.version};
 if(action==='start') {if(room.status!=='waiting'||!room.guest) bad('A candidate must join before the timer starts.',409);update={status:'active',startedAt:new Date(),endsAt:new Date(Date.now()+room.minutes*60000),editor:'guest'};}
 else if(action==='handoff') {if(!['host','guest'].includes(editor)||editor==='guest'&&!room.guest) bad('Choose an editor who has joined.');update={editor};}
 else if(action==='end') update={status:'ended'};
 else if(action==='review') {if(current.status!=='ended'||typeof review!=='string'||review.length>4000) bad('End the interview before saving a review of up to 4000 characters.');update={review,status:'ended'};}
 else bad('Unknown room control.');
 const saved=await Peer.findOneAndUpdate(filter,{$set:update,$inc:{version:1},$push:{history:{$each:[{version:room.version+1,at:new Date(),actor:'host',event:action,code:room.code,language:room.language}],$slice:-120}}},{new:true});if(!saved) bad('Room changed elsewhere. Refresh and retry.',409);
 res.json(view(saved,req.result._id));
}));
module.exports=router;
