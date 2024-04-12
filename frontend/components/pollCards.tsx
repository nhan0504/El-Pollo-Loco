import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import PollCard from './pollCard';



function FormRow() {
  return (
    <React.Fragment>
      <Grid item xs={4} style={{padding: 50}}>
        {PollCard(["Movies", "Lord of the rings"], "Which Lord of The rings?", ["The first", "The second", "The third"], [30, 20, 50])}
      </Grid>
      <Grid item xs={4} style={{padding: 50}}>
        {PollCard(["Movies", "Lord of the rings"], "Which Lord of The rings?", ["The first", "The second", "The third"], [30, 20, 50])}
      </Grid>
    </React.Fragment>
  );
}

const cardsTogether = (
  <React.Fragment>
      <Grid container spacing={1}>
        <Grid container item spacing={3} justifyContent="space-around">
          <FormRow />
        </Grid>
        <Grid container item spacing={3} justifyContent="space-around">
          <FormRow />
        </Grid>
      </Grid>
  </React.Fragment>
);

export default function PollCards() {
  return (
    <Box sx={{ minWidth: 275 }}>
      <Card variant="outlined">{cardsTogether}</Card>
    </Box>
  );
}