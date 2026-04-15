import { useNavigate } from "react-router-dom";

function InterviewLobby(){

const navigate = useNavigate();

return(

<div className="min-h-screen bg-[#0f1115] text-white flex items-center justify-center">

<div className="bg-[#1a1d23] p-8 rounded-xl w-[400px]">

<h2 className="text-xl mb-4">
Create Interview
</h2>

<select className="input w-full mb-3">

<option>Frontend Developer</option>
<option>Backend Developer</option>
<option>React Developer</option>

</select>

<select className="input w-full mb-3">

<option>Easy</option>
<option>Medium</option>
<option>Hard</option>

</select>

<button
className="btn btn-primary w-full"
onClick={()=>navigate("/live-interview")}
>

Start Interview

</button>

</div>

</div>

)

}

export default InterviewLobby;