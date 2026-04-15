import { Radar } from "react-chartjs-2";

function InterviewDashboard(){

 const data = {

 labels:[
 "Technical",
 "Communication",
 "Confidence",
 "Eye Contact",
 "Voice"
 ],

 datasets:[{

 label:"Interview Score",

 data:[8,7,6,8,7]

 }]

 };

 return(

 <div className="p-8">

 <h1 className="text-2xl mb-6">
 Interview Result
 </h1>

 <Radar data={data}/>

 </div>

 )

}

export default InterviewDashboard;