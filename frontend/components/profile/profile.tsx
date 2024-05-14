'use client'
import * as React from 'react';
import { useState, useEffect, useContext, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Grid, Box } from '@mui/material';

import Button from '@mui/material/Button';
import Divider from '@mui/joy/Divider';
import Stack from '@mui/joy/Stack';
import Grow from '@mui/material/Grow';
import Typography from '@mui/joy/Typography';
import Card from '@mui/joy/Card';
import CardOverflow from '@mui/joy/CardOverflow';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

import PollCard from '../discover/pollCard';
import { AuthContext } from '@/contexts/authContext';
import CircularProgress from '@mui/material/CircularProgress';


export default function MyProfile() {

  const { push } = useRouter();

  const { isAuth, setAuth } = useContext(AuthContext);
  const [dummyDataChange, setDummyDataChange]= useState([])
  const [loading, setLoading] = useState(true);
  const [followedTags, setFollowedTags] = useState<string[]>(localStorage.getItem("tags") ? String(localStorage.getItem("tags"))?.split(",") : []);
  const [pollsVoted, setPollsVoted] = useState<{poll_id: number, option_id: number}[]>([]);
  const [totalPollsVoted, setTotalPollsVoted] = useState<number>(0);
  const [pollData, setPollData] = useState([]);
  const [userData, setUserData] = useState<{
    username: string,
    user_id: number,
    email: string,
  }>({
    username: '', 
    user_id: -1,
    email: '' 
    });

  // useMemo(() => localStorage.getItem("pollsVoted") != null ? setTotalPollsVoted(JSON.parse(String(localStorage.getItem("pollsVoted"))).length) : 0, []);
  
  useEffect(() => {
    // if(!isAuth){
    //   push('auth/login');
    // }
    // else{

      getPolls();
    // }
    
  }, []);

  async function getPolls() {
    // if(!isAuth){
    //   push('auth/login');
    // }
    try{
      setFollowedTags(localStorage.getItem("tags") != null ? (String(localStorage.getItem("tags"))?.split(",")) : []);
      let response = await fetch(`${process.env.BACKEND_URL}/feed/user/1`, {
        method: 'GET',
        credentials: 'include'
      });
      let data = await response.json();
      if (response.ok) {
        //alert(JSON.stringify(data));

        // Directly pass in the list of poll ids - can't use states
        // since they aren't set until the function exits
        await getVoted(data.map((poll: any) => {
          return poll.poll_id;
        }));

        await getUser();
        // Once we've successfully fetched the user info, load page components
        // Doing it like this because the username needs to be ready before we load
        // but polls don't necessarily have to be there right away
        setPollData(data);

        setLoading(false);
      }
      else{

      }
    }
    catch (error){

      setPollData([])
      await getVoted([]);

      await getUser();
      setLoading(false);

    }
  }

  async function getUser() {
    try{
      let response = await fetch(`${process.env.BACKEND_URL}/auth/profile`, {
        method: 'GET',
        credentials: 'include'
      });
      let data = await response.json();
      if (response.ok) {
        // alert(JSON.stringify(data));
        setUserData(data);
        // setLoading(false);
      }
      else{
        // alert(JSON.stringify(data));

      }
    }
    catch (error){
      push('auth/login')
    }
  }

   // Pass it the list of poll ids of 6 polls that were just fetched
   async function getVoted(polls: any) {
    try{
      let response = await fetch(`${process.env.BACKEND_URL}/polls/vote/voted`, {
        method: 'GET',
        credentials: 'include'
      });
      let data = await response.json();
      if (response.ok) {
        
        // Filter out any polls that the user voted on that aren't in this batch of
        // polls

        localStorage.setItem('pollsVoted', JSON.stringify(data));
        setTotalPollsVoted(data.length);
        setPollsVoted(data.filter((poll: any) => polls.includes(poll.poll_id)));
      }
      else{
        setPollsVoted([{poll_id: -1, option_id: -1}]);
      }
    }
    catch (error) {

      setPollsVoted([{poll_id: -1, option_id: -1}]);
    }
  }

  // Needed a way to directly pass the "voted" state into PollCard
  function wasVotedOn(poll_id: number){
    // See if the poll with poll_id was voted on by comparing to pollsVoted list
    let index = pollsVoted.findIndex((poll) => poll.poll_id === poll_id);
    let voted = index > -1 ? pollsVoted[index] : {poll_id: poll_id, option_id: -1};
    return voted;
  }

  function FormRow(pollData: any) {

    // Not the state pollData, but a parameter that contains 1 or 2 polls
    let row = [];

    for (let i = 0; i < pollData.length; i++) {
      // We can't pop off polls from the list since they need to stay in memory to rerender
      // If we needed to remove a poll for any reason, we would use setPollData with pollData.filter
      let currCard = pollData[i];
      let loaded = true;
      // alert(currCard.tags);

      row.push(
        <Grid item xs={6} justifyContent={"center"}
        alignItems="center"  key={i}>
          {PollCard(
            {setDummyDataChange},
            currCard,
            wasVotedOn(currCard.poll_id),
            followedTags,
            false
          )}
        </Grid>,
      );
    }

    return <React.Fragment>{row}</React.Fragment>;
  }

  function CardsTogether() {
    const rows = 3;
    const cols = 2;
    let grid = [];

    if (pollData.length > 0){
      for (let i = 0; i < rows; i++) {
        grid.push(
          <Grid container item spacing={1} justifyContent="center" key={i} alignContent={"center"}>
            {/* Give FormRow 2 polls (or 1 if there's only 1 left) at a time to form the row */}
            {FormRow(pollData?.slice(i * cols, i * cols + cols))}
          </Grid>
          );
      }
    
  
    return (
      <React.Fragment>
        <Grid container spacing={10} sx={{display:"flex", justifyContent:"center", alignContent: "center"}}>
          {grid}
        </Grid>
      </React.Fragment>
    );
    } 

    else if(pollData.length == 0 && !loading){

      return <Typography level="body-sm">You haven't made any polls yet. Click the "Create Poll" button to get started!</Typography>

    }

    else if (loading){
      return(
      <Box display="flex" justifyContent="center">
          <CircularProgress></CircularProgress>
        </Box>
      )
    }
  }

  function getTotalVotes(){

    let votes = 0;
    pollData?.map((poll: any) => {
      votes += poll?.options?.map((opt: any) => opt.vote_count).reduce((partialSum: any, a: any) => partialSum + a, 0);
    });

    return votes;
  }

  function tagList(){

    if(followedTags.length != 0 || loading)
      return(
      <Box sx={{mb:0.5, width:"490px", height:"min-content", color: 'blue', display: 'flex', alignItems:"center", alignContent:"center", flexWrap:"wrap"}}>

        {followedTags?.map((tag) => {
            if(tag != ""){
              return(
              <Button onClick={(event) => {    
              }} size="small" variant="contained" style={{fontSize: '11px', textTransform:'uppercase'}} sx={{bgcolor:"green", color:'white', mx:1, my:0.6, maxHeight:"45%"}} key={tag}>{tag} ✓</Button>
            )}
          })}
          </Box>
      )
    else if(followedTags.length == 0 && !loading){
      return (
      // <Box sx={{ display: 'flex', flexDirection:"column", alignItems:"center", alignContent:"center", flexWrap:"wrap"}}>

        <Typography level="body-sm" style={{textAlign:"center"}}>You haven't followed any tags yet.<br/>Click on blue poll tags to follow your favorites.</Typography>
      //  </Box>
      )
    }
  }

  return (loading || !isAuth ? <Box display="flex" justifyContent="center">
  <CircularProgress></CircularProgress>
</Box>:
<Grow in={true}>
    <Box sx={{ flex: 1, width: '100%' }}>
      <Box
        sx={{
          position: 'sticky',
          top: { sm: -100, md: -110 },
          bgcolor: 'background.body',
          zIndex: 9995,
        }}
      >
        
        
      </Box>
      <Stack
        spacing={2}
        sx={{
          display: 'flex',
          maxWidth: '1000px',
          mx: 'auto',
          px: { xs: 2, md: 6 },
          py: { xs: 2, md: 3 },
          // justifyContent:"center",
          alignItems:"center"
        }}
      >
        <Box sx={{ }}>
            <Typography level="h3" sx={{py:1.5, px:2}}>{userData.username}'s Profile Page</Typography>
          </Box>          
          <Stack
            direction="row"
            spacing={3}
            sx={{ display: { xs: 'none', md: 'flex' }, my: 0 }}
          >
            
            
          </Stack>
          
        <Box sx={{display:"flex", flexDirection:"row", alignItems:"baseline", alignContente:"baseline", justifyContent: "center"}}>
        
          {/* <Stack direction="row" spacing={3} sx={{display:"flex", width:"100%", alignSelf:"center", alignContent:"baseline", alignItems:"baseline"}}> */}
            <Card sx={{minWidth: "40%", minHeight: "150px", display: "flex", flexDirection: "column", m:2}}>
              
              <Typography level="title-md">Poll Stats</Typography>
              <CardOverflow sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
            
            </CardOverflow>
    
              <List sx={{display: "flex", flexDirection: "column"}}>
                <ListItem disablePadding>
                  <Typography>{pollData.length} {pollData.length != 1 ? "polls" : "poll"} created</Typography>
                </ListItem>
                <ListItem disablePadding>
                  <Typography>{getTotalVotes()} total {getTotalVotes() != 1 ? "votes" : "vote"} on their polls</Typography>
                </ListItem>
                <ListItem disablePadding>
                  <Typography>Voted {totalPollsVoted} {totalPollsVoted != 1 ? "times" : "time"}</Typography>
                </ListItem>


              </List>
        
            </Card>

            <Card sx={{minWidth: "55%", minHeight: "150px", display: "flex", flexDirection: "column", m:2}}>
              <Typography level="title-md">Followed Tags</Typography>
              <CardOverflow sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
            </CardOverflow>
              {tagList()}
            </Card>
          {/* </Stack> */}

        </Box>
        
        <Card sx={{width:"950px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
        <Typography level="title-md">Your Polls</Typography>

        <CardOverflow sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
        </CardOverflow>
        
        <CardsTogether /> 
        
          
        </Card>
      </Stack>
    </Box>
    </Grow>
  );
}