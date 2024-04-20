'use client';
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

export default function Feed() {
  const [pollData, setPollData] = useState<any[]>([]);
  const [isLoading, setLoading] = useState<boolean>(true);

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
      if (response.ok) {
        //alert(JSON.stringify(data));
        setPollData(data);
        setLoading(false);
      }
    }
  }

  function FormRow() {
    const cols = 1;
    let row = [];

    if (pollData?.length > 0) {
      for (let i = 0; i < pollData.length; i++) {
        let currCard = pollData[i];
        //alert((currCard?.options.map((option) => option.optionText)))

        row.push(
          <Grid item xs={4} style={{ padding: 50 }}>
            {PollCard(
              ['tag1', 'tag2'],
              currCard?.title,
              currCard?.options?.map((option: any) => option.option_text),
              currCard?.user_id,
            )}
          </Grid>,
        );
      }
    } else {
      for (let i = 0; i < pollData.length; i++) {
        row.push(
          <Grid item xs={4} style={{ padding: 50 }}>
            {/* this way, it's running the hooks in pollCard. It needs to run the same amount of hooks each render */}
            {PollCard(['tag'], 'poll', ['a', 'b'], 'pollMaker')}
          </Grid>,
        );
      }
    }

    return pollData?.length > 0 ? <React.Fragment>{row}</React.Fragment> : <div>Loading...</div>;
  }

  function CardsTogether() {
    const rows = 2;
    let grid = [];
    for (let i = 0; i < rows; i++) {
      grid.push(
        <Grid container item spacing={3} justifyContent="space-around">
          {<FormRow />}
        </Grid>,
      );
    }

    return (
      <React.Fragment>
        <FeedButtons />
        <Grid container spacing={1}>
          {grid}
        </Grid>
      </React.Fragment>
    );
  }

  return isLoading ? <div>loading...</div> : <Box sx={{ minWidth: 275 }}>{<CardsTogether />}</Box>;
}
