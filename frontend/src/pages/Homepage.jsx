// import { useEffect, useState } from 'react';
// import { NavLink } from 'react-router'; // Fixed import
// import { useDispatch, useSelector } from 'react-redux';
// import axiosClient from '../utils/axiosClient';
// import { logoutUser } from '../authSlice';

// function Homepage() {
//   const dispatch = useDispatch();
//   const { user } = useSelector((state) => state.auth);
//   const [problems, setProblems] = useState([]);
//   const [solvedProblems, setSolvedProblems] = useState([]);
//   const [filters, setFilters] = useState({
//     difficulty: 'all',
//     tag: 'all',
//     status: 'all' 
//   });

//   useEffect(() => {
//     const fetchProblems = async () => {
//       try {
//         const { data } = await axiosClient.get('/problem/getAllProblem');
//         setProblems(data);
//       } catch (error) {
//         console.error('Error fetching problems:', error);
//       }
//     };

//     const fetchSolvedProblems = async () => {
//       try {
//         const { data } = await axiosClient.get('/problem/problemSolvedByUser');
//         setSolvedProblems(data);
//       } catch (error) {
//         console.error('Error fetching solved problems:', error);
//       }
//     };

//     fetchProblems();
//     if (user) fetchSolvedProblems();
//   }, [user]);

//   const handleLogout = () => {
//     dispatch(logoutUser());
//     setSolvedProblems([]); // Clear solved problems on logout
//   };

//   const filteredProblems = problems.filter(problem => {
//     const difficultyMatch = filters.difficulty === 'all' || problem.difficulty === filters.difficulty;
//     const tagMatch = filters.tag === 'all' || problem.tags === filters.tag;
//     const statusMatch = filters.status === 'all' || 
//                       solvedProblems.some(sp => sp._id === problem._id);
//     return difficultyMatch && tagMatch && statusMatch;
//   });

//   return (
//     <div className="min-h-screen bg-base-200">
//       {/* Navigation Bar */}
//       <nav className="navbar bg-base-100 shadow-lg px-4">
//         <div className="flex-1">
//           <NavLink to="/" className="btn btn-ghost text-xl">LeetCode</NavLink>
//         </div>
//         <div className="flex-none gap-4">
//           <div className="dropdown dropdown-end">
//             <div tabIndex={0} className="btn btn-ghost">
//               {user?.firstName}
//             </div>
//             <ul className="mt-3 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
//               <li><button onClick={handleLogout}>Logout</button></li>
//               {user.role=='admin'&&<li><NavLink to="/admin">Admin</NavLink></li>}
//             </ul>
//           </div>
//         </div>
//       </nav>

//       {/* Main Content */}
//       <div className="container mx-auto p-4">
//         {/* Filters */}
//         <div className="flex flex-wrap gap-4 mb-6">
//           {/* New Status Filter */}
//           <select 
//             className="select select-bordered"
//             value={filters.status}
//             onChange={(e) => setFilters({...filters, status: e.target.value})}
//           >
//             <option value="all">All Problems</option>
//             <option value="solved">Solved Problems</option>
//           </select>

//           <select 
//             className="select select-bordered"
//             value={filters.difficulty}
//             onChange={(e) => setFilters({...filters, difficulty: e.target.value})}
//           >
//             <option value="all">All Difficulties</option>
//             <option value="easy">Easy</option>
//             <option value="medium">Medium</option>
//             <option value="hard">Hard</option>
//           </select>

//           <select 
//             className="select select-bordered"
//             value={filters.tag}
//             onChange={(e) => setFilters({...filters, tag: e.target.value})}
//           >
//             <option value="all">All Tags</option>
//             <option value="array">Array</option>
//             <option value="linkedList">Linked List</option>
//             <option value="graph">Graph</option>
//             <option value="dp">DP</option>
//           </select>
//         </div>

//         {/* Problems List */}
//         <div className="grid gap-4">
//           {filteredProblems.map(problem => (
//             <div key={problem._id} className="card bg-base-100 shadow-xl">
//               <div className="card-body">
//                 <div className="flex items-center justify-between">
//                   <h2 className="card-title">
//                     <NavLink to={`/problem/${problem._id}`} className="hover:text-primary">
//                       {problem.title}
//                     </NavLink>
//                   </h2>
//                   {solvedProblems.some(sp => sp._id === problem._id) && (
//                     <div className="badge badge-success gap-2">
//                       <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
//                         <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                       </svg>
//                       Solved
//                     </div>
//                   )}
//                 </div>
                
//                 <div className="flex gap-2">
//                   <div className={`badge ${getDifficultyBadgeColor(problem.difficulty)}`}>
//                     {problem.difficulty}
//                   </div>
//                   <div className="badge badge-info">
//                     {problem.tags}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// const getDifficultyBadgeColor = (difficulty) => {
//   switch (difficulty.toLowerCase()) {
//     case 'easy': return 'badge-success';
//     case 'medium': return 'badge-warning';
//     case 'hard': return 'badge-error';
//     default: return 'badge-neutral';
//   }
// };

// export default Homepage;



import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import axiosClient from "../utils/axiosClient";
import { logoutUser } from "../authSlice";
import DailyActivity from "../components/DailyActivity";
import logo from "../assets/codexa-logo.png"

import {
Chart as ChartJS,
CategoryScale,
LinearScale,
BarElement,
PointElement,
LineElement,
Tooltip,
Legend
} from "chart.js";

import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
CategoryScale,
LinearScale,
BarElement,
PointElement,
LineElement,
Tooltip,
Legend
);

function Homepage() {

const dispatch = useDispatch();
const { user } = useSelector((state) => state.auth);

const [problems,setProblems] = useState([]);
const [solvedProblems,setSolvedProblems] = useState([]);
const [search,setSearch] = useState("");
const [favorites,setFavorites] = useState([]);
const [leaderboard,setLeaderboard] = useState([]);

const [filters,setFilters] = useState({
difficulty:"all",
tag:"all",
status:"all"
});

useEffect(()=>{

const fetchProblems = async ()=>{
const {data} = await axiosClient.get("/problem/getAllProblem");
setProblems(data);
};

const fetchSolved = async ()=>{
if(!user) return;
const {data} = await axiosClient.get("/problem/problemSolvedByUser");
setSolvedProblems(data);
};

fetchProblems();
fetchSolved();

},[user]);


useEffect(()=>{

const fetchLeaderboard = async ()=>{
try{
const {data} = await axiosClient.get("/leaderboard");
setLeaderboard(data);
}catch(err){
console.log(err);
}
};

fetchLeaderboard();

},[]);


const handleLogout = ()=>{
dispatch(logoutUser());
};

const toggleFavorite = (id)=>{
if(favorites.includes(id)){
setFavorites(favorites.filter(f=>f!==id));
}else{
setFavorites([...favorites,id]);
}
};

const getAcceptance = (problem)=>{
if(!problem.totalSubmissions) return "0%";
return ((problem.acceptedSubmissions/problem.totalSubmissions)*100).toFixed(1)+"%";
};

const filteredProblems = problems.filter(p=>{

const difficultyMatch =
filters.difficulty==="all" || p.difficulty===filters.difficulty;

const tagMatch =
filters.tag==="all" || p.tags===filters.tag;

const statusMatch =
filters.status==="all" ||
solvedProblems.some(sp=>sp._id===p._id);

const searchMatch =
p.title.toLowerCase().includes(search.toLowerCase());

return difficultyMatch && tagMatch && statusMatch && searchMatch;

});


const runtimeData = {
labels:["0-10ms","10-20ms","20-30ms","30-40ms","40ms+"],
datasets:[
{
label:"Submissions",
data:[5,12,9,4,2],
backgroundColor:"#22c55e"
}
]
};


const submissionGraph = {
labels:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
datasets:[
{
label:"Submissions",
data:[3,5,2,8,6,4,7],
borderColor:"#facc15",
backgroundColor:"rgba(250,204,21,0.2)",
tension:0.4
}
]
};


return (

<div className="min-h-screen bg-[#0f1115] text-white">

{/* NAVBAR */}

<div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">

{/* <h1 className="text-xl font-semibold  text-yellow-400" >
CODEXA</h1> */}
<img
  src={logo}
  alt="Codexa Logo"
  className="h-18 object-contain"
/>

<div className="flex items-center gap-4">

<div className="relative group">

<div className="cursor-pointer bg-[#1a1d23] px-3 py-1 rounded flex items-center gap-1">
{user?.firstName}
<span className="text-gray-400">▼</span>
</div>

<div className="absolute right-0 mt-2 w-36 bg-[#1a1d23] rounded shadow-lg opacity-0 group-hover:opacity-100 transition">

<NavLink
to="/profile"
className="block px-4 py-2 hover:bg-[#2a2f3a]">
View Profile
</NavLink>

{user?.role?.toLowerCase() === "admin" && (
<NavLink
to="/admin"
className="block px-4 py-2 hover:bg-[#2a2f3a]"
>
Admin
</NavLink>
)}

<button
onClick={handleLogout}
className="block w-full text-left px-4 py-2 hover:bg-[#2a2f3a]"
>
Logout
</button>

</div>

</div>

</div>

</div>


{/* MAIN */}

<div className="flex">

{/* LEFT SIDE */}

<div className="w-[70%] p-6">

{/* CONTEST */}

<div className="bg-gradient-to-r from-purple-600 to-blue-500 p-4 rounded mb-6 flex justify-between items-center">

<div>
<h2 className="text-lg font-semibold">
Weekly Coding Contest
</h2>

<p className="text-sm text-gray-200">
Starts in 2 days
</p>
</div>

<button className="bg-white text-black px-4 py-1 rounded">
Register
</button>

</div>


{/* TAG FILTER */}

<div className="flex flex-wrap gap-2 mb-6">

{["array","string","graph","dp","tree","Sorting","Hash Table"].map(tag=>(
<button
key={tag}
onClick={()=>setFilters({...filters,tag:tag})}
className="bg-[#1a1d23] px-3 py-1 rounded hover:bg-[#2a2f3a]"
>
{tag}
</button>
))}

</div>


{/* SEARCH */}

<div className="flex gap-4 mb-6">

<input
type="text"
placeholder="Search questions..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
className="bg-[#1a1d23] px-4 py-2 rounded w-full"
/>

<select
className="bg-[#1a1d23] px-3 py-2 rounded"
value={filters.difficulty}
onChange={(e)=>setFilters({...filters,difficulty:e.target.value})}
>
<option value="all">All</option>
<option value="easy">Easy</option>
<option value="medium">Medium</option>
<option value="hard">Hard</option>
</select>

</div>


{/* HEADER */}

<div className="flex text-gray-400 text-sm border-b border-gray-700 pb-2">

<div className="w-10">★</div>
<div className="w-10">#</div>
<div className="flex-1">Title</div>
<div className="w-32">Acceptance</div>
<div className="w-32">Difficulty</div>
<div className="w-20">Status</div>

</div>


{/* PROBLEMS */}

{filteredProblems.map((problem,index)=>{

const solved = solvedProblems.some(
sp=>sp._id===problem._id
);

return(

<div
key={problem._id}
className="flex items-center border-b border-gray-800 py-3 hover:bg-[#1a1d23]"
>

<div
className="w-10 cursor-pointer"
onClick={()=>toggleFavorite(problem._id)}
>
{favorites.includes(problem._id) ? "⭐" : "☆"}
</div>

<div className="w-10 text-gray-400">
{index+1}
</div>

<div className="flex-1">

<NavLink
to={`/problem/${problem._id}`}
className="hover:text-yellow-400"
>
{problem.title}
</NavLink>

</div>

<div className="w-32 text-gray-400">
{getAcceptance(problem)}
</div>

<div className={`w-32
${problem.difficulty==="easy" && "text-green-400"}
${problem.difficulty==="medium" && "text-yellow-400"}
${problem.difficulty==="hard" && "text-red-400"}
`}>
{problem.difficulty}
</div>

<div className="w-20">
{solved && <span className="text-green-400">✓</span>}
</div>

</div>

)

})}


{/* CHARTS */}

<div className="mt-10">
<h2 className="text-lg mb-4">Runtime Distribution</h2>
<Bar data={runtimeData}/>
</div>

<div className="mt-10">
<h2 className="text-lg mb-4">Submission Graph</h2>
<Line data={submissionGraph}/>
</div>

</div>


{/* RIGHT SIDEBAR */}

<div className="w-[30%] border-l border-gray-800 p-6 space-y-6">

{/* DAILY ACTIVITY */}

<div>
<h2 className="mb-4 text-gray-300 font-semibold">
Daily Activity
</h2>

<div className="bg-[#1a1d23] p-4 rounded">
<DailyActivity/>
</div>
</div>


{/* LEADERBOARD */}

<div>

<h2 className="mb-3 text-gray-300 font-semibold">
🏆 Leaderboard
</h2>

<div className="bg-[#1a1d23] rounded p-3">

{leaderboard.map((u,i)=>(

<div
key={i}
className="flex justify-between border-b border-gray-700 py-2"
>

<span>{i+1}. {u.name}</span>

<span className="text-yellow-400">
{u.score}
</span>

</div>

))}

</div>

</div>


{/* COMPANIES */}

<div>

<h2 className="mb-3 text-gray-300 font-semibold">
Trending Companies
</h2>

<div className="flex flex-wrap gap-2">

{["Google","Amazon","Meta","Microsoft","Uber"].map(c=>(
<div
key={c}
className="bg-[#1a1d23] px-3 py-1 rounded text-sm"
>
{c}
</div>
))}

</div>

</div>

</div>

</div>

</div>

);

}

export default Homepage;