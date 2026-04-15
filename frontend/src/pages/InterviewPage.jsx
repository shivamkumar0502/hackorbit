import { useNavigate } from "react-router-dom";

function InterviewPage(){

const navigate = useNavigate();

return(

<div className="min-h-screen bg-[#0b0d12] text-white">

{/* HERO SECTION */}

<div className="max-w-7xl mx-auto px-8 pt-16">

<h1 className="text-5xl font-bold mb-4">

AI Mock Interviews 🚀

</h1>

<p className="text-gray-400 text-lg max-w-xl">

Practice real AI powered interviews with voice, camera and instant
feedback. Improve your technical skills and get hired faster.

</p>

<button
onClick={()=>navigate("/live-interview")}
className="mt-8 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg font-semibold hover:scale-105 transition"
>

Start New Interview

</button>

</div>


{/* FEATURES */}

<div className="max-w-7xl mx-auto px-8 mt-20 grid grid-cols-3 gap-6">

<div className="bg-[#151821] p-6 rounded-xl hover:bg-[#1c2029] transition">

<h3 className="text-xl font-semibold mb-3">

🎤 Voice Interview

</h3>

<p className="text-gray-400">

Answer interview questions using your voice. AI listens and analyzes your response.

</p>

</div>


<div className="bg-[#151821] p-6 rounded-xl hover:bg-[#1c2029] transition">

<h3 className="text-xl font-semibold mb-3">

📷 Camera Analysis

</h3>

<p className="text-gray-400">

AI analyzes your confidence, eye contact and body language.

</p>

</div>


<div className="bg-[#151821] p-6 rounded-xl hover:bg-[#1c2029] transition">

<h3 className="text-xl font-semibold mb-3">

🤖 AI Feedback

</h3>

<p className="text-gray-400">

Get instant feedback on your answers with improvement tips.

</p>

</div>

</div>


{/* INTERVIEW LIST */}

<div className="max-w-7xl mx-auto px-8 mt-20">

<h2 className="text-2xl font-semibold mb-6">

Recent Interviews

</h2>

<div className="grid grid-cols-3 gap-6">

<div className="bg-[#151821] p-6 rounded-xl">

<h3 className="text-lg font-semibold">

Frontend Developer

</h3>

<p className="text-gray-400 mt-2">

Difficulty: Medium

</p>

<button className="mt-4 text-purple-400">

View Report →

</button>

</div>


<div className="bg-[#151821] p-6 rounded-xl">

<h3 className="text-lg font-semibold">

Backend Developer

</h3>

<p className="text-gray-400 mt-2">

Difficulty: Hard

</p>

<button className="mt-4 text-purple-400">

View Report →

</button>

</div>


<div className="bg-[#151821] p-6 rounded-xl">

<h3 className="text-lg font-semibold">

React Developer

</h3>

<p className="text-gray-400 mt-2">

Difficulty: Easy

</p>

<button className="mt-4 text-purple-400">

View Report →

</button>

</div>

</div>

</div>


{/* FOOTER */}

<div className="text-center text-gray-500 mt-24 pb-10">


</div>

</div>

)

}

export default InterviewPage;