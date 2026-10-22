const router = require('express').Router();
const mongoose = require('mongoose');
const { Daily, Revision, Progress } = require('../models/growth');
const Problem = require('../models/problem');
const Submission = require('../models/submission');
const { dayKey, dayStart, chooseDaily, streaks, units, unitProblems } = require('../utils/learning');
router.use(require('../middleware/userMiddleware'));
const wrap = fn => async (req,res) => { try { await fn(req,res); } catch { res.status(500).json({message:'Unable to load or save learning data. Please retry.'}); } };
router.get('/daily', wrap(async (req,res) => {
  const now = new Date(), day = dayKey(now);
  let challenge = await Daily.findOne({day}).lean();
  if (!challenge) {
    const candidate = chooseDaily(await Problem.find({}).select('_id').lean(),day);
    if (!candidate) return res.json({day,problem:null,streak:{current:0,longest:0,completedDays:0},completed:false});
    try { challenge = await Daily.findOneAndUpdate({day},{$setOnInsert:{day,problemId:candidate._id}},{upsert:true,new:true}).lean(); }
    catch(error) { if(error.code !== 11000) throw error; challenge = await Daily.findOne({day}).lean(); }
  }
  const [problem, challenges, submissions] = await Promise.all([Problem.findById(challenge.problemId).select('title difficulty tags').lean(),Daily.find({}).select('day problemId').lean(),Submission.find({userId:req.result._id,status:'accepted'}).select('problemId createdAt').lean()]);
  const accepted = new Set(submissions.map(s => `${dayKey(s.createdAt)}:${s.problemId}`));
  const days = challenges.filter(c=>accepted.has(`${c.day}:${c.problemId}`)).map(c=>c.day);
  res.json({day,problem,completed:days.includes(day),streak:streaks(days,day),endsAt:new Date(+dayStart(day)+86400000),serverNow:now});
}));
router.get('/roadmap', wrap(async(req,res)=>{
  const [problems, solved, progress] = await Promise.all([Problem.find({}).select('title tags difficulty').lean(),Submission.distinct('problemId',{userId:req.result._id,status:'accepted'}),Progress.findOne({userId:req.result._id}).lean()]);
  const ids = new Set(solved.map(String));
  res.json(units.map(({match,...unit})=>({...unit,read:Boolean(progress?.readUnits.includes(unit.id)),problems:unitProblems(units.find(u=>u.id===unit.id),problems).map(p=>({...p,solved:ids.has(String(p._id))}))})));
}));
router.put('/roadmap/:unit', wrap(async(req,res)=>{
  if(!units.some(u=>u.id===req.params.unit) || typeof req.body?.read !== 'boolean') return res.status(400).json({message:'Choose a valid roadmap topic and read state.'});
  await Progress.updateOne({userId:req.result._id},req.body.read ? {$addToSet:{readUnits:req.params.unit}} : {$pull:{readUnits:req.params.unit}},{upsert:true});
  res.json({read:req.body.read});
}));
router.get('/revision',wrap(async(req,res)=>res.json(await Revision.find({userId:req.result._id}).sort({dueAt:1}).populate('problemId','title difficulty').lean())));
router.get('/revision/:id',wrap(async(req,res)=>{
  if(!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({message:'Invalid problem ID.'});
  res.json(await Revision.findOne({userId:req.result._id,problemId:req.params.id}).lean());
}));
router.put('/revision/:id',wrap(async(req,res)=>{
  const {notes='',status='revisit',days=7}=req.body||{};
  if(!mongoose.isValidObjectId(req.params.id)||typeof notes!=='string'||notes.length>8000||!['learning','revisit','mastered'].includes(status)||!Number.isInteger(days)||days<0||days>365) return res.status(400).json({message:'Use notes under 8000 characters, a valid status, and a review interval of 0–365 days.'});
  if(!await Problem.exists({_id:req.params.id})) return res.status(404).json({message:'Problem not found.'});
  const doc=await Revision.findOneAndUpdate({userId:req.result._id,problemId:req.params.id},{$set:{notes,status,dueAt:new Date(Date.now()+days*86400000)}},{upsert:true,new:true,runValidators:true});
  res.json(doc);
}));
router.delete('/revision/:id',wrap(async(req,res)=>{
  if(!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({message:'Invalid problem ID.'});
  await Revision.deleteOne({userId:req.result._id,problemId:req.params.id});res.json({removed:true});
}));
module.exports=router;
