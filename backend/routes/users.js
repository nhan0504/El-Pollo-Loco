var express = require('express');
var router = express.Router();

const pool = require('../db.js');
const { checkAuthenticated } = require('../middleware.js');

// const checkAuthenticated = require('../middleware.js');

router.get('/:userId', function (req, res) {
  const userId = req.params.userId;
  pool.query('SELECT * FROM Users WHERE user_id = ?', [userId], (error, results) => {
    if (error) {
      console.error(`Error getting user ${userId} data`, error);
      res.status(500).send('Error fetching user data');
      return;
    }
    if (results.length === 0) {
      res.status(404).send('User not found');
    } else {
      res.json(results);
    }
  });
});

router.post('/', function (req, res) {
  const userData = req.body;
  pool.query(
    'INSERT INTO Users(username, pass, fname, lname, email) VALUES (?,?,?,?,?)',
    [userData.username, userData.pass, userData.fname, userData.lname, userData.email],
    (error, results) => {
      if (error) {
        console.error(`Error creating new user`, error);
        res.status(500).send('Error creating new user');
        return;
      }

      const newUser = {
        user_id: results.insertId,
        username: userData.username,
        fname: userData.fname,
        lname: userData.lname,
        email: userData.email,
      };

      res.status(201).json(newUser);
    },
  );
});

router.delete('/:userId', function (req, res) {
  const userId = req.params.userId;
  pool.query('DELETE FROM Users WHERE user_id = ?', [userId], (error, results) => {
    if (error) {
      console.error(`Error deleting user ${userId}`, error);
      res.status(500).send('Error deleting user');
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).send('User not found');
    } else {
      res.send(`User ${userId} deleted successfully`);
    }
  });
});
/////////////////////////////////////////////

// FOLLOW/UNFOLLOW ENDPOINTS

/////////////////////////////////////////////
router.get('/:userId/followers', function (req, res) {
  const userId = req.params.userId;
  pool.query(
    `SELECT 
      u.username,
      COUNT(uf.follower_id) OVER() AS total_followers
    FROM 
      Users u
    JOIN 
      UserFollows uf ON u.user_id = uf.follower_id
    WHERE 
      uf.followed_id = ?
    GROUP BY
      u.username;`,
    [userId],
    (error, results) => {
      if (error) {
        console.error(`Error getting user ${userId} followers list`, error);
        res.status(500).send('Error fetching user followers data');
        return;
      }

      const followers = results.map((item) => item.username);
      const totalFollowers = results.length > 0 ? results[0].total_followers : 0;

      const returnData = {
        followers: followers,
        total_followers: totalFollowers,
      };
      res.json(returnData);
    },
  );
});

router.get('/:userId/following', function (req, res) {
  const userId = req.params.userId;
  pool.query(
    `SELECT 
      u.username,
      COUNT(uf.followed_id) OVER() AS total_following
    FROM 
      Users u
    JOIN 
      UserFollows uf ON u.user_id = uf.followed_id
    WHERE 
      uf.follower_id = ?
    GROUP BY
      u.user_id, u.username;`,
    [userId],
    (error, results) => {
      if (error) {
        console.error(`Error getting user ${userId} following list`, error);
        res.status(500).send('Error fetching user following data');
        return;
      }

      const usernames = results.map((item) => item.username);
      const totalFollowing = results.length > 0 ? results[0].total_following : 0;

      const returnData = {
        following: usernames,
        total_following: totalFollowing,
      };
      res.json(returnData);
    },
  );
});

router.post('/:userId/follow/', checkAuthenticated, function (req, res) {
  const followedId = req.params.userId;
  const userId = req.user.user_id;

  pool.query(
    `INSERT INTO UserFollows (follower_id, followed_id) VALUES (?, ?) 
    ON DUPLICATE KEY UPDATE follower_id = follower_id;`,
    [userId, followedId],
    (error, results) => {
      if (error) {
        console.error(`Error when ${userId} is trying to follow ${followedId}`, error);
        res.status(500).send('Error when trying to follow');
        return;
      }
      if (results.affectedRows === 0) {
        res.status(404).send('User is already following specified user');
      } else {
        res.send(`User followed sucessfully`);
      }
    },
  );
});

router.delete('/:userId/unfollow/', checkAuthenticated, function (req, res) {
  const followedId = req.params.userId;
  const userId = req.user.user_id;

  pool.query(
    `DELETE FROM UserFollows WHERE follower_id = ? AND followed_id = ?;`,
    [userId, followedId],
    (error, results) => {
      if (error) {
        console.error(`Error when ${userId} is trying to unfollow ${followedId}`, error);
        res.status(500).send('Error when trying to unfollow');
        return;
      }
      if (results.affectedRows === 0) {
        res.status(404).send('User is not following specified user');
      } else {
        res.send(`User unfollowed sucessfully`);
      }
    },
  );
});

module.exports = router;
