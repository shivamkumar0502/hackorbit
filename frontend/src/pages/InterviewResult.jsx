import { useLocation } from "react-router-dom";

function InterviewResult(){

const location = useLocation();

const result = location.state || {

technical: 8,
communication: 7,
confidence: 6,
overall: 7.0

};

return(

<div className="min-h-screen bg-[#0f1115] text-white flex justify-center items-center">

<div className="bg-[#1a1d23] p-8 rounded-xl w-[500px]">

<h1 className="text-3xl mb-6 font-semibold">

Interview Result

</h1>

<div className="space-y-3">

<p>
Technical Knowledge: {result.technical}/10
</p>

<p>
Communication: {result.communication}/10
</p>

<p>
Confidence: {result.confidence}/10
</p>

<p className="text-xl font-bold mt-4">

Overall Score: {result.overall}

</p>

</div>

</div>

</div>

)

}

export default InterviewResult;