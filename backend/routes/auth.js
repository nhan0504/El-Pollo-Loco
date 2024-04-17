var express = require("express");
var router = express.Router();
var crypto = require('crypto');

//Database
var pool = require("../db.js");
//--------------------------------------

//Passport
var passport = require('passport');
var LocalStrategy = require('passport-local');

passport.use(new LocalStrategy(function verify(username, password, cb) {
  pool.query('SELECT * FROM Users WHERE username = ?', [ username ], function(err, row) {
    if (err) { return cb(err); }
    if (!row) { return cb(null, false, { message: 'Incorrect username or password.' }); }

    crypto.pbkdf2(password, row.salt, 310000, 32, 'sha256', function(err, hashedPassword) {
      if (err) { return cb(err); }
      if (!crypto.timingSafeEqual(row.hashed_password, hashedPassword)) {
        return cb(null, false, { message: 'Incorrect username or password.' });
      }
      return cb(null, row);
    });
  });
}));

passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, {
        username: user.username,
        email: user.email
      });
    });
  });
  
passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, user);
    });
  });  
//--------------------------------------

router.post("/login", passport.authenticate('local'));

router.post("/signup", function (req, res) {
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