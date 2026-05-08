import {Sparkles, Trail} from "@react-three/drei"
import gsap from 'gsap'
import { useEffect, useState, useRef} from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { EffectComposer, Bloom } from '@react-three/postprocessing'








function AnimatedStar({ startX, startY, speedX, speedY, resetX }: { startX: number, startY: number, speedX: number, speedY: number, resetX: number }) {
  const starRef = useRef<THREE.Mesh>(null);
  const [resetKey, setResetKey] = useState(0);

  useFrame((_state, delta) => { //normally it is "state", but we did "_state" to tell TypeScript that it is being intentionally ignored. so npm run deploy works now
    if (starRef.current) {
      if (starRef.current.position.x < resetX) {
        // This triggers a remount. The old Trail is destroyed, and a new one 
        // spawns instantly at [startX, startY, 0] with no streak!
        setResetKey((prev) => prev + 1); 
        //console.log(state)
      } else {
        starRef.current.position.x -= delta * speedX;
        starRef.current.position.y -= delta * speedY;
      }
    }
  });

  return (
    <Trail
      key={resetKey} // <-- The key remounts the component
      width={6}
      length={15}
      color={"white"}
      attenuation={(t) => t * t}
    >
      <mesh ref={starRef} position={[startX, startY, 0]} scale={0.1}>
        <sphereGeometry />
        <meshBasicMaterial color={"white"} toneMapped={false} />
      </mesh>
    </Trail>
  );
}
















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


  useEffect(() => {
    //Make the background transition to white. Then jump to different cords for next scene. unmount this component too
  }, [sectionTracker.moon_finish])


  




  return(
  <>
    <group position-z={-10} position-x={0} position-y={23}>
      <Sparkles 
       
        size={ 15 }
        scale={ [ 55, 20, -1 ] } //x, y, z
        speed={ 0 }
        color={ "#fff" }
        count={ 50 }
        opacity={1}
      />



      <mesh position-y={ 3 } position-z={ 5 } scale={ 1.5 }>
          <sphereGeometry />
          <meshBasicMaterial color={[1.2, 1.1, 2.3]} toneMapped={false} />{/* Turn off tone mapping and boost the color over 1 so the bloom picks it up */}
      </mesh>

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