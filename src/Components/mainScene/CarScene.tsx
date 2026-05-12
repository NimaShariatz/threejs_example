import { useEffect, useRef}  from "react";
import {OrbitControls, useGLTF, useHelper } from "@react-three/drei"
import { useThree } from '@react-three/fiber'

import * as THREE from 'three'
import gsap from 'gsap'

interface CarSceneProps {
  sectionTracker: {
    moon_finish: boolean;
    car_start: boolean;
    car_changeScene: boolean;
    
    
  };
  handle_setSectionTracker: (sect: 'moon_finish' | 'car_start' | 'car_changeScene') => void;
}








export default function CarScene({ sectionTracker, handle_setSectionTracker }: CarSceneProps)
{

  const { scene } = useThree();
  

  const car_scene = useGLTF('./carscene_Dracco.glb')
  
  const Day13_scene = useGLTF('./Day1_013_compressed.glb')
  

  const pointLightRef = useRef<THREE.PointLight>(null!);
  useHelper(pointLightRef, THREE.PointLightHelper, 2, 'teal');



  const spotLightRef = useRef<THREE.SpotLight>(null!);
  useHelper(spotLightRef, THREE.SpotLightHelper, 'red');

  const ambiLightRef = useRef<THREE.AmbientLight>(null!);



  useEffect(() => {

    if(sectionTracker.moon_finish && !sectionTracker.car_start){

      car_scene.scene.traverse((child) => {
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

      car_scene.scene.traverse((child) => {
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








    if(sectionTracker.car_changeScene){
      /*
      Day13_scene.scene.traverse((child) => { //converts to meshBasic
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (mesh.material) {
            const sourceMaterial = mesh.material as THREE.Material & {
              map?: THREE.Texture;
              color?: THREE.Color | string | number;
            };
            mesh.material = new THREE.MeshBasicMaterial({
              map: sourceMaterial.map, // preserve texture
              color: sourceMaterial.color ?? 0xffffff
            });
          }
        }
      });
      
      */


      if (scene.background instanceof THREE.Color) {
        const targetBgColor = new THREE.Color('#ffee90');
        gsap.to(scene.background, {
          r: targetBgColor.r,
          g: targetBgColor.g,
          b: targetBgColor.b,
          duration: 2,
          ease: 'power4.inOut'
        });
      }

      gsap.to( ambiLightRef.current, {
        intensity: 40,
        duration: 2,
        ease: "power2.inOut"
      })

      
      gsap.to( pointLightRef.current, {
        intensity: 600,
        duration: 2,
        ease: "power2.inOut",
      })
      gsap.to(pointLightRef.current.color, {
        r: 1,  // normalize to 0-1
        g: 1,
        b: 1,
        duration: 2,
        ease: "power2.inOut"
      });


    }


  }, [sectionTracker.moon_finish, scene.background, sectionTracker.car_start, handle_setSectionTracker, car_scene.scene, sectionTracker.car_changeScene]);





  
  
  return(
  <>
    <OrbitControls makeDefault/> {/* automatically looks at 0,0,0. Camera animations stop working completely */}
    <group position-z={-4.2} position-x={0} position-y={-1}>


      
      <primitive
        object={car_scene.scene}
        scale={0.5}
        visible={!sectionTracker.car_changeScene} //did NOT use conditional rendering. Can cause caching weirdness

        /*




          unmounting a <primitive> can trigger cleanup and disposal functions for 
          the model's materials and geometries. Mounting a new, potentially fully 
          un-cached heavy .glb exactly at the same time can crash the browser's 
          WebGL context.

          So the "THREE.WebGLRenderer: Context Lost" in browser warning is avoided


         */
    
      />

      <primitive
        object={Day13_scene.scene}
        scale={10}
        visible={sectionTracker.car_changeScene}
      />


      <pointLight 
        ref={pointLightRef} 
        position={[-2.5, 15, 0.8]} 
        intensity={300} 
        color={"#2e424b"} 
      />

      <ambientLight
      ref={ambiLightRef}
      position={[-2.5, 20, 0.8]} 
      intensity={20}
      color={"#171719"} /* crank the color up to the extreme for some funnyness!! */
      /> {/* no usehelp on this one */}


      <spotLight 
        ref={spotLightRef} 
        position={[-6.5, 11.5, 0.6]} 
        intensity={100} 
        angle={Math.PI/6}
        color={"#e4c640"} 
        visible={!sectionTracker.car_changeScene}//DO NOT DESTROY LIGHT SOURCES! bad for performance.
        >
        <object3D attach="target" position={[0, -5, -3]} />{/* The spotlight will point directly at this position */}
      </spotLight>







    </group>
  </>
  )
}