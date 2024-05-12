import { Stack, Typography, setRef } from "@mui/material";
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { AuthContext } from "@/contexts/authContext";
import { useContext } from "react";

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 200,
    bgcolor: 'background.paper',
    border: '1px solid #000',
    boxShadow: 24,
    p: 1,
    borderRadius: 1
  };
  
  // The key to all cards changing at once is passing in a regular friendList variable given by the parent, pollCard, and 
  // NOT using states to control following/unfollowing behavior. setRefreshCard just triggers a useEffect function in
  // pollCard
  export default function usernameFriend({setRefreshCard}: any, username: string, user_id: number, friendList: string[]){

    return <div> {addFriend({setRefreshCard}, username, user_id, friendList)}</div>
  }

  function addFriend({setRefreshCard}: any, username: string, user_id: number, friendList: string[]) {
    const { isAuth, setAuth } = useContext(AuthContext);
    const [open, setOpen] = React.useState(false);
    const [my_user_id, setUID] = React.useState(localStorage.getItem("my_user_id"));
    // const [isFriend, setFreind] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [refresh, setRefresh] = React.useState<boolean>(false)

    // I don't think this is actually necessary for the cards updating but could be useful for something else
    React.useEffect(()=>{ 
        if(refresh){
          setRefresh(false)
        }
    }, [refresh])
  
    function handleClick(event: any): void {
          
             //setFreind is just a flag to tell the frontend what type of heart to render
          //here we will actually make a freind in the db   
          if (isAuth){
            if(isFriend()){
              fetch(`${process.env.BACKEND_URL}/users/${user_id}/unfollow`, {
                method: 'DELETE',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
              })
                .then((response) => {
                  if (!response.ok) {
                    return response.text().then((text) => {
                      throw new Error(text);
                    });
                  } else {
                    alert("Successfully removed friend!");
                    // remove friend from local friends list
                    friendList.splice(friendList.indexOf(username), 1);
                    // Important - set localStorage to new friendList right away
                    friendList.length > 0 ? localStorage.setItem("friends", friendList.splice(friendList.indexOf(username), 1).join(",")) : localStorage.removeItem("friends")
                    setOpen(false);
                    setRefresh(true);
                    setRefreshCard(true);
                  }
                })
                .catch((error) => {});
            }
            else{
              fetch(`${process.env.BACKEND_URL}/users/${user_id}/follow`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
              })
                .then((response) => {
                  if (!response.ok) {
                    return response.text().then((text) => {
                      throw new Error(text);
                    });
                  } else {
                    alert("Successfully added friend!");
                    // add friend to local friends list
                    friendList.push(username)
                    // Important - set localStorage to new friendList right away
                    localStorage.setItem("friends", friendList.join(","))
                    setOpen(false);
                    setRefresh(true);
                    setRefreshCard(true);
                  }
                })
                .catch((error) => {});
            }
          }
          else{
            alert("You must be logged in in order to add freinds.")
          }
      }

    // need to return true/false directly from friendList in order to have all cards update
    const isFriend = () =>  {
      return friendList.includes(username);
    }
    
    return (
      <div>
        <Button sx={{textTransform: "none"}}onClick={handleOpen}><Typography variant="subtitle2"> 
        <Stack direction="row" spacing='5px'>
            <div>{username} </div>
            <div>{isFriend() ? <FavoriteIcon sx={{ fontSize: '20px' }}/> :  <FavoriteBorderIcon sx={{ fontSize: '20px' }}/>}</div>
        </Stack>
        </Typography></Button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            {isFriend() ? <Typography sx={{textTransform: "none"}}>Remove {username} as a friend?</Typography> : <Typography sx={{textTransform: "none"}}>Add {username} as a friend?</Typography>}
            <Button sx={{textTransform: "none", boxShadow: 24,  width: 'auto', height: 'auto', mt: 2 }} onClick={handleClick}>Yes!</Button>
          </Box>
        </Modal>
      </div>
    );
  }