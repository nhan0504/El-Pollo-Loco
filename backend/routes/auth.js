var express = require("express");
var router = express.Router();
var crypto = require('crypto');

//Database
var pool = require("../db.js");
//--------------------------------------

//Passport
var passport = require('passport');
var LocalStrategy = require('passport-local');

passport.use(new LocalStrategy(function (username, pass, cb) {
  pool.query('SELECT * FROM Users WHERE username = ?', [ username ], function(err, row) {
    if (err) { return cb(err); }
    if (!row[0]) { return cb(null, false, { message: 'Incorrect username or password.' }); }

    try {
      if (crypto.timingSafeEqual(Buffer.from(row[0].pass, "utf-8"), Buffer.from(pass, "utf-8"))) {
        return cb(null, row[0])
      }
    }
    catch (e) {
      return cb(null, false, { message: "Incorrect username or password." })
    }    
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

router.post("/login", (req, res) => {
  passport.authenticate("local", (err, user, info) => {
    if (err || !user) {
      res.status(500).send("Unsuccessful login.");
    }
    else {
      req.logIn(user, (err) => {
        if (err) {
          res.status(500).send("Unsuccessful login.")
        }
        else {
          res.status(200).send("Logged in successfully.");
        }
      });
    }
  })(req, res);
});

router.post("/logout", (req, res) => {
  if (!req.user) { res.status(500).send("Not logged in; cannot logout.") }
  else {
    req.logout((err) => {
      if (err) {
        res.status(500).send(err);
      }
      else {
        res.status(200).send("Logged out successfully.");
      }
    });
  }
})

router.post("/signup", function (req, res) {
    const userData = req.body;
    pool.query(
        "INSERT INTO Users(username, pass, fname, lname, email, salt) VALUES (?,?,?,?,?,?)",
        [
          userData.username,
          userData.pass,
          userData.fname,
          userData.lname,
          userData.email,
          userData.salt,
        ],
        (error, results) => {
        if (error) {
            console.error(`Error creating new user`, error);
            res.status(500).send("Error creating new user");
            return;
        }
        else {
          res.send(`User created successfully`);
        }
        }
    ); 
});

module.exports = router;