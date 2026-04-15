import { useNavigate } from "react-router-dom";

function Homepage(){

const navigate = useNavigate();

return(

<div className="min-h-screen bg-black text-white overflow-hidden relative">

{/* GRID BACKGROUND */}

<div className="absolute inset-0 opacity-20 bg-[linear-gradient(#222_1px,transparent_1px),linear-gradient(90deg,#222_1px,transparent_1px)] bg-[size:40px_40px]" />

{/* NAVBAR */}

<div className="flex items-center justify-between px-10 py-5 border-b border-[#1a1a1a] relative z-10">

<div className="text-2xl font-bold text-yellow-400">
HackOrbit
</div>

<div className="flex gap-8 text-gray-300">

<button className="hover:text-white">
Problems
</button>

<button className="hover:text-white">
Interview
</button>

<button className="hover:text-white">
Community
</button>

<button className="hover:text-white">
Contests
</button>

<button className="hover:text-white">
Visualizer
</button>

</div>

<div className="flex gap-4">

<button className="px-4 py-2 border border-yellow-400 text-yellow-400 rounded-lg hover:bg-yellow-400 hover:text-black transition">

SUBSCRIBE

</button>

<button className="px-4 py-2 bg-[#1a1a1a] rounded-lg hover:bg-[#333]">

Login

</button>

<button className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700">

Sign Up

</button>

</div>

</div>

{/* HERO SECTION */}

<div className="max-w-7xl mx-auto px-10 pt-24 grid md:grid-cols-2 gap-10 items-center relative z-10">

<div>

<div className="inline-flex items-center gap-2 bg-[#111] px-4 py-2 rounded-full text-sm mb-6">

✨ New: AI Interview Assistant

<span className="bg-green-600 px-2 py-1 rounded text-xs">
Live
</span>

</div>

<h1 className="text-6xl font-bold leading-tight mb-6">

TREK FROM <br/>

BASICS TO <br/>

BRILLIANCE

</h1>

<p className="text-gray-400 max-w-xl mb-8">

Breathe in the wild air of DSA. Let every step take you deeper
into the rhythm of problem solving. Your next adventure starts
here with AI-powered interviews, curated DSA challenges and
progress tracking to guide your journey.

</p>

<div className="flex gap-4">

<button
onClick={()=>navigate("/problems")}
className="px-6 py-3 bg-white text-black rounded-lg font-semibold hover:scale-105 transition"

>

Start Your Journey

</button>

<button
onClick={()=>navigate("/problems")}
className="px-6 py-3 border border-white rounded-lg hover:bg-white hover:text-black transition"

>

Explore Problems

</button>

</div>

</div>

{/* RIGHT SIDE HERO VISUAL */}

<div className="flex justify-center">

<div className="relative">

<div className="absolute inset-0 blur-3xl bg-yellow-500 opacity-20 rounded-full"></div>

<img
src="https://cdn-icons-png.flaticon.com/512/4712/4712109.png"
className="w-80 relative"
/>

</div>

</div>

</div>

{/* FEATURES SECTION */}

<div className="max-w-7xl mx-auto px-10 mt-32 relative z-10">

<h2 className="text-4xl font-bold mb-12 text-center">

Engineered for Excellence

</h2>

<div className="grid md:grid-cols-3 gap-10">

<div className="bg-[#0f0f0f] p-8 rounded-xl border border-[#222] hover:border-yellow-500 transition">

<h3 className="text-xl font-semibold mb-4">

AI Interviews

</h3>

<p className="text-gray-400">

Practice with AI-powered mock interviews with real-time
feedback and confidence analysis.

</p>

</div>

<div className="bg-[#0f0f0f] p-8 rounded-xl border border-[#222] hover:border-yellow-500 transition">

<h3 className="text-xl font-semibold mb-4">

DSA Problems

</h3>

<p className="text-gray-400">

Solve hundreds of curated coding problems and improve
your algorithmic thinking.

</p>

</div>

<div className="bg-[#0f0f0f] p-8 rounded-xl border border-[#222] hover:border-yellow-500 transition">

<h3 className="text-xl font-semibold mb-4">

Progress Tracking

</h3>

<p className="text-gray-400">

Track your coding progress, interview scores and learning
journey with smart analytics.

</p>

</div>

</div>

</div>

{/* FOOTER */}

<div className="text-center text-gray-500 mt-32 pb-10 border-t border-[#1a1a1a] pt-10">

© 2026 HackOrbit Coding Platform

</div>

</div>

)

}
export default Homepage;

