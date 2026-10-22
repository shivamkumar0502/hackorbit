import {useEffect,useRef} from "react"

function TechBackground(){

const canvasRef=useRef(null)

useEffect(()=>{

const canvas=canvasRef.current
const ctx=canvas.getContext("2d")

canvas.width=window.innerWidth
canvas.height=600

const fontSize=18
const columns=Math.floor(canvas.width/fontSize)

const drops=Array(columns).fill(1)

function draw(){

ctx.fillStyle="rgba(23,23,24,0.08)"
ctx.fillRect(0,0,canvas.width,canvas.height)

ctx.fillStyle="#fa9819"
ctx.font=fontSize+"px monospace"

for(let i=0;i<drops.length;i++){

const text=Math.random()>0.5?"0":"1"

ctx.fillText(text,i*fontSize,drops[i]*fontSize)

drops[i]+=0.3

if(drops[i]*fontSize>canvas.height && Math.random()>0.995){
drops[i]=0
}

}

requestAnimationFrame(draw)

}

draw()

},[])

return(

<canvas
ref={canvasRef}
className="absolute top-0 left-0 w-full h-[600px] opacity-10"
/>

)

}

export default TechBackground