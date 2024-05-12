'use client';
import * as React from 'react';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

// To do in this file - remove any of my hardcoded width/height 
// values and make it fully responsive

function PollForm() {
  const [pollData, setPollData] = useState<{
    title: string;
    options: {
        optionID: number;
        optionText: string;
    }[];
    tags: string[];
  }>
  ({
    // Need to get current logged in user
    title: '',
    options: [
      {
        optionID: 0,
        optionText: '',
      },
      {
        optionID: 0,
        optionText: '',
      },
    ],
    tags: []
  });

  //const pollRef = useRef(pollData);

  
  //const [tags, setTags] = useState<string[]>([]);
  const [currTag, setTag] = useState<string>("");
  const [pressed, setPressed] = useState<KeyboardEvent>();

  // Update all pollData values every time an input box changes
  const handleChange = (event: any, fieldName: string, ind: number = 0) => {
    const title = event.target.value;
    if (fieldName === 'title') {
      setPollData((pollData) => ({ ...pollData, title: title }));
    } else if (fieldName === 'options') {
      const newText = event.target.value;
      pollData.options[ind].optionText = newText;

      setPollData((pollData) => ({ ...pollData, options: pollData.options }));
    }
  };

  const { push } = useRouter();

  const handleSubmit = (event: any) => {
    fetch(`${process.env.BACKEND_URL}/polls/`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: pollData.title,
        options: pollData.options.map((option) => option.optionText),
        tags:pollData.tags
      }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(text);
          });
        } else {
          return response.text().then((text) => {
            console.log(text);
          });
        }
      })
      .catch((error) => error.message);

    // push('/discover');
    window.location.reload();
    //POST
  };

  function validateForm() {
    if (pollData.title.length === 0) {
      alert('Your title cannot be blank.');
      return false;
    }

    let missingOption = false;

    pollData.options.map((option, index) => {
      if (option.optionText.length === 0) {
        if (!missingOption) alert('Options cannot be blank.');
        missingOption = true;
      }
    });

    return !missingOption;
  }

  const addOption = () => {
    pollData.options.length < 6
      ? setPollData((pollData) => ({
          ...pollData,
          title: pollData.title,
          options: [...pollData.options, { optionID: 0, optionText: '' }],
        }))
      : alert('You cannot add more than 6 options.');
  };

  // Not great naming for variables here but ind = index of the option being removed, match to
  // map index to find the right option
  function removeOption(ind: number) {
    const newOptions =
      pollData.options.length > 2
        ? pollData.options.filter(function (option, index) {
            if (ind == index) {
              return false;
            }
            return true;
          })
        : pollData.options;

    setPollData((pollData) => ({
      ...pollData,
      options: newOptions,
    }));
  }

  const optionList = pollData.options?.map((option, index) => (
    <React.Fragment key={1}>
      <Box
        alignItems="center"
        sx={{ flexDirection: "row", justifyContent: "center", color: 'black', display: 'flex' }}
      >
        {/* <Typography variant="body1" sx={{}}>
          Option
        </Typography> */}
        <ListItemText primary="Option" />
        <TextField
          type="text"
          name="option"
          variant="outlined"
          size="small"
          multiline
          rows=""
          value={option.optionText}
          sx={{ m: 1, width: 250 }}
          onChange={(event) => handleChange(event, 'options', index)}
        />
        <IconButton
          size="small"
          edge="end"
          onClick={(event) => {
            removeOption(index);
          }}
          sx={{maxWidth: '10px', minWidth: '10px' }}
        >
          x
        </IconButton>
      </Box>
    </React.Fragment>
  ));

  const handleTagChange = (newTag: string) => {
    //need this to be split by whitespace for now, should prolly make it more robust?
    if (pressed?.key === 'Enter' || pressed?.key === ",") {

      pollData.tags.length < 20
      ? setPollData((pollData) => ({
          ...pollData,
          tags: [...pollData.tags,  newTag.substring(0, newTag.length-1)],
        }))
      : alert('You cannot add more than 20 tags.');
      
      setTag("");
    }

    else{

      setTag(newTag);
    }
  }

  const handleKeyDown = (event: any) => {

    setPressed(event);
  }

  function tagChips(pollData: any){
    
    return(
        pollData.tags?.map((tag: any, index: any) => (
        
          <Chip 
            label={
            <React.Fragment>
              {tag}
              <Button 
                onClick={(event) => removeTag(index)}
                size="small" 
                variant="text" 
                style={{fontSize:"11px"}} 
                sx={{alignItems: 'center', display:"flex-block", flexDirection:"row", ml: 0.5,  maxWidth: '10px', minWidth: '10px', maxHeight: '7px' }}>
                x</Button>
              </React.Fragment>} 
            key={tag} 
            variant="outlined" 
            sx={{m:0.5}}
            />
        ))
    )
  }

  function removeTag(ind: number){
    const newTags =
    pollData.tags.filter(function (tag, index) {
          if (ind == index) {
            return false;
          }
          return true;
        })

    setPollData((pollData) => ({
      ...pollData,
      tags: newTags
    }));
  }

  return (
    <Card
      sx={{boxShadow:2}}
      style={{
        width: 380,
        display: 'flex',
        justifyContent: 'space-evenly',
        flexDirection: 'column',
        borderRadius: 15
      }}
    >
      <CardContent style={{ margin: 2 }}>
        <form
          action={(event) => {
            if (validateForm()) {
              handleSubmit(event);
            }
          }}
          
        >
          <FormControl>
            
            <Typography variant="h6" component="div" align="center" sx={{ p: 1 }}>
              Poll Title
            <br/>
            <TextField
              type="text"
              variant="outlined"
              size="small"
              name="title"
              multiline
              rows=""
              value={pollData.title}
              sx={{ m: 1, minWidth:280}}
              onChange={(event) => handleChange(event, 'title')}
            />
            </Typography>

            <Button onClick={addOption}>Add poll option</Button>

            <FormGroup>{optionList}</FormGroup>
            
            <br />
            <Typography variant="body2" color="textSecondary" sx={{}}>
              Tags
            </Typography>

            <TextField 
              placeholder="Separate tag names with commas" 
              value={currTag} 
              onKeyDown={handleKeyDown} 
              onChange={(event) => handleTagChange(event.target.value)} 
              size="small"
              sx={{m:1}}
              >
            </TextField>

            <Box display="flex" sx={{maxWidth:350, flexWrap: 'wrap'}}>
                {tagChips(pollData)}
              </Box>
            <br/>

            <Button variant="contained" type="submit" sx={{ m: 2 }}>
              Create
            </Button>
          </FormControl>
        </form>
      </CardContent>
    </Card>
  );
}

export default function CreatePoll() {
  return (
    <Box sx={{ minWidth: 370, minHeight: "min-content"}}>
      <PollForm />
    </Box>
  );
}
