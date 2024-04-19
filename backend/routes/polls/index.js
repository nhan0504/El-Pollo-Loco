var express = require("express");
var router = express.Router();

const pool = require("../../db.js");

/* router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
}); */

const voteRouter = require('./vote');

router.get("/:pollId", function (req, res) {
  const pollId = req.params.pollId;
  pool.query(
    "SELECT * FROM Polls WHERE poll_id = ?",
    [pollId],
    (error, pollResults) => {
      if (error) {
        console.error(`Error fetching poll ${pollId} details`, error);
        res.status(500).send("Error fetching poll details");
        return;
      }
      if (pollResults.length === 0) {
        res.status(404).send('Poll not found');
        return;
      }

      pool.query(
        "SELECT * FROM Options WHERE poll_id = ?",
        [pollId],
        (error, optionsResults) => {
          if (error) {
            console.error(`Error fetching options for poll ${pollId}`, error);
            res.status(500).send("Error fetching poll options");
            return;
          }

          const pollWithStats = {
            ...pollResults[0],
            options: optionsResults
          };
          res.json(pollWithStats);
        }
      );
    }
  );
});

router.post("/", function (req, res) {
  const {user_id, title, options} = req.body;
  pool.query(
    "INSERT INTO Polls(user_id, title, created_at) VALUES (?,?,NOW())",
    [
      user_id,
      title,
    ],
    (error, results) => {
      if (error) {
        console.error(`Error creating poll`, error);
        res.status(500).send("Error creating poll");
        return;
      }
      const pollId = results.insertId;
      const optionsData = options.map(option => [pollId, option]);

      pool.query(
        "INSERT INTO Options(poll_id, option_text) VALUES ?",
        [optionsData],
        (error, results) => {
          if (error) {
            console.error(`Error adding options to poll ${pollId}`, error);
            res.status(500).send("Error adding options to the poll");
            return;
          }
          res.status(201).send(`Poll created successfully with ID ${pollId}`);
      });
    }
  );
});

router.delete("/:pollId", function (req, res) {
  const pollId = req.params.pollId;
  pool.query(
    "DELETE FROM Polls WHERE poll_id = ?",
    [pollId],
    (error, results) => {
      if (error) {
        console.error(`Error deleting poll ${pollId}`, error);
        res.status(500).send("Error deleting poll");
        return;
      }
      if (results.affectedRows === 0) {
        res.status(404).send('Poll not found'); 
      } else {
        res.send(`Poll ${pollId} deleted successfully`);
      }
    }
  );
});

router.use('/vote', voteRouter);

module.exports = router;