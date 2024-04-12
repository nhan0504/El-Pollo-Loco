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



function FormRow() {
    const cols = 2
    let row = []
    for (let i = 0; i<cols; i++){
        row.push(<Grid item xs={4} style={{padding: 50}}>
            {PollCard(["Movies", "Lord of the rings"], "Which Lord of The rings?", ["The first", "The second", "The third"], [30, 20, 50])}
          </Grid>)

    }


  return (
    <React.Fragment>
        {row}
    </React.Fragment>
  );
}

function cardsTogether() {
    const rows = 2
    let grid = []
    for (let i = 0; i<rows; i++){
        grid.push(<Grid container item spacing={3} justifyContent="space-around">
                    <FormRow />
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
  return (
    <Box sx={{ minWidth: 275 }}>
      {cardsTogether()}
    </Box>
  );
}