import React from 'react';
import ReactDOM from 'react-dom';

import { Divider, Avatar, Grid, Paper } from '@mui/material';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Collapse,
  IconButton,
  List,
  Modal,
  Stack,
  Typography,
  makeStyles,
} from '@mui/material';
import { AddIcCallOutlined, CommentsDisabledRounded } from '@mui/icons-material';
import CommentIcon from '@mui/icons-material/Comment';
import { red } from '@mui/material/colors';

export default function CommentBox() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button onClick={handleOpen}>
        <Stack alignItems="center" direction="row">
          <CommentIcon fontSize="large" sx={{ mr: 2 }} />
          123
        </Stack>
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ overflow: 'auto' }}
      >
        {Comments(handleClose)}
      </Modal>
    </div>
  );
}

function Comment() {
  return (
    <Grid container wrap="nowrap" spacing={2}>
      <Grid item>
        <Avatar alt="Remy Sharp" />
      </Grid>
      <Grid item xs zeroMinWidth>
        <h4 style={{ margin: 0, textAlign: 'left' }}>Michel Michel</h4>
        <p style={{ textAlign: 'left' }}>Lorem ipsum dolor sit amet, . </p>
        <p style={{ textAlign: 'left', color: 'gray' }}>posted 1 minute ago</p>
      </Grid>
    </Grid>
  );
}

function Comments(closeFunc: React.MouseEventHandler<HTMLButtonElement> | undefined) {
  //wrapped up in the same paper means they r replies to each other, seperate papers r seperate comments
  return (
    <Paper style={{ maxHeight: 200, overflow: 'auto' }}>
      <List>
        {Comment()}
        <Divider variant="fullWidth" style={{ margin: '30px 0' }} />
        {Comment()}
      </List>
    </Paper>
  );
}
