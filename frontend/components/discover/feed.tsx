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

// Here we assemble the feed buttons and general poll feed and switch out the polls
// depending on the current feed style
export default function Feed({ pollData, setPollData }: any) {

  const [isLoading, setLoading] = useState<boolean>(true);
  const [pollsVoted, setPollsVoted] = useState<{poll_id: number, option_id: number}[]>([]);
  const [noPolls, setNoPolls] = useState<boolean>(false);
  const [followedTags, setFollowedTags] = useState<string[]>([]);
  const [currFeed, setCurrentFeed] = useState<string | null>(localStorage?.getItem("feed") != null ? localStorage?.getItem("feed") : 'discover');
  const [dataChange, setDataChange] = useState<boolean>(false);
  const [page, setPage] = React.useState(1);
  
  // Both of these actually run on page load - a little wasteful

  // Runs when the user advances the page or goes to a previous one
  useEffect(() => {
    localStorage.setItem("feed", String(currFeed));
    getPolls(String(currFeed));
  },[page]);
  
  // Used both by feed.tsx and child components to trigger a "soft" poll reset
  useEffect(() => {
    getPolls(String(currFeed));
    setDataChange(false);
  }, [dataChange]);

  async function getPolls(feedType: string) {
    setLoading(true);
    
    await getFollowedTags();

    // Determine which polls to retrieve from database depending on the feed type
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

        // Finally set poll data and stop loading once we have polls, followed tags,
        // and polls that the user has voted for
        setPollData(data);    
        setLoading(false);
      }
    }
    // If there are no polls, set the corresponding state
    catch (error) {
      setPollData([]);
      setNoPolls(true);
      setLoading(false);
    }
  }

  // Get tags followed by the user
  async function getFollowedTags(){
    try{
      let response = await fetch(`${process.env.BACKEND_URL}/tags`, {
        method: 'GET',
        credentials: 'include'
      });
      let data = await response.json();
      if (response.ok) {
        setFollowedTags(data);
        // Tags retrieved and stored in localStorage to be more easily accessed by the profile
        // without having to do another fetch request
        localStorage.setItem("tags", data);
      }
      else{
        setFollowedTags([]);
      }
    }
    catch (error) {
      setFollowedTags([]);
      localStorage.removeItem("tags");
    }
  }

  // Get polls that the user has voted  on in the form of a list containing objects of the form:
  // {poll_id: number, option_id: number}
  async function getVoted(polls: any) {
  // getPolls() is passing it the list of poll ids of 6 polls that were just fetched
    
    try{
      let response = await fetch(`${process.env.BACKEND_URL}/polls/vote/voted`, {
        method: 'GET',
        credentials: 'include'
      });
      let data = await response.json();
      if (response.ok) {
        
        // Set total list of polls voted on to local storage to be accessed by the profile for poll stats
        localStorage.setItem('pollsVoted', JSON.stringify(data));

        // Filter out any polls that the user voted on that aren't in this batch of polls to make checking the
        // list more efficient
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

  // Needed a way to evaluate and pass the "voted" state into the PollCard constructor
  function wasVotedOn(poll_id: number){
    // See if the poll with poll_id was voted on by comparing to pollsVoted list
    let index = pollsVoted.findIndex((poll) => poll.poll_id === poll_id);
    let voted = index > -1 ? pollsVoted[index] : {poll_id: poll_id, option_id: -1};
    return voted;
  }

  // Switch the feed type, refetch polls from database
  const switchFeed = (currFeed: string) => {
    setNoPolls(false);   
    // Feed type in local storage so poll cards can access it, and so we can remember
    // it if the user goes to another page
    localStorage.setItem("feed", currFeed);
    setCurrentFeed(currFeed);

    // Reset page back to 1 on feed switch
    if(page != 1)
      setPage(1);
    else
      getPolls(currFeed);
  };
  
  // Buttons for the user to switch feed types
  function FeedButtons() {
    // Different styles depending on which button was pressed/which feed is active
    const styles = () => ({
      currFeed: {
        style:{
          fontSize: '16px', 
          fontWeight: 'bold'
         } ,
         sx:{
          ':hover': {
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
    
    // The else is necessary since the feed buttons may load on page refresh
    // before the current feed is set
    if (currFeed == 'discover')
      discoverStyle = styles().currFeed;
    else if (currFeed == 'friends')
      friendsStyle = styles().currFeed;
    else if (currFeed == 'following')
      followingStyle = styles().currFeed;
    else
      discoverStyle = styles().currFeed;


    return (
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
  
  // List of tags for the Following feed (not the poll cards)
  const tagList = () => {
  // Note: currently these buttons cannot be interacted with, and you can only follow/unfollow tags on poll cards
    if(followedTags?.length != 0 && currFeed == "following"){
      return(
        // Stack to align the text and the tag list
        <Stack direction="row" sx={{ mb:0.5, pt:7, width:"1000px", color: 'blue',alignItems:"baseline", alignContent:"baseline", display: 'flex',justifyContent:"center"}}>

        <Typography noWrap style={{}} variant="h6" sx={{width:"min-content", color: "black"}}>You are following</Typography>
        
        {/* Separate box to neatly align the tag list */}
        <Box sx={{ ml: 1.5, mb:0.5, width:"550px", height:"min-content", color: 'blue', display: 'flex', alignItems:"center", alignContent:"center", flexWrap:"wrap"}}>

          {followedTags?.map((tag) => {
            return(
            <Button onClick={(event) => {    
            }} size="small" variant="contained" style={{fontSize: '11px', textTransform:'uppercase'}} sx={{bgcolor:"green", color:'white', mx:1, my:0.6, maxHeight:"45%",
            ":hover": {
              backgroundColor: "green",
            },}} key={tag}>{tag} ✓</Button>
          )})}
        </Box>
        </Stack>
      )
    }
    else
      return(<Box display='none'></Box>)
  };

  // Friend list for the Friend feed
  const friendList = () => {
    // Friends are retrieved at login and stored in local storage
    let friends = getStorageFriends();

    if(friends?.length != 0 && currFeed == "friends"){
      return(
        <Stack direction="row" sx={{ mb:0.5, pt:7, width:"1000px", color: 'blue',alignItems:"baseline", alignContent:"baseline", display: 'flex',justifyContent:"center"}}>

        <Typography noWrap style={{}} variant="h6" sx={{width:"min-content", color: "black"}}>You are friends with</Typography>

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

  // Form row of poll cards (length decided in CardsTogether)
  function FormRow(pollData: any) {
  // Note: Not the state pollData, but a list that contains 1 - n polls (there may be a final row with fewer than n)

    let row = [];

    for (let i = 0; i < pollData.length; i++) {

      // Note: we can't pop off polls from the list since they need to stay in memory to rerender
      // If we needed to remove a poll here from the feed, we would use setPollData with pollData.filter
      
      let currCard = pollData[i];

      row.push(
        <Grid item xs={4} style={{ padding: 50 }} sx={{}} key={i}>
          {/* We pass poll card a way to trigger the feed soft reset, an object that indicates whether the poll was
          voted on and if so, which option, a list of the followed tags, and a boolean that indicates whether the
          poll is in the comment box or not (affects whether the "comments" button on the poll card shows up) */}
          {PollCard(
            {setDataChange},
            currCard,
            wasVotedOn(currCard.poll_id),
            followedTags,
            false
          )}
          {/* Note: it's important that PollCard is passed the followed tag list here rather than getting the list
          from local storage, because this way every poll card uses the same reference to the list and they are
          synced when the list is changed */}
        </Grid>,
      );
    }
    return <React.Fragment>{row}</React.Fragment>;
  }

  // Get friends from local storage
  function getStorageFriends(){
    let value = localStorage.getItem("friends")
    return value != null ? value.split(",") : []
  }

  // Get tags from local storage
  function getStorageTags(){
    let value = localStorage.getItem("tags")
    return value != null ? value.split(",") : []
  }

  // Bar at the bottom of the page that allows the user to access more pages
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

  // Puts rows of cards into one grid, specifies number of rows and columns
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

    // Else display a message tailored to the specific no-poll situation
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
