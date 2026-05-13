
import './App.css'
import { Perf } from "r3f-perf"

import { Canvas } from '@react-three/fiber'
import {useState, useEffect } from 'react'
import MountainScene from './Components/mainScene/mountainScene'
import MoonScene from './Components/mainScene/moonScene'
import CarScene from './Components/mainScene/carScene'



function App() {

  const [startMusic, setStartMusic] = useState(false);
  
  const [sectionTracker, setSectionTracker] = useState({
    start: false,
    mountain_purple: false,
    mountain_purple_complete: false,
    mountain_finished: false,
    moon_start: false,
    moon_finish: false,
    car_start: false,
    car_changeScene: false
  })
  const handle_setSectionTracker = (sect: 'start' | 'mountain_purple' | 'mountain_purple_complete' | 'mountain_finished' | 'moon_start' | 'moon_finish' | 'car_start' | 'car_changeScene') => {
    setSectionTracker(prev => ({ ...prev, [sect]: true }))
  }


  //Listen for the Enter key press
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      //console.log(sectionTracker)
      if (event.key === 'Enter') {
        if(!sectionTracker.start){
          handle_setSectionTracker('start');
          setStartMusic(true)
        }else if(sectionTracker.mountain_purple_complete && !sectionTracker.mountain_finished){
          handle_setSectionTracker('mountain_finished');

        }else if(sectionTracker.moon_start && !sectionTracker.moon_finish){
          handle_setSectionTracker('moon_finish')
        }else if(sectionTracker.moon_finish && !sectionTracker.car_changeScene){
          handle_setSectionTracker('car_changeScene')
        }
      }
    };


    window.addEventListener('keydown', handleKeyDown);
    // Cleanup the event listener when component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  });


  useEffect(() =>{
      const bgAudio = new Audio('./Macroblank - Glyph Chamber.m4a');
      bgAudio.loop = true;
      bgAudio.volume = 0.3;
      bgAudio.play()
  }, [startMusic])

  return (
    <>
    <div className='canvas_container'>


    <Canvas
      //flat
      // ^^ optional. change to the render's tonemapping. makes the colors more flat. Does have an effect on both meshBasic and meshStandard! 
      //on meshStandard, the colors pop much more without flat.
      //on meshbasic, the colors pop much more with flat. Noticable on the CarScente.tsx.
      /*Note: the usage of flat does not effect mountaints.glb because we are directly assigning hex value colors. so the use of 
       flat does not change it in any way. Where for say carsScene.tsx/Day1_013 (rendered in meshBasic), we are using the model colors which do get effected */

      //TLDR: unless you are assigning the color of an object by code, flat will effect the colors of the model regardless of mesh type.
      
      //orthographic
      //makes camera orthographic

      camera={ {
        fov: 40,
        near: 0.1,
        far: 110,
        position: [ 5, 1.5, 15 ] //note: Z-axis is in and out. Y is up and down. X is side to side. Not the same as blender    
      } }
    >
      <Perf position="top-left" />

      <color args={ [ '#e9dbc3' ] } attach="background" />



      {!sectionTracker.moon_start && 
        <MountainScene 
          sectionTracker={sectionTracker} 
          handle_setSectionTracker={handle_setSectionTracker} 
        />
      }

      {!sectionTracker.car_start && 
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
