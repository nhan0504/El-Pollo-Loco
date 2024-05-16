import { Stack, Typography, setRef } from '@mui/material';
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { AuthContext } from '@/contexts/authContext';
import { useContext } from 'react';

const style = {
  bgcolor: 'background.paper',
  p: 1,
  borderRadius: 1,
};

// The key to all cards changing at once is passing in a regular friendList variable given by the parent, pollCard, and
// NOT using states to control following/unfollowing behavior. setRefreshCard just triggers a useEffect function in
// pollCard
export default function usernameFriend(
  { setRefreshCard }: any,
  username: string,
  user_id: number,
  friendList: string[],
) {
  return <div> {addFriend({ setRefreshCard }, username, user_id, friendList)}</div>;
}

function addFriend(
  { setRefreshCard }: any,
  username: string,
  user_id: number,
  friendList: string[],
) {
  const { isAuth, setAuth } = useContext(AuthContext);
  const [open, setOpen] = React.useState(false);
  const [my_user_id, setUID] = React.useState(localStorage.getItem('my_user_id'));
  // const [isFriend, setFreind] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [refresh, setRefresh] = React.useState<boolean>(false);

  // I don't think this is actually necessary for the cards updating but could be useful for something else
  React.useEffect(() => {
    if (refresh) {
      setRefresh(false);
    }
  }, [refresh]);

  function handleClick(event: any): void {
    setOpen(false);

    //setFreind is just a flag to tell the frontend what type of heart/text to render
    //here we will actually make/remove a freind in the db
    if (isAuth) {
      if (isFriend()) {
        fetch(`${process.env.BACKEND_URL}/users/${user_id}/unfollow`, {
          method: 'DELETE',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        })
          .then((response) => {
            if (!response.ok) {
              return response.text().then((text) => {
                throw new Error(text);
              });
            } else {
              setOpen(false);

              // remove friend from local friends list
              friendList.splice(friendList.indexOf(username), 1);
              // Important - set localStorage to new friendList right away
              friendList.length > 0
                ? localStorage.setItem('friends', friendList.join(','))
                : localStorage.removeItem('friends');
              setRefresh(true);
              setRefreshCard(true);
            }
          })
          .catch((error) => {});
      } else {
        fetch(`${process.env.BACKEND_URL}/users/${user_id}/follow`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        })
          .then((response) => {
            if (!response.ok) {
              return response.text().then((text) => {
                throw new Error(text);
              });
            } else {
              setOpen(false);

              // add friend to local friends list
              friendList.push(username);
              // Important - set localStorage to new friendList right away
              localStorage.setItem('friends', friendList.join(','));
              setRefresh(true);
              setRefreshCard(true);
            }
          })
          .catch((error) => {});
      }
    } else {
      //doesn't  redirect to login
      alert('You must be logged in in order to add freinds.');
    }
  }

  // need to return true/false directly from friendList in order to have all cards update
  const isFriend = () => {
    return friendList.includes(username);
  };

  // messagge for adding/removing friend
  const dialogMessage = () => {
    return {
      header: isFriend()
        ? 'Remove ' + username + ' as a friend?'
        : 'Add ' + username + ' as a friend?',
      body: isFriend()
        ? 'Their polls will no longer appear on your Friends feed.'
        : 'Their polls will appear on your Friends feed.',
    };
  };

  return (
    <div>
      <Button sx={{ textTransform: 'none' }} onClick={handleOpen}>
        <Typography variant="subtitle2">
          <Stack direction="row" spacing="5px">
            <div>{username} </div>
            <div>
              {isFriend() ? (
                <FavoriteIcon sx={{ fontSize: '20px' }} />
              ) : (
                <FavoriteBorderIcon sx={{ fontSize: '20px' }} />
              )}
            </div>
          </Stack>
        </Typography>
      </Button>
      <Dialog open={open} onClose={handleClose} PaperProps={{ sx: { borderRadius: '25px' } }}>
        <DialogContent
          sx={{
            maxWidth: 350,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <DialogTitle style={{ textAlign: 'center' }}>{dialogMessage().header}</DialogTitle>

          <Typography sx={{}} style={{ textAlign: 'center' }}>
            {dialogMessage().body}
          </Typography>
          <Button
            variant="contained"
            sx={{ textTransform: 'none', boxShadow: 24, width: 'auto', height: 'auto', mt: 2 }}
            onClick={handleClick}
          >
            {isFriend() ? 'Remove' : 'Add'}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
