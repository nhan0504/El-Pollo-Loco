import { Stack, Typography } from "@mui/material";
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';



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
    const [open, setOpen] = React.useState(false);
    const [isFriend, setFreind] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
  
      function handleClick(event: any): void {
          //alert("Successfully added friend!");
          setOpen(false);
          setFreind(true); //setFreind is just a flag to tell the frontend what type of heart to render
          //here we will actually make a freind in the db   
          //TODO
          
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