var express = require('express');
var router = express.Router();

const pool = require('../../db.js');

const checkAuthenticated = require('../../middleware.js');

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

router.get('/:pollId', function (req, res) {
  const pollId = req.params.pollId;
  pool.query(
    'SELECT Options.option_id, Options.option_text, COUNT(Votes.vote_id) as vote_count ' +
      'FROM Options ' +
      'LEFT JOIN Votes ON Options.option_id = Votes.option_id ' +
      'WHERE Options.poll_id = ? ' +
      'GROUP BY Options.option_id',
    [pollId],
    (error, results) => {
      if (error) {
        console.error(`Error fetching votes for poll ${pollId}`, error);
        res.status(500).send('Error fetching votes');
        return;
      }
      res.json(results);
    },
  );
});

router.post('/', checkAuthenticated, function (req, res) {
  const userId = req.body.user_id;
  const optionId = req.body.option_id;

  pool.query(
    'INSERT INTO Votes (user_id, option_id) VALUES (?, ?)',
    [userId, optionId],
    (error, results) => {
      if (error) {
        console.error(`Error when user ${userId} is voting for option ${optionId}`, error);
        res.status(500).send('Error recording your vote');
        return;
      }
      res.status(201).send({ message: 'Vote successfully recorded', voteId: results.insertId });
    },
  );
});

module.exports = router;
