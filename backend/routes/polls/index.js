var express = require('express');
var router = express.Router();

const pool = require('../../db.js');
const { checkAuthenticated } = require('../../middleware.js');

const voteRouter = require('./vote');
const commentRouter = require('./comment');

// GET
router.get('/:pollId', function (req, res) {
  const pollId = req.params.pollId;
  pool.query('SELECT * FROM Polls WHERE poll_id = ?', [pollId], (error, pollResults) => {
    if (error) {
      console.error(`Error fetching poll ${pollId} details`, error);
      res.status(500).send('Error fetching poll details');
      return;
    }
    if (pollResults.length === 0) {
      return res.status(404).send('Poll not found');
    }

    pool.query('SELECT option_id, option_text FROM Options WHERE poll_id = ?', [pollId], (error, optionsResults) => {
      if (error) {
        console.error(`Error fetching options for poll ${pollId}`, error);
        res.status(500).send('Error fetching poll options');
        return;
      }

      pool.query(
        'SELECT Tags.tag_id, tag_name FROM Tags JOIN PollsTags ON Tags.tag_id = PollsTags.tag_id WHERE PollsTags.poll_id = ?',
        [pollId],
        (error, tagsResults) => {
          if (error) {
            console.error(`Error fetching tags for poll ${pollId}`, error);
            res.status(500).send('Error fetching poll tags');
            return;
          }

          const pollWithStats = {
            ...pollResults[0],
            options: optionsResults,
            tags: tagsResults,
          };
          res.json(pollWithStats);
        }
      );
    });
  });
});

// POST
router.post('/', checkAuthenticated, async (req, res) => {
  const { title, options, tags } = req.body;
  const userId = req.user.user_id;

  pool.query(
    'INSERT INTO Polls(user_id, title, created_at) VALUES (?,?,NOW())',
    [userId, title],
    (error, results) => {
      if (error) {
        console.error(`Error creating poll`, error);
        res.status(500).send('Error creating poll');
        return;
      }

      const pollId = results.insertId;

      if (insertOption(pollId, options) != 0 || insertTag(pollId, tags) != 0) {
        res.status(500).send('Error creating poll');
        pool.query('DELETE FROM Polls WHERE poll_id = ?', [pollId], (error, results) => {
          if (error) {
            console.error(`Error deleting poll ${pollId}`, error);
            res.status(500).send('Error creating poll');
          }
        });
        return;
      }

      res.status(201).send(`Poll created successfully with ID ${pollId}`);
    }
  );
});

function insertOption(pollId, options) {
  const optionsData = options.map((option) => [pollId, option]);
  pool.query(
    'INSERT INTO Options(poll_id, option_text) VALUES (?)',
    [optionsData],
    (error, result) => {
      if (error) {
        console.log(`Error adding option`, error);
        return 1;
      }
    }
  );
  return 0;
}

function insertTag(pollId, tags) {
  for (const tagName of tags) {
    let tagId;

    pool.query('SELECT tag_id FROM Tags WHERE tag_name = ?', [tagName], (error, result) => {
      if (error) {
        console.log('Error getting existing tag', error);
        return 1;
      }
      if (result.length != 0) {
        tagId = result[0].tag_id;
      } else {
        pool.query('INSERT INTO Tags(tag_name) VALUES (?)', [tagName], (error, result) => {
          if (error) {
            console.log('Error inserting tag', error);
            return 1;
          }
          tagId = result.insertId;
        });
      }

      pool.query(
        'INSERT INTO PollsTags(tag_id, poll_id) VALUES (?, ?)',
        [tagId, pollId],
        (error, results) => {
          if (error) {
            console.log(error);
            return 1;
          }
        }
      );
    });
  }
  return 0;
}

// DELETE
router.delete('/:pollId', checkAuthenticated, function (req, res) {
  const pollId = req.params.pollId;
  pool.query('DELETE FROM Polls WHERE poll_id = ?', [pollId], (error, results) => {
    if (error) {
      console.error(`Error deleting poll ${pollId}`, error);
      res.status(500).send('Error deleting poll');
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).send('Poll not found');
    } else {
      res.send(`Poll ${pollId} deleted successfully`);
    }
  });
});

router.use('/vote', voteRouter);
router.use('/comment', commentRouter);

module.exports = router;
