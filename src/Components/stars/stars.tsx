import { Trail} from "@react-three/drei"
import { useState, useRef} from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'





export default function AnimatedStar({ startX, startY, speedX, speedY, resetX }: { startX: number, startY: number, speedX: number, speedY: number, resetX: number }) {
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