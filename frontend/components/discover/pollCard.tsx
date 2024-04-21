'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import { ButtonGroup, Modal } from '@mui/material';
import CommentIcon from '@mui/icons-material/Comment';
import { useContext, useState } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import Stack from '@mui/material/Stack';
import CommentBox from './comments';
import { AuthContext } from '@/contexts/authContext';
import { useRouter } from 'next/navigation';
import ErrorModal from '../errorMessage';



function MakeCard(tags:Array<string>, question: string, opts:{optionText:string, votes:number, option_id:number}, username:string) {
  //comment
  const { push } = useRouter();
  const {isAuth, setAuth} = useContext(AuthContext);
  const [voted, setVoted] = useState(false);
  const [cardData, setCardData] = useState({

    totalVotes:opts?.map((opt)=>opt.votes).reduce((partialSum, a) => partialSum + a, 0),
    opts: opts?.map((opt) => {
      return {
        optionText:opt.optionText,
        votes:opt.votes,
        option_id:opt.option_id
      }
    }),
    comments: 0,
  });

  // pass in an index of the current option being voted on so we don't have to map through the whole list
  const AddVote = (ind: number) => {
    if (isAuth==false){
      alert("You cannot vote without logging in. Redirecting to login page.");
      push("/auth/login");
    }
    else{
    const request = {
      method: 'POST', 
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify(
          {
              option_id:cardData.opts[ind].option_id
          }
      )
    }
    if (voted==false){
    fetch('http://localhost:3000/polls/vote', request).then(response => {
            if(!response.ok){
                
                return response.text().then(text => {throw new Error(text)})
            }
            else{

              cardData.opts[ind].votes = cardData.opts[ind].votes + 1;
              setCardData({...cardData, totalVotes: cardData.totalVotes + 1, opts: cardData.opts});
              setVoted(true);
              return response.text()
            
            }
        })
        .catch(error => error.message);
      }
    }

    // Should actually fetch real vote count from database in case other votes have been made in between posting and this statement
    // Otherwise it might just be slightly out of date, though it will correct on page refresh
   // setCardData({...cardData, totalVotes: cardData.totalVotes, opts: cardData.opts})
  }

  const getPercent = (option: { optionText: string; votes: number }) => {
    if (cardData.totalVotes === 0) {
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
        {cardData.opts?.map((option, index) => 
          <CardActions key={option.optionText}>
            {/* Added onClick function as addVote */}
            <Button variant="contained" value={option.optionText} onClick={(event) => AddVote(index)} style={{maxWidth: '30%', maxHeight: '30%', minWidth: '30%', minHeight: '30%'}}>{option.optionText}</Button>
    
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
        {CommentBox()} 

          <ButtonGroup variant="text" aria-label="Basic button group">
            {tags.map(tag => <Button key={tag}>{tag}</Button>)}
          </ButtonGroup>
          <br/>
        </CardContent>
      </Card>
            
  </React.Fragment>
  );
}

export default function PollCard(tags:Array<string>, question: string, opts: any, username:string) {
  
  return (
    <Box sx={{ minWidth: 375}}>
      {MakeCard(tags, question, opts, username)}
    </Box>
  );
}
