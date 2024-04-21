var express = require('express');
var router = express.Router();

const pool = require('../../db.js');

//GET all the comment for poll with poll_id
router.get('/:pollId', function (req, res) {
  const pollId = req.params.pollId;
  pool.query(
    'SELECT comment_id, user_id, parent_id, comment FROM Comments WHERE poll_id = ?',
    [pollId],
    (error, results) => {
      if (error) {
        console.error(`Error fetching comments for poll ${pollId}`, error);
        res.status(500).send('Error fetching comments');
        return;
      }
      res.json(results);
    },
  );
});

//POST a new comment
router.post('/', function (req, res) {
  const commentData = req.body;
  pool.query(
    'INSERT INTO Comments (user_id, poll_id, parent_id, comment) VALUES (?, ?, ?, ?)',
    [commentData.user_id, commentData.poll_id, commentData.parent_id, commentData.comment],
    (error, results) => {
      if (error) {
        console.error(`Error creating new comment`, error);
        res.status(500).send('Error creating new comment');
        return;
      }
      res.send('Created comment');
    },
  );
});

//DELETE the comment with comment_id
router.delete('/:commentId', function (req, res) {
  const commentId = req.params.commentId;
  pool.query('DELETE FROM Comments WHERE comment_id = ?', [commentId], (error, results) => {
    if (error) {
      console.error(`Error deleting comment`, error);
      res.status(500).send('Error deleting comment');
      return;
    }
    res.send('Delete comment successfully');
  });
});

module.exports = router;
