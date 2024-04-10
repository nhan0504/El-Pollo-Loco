var express = require("express");
var router = express.Router();

const connection = require("../app");
const { use } = require(".");

router.get("/users/:userId", function (req, res) {
  const userId = req.params.userId;
  connection.query(
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

router.post("/users", function (req, res) {
  const userData = req.body;
  connection.query(
    "INSERT INTO Users VALUES (?,?,?,?,?)",
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
      if (result.affectedRows === 0) {
        res.status(404).send('User not found'); 
      } else {
        res.send(`User with ID ${userId} has been deleted successfully`);
      }
    }
  );
});

router.delete("/users/:userId", function (req, res) {
  const userId = req.params.userId;
  connection.query(
    "DELETE FROM Users WHERE user_id = ?",
    [userId],
    (error, results) => {
      if (error) {
        console.error(`Error deleting user ${userId}`, error);
        res.status(500).send("Error deleting user");
        return;
      }
      res.json(results);
    }
  );
});

module.exports = router;
