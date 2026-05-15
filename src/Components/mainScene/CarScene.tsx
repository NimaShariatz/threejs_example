import { useEffect, useRef}  from "react";
import {OrbitControls, useGLTF, useHelper, Float } from "@react-three/drei"
import { useThree, useFrame } from '@react-three/fiber'

import * as THREE from 'three'
import gsap from 'gsap'




const torusKnotsList = [
  { id: 1, position: [7, 30, 5], arg_values: [1, 3, 3, 13, 17, 13], scale: 1, color: "#e1cb82", floatIntensity: 3 },
  { id: 2, position: [-6, 26, 2], arg_values: [1, 3, 3, 13, 17, 13], scale: 1, color: "#a28cf1", floatIntensity: 2 },
  { id: 3, position: [3, 32, -6], arg_values: [2, 3, 3, 13, 17, 13], scale: 1, color: "#64b5f6", floatIntensity: 5 },
  { id: 4, position: [0, 34, 8], arg_values: [3, 3, 3, 13, 17, 13], scale: 1, color: "#ef5350", floatIntensity: 4 },
];


const sphereList = [
  { id: 1, position: [7, 3, 5], arg_values: [1.4, 30, 15], scale: 1, color: "#e1cb82"},
  { id: 2, position: [-6, 6, 2], arg_values: [2.4, 30, 15], scale: 1, color: "#a28cf1"},
  { id: 3, position: [3, 8, -6], arg_values: [1.9, 30, 15], scale: 1, color: "#64b5f6"},
  { id: 4, position: [0, 11, 8], arg_values: [2.3, 30, 15], scale: 1, color: "#ef5350"}
];



//the preload() occurs immediately! On startup of localhost. long before <CarScene/> is rendered.
useGLTF.preload('./carscene_Dracco.glb');//preloads to prevent THREE.WebGLRenderer: Context Lost since WebGL would be overwhelmed with the unmount of </moonScene.tsx> and loading this
useGLTF.preload('./Day1_013_compressed.glb');//preloads to prevent THREE.WebGLRenderer: Context Lost since WebGL would be overwhelmed with the unmount of </moonScene.tsx> and loading this
//preloaded glb will not be lost even on component dismount. yay.



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
  const carKnotsGroupRef = useRef<THREE.Group>(null);  

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
      //meshBasic conversion
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


      /*
      //meshToon conversion
      Day13_scene.scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (mesh.material) {
            const sourceMaterial = mesh.material as THREE.Material & {
              map?: THREE.Texture;
              color?: THREE.Color | string | number;
            };
            mesh.material = new THREE.MeshToonMaterial({ // <-- Changed to MeshToonMaterial
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
    if(carKnotsGroupRef.current) {
      carKnotsGroupRef.current.rotation.y += delta * 0.2; //rotates the group. the car and knots are inside the group.
    }
  })

  
  
  return(
  <>
    
    <OrbitControls makeDefault/> {/* automatically looks at 0,0,0. Camera animations stop working completely */}
    
    
    <group position-z={-4.2} position-x={0} position-y={-1}>


      <group ref={carKnotsGroupRef}> {/* we make a <group/> for the primitive so that the rotation occurs from the center of the <group/>, not the center of the <primitive/> which may or may not be exactly centered. and it rotates things isnide as well*/}
        <primitive
          object={car_scene.scene}
          scale={0.5}
          visible={sectionTracker.car_start && !sectionTracker.car_changeScene}
          /*
          we CAN conditionally render both <primitive/> which saves on ram/vram.
          But the browser has to take the geometry and texture data and push it back to the GPU. This is an expensive operation and will almost always cause a noticeable frame drop or "hitch" exactly when the model appears.
          Also if you simultaneously mount and unmount <primitve/>s, it can overwhelm the 
          WebGL pipeline giving you a "THREE.WebGLRenderer: Context Lost" message.

          The "THREE.WebGLRenderer: Context Lost" message occurs when the GPU runs out of memory or the WebGL instruction pipeline gets overwhelmed, prompting the browser to kill the context to prevent a system-wide hardware crash.

          In App.tsx, saving on ram is worthwhile given we have scene transitions to hide somewhat it. 
          But not here. So playing with visibility is better than conditionally rendering it.
          The stutter isn't acceptable here.

          turning off visiblity does save FPS as ThreeJS knows not to include it in its light source calculations during render. Just not the ram/vram.

          TL:DR
          Visibility - saves FPS - no lag on change
          Conditional Rendering - saves FPS and ram/vram - can cause a stutter as models, light sources are removed and added
          
          PS: destroying light sources is ESPECIALLY bad in terms of FPS loss.
          When you add or remove a light source, Three.js has to recompile the shader programs for all materials currently in the scene to accommodate the new lighting setup.
          Do not remove light sources unless you need to unmount an entire scene. Otherwise just set visibility or intensity to 0.
          */
        />

        {/* 'for' statement */}
        {torusKnotsList.map((knot) => (
          <Float key={knot.id} floatIntensity={knot.floatIntensity}>
            <mesh position={[knot.position[0], knot.position[1], knot.position[2]]} scale={knot.scale}>{/* x y z. */}
              <torusKnotGeometry args={knot.arg_values as [number, number, number, number, number, number]} /> {/* can do "as [...]" instead of knot.arg_values[#] */}
              <meshBasicMaterial wireframe={true} color={knot.color}/> {/* wireframe is on */}
            </mesh>
          </Float>
        ))}
      </group>

      <primitive
        object={Day13_scene.scene}
        scale={10}
        visible={sectionTracker.car_changeScene}
      />




      {sphereList.map((sphere) => (
        <mesh key={sphere.id} position={[sphere.position[0], sphere.position[1], sphere.position[2]]} scale={sphere.scale}>{/* x y z */}
          <sphereGeometry args={[sphere.arg_values[0], sphere.arg_values[1], sphere.arg_values[2]]} />
          <meshToonMaterial color={sphere.color} visible={sectionTracker.car_changeScene}/> {/* wireframe is on */}
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
      /> {/* no usehelp() from Drei on this one */}


      <spotLight 
        ref={spotLightRef} 
        position={[-6.5, 11.5, 0.6]} 
        intensity={100} 
        angle={Math.PI/6}
        color={"#e4c640"} 
        visible={!sectionTracker.car_changeScene}//Makes it dissappear. intensity=0 does the same. When an object or light is set to hidden, the Three.js renderer completely skips it during the render loop. Good for FPS.
        >
        <object3D attach="target" position={[0, -5, -3]} />{/* The spotlight will point directly at this position */}
      </spotLight>



    </group>
  </>
  )
}

