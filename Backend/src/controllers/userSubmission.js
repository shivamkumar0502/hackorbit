const Problem = require('../models/problem');
const Submission = require('../models/submission');
const User = require('../models/user');
const { getLanguageById, submitBatch, submitToken } = require('../utils/problemUtility');
const {buildSource} = require('../utils/functionDriver');
const {Revision}=require('../models/growth');

function summarize(results) {
  let status = 'accepted';
  let errorMessage = '';
  for (const test of results) {
    if (test.status_id !== 3) {
      if (test.status_id !== 4) status = 'error';
      else if (status === 'accepted') status = 'wrong';
      errorMessage ||= test.compile_output || test.stderr || test.status?.description || 'Test failed';
    }
  }
  return { status, errorMessage, passedTestCases: results.filter(test => test.status_id === 3).length,
    runtime: results.reduce((sum, test) => sum + (Number(test.time) || 0), 0),
    memory: Math.max(0, ...results.map(test => Number(test.memory) || 0)) };
}
const execute = mode => async (req, res) => {
  let submission;
  try {
    const { code, language } = req.body;
    const languageId = getLanguageById(language);
    if (typeof code !== 'string' || !code.trim() || code.length > 50000 || !languageId) return res.status(400).json({ message: 'Provide code and a supported programming language.' });
    const problem = await Problem.findById(req.params.id);
    if (!problem) return res.status(404).json({ message: 'Problem not found.' });
    const cases = mode === 'submit' ? [...problem.visibleTestCases, ...problem.hiddenTestCases] : problem.visibleTestCases;
    if (!cases?.length) return res.status(422).json({ message: 'This problem has no configured testcases.' });
    if (mode === 'submit') submission = await Submission.create({ userId: req.result._id, problemId: problem._id, code,
      language: language === 'cpp' ? 'c++' : language, status: 'pending', testCasesTotal: cases.length });
    const source = buildSource(problem, code, language);
    const batch = await submitBatch(cases.map(test => ({ source_code: source, language_id: languageId, stdin: test.input, expected_output: test.output })));
    const results = await submitToken(batch.map(item => item.token));
    const summary = summarize(results);
    if (submission) {
      Object.assign(submission, summary, { testCasesPassed: summary.passedTestCases });
      await submission.save();
      if(summary.status==='wrong') {
        try {await Revision.updateOne({userId:req.result._id,problemId:problem._id},{$set:{status:'revisit',reviewStep:0,dueAt:new Date(Date.now()+86400000)},$setOnInsert:{notes:'',source:'incorrect-submission'}},{upsert:true});} catch {console.error('Revision scheduling failed; submission result was preserved.');}
      }
      if (summary.status === 'accepted') await User.updateOne({ _id: req.result._id }, { $addToSet: { problemSolved: problem._id } });
    }
    return res.status(200).json({ ...summary, accepted: summary.status === 'accepted', success: summary.status === 'accepted',
      totalTestCases: cases.length, ...(mode === 'run' ? { testCases: results } : {}) });
  } catch (error) {
    const message = error.statusCode ? error.message : 'Unable to execute code. Please retry.';
    if (submission) { submission.status = 'error'; submission.errorMessage = message; await submission.save().catch(() => {}); }
    return res.status(error.statusCode || (error.name === 'CastError' ? 400 : 500)).json({ message });
  }
};
module.exports = { submitCode: execute('submit'), runCode: execute('run'), summarize };

module.exports.customRun=async(req,res)=>{
 const {code,language,stdin,expected}=req.body||{},languageId=getLanguageById(language);
 if(typeof code!=='string'||!code.trim()||code.length>50000||!languageId||typeof stdin!=='string'||stdin.length>20000||expected!==undefined&&(typeof expected!=='string'||expected.length>20000))return res.status(400).json({message:'Use supported code under 50000 characters and custom input/output under 20000 characters.'});
 const release=require('../utils/executionGate')(req.result._id);if(!release)return res.status(429).json({message:'One execution at a time; maximum 12 custom/compiler runs per minute.'});
 try{
 const problem=await Problem.findById(req.params.id);if(!problem)return res.status(404).json({message:'Problem not found.'});
 const batch=await submitBatch([{source_code:buildSource(problem,code,language),language_id:languageId,stdin,cpu_time_limit:2,wall_time_limit:5,memory_limit:128000,enable_network:false}]);
 const [r]=await submitToken(batch.map(b=>b.token));const normalize=s=>s.trim().replace(/\s+/g,' ');
 res.json({status:r.status?.description,statusId:r.status_id,stdout:r.stdout||'',stderr:r.stderr||r.compile_output||'',runtime:r.time,memory:r.memory,matchesExpected:expected===undefined?null:r.status_id===3&&normalize(r.stdout||'')===normalize(expected),savedSubmission:false});
 }catch(e){res.status(e.statusCode||(e.name==='CastError'?400:500)).json({message:e.statusCode?e.message:'Unable to execute this input.'});}finally{release();}
};
