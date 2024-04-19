"use client"
import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Grid, grid2Classes } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import PollCard from './pollCard';
import FeedButtons from './feedButtons';
import { useState, useEffect } from 'react';

function FormRow(pollData) {

  const cols = 2
  let row = []

  if(pollData){
    for (let i = 0; i < cols; i++){

      row.push( <Grid item xs={4} style={{padding: 50}}>
                {PollCard(["tag1", "tag2"], pollData.title, pollData.options.map((option) => option.optionText), "pollMaker")}
              </Grid>
      );
    }
 }
 else{
  for (let i = 0; i < cols; i++){

    row.push( <Grid item xs={4} style={{padding: 50}}>
      {/* this way, it's running the hooks in pollCard */}
      {PollCard(["tag"], "poll", ["a", "b"], "pollMaker")}
    </Grid>
    );
  }

 }

  return (
    pollData?<React.Fragment>
        {row}
    </React.Fragment>
    : <div>Loading...</div>
  );
}

function cardsTogether(pollData) {
    const rows = 2
    let grid = []
    for (let i = 0; i<rows; i++){
        grid.push(<Grid container item spacing={3} justifyContent="space-around">
                    {FormRow(pollData)}
                </Grid>)
    }

    return (

        <React.Fragment>
            <FeedButtons/>
            <Grid container spacing={1}>
              {grid}
            </Grid>
        </React.Fragment>
      );
}


export default function Feed() {

  const [pollData, setPollData] = useState();
  
  // Passing an empty array to useEffect means that it'll only be called on page load when the component is first rendered
  useEffect(() => {
    getPolls("discover")
  }, [])

  async function getPolls(feedType){

    if(feedType === "discover"){
  
      let response = await fetch("http://localhost:3000/feed");
      let data = await response.json();
      if(response.ok){
        alert(JSON.stringify(data));
        setPollData(data);

      }
      
    }
  }

  return (
    <Box sx={{ minWidth: 275 }}>
      {cardsTogether(pollData)}
    </Box>
  );
}