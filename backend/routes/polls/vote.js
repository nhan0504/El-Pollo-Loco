var express = require('express');
var router = express.Router();

const pool = require('../../db.js');

const checkAuthenticated = require('../../middleware.js');

router.get('/:pollId', function (req, res) {
  const pollId = req.params.pollId;
  pool.query(
    "SELECT Options.option_id, Options.option_text, COUNT(Votes.vote_id) as vote_count " +
      "FROM Options " +
      "LEFT JOIN Votes ON Options.option_id = Votes.option_id " +
      "WHERE Options.poll_id = ? " +
      "GROUP BY Options.option_id",
    [pollId],
    (error, results) => {
      if (error) {
        console.error(`Error fetching votes for poll ${pollId}`, error);
        res.status(500).send("Error fetching votes");
        return;
      }
      res.json(results);
    }
  );
});

//GET user_id of user who voted for option option_id
router.get("/:optionId/users", function (req, res) {
  const optionId = req.params.optionId; 
  pool.query(
    "SELECT user_id FROM Votes WHERE option_id = ?",
    [optionId],
    (error, results) => {
      if (error) {
        console.error(`Error get users who voted for option ${optionId}`, error);
        res.status(500).send(`Error get users who voted for option ${optionId}`);
        return;
      }
      res.json(results);
    }
  );
});

// TODO Get this working with authentication after it is setup
router.post("/", function (req, res) {
  const userId = req.body.user_id;
  const optionId = req.body.option_id;

  pool.query(
    'INSERT INTO Votes (user_id, option_id) VALUES (?, ?)',
    [userId, optionId],
    (error, results) => {
      if (error) {
        console.error(
          `Error when user ${userId} is voting for option ${optionId}`,
          error
        );
        res.status(500).send("Error recording your vote");
        return;
      }
      res
        .status(201)
        .send({
          message: "Vote successfully recorded",
          voteId: results.insertId,
        });
    }
  );
});

//DELETE a vote (If user undo a vote)
router.delete("/:optionId/:userId", function (req, res) {
  const optionId = req.params.optionId;
  const userId = req.params.userId;
  pool.query(
    "DELETE FROM Votes WHERE option_id = ? AND user_id = ? ",
    [optionId, userId],
    (error, results) => {
      if (error) {
        console.error(
          `Error deleting vote by user ${userId} on option ${optionId}`,
          error
        );
        res
          .status(500)
          .send(`Error deleting vote by user ${userId} on option ${optionId}`);
        return;
      }
      if (results.affectedRows === 0) {
        res.status(404).send("Option or user not found");
      } else {
        res.send(`Vote deleted successfully`);
      }
    }
  );
});
module.exports = router;
