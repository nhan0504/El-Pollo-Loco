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
        <Card style={{display: 'flex', justifyContent: 'space-between', flexDirection: 'column'}}>
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
              <Button size="small">Super Strength!</Button>
              <Box sx={{ width: 3/4, boxShadow: 1}}>
                <LinearProgress variant="determinate" value={55} />
              </Box>
            </CardActions>
            <CardActions>
              <Button size="small">Invisibility!</Button>
              <Box sx={{ width: 3/4, boxShadow: 1}}>
                <LinearProgress variant="determinate" value={45} />
              </Box>
            </CardActions>
            </Card>
  </React.Fragment>
);

const cardsTogether = (
  <React.Fragment>
        <Grid container spacing={4}>

        <Grid item xs={6}>
          {card}
        </Grid>
        <Grid item xs={6}>
          {card}
        </Grid>
        <Grid item xs={6}>
          {card}
        </Grid>
        <Grid item xs={6}>
          {card}
        </Grid>

      

        </Grid>
  </React.Fragment>
);

export default function OutlinedCard() {
  return (
    <Box sx={{ minWidth: 275 }}>
      <Card variant="outlined">{cardsTogether}</Card>
    </Box>
  );
}