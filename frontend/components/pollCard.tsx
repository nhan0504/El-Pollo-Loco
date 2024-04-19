'use client'
import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import { ButtonGroup } from '@mui/material';
import CommentIcon from '@mui/icons-material/Comment';
import { useState } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import Stack from '@mui/material/Stack';

function makeCard(tags:Array<string>, question: string, opts: Array<string>, optValues: Array<number>, username: string) {
  
  const [cardData, setCardData] = useState({
    //all of this info will actually be fetched from database on page load I think...as parameters I guess along with everything else?
    totalVotes:0,
    opts: opts.map((opt) => {
      return {
        optionText:opt,
        votes:0
      }
    }),
    comments: 0
  })

  // pass in an index of the current option being voted on so we don't have to map through the whole list
  const addVote = (ind: number) => {
    // will be sent to database - can update locally but could  be buggy if they're not synced? could again fetch from database
    // in the future, instead of adding to totalVotes manually, we can just add all of the current vote amounts together so that
    // it doesn't get reset on page load
    cardData.opts[ind].votes += 1;
    setCardData({...cardData, totalVotes: cardData.totalVotes + 1, opts: cardData.opts})
  }

  const getPercent = (option: {optionText: string, votes: number}) => {
    if(cardData.totalVotes === 0){
      return 0;
    }

    else return (option.votes/cardData.totalVotes)*100;
  }

  return(
  <React.Fragment>
        <Card style={{display: 'flex', justifyContent: 'space-evenly', flexDirection: 'column', border: '1px', borderRadius: 15}}  variant="outlined" >
        <CardContent>
        <Stack alignItems="center" direction="row" gap={0}>
          <PersonIcon fontSize='large' />
          <Typography variant="subtitle1">{username}</Typography>
        </Stack>
          <Typography variant="h5" component="div" align="center" >
            {question}
          </Typography>
            <br />
        </CardContent>
        {/* here I'm mapping to the cardData options instead of the opts parameter, so instead of option, it's option.optionText */}
            {cardData.opts.map((option, index) => 
                <CardActions key={option.optionText}>
                    {/* Added onClick function as addVote */}
                    <Button variant="contained" value={option.optionText} onClick={(event) => addVote(index)} style={{maxWidth: '30%', maxHeight: '30%', minWidth: '30%', minHeight: '30%'}}>{option.optionText}</Button>
                    {/* using getPercent which just divides the options's votes by total votes */}
                    <Box sx={{ width: 3/4, boxShadow: 1}}>
                      <LinearProgress variant="determinate" value={getPercent(option)}/>
                    </Box>
                    <Box sx={{ minWidth: 35}}>
                      <Typography variant="body2" color="textSecondary">
                        {parseFloat(getPercent(option).toPrecision(3))}%
                      </Typography>
                    </Box>
                </CardActions>
            )}
            <CardContent sx={{color:'blue', display:'flex', justifyContent: 'space-evenly'}}>
              <Stack alignItems="center" direction="row">
                <CommentIcon fontSize="large" sx={{mr:2}}/> 
                123
              </Stack>
              <ButtonGroup variant="text" aria-label="Basic button group">
                {tags.map(tag => <Button key={tag}>{tag}</Button>)}
              </ButtonGroup>
              <br/>
            </CardContent>
        </Card>
            
  </React.Fragment>
  );
}


export default function PollCard(tags:Array<string>, question: string, opts: Array<string>, optValues: Array<number>, username: string) {
  return (
    <Box sx={{ minWidth: 375 }}>
      {makeCard(tags, question, opts, optValues, username)}
    </Box>
  );
}