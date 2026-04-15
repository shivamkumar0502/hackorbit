import { useEffect, useRef } from "react";

function MatrixGridBackground(){

const canvasRef = useRef(null);

useEffect(()=>{

const canvas = canvasRef.current;
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const fontSize = 18;
const columns = Math.floor(canvas.width/fontSize);

const drops = Array(columns).fill(1);
const speeds = Array(columns).fill(0).map(()=>Math.random()*0.3+0.2);

function draw(){

ctx.fillStyle="rgba(0,0,0,0.05)";
ctx.fillRect(0,0,canvas.width,canvas.height);

ctx.strokeStyle="rgba(255,255,255,0.05)";

for(let x=0;x<canvas.width;x+=40){

ctx.beginPath();
ctx.moveTo(x,0);
ctx.lineTo(x,canvas.height);
ctx.stroke();

}

for(let y=0;y<canvas.height;y+=40){

ctx.beginPath();
ctx.moveTo(0,y);
ctx.lineTo(canvas.width,y);
ctx.stroke();

}

ctx.fillStyle="#facc15";
ctx.font=fontSize+"px monospace";

for(let i=0;i<drops.length;i++){

const text=Math.random()>0.5?"0":"1";

ctx.fillText(text,i*fontSize,drops[i]*fontSize);

drops[i]+=speeds[i];

if(drops[i]*fontSize>canvas.height && Math.random()>0.995){
drops[i]=0;
}

}

requestAnimationFrame(draw);

}

draw();

},[]);

return(
<canvas
ref={canvasRef}
className="fixed top-0 left-0 w-full h-full opacity-25 pointer-events-none"
/>
);

}

export default MatrixGridBackground;