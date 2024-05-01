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
import { useContext, useState } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import Stack from '@mui/material/Stack';
import CommentBox from './comments';
import { AuthContext } from '@/contexts/authContext';
import { useRouter } from 'next/navigation';
import Collapse from '@mui/material/Collapse';

type Option = {
  optionText: string;
  votes: number;
  option_id: number;
};

function MakeCard(
  tags: Array<string>,
  question: string,
  opts: Array<Option>,
  username: string,
) {
  //comment
  const { push } = useRouter();
  const { isAuth, setAuth } = useContext(AuthContext);
  const [cardData, setCardData] = useState({
    totalVotes: opts?.map((opt: { votes: any; }) => opt.votes).reduce((partialSum: any, a: any) => partialSum + a, 0),
    opts: [...opts?.map((opt: { optionText: any; votes: any; option_id: any; }) => {
      return {
        optionText: opt.optionText,
        votes: opt.votes,
        option_id: opt.option_id,
      };
    }), {optionText: "Show Results",
         votes: 0,
         option_id: -1
  }],
    comments: 0,
  });
  
  // A state for whether the options are collapsed, showing results
  const [collapsed, setCollapsed] = useState<boolean>(false)
  
  // pass in an index of the current option being voted on so we don't have to map through the whole list
  const AddVote = (ind: number) => {

    if (isAuth == false) {
      alert('You cannot vote without logging in. Redirecting to login page.');
      push('/auth/login');
    } else {
      fetch(`${process.env.BACKEND_URL}/polls/vote`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          option_id: cardData.opts[ind].option_id,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            return response.text().then((text) => {
              throw new Error(text);
            });
          } else {
            // show results
            setCollapsed(true)

            // update local vote count - votes fetched at page load + 1
            cardData.opts[ind].votes = cardData.opts[ind].votes + 1;
            
            setCardData({
              ...cardData,
              totalVotes: cardData.totalVotes + 1,
              opts: cardData.opts,
            });
            return response.text();
          }
        })
        .catch((error) => error.message);
      
    }

    // Should actually fetch real vote count from database in case other votes have been made in between posting and this statement
    // Otherwise it might just be slightly out of date, though it will correct on page refresh
    // setCardData({...cardData, totalVotes: cardData.totalVotes, opts: cardData.opts})
  };

  const ShowResults = () => {
    // Remove Show Results  button
    cardData.opts.pop();
    setCardData({...cardData, opts: cardData.opts})
    setCollapsed(true);
  }

  // colors for options, applied in order
  let optionColors = ["blue", "red", "#65d300", "pink", "#ebe74d", "purple", "cyan", "yellow", "brown"]

  function optionList () {

    // I think the main options buttons would look better with a border, or the outlined variant w/ different background colors

    let optList = cardData.opts?.map((option, index) => {
      
      // If it's the Show Results button, return special button
      // Will always be the last option in the list
      if (option.optionText === "Show Results"){

        return (
          <CardActions key="showresults">

            <Button
              variant="outlined"
              value="Show Results"
              onClick={(event) => ShowResults()}
              style={{ 
                fontSize: "12px", 
                maxWidth: collapsed?"0px":"35%", 
                maxHeight: '100%', 
                minWidth: collapsed?"0px":"35%", 
                minHeight: '100%' 
              }}
              sx={{
                opacity: 0.8,
                boxShadow:1,
                // Losing my mind trying to center the buttons with a container so I'm doing 
                // ml: (100% - uncollapsed width)/2
                // Not ideal but it works
                ml: "32.5%",   
              }}                
            >
              Show Results
            </Button>
        </CardActions>
        )
      }
      else{
        return (
        <CardActions key={option.optionText}>
          {/* Added onClick function as addVote */}
          <Button
            variant="contained"
            value={option.optionText}
            onClick={(event) => AddVote(index)}
            style={{ 
              fontSize: "13px", 
              maxWidth: collapsed?"40%":"100%", 
              maxHeight: '100%', minWidth: collapsed?"40%":'100%', 
              minHeight: '100%'
            }}
            sx={{
              ':hover': {
                // theme.palette.primary.main
                bgcolor: "inherit",
                color: optionColors[index]
              },
              backgroundColor: optionColors[index],
              opacity: 0.8,
              boxShadow:1
            }}                
          >
            {option.optionText}
          </Button>
          {/* using getPercent which just divides the options's votes by total votes */}
          {/* adjust width of progress bars if they're not supposed to show */}
          <Box sx={{ width: collapsed? 3 / 4 : 0, boxShadow: 2}} alignItems="center" style={{}} >
            <LinearProgress 
            variant="determinate" 
            value={getPercent(option)} 
            sx={{ 
              height:10, 
              '& .MuiLinearProgress-bar': {
                  backgroundColor: optionColors[index],
                  opacity:1
                },
            }} 
            style={{opacity:0.8}} />
          </Box>
          {/* Percentage label at the end of progress bar */}
          <Box sx={{ width: collapsed ? 55 : 0 }}>
            <Typography variant="body2" color="textSecondary">
              {parseFloat(getPercent(option).toPrecision(3))}% 
            </Typography>
          </Box>
        </CardActions>
      )}
    })

    return optList;
  }

  // Calculate percentage of votes for an option
  const getPercent = (option: { optionText: string; votes: number }) => {
    if (cardData.totalVotes === 0) {
      return 0;
    } else return (option.votes / cardData.totalVotes) * 100;
  };

  return (
    <React.Fragment>
      <Card
        sx={{boxShadow:2}}
        style={{
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          border: '1px',
          borderRadius: 15,
        }}
        variant="outlined"
      >
        <CardContent>
          <Stack alignItems="center" direction="row" gap={0}>
            <PersonIcon fontSize="medium" />
            <Typography variant="subtitle2">{username}</Typography>
            <Typography sx={{ml:28}}variant="subtitle2" align="right">{cardData.totalVotes} votes</Typography>
          </Stack>
          <br/>
          <Typography variant="h5" component="div" align="center">
            {question}
          </Typography>
          <br/>
        </CardContent>

        {optionList()}

        <CardContent sx={{ color: 'blue', display: 'flex'}}>
          {CommentBox(tags, question, opts, username)}

          <ButtonGroup variant="text" aria-label="Basic button group">
            {tags.map((tag) => (
              // On click, we'll want to transition to a "search" page that has polls w/ that tag
              <Button key={tag}>{tag}</Button>
            ))}
          </ButtonGroup>
          <br />
        </CardContent>
      </Card>
    </React.Fragment>
  );
}

export default function PollCard(
  tags: Array<string>,
  question: string,
  opts: any,
  username: string,
) {
  return <Box sx={{ minWidth: 375 }}>{MakeCard(tags, question, opts, username)}</Box>;
}
