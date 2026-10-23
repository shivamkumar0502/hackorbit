const router=require('express').Router();
const mongoose=require('mongoose');
const { Event,Entry }=require('../models/growth');
const Problem=require('../models/problem');
const Submission=require('../models/submission');
const { leaderboard }=require('../utils/learning');
router.use(require('../middleware/userMiddleware'));
const wrap=fn=>async(req,res)=>{try{await fn(req,res);}catch(error){res.status(error.status||500).json({message:error.status?error.message:'Unable to load or update the contest. Please retry.'});}};
const bad=(message,status=400)=>{throw Object.assign(new Error(message),{status});};
async function eventById(id){if(!mongoose.isValidObjectId(id))bad('Invalid contest ID.');const event=await Event.findById(id).lean();if(!event)bad('Contest not found.',404);return event;}
const info=(event,now=new Date())=>({id:event._id,title:event.title,startsAt:event.startsAt,endsAt:event.endsAt,state:now<event.startsAt?'upcoming':now<event.endsAt?'live':'ended',problemCount:event.problems.length,serverNow:now});
router.get('/',wrap(async(req,res)=>{
 const [events,entries]=await Promise.all([Event.find({}).sort({startsAt:-1}).limit(50).lean(),Entry.find({userId:req.result._id}).select('eventId').lean()]);
 const joined=new Set(entries.map(e=>String(e.eventId)));res.json(events.map(e=>({...info(e),joined:joined.has(String(e._id))})));
}));
router.post('/',wrap(async(req,res)=>{
 if(req.result.role!=='admin')bad('Only an administrator can schedule contests.',403);
 const {title,startsAt,minutes,problemIds}=req.body||{},start=new Date(startsAt);
 if(typeof title!=='string'||title.trim().length<3||title.length>100||!Number.isFinite(+start)||+start<Date.now()+60000||+start>Date.now()+366*86400000||!Number.isInteger(minutes)||minutes<15||minutes>240||!Array.isArray(problemIds)||problemIds.length<1||problemIds.length>10||new Set(problemIds).size!==problemIds.length||problemIds.some(id=>!mongoose.isValidObjectId(id)))bad('Choose a title, a future start (at least one minute away), 15–240 minutes, and 1–10 different problems.');
 const problems=await Problem.find({_id:{$in:problemIds}}).select('title difficulty').lean();if(problems.length!==problemIds.length)bad('One or more problems are unavailable.');
 const event=await Event.create({title:title.trim(),startsAt:start,endsAt:new Date(+start+minutes*60000),createdBy:req.result._id,problems:problemIds.map(id=>{const p=problems.find(p=>String(p._id)===id);return {problemId:p._id,title:p.title,points:{easy:100,medium:200,hard:300}[p.difficulty]||100};})});
 res.status(201).json(info(event));
}));
router.post('/:id/join',wrap(async(req,res)=>{
 const event=await eventById(req.params.id);if(Date.now()>=+event.endsAt)bad('This contest has ended.',409);
 try{await Entry.updateOne({eventId:event._id,userId:req.result._id},{$setOnInsert:{displayName:req.result.firstName,joinedAt:new Date()}},{upsert:true});}catch(error){if(error.code!==11000)throw error;}
 res.json({joined:true});
}));
router.get('/:id',wrap(async(req,res)=>{
 const event=await eventById(req.params.id),summary=info(event);
 const entries=await Entry.find({eventId:event._id}).lean(),mine=entries.find(entry=>String(entry.userId)===String(req.result._id));
 let standings=[];
 if(summary.state!=='upcoming'){
 const submissions=await Submission.find({userId:{$in:entries.map(e=>e.userId)},problemId:{$in:event.problems.map(p=>p.problemId)},createdAt:{$gte:event.startsAt,$lte:new Date(Math.min(Date.now(),+event.endsAt))},status:{$in:['accepted','wrong']}}).select('userId problemId status createdAt').lean();
 standings=leaderboard(event,entries,submissions);
 }
 res.json({...summary,joined:Boolean(mine),participants:entries.length,problems:summary.state!=='upcoming'&&mine?event.problems:[],leaderboard:standings.map(({userId,...row})=>({...row,isYou:userId===String(req.result._id)})),rules:'Easy 100, medium 200, hard 300 points. Ties use elapsed minutes to first acceptance plus 5 minutes per wrong attempt before acceptance. Runs, pending jobs and execution errors do not score or add penalties. Only submissions after you join and within the contest window count. Problem-bank practice events are not proctored.'});
}));
module.exports=router;
