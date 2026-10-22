const Problem=require('../models/problem');
const User=require('../models/user');
const problems=require('../data/practiceProblems');
const mongoose=require('mongoose');
const Migration=mongoose.models.platformMigration||mongoose.model('platformMigration',new mongoose.Schema({_id:String,completedAt:Date}));
async function installPracticeProblems({force=false}={}){
 if(!force&&await Migration.exists({_id:'core-problems-v1'}))return {added:0,total:await Problem.countDocuments({seedKey:{$in:problems.map(p=>p.seedKey)}})};
 const admin=await User.findOne({role:'admin'}).select('_id').lean();
 if(!admin)return {added:0,total:0,skipped:'No administrator exists.'};
 await Problem.init();
 let added=0;
 for(const problem of problems){const result=await Problem.updateOne({seedKey:problem.seedKey},{$setOnInsert:{...problem,problemCreator:admin._id}},{upsert:true,runValidators:true});added+=result.upsertedCount||0;}
 await Migration.updateOne({_id:'core-problems-v1'},{$set:{completedAt:new Date()}},{upsert:true});
 return {added,total:await Problem.countDocuments({seedKey:{$in:problems.map(p=>p.seedKey)}})};
}
module.exports=installPracticeProblems;
