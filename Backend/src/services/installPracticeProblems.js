const Problem=require('../models/problem');
const User=require('../models/user');
const batches=[['core-problems-v1',require('../data/practiceProblems')],['expanded-problems-v2',require('../data/expandedProblems')]];
const mongoose=require('mongoose');
const Migration=mongoose.models.platformMigration||mongoose.model('platformMigration',new mongoose.Schema({_id:String,completedAt:Date}));
async function installPracticeProblems({force=false}={}){
 const pending=[];for(const batch of batches)if(force||!await Migration.exists({_id:batch[0]}))pending.push(batch);
 const seedKeys=batches.flatMap(([,p])=>p.map(p=>p.seedKey));
 const upgrade='expanded-function-solutions-v3';
 const needsUpgrade=!await Migration.exists({_id:upgrade});
 if(!pending.length&&!needsUpgrade)return {added:0,total:await Problem.countDocuments({seedKey:{$in:seedKeys}})};
 const admin=await User.findOne({role:'admin'}).select('_id').lean();if(!admin)return {added:0,total:0,skipped:'No administrator exists.'};
 await Problem.init();let added=0;
 for(const [migration,problems]of pending){for(const problem of problems){const result=await Problem.updateOne({seedKey:problem.seedKey},{$setOnInsert:{...problem,problemCreator:admin._id}},{upsert:true,runValidators:true});added+=result.upsertedCount||0;}await Migration.updateOne({_id:migration},{$set:{completedAt:new Date()}},{upsert:true});}
 if(needsUpgrade) {
  for(const problem of batches[1][1]) {
   const {startCode,referenceSolution,functionMode,driverCode,codeVersion,methodName,functionSignature,functionReturn,solutionSteps}=problem;
   await Problem.updateOne({seedKey:problem.seedKey},{$set:{startCode,referenceSolution,functionMode,driverCode,codeVersion,methodName,functionSignature,functionReturn,solutionSteps}},{runValidators:true});
  }
  console.log('Practice function templates and three-language solutions upgraded: 50 definitions.');
  await Migration.updateOne({_id:upgrade},{$set:{completedAt:new Date()}},{upsert:true});
 }
 return {added,total:await Problem.countDocuments({seedKey:{$in:seedKeys}})};
}
module.exports=installPracticeProblems;
