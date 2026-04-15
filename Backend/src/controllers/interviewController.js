const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
apiKey: process.env.GEMINI_KEY
});


/* ===============================
   AI QUESTION GENERATOR
================================ */

const generateInterview = async (req,res)=>{

try{

const { role, difficulty } = req.body;

const prompt = `
You are an AI technical interviewer.

Generate 5 ${difficulty} level interview questions for the role: ${role}

Return ONLY valid JSON like this:

{
"questions":[
"question1",
"question2",
"question3",
"question4",
"question5"
]
}
`;

const response = await ai.models.generateContent({
model:"gemini-2.5-flash",
contents: prompt
});

/* Gemini response text */

let text = response.text;

/* remove markdown code blocks */

text = text
.replace(/```json/g,"")
.replace(/```/g,"")
.trim();

/* parse JSON safely */

const parsed = JSON.parse(text);

res.json({
questions: parsed.questions
});

}catch(err){

console.error("Question generation error:",err);

res.status(500).json({
message:"Failed to generate interview questions"
});

}

};


/* ===============================
   AI ANSWER EVALUATION
================================ */

const evaluateAnswer = async (req,res)=>{

try{

const { question, answer } = req.body;

const prompt = `
You are an AI interviewer.

Evaluate the following interview answer.

Question:
${question}

Candidate Answer:
${answer}

Provide JSON format:

{
"technical": number,
"communication": number,
"confidence": number,
"feedback": "short feedback"
}
`;

const response = await ai.models.generateContent({
model:"gemini-2.5-flash",
contents: prompt
});

let text = response.text;

text = text
.replace(/```json/g,"")
.replace(/```/g,"")
.trim();

const parsed = JSON.parse(text);

res.json(parsed);

}catch(err){

console.error("Evaluation error:",err);

res.status(500).json({
message:"Answer evaluation failed"
});

}

};


/* ===============================
   AI FINAL INTERVIEW REPORT
================================ */

const generateInterviewReport = async (req,res)=>{

try{

const { answers } = req.body;

const prompt = `
You are an AI interview evaluator.

Analyze these candidate answers:

${JSON.stringify(answers)}

Return JSON:

{
"technical": number,
"communication": number,
"confidence": number,
"overall": number,
"tips":"improvement tips"
}
`;

const response = await ai.models.generateContent({
model:"gemini-2.5-flash",
contents: prompt
});

let text = response.text;

text = text
.replace(/```json/g,"")
.replace(/```/g,"")
.trim();

const parsed = JSON.parse(text);

res.json(parsed);

}catch(err){

console.error("Report error:",err);

res.status(500).json({
message:"Report generation failed"
});

}

};
//
const generateFollowup = async (req,res)=>{

 try{

 const { question, answer } = req.body;

 const prompt = `
You are a technical interviewer.

Question:
${question}

Candidate Answer:
${answer}

Generate ONE follow-up question to test deeper understanding.
`;

 const response = await ai.models.generateContent({
 model:"gemini-2.5-flash",
 contents:prompt
 });

 res.json({
 followup: response.text
 });

 }catch(err){

 res.status(500).json({
 message:"Followup generation failed"
 });

 }

};



module.exports = {
generateInterview,
evaluateAnswer,
generateInterviewReport,
generateFollowup
};