'use client';
import PrimarySearchAppBar from '@/components/navigation';
import Feed from '@/components/discover/feed';
import { Box } from '@mui/material';
<<<<<<< HEAD
import { useState } from 'react';

export default function Navigation() {
  const [pollData, setPollData] = useState([]);
  
  return (
    <div>
      <PrimarySearchAppBar setPollData={setPollData} />
      <Box sx={{ flexGrow: 1 }} />
      <Feed pollData={pollData} setPollData={setPollData} />
    </div>
  );
=======
import { useState, useEffect } from 'react';

export default function Navigation() {
  const [pollData, setPollData] = useState([]);
  // Can't access localStorage in feed.tsx until the window is properly loaded
  const [windowLoaded, setWindowLoaded] = useState(false);

  const getDiscoverFeed = () => {
    return (
      <div>
        <PrimarySearchAppBar setPollData={setPollData} />
        <Box sx={{ flexGrow: 1 }} />
        <Feed pollData={pollData} setPollData={setPollData} />
      </div>
    );
  }

  useEffect(() => {
    setWindowLoaded(true);    
  },[])

  if(windowLoaded)
    return getDiscoverFeed();

>>>>>>> 9628e48da50473a3756009679d08eab72724d740
}
