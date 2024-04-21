var express = require('express');
var router = express.Router();
var crypto = require('crypto');

//Database
var pool = require('../db.js');
//--------------------------------------

//Passport
var passport = require('passport');
var LocalStrategy = require('passport-local');
const checkAuthenticated = require('../middleware.js');

passport.use(
  new LocalStrategy(function (username, pass, cb) {
    pool.query('SELECT * FROM Users WHERE username = ?', [username], function (err, row) {
      if (err) {
        return cb(err);
      }
      if (row.length === 0) {
        return cb(null, false, { message: 'Incorrect username or password.' });
      }

      crypto.pbkdf2(pass, row[0].salt, 310000, 32, 'sha256', function (err, hashedPassword) {
        if (err) {
          console.log(err);
        }
        try {
          const hashedPasswordHex = hashedPassword.toString('hex');
          if (
            crypto.timingSafeEqual(
              Buffer.from(row[0].pass, 'utf-8'),
              Buffer.from(hashedPasswordHex, 'utf-8'),
            )
          ) {
            return cb(null, row[0]);
          } else {
            return cb(null, false, { message: 'Incorrect username or password.' });
          }
        } catch (e) {
          return cb(null, false, { message: 'Incorrect username or password.' });
        }
      });
    });
  }),
);

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, {
      username: user.username,
      email: user.email,
      user_id: user.user_id
    });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});
//--------------------------------------

router.post('/login', (req, res) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      res.status(500).send('Unsuccessful login.');
    } else {
      req.logIn(user, (err) => {
        if (err) {
          res.status(500).send('Unsuccessful login.');
        } else if (!user) {
          res.status(401).send('Username or password incorrect.');
        } else {
          res.status(200).send('Logged in successfully.');
        }
      });
    }
  })(req, res);
});

router.post('/logout', (req, res) => {
  if (!req.user) {
    res.status(404).send('Not logged in; cannot logout.');
  } else {
    req.logout((err) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send('Logged out successfully.');
      }
    });
  }
});

router.post('/signup', function (req, res) {
  const userData = req.body;

  pool.query(
    'SELECT * FROM Users WHERE username = ? OR email = ?',
    [userData.username, userData.email],
    (err, results) => {
      if (err) {
        res.status(500).send(err);
      } else if (results.length != 0) {
        res.status(409).send('User with this name or email already exists.');
      } else {
        crypto.pbkdf2(
          userData.password,
          userData.salt,
          310000,
          32,
          'sha256',
          function (err, hashedPassword) {
            pool.query(
              'INSERT INTO Users(username, pass, fname, lname, email, salt) VALUES (?,?,?,?,?,?)',
              [
                userData.username,
                hashedPassword.toString('hex'),
                userData.fname,
                userData.lname,
                userData.email,
                userData.salt,
              ],
              (error, results) => {
                if (error) {
                  console.error(`Error creating new user`, error);
                  res.status(500).send('Error creating new user');
                  return;
                } else {
                  res.send(`User created successfully`);
                }
              },
            );
          },
        );
      }
    },
  );
});

router.get('/is_authenticated', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).send("You are authenticated.");
  }
  else {
    res.status(401).send("You are not authenticated.");
  }
});

router.get("/profile", checkAuthenticated, (req, res) => {
  res.status(200).send({
    username: req.user.username,
    user_id: req.user.user_id,
    email: req.user.email,
  });
});

module.exports = router;
