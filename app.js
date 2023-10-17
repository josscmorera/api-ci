const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config(); 
const {moongoseConect} = require('./db');
moongoseConect();
const cors = require('cors');


const tagsRouter = require('./routes/tag');
const usersRouter = require('./routes/user');
const postsRouter = require('./routes/post');
const indexRouter = require('./routes/index');
const reportsRouter = require('./routes/report');
const commentsRouter = require('./routes/comment');
const communityRouter = require('./routes/community');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors()); // enable CORS
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/tags', tagsRouter);
app.use('/reports', reportsRouter);
app.use('/posts', postsRouter);
app.use('/comments', commentsRouter);
app.use('/communities', communityRouter);

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