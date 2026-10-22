


import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import TechBackground from "../components/TechBackground";
import GridBackground from "../components/GridBackground";
// import ParticleBackground from "../components/ParticleBackground";
import RotatingCode from "../components/RotatingCode";
import StackedCards from "../components/StackedCards";
import TechOrbit from "../components/TechOrbit";
import "./LandingPage.css";
import Footer from "../components/Footer"

function LandingPage(){

const navigate = useNavigate();

return(

<div className="landing-page min-h-screen relative overflow-hidden">

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

<div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 pt-20 pb-24 grid md:grid-cols-2 gap-10 items-center">

{/* LEFT CONTENT */}

<div>

<h1 className="text-4xl md:text-6xl font-bold leading-tight">

<span className="landing-accent">
HackOrbit
</span>

<br/>

FROM BASICS<br />TO{' '}

<span className="landing-headline-accent">
BRILLIANCE
</span>

</h1>


<p className="text-gray-400 mt-6 max-w-xl text-lg">

HackOrbit helps developers master Data Structures,
Algorithms and technical interviews using AI powered
practice, coding challenges and contests.

</p>


{/* BUTTONS */}

<div className="flex flex-wrap gap-4 mt-10">

<button
onClick={()=>navigate("/home")}
className="landing-primary px-8 py-4 rounded-xl font-semibold hover:scale-105 transition duration-300 shadow-lg"
>

Explore Problems

</button>


<button
onClick={()=>navigate("/interview")}
className="landing-secondary px-8 py-4 rounded-xl transition duration-300"
>

Start AI Interview

</button>

</div>


{/* STATS */}

<div className="flex flex-wrap gap-8 md:gap-16 mt-16">

<div>

<h2 className="text-3xl font-bold landing-accent">
12K+
</h2>

<p className="text-gray-400 text-sm">
Problems Solved
</p>

</div>


<div>

<h2 className="text-3xl font-bold landing-stat-blue">
4K+
</h2>

<p className="text-gray-400 text-sm">
AI Interviews
</p>

</div>


<div>

<h2 className="text-3xl font-bold landing-stat-green">
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
alt="Friendly coding robot"
className="w-[420px] max-w-full animate-[float_6s_ease-in-out_infinite]"
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