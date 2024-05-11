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
          style={{ overflow: "hidden" }}
          sx={{
            display:"flex",
            flexDirection:"column",
            minHeight: 'min-content',
            minWidth: 'min-content',
            overflow: 'auto',
            borderRadius: 'md',
            p: 3,
            boxShadow: '10px, 5px, 5px',
            alignContent:"center"
          }}
        >
          <ModalClose variant="plain" sx={{ m: 1 }} />
          {/* <Typography
            component="h2"
            id="modal-title"
            level="h4"
            textColor="inherit"
            fontWeight="lg"
            mb={1}
          >
            Comments
          </Typography> */}
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
  
  let optionColors = ["blue", "red", "#65d300", "pink", "#ebe74d", "purple", "cyan", "yellow", "brown"]
  let [cmts, setCmts] = React.useState([])
  let [userids, setUserIds] = React.useState([])
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
  let [canComment, setCanComment]  = React.useState("false")
  canComment = String(localStorage.getItem("username"))
  if (isAuth==false){
    //alert("you cannot comment wo loggin in")
  }
  else{
    //setCanComment(canCmt)
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
            re = (re.map((obj: any)=>obj.user_id))
            re = re.filter((item: number, index: number) => re.indexOf(item) === index);
            userids = re
            return re
          });
        }
      })
      .catch((error) => alert(error.message));
      
  }, [])

  // const GetVotes = useEffect(()=>{
  //   if (optionVotes.length == 0){
  //   fetch(`${process.env.BACKEND_URL}/polls/vote/${pollId}`, {
  //     method: 'GET',
  //     credentials: 'include',
  //     headers: { 'Content-Type': 'application/json' }
  //   })
  //     .then((response) => {
  //       if (!response.ok) {
  //         return response.text().then((text) => {
  //           throw new Error(text);
  //         });
  //       } else {
  //         response.json().then((re)=>{
  //           // alert(re)
  //           setOptionVotes(re.map((obj: any)=>(obj.option_id)))
  //         });
  //       }
  //     })
  //     .catch((error) => {});}
    
  // })


  //  const OptionsToColors: any = useEffect(()=>{
  //   let voters: any[][] = [];
  //   optionVotes?.map(async (opt: number, ind: number)=>{
  //     await fetch(`${process.env.BACKEND_URL}/polls/vote/${opt}/users`, {
  //       method: 'GET',
  //       credentials: 'include',
  //       headers: { 'Content-Type': 'application/json' }
  //     })
  //       .then((response) => {
  //         if (!response.ok) {
  //           return response.text().then((text) => {
  //             throw new Error(text);
  //           });
  //         } else {
  //           response.json().then((re)=>{
  //             // alert(re)
              
  //             let start: any[] = []
  //             let ret = re.reduce((acc: number[], curr: any)=>{curr.user_id!=null ? acc.push(curr.user_id): 1; return acc}, start)
  //             for(let j = 0; j<ret.length; j++){
  //                 colorPairs.set(ret[j], optionColors[ind]);
                
  //             }
  //             voters.push(ret);
  //           });
  //         }
  //       })
  //       .catch((error) => {});
  
  //   })
  // })

  
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
    for (let i = 1; i < cmts.length; i++) {
      listOfComments.push(<React.Fragment>
        <Divider variant="fullWidth" style={{ margin: '5px 0' }}/>
        {Comment(cmts[i],  colorPairs.get(cmts[i].user_id))}
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

  
  function AddComment(this: any, cmts: any){
    let [currComment, setCurrComment] = React.useState("")
    const forceUpdate = useForceUpdate();
    
    if (canComment!="false"){
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
                "username": canComment, //need to figire out how to lget the logged in user wo fetching
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
      {/* <Divider variant="fullWidth" style={{ margin: '5px 0' }}/> */}
      <Paper style={{ minHeight: 'fit-content',
        minWidth: width, overflow:"auto"}}>
            {PollCard({setDataChange}, pollData, voted, followedTags, true)}
            {Comments(pollId, cmts)}
            {AddComment(cmts)}
            
        </Paper>
        </div>
    );
  }
  

  
  return CommentsWPoll({setDataChange}, pollData, pollId, voted, followedTags);


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


//first  get votes by  poll id, then 
// for each option get hte users who voted on that



