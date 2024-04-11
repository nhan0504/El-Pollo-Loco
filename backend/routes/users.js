var express = require("express");
var router = express.Router();

const pool = require("../db.js");

router.get("/:userId", function (req, res) {
  const userId = req.params.userId;
  pool.query(
    "SELECT * FROM Users WHERE user_id = ?",
    [userId],
    (error, results) => {
      if (error) {
        console.error(`Error getting user ${userId} data`, error);
        res.status(500).send("Error fetching user data");
        return;
      }
      res.json(results);
    }
  );
});

router.post("/", function (req, res) {
  const userData = req.body;
  pool.query(
    "INSERT INTO Users(username, pass, fname, lname, email) VALUES (?,?,?,?,?)",
    [
      userData.username,
      userData.pass,
      userData.fname,
      userData.lname,
      userData.email,
    ],
    (error, results) => {
      if (error) {
        console.error(`Error creating new user`, error);
        res.status(500).send("Error creating new user");
        return;
      }
      res.send(`User created successfully`);
    }
  );
});

router.delete("/:userId", function (req, res) {
  const userId = req.params.userId;
  pool.query(
    "DELETE FROM Users WHERE user_id = ?",
    [userId],
    (error, results) => {
      if (error) {
        console.error(`Error deleting user ${userId}`, error);
        res.status(500).send("Error deleting user");
        return;
      }
      if (results.affectedRows === 0) {
        res.status(404).send('User not found'); 
      } else {
        res.send(`User ${userId} deleted successfully`);
      }
    }
  );
});

module.exports = router;
