import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

const switchFeed = () => {
  // Fetch correct polls from database
  // Where is that actually happening? feed.tsx?
  // Need to notify something in feed.tsx about feed change
};

export default function FeedButtons() {
  return (
    /* Buttons to switch feeds */
    <Box
      component="section"
      sx={{
        bgcolor: 'white',
        display: { xs: 'flex' },
        width: '310px',
        height: '50px',
        p: 1,
        m: 2,
        border: '2px solid black',
        borderRadius: '30px',
        dropShadow:3
      }}
    >
      <Button
        variant="text"
        size="medium"
        style={{ fontSize: '16px', fontWeight: 'bold' }}
        sx={{borderRadius: 20, mr: 3, textTransform: 'capitalize', color: 'black' }}
        //onClick={switchFeed}
      >
        Discover
      </Button>
      <Button
        variant="text"
        size="medium"
        style={{ fontSize: '16px' }}
        sx={{borderRadius: 20, mr: 3, textTransform: 'capitalize', color: 'black' }}
        //onClick={switchFeed}
      >
        Friends
      </Button>
      <Button
        variant="text"
        size="medium"
        style={{ fontSize: '16px' }}
        sx={{ borderRadius: 20, textTransform: 'capitalize', color: 'black' }}
        //onClick={switchFeed}
      >
        Following
      </Button>
    </Box>
  );
}
