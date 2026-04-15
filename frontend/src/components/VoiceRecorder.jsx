import { useState } from "react";

function VoiceRecorder({setAnswer}) {

const [recording,setRecording] = useState(false);

const startRecording = ()=>{

const recognition = new webkitSpeechRecognition();

recognition.lang = "en-US";

recognition.onresult = (event)=>{

const transcript = event.results[0][0].transcript;

setAnswer(transcript);

};

recognition.start();

setRecording(true);

};

return(

<button
className="btn btn-primary"
onClick={startRecording}
>

{recording ? "Listening..." : "Start Speaking"}

</button>

)

}

export default VoiceRecorder;