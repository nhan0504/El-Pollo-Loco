import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

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
import PollCard from  './pollCardNoComment'
import useWindowDimensions from '../dimensions';



export default function CommentBox(tags: string[], question: string, opts: { optionText: string; votes: number; option_id: number; }[], username: string, pollId: number) {
  const [open, setOpen] = React.useState<boolean>(false);
  let comments = NoComments()
  return (
    <React.Fragment>
      <Button variant="outlined" color="neutral" onClick={()=>{
        setOpen(true)
      }}>
        <Stack>
          <CommentIcon/>
            123 Comments
        </Stack>
      </Button>
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={open}
        onClose={() => setOpen(false)}
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <ModalDialog >
        <Sheet
          variant="outlined"
          sx={{
            minHeight: 'min-content',
            minWidth: 'min-content',
            overflow: 'auto',
            borderRadius: 'md',
            p: 3,
            boxShadow: '10px, 5px, 5px'
          }}
        >
          <ModalClose variant="plain" sx={{ m: 1 }} />
          <Typography
            component="h2"
            id="modal-title"
            level="h4"
            textColor="inherit"
            fontWeight="lg"
            mb={1}
          >
            Comments
          </Typography>
          <Typography id="modal-desc" textColor="text.tertiary"> 
            {Parent(tags, question, opts, username, pollId)}
          </Typography>
        </Sheet>
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
}

function Parent(tags: string[], question: string, opts: { optionText: string; votes: number; option_id: number; }[], username: string, pollId: number){
  let [cmts, setCmts] = React.useState([])
  function useForceUpdate(){
    const [value, setValue] = useState(0); // integer state
    return () => setValue(value => value + 1); // update state to force render
    // A function that increment 👆🏻 the previous state like here 
    // is better than directly setting `setValue(value + 1)`
  }
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
            // alert(re)
            setCmts(re)
            return re
          });
        }
      })
      .catch((error) => alert(error.message));
      
  }, [])

  

  
  function Comment(data: any) {
    return (
      <Paper style={{ padding: "20px 10px"}} elevation={3}>
      <Grid container  spacing={2}>
        <Grid item justifyContent='center'>
          <Avatar alt="Remy Sharp" />
        </Grid>
        <Grid item xs>
          <h4 style={{ margin: 2, textAlign: 'left' }}>{data.username}</h4> 
          <p style={{ textAlign: 'left' }}>{data.comment} </p>
        </Grid>
      </Grid>
      </Paper>
    );
  }

  function Comments(pollId: number, cmts: any) {
    //wrapped up in the same paper means they r replies to each other, seperate papers r seperate comments
    let listOfComments: any = []
    if( cmts.length>0){
      listOfComments.push(<React.Fragment>
        {Comment(cmts[0])}
      </React.Fragment>);
    }
    for (let i = 1; i < cmts.length; i++) {
      listOfComments.push(<React.Fragment>
        <Divider variant="fullWidth" style={{ margin: '5px 0' }}/>
        {Comment(cmts[i])}
      </React.Fragment>)
    }
    return (
      <Paper style={{ maxHeight: 400,
      minWidth: 'min-content', overflow: 'auto' }}>
        <List>
          {listOfComments}
        </List>
      </Paper>
    );
  }
  
  function AddComment(cmts: any){
    let [currComment, setCurrComment] = React.useState("")
    const forceUpdate = useForceUpdate();
    return (
      <React.Fragment>
        <Paper style={{ padding: "20px 10px"}} elevation={3}>
      <Grid container  spacing={2}>
        <Grid item justifyContent='center'>
          <Avatar alt="Remy Sharp" />
        </Grid>
        <Grid item xs>
          <TextField id="filled-basic" label="Write a comment..." variant="filled" fullWidth onChange={(ev)=>{
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
              
                "poll_id": pollId,
                "parent_id": null,
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
            .catch((error) => alert(error.message));
            //data needs to be object
        cmts.push(
          {
            "username": "alex_carter", //need to figire out how to lget the logged in user wo fetching
            "comment_id": null, //for now this is null, it should be changed
            "parent_id": null,
            "comment": currComment
          }
        )
        setCmts(cmts)
        
      }
      //reload comments
      forceUpdate();
      
    }} />
        </Grid>
      </Grid>
      </Paper>
      </React.Fragment>
  );
  }
  
  function CommentsWPoll(tags: string[], question: string, opts: { optionText: string; votes: number; option_id: number; }[], username: string, pollId: number){
    let { innerWidth: width, innerHeight: height } = window;
    width = (width)*0.5
    //load until comments is not empty
    if (cmts.length==0){

    }
    return (
      <Paper style={{ minHeight: 'fit-content',
        minWidth: width, overflow: 'auto' }}>
            {PollCard(tags, question, opts, username)}
            {Comments(pollId, cmts)}
            {AddComment(cmts)}
            
        </Paper>
    );
  }
  return CommentsWPoll(tags, question, opts, username, pollId);
}

function NoComments(){
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



