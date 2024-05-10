import { Stack, Typography } from "@mui/material";
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
  
  export default function usernameFriend(username: string, user_id: number) {
    const { isAuth, setAuth } = useContext(AuthContext);
    const [open, setOpen] = React.useState(false);
    const [my_user_id, setUID] = React.useState(localStorage.getItem("my_user_id"));
    const [isFriend, setFreind] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    React.useEffect(()=>{
        //console.log(my_user_id)
        if (isAuth){
            fetch(`${process.env.BACKEND_URL}/users/${my_user_id}/following`, {
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
                    console.log(response.json())
                  }
                })
                .catch((error) => {});
          }
    }, []);
  
    function handleClick(event: any): void {
          
             //setFreind is just a flag to tell the frontend what type of heart to render
          //here we will actually make a freind in the db   
          //TODO
          //make sure they are logged in first
          if (isAuth){
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
                    setFreind(true);
                    setOpen(false);
                  }
                })
                .catch((error) => {});
          }
          else{
            alert("You must be logged in in order to add freinds.")
          }

          
      }

    return (
      <div>
        <Button sx={{textTransform: "none"}}onClick={handleOpen}><Typography variant="subtitle2"> 
        <Stack direction="row" spacing='5px'>
            <div>{username} </div>
            <div>{isFriend ? <FavoriteIcon sx={{ fontSize: '20px' }}/> :  <FavoriteBorderIcon sx={{ fontSize: '20px' }}/>}</div>
        </Stack>
        </Typography></Button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography sx={{textTransform: "none"}}>Add {username} as a friend?</Typography>
            <Button sx={{textTransform: "none", boxShadow: 24,  width: 'auto', height: 'auto', mt: 2 }} onClick={handleClick}>Yes!</Button>
          </Box>
        </Modal>
      </div>
    );
  }