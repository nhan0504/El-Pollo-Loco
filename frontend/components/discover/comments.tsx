import React from 'react';
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

export default function CommentBox(tags: string[], question: string, opts: { optionText: string; votes: number; option_id: number; }[], username: string) {
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
            {CommentsWPoll(tags, question, opts, username)}
          </Typography>
        </Sheet>
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
}

function Comment() {
  return (
    <Paper style={{ padding: "40px 20px" }}>
    <Grid container spacing={2} >
      <Grid item justifyContent='center'>
        <Avatar alt="Remy Sharp" />
      </Grid>
      <Grid item xs>
        <h4 style={{ margin: 2, textAlign: 'left' }}>Michel Michel</h4>
        <p style={{ textAlign: 'left' }}>Lorem ipsum dolor sit amet, . </p>
        <p style={{ textAlign: 'left', color: 'gray' }}>posted 1 minute ago</p>
      </Grid>
    </Grid>
    </Paper>
  );
}

function Comments() {
  //wrapped up in the same paper means they r replies to each other, seperate papers r seperate comments
  return (
    <Paper style={{ maxHeight: 400,
    minWidth: 'min-content', overflow: 'auto' }}>
      <List>
        {Comment()}
        <Divider variant="fullWidth" style={{ margin: '30px 0' }} />
        {Comment()}
      </List>
    </Paper>
  );
}

function CommentsWPoll(tags: string[], question: string, opts: { optionText: string; votes: number; option_id: number; }[], username: string){
  var width = (useWindowDimensions().width)*0.5
  return (
    <Paper style={{ minHeight: 'fit-content',
      minWidth: width, overflow: 'auto' }}>
          {PollCard(tags, question, opts, username)}
          <Divider variant="fullWidth" style={{ margin: '30px 0' }} />
          {Comments()}
      </Paper>
  );
}
