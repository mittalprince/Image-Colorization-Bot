var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var getupdateRouter = require('./routes/getUpdate');
require('dotenv').config()



var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/getUpdate',getupdateRouter)

app.use(function(req, res, next) {
  res.sendStatus(404);
});

module.exports = app;
