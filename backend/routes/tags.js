var express = require('express');
var router = express.Router();

//Database
var pool = require('../db.js');
//--------------------------------------

//Passport
var passport = require('passport');
var LocalStrategy = require('passport-local');
const {checkAuthenticated} = require('../middleware.js');


// Follow a tag from the name
router.post('/follow/:tagName', checkAuthenticated, function (req, res) {
  const userId = req.user.user_id;
  const tagName = req.params.tagName;

  pool.query(
    `SELECT tag_id FROM Tags WHERE tag_name = ?`,
    [tagName],
    (error, results) => {
      if (error) {
        console.error(`Error finding tag_id for tagName ${tagName}`, error);
        res.status(500).send('Error finding tag');
        return;
      }

      if (results.length === 0) {
        console.error(`Tag ${tagName} not found`);
        res.status(404).send('Tag not found');
        return;
      }

      const tagId = results[0].tag_id;

      pool.query(
        `INSERT INTO UserTag (user_id, tag_id)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE tag_id = VALUES(tag_id);`,
        [userId, tagId],
        (error, results) => {
          if (error) {
            console.error(`Error when user ${userId} is trying to follow tag ${tagName}`, error);
            res.status(500).send('Error when trying to follow tag');
            return;
          }
          res.status(201).send({
            message: 'User is now following the tag',
          });
        },
      );
    }
  );
});



// GET all tags a user is following
router.get('/', checkAuthenticated, function (req, res) {
  const userId = req.user.user_id;
  const tagId = req.params.tagId;

  pool.query(
    `SELECT Tags.tag_name
    FROM Tags
    JOIN UserTag ON Tags.tag_id = UserTag.tag_id
    WHERE UserTag.user_id = ?;`,
    [userId, tagId],
    (error, results) => {
      if (error) {
        console.error(`Error when getting user ${userId}'s tags`, error);
        res.status(500).send('Error when trying to get tags');
        return;
      }
      if (results.length === 0) {
        res.status(404).send('User is not following any tags');
        return;   
      }
      const tagNames = results.map(result => result.tag_name);
      res.json(tagNames);
    },
  );
});

// Unfollow tagId
router.delete('/unfollow/:tagName', checkAuthenticated, function (req, res) {
  const userId = req.user.user_id;
  const tagName = req.params.tagName;

  pool.query(
    `SELECT tag_id FROM Tags WHERE tag_name = ?`,
    [tagName],
    (error, results) => {
      if (error) {
        console.error(`Error finding tag_id for tagName ${tagName}`, error);
        res.status(500).send('Error finding tag');
        return;
      }

      if (results.length === 0) {
        console.error(`Tag ${tagName} not found`);
        res.status(404).send('Tag not found');
        return;
      }

      const tagId = results[0].tag_id;

      pool.query(
        `DELETE FROM UserTag
        WHERE user_id = ? AND tag_id = ?;`,
        [userId, tagId],
        (error, results) => {
          if (error) {
            console.error(`Error when user ${userId} is trying to unfollow tag ${tagName}`, error);
            res.status(500).send('Error when trying to unfollow tag');
            return;
          }
          if (results.affectedRows === 0) {
            res.status(404).send('User is not following tag');
            return;
          }
          res.status(200).send({
            message: 'User is now unfollowing the tag',
          });
        },
      );
    }
  );
});

module.exports = router;