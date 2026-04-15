// import { useForm, useFieldArray } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import axiosClient from '../utils/axiosClient';
// import { useNavigate } from 'react-router';
// // import { useNavigate } from 'react-router-dom';

// // Zod schema matching the problem schema
// const problemSchema = z.object({
//   title: z.string().min(1, 'Title is required'),
//   description: z.string().min(1, 'Description is required'),
//   difficulty: z.enum(['easy', 'medium', 'hard']),
//   tags: z.enum(['array', 'linkedList', 'graph', 'dp']),
//   visibleTestCases: z.array(
//     z.object({
//       input: z.string().min(1, 'Input is required'),
//       output: z.string().min(1, 'Output is required'),
//       explanation: z.string().min(1, 'Explanation is required')
//     })
//   ).min(1, 'At least one visible test case required'),
//   hiddenTestCases: z.array(
//     z.object({
//       input: z.string().min(1, 'Input is required'),
//       output: z.string().min(1, 'Output is required')
//     })
//   ).min(1, 'At least one hidden test case required'),
//   startCode: z.array(
//     z.object({
//       language: z.enum(['C++', 'Java', 'JavaScript']),
//       initialCode: z.string().min(1, 'Initial code is required')
//     })
//   ).length(3, 'All three languages required'),
//   referenceSolution: z.array(
//     z.object({
//       language: z.enum(['C++', 'Java', 'JavaScript']),
//       completeCode: z.string().min(1, 'Complete code is required')
//     })
//   ).length(3, 'All three languages required')
// });

// function AdminPanel() {
//   const navigate = useNavigate();
//   const {
//     register,
//     control,
//     handleSubmit,
//     formState: { errors }
//   } = useForm({
//     resolver: zodResolver(problemSchema),
//     defaultValues: {
//       startCode: [
//         { language: 'C++', initialCode: '' },
//         { language: 'Java', initialCode: '' },
//         { language: 'JavaScript', initialCode: '' }
//       ],
//       referenceSolution: [
//         { language: 'C++', completeCode: '' },
//         { language: 'Java', completeCode: '' },
//         { language: 'JavaScript', completeCode: '' }
//       ]
//     }
//   });

//   const {
//     fields: visibleFields,
//     append: appendVisible,
//     remove: removeVisible
//   } = useFieldArray({
//     control,
//     name: 'visibleTestCases'
//   });

//   const {
//     fields: hiddenFields,
//     append: appendHidden,
//     remove: removeHidden
//   } = useFieldArray({
//     control,
//     name: 'hiddenTestCases'
//   });

//   const onSubmit = async (data) => {
//     try {
//       await axiosClient.post('/problem/create', data);
//       alert('Problem created successfully!');
//       navigate('/');
//     } catch (error) {
//       alert(`Error: ${error.response?.data?.message || error.message}`);
//     }
//   };

//   return (
//     <div className="container mx-auto p-6">
//       <h1 className="text-3xl font-bold mb-6">Create New Problem</h1>
      
//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//         {/* Basic Information */}
//         <div className="card bg-base-100 shadow-lg p-6">
//           <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
//           <div className="space-y-4">
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">Title</span>
//               </label>
//               <input
//                 {...register('title')}
//                 className={`input input-bordered ${errors.title && 'input-error'}`}
//               />
//               {errors.title && (
//                 <span className="text-error">{errors.title.message}</span>
//               )}
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">Description</span>
//               </label>
//               <textarea
//                 {...register('description')}
//                 className={`textarea textarea-bordered h-32 ${errors.description && 'textarea-error'}`}
//               />
//               {errors.description && (
//                 <span className="text-error">{errors.description.message}</span>
//               )}
//             </div>

//             <div className="flex gap-4">
//               <div className="form-control w-1/2">
//                 <label className="label">
//                   <span className="label-text">Difficulty</span>
//                 </label>
//                 <select
//                   {...register('difficulty')}
//                   className={`select select-bordered ${errors.difficulty && 'select-error'}`}
//                 >
//                   <option value="easy">Easy</option>
//                   <option value="medium">Medium</option>
//                   <option value="hard">Hard</option>
//                 </select>
//               </div>

//               <div className="form-control w-1/2">
//                 <label className="label">
//                   <span className="label-text">Tag</span>
//                 </label>
//                 <select
//                   {...register('tags')}
//                   className={`select select-bordered ${errors.tags && 'select-error'}`}
//                 >
//                   <option value="array">Array</option>
//                   <option value="linkedList">Linked List</option>
//                   <option value="graph">Graph</option>
//                   <option value="dp">DP</option>
//                 </select>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Test Cases */}
//         <div className="card bg-base-100 shadow-lg p-6">
//           <h2 className="text-xl font-semibold mb-4">Test Cases</h2>
          
//           {/* Visible Test Cases */}
//           <div className="space-y-4 mb-6">
//             <div className="flex justify-between items-center">
//               <h3 className="font-medium">Visible Test Cases</h3>
//               <button
//                 type="button"
//                 onClick={() => appendVisible({ input: '', output: '', explanation: '' })}
//                 className="btn btn-sm btn-primary"
//               >
//                 Add Visible Case
//               </button>
//             </div>
            
//             {visibleFields.map((field, index) => (
//               <div key={field.id} className="border p-4 rounded-lg space-y-2">
//                 <div className="flex justify-end">
//                   <button
//                     type="button"
//                     onClick={() => removeVisible(index)}
//                     className="btn btn-xs btn-error"
//                   >
//                     Remove
//                   </button>
//                 </div>
                
//                 <input
//                   {...register(`visibleTestCases.${index}.input`)}
//                   placeholder="Input"
//                   className="input input-bordered w-full"
//                 />
                
//                 <input
//                   {...register(`visibleTestCases.${index}.output`)}
//                   placeholder="Output"
//                   className="input input-bordered w-full"
//                 />
                
//                 <textarea
//                   {...register(`visibleTestCases.${index}.explanation`)}
//                   placeholder="Explanation"
//                   className="textarea textarea-bordered w-full"
//                 />
//               </div>
//             ))}
//           </div>

//           {/* Hidden Test Cases */}
//           <div className="space-y-4">
//             <div className="flex justify-between items-center">
//               <h3 className="font-medium">Hidden Test Cases</h3>
//               <button
//                 type="button"
//                 onClick={() => appendHidden({ input: '', output: '' })}
//                 className="btn btn-sm btn-primary"
//               >
//                 Add Hidden Case
//               </button>
//             </div>
            
//             {hiddenFields.map((field, index) => (
//               <div key={field.id} className="border p-4 rounded-lg space-y-2">
//                 <div className="flex justify-end">
//                   <button
//                     type="button"
//                     onClick={() => removeHidden(index)}
//                     className="btn btn-xs btn-error"
//                   >
//                     Remove
//                   </button>
//                 </div>
                
//                 <input
//                   {...register(`hiddenTestCases.${index}.input`)}
//                   placeholder="Input"
//                   className="input input-bordered w-full"
//                 />
                
//                 <input
//                   {...register(`hiddenTestCases.${index}.output`)}
//                   placeholder="Output"
//                   className="input input-bordered w-full"
//                 />
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Code Templates */}
//         <div className="card bg-base-100 shadow-lg p-6">
//           <h2 className="text-xl font-semibold mb-4">Code Templates</h2>
          
//           <div className="space-y-6">
//             {[0, 1, 2].map((index) => (
//               <div key={index} className="space-y-2">
//                 <h3 className="font-medium">
//                   {index === 0 ? 'C++' : index === 1 ? 'Java' : 'JavaScript'}
//                 </h3>
                
//                 <div className="form-control">
//                   <label className="label">
//                     <span className="label-text">Initial Code</span>
//                   </label>
//                   <pre className="bg-base-300 p-4 rounded-lg">
//                     <textarea
//                       {...register(`startCode.${index}.initialCode`)}
//                       className="w-full bg-transparent font-mono"
//                       rows={6}
//                     />
//                   </pre>
//                 </div>
                
//                 <div className="form-control">
//                   <label className="label">
//                     <span className="label-text">Reference Solution</span>
//                   </label>
//                   <pre className="bg-base-300 p-4 rounded-lg">
//                     <textarea
//                       {...register(`referenceSolution.${index}.completeCode`)}
//                       className="w-full bg-transparent font-mono"
//                       rows={6}
//                     />
//                   </pre>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <button type="submit" className="btn btn-primary w-full">
//           Create Problem
//         </button>
//       </form>
//     </div>
//   );
// }

// export default AdminPanel;




import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axiosClient from "../utils/axiosClient";
import { useNavigate } from "react-router-dom";

const problemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  difficulty: z.enum(["easy", "medium", "hard"]),
  tags: z.enum(["array", "linkedList", "graph", "dp"]),

  visibleTestCases: z.array(
    z.object({
      input: z.string().min(1),
      output: z.string().min(1),
      explanation: z.string().min(1)
    })
  ),

  hiddenTestCases: z.array(
    z.object({
      input: z.string().min(1),
      output: z.string().min(1)
    })
  ),

  startCode: z.array(
    z.object({
      language: z.enum(["C++", "Java", "JavaScript"]),
      initialCode: z.string()
    })
  ).length(3),

  referenceSolution: z.array(
    z.object({
      language: z.enum(["C++", "Java", "JavaScript"]),
      completeCode: z.string()
    })
  ).length(3)
});

function AdminPanel(){

const navigate = useNavigate();

const {
register,
control,
handleSubmit,
formState:{errors}
} = useForm({
resolver:zodResolver(problemSchema),
defaultValues:{
title:"",
description:"",
difficulty:"easy",
tags:"array",

visibleTestCases:[{input:"",output:"",explanation:""}],

hiddenTestCases:[{input:"",output:""}],

startCode:[
{language:"C++",initialCode:""},
{language:"Java",initialCode:""},
{language:"JavaScript",initialCode:""}
],

referenceSolution:[
{language:"C++",completeCode:""},
{language:"Java",completeCode:""},
{language:"JavaScript",completeCode:""}
]
}
});

const {fields:visibleFields,append:appendVisible,remove:removeVisible} = useFieldArray({
control,
name:"visibleTestCases"
});

const {fields:hiddenFields,append:appendHidden,remove:removeHidden} = useFieldArray({
control,
name:"hiddenTestCases"
});

const onSubmit = async(data)=>{

try{

await axiosClient.post("/problem/create",data);

alert("Problem Created Successfully ✅");

navigate("/");

}catch(error){

alert(error.response?.data?.message || "Error creating problem")

}

};

return(

<div className="min-h-screen bg-[#0b0b0f] text-[#e4e6eb] flex justify-center">

<div className="min-h-screen bg-[#0f1115] text-white flex justify-center"></div>
<div className="w-[900px] bg-[#0f172a]/60 backdrop-blur-md border border-[#1e293b] rounded-xl p-8 mt-10 shadow-lg">

<h1 className="text-3xl font-bold mb-8">
Create New Problem
</h1>

<form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

{/* BASIC INFO */}

<div className="space-y-4">

<input
{...register("title")}
placeholder="Problem Title"
className="w-full p-3 rounded bg-[#16181d] border border-[#2a2d34]"
/>

<p className="text-red-400">{errors.title?.message}</p>

<textarea
{...register("description")}
placeholder="Problem Description"
className="w-full p-3 rounded bg-[#16181d] border border-[#2a2d34]"
/>

<select
{...register("difficulty")}
className="w-full p-3 rounded bg-[#16181d] border border-[#2a2d34]"
>

<option value="easy">Easy</option>
<option value="medium">Medium</option>
<option value="hard">Hard</option>

</select>

<select
{...register("tags")}
className="w-full p-3 rounded bg-[#16181d] border border-[#2a2d34]"
>

<option value="array">Array</option>
<option value="linkedList">Linked List</option>
<option value="graph">Graph</option>
<option value="dp">Dynamic Programming</option>

</select>

</div>


{/* VISIBLE TEST CASES */}

<div>

<h2 className="text-xl font-semibold mb-4">
Visible Test Cases
</h2>

{visibleFields.map((field,index)=>(

<div key={field.id} className="space-y-2 mb-4">

<input
{...register(`visibleTestCases.${index}.input`)}
placeholder="Input"
className="w-full p-2 rounded bg-[#16181d] border border-[#2a2d34]"
/>

<input
{...register(`visibleTestCases.${index}.output`)}
placeholder="Output"
className="w-full p-2 rounded bg-[#16181d] border border-[#2a2d34]"
/>

<textarea
{...register(`visibleTestCases.${index}.explanation`)}
placeholder="Explanation"
className="w-full p-2 rounded bg-[#16181d] border border-[#2a2d34]"
/>

<button
type="button"
onClick={()=>removeVisible(index)}
className="bg-red-600 px-3 py-1 rounded"
>
Remove
</button>

</div>

))}

<button
type="button"
onClick={()=>appendVisible({input:"",output:"",explanation:""})}
className="bg-blue-600 px-4 py-2 rounded"
>
Add Visible Case
</button>

</div>


{/* HIDDEN TEST CASES */}

<div>

<h2 className="text-xl font-semibold mb-4">
Hidden Test Cases
</h2>

{hiddenFields.map((field,index)=>(

<div key={field.id} className="space-y-2 mb-4">

<input
{...register(`hiddenTestCases.${index}.input`)}
placeholder="Input"
className="w-full p-2 rounded bg-[#16181d] border border-[#2a2d34]"
/>

<input
{...register(`hiddenTestCases.${index}.output`)}
placeholder="Output"
className="w-full p-2 rounded bg-[#16181d] border border-[#2a2d34]"
/>

<button
type="button"
onClick={()=>removeHidden(index)}
className="bg-red-600 px-3 py-1 rounded"
>
Remove
</button>

</div>

))}

<button
type="button"
onClick={()=>appendHidden({input:"",output:""})}
className="bg-blue-600 px-4 py-2 rounded"
>
Add Hidden Case
</button>

</div>


{/* CODE TEMPLATE */}

<div>

<h2 className="text-xl font-semibold mb-4">
Code Templates
</h2>

{[0,1,2].map((index)=>{

const lang = index===0?"C++":index===1?"Java":"JavaScript";

return(

<div key={index} className="mb-6">

<h3 className="mb-2">{lang}</h3>

<textarea
{...register(`startCode.${index}.initialCode`)}
placeholder="Initial Code"
className="w-full p-3 rounded bg-[#16181d] border border-[#2a2d34]"
/>

<textarea
{...register(`referenceSolution.${index}.completeCode`)}
placeholder="Reference Solution"
className="w-full p-3 rounded bg-[#16181d] border border-[#2a2d34] mt-2"
/>

</div>

)

})}

</div>


<button
type="submit"
className="w-full py-3 bg-green-600 rounded hover:bg-green-700"
>

Create Problem

</button>

</form>

</div>

</div>

);

}

export default AdminPanel;