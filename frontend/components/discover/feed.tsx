'use client';
import * as React from 'react';
import { Container, Grid, Box, Pagination } from '@mui/material';
import PollCard from './pollCard';
import { useState, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Grow from '@mui/material/Grow';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Fade from '@mui/material/Fade';
import FavoriteIcon from '@mui/icons-material/Favorite';


// Should cache some info in localStorage potentially, can share across components
// and maybe decrease fetches

export default function Feed({ pollData, setPollData }: any) {

  const [isLoading, setLoading] = useState<boolean>(true);
  const [pollsVoted, setPollsVoted] = useState<{poll_id: number, option_id: number}[]>([]);
  const [noPolls, setNoPolls] = useState<boolean>(false);
  const [followedTags, setFollowedTags] = useState<string[]>([]);
  const [currFeed, setCurrentFeed] = useState<string | null>(localStorage?.getItem("feed") != null ? localStorage?.getItem("feed") : 'discover');
  const [dataChange, setDataChange] = useState<boolean>(false);
  const [page, setPage] = React.useState(1);
  
  // const [tagSelected, setTagSelected] = useState<string>("");
  // const [tagDialogOpen, setTagDialogOpen] = useState<{open:boolean, followed:boolean}>({open: false, followed: false});

  // Passing an empty array to useEffect means that it'll only be called on page load when the component is first rendered
  useEffect(() => {
    localStorage.setItem("feed", String(currFeed));
    getPolls(String(currFeed));
    // getFollowedTags();
  },[page]);
  
  useEffect(() => {
    getPolls(String(currFeed));
    getFollowedTags();
    setDataChange(false);
  }, [dataChange]);
 
  async function getPolls(feedType: string) {
    setLoading(true);
    let requestType: string = ""

    if(feedType === 'discover')
      requestType =  `/feed/${page}`
    else if(feedType === 'friends')
      requestType = `/feed/friends/${page}`
    else if(feedType === 'following')
      requestType = `/feed/tags/${page}`
    else{
      requestType = `/feed`
    }

    try{

      let response = await fetch(`${process.env.BACKEND_URL}` + requestType, {
        method: 'GET',
        credentials:'include'
      });
      
      let data = await response.json();

      if (response.ok && data.length > 0) {
        setNoPolls(false);    

        // Directly pass in the list of poll ids - can't use states
        // since they aren't set until the function exits
        await getVoted(data.map((poll: any) => {
          return poll.poll_id;
        }));

        // Wait until we have the list that tells us which polls on
        // the page have been voted on before continuing
        setPollData(data);    
        setLoading(false);
      }
    }

    catch (error) {
      setPollData([]);
      setNoPolls(true);
      setLoading(false);
    }
  }

  async function getFollowedTags(){
    try{
      let response = await fetch(`${process.env.BACKEND_URL}/tags`, {
        method: 'GET',
        credentials: 'include'
      });
      let data = await response.json();
      if (response.ok) {
        setFollowedTags(data);
        localStorage.setItem("tags", data);
      }
      else{
        setPollsVoted([{poll_id: -1, option_id: -1}]);
      }
    }
    catch (error) {

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
        
        // Set total list of polls voted on
        localStorage.setItem('pollsVoted', JSON.stringify(data));
        // Filter out any polls that the user voted on that aren't in this batch of
        // polls
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

  // Switch the feed type, refetch polls
  const switchFeed = (currFeed: string) => {
    setNoPolls(false);    
    localStorage.setItem("feed", currFeed);
    setCurrentFeed(currFeed);
    if(page != 1)
      setPage(1);
    else
      getPolls(currFeed);
  };
  
  function FeedButtons() {
    const styles = () => ({
      currFeed: {
        style:{
          fontSize: '16px', 
          fontWeight: 'bold'
         } ,
         sx:{
          ':hover': {
            // theme.palette.primary.main
            color: "white",
            bgcolor:"black"
          },
          minWidth:"100px",
          bgcolor:"black", 
          mr: 3, 
          textTransform: 'capitalize', 
          color: 'white'
        }
      },
      notCurrFeed:{
        style:{
          fontSize: '16px'
         } ,
         sx:{
          ':hover': {
            // theme.palette.primary.main
            color: "white",
            bgcolor:"black",
          },
          minWidth:"100px",
          bgcolor:"#eeeeee", 
          mr: 3, 
          textTransform: 'capitalize', 
          color: 'black'
        }
      },
    });

    let discoverStyle = styles().notCurrFeed;
    let friendsStyle = styles().notCurrFeed;
    let followingStyle = styles().notCurrFeed;
    followingStyle = styles().notCurrFeed;
    if (currFeed == 'discover')
      discoverStyle = styles().currFeed;
    else if (currFeed == 'friends')
      friendsStyle = styles().currFeed;
    else if (currFeed == 'following')
      followingStyle = styles().currFeed;
    else
      discoverStyle = styles().currFeed;


    return (
      /* Buttons to switch feeds */
      <Box
        component="section"
        sx={{
          display:"flex",
          color:"white",
          width: '310px',
          maxHeight: '40px',
          position:"absolute",
          top:"80px",
          left:"20px",
          p: 1,
          m: 2,
          // border: '2px solid black',
          // borderRadius: '30px',
          dropShadow:3,
        }}
      >
        <Button
          variant="text"
          size="medium"
          onClick={(event) => switchFeed("discover")}
          style={discoverStyle?.style}
          sx={discoverStyle?.sx}
        >
          Discover
        </Button>
        <Button
          variant="text"
          size="medium"
          onClick={(event) => switchFeed("friends")}
          style={friendsStyle?.style}
          sx={friendsStyle?.sx}
          //onClick={switchFeed}
        >
          Friends
        </Button>
        <Button
          variant="text"
          size="medium"
          onClick={(event) => switchFeed("following")}
          style={followingStyle?.style}
          sx={followingStyle?.sx}
        >
          Following
        </Button>
      </Box>
    );
  }
  
  const tagList = () => {
    
    if(followedTags?.length != 0 && currFeed == "following"){
      return(
        <Stack direction="row" sx={{ mb:0.5, pt:7, width:"1000px", color: 'blue',alignItems:"baseline", alignContent:"baseline", display: 'flex',justifyContent:"center"}}>

        <Typography noWrap style={{}} variant="h6" sx={{width:"min-content", color: "black"}}>You are following</Typography>
        {/* border:"1px solid black",  */}
        <Box sx={{ ml: 1.5, mb:0.5, width:"550px", height:"min-content", color: 'blue', display: 'flex', alignItems:"center", alignContent:"center", flexWrap:"wrap"}}>

          {followedTags?.map((tag) => {
            return(
            <Button onClick={(event) => {    
            }} size="small" variant="contained" style={{fontSize: '11px', textTransform:'uppercase'}} sx={{bgcolor:"green", color:'white', mx:1, my:0.6, maxHeight:"45%"}} key={tag}>{tag} ✓</Button>
          )})}
        </Box>
        </Stack>
      )
    }
    else
      return(<Box display='none'></Box>)
  };

  const friendList = () => {
    let friends = getStorageFriends();

    if(friends?.length != 0 && currFeed == "friends"){
      return(
        <Stack direction="row" sx={{ mb:0.5, pt:7, width:"1000px", color: 'blue',alignItems:"baseline", alignContent:"baseline", display: 'flex',justifyContent:"center"}}>

        <Typography noWrap style={{}} variant="h6" sx={{width:"min-content", color: "black"}}>You are friends with</Typography>
        {/* border:"1px solid black",  */}
        <Box sx={{ ml: 1.5, mb:0.5, width:"550px", height:"min-content", color: 'blue', display: 'flex', alignItems:"center", alignContent:"center", flexWrap:"wrap"}}>

          {friends?.map((friend) => {
            return(
            <Button onClick={(event) => {    
            }}  size="medium"variant="outlined" style={{fontSize: '14px', textTransform:'none'}} sx={{mx:1, my:0.6, maxHeight:"45%"}} key={friend}>{friend}&nbsp;<FavoriteIcon sx={{ fontSize: '20px' }}/></Button>
          )})}
        </Box>
        </Stack>
      )
    }
    else
      return(<Box display='none'></Box>)
  }


  

  function FormRow(pollData: any) {
    // Not the state pollData, but a parameter that contains 1 or 2 polls

    let row = [];


    for (let i = 0; i < pollData.length; i++) {

      // We can't pop off polls from the list since they need to stay in memory to rerender
      // If we needed to remove a poll for any reason, we would use setPollData with pollData.filter
      let currCard = pollData[i];
      let loaded = true;

      let date = new Date(Date.parse(currCard?.created_at));
      row.push(
        <Grid item xs={4} style={{ padding: 50 }} sx={{}} key={i}>
          
          {PollCard(
            {setDataChange},
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

  function getStorageFriends(){
    let value = localStorage.getItem("friends")
    return value != null ? value.split(",") : []
  }

  function getStorageTags(){
    let value = localStorage.getItem("tags")
    return value != null ? value.split(",") : []
  }

  function PageBar() {
    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
      setPage(value);
    };
    
    if(!noPolls){
      return (
      <Box display="flex" justifyContent='center' alignItems="center"> 
        <Stack spacing={2}>
          <Pagination count={10} page={page} onChange={handleChange} />
            <div></div>
        </Stack>
      </Box>
      );
    }
    else{
      return (
        <Box display="flex" justifyContent='center' alignItems="center"> 
          <Stack spacing={2}>
            <Pagination count={10} page={page} onChange={handleChange} />
              <div></div>
          </Stack>
        </Box>
        );
    }
  }


  function CardsTogether() {
    const rows = 3;
    const cols = 2;
    let grid = [];

    // If polls were retrieved display them
    if(!noPolls){
      for (let i = 0; i < rows; i++) {
        grid.push(
          <Grid container item spacing={3} justifyContent="space-evenly" sx={{alignContent:"stretch"}} key={i}>
            {/* Give FormRow 2 polls (or 1 if there's only 1 left) at a time to form the row */}
            {FormRow(pollData?.slice(i * cols, i * cols + cols))}
          </Grid>
          );
      }
    }

    else if(noPolls){
      let message: string = ""
      if(currFeed == "friends"){
        if(getStorageFriends().length > 0)
          message = "That's the end of your friends' polls! Click on a username to add more friends."
        else
          message = "You don't have any friends yet! Follow other users by clicking on their username."
      }
      else if(currFeed == "following"){
        if(followedTags.length > 0)
          message = "There are no more polls with your followed tags. Blue tags are ones you haven't followed yet - click to follow them."
        else
          message = "You're not following any tags. Click a tag on any poll to get started."
      }
      else
        message = "Oops! We can't get any polls right now. Try again later."

      grid.push(
        <Card sx={{mt: 5, mb:3, alignSelf:"center", width:"100%", display:"flex", justifyContent:"center"}}>
          <CardContent>
            <Typography>{message}</Typography>
          </CardContent>
        </Card>
      );
    }

    return (
      <React.Fragment>
        <Grid container spacing={1}>
          {grid}
        </Grid>
      </React.Fragment>
    );
  }
  
  return isLoading ? (
    <Container maxWidth={false}>
      
        <FeedButtons />
        <Box display="flex" justifyContent="center">
          <CircularProgress></CircularProgress>
        </Box>
    </Container>
  ) : (
    <React.Fragment>
      <Stack sx={{width:"100%", ml: 35}} direction="row" spacing={1}>
        <Box height="70px" display="flex" justifyContent="flex-start">

          <FeedButtons />
        </Box>
        <Fade in={currFeed == "following"}>
          {tagList()}
        </Fade>
        <Fade in={currFeed == "friends"}>
          {friendList()}
        </Fade>
      </Stack>
      <Grow in={true}>
        <Container maxWidth={false}>
          <CardsTogether />
          {PageBar()}
        </Container>
      </Grow>
    </React.Fragment>
  );
}
