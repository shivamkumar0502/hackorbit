import Meyda from "meyda";

export const detectConfidence = (audioContext, source)=>{

 const analyzer = Meyda.createMeydaAnalyzer({
  audioContext,
  source,
  bufferSize:512,
  featureExtractors:["rms"],
  callback:(features)=>{

   if(features.rms > 0.05){

    console.log("Confident voice");

   }else{

    console.log("Low confidence");

   }

  }
 });

 analyzer.start();

};