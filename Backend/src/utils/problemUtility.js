const axios = require('axios');
const { setTimeout: delay } = require('node:timers/promises');
const getLanguageById = language => ({ 'c++': 54, cpp: 54, java: 62, javascript: 63 })[language?.toLowerCase()];
const statusId = result => Number(result.status_id ?? result.status?.id);
function providerError(error) {
  const status = error.response?.status;
  const message = status === 401 || status === 403
    ? 'Code execution provider rejected its API key. Check JUDGE0_KEY and the RapidAPI subscription.'
    : status === 429 ? 'Code execution quota reached. Please try again later.'
    : error.code === 'ECONNABORTED' ? 'Code execution provider timed out. Please retry.'
    : 'Code execution service is unavailable. Please retry.';
  return Object.assign(new Error(message), { statusCode: status === 429 ? 429 : 503 });
}
async function request(method, params, data) {
  if (!process.env.JUDGE0_KEY) throw Object.assign(new Error('Code execution is not configured. Set JUDGE0_KEY.'), { statusCode: 503 });
  try {
    return (await axios.request({ method, url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
      params: { base64_encoded: 'false', ...params }, data, timeout: 12000,
      headers: { 'x-rapidapi-key': process.env.JUDGE0_KEY, 'x-rapidapi-host': 'judge0-ce.p.rapidapi.com', 'Content-Type': 'application/json' },
    })).data;
  } catch (error) { throw providerError(error); }
}
async function submitBatch(submissions) {
  const result = await request('POST', {}, { submissions });
  if (!Array.isArray(result) || result.length !== submissions.length || result.some(item => !item.token)) {
    throw Object.assign(new Error('Execution provider rejected the submission batch.'), { statusCode: 503 });
  }
  return result;
}
async function submitToken(tokens) {
  const deadline = Date.now() + 45000;
  while (Date.now() < deadline) {
    const result = await request('GET', { tokens: tokens.join(','), fields: 'token,status,stdout,stderr,compile_output,time,memory' });
    if (!Array.isArray(result?.submissions) || result.submissions.length !== tokens.length) {
      throw Object.assign(new Error('Execution provider returned an incomplete result.'), { statusCode: 503 });
    }
    const results = result.submissions.map(item => ({ ...item, status_id: statusId(item) }));
    if (results.every(item => item.status_id > 2)) return results;
    await delay(1000);
  }
  throw Object.assign(new Error('Code execution timed out. Please retry.'), { statusCode: 504 });
}
module.exports = { getLanguageById, submitBatch, submitToken, statusId };
