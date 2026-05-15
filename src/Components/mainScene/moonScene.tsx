import {Sparkles, Trail} from "@react-three/drei"
import gsap from 'gsap'
import { useEffect, useRef} from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { EffectComposer, Bloom } from '@react-three/postprocessing'

import AnimatedStar from '../stars/stars'







interface MoonSceneProps {
  sectionTracker: {
    mountain_purple_complete: boolean;
    mountain_finished: boolean;
    moon_start: boolean;
    moon_finish: boolean;
    
    
  };
  handle_setSectionTracker: (sect: 'mountain_purple_complete' | 'mountain_finished' | 'moon_start' | 'moon_finish') => void;
}





export default function MoonScene({ sectionTracker, handle_setSectionTracker }: MoonSceneProps)
{
  const { camera, scene } = useThree();

  const star = useRef<THREE.Mesh>(null);


  useEffect(() => {

    if(sectionTracker.mountain_finished && !sectionTracker.moon_start){
      // Animate Position
      gsap.to(camera.position, {
        x: 0,
        y: 15,
        z: 25,
        duration: 3,
        delay: 0.5,
        ease: "power1.inOut",
        onComplete: () => {
          handle_setSectionTracker('moon_start'); // triggers color change upon animation finishing
        }
      });
      
      // Animate Rotation (Looking Upwards)
      //Can use LookAt if desired.
      gsap.to(camera.rotation, {
        x: THREE.MathUtils.degToRad(20),//π radians (~3.14) = 180 degrees (half a circle)
        duration: 3,
        delay: 0.5,
        ease: "power1.inOut"
      });


      if (scene.background instanceof THREE.Color) {
        const targetBgColor = new THREE.Color('#000000');
        gsap.to(scene.background, {
          r: targetBgColor.r,
          g: targetBgColor.g,
          b: targetBgColor.b,
          duration: 3.5,
          delay: 0.7,
          ease: 'power4.inOut'
        });

      }//if
      
  
    }//if

  }, [sectionTracker.mountain_finished, sectionTracker.moon_start, handle_setSectionTracker, camera, scene])




  useFrame((_state, delta) => {
    if(star.current){

      if(star.current.position.z > 200){
        star.current.position.x = 33
        star.current.position.y = 0
        star.current.position.z = 1
      } else {
        star.current.position.x -= delta * 22
        star.current.position.y -= delta * 8
        star.current.position.z += delta * 20
      }
        
    }
  })

  




  return(
  <>
    <group position-z={-10} position-x={0} position-y={29}>
      <Sparkles 
        size={ 15 }
        scale={ [ 55, 23, -1 ] } //x, y, z
        speed={ 0 }
        color={ "#fff" }
        count={ 50 }
        opacity={1}
      />


      <mesh position-x={7} position-y={ 3 } position-z={ 5 }> {/* notice how i did not use scale={ 1.5 }... */}
        <sphereGeometry args={[1.8, 30, 30]} /> {/* can be done with circleGeometry. Though because of the 20deg camera angle it would look weird*/}
        <meshBasicMaterial color={[1.2, 1.1, 2.3]} toneMapped={false} />{/* Turn off tone mapping and boost the color over 1 so the bloom picks it up */}
      </mesh>

      <Trail
        width={10}          // Width of the line
        length={20}           // Length of the trail
        color={"white"} // Match the star's color
        attenuation={(t) => t * t} // Make it taper off at the end
      >
        <mesh ref={star} position-x={ 250 } position-y={ 30 } position-z={ 0 }> {/* z makes it behind the moon */}
            <sphereGeometry args={[0.1, 20, 20]} />
            <meshBasicMaterial color={"white"} toneMapped={false} />
        </mesh>
      </Trail>


      <AnimatedStar startX={200} startY={30} speedX={80} speedY={9} resetX={-200} />
      <AnimatedStar startX={300} startY={28} speedX={80} speedY={7} resetX={-320} />
      <AnimatedStar startX={350} startY={28} speedX={50} speedY={5} resetX={-320} />



    </group>

     {/* hit to performance... does unfortunatley effect <Sparkles/> as well*/}
    <EffectComposer>
      <Bloom 
        luminanceThreshold={1.1}//anything with an rgb beyond 1
        intensity={0.8}
        mipmapBlur
      />
    </EffectComposer>


  </>
  )
}