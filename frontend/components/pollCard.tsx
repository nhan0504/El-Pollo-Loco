import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import { ButtonGroup } from '@mui/material';

const makeCard = (tags:Array<string>, question: string, opts: Array<string>, optValues: Array<number>) => (
  <React.Fragment>
        <Card style={{display: 'flex', justifyContent: 'space-evenly', flexDirection: 'column'}}>
        <CardContent>
          
              <ButtonGroup variant="contained" aria-label="Basic button group">
              {tags.map(tag => <Button key={tag}>{tag}</Button>)}
              </ButtonGroup>
          
          <br />
          <Typography variant="h5" component="div" >
            {question}
          </Typography>
            <br />
        </CardContent>
            {opts.map((option, index) => 
                <CardActions key={option}>
                    <Button variant="contained" style={{maxWidth: '30%', maxHeight: '30%', minWidth: '30%', minHeight: '30%'}}>{option}</Button>
                    <Box sx={{ width: 3/4, boxShadow: 1}}>
                        <LinearProgress variant="determinate" value={optValues[index]} />
                    </Box>
                </CardActions>
            )}
            </Card>
  </React.Fragment>
);

export default function PollCard(tags:Array<string>, question: string, opts: Array<string>, optValues: Array<number>) {
  return (
    <Box sx={{ minWidth: 375 }}>
      <Card variant="outlined">{makeCard(tags, question, opts, optValues)}</Card>
    </Box>
  );
}