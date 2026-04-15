export const startRecording = (stream)=>{

const recorder = new MediaRecorder(stream);

let chunks = [];

recorder.ondataavailable = e=>{
chunks.push(e.data)
}

recorder.onstop = ()=>{

const blob = new Blob(chunks,{
type:"video/webm"
})

const url = URL.createObjectURL(blob)

localStorage.setItem("interviewVideo",url)

}

recorder.start()

return recorder

}