var express = require('express');
var router = express.Router();

const pool = require('../../db.js');
const checkAuthenticated = require('../../middleware.js');

router.get('/', checkAuthenticated, function (req, res) {
  const userId = req.user.user_id;

  pool.query(
    `SELECT 
    Polls.poll_id, 
    Polls.title, 
    Polls.created_at, 
    Users.username,
    GROUP_CONCAT(DISTINCT AllTags.tag_name ORDER BY AllTags.tag_name SEPARATOR ', ') AS tags
    FROM 
        Polls
    JOIN 
        Users ON Polls.user_id = Users.user_id
    JOIN 
        PollsTags ON Polls.poll_id = PollsTags.poll_id
    JOIN 
        Tags ON PollsTags.tag_id = Tags.tag_id
    JOIN 
        UserTag ON Tags.tag_id = UserTag.tag_id AND UserTag.user_id = ?
    JOIN 
        PollsTags AS AllPollsTags ON Polls.poll_id = AllPollsTags.poll_id
    JOIN 
        Tags AS AllTags ON AllPollsTags.tag_id = AllTags.tag_id
    GROUP BY 
        Polls.poll_id
    ORDER BY 
        Polls.created_at DESC 
    LIMIT 6;`,
    [userId],
    (error, pollResults) => {
      if (error) {
        console.error('Error fetching polls based on followed tags', error);
        res.status(500).send('Error fetching polls based on followed tags');
        return;
      }
      if (pollResults.length === 0) {
        res.status(404).send('No polls found for the followed tags');
        return;
      }

      const pollsPromises = pollResults.map(poll => new Promise((resolve, reject) => {
        pool.query(
          `SELECT Options.option_id, Options.option_text, COUNT(Votes.vote_id) AS vote_count 
          FROM Options 
          LEFT JOIN Votes ON Options.option_id = Votes.option_id 
          WHERE Options.poll_id = ? 
          GROUP BY Options.option_id`,
          [poll.poll_id],
          (error, optionsResults) => {
            if (error) {
              reject(`Error fetching options for poll ${poll.poll_id}`);
            } else {
              resolve({
                ...poll,
                options: optionsResults,
              });
            }
          },
        );
      }));

      Promise.all(pollsPromises)
        .then((polls) => {
          res.status(200).json(polls);
        })
        .catch((pollsError) => {
          console.error('Error fetching polls with options', pollsError);
          res.status(500).send('Error fetching polls with options');
        });
    },
  );
});
module.exports = router;