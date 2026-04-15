


import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import TechBackground from "../components/TechBackground";
import GridBackground from "../components/GridBackground";
// import ParticleBackground from "../components/ParticleBackground";
import RotatingCode from "../components/RotatingCode";
import StackedCards from "../components/StackedCards";
import TechOrbit from "../components/TechOrbit";
import Footer from "../components/Footer"

function LandingPage(){

const navigate = useNavigate();

return(

<div className="min-h-screen bg-black text-white relative overflow-hidden">

{/* GRID BACKGROUND */}
<GridBackground/>

{/* BINARY RAIN */}
<TechBackground/>

{/* PARTICLES */}
{/* <ParticleBackground/> */}

{/* ROTATING CODE CIRCLE */}
<RotatingCode/>

{/* NAVBAR */}
<Navbar/>

{/* ================= HERO SECTION ================= */}

<div className="relative z-10 max-w-7xl mx-auto px-10 pt-32 pb-40 grid md:grid-cols-2 gap-10 items-center">

{/* LEFT CONTENT */}

<div>

<h1 className="text-6xl font-bold leading-tight">

<span className="text-yellow-400">
HackOrbit
</span>

<br/>

FROM BASICS  
TO  

<span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
BRILLIANCE
</span>

</h1>


<p className="text-gray-400 mt-6 max-w-xl text-lg">

HackOrbit helps developers master Data Structures,
Algorithms and technical interviews using AI powered
practice, coding challenges and contests.

</p>


{/* BUTTONS */}

<div className="flex gap-6 mt-10">

<button
onClick={()=>navigate("/home")}
className="px-8 py-4 rounded-xl bg-white text-black font-semibold hover:scale-105 transition duration-300 shadow-lg"
>

Explore Problems

</button>


<button
onClick={()=>navigate("/interview")}
className="px-8 py-4 rounded-xl border border-gray-500 hover:border-purple-500 hover:text-purple-400 transition duration-300"
>

Start AI Interview

</button>

</div>


{/* STATS */}

<div className="flex gap-16 mt-16">

<div>

<h2 className="text-3xl font-bold text-yellow-400">
12K+
</h2>

<p className="text-gray-400 text-sm">
Problems Solved
</p>

</div>


<div>

<h2 className="text-3xl font-bold text-blue-400">
4K+
</h2>

<p className="text-gray-400 text-sm">
AI Interviews
</p>

</div>


<div>

<h2 className="text-3xl font-bold text-purple-400">
150+
</h2>

<p className="text-gray-400 text-sm">
Companies Covered
</p>

</div>

</div>

</div>


{/* RIGHT ROBOT */}

<div className="flex justify-center">

<img
src="https://cdn-icons-png.flaticon.com/512/4712/4712109.png"
className="w-[420px] animate-[float_6s_ease-in-out_infinite]"
/>

</div>

</div>


{/* ================= ENGINEERING SECTION ================= */}

<div className="relative z-10">

<StackedCards/>
<TechOrbit/>
<Footer/>
</div>

</div>


)

}

export default LandingPage;