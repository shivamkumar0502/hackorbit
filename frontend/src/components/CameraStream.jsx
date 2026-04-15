import { useRef, useEffect } from "react";

function CameraStream() {

const videoRef = useRef(null);

useEffect(()=>{

const startCamera = async ()=>{

const stream = await navigator.mediaDevices.getUserMedia({
video:true,
audio:true
});

videoRef.current.srcObject = stream;

};

startCamera();

},[]);

return(

<video
ref={videoRef}
autoPlay
playsInline
className="rounded-xl w-full"
/>

)

}

export default CameraStream;