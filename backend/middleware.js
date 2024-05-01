var pool = require("./db");

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).send('User is not authenticated');
}

function checkValidToken(req, res, next) {
  const token = req.params.token;

  pool.query('SELECT * FROM ForgotPassword WHERE token = ?', [ token ], (err, results) => {
    if (err) { return res.status(500).send("Internal database error. Try again"); }
    if (results.length == 0) { return res.status(401).send("Invalid token.") }
    return next();
  });
}

module.exports = { checkAuthenticated, checkValidToken };
