'use client'
import * as React from 'react';
import { useState, useEffect } from 'react';
import { Container, Grid, Box } from '@mui/material';

import AspectRatio from '@mui/joy/AspectRatio';
import Button from '@mui/joy/Button';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import FormHelperText from '@mui/joy/FormHelperText';
import Input from '@mui/joy/Input';
import IconButton from '@mui/joy/IconButton';
import Textarea from '@mui/joy/Textarea';
import Stack from '@mui/joy/Stack';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Typography from '@mui/joy/Typography';
import Tabs from '@mui/joy/Tabs';
import TabList from '@mui/joy/TabList';
import Tab, { tabClasses } from '@mui/joy/Tab';
import Breadcrumbs from '@mui/joy/Breadcrumbs';
import Link from '@mui/joy/Link';
import Card from '@mui/joy/Card';
import CardActions from '@mui/joy/CardActions';
import CardOverflow from '@mui/joy/CardOverflow';

import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import AccessTimeFilledRoundedIcon from '@mui/icons-material/AccessTimeFilledRounded';
import VideocamRoundedIcon from '@mui/icons-material/VideocamRounded';
import InsertDriveFileRoundedIcon from '@mui/icons-material/InsertDriveFileRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';

import PollCard from '../discover/pollCard';
import FeedButtons from '../discover/feedButtons';

export default function MyProfile() {

  const [loading, setLoading] = useState(true);
  const [pollData, setPollData] = useState([]);
  const [editing, setEditing] = useState(false);
  const [userData, setUserData] = useState<{
    username: string,
    user_id: number,
    email: string,
  }>([]);

  async function getPolls() {
    let response = await fetch(`${process.env.BACKEND_URL}/feed/user`, {
      method: 'GET',
      credentials: 'include'
    });
    let data = await response.json();
    if (response.ok) {
      //alert(JSON.stringify(data));
      setPollData(data);

      // Once we've successfully fetched the user info, load page components
      // Doing it like this because the username needs to be ready before we load
      // but polls don't necessarily have to be there right away
      if(userData.username != "")
        setLoading(false);
    }
  }

  async function getUser() {
    let response = await fetch(`${process.env.BACKEND_URL}/auth/profile`, {
      method: 'GET',
      credentials: 'include'
    });
    let data = await response.json();
    if (response.ok) {
      // alert(JSON.stringify(data));
      setUserData(data);
      // setLoading(false);
    }
    else{
      // alert(JSON.stringify(data));

    }
  }

  useEffect(() => {
    getPolls();
    getUser();
  }, []);

  function FormRow(pollData: any) {
    // Not the state pollData, but a parameter that contains 1 or 2 polls
    let row = [];

    for (let i = 0; i < pollData.length; i++) {
      // We can't pop off polls from the list since they need to stay in memory to rerender
      // If we needed to remove a poll for any reason, we would use setPollData with pollData.filter
      let currCard = pollData[i];
      let loaded = true;

      row.push(
        <Grid item xs={5} style={{ padding: 50 }} key={i}>
          {PollCard(
            [''],
            currCard?.title,
            currCard?.options?.map((option: any) => ({
              optionText: option.option_text,
              votes: option.vote_count,
              option_id: option.option_id,
            })),
            currCard?.username,
          )}
        </Grid>,
      );
    }

    return <React.Fragment>{row}</React.Fragment>;
  }

  function CardsTogether() {
    const rows = 3;
    const cols = 2;
    let grid = [];

    if (pollData.length > 0){
      for (let i = 0; i < rows; i++) {
        grid.push(
          <Grid container item spacing={1} justifyContent="space-around" key={i}>
            {/* Give FormRow 2 polls (or 1 if there's only 1 left) at a time to form the row */}
            {FormRow(pollData?.slice(i * cols, i * cols + cols))}
          </Grid>
          );
      }
    
  
    return (
      <React.Fragment>
        <Grid container spacing={1}>
          {grid}
        </Grid>
      </React.Fragment>
    );
    }

    else if(pollData.length == 0 && !loading){

      return <Typography level="body-sm">You haven't made any polls yet. Click the "Create Poll" button to get started!</Typography>

    }
  }

  return (loading? <div>...Loading</div>:
    <Box sx={{ flex: 1, width: '100%' }}>
      <Box
        sx={{
          position: 'sticky',
          top: { sm: -100, md: -110 },
          bgcolor: 'background.body',
          zIndex: 9995,
        }}
      >
        
        
      </Box>
      <Stack
        spacing={4}
        sx={{
          display: 'flex',
          maxWidth: '1000px',
          mx: 'auto',
          px: { xs: 2, md: 6 },
          py: { xs: 2, md: 3 },
        }}
      >
        <Box sx={{ mb: 1 }}>
            <Typography level="title-md">{userData.username}'s Profile Page</Typography>
          </Box>          
          <Stack
            direction="row"
            spacing={3}
            sx={{ display: { xs: 'none', md: 'flex' }, my: 0 }}
          >
            
            
          </Stack>
          
        
        <Card sx={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>

        <Box sx={{ mb: 1 }}>
                <Typography level="title-md">Bio</Typography>
                <Typography level="body-sm">
                Write a short introduction to be displayed on your profile
                </Typography>
            </Box>
            
            <CardOverflow sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
                <CardActions sx={{ alignSelf: 'flex-end', pt: 2 }}>
                <Button size="sm" variant="outlined" color="neutral">
                    Cancel
                </Button>
                <Button size="sm" variant="solid">
                    Save
                </Button>
                </CardActions>
            </CardOverflow>
          <CardsTogether /> 
          
        </Card>
      </Stack>
    </Box>
  );
}