import "./mainScene.css"
import {useEffect, useRef}  from "react";
import {OrbitControls, useGLTF, useHelper, Float } from "@react-three/drei"
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'


/*

--Purpose--

We have <OrbitControls/> included which allows the user to manipulate the scene via mouse.

We start by rendering a Blender scene called './carscene_Dracco.glb' which is 
set to rotate infinitely with useFrame(). We also have torusKnotsList rendered via a 'for' list and inside a <group/> which is
rotating as well with a useFrame(). Note that the wireframe boolean is set to "true"

Then we render the Blender model we made in the tutorial called './Day1_013_compressed.glb' which is not rotating.
This transition is made with the visible={} tag which renders the object when the input is true. Not rendering it does also
save on performance. Though not on VRAM/RAM the way rendering it conditionally does. But doing it that way does introduce a stutter
and sudden performance loss as ThreeJS has to cleanup, dispose, and re-render all the objects so we chose to do it using 
visible={} than with conditional renderling like in App.tsx

Some spheres in meshToon also exist. A cube in meshToon can change color via an onClick event listener

--Structure--
* some lists for rendering knots and spheres

* a large useEffect that handles the fade-in opacity effect on the car sceneas well as animating the lights themselves

* a useFrame() which rotates the car scene and the wireframe knots

* then various Blender models are rendred with <primitive/> tags as well as spheres, knots (inside a group), a cube, and light sources.
Heavy use of visible={}.

*/








const torusKnotsList = [
  { id: 1, position: [7, 26, 5], arg_values: [1, 3, 3, 13, 17, 13], scale: 1, color: "#e1cb82", floatIntensity: 3 },
  { id: 2, position: [-6, 22, 2], arg_values: [1, 3, 3, 13, 17, 13], scale: 1, color: "#a28cf1", floatIntensity: 2 },
  { id: 3, position: [3, 28, -6], arg_values: [2, 3, 3, 13, 17, 13], scale: 1, color: "#64b5f6", floatIntensity: 5 },
  { id: 4, position: [0, 30, 8], arg_values: [3, 3, 3, 13, 17, 13], scale: 1, color: "#ef5350", floatIntensity: 4 },
];// list to be rendered in a "for" statement


const sphereList = [
  { id: 1, position: [7, 3, 5], arg_values: [1.4, 30, 15], scale: 1, color: "#e1cb82"},
  { id: 2, position: [-6, 6, 2], arg_values: [2.4, 30, 15], scale: 1, color: "#a28cf1"},
  { id: 3, position: [3, 8, -6], arg_values: [1.9, 30, 15], scale: 1, color: "#64b5f6"},
  { id: 4, position: [0, 11, 8], arg_values: [2.3, 30, 15], scale: 1, color: "#ef5350"}
];// list to be rendered in a "for" statement



//the preload() occurs immediately! On startup of localhost. long before <CarScene/> is rendered.
useGLTF.preload('./carscene_Dracco.glb');//preloads to prevent THREE.WebGLRenderer: Context Lost since WebGL would be overwhelmed with the unmount of </moonScene.tsx> and loading this
useGLTF.preload('./Day1_013_compressed.glb');//preloads to prevent THREE.WebGLRenderer: Context Lost since WebGL would be overwhelmed with the unmount of </moonScene.tsx> and loading this
//preloaded glb will not be lost even on component dismount. yay.



interface CarSceneProps {
  sectionTracker: {
    moon_finish: boolean;
    car_start: boolean;
    car_changeScene: boolean;
  };
  handle_setSectionTracker: (sect: 'moon_finish' | 'car_start' | 'car_changeScene') => void;
}

export default function CarScene({ sectionTracker, handle_setSectionTracker }: CarSceneProps)
{
  
  const { scene } = useThree();

  const car_scene = useGLTF('./carscene_Dracco.glb')
  const carRef = useRef<THREE.Group>(null);

  const KnotsGroupRef = useRef<THREE.Group>(null);

  const Day13_scene = useGLTF('./Day1_013_compressed.glb')

  const pointLightRef = useRef<THREE.PointLight>(null!);
  useHelper(pointLightRef, THREE.PointLightHelper, 2, 'teal');

  const spotLightRef = useRef<THREE.SpotLight>(null!);
  useHelper(spotLightRef, THREE.SpotLightHelper, 'red');

  const ambiLightRef = useRef<THREE.AmbientLight>(null!);

  const toonSphere = useRef<THREE.Mesh>(null);

  const changeColor = () =>//changes color of cube randomly
  {
    if(toonSphere.current){
      // We must cast the material or access it safely since THREE.Material doesn't guarantee a color property by default
      const material = toonSphere.current.material as THREE.MeshToonMaterial;
      material.color.set(`hsl(${Math.random() * 360}, 100%, 75%)`);
    }//if
  };

  useEffect(() => {

    if(sectionTracker.moon_finish && !sectionTracker.car_start){

      car_scene.scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (mesh.material) {
            const material = mesh.material as THREE.Material;
            material.transparent = true;
            material.opacity = 0;
          }//if
        }//if
      });
      handle_setSectionTracker('car_start')//set to true
    }//if

    if(sectionTracker.car_start){ //now its true so show scene

      car_scene.scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (mesh.material) {
            const material = mesh.material as THREE.Material;
            material.transparent = true;
            
            // Animate the opacity from 0 to 1
            gsap.to(material, {
              opacity: 1,
              duration: 2,
              delay: 0.4,
              ease: "power2.inOut"
            });
          }//if
        }//if
      });
    }//if



    if(sectionTracker.car_changeScene){
      /*
      //meshBasic conversion
      Day13_scene.scene.traverse((child) => { //converts to meshBasic
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (mesh.material) {
            const sourceMaterial = mesh.material as THREE.Material & {
              map?: THREE.Texture;
              color?: THREE.Color | string | number;
            };
            mesh.material = new THREE.MeshBasicMaterial({
              map: sourceMaterial.map, // preserve texture
              color: sourceMaterial.color ?? 0xffffff
            });
          }
        }
      });
      */


      /*
      //meshToon conversion
      Day13_scene.scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (mesh.material) {
            const sourceMaterial = mesh.material as THREE.Material & {
              map?: THREE.Texture;
              color?: THREE.Color | string | number;
            };
            mesh.material = new THREE.MeshToonMaterial({ // <-- Changed to MeshToonMaterial
              map: sourceMaterial.map, // preserve texture
              color: sourceMaterial.color ?? 0xffffff
            });
          }
        }
      });
      */


      if (scene.background instanceof THREE.Color) {
        const targetBgColor = new THREE.Color('#ffee90');
        gsap.to(scene.background, {
          r: targetBgColor.r,
          g: targetBgColor.g,
          b: targetBgColor.b,
          duration: 2,
          ease: 'power4.inOut'
        });
      }//if

      gsap.to( ambiLightRef.current, {
        intensity: 40,
        duration: 2,
        ease: "power2.inOut"
      })

      
      gsap.to( pointLightRef.current, {
        intensity: 600,
        duration: 2,
        ease: "power2.inOut",
      })


      gsap.to(pointLightRef.current.color, {
        r: 1,
        g: 1,
        b: 1,
        duration: 2,
        ease: "power2.inOut"
      });

    }//if

  }, [sectionTracker.moon_finish, scene.background, sectionTracker.car_start, handle_setSectionTracker, car_scene.scene, sectionTracker.car_changeScene]);


  useFrame((_state, delta) => { //normally it is "state", but we did "_state" to tell TypeScript that it is being intentionally ignored. so npm run deploy works now
    if(carRef.current && KnotsGroupRef.current) {
      carRef.current.rotation.y += delta * 0.2; //rotates the primitive
      KnotsGroupRef.current.rotation.y += delta * 0.15//rotates the group containg all the objects
    }//if
  })


  
  return(
  <>
    
    <OrbitControls makeDefault/> {/* automatically looks at 0,0,0. Camera animations stop working completely */}
    
    <group position-z={-4.2} position-x={0} position-y={-1}>
      <primitive
        ref={carRef}
        object={car_scene.scene}
        scale={0.5}
        visible={sectionTracker.car_start && !sectionTracker.car_changeScene}
        /*
        we CAN conditionally render both <primitive/> which saves on ram/vram.
        But the browser has to take the geometry and texture data and push it back to the GPU. This is an expensive operation and will almost always cause a noticeable frame drop or "hitch" exactly when the model appears.
        Also if you simultaneously mount and unmount <primitve/>s, it can overwhelm the 
        WebGL pipeline giving you a "THREE.WebGLRenderer: Context Lost" message.

        The "THREE.WebGLRenderer: Context Lost" message occurs when the GPU runs out of memory or the WebGL instruction pipeline gets overwhelmed, prompting the browser to kill the context to prevent a system-wide hardware crash.

        In App.tsx, saving on ram is worthwhile given we have scene transitions to hide somewhat it. 
        But not here. So playing with visibility is better than conditionally rendering it.
        The stutter isn't acceptable here.

        turning off visiblity does save FPS as ThreeJS knows not to include it in its light source calculations during render. Just not the ram/vram.

        TL:DR
        Visibility - saves FPS - no lag on change
        Conditional Rendering - saves FPS and ram/vram - can cause a stutter as models, light sources are removed and added
        
        PS: destroying light sources is ESPECIALLY bad in terms of FPS loss.
        When you add or remove a light source, Three.js has to recompile the shader programs for all materials currently in the scene to accommodate the new lighting setup.
        Do not remove light sources unless you need to unmount an entire scene. Otherwise just set visibility or intensity to 0.
        */
      />


      <group ref={KnotsGroupRef} visible={sectionTracker.car_changeScene}>
        {/* 'for' statement */}
        {torusKnotsList.map((knot) => (
          <Float key={knot.id} floatIntensity={knot.floatIntensity}>
            <mesh position={[knot.position[0], knot.position[1], knot.position[2]]} scale={knot.scale}>{/* x y z. */}
              <torusKnotGeometry args={knot.arg_values as [number, number, number, number, number, number]} /> {/* can do "as [...]" instead of knot.arg_values[#] */}
              <meshBasicMaterial wireframe={true} color={knot.color}/> {/* wireframe is on */}
            </mesh>
          </Float>
        ))}
      </group>


      <primitive
        object={Day13_scene.scene}
        scale={10}
        visible={sectionTracker.car_changeScene}
      />

      {sphereList.map((sphere) => (
        <mesh key={sphere.id} position={[sphere.position[0], sphere.position[1], sphere.position[2]]}  visible={sectionTracker.car_changeScene} scale={sphere.scale}>{/* x y z */}
          <sphereGeometry args={[sphere.arg_values[0], sphere.arg_values[1], sphere.arg_values[2]]} />
          <meshToonMaterial color={sphere.color}/>
        </mesh>
      ))}

      <mesh 
        ref={toonSphere} 
        position-x={3} position-y={7} position-z={5}
        onClick={sectionTracker.car_changeScene ? changeColor : undefined} //if true then have changeColor work
        onPointerEnter={sectionTracker.car_changeScene ? () => { document.body.style.cursor = 'pointer' } : undefined}// if true then have pointer work
        onPointerLeave={sectionTracker.car_changeScene ? () => { document.body.style.cursor = 'default' } : undefined}// if true then have pointer work
        visible={sectionTracker.car_changeScene}
        >
        <boxGeometry args={[4, 4, 4]}/>
        <meshToonMaterial color={"#fff"}/>
      </mesh>

      <pointLight 
        ref={pointLightRef} 
        position={[-2.5, 15, 0.8]} 
        intensity={300} 
        color={"#2e424b"} 
      />

      <ambientLight
      ref={ambiLightRef}
      position={[-2.5, 20, 0.8]} 
      intensity={20}
      color={"#171719"} /* crank the color up to the extreme for some funnyness!! */
      /> {/* no usehelp() from Drei on this one */}


      <spotLight 
        ref={spotLightRef} 
        position={[-6.5, 11.5, 0.6]} 
        intensity={100} 
        angle={Math.PI/6}
        color={"#e4c640"} 
        visible={!sectionTracker.car_changeScene}//Makes it dissappear. intensity=0 does the same. When an object or light is set to hidden, the Three.js renderer completely skips it during the render loop. Good for FPS.
        >
        <object3D attach="target" position={[0, -5, -3]} />{/* The spotlight will point directly at this position */}
      </spotLight>
    </group>
  </>
  )
}

