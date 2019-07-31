const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);


//const indexRouter = require('./routes/index');
//const usersRouter = require('./routes/users');
const loginRouter = require('./routes/login');
const registerRouter = require('./routes/register');
const dashboardRouter = require('./routes/dashboard');
const sessionRouter = require('./routes/session');


const app = express();

//mongodb connection
//mongo creates database if it doesn't exist on start.
mongoose.connect("mongodb://localhost:27017/sonwest", { useNewUrlParser: true });
var db = mongoose.connection;
//mongo error
db.on('error', console.error.bind(console, 'connection error:'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// use sessions for tracking logins
app.use(session({
  secret: 'sonwest is the illest',
  resave: true,
  saveUninitialized: false,
  cookie: { maxAge: 86400000 },
  store: new MongoStore({
    mongooseConnection: db
  })
}));

//app.use('/', indexRouter);
//app.use('/users', usersRouter);
app.use('/api/login', loginRouter);
app.use('/api/register', registerRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/session', sessionRouter);

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
