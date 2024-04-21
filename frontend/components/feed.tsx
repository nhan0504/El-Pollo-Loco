'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import { Grid, grid2Classes } from '@mui/material';
import PollCard from './pollCard';
import FeedButtons from './feedButtons';
import { useState, useEffect } from 'react';
import useWindowDimensions from './dimensions';
import Comments from './comments'


export default function Feed() {

  const [pollData, setPollData] = useState<any[]>();
  const [isLoading, setLoading] = useState<boolean>(true);
  // should keep track of how many "pages" have been loaded (how many batches of 6) so we can keep getting older
  // polls
  
  // Passing an empty array to useEffect means that it'll only be called on page load when the component is first rendered
  useEffect(() => {
    getPolls('discover');
  }, []);

  async function getPolls(feedType: string) {
    if (feedType === 'discover') {
      let response = await fetch('http://localhost:3000/feed', {
        method: 'GET',
      });
      let data = await response.json();
      if(response.ok && data.length > 0){
        //alert(JSON.stringify(data));
        setPollData(data);
        setLoading(false)

      } 
    }
  }

  function FormRow(pollData: any) {
    // Not the state pollData, but a parameter that contains 1 or 2 polls
    let row = []
  
    for (let i = 0; i < pollData.length; i++){
        // We can't pop off polls from the list since they need to stay in memory to rerender
        // If we needed to remove a poll for any reason, we would use setPollData with pollData.filter
        let currCard = pollData[i];
        
          row.push( <Grid item xs={4} style={{padding: 50}} key={i}>
                    {PollCard(["tag1", "tag2", "tag3"], currCard?.title, currCard?.options?.map((option: any) => ({optionText: option.option_text, votes: option.vote_count, option_id:option.option_id})), currCard?.user_id)}
                  </Grid>
          ) 
    }
   
    return (
      <React.Fragment>
          {row}
      </React.Fragment>
    );
  }

  function CardsTogether() {
    const rows = 3;
    const cols = 2;
    let grid = []
    
    for (let i = 0; i < rows; i++){
        grid.push(<Grid container item spacing={3} justifyContent="space-around" key={i}>
          {/* Give FormRow 2 polls (or 1 if there's only 1 left) at a time to form the row */}
          {FormRow(pollData?.slice(i*cols, i*cols + cols))}
      </Grid>)
    }

    return (
        <React.Fragment>
            <Grid container spacing={1}>
              {grid}
            </Grid>
        </React.Fragment>
      );
}

const {height, width} = useWindowDimensions();

  return (isLoading?
    <Box sx={{ minWidth: width, maxWidth: width, minHeight: height }}>
      <FeedButtons/>
      <div>loading...</div>
    </Box>:
    <Box sx={{ width: width}}>
      <FeedButtons/>
      {<CardsTogether/>}
    </Box>
  );
}