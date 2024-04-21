import React from "react";
import ReactDOM from "react-dom";

import { Divider, Avatar, Grid, Paper } from "@material-ui/core";
import { Button, Modal, Stack } from "@mui/material";
import { CommentsDisabledRounded } from "@mui/icons-material";
import CommentIcon from '@mui/icons-material/Comment';

export default function CommentBox() {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
  
    return (
      <div>
        <Button onClick={handleOpen}>
          <Stack alignItems="center" direction="row">
            <CommentIcon fontSize="large" sx={{mr:2}}/>  
            123
          </Stack>
          </Button> 
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          {Comments(handleClose)}
        </Modal>
      </div>
    );
  }

function Comments(closeFunc: React.MouseEventHandler<HTMLButtonElement> | undefined) {
    //wrapped up i nthe same paper means they r replies to each other, seperate papers r seperate comments
  return (
    <div style={{ padding: 14 }}>
        <Stack alignItems="center" direction="row" gap={3}>
            <h1>Comments</h1>
            <Button variant= 'contained' onClick={closeFunc}>X</Button>
         </Stack>
      <Paper style={{ padding: "40px 20px" }}>
        <Grid container wrap="nowrap" spacing={2}>
          <Grid item>
            <Avatar alt="Remy Sharp" />
          </Grid>
          <Grid>
            <h4 style={{ margin: 0, textAlign: "left" }}>Michel Michel</h4>
            <p style={{ textAlign: "left" }}>
              Lorem ipsum dolor sit amet,  ex.{" "}
            </p>
            <p style={{ textAlign: "left", color: "gray" }}>
              posted 1 minute ago
            </p>
          </Grid>
        </Grid>
        <Divider variant="fullWidth" style={{ margin: "30px 0" }} />
        <Grid container wrap="nowrap" spacing={2}>
          <Grid item>
            <Avatar alt="Remy Sharp" />
          </Grid>
          <Grid item xs zeroMinWidth>
            <h4 style={{ margin: 0, textAlign: "left" }}>Michel Michel</h4>
            <p style={{ textAlign: "left" }}>
              Lorem ipsum dolor sit amet, .{" "}
            </p>
            <p style={{ textAlign: "left", color: "gray" }}>
              posted 1 minute ago
            </p>
          </Grid>
        </Grid>
      </Paper>

      <Paper style={{ padding: "40px 20px", marginTop: 100 }}>
        <Grid container wrap="nowrap" spacing={2}>
          <Grid item>
            <Avatar alt="Remy Sharp" />
          </Grid>
          <Grid  item xs zeroMinWidth>
            <h4 style={{ margin: 0, textAlign: "left" }}>Michel Michel</h4>
            <p style={{ textAlign: "left" }}>
              Lorem ipsum dolor sit amet, .{" "}
            </p>
            <p style={{ textAlign: "left", color: "gray" }}>
              posted 1 minute ago
            </p>
          </Grid>
        </Grid>
      </Paper>
      <Paper style={{ padding: "40px 20px", marginTop: 10 }}>
        <Grid container wrap="nowrap" spacing={2}>
          <Grid item>
            <Avatar alt="Remy Sharp" />
          </Grid>
          <Grid item xs zeroMinWidth>
            <h4 style={{ margin: 0, textAlign: "left" }}>Michel Michel</h4>
            <p style={{ textAlign: "left" }}>
              Lorem ipsum dolor sit amet,{" "}
            </p>
            <p style={{ textAlign: "left", color: "gray" }}>
              posted 1 minute ago
            </p>
          </Grid>
        </Grid>
      </Paper>
      <Paper style={{ padding: "40px 20px", marginTop: 10 }}>
        <Grid container wrap="nowrap" spacing={2}>
          <Grid item>
            <Avatar alt="Remy Sharp"/>
          </Grid>
          <Grid item xs zeroMinWidth>
            <h4 style={{ margin: 0, textAlign: "left" }}>Michel Michel</h4>
            <p style={{ textAlign: "left" }}>
               ex.{" "}
            </p>
            <p style={{ textAlign: "left", color: "gray" }}>
              posted 1 minute ago
            </p>
          </Grid>
        </Grid>
      </Paper>
      <Paper style={{ padding: "40px 20px", marginTop: 10 }}>
        <Grid container wrap="nowrap" spacing={2}>
          <Grid item>
            <Avatar alt="Remy Sharp" />
          </Grid>
          <Grid item xs zeroMinWidth>
            <h4 style={{ margin: 0, textAlign: "left" }}>Michel Michel</h4>
            <p style={{ textAlign: "left" }}>
             rdum, mauris mi vehicula urna, nec feugiat quam
              lectus vitae ex.{" "}
            </p>
            <p style={{ textAlign: "left", color: "gray" }}>
              posted 1 minute ago
            </p>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}