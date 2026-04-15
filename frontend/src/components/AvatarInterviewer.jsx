function AvatarInterviewer({question}){

 return(

 <div className="bg-[#1a1d23] p-4 rounded">

 <img
 src="/ai-avatar.png"
 className="w-24 h-24 rounded-full"
 />

 <p className="mt-3">

 {question}

 </p>

 </div>

 )

}

export default AvatarInterviewer;
