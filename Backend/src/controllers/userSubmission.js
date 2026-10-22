const Problem = require('../models/problem');
const Submission = require('../models/submission');
const User = require('../models/user');
const { getLanguageById, submitBatch, submitToken } = require('../utils/problemUtility');

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
    if (typeof code !== 'string' || !code.trim() || !languageId) return res.status(400).json({ message: 'Provide code and a supported programming language.' });
    const problem = await Problem.findById(req.params.id);
    if (!problem) return res.status(404).json({ message: 'Problem not found.' });
    const cases = mode === 'submit' ? problem.hiddenTestCases : problem.visibleTestCases;
    if (!cases?.length) return res.status(422).json({ message: 'This problem has no configured testcases.' });
    if (mode === 'submit') submission = await Submission.create({ userId: req.result._id, problemId: problem._id, code,
      language: language === 'cpp' ? 'c++' : language, status: 'pending', testCasesTotal: cases.length });
    const batch = await submitBatch(cases.map(test => ({ source_code: code, language_id: languageId, stdin: test.input, expected_output: test.output })));
    const results = await submitToken(batch.map(item => item.token));
    const summary = summarize(results);
    if (submission) {
      Object.assign(submission, summary, { testCasesPassed: summary.passedTestCases });
      await submission.save();
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
