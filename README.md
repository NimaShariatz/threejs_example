We are on React V-18 because V-19 results in warnings of depracation. Not all 
libraries have been updated for 19. Notably React-Perf GPUms stops working. stuck at 0.000





Library installs:
npm install three
npm install @react-three/fiber
npm install @react-three/drei
npm install r3f-perf

1 - three: The core Three.js library.
2 - @react-three/fiber: The React renderer for Three.js.
3 - @react-three/drei: A useful collection of abstractions and helpers for React Three Fiber.
4 - r3f-perf: A performance monitor for React Three Fiber. if you get warnings you can ignore them. its because this libarry was made with react 18, but we are on 19. it should still be fine.
GPU ms-> Excellent: 1 ms - 5 ms Acceptable: 8 ms - 12 ms 

Note: Post-processing hits the GPU the hardest. Effects like pixelation, blur, and bloom require a lot of math for every pixel on the screen.
If your GPU ms is still too high, you can lower the resolution of the canvas using dpr on the <Canvas> tag (e.g., <Canvas dpr={[1, 1.5]}> to cap pixel density on high-res screens like retina density on restrict high-density mobile devices).

CPU ms-> Excellent: < 2 ms Acceptable: 3 ms - 8 ms
Note: The CPU handles React logic, GSAP animations, and updating 3D positions. In a simple scene like yours, your CPU should be very low. If it spikes, it usually means React is re-rendering too often.

npm install -D @types/three

1 - @types/three (Optional but highly recommended since you are using TypeScript in your Vite project): TypeScript definitions for Three.js. The "-D" means its a dev dependency.
In your case, @types/three just provides TypeScript definitions. It gives you autocomplete, hover documentation, and error checking in VS Code while you write your code. However, the browser doesn't understand TypeScript, so these types are stripped away during the build process and aren't included in the final application bundle that your users download.

npm install gsap

1 - animate the movement of stuff without having to use useFrame. The problem 
with useFrame being that it still triggers every frame even when it should be finished.
Still has its place of course.

Use useFrame for: Physics engines, continuous environmental effects (e.g., spinning a planet infinitely), or having an object instantly follow the mouse cursor dynamically.

Use GSAP for: Choreographed sequences, intro camera sweeps, UI-triggered animations, and scrollytelling. Its ease-of-use heavily outweighs any microscopic overhead.

npm install @react-three/postprocessing

1 - Allows us to use various post-processing effects. such as <Bloom/>.
see docs: https://react-postprocessing.docs.pmnd.rs/effects/autofocus


Mountains:

We used alot of gsap for color stuff. We used camera.lookAt(0, 0, 0); at the first camera movement
so it always looked at that point



Moon:

For camera movement, I did both movement and a 20deg rotation upwards. Not necassary, but just for example purposes.

we used a function for the stars as I wanted them destroyed. The reason being that when they are moved again to the starting point, their trail flashes back as well which makes it look like a meteor going the opposite direction. 

--------------otherwise it would just be ---------------

  const star1 = useRef<THREE.Mesh>(null);
  const star2 = useRef<THREE.Mesh>(null);



  useFrame((state, delta) =>
  {
    if(star1.current){

      if(star1.current.position.x < -200){
        star1.current.position.x = 200
        star1.current.position.y = 30
      } else {
        star1.current.position.x -= delta * 80
        star1.current.position.y -= delta * 9
      }
        
    }

    if(star2.current){

      if(star2.current.position.x < -320){
        star2.current.position.x = 300
        star2.current.position.y = 28
      } else {
        star2.current.position.x -= delta * 80
        star2.current.position.y -= delta * 7
      }
        
    }

  })





      <Trail
        width={6}          // Width of the line
        length={15}           // Length of the trail
        color={"white"} // Match the star's color
        attenuation={(t) => t * t} // Make it taper off at the end
      >
        <mesh ref={star1} position-y={ 0 } position-z={ 0 } scale={ 0.1 }> {/* z makes it behind the moon */}
            <sphereGeometry />
            <meshBasicMaterial color={"white"} toneMapped={false} />
        </mesh>
      </Trail>


      <Trail
        width={6}          // Width of the line
        length={15}           // Length of the trail
        color={"white"} // Match the star's color
        attenuation={(t) => t * t} // Make it taper off at the end
      >
        <mesh ref={star2} position-y={ 0 } position-z={ 0 } scale={ 0.1 }> {/* z makes it behind the moon */}
            <sphereGeometry />
            <meshBasicMaterial color={"white"} toneMapped={false} />
        </mesh>
      </Trail>