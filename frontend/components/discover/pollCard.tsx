'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import {IconButton} from '@mui/material';
import { useContext, useState, useEffect, useMemo} from 'react';
import PersonIcon from '@mui/icons-material/Person';
import Stack from '@mui/material/Stack';
import CommentBox from './comments';
import { AuthContext } from '@/contexts/authContext';
import { useRouter } from 'next/navigation';
import usernameFriend from './addFriend'
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import Divider from '@mui/material/Divider';
import DeleteIcon from '@mui/icons-material/Delete';


type Option = {
  optionText: string;
  votes: number;
  option_id: number;
};

function MakeCard(
  {setDataChange}: any,
  rawData: any,
  tags: Array<string>,
  question: string,
  opts: Array<Option>,
  username: string, 
  userId: number,
  pollId: number,
  createdAt: string,
  voted: {poll_id: number, option_id: number},
  followedTags: string[],
  inCommentBox: boolean
) {
  const [user_id, setUserId] = React.useState(userId)
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
    tags: tags,
    comments: 0,
  });

  const [hasVoted, setHasVoted] = useState<{voted: boolean, option_id: number}>({voted: false, option_id: -1});
  // A state for whether the options are collapsed, showing results
  const [collapsed, setCollapsed] = useState<boolean>(false)
  // Tracks tag dialog open state as well as whether the selected tag was actually followed
  const [tagDialogOpen, setTagDialogOpen] = useState<{open:boolean, followed:boolean}>({open: false, followed: false});
  // Tracks the poll deletion dialog open state as well as whether a poll was actually deleted
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<{open:boolean, deleted:boolean}>({open: false, deleted: false});
  const [tagSelected, setTagSelected] = useState<string>("");
  const [transition, setTransition] = React.useState(false);
  const [refreshCard, setRefreshCard] = React.useState(false);
  const [tagChange, setTagChange] = useState(false);
  // const [friendList, setFriendList] = useState<string[]>([]);
  // If the user has voted on this poll, automatically show results
  useEffect(() => {
    // alert(userId)
    if(voted.option_id != -1){
      ShowResults();
      setHasVoted({voted: true, option_id: voted.option_id});
    }
  }, []);

  // Triggered by addFriend when a friend is followed/unfollowed
  useEffect(() => {
   
    if(refreshCard){
      setRefreshCard(false);
      // If we're on the friends feed, update it after a follow/unfollow by setting dataChange for feed.tsx
      if(localStorage.getItem("feed") == "friends" && !tagChange)
        setDataChange(true);
      else
        setTagChange(false)
    }
  }, [refreshCard]);

  // pass in an index of the current option being voted on so we don't have to map through the whole list
  const AddVote = (ind: number) => {
    
    if (isAuth == false) {
      alert('You cannot vote without logging in. Redirecting to login page.');
      push('/auth/login');
    } 
    else if (!hasVoted.voted) {
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
            cardData.opts.pop();
            setHasVoted({voted: true, option_id: cardData.opts[ind].option_id});

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
  };

  function deletePoll() {

    fetch(`${process.env.BACKEND_URL}/polls/` + pollId, {
      method: 'DELETE',
      credentials: 'include',
      mode: 'cors',
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(text);
          });
        } else {
          setDataChange(true);
          return response.text();
        }
      })
      .catch((error) => error.message); 
  }

  const ShowResults = () => {
    if(cardData.opts[cardData.opts.length - 1].optionText === "Show Results"){
      // Remove Show Results button when it's clicked
      cardData.opts.pop();
      setCardData({...cardData, opts: cardData.opts})
    }
    setCollapsed(true);
  }
  
  // Calculate percentage of votes for an option
  const getPercent = (option: { optionText: string; votes: number }) => {
    if (cardData.totalVotes === 0) {
      return 0;
    } else return (option.votes / cardData.totalVotes) * 100;
  };

  // colors for options, applied in order
  let optionColors = ["blue", "red", "#65d300", "pink", "#ebe74d", "purple", "cyan", "yellow", "brown"]

  const optionList = () => {

    // let transitionTime = 600;
    // let transitionTrigger = !transition ? true : false;

    let optList = cardData.opts?.map((option, index) => {
      
      // If it's the Show Results button, return special button
      // Will always be the last option in the list
      if (option.optionText === "Show Results"){

        return (
          <CardActions key="showresults">

            <Button
              variant="outlined"
              value="Show Results"
              onClick={(event) => {setTransition(true); ShowResults();}}
              style={{ 
                fontSize: "12px", 
                maxWidth: collapsed?"0px":"32%", 
                maxHeight: '100%', 
                minWidth: collapsed?"0px":"32%", 
                minHeight: '100%' ,
              }}
              sx={{
                opacity: 0.8,
                boxShadow:1,
                // Losing my mind trying to center the buttons with a container so I'm doing 
                // ml: (100% - uncollapsed width)/2
                // Not ideal but it works
                ml: "34%",   
              }}                
            >
              Show Results
            </Button>
        </CardActions>
        )
      }
      else{
        // Different button styles depending on state of poll/option
        const styles = () => ({
          thisOptionVoted: {
              ":hover": {
                backgroundColor: optionColors[index],
                color: "white",
                border: '2px solid ' + optionColors[index],
              },
              bgcolor: optionColors[index],
              color: "white",
              border: '2px solid ' + optionColors[index],
            },
          notThisOption:{
            ":hover": {
              backgroundColor: "inherit",
              color: "black",
              border: '2px solid ' + optionColors[index],
            },
            bgcolor: "inherit",
            color: "black",
            border: '2px solid ' + optionColors[index],
          },
          pollNotVoted:{
            ":hover": {
              backgroundColor: optionColors[index],
              color: "white",
              border: '2px solid ' + optionColors[index],
            },
            bgcolor: "inherit",
            color: "black",
            border: '2px solid ' + optionColors[index],
          }
          
        });
        
        let style

        if(hasVoted.voted && option.option_id == hasVoted.option_id){
          style = styles().thisOptionVoted;
        }
        else if(hasVoted.voted){
          style = styles().notThisOption;
        }
        else{
          style = styles().pollNotVoted;
        }

        return (

        <CardActions sx={{}} key={option.optionText}>
          {/* Added onClick function as addVote */}
          {/* <Slide in={true} timeout={transitionTime} direction="left" > */}

          <Button
            variant="outlined"
            value={option.optionText}
            onClick={(event) => {setTransition(true); AddVote(index);}}
            style={{ 
              fontSize: "14px", 
              maxWidth: collapsed?"40%":"100%", 
              minWidth: collapsed?"40%":"100%", 
              maxHeight: '100%',
              minHeight: '100%',
              fontFamily: 'arial',
            }}
            sx={{
              // The hover/normal colors are swapped to show the option that
              ":hover": style[':hover'],
              color:style.color,
              bgcolor:style.bgcolor,
              border: style.border,
              opacity: 0.8,
              boxShadow:2,
              textTransform:"none",
              textWeight:"bold"
            }}                
          >
            {option.optionText}
          </Button>
          {/* </Slide> */}

          {/* using getPercent which just divides the options's votes by total votes */}
          {/* adjust width of progress bars if they're not supposed to show */}

          {/* <Slide in={true} mountOnEnter timeout={transitionTime} direction="left" > */}
            <Box sx={{ width: collapsed? 3 / 4 : 0, boxShadow: 2}} alignItems="center" style={{}} >
              <LinearProgress 
              variant="determinate" 
              value={getPercent(option)} 
              sx={{ 
                height:5, 
                '& .MuiLinearProgress-bar': {
                    backgroundColor: optionColors[index],
                    opacity:1
                  },
              }} 
              style={{opacity:0.8}} />
            </Box>
          {/* </Slide> */}

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

  const commentBox = () => {
    if (!inCommentBox)
      return CommentBox({setDataChange}, rawData, voted, followedTags)

    else
      return
  }

  const deleteButton = () => {
    if(username == localStorage.getItem("username")){
      return(
        <React.Fragment>
          <IconButton sx={{}} onClick={(event) => (setDeleteDialogOpen({open: true, deleted: false}))}><DeleteIcon/></IconButton>
        </React.Fragment>
      )

    }

    else return
  }

  // Need to use tags endpoint to send POST request w/ tag id, but we don't have tags ids right now
  function followTag(tagName: string){
    setTagDialogOpen({open: false, followed: true});
    if (isAuth == false) {
      alert('You cannot follow tags without logging in. Redirecting to login page.');
      push('/auth/login');
    } else {
      // alert("following tag")
      fetch(`${process.env.BACKEND_URL}/tags/follow/` + tagName, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
        }),
      })
        .then((response) => {
          if (!response.ok) {
            return response.text().then((text) => {
              throw new Error(text);
            });
          } else {
            // alert(response.text());
            followedTags.push(tagName);
            if(localStorage.getItem("feed") == "following")
              setDataChange(true)
            setTagChange(true)
            setRefreshCard(true)
            return response.text();
          }
        })
        .catch((error) => error.message); 
    }
  }

  function unfollowTag(tagName: string){
    setTagDialogOpen({open: false, followed: false});
    if (isAuth == false) {
      alert('You cannot follow tags without logging in. Redirecting to login page.');
      push('/auth/login');
    } else {
      // alert("following tag")
      fetch(`${process.env.BACKEND_URL}/tags/unfollow/` + tagName, {
        method: 'DELETE',
        credentials: 'include',
        mode: 'cors',
      })
        .then((response) => {
          if (!response.ok) {
            return response.text().then((text) => {
              throw new Error(text);
            });
          } else {
            // alert(response.text());
            followedTags.splice(followedTags.indexOf(tagName), 1);
            if(localStorage.getItem("feed") == "following")
              setDataChange(true)
            setTagChange(true)
            setRefreshCard(true)
            return response.text();
          }
        })
        .catch((error) => error.message); 
    }


  }

  // Alert for when a poll is deleted
  const deletedAlert = () => {
    if(deleteDialogOpen.deleted == true){
      return(
        <React.Fragment>
        <br/>
        <Alert style={{}} icon={<CheckIcon fontSize="inherit" />} severity="success"  onClose={(event) => {setTagDialogOpen({open: false, followed: false});}}>
          Poll deleted. Refresh to see change.
        </Alert>
        </React.Fragment>
      )
    }
      return
  }

  const getDialog = (type: string) => {

    if(type == "tag"){
      return(
        <Dialog PaperProps={{ sx: {borderRadius: "25px"} }} open={tagDialogOpen.open} onClose={(event) => setTagDialogOpen({open:false, followed: tagDialogOpen.followed})} sx={{}}>
          <DialogContent sx={{maxWidth: 350, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center"}}>
            <DialogTitle textAlign="center">{tagFollowMessage().header}</DialogTitle>           
            <Typography textAlign="center" variant="body1">{tagFollowMessage().body}</Typography>
            <br/>
            <Button onClick={(event) => {!isFollowing(tagSelected) ? followTag(tagSelected) : unfollowTag(tagSelected)}}  size="small" variant="contained" 
              sx={{
                bgcolor: !isFollowing(tagSelected) ? "#1976d2" : "green", alignSelf:"center",
                ":hover": {
                  backgroundColor: !isFollowing(tagSelected) ? "#1976d2" : "green",
                },}}>{tagLabel(tagSelected)}</Button>
          </DialogContent>
        </Dialog>
      )
    }
    else if(type == "delete"){
      return(
        <Dialog  PaperProps={{ sx: { borderRadius: "25px"} }} open={deleteDialogOpen.open} onClose={(event) => setDeleteDialogOpen({open: false, deleted: deleteDialogOpen.deleted})} sx={{}}>
          <DialogContent sx={{maxWidth: 350, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center"}}>
            
            <DialogTitle textAlign="center">Are you sure you want to delete this poll?</DialogTitle>           
            <br/>
            <Stack direction="row" sx={{width:"45%", alignSelf:"center", display:"flex",  justifyContent:"space-between"}}>
              <Button onClick={(event) => {deletePoll(); setDeleteDialogOpen({open: false, deleted: true});}}  size="small" variant="contained" sx={{bgcolor: "#1976d2", alignSelf:"center"}}>Yes</Button>
              <Button onClick={(event) => {setDeleteDialogOpen({open: false, deleted: false})}}  size="small" variant="contained" sx={{bgcolor: "#1976d2", alignSelf:"center"}}>No</Button>
            </Stack>
          </DialogContent>
        </Dialog>
        )
    }
    else
      return
  }

  const tagFollowMessage = () => {
    
    return {
      header: isFollowing(tagSelected) ? "Would you like to unfollow this tag?" : "Would you like to follow this tag?", 
      body: isFollowing(tagSelected) ?'Polls tagged with "' + tagSelected + '" will no longer appear on your Following feed.' : 'Polls tagged with "' + tagSelected + '" will appear on your Following feed.', 
    }
  }

  const isFollowing = (tagName: string) => {

    return followedTags.includes(tagName);
  }

  const tagLabel = (tagName: string) => {
    return isFollowing(tagName) ? tagName + " ✓" : tagName + " +";
  }

  const tagList = () => {

    if(tags?.length != 0){
      return(
        <Box sx={{ mb:0.5, width:"100%", color: 'blue', display: 'flex', alignItems:"center", flexWrap:"wrap"}}>
          {tags?.map((tag) => {
            return(
            <Button onClick={(event) => {    
              setTagSelected(tag);
              setTagDialogOpen({open: true,  followed: false});
            }} size="small" variant="contained" style={{fontSize: '11px', textTransform:'uppercase'}} sx={{
              bgcolor:!isFollowing(tag)?'#1976d2' : "green", color:'white', mx:1, my:0.6, maxHeight:"45%",
              ":hover": {
                backgroundColor: !isFollowing(tag) ? "#1976d2" : "green",
              },}} key={tag}>{tagLabel(tag)}</Button>
          )})}
        </Box>
      )
    }
    else
      return
  };

  let voteMessage: string = cardData.totalVotes > 1 ?  cardData.totalVotes + " votes" : cardData.totalVotes + " vote"
  let friendList

  if(localStorage.getItem("friends")?.split(",") && localStorage.getItem("friends")?.split(",").length > 0)
    friendList = localStorage.getItem("friends")?.split(",")[0] != "" ? localStorage.getItem("friends")?.split(",") : []
  else
    friendList = []

  return (
    <React.Fragment>
      <Card
        sx={{display: { xs: 'flex', lg: 'none' }, boxShadow:2}}
        style={{
          display: 'flex',
          flexDirection: 'column',
          border: '1px',
          borderRadius: 15,
        }}
        variant="outlined"
      >
        <CardContent>
          <Stack alignItems="center" direction="row" gap={0} justifyContent="space-between">
            <Stack display="flex" alignItems="center" justifyContent="center" direction="row" gap={0}>
              <PersonIcon fontSize="medium" sx={{mb:0.6}}/>
              {usernameFriend({setRefreshCard}, username, user_id, friendList)}
            </Stack>
        
            <Typography sx={{}} variant="subtitle2" color="textSecondary">{voteMessage}</Typography>
          </Stack>
          <br/>
          <Typography variant="h5" component="div" align="center">
            {question}
          </Typography>
          <br/>
        </CardContent>
        
          {optionList()}

          <CardContent sx={{ color: 'blue', display: 'flex', alignItems:"baseline"}}>
            {tagList()}
          </CardContent>
          
          <Typography alignSelf="center" color="textSecondary" variant="body2">{createdAt}</Typography>
          <Box sx={{ my:1.5, width:"100%", display: 'flex', alignItems:"center", justifyContent:"center"}}>
            {deleteButton()}
          </Box>
                    
          <Divider></Divider>
          {commentBox()}
          <Divider></Divider>
         
         {getDialog("tag")}
         {getDialog("delete")}

      </Card>
      {deletedAlert()}

    </React.Fragment>
  );
}

export default function PollCard(
  {setDataChange}: any,
  pollData: any,
  voted: {poll_id: number, option_id: number},
  followedTags: string[],
  inCommentBox: boolean
) {
  // alert(JSON.stringify(pollData));
  // Process raw poll data to pass to MakeCard
   
  
  let date = new Date(Date.parse(pollData?.created_at));
  let adjustedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000)

  let tags = (pollData?.tags)?.split(",");
  let question = pollData?.title;
  let opts = pollData?.options?.map((option: any) => ({
              optionText: option.option_text,
              votes: option.vote_count,
              option_id: option.option_id,
            }));
  let username = pollData?.username;
  let userId = pollData?.user_id;
  let pollId = pollData?.poll_id;
  let createdAt = adjustedDate.toDateString() + ", " + adjustedDate.toLocaleTimeString();
  
  return <Box sx={{ minWidth: 450, maxWidth: 450,  alignSelf:"center"}}>{MakeCard({setDataChange}, pollData, tags, question, opts, username, userId, pollId, createdAt, voted, followedTags, inCommentBox)}</Box>;
}
