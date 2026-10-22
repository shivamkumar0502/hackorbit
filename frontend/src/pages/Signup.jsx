// import { useState, useEffect } from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate, NavLink } from 'react-router';
// import { registerUser } from '../authSlice';

// const signupSchema = z.object({
//   firstName: z.string().min(3, "Minimum character should be 3"),
//   emailId: z.string().email("Invalid Email"),
//   password: z.string().min(8, "Password is too weak")
// });

// function Signup() {
//   const [showPassword, setShowPassword] = useState(false);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { isAuthenticated, loading } = useSelector((state) => state.auth); // Removed error as it wasn't used

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({ resolver: zodResolver(signupSchema) });

//   useEffect(() => {
//     if (isAuthenticated) {
//       navigate('/');
//     }
//   }, [isAuthenticated, navigate]);

//   const onSubmit = (data) => {
//     dispatch(registerUser(data));
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center p-4 bg-base-200"> {/* Added a light bg for contrast */}
//       <div className="card w-96 bg-base-100 shadow-xl">
//         <div className="card-body">
//           <h2 className="card-title justify-center text-3xl mb-6">Leetcode</h2> {/* Added mb-6 for spacing */}
//           <form onSubmit={handleSubmit(onSubmit)}>
//             {/* First Name Field */}
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">First Name</span>
//               </label>
//               <input
//                 type="text"
//                 placeholder="Shivam"
//                 className={`input input-bordered w-full ${errors.firstName ? 'input-error' : ''}`} 
//                 {...register('firstName')}
//               />
//               {errors.firstName && (
//                 <span className="text-error text-sm mt-1">{errors.firstName.message}</span>
//               )}
//             </div>

//             {/* Email Field */}
//             <div className="form-control mt-4">
//               <label className="label">
//                 <span className="label-text">Email</span>
//               </label>
//               <input
//                 type="email"
//                 placeholder="shivam@gmail.com"
//                 className={`input input-bordered w-full ${errors.emailId ? 'input-error' : ''}`} // Ensure w-full for consistency
//                 {...register('emailId')}
//               />
//               {errors.emailId && (
//                 <span className="text-error text-sm mt-1">{errors.emailId.message}</span>
//               )}
//             </div>

//             {/* Password Field with Toggle */}
//             <div className="form-control mt-4">
//               <label className="label">
//                 <span className="label-text">Password</span>
//               </label>
//               <div className="relative">
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   placeholder="••••••••"
//                   // Added pr-10 (padding-right) to make space for the button
//                   className={`input input-bordered w-full pr-10 ${errors.password ? 'input-error' : ''}`}
//                   {...register('password')}
//                 />
//                 <button
//                   type="button"
//                   className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700" // Added transform for better centering, styling
//                   onClick={() => setShowPassword(!showPassword)}
//                   aria-label={showPassword ? "Hide password" : "Show password"} // Accessibility
//                 >
//                   {showPassword ? (
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
//                     </svg>
//                   ) : (
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                     </svg>
//                   )}
//                 </button>
//               </div>
//               {errors.password && (
//                 <span className="text-error text-sm mt-1">{errors.password.message}</span>
//               )}
//             </div>

//             {/* Submit Button */}
//             <div className="form-control mt-8 flex justify-center"> 
//               <button
//                 type="submit"
//                 className={`btn btn-primary ${loading ? 'loading' : ''}`}
//                 disabled={loading}
//               >
//                 {loading ? 'Signing Up...' : 'Sign Up'}
//               </button>
//             </div>
//           </form>

//           {/* Login Redirect */}
//           <div className="text-center mt-6"> {/* Increased mt for spacing */}
//             <span className="text-sm">
//               Already have an account?{' '}
//               <NavLink to="/login" className="link link-primary">
//                 Login
//               </NavLink>
//             </span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Signup;




import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, NavLink } from "react-router";
import { registerUser } from "../authSlice";

const signupSchema = z.object({
  firstName: z.string().min(3, "Minimum character should be 3"),
  emailId: z.string().email("Invalid Email"),
  password: z.string().min(8, "Password is too weak"),
});

function Signup() {

const [showPassword,setShowPassword] = useState(false);

const dispatch = useDispatch();
const navigate = useNavigate();

const {isAuthenticated,loading,error} = useSelector((state)=>state.auth);

const {
register,
handleSubmit,
formState:{errors},
} = useForm({
resolver:zodResolver(signupSchema)
});

useEffect(()=>{
if(isAuthenticated){
navigate("/home");
}
},[isAuthenticated,navigate]);

const onSubmit = (data)=>{
dispatch(registerUser(data));
};

return (

<div className="min-h-screen flex items-center justify-center bg-[#0b0b0f] text-white">

{/* CARD */}

<div className="w-[380px] backdrop-blur-lg bg-[#111217]/90 border border-[#2a2d34] rounded-xl shadow-xl p-8">

<h2 className="text-3xl font-bold text-center mb-6">
Create Account
</h2>


{/* GOOGLE BUTTON */}

<button className="w-full flex items-center justify-center gap-3 bg-[#16181d] border border-[#2a2d34] hover:bg-[#1d2026] py-2 rounded mb-6">

<svg width="18" height="18" viewBox="0 0 48 48">
<path fill="#EA4335" d="M24 9.5c3.2 0 6.1 1.1 8.4 3.2l6.3-6.3C34.8 2.5 29.7 0 24 0 14.6 0 6.6 5.4 2.7 13.3l7.7 6C12.3 13 17.7 9.5 24 9.5z"/>
<path fill="#4285F4" d="M46.1 24.5c0-1.7-.1-3-.4-4.4H24v8.4h12.4c-.3 2-1.6 5-4.5 7l7 5.4c4.1-3.8 6.5-9.4 6.5-16.4z"/>
<path fill="#FBBC05" d="M10.4 28.9c-.5-1.4-.8-2.9-.8-4.4s.3-3 .8-4.4l-7.7-6C1 17.4 0 20.6 0 24s1 6.6 2.7 9.3l7.7-4.4z"/>
<path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7-5.4c-2 1.3-4.6 2.2-8.9 2.2-6.3 0-11.7-3.5-13.6-8.5l-7.7 6C6.6 42.6 14.6 48 24 48z"/>
</svg>

Continue with Google

</button>


<div className="text-center text-gray-500 mb-6">
or
</div>


{/* FORM */}

<form onSubmit={handleSubmit(onSubmit)}>

{/* NAME */}

<div className="mb-4">

<label className="text-sm text-gray-400">
Name
</label>

<input
type="text"
placeholder="Shivam"
className="w-full mt-1 px-3 py-2 rounded bg-[#16181d] border border-[#2a2d34] focus:outline-none focus:border-green-500"
{...register("firstName")}
/>

{errors.firstName && (
<p className="text-red-400 text-sm mt-1">
{errors.firstName.message}
</p>
)}

</div>


{/* EMAIL */}

<div className="mb-4">

<label className="text-sm text-gray-400">
Email
</label>

<input
type="email"
placeholder="shivam@gmail.com"
className="w-full mt-1 px-3 py-2 rounded bg-[#16181d] border border-[#2a2d34] focus:outline-none focus:border-green-500"
{...register("emailId")}
/>

{errors.emailId && (
<p className="text-red-400 text-sm mt-1">
{errors.emailId.message}
</p>
)}

</div>


{/* PASSWORD */}

<div className="mb-6">

<label className="text-sm text-gray-400">
Password
</label>

<div className="relative">

<input
type={showPassword ? "text" : "password"}
placeholder="••••••••"
className="w-full mt-1 px-3 py-2 rounded bg-[#16181d] border border-[#2a2d34] focus:outline-none focus:border-green-500"
{...register("password")}
/>

<button
type="button"
className="absolute right-3 top-3 text-gray-400"
onClick={()=>setShowPassword(!showPassword)}
>

{showPassword ? "🙈" : "👁"}

</button>

</div>

{errors.password && (
<p className="text-red-400 text-sm mt-1">
{errors.password.message}
</p>
)}

</div>


{/* SIGNUP BUTTON */}

<button
type="submit"
disabled={loading}
className="w-full py-2 rounded bg-green-600 hover:bg-green-700 transition"
>

{loading ? "Signing Up..." : "Create Account"}

</button>

</form>


{/* LOGIN LINK */}

<div className="text-center mt-6 text-sm text-gray-400">

Already have an account?{" "}

<NavLink
to="/login"
className="text-green-500 hover:underline"
>
Login
</NavLink>

</div>

</div>

</div>

);
}

export default Signup;