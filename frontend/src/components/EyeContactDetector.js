import * as faceapi from "face-api.js";

export const detectEyeContact = async (video)=>{

 const detections = await faceapi
 .detectSingleFace(video)
 .withFaceLandmarks();

 if(detections){

 console.log("Eye contact detected");

 }else{

 console.log("User not looking at camera");

 }

};