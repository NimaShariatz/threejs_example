

interface EyeSceneProps {
  sectionTracker: {
    start: boolean,
    mountain_purple: boolean,
    mountain_purple_complete: boolean,
    mountain_finished: boolean

    
  };
  handle_setSectionTracker: (sect: 'start' | 'mountain_purple' | 'mountain_purple_complete' | 'mountain_finished') => void;
}




export default function EyeScene({ sectionTracker, handle_setSectionTracker }: EyeSceneProps)
{
  return(
  <>
  
  
  
  </>
  )
}