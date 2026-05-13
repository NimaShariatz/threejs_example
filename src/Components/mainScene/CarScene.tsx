import { useEffect, useRef}  from "react";
import {OrbitControls, useGLTF, useHelper, Float } from "@react-three/drei"
import { useThree, useFrame } from '@react-three/fiber'

import * as THREE from 'three'
import gsap from 'gsap'




const torusKnotsList = [
  { id: 1, position: [7, 30, 5], scale: 0.1, color: "#e1cb82", floatIntensity: 3 },
  { id: 2, position: [-6, 26, 2], scale: 0.19, color: "#a28cf1", floatIntensity: 2 },
  { id: 3, position: [3, 32, -6], scale: 0.08, color: "#64b5f6", floatIntensity: 5 },
  { id: 4, position: [0, 34, 8], scale: 0.12, color: "#ef5350", floatIntensity: 4 },
];


const sphereList = [
  { id: 1, position: [7, 3, 5], scale: 0.13, color: "#e1cb82"},
  { id: 2, position: [-6, 6, 2], scale: 0.21, color: "#a28cf1"},
  { id: 3, position: [3, 8, -6], scale: 0.11, color: "#64b5f6"},
  { id: 4, position: [0, 11, 8], scale: 0.14, color: "#ef5350"}
];







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
  const day13Ref = useRef<THREE.Group>(null);  

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
              delay: 0.4,
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





  useFrame((_state, delta) => { //normally it is "state", but we did "_state" to tell TypeScript that it is being intentionally ignored. so npm run deploy works now
    if(day13Ref.current) {
      day13Ref.current.rotation.y += delta * 0.2; // Adjust 0.2 to change the rotation speed
    }
  })

  
  
  return(
  <>
    <OrbitControls makeDefault/> {/* automatically looks at 0,0,0. Camera animations stop working completely */}
    <group position-z={-4.2} position-x={0} position-y={-1}>


      <group ref={day13Ref}> {/* we make a <group/> for the primitive so that the rotation occurs from the center of the <group/>, not the center of the <primitive/> which may or may not be exactly centered*/}
        <primitive
          object={car_scene.scene}
          scale={0.5}
          visible={sectionTracker.car_start && !sectionTracker.car_changeScene}
          /*
            unmounting a <primitive/> can trigger cleanup and disposal functions for 
            the model's materials and geometries.

            The problem is that if you render both <primitive/> conditionally, a simultaneous unmount and mount
            occurs which overwhelms WebGL. You'll get a "THREE.WebGLRenderer: Context Lost" message in the browser console.

            so we use visibility instead.

            in app.tsx the conditonal rendering is fine because the components are not mounting/unmounting simultaniously. There is time between them.
          */
      
        />
      </group>

      <primitive
        object={Day13_scene.scene}
        scale={10}
        visible={sectionTracker.car_changeScene}
      />


      {/* 'for' statement */}
      {torusKnotsList.map((knot) => (
        <Float key={knot.id} floatIntensity={knot.floatIntensity}>
          <mesh position={knot.position as [number, number, number]} scale={knot.scale}>{/* x y z */}
            <torusKnotGeometry args={[10, 3, 3, 13, 17, 13]} />
            <meshBasicMaterial wireframe={true} color={knot.color} /> {/* wireframe is on */}
          </mesh>
        </Float>
      ))}

      {sphereList.map((sphere) => (
        <mesh position={sphere.position as [number, number, number]} scale={sphere.scale}>{/* x y z */}
          <sphereGeometry args={[7, 36, 19, 0, 6.28, 6.28]} />
          <meshToonMaterial color={sphere.color} /> {/* wireframe is on */}
        </mesh>
      ))}



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