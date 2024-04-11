var express = require("express");
var router = express.Router();

const pool = require("../db.js");

router.get("/:pollID", function (req, res) {
  const pollID = req.params.pollID;
  pool.query(
    "SELECT * FROM Polls WHERE poll_id = ?",
    [pollID],
    (error, results) => {
      if (error) {
        console.error(`Error getting poll ${pollID} data`, error);
        res.status(500).send("Error fetching poll data");
        return;
      }
      res.json(results);
    }
  );
});

router.post("/", function (req, res) {
  const pollData = req.body;
  pool.query(
    "INSERT INTO Polls(user_id, title, created_at) VALUES (?,?,NOW())",
    [
      pollData.user_id,
      pollData.title,
    ],
    (error, results) => {
      if (error) {
        console.error(`Error creating poll`, error);
        res.status(500).send("Error creating poll");
        return;
      }
      res.send(`Poll created successfully`);
    }
  );
});

router.delete("/:pollID", function (req, res) {
  const pollID = req.params.pollID;
  pool.query(
    "DELETE FROM Polls WHERE poll_id = ?",
    [pollID],
    (error, results) => {
      if (error) {
        console.error(`Error deleting poll ${pollID}`, error);
        res.status(500).send("Error deleting poll");
        return;
      }
      if (results.affectedRows === 0) {
        res.status(404).send('Poll not found'); 
      } else {
        res.send(`Poll ${pollID} deleted successfully`);
      }
    }
  );
});

module.exports = router;