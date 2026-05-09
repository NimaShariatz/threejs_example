import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from 'three'
import gsap from 'gsap'

interface TreeSceneProps {
  sectionTracker: {
    moon_finish: boolean;
    tree_start: boolean;
    
    
  };
  handle_setSectionTracker: (sect: 'moon_finish' | 'tree_start') => void;
}





export default function TreeScene({ sectionTracker, handle_setSectionTracker }: TreeSceneProps)
{
  const { camera, scene } = useThree();
  
  

  useEffect(() => {

    if(sectionTracker.moon_finish && !sectionTracker.tree_start){
      if (scene.background instanceof THREE.Color) {
        const targetBgColor = new THREE.Color('#ffffff');
        gsap.to(scene.background, {
          r: targetBgColor.r,
          g: targetBgColor.g,
          b: targetBgColor.b,
          duration: 1.5,
          delay: 0.7,
          ease: 'power4.inOut',
          onComplete: () => {
            handle_setSectionTracker('tree_start');
          }
        });
      }//if
    }//if

    if(sectionTracker.tree_start){
      gsap.to(camera.position, {
        x: 0,
        y: 0,
        z: 0,
        duration: 0,
        delay: 0,
        ease: "power1.inOut",       
        onComplete: () => {

      gsap.to(camera.rotation, {
        x: THREE.MathUtils.degToRad(0),//π radians (~3.14) = 180 degrees (half a circle)
        duration: 0,
        delay: 0,
        ease: "power1.inOut",
            
            onComplete: () => {
            
              const yellowColor = new THREE.Color('#FEF9E0');
              gsap.to(scene.background, {
                r: yellowColor.r,
                g: yellowColor.g,
                b: yellowColor.b,
                duration: 1.5,
                ease: 'power4.inOut'
              });

            }//onComplete

          });



        }//onComplete

      });
    }//if


  }, [sectionTracker.moon_finish, scene.background, sectionTracker.tree_start, handle_setSectionTracker, camera]);


  
  
  return(
  <>
    
    <group position-z={-30} position-x={0} position-y={0}>

      <mesh position-x={0} position-y={ 0 } position-z={ 0 } scale={ 1 }>
          <sphereGeometry />
          <meshBasicMaterial color={"red"} />
      </mesh>

      <mesh position-x={-2} position-y={ 0 } position-z={ 0 } scale={ 2 }>
          <sphereGeometry />
          <meshBasicMaterial color={"blue"} />
      </mesh>


    </group>
  
  </>
  )
}