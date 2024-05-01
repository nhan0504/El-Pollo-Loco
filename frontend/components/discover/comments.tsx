import React, { useState } from 'react';
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
        comments = CommentsWPoll(tags, question, opts, username, pollId)
        alert(comments);
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
            {CommentsWPoll(tags, question, opts, username, pollId)}
          </Typography>
        </Sheet>
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
}

function getComments(pollId: number) {
  
   

  // fetch(`${process.env.BACKEND_URL}/polls/comment/44`, {
  //   method: 'GET',
  //   credentials: 'include',
  //   headers: { 'Content-Type': 'application/json' }
  // })
  //   .then((response) => {
  //     if (!response.ok) {
  //       return response.text().then((text) => {
  //         throw new Error(text);
  //       });
  //     } else {
  //       return response.text();
  //     }
  //   })
  //   .catch((error) => alert(error.message));

  return [{}, {}, {}];
  
}
  


function Comment(data: any) {
  return (
    <Paper style={{ padding: "20px 10px"}} elevation={3}>
    <Grid container  spacing={2}>
      <Grid item justifyContent='center'>
        <Avatar alt="Remy Sharp" />
      </Grid>
      <Grid item xs>
        <h4 style={{ margin: 2, textAlign: 'left' }}>sillyUser</h4> 
        <p style={{ textAlign: 'left' }}>"contraversial take" </p>
      </Grid>
    </Grid>
    </Paper>
  );
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

function AddComment(cmts: {}[]){
  let [currComment, setCurrComment] = React.useState("")
  return (
    <React.Fragment>
      <Paper style={{ padding: "20px 10px"}} elevation={3}>
    <Grid container  spacing={2}>
      <Grid item justifyContent='center'>
        <Avatar alt="Remy Sharp" />
      </Grid>
      <Grid item xs>
        <h4 style={{ margin: 2, textAlign: 'left' }}>sillyUser</h4> 
        <TextField id="filled-basic" label="Write a comment..." variant="filled" fullWidth onKeyDown={(ev) => {
    
    if (ev.key === 'Enter') {
      ev.preventDefault();
      //make new Comment
      //should add to the databse too
      cmts.push(Comment(currComment))

    }
  }}  onChange={(ev)=>{setCurrComment(ev.target.value)}}/>
      </Grid>
    </Grid>
    </Paper>
    </React.Fragment>
);
}

function CommentsWPoll(tags: string[], question: string, opts: { optionText: string; votes: number; option_id: number; }[], username: string, pollId: number){
  let { innerWidth: width, innerHeight: height } = window;
  width = (width)*0.5
  let cmts = getComments(pollId);
  return (
    <Paper style={{ minHeight: 'fit-content',
      minWidth: width, overflow: 'auto' }}>
          {PollCard(tags, question, opts, username)}
          {Comments(pollId, cmts)}
          {AddComment(cmts)}
          
      </Paper>
  );
}
