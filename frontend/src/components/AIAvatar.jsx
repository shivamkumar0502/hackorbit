import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

function AIAvatar(){

return(

<div className="h-[400px]">

<Canvas>

<ambientLight intensity={1}/>

<mesh>

<boxGeometry args={[1,1,1]} />

<meshStandardMaterial color="purple"/>

</mesh>

<OrbitControls/>

</Canvas>

</div>

)

}

export default AIAvatar;