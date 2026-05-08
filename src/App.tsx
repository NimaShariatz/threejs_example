
import './App.css'
import { Canvas } from '@react-three/fiber'
import {useState, useEffect } from 'react'
import MountainScene from './Components/mainScene/mountainScene'
import MoonScene from './Components/mainScene/moonScene'



function App() {

  const [startMusic, setStartMusic] = useState(false);
  
  const [sectionTracker, setSectionTracker] = useState({
    start: false,
    mountain_purple: false,
    mountain_purple_complete: false,
    mountain_finished: false,
    moon_start: false,
  })
  const handle_setSectionTracker = (sect: 'start' | 'mountain_purple' | 'mountain_purple_complete' | 'mountain_finished' | 'moon_start') => {
    setSectionTracker(prev => ({ ...prev, [sect]: true }))
  }


  //Listen for the Enter key press
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && !sectionTracker.mountain_purple_complete) {
        handle_setSectionTracker('start');
        setStartMusic(true)
      }else if (event.key === 'Enter' && sectionTracker.mountain_purple_complete){
        handle_setSectionTracker('mountain_finished');
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
      bgAudio.volume = 0.7;
      bgAudio.play()
  }, [startMusic])

  return (
    <>
    <div className='canvas_container'>
    <Canvas
      flat
      camera={ {
        fov: 40,
        near: 0.1,
        far: 110,
        position: [ 5, 1.5, 15 ] //note: Z-axis is in and out. Y is up and down. X is side to side. Not the same as blender
      } }
    >
      <color args={ [ '#e9dbc3' ] } attach="background" />
      <MountainScene 
        sectionTracker={sectionTracker} 
        handle_setSectionTracker={handle_setSectionTracker} 
      />
      <MoonScene
        sectionTracker={sectionTracker} 
        handle_setSectionTracker={handle_setSectionTracker} 
      />
        
    </Canvas>
    </div>
    </>
  )
}

export default App
