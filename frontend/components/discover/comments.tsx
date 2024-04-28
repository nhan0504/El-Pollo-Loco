import React, { useState } from 'react';
import ReactDOM from 'react-dom';

import { Divider, Avatar, Grid, Paper } from '@mui/material';
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
  return (
    <React.Fragment>
      <Button variant="outlined" color="neutral" onClick={() => setOpen(true)}>
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

async function getComments(pollId: number) {
  
  let cmts = await fetch(`${process.env.BACKEND_URL}/polls/comment/96`, {
    method: 'GET',
    credentials: 'include',

  });
  
  cmts = await cmts.json();
  return cmts
}

function Comment(data: any) {
  return (
    <Paper style={{ padding: "40px 20px" }}>
    <Grid container spacing={2} >
      <Grid item justifyContent='center'>
        <Avatar alt="Remy Sharp" />
      </Grid>
      <Grid item xs>
        <h4 style={{ margin: 2, textAlign: 'left' }}>{data.user_id}</h4> 
        <p style={{ textAlign: 'left' }}>{data.comment} </p>
      </Grid>
    </Grid>
    </Paper>
  );
}

function Comments(pollId: number, cmts: any) {
  //wrapped up in the same paper means they r replies to each other, seperate papers r seperate comments
  let listOfComments: any = []
  for (let i = 0; i < cmts.length; i++) {
    listOfComments.push(<React.Fragment>
      {Comment(cmts[i])}
    <Divider variant="fullWidth" style={{ margin: '30px 0' }}/>
    </React.Fragment>)
  return (
    <Paper style={{ maxHeight: 400,
    minWidth: 'min-content', overflow: 'auto' }}>
      <List>
        {listOfComments}
      </List>
    </Paper>
  );
}
}

function CommentsWPoll(tags: string[], question: string, opts: { optionText: string; votes: number; option_id: number; }[], username: string, pollId: number){
  var width = (useWindowDimensions().width)*0.5
 let cmts = getComments(pollId);
  return (
    <Paper style={{ minHeight: 'fit-content',
      minWidth: width, overflow: 'auto' }}>
          {PollCard(tags, question, opts, username)}
          <Divider variant="fullWidth" style={{ margin: '30px 0' }} />
          {Comments(pollId, cmts)}
      </Paper>
  );
}
