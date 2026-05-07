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



Plan:

start by making the same mountain scene and intro as Yume. To move up, click.

Then the moon. Moon can be meshBasic using the postprocessing library and use the <Bloom/>. See Project58! 46:40. We use <sparkles/> for the start effect. see if we can animate the color of each in and out to make a subtle flicker. Maybe add star streakes if possible.

next click the whole thing goes black. Then zoom out. we are zooming out of the pupil! A circular eye with a similar effect to chartogne taillet.

click again and camera goes into the pupil. spotlight to the left, maybe from drei. cubes float like water. Veines in the background light up like the moon.
END






















  useEffect(() => {
    mountains.scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const prevMaterial = mesh.material as THREE.MeshStandardMaterial;
        let meshColor = prevMaterial.color;

        if (mesh.name === 'mountain_1') {
          meshColor = new THREE.Color('#7178E7');
        } else if (mesh.name === 'mountain_2') {
          meshColor = new THREE.Color('#7c82d8');
        } else if (mesh.name === 'mountain_3') {
          meshColor = new THREE.Color('#9298df');
        } else if (mesh.name === 'mountain_4') {
          meshColor = new THREE.Color('#a3a8e6');
        } else if (mesh.name === 'mountain_5') {
          meshColor = new THREE.Color('#b8bbe9');
        }
        
        mesh.material = new THREE.MeshBasicMaterial({
          map: prevMaterial.map,
          color: meshColor
        });
      }
    });
  }, [mountains.scene]);