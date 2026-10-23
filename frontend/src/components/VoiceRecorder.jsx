import { useState } from "react";

function VoiceRecorder({setAnswer}) {

const [recording,setRecording] = useState(false);

const startRecording = ()=>{

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (!SpeechRecognition) return;
const recognition = new SpeechRecognition();
recognition.onend = () => setRecording(false);
recognition.onerror = () => setRecording(false);

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