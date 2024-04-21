var express = require('express');
var router = express.Router();

const pool = require('../db.js');

//TODO: Make optionid and userid unique

//GET number of vote for option with option_id
router.get('/:optionId/numVote', function (req, res) {
  const optionId = req.params.optionId;
  pool.query(
    'SELECT COUNT(*) AS num_vote FROM Votes WHERE option_id = ?',
    [optionId],
    (error, results) => {
      if (error) {
        console.error(`Error getting number of vote for option ${optionId}`, error);
        res.status(500).send(`Error getting number of vote for option ${optionId}`);
        return;
      }
      res.json(results);
    },
  );
});

//GET user_id of user who voted for option option_id
router.get('/:optionId/users', function (req, res) {
  const optionId = req.params.optionId;
  pool.query('SELECT user_id FROM Votes WHERE option_id = ?', [optionId], (error, results) => {
    if (error) {
      console.error(`Error get users who voted for option ${optionId}`, error);
      res.status(500).send(`Error get users who voted for option ${optionId}`);
      return;
    }
    res.json(results);
  });
});

//POST a vote
router.post('/', function (req, res) {
  const voteData = req.body;
  pool.query(
    'INSERT INTO Votes(user_id, option_id) VALUES(?, ?)',
    [voteData.user_id, voteData.option_id],
    (error, results) => {
      if (error) {
        console.error(`Error creating a vote`, error);
        res.status(500).send(`Error creating a vote`);
        return;
      }
      res.send('Vote created successfully');
    },
  );
});

//DELETE a vote (If user undo a vote)
router.delete('/:optionId/:userId', function (req, res) {
  const optionId = req.params.optionId;
  const userId = req.params.userId;
  pool.query(
    'DELETE FROM Votes WHERE option_id = ? AND user_id = ? ',
    [optionId, userId],
    (error, results) => {
      if (error) {
        console.error(`Error deleting vote by user ${userId} on option ${optionId}`, error);
        res.status(500).send(`Error deleting vote by user ${userId} on option ${optionId}`);
        return;
      }
      if (results.affectedRows === 0) {
        res.status(404).send('Option or user not found');
      } else {
        res.send(`Vote deleted successfully`);
      }
    },
  );
});

module.exports = router;
