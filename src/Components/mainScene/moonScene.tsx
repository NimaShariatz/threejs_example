import {Sparkles, Stars} from "@react-three/drei"
import gsap from 'gsap'
import { useEffect, useRef} from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { EffectComposer, Bloom } from '@react-three/postprocessing'

interface MoonSceneProps {
  sectionTracker: {
    mountain_finished: boolean
    moon_start: boolean;
    mountain_purple_complete: boolean;
    
  };
  handle_setSectionTracker: (sect: 'mountain_purple_complete' | 'mountain_finished' | 'moon_start') => void;
}




export default function MoonScene({ sectionTracker, handle_setSectionTracker }: MoonSceneProps)
{
  const { camera, scene } = useThree();
  const sparklesRef = useRef<THREE.Points>(null!); // 1. Create a ref for the sparkles


  useEffect(() => {

    if(sectionTracker.mountain_finished){
      // Animate Position
      gsap.to(camera.position, {
        x: 0,
        y: 10,
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
      }

  
    }


  }, [sectionTracker.mountain_finished, handle_setSectionTracker, camera, scene])





  return(
  <>
    <group position-z={-10} position-x={0} position-y={23}>
      <Sparkles ref={sparklesRef} 
        size={ 10 }
        scale={ [ 55, 20, -1 ] } //x, y, z
        speed={ 0 }
        color={ "#ffffff" }
        count={ 50 }
        opacity={1}
      />

    <Stars radius={2} depth={4} count={50} factor={2} saturation={0} fade speed={0.5} />

      <mesh position-y={ 3 } position-z={ 5 } scale={ 1.5 }>
          <sphereGeometry />
          <meshBasicMaterial color={[1.2, 1.1, 2.3]} toneMapped={false} />{/* Turn off tone mapping and boost the color over 1 so the bloom picks it up */}
      </mesh>

    </group>

     {/* hit to performance... does unfortunatley effect <Sparkles/> as well*/}
    <EffectComposer>
      <Bloom 
        luminanceThreshold={1.1}//anything with an rgb beyond 1
        intensity={1.3}
        luminanceSmoothing={0.3}
        mipmapBlur
      />
    </EffectComposer>


  </>
  )
}