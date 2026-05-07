
import './App.css'
import { Canvas } from '@react-three/fiber'
import MainScene from './Components/mainScene/mainScene'
import {useState } from 'react'



function App() {

  const [sectionTracker, setSectionTracker] = useState({
      start: false,
      mountain_purple: false,
      mountain_purple_complete: false,
      mountain_finished: false,
  })
  const handle_setSectionTracker = (sect: 'start' | 'mountain_purple' | 'mountain_purple_complete' | 'mountain_finished') => {
      setSectionTracker(prev => ({ ...prev, [sect]: true }))
  }



  return (
    <>
    <div className='canvas_container'>
    <Canvas
        flat
        camera={ {
            fov: 40,
            near: 0.1,
            far: 110,
            position: [ 5, 1.5, 15 ] //note: z-axis is in and out. Y is up and down. X is side to side. Not the same as blender
        } }
      >
        <color args={ [ '#e9dbc3' ] } attach="background" />
        <MainScene 
            sectionTracker={sectionTracker} 
            handle_setSectionTracker={handle_setSectionTracker} 
        />    
    </Canvas>
    </div>
    </>
  )
}

export default App
