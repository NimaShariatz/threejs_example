import "./mainScene.css"
import { useEffect, useRef } from 'react'
import { useGLTF, Html } from "@react-three/drei"
//import { OrbitControls } from "@react-three/drei"
import { useThree } from '@react-three/fiber'
//import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap' // Import GSAP

/*

--Purpose--
Render the mountains in meshBasic which requires some TypeScript. We also assign starting colors to the mountains
as './mountains.glb' did not have any colors given to it in Blender. GSAP is used to animate the camera 
and change the colors of './mountains.glb' and the background

--Structure--
* a useEffect to set initial colors of './mountains.glb'. Also change the colors of './mountains.glb' via GSAP

* a <group/> which contains our './mountains.glb' and a <Html/> tag for throwing text in the scene. Note the occlusion field with a useRef attached
to it which hides the <Html/> tag if its behind the object 
is used for show

*/


interface MountainSceneProps {
  sectionTracker: {
    start: boolean,
    mountain_purple: boolean,
    mountain_purple_complete: boolean,
    mountain_finished: boolean

    
  };
  handle_setSectionTracker: (sect: 'start' | 'mountain_purple' | 'mountain_purple_complete' | 'mountain_finished') => void;
}

useGLTF.preload('./mountains.glb');//helps a bit with loading. Occurs on localhost launch, not on component mount.
//preloaded glb will not be lost even on component dismount. if you want to remove it from RAM, do useGLTF.clear('./mountains.glb') in App.tsx







export default function MountainScene({ sectionTracker, handle_setSectionTracker }: MountainSceneProps)
{

  const mountains_ref = useRef<THREE.Group>(null!)//just for the Drei <Html/> text
  const mountains = useGLTF('./mountains.glb')
  const { camera, scene } = useThree();


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
            color: initialColor,
            //wireframe: true
          };

          if (mesh.userData.baseMap) {
            materialParams.map = mesh.userData.baseMap;
          }//if
          mesh.material = new THREE.MeshBasicMaterial(materialParams);
        }//if
      });//for
    }//if

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
    }//if

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
      }//if
      
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
                }//if
              }
            });
          }//if
        }//if
      });//for
    }
  }, [mountains, scene, sectionTracker.start, sectionTracker.mountain_purple, sectionTracker.mountain_purple_complete, camera, handle_setSectionTracker]);





  return(
  <>

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
        A series of scenes making use of GSAP for camera and color changes. useFrame() for object movement.<br/><br/>

        Scene 1 - A low-poly Blender model rendered in meshBasic. GSAP for color changes and camera movement.<br/><br/>

        Scene 2 - No Blender models used. All in meshBasic. ThreeJS spheres used. postprocessing for Glow effect. Drei for stars and the trail effect. UseFrame() for object movement. GSAP for background color and scale change.<br/><br/>
        
        Scene 3 - Road, Car, light pole, and portal scene are all Blender. Portal scene is from Blender tutorial. All in meshBasic. Drei light helpers used for positioning. UseFrame() for constant rotation. GSAP for opacity and background color effect. Drei orbitControls to allow user manipulation. meshToon example spheres and wireframe example objects.<br/><br/>

        <small>press 'Enter' to progress</small>
    </Html>

  </group>
      
        

  
  </>
  )
}