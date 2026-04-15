function ConfidenceMeter({score}){

return(

<div className="w-full bg-gray-700 rounded h-3">

<div
className="bg-green-500 h-3 rounded"
style={{width:`${score}%`}}
></div>

</div>

)

}

export default ConfidenceMeter;