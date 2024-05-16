import React, { useContext, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { AuthContext } from '@/contexts/authContext';

import { Divider, Avatar, Grid, Paper, TextField } from '@mui/material';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Collapse,
  IconButton,
  List,
  Stack,  makeStyles,
} from '@mui/material';
import { AddIcCallOutlined, CommentsDisabledRounded } from '@mui/icons-material';
import CommentIcon from '@mui/icons-material/Comment';
import { red } from '@mui/material/colors';
import Button from '@mui/joy/Button';
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import { ModalDialog } from '@mui/joy';
import PollCard from  './pollCard'


export default function CommentBox({setDataChange}:any, pollData: any, voted: any, followedTags: string[]) {
  // all parameters are passed to the poll card in the comment box

//keeps track of whether the modal is open or not
  const [open, setOpen] = React.useState<boolean>(false);
  let comments = NoComments()
  return (
    <React.Fragment>
      <Button variant="plain" color="neutral" sx={{minHeight:"60px"}} onClick={()=>{
        setOpen(true)
      }}>
        <Stack direction="row">
          <CommentIcon/>
          &nbsp;
            Comments
        </Stack>
      </Button>
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={open}
        onClose={() => setOpen(false)}
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}
      >
        <ModalDialog >
        <Sheet
          variant="outlined"
          style={{ overflow: "auto" }}
          sx={{
            display:"flex",
            flexDirection:"column",
            minHeight: 'min-content',
            minWidth: 'min-content',
            overflow: 'auto',
            border:"0px",
            p: 3,
            boxShadow: '10px, 5px, 5px',
            alignContent:"center"
          }}
        >
          <ModalClose variant="plain" sx={{ m: 1 }} />
      
          <Typography id="modal-desc" textColor="text.tertiary"> 
            {Parent({setDataChange}, pollData, voted, followedTags)}
          </Typography>
        </Sheet>
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
}


function Parent ({setDataChange}:any, pollData: any, voted: any, followedTags: string[]){
  //same colors as option colors in pollCard
  
  let optionColors = ["blue", "red", "#65d300", "pink", "#ebe74d", "purple", "cyan", "yellow", "brown"]
  let [cmts, setCmts] = React.useState([]) 
  let [userids, setUserIds] = React.useState([]) //need user ids to say who is voting 
  let [optionVotes, setOptionVotes] = React.useState([])
  let [colorPairs, setColorPairs] = React.useState(new Map<number, string>());
  const { isAuth, setAuth } = useContext(AuthContext);

  let pollId = pollData?.poll_id;

  function useForceUpdate(){
    const [value, setValue] = useState(0); // integer state
    return () => setValue(value => value + 1); // update state to force render
    // A function that increment 👆🏻 the previous state like here 
    // is better than directly setting `setValue(value + 1)`
  }
  const [canComment, setCanComment]  = React.useState(false) //sets whether ppl can comment
  // canComment = String(localStorage.getItem("username"))

  const CommentGetter = useEffect(()=>{

    fetch(`${process.env.BACKEND_URL}/polls/comment/${pollId}`, {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(text);
          });
        } else {
          response.json().then((re)=>{
            setCmts(re)
            re = (re.map((obj: any)=>obj.user_id))
            re = re.filter((item: number, index: number) => re.indexOf(item) === index);
            userids = re

            if (!isAuth){
              setCanComment(false)
            }
            else{
              setCanComment(true)
            }
            
            return re
          });
        }
      })
      .catch((error) => error.message);
      
  }, [])

  function Comment(data: any, color: any) {
    //need to save the current comment id
    return (
      <Paper style={{ padding: "20px 10px"}} elevation={3}>
      <Grid container  spacing={2}>
        <Grid item justifyContent='center'>
          <Avatar alt="Remy Sharp" />
        </Grid>
        <Grid item xs>
          <h4 style={{ margin: 2, textAlign: 'left', color: color, textShadow: `0 0 0.1em ${color}, 0 0 0.02em ${color}`}}>{data.username}</h4> 
          <p style={{ textAlign: 'left' }}>{data.comment} </p>
          
          </Grid>
      </Grid>
      </Paper>
    );
  }

  function Comments(pollId: number, cmts: any) {
    //wrapped up in the same paper means they r replies to each other, seperate papers r seperate comments
    //make color user_id pairing based on what they  voted for
    let listOfComments: any = []
    if( cmts.length>0){
      listOfComments.push(<React.Fragment>
        {Comment(cmts[0], colorPairs.get(cmts[0].user_id))}
      </React.Fragment>);
    }
    //add all the comments and thier colors as well
    for (let i = 1; i < cmts.length; i++) {
      listOfComments.push(<React.Fragment>
        <Divider variant="fullWidth" style={{ margin: '5px 0' }}/>
        {Comment(cmts[i],  colorPairs.get(cmts[i].user_id))}
      </React.Fragment>)
    }
    return (
        <List>
              <Typography
            component="h1"
            id="modal-title"
            level="h4"
            textColor="inherit"
            fontWeight="lg"
            mb={1}
            sx={{mb:5}}
            style={{textAlign:"center"}}
          >
            Comments
          </Typography>
          <br/>
          {listOfComments}
        </List>
    );
  }

  function AddComment(this: any, cmts: any){
    //this function allows a user to write their own comment
    let [currComment, setCurrComment] = React.useState("") // default comment is empty string
    const forceUpdate = useForceUpdate();
    
    if (canComment){
        return (
          <React.Fragment>
            <Paper style={{ padding: "20px 10px"}} elevation={3}>
          <Grid container  spacing={2}>
            <Grid item justifyContent='center'>
              <Avatar alt="Remy Sharp" />
            </Grid>
            <Grid item xs>
              <TextField id="filled-basic" value={currComment} label="Write a comment..." variant="filled" fullWidth onChange={(ev)=>{
                setCurrComment(ev.target.value);
              }} 
              
              onKeyDown={(ev) => {
          
          if (ev.key === 'Enter') {
            ev.preventDefault();
            //adds to the db
              fetch(`${process.env.BACKEND_URL}/polls/comment`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({

                    "pollId": pollId,
                    "parentId": null, //we have not implemented replies, if they replied to a comment, this would be the id of the comment that they replied to
                    "comment": currComment
                
                })
              })
                .then((response) => {
                  if (!response.ok) {
                    return response.text().then((text) => {
                      throw new Error(text);
                    });
                  } else {
                  }
                })
                .catch((error) => error.message);
                //data needs to be object

            cmts.push(
              {
                "username": canComment, //who is currently logged in
                "comment_id": null, //for now this is null, it should be changed
                "parent_id": null,
                "comment": currComment
              }
            )
            setCmts(cmts)
            setCurrComment('')
            
          }
          //reload comments
          forceUpdate();
          
        }} />
            </Grid>
          </Grid>
          </Paper>
          </React.Fragment>
      );}
  }
  
  function CommentsWPoll({setDataChange}:any, pollData: any, pollId:number, voted:any, followedTags: string[]){
    let { innerWidth: width, innerHeight: height } = window;
    
    width = (width)*0.5
    //load until comments is not empty
    return (
      <div>
            {PollCard({setDataChange}, pollData, voted, followedTags, true)}
            {Comments(pollId, cmts)}
            {AddComment(cmts)}            
        </div>
    );
  }
  
  return CommentsWPoll({setDataChange}, pollData, pollId, voted, followedTags);
}

function NoComments(){
  //if there are no comments 
  return (
    <Paper style={{ padding: "40px 20px" }}>
    <Grid container spacing={2} >
      <Grid item justifyContent='center'>
        <Avatar alt="Remy Sharp" />
      </Grid>
      <Grid item xs>
        <h4 style={{ margin: 2, textAlign: 'left' }}>{4}</h4> 
        <h1 style={{ textAlign: 'left' }}>testing comment pls work </h1>
      </Grid>
    </Grid>
    </Paper>
  );
}


