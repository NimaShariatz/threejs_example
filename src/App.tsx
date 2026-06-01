
import './App.css'
import { Perf } from "r3f-perf"

import { Canvas } from '@react-three/fiber'
import {useState, useEffect, useRef } from 'react'
import MountainScene from './Components/mainScene/mountainScene'
import MoonScene from './Components/mainScene/moonScene'
import CarScene from './Components/mainScene/carScene'


/*

--Purpose--
Where <Canvas/> lives. Inside are a series of components that hold our 3D models
and are conditionally rendered. When the component is no longer rendered, 
RAM/VRAM storage is saved and performance is improved by not running TypeScript logic.
React-Perf is also implimented here. 

--Structure--
* sectionTracker keeps track of event tracking across various components. Done by 'Enter' event listener which uses a setter to set variables to "True".

* <Canvas/> tag and a <div/> tag outside of it for setting size. 100%, 100% in this case. The <Canvas/> tag has a "flat" variable which changes color application of imported models that don't have their color assigned by code.

* Camera is declared in <Canvas/> tag. Can be set to Orthographic or Perspective.

* React-perf is rendered here.

* Components are rendered conditionally to save on RAM, VRAM and general performance

*/



function App() {

  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const [sectionTracker, setSectionTracker] = useState({ //used for event tracking across components
    start: false,
    mountain_purple: false,
    mountain_purple_complete: false,
    mountain_finished: false,
    moon_start: false,
    moon_red: false,
    moon_finish: false,
    car_start: false,
    car_changeScene: false
  })
  const handle_setSectionTracker = (sect: 'start' | 'mountain_purple' | 'mountain_purple_complete' | 'mountain_finished' | 'moon_start' | 'moon_red' | 'moon_finish' | 'car_start' | 'car_changeScene') => {
    setSectionTracker(prev => ({ ...prev, [sect]: true }))
  }


  
  useEffect(() => {// changes state when enter is pressed
    const handleKeyDown = (event: KeyboardEvent) => { //Listen for the Enter key press
      //console.log(sectionTracker)
      if (event.key === 'Enter') {
        if(!sectionTracker.start){
          handle_setSectionTracker('start');
          
          if(!isPlaying){//music logic. ignore.
            setIsPlaying(true);
            audioRef.current?.play();
          }//if

        }else if(sectionTracker.mountain_purple_complete && !sectionTracker.mountain_finished){
          handle_setSectionTracker('mountain_finished');

        }else if(sectionTracker.moon_start && !sectionTracker.moon_red){
          handle_setSectionTracker('moon_red')
          //useGLTF.clear('./mountains.glb') clears the preloaded from RAM. Only really beneficial if our model is huge, which it absolutely is not

        }else if(sectionTracker.moon_start && !sectionTracker.moon_finish){
          handle_setSectionTracker('moon_finish')

        }else if(sectionTracker.moon_finish && !sectionTracker.car_changeScene){
          handle_setSectionTracker('car_changeScene')
        }//if
      }//if
    };//on 'Enter'


    window.addEventListener('keydown', handleKeyDown);
    // Cleanup the event listener when component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  });



  // ---- music logic. ignore.
  useEffect(() => {
    audioRef.current = new Audio('./Macroblank - Glyph Chamber.m4a');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;

    // Cleanup when the component unmounts
    return () => {
      audioRef.current?.pause();
    };
  }, []);
  const toggleMusic = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.blur();
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  // ---- music logic. ignore.


  /*
  //----- if necassary you can create a hook for checking window width and adjust camera and scale values accordingly for mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const handleResize = () => {
      console.log("asdasd"); // Moved inside the event listener
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  */


  return (
    <>
    <div className='canvas_container'>
      <button className='music_button' style={{opacity: isPlaying ? "0.75" : "0.4"}} onClick={toggleMusic}>
        <svg xmlns="http://www.w3.org/2000/svg" width={"100%"} height={"100%"} viewBox="0 0 24 24">
          <path fill="#ffffff" d="M21 3H9c-.55 0-1 .45-1 1v9.56c-.59-.34-1.27-.56-2-.56c-2.21 0-4 1.79-4 4s1.79 4 4 4s4-1.79 4-4V5h10v8.56c-.59-.34-1.27-.56-2-.56c-2.21 0-4 1.79-4 4s1.79 4 4 4s4-1.79 4-4V4c0-.55-.45-1-1-1"></path>
        </svg>
      </button>

      <Canvas
        //flat
        //orthographic

        camera={ {
          fov: 40,
          near: 0.1,
          far: 110, //anything beyond 110 distance will not be rendered, saving performanceW
          position: [ 5, 1.5, 15 ] //starting position  
        } }
        >
        <Perf position="top-left" />

        <color args={ [ '#e9dbc3' ] } attach="background" />



        {/* -- Conditional rendering --
          The benefit is that it saves on memory(RAM/VRAM) and some FPS. However there is a sudden fps drop because  
          the CPU has to garbage collect, recompile shaders (for lights), and pass heavy geometry/texture data back across the bridge to the GPU.
          So there is pros and cons. Also removing and adding light sources (carScene.tsx) makes it even worse. So adding 
          some sort of transition between scenes helps hide that.      
        */}

        {!sectionTracker.moon_start && 
          <MountainScene 
            sectionTracker={sectionTracker} 
            handle_setSectionTracker={handle_setSectionTracker}
          />
        }

        {(!sectionTracker.car_start && sectionTracker.mountain_finished) && 
          <MoonScene
            sectionTracker={sectionTracker} 
            handle_setSectionTracker={handle_setSectionTracker} 
          />
        }


        {sectionTracker.moon_finish &&
          <CarScene
            sectionTracker={sectionTracker} 
            handle_setSectionTracker={handle_setSectionTracker} 
          />
        }
        
      </Canvas>
    </div>
    </>
  )
}

export default App
