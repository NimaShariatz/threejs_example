import { useEffect, useRef } from 'react'
import "./mainScene.css"


import { OrbitControls, useGLTF, Html } from "@react-three/drei"

import { Perf } from "r3f-perf"
import { useThree } from '@react-three/fiber'
//import { useFrame } from '@react-three/fiber'

import * as THREE from 'three'

import gsap from 'gsap' // Import GSAP

//import { EffectComposer, HueSaturation } from '@react-three/postprocessing' //npm install @react-three/postprocessing@3.0





interface mainSceneProps {
  sectionTracker: {
    start: boolean,
    mountain_purple: boolean,
    mountain_purple_complete: boolean,
    mountain_finished: boolean

    
  };
  handle_setSectionTracker: (sect: 'start' | 'mountain_purple' | 'mountain_purple_complete' | 'mountain_finished') => void;
}






export default function MainScene({ sectionTracker, handle_setSectionTracker }: mainSceneProps)
{

  const mountains_ref = useRef<THREE.Group>(null!)//just for the Drei <Html/> text
  const mountains = useGLTF('./mountains.glb')
  const { camera, scene } = useThree();


  //Listen for the Enter key press
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        handle_setSectionTracker('start');
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Cleanup the event listener when component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handle_setSectionTracker]);



  useEffect(() => {

    if(!sectionTracker.start){ //starting colors
      mountains.scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          const initialColor = new THREE.Color();
          if (mesh.name === 'mountain_1') initialColor.set('#F4BA52');
          else if (mesh.name === 'mountain_2') initialColor.set('#e7bb6b');
          else if (mesh.name === 'mountain_3') initialColor.set('#e8c585');
          else if (mesh.name === 'mountain_4') initialColor.set('#e7cc9a');
          else if (mesh.name === 'mountain_5') initialColor.set('#e4d0aa');
    
          const materialParams: THREE.MeshBasicMaterialParameters = {
            color: initialColor
          };

          if (mesh.userData.baseMap) {
            materialParams.map = mesh.userData.baseMap;
          } 
          mesh.material = new THREE.MeshBasicMaterial(materialParams);
        } 
      });
    }

    // START ANIMATION
    if (sectionTracker.start && !sectionTracker.mountain_purple) {


      const bgAudio = new Audio('/Macroblank - Glyph Chamber.m4a');
      bgAudio.loop = true;
      bgAudio.volume = 0.7;

      bgAudio.play()

      gsap.to(camera.position, {
        x: 0,
        y: 0,
        z: 15,
        duration: 3.5,
        delay: 0.5,
        ease: "power1.inOut",
        onComplete: () => {
          handle_setSectionTracker('mountain_purple'); // triggers color change upon animation finishing
        }
      });
    }

    // PURPLE MOUNTAINS ANIMATION
    if (sectionTracker.mountain_purple && !sectionTracker.mountain_purple_complete) {
      if (scene.background instanceof THREE.Color) {
        const targetBgColor = new THREE.Color('#cacced');
        gsap.to(scene.background, {
          r: targetBgColor.r,
          g: targetBgColor.g,
          b: targetBgColor.b,
          duration: 2,
          ease: 'power1.in'
        });
      }
      
      mountains.scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          const targetColor = new THREE.Color();

          if (mesh.name === 'mountain_1') targetColor.set('#7178E7');
          else if (mesh.name === 'mountain_2') targetColor.set('#7c82d8');
          else if (mesh.name === 'mountain_3') targetColor.set('#9298df');
          else if (mesh.name === 'mountain_4') targetColor.set('#a3a8e6');
          else if (mesh.name === 'mountain_5') targetColor.set('#b8bbe9');

          const material = mesh.material as THREE.MeshBasicMaterial;
          if (material && material.color) {
            gsap.to(material.color, {
              r: targetColor.r,
              g: targetColor.g,
              b: targetColor.b,
              duration: 2,
              ease: 'power1.in',
              onComplete: () => {
                if (mesh.name === 'mountain_1') {
                  handle_setSectionTracker('mountain_purple_complete');
                }
              }
            });
          }
        }
      });
    }
  }, [mountains, scene, sectionTracker.start, sectionTracker.mountain_purple, sectionTracker.mountain_purple_complete, camera.position, handle_setSectionTracker]);





  return(
  <>
  <Perf position="top-left" />
  <OrbitControls makeDefault />
  

  {/* results in a performance hit. multisampling is anti-aliasing. should keep to 0. max is 8 */}
  {/* 
  <EffectComposer multisampling={ 0 }>
    <HueSaturation saturation={ -1 } />
  </EffectComposer>
  */}

  <group ref={ mountains_ref } position-z={-10} position-x={4} position-y={-2}>
    <primitive
      object={mountains.scene}
      scale = { 1.2 }
    />
    <Html
      position={ [ 0, 3, 15 ] }
      wrapperClass="text_in_scene" //Classname for mainScene.css
      center
      distanceFactor={ 5 } //size
      occlude={ [ mountains_ref ] } //text dissappears when covered by object
    >
        meshBasic mountain scene. Click to progress
    </Html>


  </group>
        
        

  
  </>
  )
}