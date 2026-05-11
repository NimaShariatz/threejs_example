import { useEffect, useRef}  from "react";
import {OrbitControls, useGLTF, useHelper } from "@react-three/drei"

import * as THREE from 'three'
import gsap from 'gsap'

interface CarSceneProps {
  sectionTracker: {
    moon_finish: boolean;
    car_start: boolean;
    
    
  };
  handle_setSectionTracker: (sect: 'moon_finish' | 'car_start') => void;
}








export default function CarScene({ sectionTracker, handle_setSectionTracker }: CarSceneProps)
{
  const blender_object = useGLTF('./carscene_Dracco.glb')
  

  const hemiLightRef = useRef<THREE.PointLight>(null!);

  useHelper(hemiLightRef, THREE.PointLightHelper, 2, 'teal');



  const spotLightRef = useRef<THREE.SpotLight>(null!);

  useHelper(spotLightRef, THREE.SpotLightHelper, 'red');





  useEffect(() => {

    if(sectionTracker.moon_finish && !sectionTracker.car_start){

      blender_object.scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (mesh.material) {
            const material = mesh.material as THREE.Material;
            material.transparent = true;
            material.opacity = 0;
          }
        }
      });

      handle_setSectionTracker('car_start')//set to true


    }//if

    if(sectionTracker.car_start){ //now its true so show scene

      blender_object.scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (mesh.material) {
            const material = mesh.material as THREE.Material;
            material.transparent = true;
            
            // Animate the opacity from 0 to 1
            gsap.to(material, {
              opacity: 1,
              duration: 2,
              ease: "power2.inOut"
            });
          }
        }
      });





    }//if


  }, [sectionTracker.moon_finish, sectionTracker.car_start, handle_setSectionTracker, blender_object.scene]);





  
  
  return(
  <>
    <OrbitControls makeDefault/> {/* automatically looks at 0,0,0. Camera animations stop working completely */}
    <group position-z={-4.2} position-x={0} position-y={-1}>




      <pointLight 
        ref={hemiLightRef} 
        position={[-2.5, 15, 0.8]} 
        intensity={300} 
        color={"#2e424b"} 
      />

      <ambientLight
      position={[-2.5, 20, 0.8]} 
      intensity={20}
      color={"#171719"} 
      /> {/* no help on this one */}


      <spotLight 
        ref={spotLightRef} 
        position={[-6.5, 11.5, 0.6]} 
        intensity={100} 
        angle={Math.PI/6}
        color={"#e4c640"} 
      >
        {/* The spotlight will point directly at this position */}
        <object3D attach="target" position={[0, -5, -3]} />
      </spotLight>


        
      <primitive
        object={blender_object.scene}
        scale = { 0.5 }
      />
      




    </group>
  </>
  )
}