import { useState,useEffect } from "react";
import CameraStream from "../components/CameraStream";
import { speakQuestion } from "../utils/speak";
import axiosClient from "../utils/axiosClient";
import { useNavigate } from "react-router-dom";

function LiveInterview(){

const navigate = useNavigate();

/* =========================/
AI Generated Questions State
========================= */

const [questions,setQuestions] = useState([]);

/* =========================
Interview States
========================= */

const [currentQuestion,setCurrentQuestion] = useState(0);
const [answer,setAnswer] = useState("");
const [listening,setListening] = useState(false);
const [feedback,setFeedback] = useState("");
const [timeLeft,setTimeLeft] = useState(120);
const [answers,setAnswers] = useState([]);

/* =========================
Fetch AI Questions
========================= */

useEffect(()=>{

const fetchQuestions = async ()=>{

try{

const res = await axiosClient.post("/interview/generate",{

role:"Frontend Developer",
difficulty:"medium"

});

setQuestions(res.data.questions);
// const data = res.data.questions;

if(typeof data === "string"){

const cleaned = data
.replace(/```json/g,"")
.replace(/```/g,"")
.replace("{","")
.replace("}","")
.trim();

const parsed = JSON.parse(cleaned);

setQuestions(parsed.questions);

}else{

setQuestions(data);

}


}catch(err){

console.error("Question generation failed:",err);

}

};

fetchQuestions();

},[]);

/* =========================
Speech Recognition
========================= */

const SpeechRecognition =
window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();

recognition.continuous = true;

recognition.onresult = (event)=>{

let transcript = "";

for(let i=event.resultIndex;i<event.results.length;i++){

transcript += event.results[i][0].transcript;

}

setAnswer(transcript);

};

/* =========================
AI Speak Question
========================= */

useEffect(()=>{

if(questions.length > 0){

speakQuestion(questions[currentQuestion]);

}

},[currentQuestion,questions]);

/* =========================
Timer
========================= */

useEffect(()=>{

const timer = setInterval(()=>{

setTimeLeft((prev)=>{

if(prev === 0){

handleNextQuestion();

return 120;

}

return prev-1;

});

},1000);

return ()=> clearInterval(timer);

},[currentQuestion]);

/* =========================
Speech Controls
========================= */

const startListening = ()=>{

setListening(true);
recognition.start();

};

const stopListening = ()=>{

setListening(false);
recognition.stop();

};

/* =========================
Next Question
========================= */

const handleNextQuestion = ()=>{

stopListening();

const updatedAnswers = [...answers];

updatedAnswers[currentQuestion] = answer;

setAnswers(updatedAnswers);

if(currentQuestion < questions.length-1){

setCurrentQuestion(currentQuestion+1);
setAnswer("");
setFeedback("");
setTimeLeft(120);

}else{

finishInterview(updatedAnswers);

}

};

/* =========================
Previous Question
========================= */

const prevQuestion = ()=>{

if(currentQuestion > 0){

setCurrentQuestion(currentQuestion-1);

}

};

/* =========================
Evaluate Answer
========================= */

const submitAnswer = async ()=>{

try{

const res = await axiosClient.post("/interview/evaluate",{

question: questions[currentQuestion],
answer: answer

});

setFeedback(res.data.evaluation);

}catch(err){

console.error("Evaluation error:",err);

}

};

/* =========================
Finish Interview
========================= */

const finishInterview = async (finalAnswers)=>{

try{

const res = await axiosClient.post("/interview/report",{

answers: finalAnswers

});

navigate("/interview-result",{

state:{
report:res.data.report
}

});

}catch(err){

console.error("Report error:",err);

}

};

/* =========================
End Interview
========================= */

const endInterview = ()=>{

finishInterview(answers);

};

/* =========================
Loading State
========================= */

if(questions.length === 0){

return(

<div className="min-h-screen flex items-center justify-center bg-[#0f1115] text-white">

<p>AI is generating interview questions...</p>

</div>

)

}

/* =========================
UI
========================= */

return(

<div className="min-h-screen bg-[#0f1115] text-white p-8">

<h1 className="text-3xl mb-6">
AI Live Interview
</h1>

<div className="grid grid-cols-2 gap-6">

<CameraStream/>

<div className="bg-[#1a1d23] p-6 rounded-xl">

<p className="text-gray-400 mb-2">

Question {currentQuestion+1} / {questions.length}

</p>

<p className="text-red-400 mb-3">

Time Left: {timeLeft}s

</p>

<h3 className="mb-4">

{questions[currentQuestion]}

</h3>

<button
className="btn btn-primary mt-2"
onClick={startListening}
>

Start Speaking

</button>

<button
className="btn btn-error ml-2"
onClick={stopListening}
>

Stop

</button>

<textarea
className="textarea textarea-bordered w-full mt-4"
value={answer}
placeholder="Your answer will appear here..."
readOnly
/>

<div className="flex gap-3 mt-4">

<button
className="btn btn-outline"
onClick={prevQuestion}
>

Previous

</button>

<button
className="btn btn-success"
onClick={handleNextQuestion}
>

Next Question

</button>

</div>

<button
className="btn btn-primary mt-4 w-full"
onClick={submitAnswer}
>

Submit Answer

</button>

{feedback && (

<div className="mt-4 bg-[#111217] p-4 rounded">

<h4 className="font-semibold mb-2">
AI Feedback
</h4>

<p className="text-gray-300">
{feedback}
</p>

</div>

)}

<button
className="btn btn-error mt-4 w-full"
onClick={endInterview}
>

End Interview

</button>

</div>

</div>

</div>

)

}

export default LiveInterview;

// import { useNavigate } from "react-router-dom";

// function InterviewPage(){

// const navigate = useNavigate();

// return(

// <div className="min-h-screen bg-gradient-to-b from-[#05070d] to-[#0b0d12] text-white">

// {/* HERO SECTION */}

// <div className="max-w-7xl mx-auto px-8 pt-20 pb-16">

// <div className="grid md:grid-cols-2 gap-10 items-center">

// <div>

// <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">

// AI Mock Interviews 🚀

// </h1>

// <p className="text-gray-400 text-lg max-w-xl">

// Practice real AI powered interviews with voice, camera and instant
// feedback. Improve your technical skills and get hired faster.

// </p>

// <button
// onClick={()=>navigate("/create-interview")}
// className="mt-8 px-8 py-3 bg-gradient-to-r from-purple-600 via-blue-500 to-indigo-500 rounded-xl font-semibold hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30 transition"

// >

// Start New Interview

// </button>

// </div>

// <div className="hidden md:block">

// <div className="bg-[#121620] p-8 rounded-2xl border border-[#1e2330] shadow-xl">

// <h3 className="text-xl font-semibold mb-3">

// 🤖 AI Interviewer

// </h3>

// <p className="text-gray-400 mb-4">

// AI asks questions, listens to answers and evaluates your performance.

// </p>

// <div className="flex gap-4">

// <div className="bg-[#1a1f2b] px-4 py-2 rounded-lg text-sm">
// Voice Analysis
// </div>

// <div className="bg-[#1a1f2b] px-4 py-2 rounded-lg text-sm">
// Confidence Score
// </div>

// <div className="bg-[#1a1f2b] px-4 py-2 rounded-lg text-sm">
// AI Feedback
// </div>

// </div>

// </div>

// </div>

// </div>

// </div>

// {/* FEATURES */}

// <div className="max-w-7xl mx-auto px-8 mt-12 grid md:grid-cols-3 gap-8">

// <div className="bg-[#151821] p-7 rounded-2xl border border-[#1e2330] hover:bg-[#1c2029] hover:scale-[1.02] transition shadow-lg">

// <h3 className="text-xl font-semibold mb-3">

// 🎤 Voice Interview

// </h3>

// <p className="text-gray-400">

// Answer interview questions using your voice. AI listens and analyzes your response.

// </p>

// </div>

// <div className="bg-[#151821] p-7 rounded-2xl border border-[#1e2330] hover:bg-[#1c2029] hover:scale-[1.02] transition shadow-lg">

// <h3 className="text-xl font-semibold mb-3">

// 📷 Camera Analysis

// </h3>

// <p className="text-gray-400">

// AI analyzes your confidence, eye contact and body language.

// </p>

// </div>

// <div className="bg-[#151821] p-7 rounded-2xl border border-[#1e2330] hover:bg-[#1c2029] hover:scale-[1.02] transition shadow-lg">

// <h3 className="text-xl font-semibold mb-3">

// 🤖 AI Feedback

// </h3>

// <p className="text-gray-400">

// Get instant feedback on your answers with improvement tips.

// </p>

// </div>

// </div>

// {/* INTERVIEW LIST */}

// <div className="max-w-7xl mx-auto px-8 mt-24">

// <h2 className="text-2xl font-semibold mb-8">

// Recent Interviews

// </h2>

// <div className="grid md:grid-cols-3 gap-8">

// <div className="bg-[#151821] p-6 rounded-xl border border-[#1e2330] hover:bg-[#1c2029] transition">

// <h3 className="text-lg font-semibold">

// Frontend Developer

// </h3>

// <p className="text-gray-400 mt-2">

// Difficulty: Medium

// </p>

// <button className="mt-4 text-purple-400 hover:text-purple-300">

// View Report →

// </button>

// </div>

// <div className="bg-[#151821] p-6 rounded-xl border border-[#1e2330] hover:bg-[#1c2029] transition">

// <h3 className="text-lg font-semibold">

// Backend Developer

// </h3>

// <p className="text-gray-400 mt-2">

// Difficulty: Hard

// </p>

// <button className="mt-4 text-purple-400 hover:text-purple-300">

// View Report →

// </button>

// </div>

// <div className="bg-[#151821] p-6 rounded-xl border border-[#1e2330] hover:bg-[#1c2029] transition">

// <h3 className="text-lg font-semibold">

// React Developer

// </h3>

// <p className="text-gray-400 mt-2">

// Difficulty: Easy

// </p>

// <button className="mt-4 text-purple-400 hover:text-purple-300">

// View Report →

// </button>

// </div>

// </div>

// </div>

// {/* FOOTER */}

// <div className="text-center text-gray-500 mt-28 pb-10 border-t border-[#1e2330] pt-8">

// © 2026 DSATrek AI Interviews

// </div>

// </div>

// )

// }

// export default InterviewPage;

