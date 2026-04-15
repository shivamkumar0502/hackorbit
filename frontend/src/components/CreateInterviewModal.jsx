import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

function CreateInterviewModal({close}){

const {register,handleSubmit} = useForm();

const navigate = useNavigate();

const onSubmit = (data)=>{

console.log(data);

close();

navigate("/live-interview");

};

return(

<div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center">

<div className="bg-[#1a1d23] p-6 rounded-xl w-[450px]">

<h2 className="text-xl font-semibold mb-4">

Create New Interview

</h2>

<form
onSubmit={handleSubmit(onSubmit)}
className="space-y-4"
>

<input
placeholder="Job Position"
className="input input-bordered w-full"
{...register("position")}
/>

<input
placeholder="Company Name"
className="input input-bordered w-full"
{...register("company")}
/>

<textarea
placeholder="Job Description"
className="textarea textarea-bordered w-full"
{...register("description")}
/>

<select
className="select select-bordered w-full"
{...register("difficulty")}
>

<option>Easy</option>
<option>Medium</option>
<option>Hard</option>

</select>

<button className="btn btn-primary w-full">

Start Interview

</button>

</form>

</div>

</div>

)

}

export default CreateInterviewModal;