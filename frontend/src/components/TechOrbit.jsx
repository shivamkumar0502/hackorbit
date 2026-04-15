// import React from "react"

// function TechOrbit(){

// const inner = [
// "https://cdn.simpleicons.org/google",
// "https://cdn.simpleicons.org/apple",
// "https://cdn.simpleicons.org/netflix",
// "https://cdn.simpleicons.org/meta",
// "https://cdn.simpleicons.org/tesla"
// ]

// const middle = [
// "https://cdn.simpleicons.org/amazon",
// "https://cdn.simpleicons.org/microsoft",
// "https://cdn.simpleicons.org/paypal",
// "https://cdn.simpleicons.org/spotify",
// "https://cdn.simpleicons.org/uber",
// "https://cdn.simpleicons.org/oracle"
// ]

// const outer = [
// "https://cdn.simpleicons.org/nvidia",
// "https://cdn.simpleicons.org/intel",
// "https://cdn.simpleicons.org/adobe",
// "https://cdn.simpleicons.org/cisco",
// "https://cdn.simpleicons.org/samsung",
// "https://cdn.simpleicons.org/airbnb",
// "https://cdn.simpleicons.org/salesforce",
// "https://cdn.simpleicons.org/tiktok"
// ]

// function renderOrbit(list,radius){

// return list.map((logo,i)=>{

// const angle = (360/list.length)*i

// return(

// <div
// key={i}
// className="absolute top-1/2 left-1/2"
// style={{
// transform:`rotate(${angle}deg) translate(${radius}px) rotate(-${angle}deg)`
// }}
// >

// <img
// src={logo}
// alt="logo"
// className="w-10 h-10 object-contain drop-shadow-[0_0_12px_#3b82f6]"
// />

// </div>

// )

// })

// }

// return(

// <div className="relative flex justify-center items-center h-[600px]">

// {/* INNER ORBIT */}

// <div className="absolute w-[200px] h-[200px] animate-spin-slow">

// {renderOrbit(inner,100)}

// </div>


// {/* MIDDLE ORBIT */}

// <div className="absolute w-[360px] h-[360px] animate-spin-medium">

// {renderOrbit(middle,180)}

// </div>


// {/* OUTER ORBIT */}

// <div className="absolute w-[520px] h-[520px] animate-spin-slower">

// {renderOrbit(outer,260)}

// </div>


// {/* CENTER AI ROBOT */}

// <div className="absolute flex items-center justify-center">

// <div className="absolute w-32 h-32 bg-blue-200 blur-[10px] opacity-10"></div>

// <img
// src="https://cdn-icons-png.flaticon.com/512/4712/4712109.png"
// className="w-20 drop-shadow-[0_0_25px_#3b82f6]"
// />

// </div>

// </div>

// )

// }

// export default TechOrbit


// import React from "react";

// const innerOrbit = [
// "https://logo.clearbit.com/google.com",
// "https://logo.clearbit.com/apple.com",
// "https://logo.clearbit.com/netflix.com",
// "https://logo.clearbit.com/meta.com",
// "https://logo.clearbit.com/tesla.com"
// ]

// const middleOrbit = [
// "https://logo.clearbit.com/amazon.com",
// "https://logo.clearbit.com/microsoft.com",
// "https://logo.clearbit.com/paypal.com",
// "https://logo.clearbit.com/spotify.com",
// "https://logo.clearbit.com/uber.com",
// "https://logo.clearbit.com/oracle.com"
// ]

// const outerOrbit = [
// "https://logo.clearbit.com/nvidia.com",
// "https://logo.clearbit.com/intel.com",
// "https://logo.clearbit.com/adobe.com",
// "https://logo.clearbit.com/cisco.com",
// "https://logo.clearbit.com/samsung.com",
// "https://logo.clearbit.com/airbnb.com",
// "https://logo.clearbit.com/salesforce.com",
// "https://logo.clearbit.com/tiktok.com"
// ]

// function renderOrbit(logos, radius) {
//   return logos.map((logo, index) => {
//     const angle = (360 / logos.length) * index;

//     return (
//       <div
//         key={index}
//         className="absolute top-1/2 left-1/2"
//         style={{
//           transform: `rotate(${angle}deg) translate(${radius}px) rotate(-${angle}deg)`
//         }}
//       >
//         <img
//           src={logo}
//           alt="company logo"
//           className="w-10 h-10 object-contain drop-shadow-[0_0_12px_#3b82f6]"
//         />
//       </div>
//     );
//   });
// }

// function TechOrbit() {
//   return (
//     <div className="relative flex justify-center items-center h-[600px]">

//       {/* INNER ORBIT */}
//       <div className="absolute w-[200px] h-[200px] animate-spin-slow">
//         {renderOrbit(innerOrbit, 100)}
//       </div>

//       {/* MIDDLE ORBIT */}
//       <div className="absolute w-[360px] h-[360px] animate-spin-medium">
//         {renderOrbit(middleOrbit, 180)}
//       </div>

//       {/* OUTER ORBIT */}
//       <div className="absolute w-[520px] h-[520px] animate-spin-slower">
//         {renderOrbit(outerOrbit, 260)}
//       </div>

//       {/* CENTER AI ROBOT */}
//       <div className="absolute flex items-center justify-center">

//         <div className="absolute w-32 h-32 bg-blue-200 blur-[10px] opacity-10"></div>

//         <img
//           src="https://cdn-icons-png.flaticon.com/512/4712/4712109.png"
//           alt="AI Robot"
//           className="w-20 drop-shadow-[0_0_25px_#3b82f6]"
//         />

//       </div>

//     </div>
//   );
// }

// export default TechOrbit;


import React from "react";

const innerOrbit = [
"https://cdn.simpleicons.org/google",
"https://cdn.simpleicons.org/apple",
"https://cdn.simpleicons.org/netflix",
"https://cdn.simpleicons.org/meta",
"https://cdn.simpleicons.org/tesla",
"https://cdn.simpleicons.org/zomato",
"https://cdn.simpleicons.org/phonepe"
]

const middleOrbit = [
"https://cdn.simpleicons.org/facebook",
"https://cdn.simpleicons.org/tcs",
"https://cdn.simpleicons.org/paypal",
"https://cdn.simpleicons.org/spotify",
"https://cdn.simpleicons.org/uber",
"https://cdn.simpleicons.org/infosys",
"https://cdn.simpleicons.org/phonepe"
]

const outerOrbit = [
"https://cdn.simpleicons.org/nvidia",
"https://cdn.simpleicons.org/intel",
"https://cdn.simpleicons.org/accenture",
"https://cdn.simpleicons.org/cisco",
"https://cdn.simpleicons.org/samsung",
"https://cdn.simpleicons.org/airbnb",
"https://cdn.simpleicons.org/swiggy",
"https://cdn.simpleicons.org/tiktok"
]

function Orbit({ logos, radius }) {
  return logos.map((logo, index) => {
    const angle = (360 / logos.length) * index;

    return (
      <div
        key={index}
        className="absolute top-1/2 left-1/2"
        style={{
          transform: `rotate(${angle}deg) translate(${radius}px) rotate(-${angle}deg)`
        }}
      >
        <img
          src={logo}
          alt="company"
          className="w-12 h-12 object-contain drop-shadow-[0_0_15px_#3b82f6]"
        />
      </div>
    );
  });
}

function TechOrbit() {
  return (
    <div className="relative flex justify-center items-center h-[600px]">

      {/* INNER ORBIT */}
      <div className="absolute w-[200px] h-[200px] animate-spin-slow">
        <Orbit logos={innerOrbit} radius={100} />
      </div>

      {/* MIDDLE ORBIT */}
      <div className="absolute w-[360px] h-[360px] animate-spin-medium">
        <Orbit logos={middleOrbit} radius={180} />
      </div>

      {/* OUTER ORBIT */}
      <div className="absolute w-[520px] h-[520px] animate-spin-slower">
        <Orbit logos={outerOrbit} radius={260} />
      </div>

      {/* CENTER AI ROBOT */}
      <div className="absolute flex items-center justify-center">

        <div className="absolute w-36 h-36 bg-blue-500 blur-[40px] opacity-20"></div>

        <img
          src="https://cdn-icons-png.flaticon.com/512/4712/4712109.png"
          alt="AI Robot"
          className="w-20 drop-shadow-[0_0_25px_#3b82f6]"
        />

      </div>

    </div>
  );
}

export default TechOrbit;