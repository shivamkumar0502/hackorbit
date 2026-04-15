import { Link } from "react-router-dom";
import { Code2, Brain, Trophy, LayoutDashboard } from "lucide-react";

function Navbar(){

return(

<nav className="w-full fixed top-0 left-0 z-50 bg-black/80 backdrop-blur-lg border-b border-gray-800">

<div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-4">

{/* LOGO */}

<Link to="/" className="text-2xl font-bold text-yellow-400">
HackOrbit
</Link>


{/* MENU */}

<div className="flex items-center gap-8 text-gray-300">

<Link to="/home" className="flex items-center gap-2 hover:text-yellow-400 transition">

<Code2 size={18}/>
Problems

</Link>


<Link to="/interview" className="flex items-center gap-2 hover:text-purple-400 transition">

<Brain size={18}/>
AI Interview

</Link>


<Link to="/contest" className="flex items-center gap-2 hover:text-blue-400 transition">

<Trophy size={18}/>
Contest

</Link>


<Link to="/dashboard" className="flex items-center gap-2 hover:text-green-400 transition">

<LayoutDashboard size={18}/>
Dashboard

</Link>

</div>


{/* AUTH BUTTONS */}

<div className="flex gap-4">

<button className="px-5 py-2 border border-yellow-400 text-yellow-400 rounded-lg hover:bg-yellow-400 hover:text-black transition">
Subscribe
</button>

<Link to="/login">
<button className="px-5 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition">
Login
</button>
</Link>

<Link to="/signup">
<button className="px-5 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition">
Sign Up
</button>
</Link>

</div>

</div>

</nav>

)

}

export default Navbar;