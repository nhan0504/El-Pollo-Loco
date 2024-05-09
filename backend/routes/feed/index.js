var express = require('express');
var router = express.Router();

const pool = require('../../db.js');

router.get('/:pageNum?', function (req, res) {

  const pageNum = parseInt(req.params.pageNum, 10) || 1;
  const offset = (pageNum - 1) * 6;

  // Weights for discover algorithm
  const dateWeight = -15;
  const voteWeight = 1;

  pool.query(
    `SELECT 
        Polls.poll_id, 
        Polls.title, 
        Polls.created_at, 
        Users.username,
        Users.user_id, 
        COUNT(Votes.vote_id) AS vote_count,
        GROUP_CONCAT(DISTINCT Tags.tag_name ORDER BY Tags.tag_name SEPARATOR ', ') AS tags,
        (
            DATEDIFF(CURDATE(), Polls.created_at) * ? + 
            COUNT(Votes.vote_id) * ?
        ) AS score
    FROM 
        Polls
    JOIN 
        Users ON Polls.user_id = Users.user_id
    LEFT JOIN 
        PollsTags ON Polls.poll_id = PollsTags.poll_id
    LEFT JOIN 
        Tags ON PollsTags.tag_id = Tags.tag_id
    LEFT JOIN 
        Options ON Polls.poll_id = Options.poll_id
    LEFT JOIN 
        Votes ON Options.option_id = Votes.option_id
    GROUP BY 
        Polls.poll_id
    ORDER BY 
        score DESC
    LIMIT 6 OFFSET ?;`,
    [dateWeight, voteWeight, offset],
    (error, results) => {
      if (error) {
        console.error('Error fetching polls', error);
        res.status(500).send('Error fetching polls');
        return;
      }
      if (results.length === 0) {
        res.status(404).send('No polls found');
        return;
      }
      const pollsPromises = results.map(
        (poll) =>
          new Promise((resolve, reject) => {
            pool.query(
              'SELECT Options.option_id, Options.option_text, COUNT(Votes.vote_id) AS vote_count ' +
                'FROM Options ' +
                'LEFT JOIN Votes ON Options.option_id = Votes.option_id ' +
                'WHERE Options.poll_id = ? ' +
                'GROUP BY Options.option_id',
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
          }),
      );

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

//Get poll by title
router.get('/title/:titleName', function (req, res) {
  const query = `%${req.params.titleName}%`;
  pool.query('SELECT * from Polls WHERE title LIKE ?', [query], (error, result) => {
    if (error) {
      console.log(`Error getting poll containing ${query} in the title`);
      res.status(500).send('Error searching for poll')
    }

    res.json(result);
  });
});
module.exports = router;
