'use client';
import PrimarySearchAppBar from '@/components/navigation';
import Feed from '@/components/discover/feed';
import { Box } from '@mui/material';
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
}
