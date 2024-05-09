'use client';
import * as React from 'react';
import { Container, Grid, Box } from '@mui/material';
import PollCard from './pollCard';
import FeedButtons from './feedButtons';
import { useState, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Grow from '@mui/material/Grow';



export default function Feed({ pollData, setPollData }: any) {
  const [isLoading, setLoading] = useState<boolean>(true);
  const [pollsVoted, setPollsVoted] = useState<{poll_id: number, option_id: number}[]>([]);
  // const [pollsOnPage, setPollsOnPage] = useState<number[]>();

  // Need to keep track of how many "pages" have been loaded (how many batches of 6) so we can keep getting older
  // polls by passing in the page num to GET request. Pages not zero indexed.
  const [virtualPage, setVirtualPage] = useState<number>(2);

  // Passing an empty array to useEffect means that it'll only be called on page load when the component is first rendered
  useEffect(() => {
    getPolls('discover');
  }, []);

  // Should there be another useEffect that triggers when the virtual page number is changed? Need to get more poll for
  // infinite scrolling

  async function getPolls(feedType: string) {
    if (feedType === 'discover') {
      let response = await fetch(`${process.env.BACKEND_URL}/feed`, {
        method: 'GET'
      });
      let data = await response.json();
      if (response.ok && data.length > 0) {
        // alert(JSON.stringify(data));

        // Directly pass in the list of poll ids - can't use states
        // since they aren't set until the function exits
        await getVoted(data.map((poll: any) => {
          return poll.poll_id;
        }));

        // Wait until we have the list that tells us which polls on
        // the page have been voted on before continuing
        setPollData(data);        
        setLoading(false);
      }
    }
  }

  // Pass it the list of poll ids of 6 polls that were just fetched
  async function getVoted(polls: any) {
    try{
      let response = await fetch(`${process.env.BACKEND_URL}/polls/vote/voted`, {
        method: 'GET',
        credentials: 'include'
      });
      let data = await response.json();
      if (response.ok) {
        
        // Filter out any polls that the user voted on that aren't in this batch of
        // polls
        // May need to alter this approach or even have another state that holds
        // this filtered list while keeping the original complete list. Otherwise
        // we have to keep fetching the complete list every time more polls are
        // loaded w/ infinite scroll
        setPollsVoted(data.filter((poll: any) => polls.includes(poll.poll_id)));
      }
      else{
        setPollsVoted([{poll_id: -1, option_id: -1}]);
      }
    }
    catch (error) {

      setPollsVoted([{poll_id: -1, option_id: -1}]);
    }
  }

  // Needed a way to directly pass the "voted" state into PollCard
  function wasVotedOn(poll_id: number){
    // See if the poll with poll_id was voted on by comparing to pollsVoted list
    let index = pollsVoted.findIndex((poll) => poll.poll_id === poll_id);
    let voted = index > -1 ? pollsVoted[index] : {poll_id: poll_id, option_id: -1};
    return voted;
  }

  function FormRow(pollData: any) {
    // Not the state pollData, but a parameter that contains 1 or 2 polls
    let row = [];

    for (let i = 0; i < pollData.length; i++) {

      // We can't pop off polls from the list since they need to stay in memory to rerender
      // If we needed to remove a poll for any reason, we would use setPollData with pollData.filter
      let currCard = pollData[i];
      let loaded = true;

      row.push(
        <Grid item xs={4} style={{ padding: 50 }} key={i}>
          {PollCard(
            (currCard.tags)?.split(","),
            currCard?.title,
            currCard?.options?.map((option: any) => ({
              optionText: option.option_text,
              votes: option.vote_count,
              option_id: option.option_id,
            })),
            currCard?.username, 
            currCard?.poll_id,
            wasVotedOn(currCard.poll_id), currCard?.user_id
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

    for (let i = 0; i < rows; i++) {
      grid.push(
        <Grid container item spacing={3} justifyContent="space-around" key={i}>
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
  
  return isLoading ? (
    <Container maxWidth={false}>
      
        <FeedButtons />
        <Box display="flex" justifyContent="center">
        <CircularProgress></CircularProgress>
        </Box>
    </Container>
  ) : (
    <React.Fragment>
      <FeedButtons />
      <Grow in={true}>
        <Container maxWidth={false}>
          <CardsTogether />
        </Container>
      </Grow>
    </React.Fragment>
  );
}
