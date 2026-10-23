const router=require('express').Router();
const mongoose=require('mongoose');
const Problem=require('../models/problem');
const Submission=require('../models/submission');
const {practicePlan,sheets}=require('../utils/practiceGrowth');
const {submitBatch,submitToken}=require('../utils/problemUtility');
const schema=new mongoose.Schema({problemId:{type:mongoose.Schema.Types.ObjectId,ref:'problem',required:true},author:{type:mongoose.Schema.Types.ObjectId,ref:'user',required:true},authorName:String,parent:{type:mongoose.Schema.Types.ObjectId,default:null},body:{type:String,maxlength:3000},spoiler:{type:Boolean,default:false},removed:{type:Boolean,default:false}},{timestamps:true});
schema.index({problemId:1,parent:1,_id:-1});
const Discussion=mongoose.models.problemDiscussion||mongoose.model('problemDiscussion',schema);
router.use(require('../middleware/userMiddleware'));
const wrap=fn=>async(req,res)=>{try{await fn(req,res);}catch(e){res.status(e.statusCode||500).json({message:e.statusCode?e.message:'Request failed. Please retry.'});}};
const fail=(message,statusCode=400)=>{throw Object.assign(new Error(message),{statusCode});};
const id=value=>mongoose.isValidObjectId(value);
const executionGate=require('../utils/executionGate');
router.post('/compiler/run',wrap(async(req,res)=>{
 const {code,language,stdin=''}=req.body||{},lang={javascript:63,cpp:54,java:62,python:71}[language];
 if(!lang||typeof code!=='string'||!code.trim()||code.length>50000||typeof stdin!=='string'||stdin.length>20000)fail('Choose a supported language; code must be 1–50000 characters and input at most 20000 characters.');
 const release=executionGate(req.result._id);if(!release)fail('One run at a time; maximum 12 compiler runs per minute. Please retry shortly.',429);
 try{const batch=await submitBatch([{source_code:code,language_id:lang,stdin,cpu_time_limit:2,wall_time_limit:5,memory_limit:128000,enable_network:false}]);const [result]=await submitToken(batch.map(s=>s.token));res.json({stdout:result.stdout||'',stderr:result.stderr||'',compileOutput:result.compile_output||'',status:result.status?.description||'Finished',statusId:result.status_id,runtime:result.time,memory:result.memory});}finally{release();}
}));
router.get('/plan',wrap(async(req,res)=>{
 const [p,s]=await Promise.all([Problem.find({}).select('title tags difficulty').lean(),Submission.find({userId:req.result._id,status:{$in:['accepted','wrong']}}).select('problemId status').lean()]);res.json(practicePlan(p,s));
}));
router.get('/sheets',wrap(async(req,res)=>{
 const [p,ids]=await Promise.all([Problem.find({}).select('title tags difficulty').lean(),Submission.distinct('problemId',{userId:req.result._id,status:'accepted'})]);const solved=new Set(ids.map(String));
 res.json({disclaimer:'Original curated preparation sheets, not verified past company questions or company endorsements.',sheets:sheets.map(s=>({...s,problems:p.filter(p=>s.topics.includes(p.tags)).sort((a,b)=>({easy:0,medium:1,hard:2}[a.difficulty]-{easy:0,medium:1,hard:2}[b.difficulty])||a.title.localeCompare(b.title)).slice(0,15).map(p=>({...p,solved:solved.has(String(p._id))}))}))});
}));
router.get('/hints/:id',wrap(async(req,res)=>{
 if(!id(req.params.id))fail('Invalid problem ID.');const p=await Problem.findById(req.params.id).select('hints tags title seedKey').lean();if(!p)fail('Problem not found.',404);
 const authored=p.hints?.length?p.hints:require('../data/coreHints')[p.seedKey];
 res.json({hints:authored||['Trace the given examples and identify the exact condition the answer must satisfy.','Write a correct baseline first, then identify repeated work you could avoid.'],tailored:Boolean(authored)});
}));
router.get('/discussion/:id',wrap(async(req,res)=>{
 if(!id(req.params.id)||req.query.parent&&!id(req.query.parent)||req.query.before&&!id(req.query.before))fail('Invalid discussion page.');
 if(!await Problem.exists({_id:req.params.id}))fail('Problem not found.',404);
 const rows=await Discussion.find({problemId:req.params.id,parent:req.query.parent||null,...(req.query.before?{_id:{$lt:req.query.before}}:{})}).sort({_id:-1}).limit(21).lean();
 const items=rows.slice(0,20).map(p=>({...p,body:p.removed?'[Post removed]':p.body,canEdit:!p.removed&&String(p.author)===String(req.result._id),author:undefined}));res.json({items,next:rows.length>20?String(items.at(-1)._id):null});
}));
router.post('/discussion/:id',wrap(async(req,res)=>{
 const {body,spoiler=false,parent=null}=req.body||{};
 if(!id(req.params.id)||typeof body!=='string'||!body.trim()||body.length>3000||typeof spoiler!=='boolean'||parent&&!id(parent))fail('Write 1–3000 characters and choose a valid thread.');
 if(!await Problem.exists({_id:req.params.id}))fail('Problem not found.',404);
 if(parent&&!await Discussion.exists({_id:parent,problemId:req.params.id,parent:null}))fail('Reply to a top-level thread in this problem.');
 if(await Discussion.countDocuments({author:req.result._id,createdAt:{$gt:new Date(Date.now()-60000)}})>=6)fail('Please wait: at most six discussion messages per minute.',429);
 await Discussion.create({problemId:req.params.id,author:req.result._id,authorName:req.result.firstName,parent,body:body.trim(),spoiler});res.status(201).json({saved:true});
}));
router.patch('/discussion/:id',wrap(async(req,res)=>{
 const {body,spoiler}=req.body||{};if(!id(req.params.id)||typeof body!=='string'||!body.trim()||body.length>3000||typeof spoiler!=='boolean')fail('Write 1–3000 characters.');
 const doc=await Discussion.findOneAndUpdate({_id:req.params.id,author:req.result._id,removed:false},{$set:{body:body.trim(),spoiler}},{new:true});if(!doc)fail('Post not found or not yours.',404);res.json({saved:true});
}));
router.delete('/discussion/:id',wrap(async(req,res)=>{
 if(!id(req.params.id))fail('Invalid post ID.');const p=await Discussion.findOneAndUpdate({_id:req.params.id,author:req.result._id},{$set:{removed:true,body:''}});if(!p)fail('Post not found or not yours.',404);res.json({removed:true});
}));
module.exports=router;
module.exports.executionGate=executionGate;
