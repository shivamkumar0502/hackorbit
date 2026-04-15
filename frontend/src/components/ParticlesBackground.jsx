function ParticleBackground(){

return(

<div className="absolute inset-0 pointer-events-none overflow-hidden">

<div className="absolute w-2 h-2 bg-yellow-400 rounded-full top-20 left-40 animate-pulse"></div>

<div className="absolute w-2 h-2 bg-blue-400 rounded-full top-40 right-60 animate-ping"></div>

<div className="absolute w-2 h-2 bg-purple-400 rounded-full bottom-40 left-20 animate-pulse"></div>

<div className="absolute w-2 h-2 bg-green-400 rounded-full bottom-20 right-20 animate-ping"></div>

<div className="absolute w-2 h-2 bg-pink-400 rounded-full top-60 left-1/2 animate-pulse"></div>

</div>

)

}

export default ParticleBackground