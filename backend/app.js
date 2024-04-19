//Packages
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var passport = require('passport');
var uuid = require('uuid');
//--------------------------------------

//Routes
var index = require('./routes/index');
var users = require('./routes/users');
var auth = require('./routes/auth');
//--------------------------------------

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
//--------------------------------------

//Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  genid: (req) => uuid.v4(),
  cookie: { maxAge: 1000 * 60 * 60 * 24 }, //One day
}));
app.use(passport.initialize());
app.use(passport.session());

//Routes
app.use('/', index);
app.use('/users', users);
app.use('/auth', auth);
//---------------------------------------

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
