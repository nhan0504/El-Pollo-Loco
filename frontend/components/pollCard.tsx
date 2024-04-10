import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);

const card = (
  <React.Fragment>
        <Card style={{display: 'flex', justifyContent: 'space-evenly', flexDirection: 'column'}}>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Would you rather?
          </Typography>
          <br />
          <Typography variant="h5" component="div">
            Would you rather have super strength or be invisible?
          </Typography>
            <br />
            </CardContent>
            <CardActions>
              <Button variant="contained" style={{maxWidth: '30%', maxHeight: '30%', minWidth: '30%', minHeight: '30%'}}>Super Strength!</Button>
              <Box sx={{ width: 3/4, boxShadow: 1}}>
                <LinearProgress variant="determinate" value={55} />
              </Box>
            </CardActions>
            <CardActions>
              <Button variant="contained" style={{maxWidth: '30%', maxHeight: '30%', minWidth: '30%', minHeight: '30%'}}>Invisibility!</Button>
              <Box sx={{ width: 3/4, boxShadow: 1}}>
                <LinearProgress variant="determinate" value={45} />
              </Box>
            </CardActions>
            </Card>
  </React.Fragment>
);

function FormRow() {
  return (
    <React.Fragment>
      <Grid item xs={4} style={{padding: 50}}>
        {card}
      </Grid>
      <Grid item xs={4} style={{padding: 50}}>
        {card}
      </Grid>
    </React.Fragment>
  );
}

const cardsTogether = (
  <React.Fragment>
        <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={1}>
        <Grid container item spacing={3} justifyContent="space-around">
          <FormRow />
        </Grid>
        <Grid container item spacing={3} justifyContent="space-around">
          <FormRow />
        </Grid>
      </Grid>
    </Box>
  </React.Fragment>
);

export default function OutlinedCard() {
  return (
    <Box sx={{ minWidth: 275 }}>
      <Card variant="outlined">{cardsTogether}</Card>
    </Box>
  );
}