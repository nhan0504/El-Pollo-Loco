function checkAuthenticated(req, res, next) {
  console.log(req.session);
  console.log(req.);
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).send('User is not authenticated');
}

module.exports = checkAuthenticated;