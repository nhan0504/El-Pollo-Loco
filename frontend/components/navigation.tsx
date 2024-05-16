'use client';
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import AddIcon from '@mui/icons-material/Add';
import AccountCircle from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import Button from '@mui/material/Button';
import HomeIcon from '@mui/icons-material/Home';
import SearchComponent from './discover/search';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/contexts/authContext';
import { useContext, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import PollForm from './discover/pollForm';

// This function is a nav bar template from Material UI with some small additions and removals
// https://mui.com/material-ui/react-app-bar/#app-bar-with-a-primary-search-field
export default function PrimarySearchAppBar({ setPollData }: any) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState<null | HTMLElement>(null);

  const { isAuth, setAuth } = useContext(AuthContext);
  const { push, refresh } = useRouter();

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const [pollFormOpen, setPollFormOpen] = useState<boolean>(false);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {isAuth
        ? [
            <MenuItem
              onClick={() => {
                push('/profile');
                handleMenuClose();
              }}
              key={1}
            >
              Profile
            </MenuItem>,
            <MenuItem
              onClick={() => {
                fetch(`${[process.env.BACKEND_URL]}/auth/logout`, {
                  method: 'POST',
                  credentials: 'include',
                })
                  .then((res) => {
                    setAuth(false);
                    localStorage.clear();
                    handleMenuClose();
                    window.location.reload();
                  })
                  .catch();
              }}
              key={3}
            >
              Logout
            </MenuItem>,
          ]
        : [
            <MenuItem
              onClick={() => {
                push('/auth/login');
                handleMenuClose();
              }}
              key={1}
            >
              Login
            </MenuItem>,
            <MenuItem
              onClick={() => {
                push('/auth/signup');
                handleMenuClose();
              }}
              key={2}
            >
              Sign Up
            </MenuItem>,
          ]}
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  const CreatePoll = () => {
    if (isAuth == false) {
      alert('You cannot create a poll without logging in.');
      push('/auth/login');
    } else {
      setPollFormOpen(true);
    }
  };

  function pollFormDialog() {
    return (
      <Dialog
        PaperProps={{
          style: {},
          sx: { m: 0, p: 0, maxHeight: 800, position: 'absolute', top: 15 },
        }}
        open={pollFormOpen}
        onClose={(event) => setPollFormOpen(false)}
        sx={{ m: 0, p: 0 }}
      >
        {PollForm()}
      </Dialog>
    );
  }

  const endMenuButtons = () => {
    if (isAuth == false) {
      return (
        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          {/* Need to make sure the correct buttons are chosen before nav render */}
          <Typography>
            <Button
              variant="text"
              onClick={(event) => {
                push('/auth/login');
              }}
            >
              Log in
            </Button>
          </Typography>
          <Typography variant="body2" alignSelf="center">
            /
          </Typography>
          <Typography>
            <Button variant="text" onClick={(event) => push('/auth/signup')}>
              Sign Up
            </Button>
          </Typography>
        </Box>
      );
    } else {
      return (
        <React.Fragment>
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </React.Fragment>
      );
    }
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'white' }}>
      <AppBar position="static" sx={{ bgcolor: 'white', color: '#1976d2', mb: 3 }}>
        <Toolbar>
          <Typography
            color="inherit"
            noWrap
            component="div"
            sx={{ p: 1, mr: 3, display: { xs: 'none', sm: 'block' } }}
          >
            El Pollo Loco
          </Typography>
          <HomeIcon
            cursor="pointer"
            fontSize="large"
            sx={{ mr: 4 }}
            onClick={() => {
              push('/discover');
            }}
          />
          <Button variant="contained" size="medium" sx={{}} onClick={(event) => CreatePoll()}>
            Create Poll&nbsp;
            <AddIcon fontSize="small" />
          </Button>
          {pollFormDialog()}

          <SearchComponent setPollData={setPollData} />

          <Box sx={{ flexGrow: 1 }} />
          {endMenuButtons()}
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
}
