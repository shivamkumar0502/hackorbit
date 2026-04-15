
import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import Editor from '@monaco-editor/react';
import { useParams } from 'react-router';
import axiosClient from "../utils/axiosClient"
import SubmissionHistory from "../components/SubmissionHistory"
import ChatAi from '../components/ChatAi';
import Editorial from '../components/Editorial';

import confetti from "canvas-confetti";
import fireSound from "../assets/firecracker.mp3";


import {
FileText,
BookOpen,
Lightbulb,
History,
Bot,
Code2,
FlaskConical,
CheckCircle,
Send
} from "lucide-react";

const langMap = {
cpp: 'C++',
java: 'Java',
javascript: 'JavaScript'
};

const ProblemPage = () => {

const [problem, setProblem] = useState(null);
const [selectedLanguage, setSelectedLanguage] = useState('javascript');
const [code, setCode] = useState('');
const [loading, setLoading] = useState(false);
const [runResult, setRunResult] = useState(null);
const [submitResult, setSubmitResult] = useState(null);

const [activeLeftTab, setActiveLeftTab] = useState('description');
const [activeRightTab, setActiveRightTab] = useState('code');

const [theme,setTheme] = useState("dark");
const [showChampion,setShowChampion] = useState(false);

/* MAXIMIZE STATE */
const [isMaximized,setIsMaximized] = useState(false);

/* RESIZE STATES */
const [leftWidth,setLeftWidth] = useState(50);
const [isResizing,setIsResizing] = useState(false);

const editorRef = useRef(null);

let {problemId}  = useParams();
const { handleSubmit } = useForm();

useEffect(()=>{
document.documentElement.setAttribute("data-theme",theme)
},[theme])

/* RESIZE LOGIC */

useEffect(()=>{

const handleMouseMove = (e)=>{

  if(!isResizing) return;

  const newWidth = (e.clientX / window.innerWidth) * 100;

  if(newWidth > 20 && newWidth < 80){
    setLeftWidth(newWidth);
  }

};

const handleMouseUp = ()=>{
  setIsResizing(false);
};

window.addEventListener("mousemove",handleMouseMove);
window.addEventListener("mouseup",handleMouseUp);

return ()=>{
  window.removeEventListener("mousemove",handleMouseMove);
  window.removeEventListener("mouseup",handleMouseUp);
};

},[isResizing])

const fireCrackerCelebration = () => {

const audio = new Audio(fireSound);
audio.play().catch(()=>{});

const duration = 5000;
const end = Date.now() + duration;

(function frame(){

  confetti({
    particleCount:6,
    angle:60,
    spread:70,
    origin:{x:0}
  });

  confetti({
    particleCount:6,
    angle:120,
    spread:70,
    origin:{x:1}
  });

  if(Date.now() < end){
    requestAnimationFrame(frame);
  }

})();

};

useEffect(() => {

const fetchProblem = async () => {

  setLoading(true);

  try {

    const response = await axiosClient.get(`/problem/problemById/${problemId}`);

    const initialCode = response.data.startCode.find(
      sc => sc.language === langMap[selectedLanguage]
    ).initialCode;

    setProblem(response.data);
    setCode(initialCode);

  } catch (error) {

    console.error('Error fetching problem:', error);

  }

  setLoading(false);

};

fetchProblem();

}, [problemId]);

useEffect(() => {

if (problem) {

  const initialCode = problem.startCode.find(
    sc => sc.language === langMap[selectedLanguage]
  ).initialCode;

  setCode(initialCode);

}

}, [selectedLanguage, problem]);

useEffect(()=>{

const handleShortcut = (e)=>{

  if(e.ctrlKey && e.key === "Enter"){
    handleRun()
  }

}

window.addEventListener("keydown",handleShortcut)

return ()=>{
  window.removeEventListener("keydown",handleShortcut)
}

},[code])

const handleEditorChange = (value) => {
setCode(value || '');
};

const handleEditorDidMount = (editor) => {
editorRef.current = editor;
};

const handleLanguageChange = (language) => {
setSelectedLanguage(language);
};

const handleRun = async () => {

setLoading(true);
setRunResult(null);

try {

  const response = await axiosClient.post(`/submission/run/${problemId}`, {
    code,
    language: selectedLanguage
  });

  setRunResult(response.data);
  setActiveRightTab('testcase');

} catch (error) {

  console.error('Error running code:', error);

}

setLoading(false);

};

const handleSubmitCode = async () => {

setLoading(true);
setSubmitResult(null);

try {

  const response = await axiosClient.post(`/submission/submit/${problemId}`, {
    code: code,
    language: selectedLanguage
  });

  const result = response.data;

  setSubmitResult(result);

  const isAccepted =
    result.accepted === true ||
    result.status === "accepted" ||
    result.verdict === "Accepted";

  if(isAccepted){

    fireCrackerCelebration();

    setShowChampion(true);

    setTimeout(()=>{
      setShowChampion(false);
    },3000);

  }

  setActiveRightTab('result');

} catch (error) {

  console.error('Error submitting code:', error);

}

setLoading(false);

};

const getLanguageForMonaco = (lang) => {

switch (lang) {

  case 'javascript': return 'javascript';
  case 'java': return 'java';
  case 'cpp': return 'cpp';
  default: return 'javascript';

}

};

const getDifficultyColor = (difficulty) => {

switch (difficulty) {

  case 'easy': return 'text-green-500';
  case 'medium': return 'text-yellow-500';
  case 'hard': return 'text-red-500';
  default: return 'text-gray-500';

}

};

if (loading && !problem) {

return (
 
  <div className="flex justify-center items-center min-h-screen">
     
    <span className="loading loading-spinner loading-lg"></span>

  </div>

);

}

return (


<div className="h-screen flex bg-[#0f1115] text-white">
{/* LEFT PANEL */}

{!isMaximized && (

<div
style={{width:`${leftWidth}%`}}
className="flex flex-col border-r border-[#2a2d34] bg-[#111217]"

>

<div className="tabs tabs-bordered bg-base-200 px-4">

{/* <button className={`tab ${activeLeftTab === 'description' ? 'tab-active' : ''}`} onClick={() => setActiveLeftTab('description')}>Description</button>
<button className={`tab ${activeLeftTab === 'editorial' ? 'tab-active' : ''}`} onClick={() => setActiveLeftTab('editorial')}>Editorial</button>
<button className={`tab ${activeLeftTab === 'solutions' ? 'tab-active' : ''}`} onClick={() => setActiveLeftTab('solutions')}>Solutions</button>
<button className={`tab ${activeLeftTab === 'submissions' ? 'tab-active' : ''}`} onClick={() => setActiveLeftTab('submissions')}>Submissions</button>
<button className={`tab ${activeLeftTab === 'chatAI' ? 'tab-active' : ''}`} onClick={() => setActiveLeftTab('chatAI')}>ChatAI</button> */}

<button className={`tab flex items-center gap-2 ${activeLeftTab === 'description' ? 'tab-active' : ''}`} onClick={() => setActiveLeftTab('description')}>
<FileText size={16} color="#3b82f6"/> Description
</button>

<button className={`tab flex items-center gap-2 ${activeLeftTab === 'editorial' ? 'tab-active' : ''}`} onClick={() => setActiveLeftTab('editorial')}>
<BookOpen size={16} color="#8b5cf6"/> Editorial
</button>

<button className={`tab flex items-center gap-2 ${activeLeftTab === 'solutions' ? 'tab-active' : ''}`} onClick={() => setActiveLeftTab('solutions')}>
<Lightbulb size={16} color="#f59e0b"/> Solutions
</button>

<button className={`tab flex items-center gap-2 ${activeLeftTab === 'submissions' ? 'tab-active' : ''}`} onClick={() => setActiveLeftTab('submissions')}>
<History size={16} color="#22c55e"/> Submissions
</button>

<button className={`tab flex items-center gap-2 ${activeLeftTab === 'chatAI' ? 'tab-active' : ''}`} onClick={() => setActiveLeftTab('chatAI')}>
<Bot size={16} color="#ec4899"/> ChatAI
</button>

<button
className="btn btn-xs btn-outline ml-auto"
onClick={()=>setTheme(theme==="dark"?"light":"dark")}
>

{theme==="dark" ? "🌞 Light":"🌙 Dark"} </button>

</div>

<div className="flex-1 overflow-y-auto p-6">

{problem && (

<>
{activeLeftTab === 'description' && (

<div>

<div className="flex items-center gap-4 mb-6">

<h1 className="text-2xl font-bold">{problem.title}</h1>

<div className={`badge badge-outline ${getDifficultyColor(problem.difficulty)}`}>
{problem.difficulty}
</div>

<div className="badge badge-primary">{problem.tags}</div>

</div>

<div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
{problem.description}
</div>

<div className="mt-8">

<h3 className="text-lg font-semibold mb-4">Examples:</h3>

<div className="space-y-4">

{problem.visibleTestCases.map((example,index)=>(
<div key={index} className="bg-base-200 p-4 rounded-lg">

<h4 className="font-semibold mb-2">Example {index+1}</h4>

<p><b>Input:</b> {example.input}</p>

<p><b>Output:</b> {example.output}</p>

<p><b>Explanation:</b> {example.explanation}</p>

</div>
))}

</div>

</div>

</div>

)}

{activeLeftTab === 'editorial' && ( <Editorial secureUrl={problem.secureUrl} thumbnailUrl={problem.thumbnailUrl} duration={problem.duration}/>
)}

{activeLeftTab === 'solutions' && (

<div>

{problem.referenceSolution?.map((solution,index)=>(

<pre key={index} className="bg-base-300 p-4 rounded mb-4">
{solution.completeCode}
</pre>

))}

</div>

)}

{activeLeftTab === 'submissions' && ( <SubmissionHistory problemId={problemId}/>
)}

{activeLeftTab === 'chatAI' && ( <ChatAi problem={problem}/>
)}

</>

)}

</div>

</div>

)}

{/* DRAG DIVIDER */}

{!isMaximized && (

<div
className="w-1 bg-base-300 cursor-col-resize hover:bg-primary"
onMouseDown={()=>setIsResizing(true)}
></div>

)}

{/* RIGHT PANEL */}

<div
style={{width:isMaximized?"100%":`${100-leftWidth}%`}}
className={`${isMaximized ? "fixed inset-0 z-50 bg-base-100" : ""} flex flex-col`}
>

<div className="tabs tabs-bordered bg-base-200 px-6 pb-5">

{/* <button className={`tab ${activeRightTab === 'code' ? 'tab-active' : ''}`} onClick={() => setActiveRightTab('code')}>Code</button>
<button className={`tab ${activeRightTab === 'testcase' ? 'tab-active' : ''}`} onClick={() => setActiveRightTab('testcase')}>Testcase</button>
<button className={`tab ${activeRightTab === 'result' ? 'tab-active' : ''}`} onClick={() => setActiveRightTab('result')}>Result</button> */}

<button className={`tab flex items-center gap-2 ${activeRightTab === 'code' ? 'tab-active' : ''}`} onClick={() => setActiveRightTab('code')}>
<Code2 size={16} color="#60a5fa"/> Code
</button>

<button className={`tab flex items-center gap-2 ${activeRightTab === 'testcase' ? 'tab-active' : ''}`} onClick={() => setActiveRightTab('testcase')}>
<FlaskConical size={16} color="#f97316"/> Testcase
</button>

<button className={`tab flex items-center gap-2 ${activeRightTab === 'result' ? 'tab-active' : ''}`} onClick={() => setActiveRightTab('result')}>
<CheckCircle size={16} color="#22c55e"/> Result
</button>


<button
className="btn btn-xs btn-outline ml-auto"
onClick={()=>setIsMaximized(!isMaximized)}
>
{isMaximized ? "🗕" : "🗖"}
</button>

</div>

<div className="flex-1 flex flex-col">

{activeRightTab === 'code' && (

<>

<div className="p-4 border-b border-base-300 flex gap-2">

{['javascript','java','cpp'].map((lang)=>(
<button key={lang} className={`btn btn-sm ${selectedLanguage===lang ? 'btn-primary':'btn-ghost'}`} onClick={()=>handleLanguageChange(lang)}>
{lang==='cpp'?'C++':lang==='java'?'Java':'JavaScript'} </button>
))}

</div>

<div className="flex-1">

<Editor
height="100%"
language={getLanguageForMonaco(selectedLanguage)}
value={code}
onChange={handleEditorChange}
onMount={handleEditorDidMount}
theme="vs-dark"
/>

</div>

<div className="p-4 border-t border-base-300 flex justify-end gap-2">

<button className="btn btn-outline btn-sm" onClick={handleRun}>Run</button>
{/* <button className="btn btn-primary btn-sm" onClick={handleSubmitCode}>Submit</button> */}

<button className="btn btn-primary btn-sm flex items-center gap-2" onClick={handleSubmitCode}>
<Send size={16}/> Submit
</button>

</div>

</>

)}

{activeRightTab === 'result' && (

<div className="p-6">

{submitResult && (

<div className={`alert ${
submitResult.accepted ||
submitResult.status==="accepted"
? "alert-success":"alert-error"
}`}>

<h4 className="font-bold text-lg">

{submitResult.accepted ||
submitResult.status==="accepted"
? "🎉 Accepted":"❌ Wrong Answer"}

</h4>

<p>Runtime: {submitResult.runtime} sec</p>
<p>Memory: {submitResult.memory} KB</p>

</div>

)}

</div>

)}

</div>

</div>

{showChampion && (

<div className="fixed inset-0 flex items-center justify-center z-50">

<div className="bg-black bg-opacity-70 p-10 rounded-xl text-center">

<h2 className="text-white text-3xl font-bold animate-bounce">
🏆 Champion! Problem Solved
</h2>

</div>

</div>

)}

</div>

);

};

export default ProblemPage;





