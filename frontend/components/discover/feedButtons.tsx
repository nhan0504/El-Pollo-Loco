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
        display:"flex",
        bgcolor: 'white',
        color:"white",
        width: '310px',
        maxHeight: '40px',
        p: 1,
        m: 2,
        // border: '2px solid black',
        // borderRadius: '30px',
        dropShadow:3,
      }}
    >
      <Button
        variant="text"
        size="medium"
        style={{fontSize: '16px', fontWeight: 'bold' }}
        sx={{
          ':hover': {
            // theme.palette.primary.main
            color: "black",
          },
          minWidth:"100px",
          bgcolor:"black", 
          mr: 3, 
          textTransform: 'capitalize', 
          color: 'white' }}
        //onClick={switchFeed}
      >
        Discover
      </Button>
      <Button
        variant="text"
        size="medium"
        style={{fontSize: '16px'}}
        sx={{
          ':hover': {
            // theme.palette.primary.main
            color: "white",
            bgcolor:"black",
          },
          // border: '2px solid black',
          opacity: 0.8, minWidth:"100px", bgcolor:"#eeeeee", mr: 3, textTransform: 'capitalize', color: 'black' }}
        //onClick={switchFeed}
      >
        Friends
      </Button>
      <Button
        variant="text"
        size="medium"
        style={{ fontSize: '16px'}}
        sx={{
          ':hover': {
            // theme.palette.primary.main
            color: "white",
            bgcolor:"black"
          },
          // border: '2px solid black',
          opacity: 0.8, minWidth:"100px", bgcolor:"#eeeeee", textTransform: 'capitalize', color: 'black' }}
        //onClick={switchFeed}
      >
        Following
      </Button>
    </Box>
  );
}
