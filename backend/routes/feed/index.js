var express = require("express");
var router = express.Router();

const pool = require("../../db.js");

router.get("/", function(req, res) {
  pool.query(
    "SELECT * FROM Polls ORDER BY created_at DESC LIMIT 6",
    (error, results) => {
      if (error) {
        console.error("Error fetching polls", error);
        res.status(500).send("Error fetching polls");
        return;
      }
      if (results.length === 0) {
        res.status(404).send("No polls found");
        return;
      }
      const pollsPromises = results.map(poll => 
        new Promise((resolve, reject) => {
          pool.query(
            "SELECT * FROM Options WHERE poll_id = ?",
            [poll.poll_id],
            (error, optionsResults) => {
              if (error) {
                reject(`Error fetching options for poll ${poll.poll_id}`);
              } else {
                resolve({
                  ...poll,
                  options: optionsResults
                });
              }
            }
          );
        })
      );

      Promise.all(pollsPromises)
        .then(polls => {
          res.json(polls);
        })
        .catch(pollsError => {
          console.error("Error fetching polls with options", pollsError);
          res.status(500).send("Error fetching polls with options");
        });
    }
  );
});

module.exports = router;