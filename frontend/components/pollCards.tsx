import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { ButtonGroup, Grid } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import PollCard from './pollCard';



const card2 = (tags:Array<string>, question: string, opts: Array<string>, optValues: Array<number>) => (
  <React.Fragment>
        <Card style={{display: 'flex', justifyContent: 'space-evenly', flexDirection: 'column'}}>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Tags: 
            <ButtonGroup variant="contained" aria-label="Basic button group">
            {tags.map(tag => <Button key={tag}>{tag}</Button>)}
            </ButtonGroup>
          </Typography>
          <br />
          <Typography variant="h5" component="div">
            {question}
          </Typography>
            <br />
            </CardContent>
            <CardActions>
              <Button variant="contained" style={{maxWidth: '30%', maxHeight: '30%', minWidth: '30%', minHeight: '30%'}}>Fellowship of the Ring</Button>
              <Box sx={{ width: 3/4, boxShadow: 1}}>
                <LinearProgress variant="determinate" value={40} />
              </Box>
            </CardActions>
            <CardActions>
              <Button variant="contained" style={{maxWidth: '30%', maxHeight: '30%', minWidth: '30%', minHeight: '30%'}}>The Two Towers</Button>
              <Box sx={{ width: 3/4, boxShadow: 1}}>
                <LinearProgress variant="determinate" value={30} />
              </Box>
            </CardActions>
            <CardActions>
              <Button variant="contained" style={{maxWidth: '30%', maxHeight: '30%', minWidth: '30%', minHeight: '30%'}}>Return of the King</Button>
              <Box sx={{ width: 3/4, boxShadow: 1}}>
                <LinearProgress variant="determinate" value={30} />
              </Box>
            </CardActions>
            </Card>
  </React.Fragment>
);

function FormRow() {
  return (
    <React.Fragment>
      <Grid item xs={4} style={{padding: 50}}>
        {card2(["Movies", "Lord of the rings"], "Which Lord of The rings?", ["The first", "The second", "The third"], [30, 20, 50])}
      </Grid>
      <Grid item xs={4} style={{padding: 50}}>
        {}
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