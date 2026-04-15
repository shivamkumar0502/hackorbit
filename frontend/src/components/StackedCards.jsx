function StackedCards(){

return(

<section className="relative z-10 py-40">

{/* TOP TEXT */}

<div className="max-w-6xl mx-auto px-10 text-center">

<div className="flex items-center justify-center gap-4 mb-6">

<div className="h-[1px] w-24 bg-yellow-500"></div>

<span className="text-yellow-400 text-sm bg-yellow-500/10 px-4 py-1 rounded-full">
Features
</span>

<div className="h-[1px] w-24 bg-yellow-500"></div>

</div>


<h2 className="text-6xl font-bold text-white mb-6 tracking-wide">

Engineering for Excellence

</h2>


<p className="text-yellow-400 max-w-2xl mx-auto text-lg leading-relaxed mb-24">

Our comprehensive platform provides all the tools, resources,
and support you need to master coding interviews and
advance your career

</p>

</div>



{/* STACKED CARDS */}

<div className=" relative ">

{/* CARD 1 */}

<div className="bg-gradient-to-r from-purple-500 to-blue-500 p-1 rounded-3xl">

<div className="bg-black rounded-3xl p-16">

<h3 className="text-2xl font-semibold mb-4">
AI Interview Assistant
</h3>

<p className="text-gray-400">
Experience realistic coding interviews with AI powered
feedback and detailed performance analysis.
</p>

</div>

</div>


{/* CARD 2 */}
 {/* <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-1 rounded-3xl"> */}
 {/* {/* <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-1 rounded-3xl">  */}
 <div className="bg-gradient-to-r from-green-400 to-blue-500 p-1 rounded-3xl mt-[-60px]">
<div className="bg-black rounded-3xl p-16">

<h3 className="text-2xl font-semibold mb-4">
DSA Problem Bank
</h3>

<p className="text-gray-400">
Practice hundreds of curated coding problems designed
for technical interview preparation.
</p>

</div>

</div>


{/* CARD 3 */}

<div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-2 rounded-3xl -mt-16">

<div className="bg-black rounded-3xl p-14">

<h3 className="text-2xl font-semibold mb-4">
Live Coding Contests
</h3>

<p className="text-gray-400">
Compete with developers around the world and climb
the leaderboard with real contests.
</p>

</div>

</div>

</div>

</section>

)

}

export default StackedCards

