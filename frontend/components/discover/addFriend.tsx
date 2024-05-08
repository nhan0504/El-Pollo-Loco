import { Typography } from "@mui/material";
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { BorderAllRounded } from "@mui/icons-material";


const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 200,
    bgcolor: 'background.paper',
    border: '1px solid #000',
    boxShadow: 24,
    p: 1
  };
  
  export default function usernameFriend(username: string) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
  
    return (
      <div>
        <Button sx={{textTransform: "none"}}onClick={handleOpen}><Typography variant="subtitle2">{username}</Typography></Button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Button sx={{textTransform: "none", boxShadow: 24,  width: 'auto', height: 'auto' }}>Add {username} as a friend!</Button>
          </Box>
        </Modal>
      </div>
    );
  }