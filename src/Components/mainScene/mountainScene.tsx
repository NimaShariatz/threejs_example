import { useEffect, useRef } from 'react'
import "./mainScene.css"


import { useGLTF, Html } from "@react-three/drei"
//import { OrbitControls } from "@react-three/drei"


import { useThree } from '@react-three/fiber'
//import { useFrame } from '@react-three/fiber'

import * as THREE from 'three'

import gsap from 'gsap' // Import GSAP






interface MountainSceneProps {
  sectionTracker: {
    start: boolean,
    mountain_purple: boolean,
    mountain_purple_complete: boolean,
    mountain_finished: boolean

    
  };
  handle_setSectionTracker: (sect: 'start' | 'mountain_purple' | 'mountain_purple_complete' | 'mountain_finished') => void;
}






export default function MountainScene({ sectionTracker, handle_setSectionTracker }: MountainSceneProps)
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

      gsap.to(camera.position, {
        x: 0,
        y: 0,
        z: 15,
        duration: 3.5,
        delay: 0.8,
        ease: "power1.inOut",
        onUpdate: () => {
          // Continuously point the camera at the mountain's coordinates as it moves
          //camera.lookAt(mountains_ref.current.position);
          camera.lookAt(0, 0, 0);

        },
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
          duration: 1,
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
              duration: 1,
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
  }, [mountains, scene, sectionTracker.start, sectionTracker.mountain_purple, sectionTracker.mountain_purple_complete, camera, handle_setSectionTracker]);





  return(
  <>
  {/*<OrbitControls makeDefault />*/}
  

  {/* results in a performance hit. multisampling is anti-aliasing. should keep to 0. max is 8 */}


  <group ref={ mountains_ref } position-z={-10} position-x={4} position-y={-2}>
    <primitive
      object={mountains.scene}
      scale = { 1.2 }
    />
    <Html
      position={ [ 0, 3, 15 ] }
      wrapperClass="text_in_scene" //Classname for MountainScene.css
      center
      distanceFactor={ 5 } //size
      occlude={ [ mountains_ref ] } //text dissappears when covered by object
    >
        A series of scenes making use of GSAP for camera and color changes. useFrame() for object movement.<br/>

        Scene 1 - A low-poly Blender model rendered in meshBasic. GSAP for color changes and camera movement.<br/><br/>

        Scene 2 - No Blender models used. All in meshBasic. ThreeJS spheres used. postprocessing for Glow effect. Drei for stars and the trail effect. UseFrame() for object movement. GSAP for background color change.<br/><br/>
        
        Scene 3 - Road, Car, light pole, and portal scene are all Blender. Portal scene is from Blender tutorial. All in meshBasic. Drei light helpers used for positioning. UseFrame() for constant rotation. GSAP for opacity and background color effect. Drei orbitControls to allow user manipulation. meshToon example spheres and wireframe example objects.<br/><br/>

        <small>press 'Enter' to progress</small>
    </Html>

  </group>
      
        

  
  </>
  )
}