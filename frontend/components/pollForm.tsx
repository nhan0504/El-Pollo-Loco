'use client';
import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import { ButtonGroup } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import TextField from '@mui/material/TextField';
import FormLabel from '@mui/material';
import { MuiChipsInput } from 'mui-chips-input'
import { stringify } from 'querystring';
import { title } from 'process';

function PollForm() {

    let index = 0

    const [pollData, setPollData] = useState({
        // Need to get current logged in user
        userID:123,
        title: "",
        options: [
            {
                optionID:0,
                optionText:"",
                index:0
            },
            {
                optionID:0,
                optionText:"",
                index:1
            }
        ],        
    })

    const [tags, setTags] = useState<string[]>([]);

    const handleChange = (event: any, fieldName: string, id:number=0) => {
        const title = event.target.value;
        alert(title)
        if (fieldName === "title") {
            setPollData(pollData => ({...pollData, title: title}))
        }
        else if (fieldName === "options") {

            const newText = event.target.value;
            setPollData(pollData => ({...pollData, options: (pollData.options).map((option) => {
                if(option.index === id){

                    pollData.options[id].optionText = newText;

                }
                return option;
            })}))
        }
    }
    
    const handleSubmit = (event: any) => {

        alert("Successfully made poll!" + pollData.title + pollData.options[0].optionText+ pollData.options[1].optionText+tags[0]);
        //POST


    }


    const addOption = () => {
        setPollData(pollData => ({
            ...pollData,
            userID: pollData.userID,
            title: pollData.title,
            options: [...pollData.options, {optionID: 0, optionText: "", index: pollData.options.length}]
        }))
    }

    const optionList = pollData.options?.map((option) =>

        <Typography component="div" align="left" key={1}>
            Option
            <TextField 
                type="text" 
                name="option"
                variant="outlined"
                size="small"
                sx={{m:1}}
                value={option.optionText} 
                onChange={(event) => handleChange(event, "options", option.index)}
            />
        </Typography>

    )

    const handleTagChange = (newTags: string) => {
        //need this to be split by whitespace for now, should prolly make it more robust?
        
        setTags([newTags]);
    }

    return(
        <Card style={{width: 350, display: 'flex', justifyContent: 'space-evenly', flexDirection: 'column'}}>
            <CardContent style={{margin: 2}}>
                <form action={handleSubmit} method="POST">
                    
                    <FormControl>
                        <Typography variant="h5" component="div" align="center" sx={{p:3}}>
                        Poll Title
                        <TextField
                            type="text"
                            variant="outlined"
                            size="small"
                            name="title"
                            sx={{}}
                            onChange={(event) => handleChange(event, "title")}
                        />
                        </Typography>
                    
                        <Button 
                            onClick={addOption}
                        >
                            Add poll option
                        </Button>
                        
                        <FormGroup>
                        {optionList}
                        </FormGroup>

                        <Typography variant="h5" component="div" align="center" sx={{p:3}}>
                        Tags
                        <TextField
                            type="text"
                            variant="outlined"
                            size="small"
                            name="tags"
                            sx={{}}
                            onChange={(event) => handleTagChange(event.target.value)}
                        />
                        </Typography>

                        <Button 
                            variant="contained"
                            type="submit"
                            sx={{m:2}}
                            
                        >
                            Create
                        </Button>
                    </FormControl>
                </form>
            </CardContent>
        </Card>
    )
}

export default function CreatePoll (){
    console.log("here!");
    return(
       <Box sx={{ minWidth: 375 }}>
            <PollForm/>
        </Box>
    );
}
