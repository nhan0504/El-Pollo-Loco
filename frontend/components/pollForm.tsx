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


function pollForm() {

    const [pollData, setPollData] = useState({
        // Need to get current logged in user
        userID:123,
        title: "",
        options: [
            {
                optionID:"",
                optionText:""
            },
            {
                optionID:"",
                optionText:""
            }
        ],        
    })

    const handleChange = (event: any) => {
        const title = event.title;
        const options = event.options;
        setPollData(pollData => ({...pollData, title: title, options: options}))
    }

    const handleSubmit = (event: any) => {

        event.preventDefault();
    }

    const addOption = () => {
        setPollData(pollData => ({
            ...pollData,
            userID: pollData.userID,
            title: pollData.title,
            options: [...pollData.options, {optionID: "", optionText: ""}]
        }))
    }

    const optionList = pollData.options.map((option) =>

        <label>
            Option
            <input type="text" value={option.optionText} name={option.optionID} onChange={handleChange}/>
        </label>

    )

    return(
        <Card style={{display: 'flex', justifyContent: 'space-evenly', flexDirection: 'column'}}>
            <CardContent>
                <form action={handleSubmit} method="POST">
                    
                    <label> 
                        this.state.title
                        <input 
                            type="text" 
                            name="title"
                            value={pollData.title || ""}
                            onChange={handleChange}
                        />
                    </label>

                    {optionList}
                    
                    <Button 
                        onClick={addOption}
                    >
                        Add poll option
                    </Button>

                    <Button type="submit">Create</Button>

                </form>
            </CardContent>
        </Card>
    )
}



const makePoll = () => {
    // POST call to put poll info in database
}

export default function createPoll (userID: number, userName: string){

    return(

       <Box sx={{ minWidth: 375 }}>
            pollForm()
        </Box>
    );
}
