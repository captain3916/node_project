var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const url = 'mongodb://127.0.0.1:27017';

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/favicon.ico', function (req, res, next) { //过滤默认请求
  res.end();
})


//自制中间件,校验登录状态
app.use((req, res, next) => {

  //排除一些不用校验cookie的
  let arr = ['/login', '/register', '/api/login', '/api/register'];
  if (arr.indexOf(req.url) != -1) {
    next();
    return;
  }

  req.ueserInfo = {
    U_ID: null,
    uName: null
  };

  if (req.cookies.U_ID) { //如果缓存里面有用户ID
    MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
      //选择数据库
      const db = client.db('text');
      db.collection('user').find({ _id: ObjectId(req.cookies.U_ID) }).toArray((err, items) => {
        if (items.length) { //找到数据
          req.ueserInfo.U_ID = items[0]['_id'];
          req.ueserInfo.uName = items[0]['uName'];
          next();
        } else { //没找到数据（也可认为是未登录状态）
          req.ueserInfo.U_ID = null;
          req.ueserInfo.uName = null;
          res.redirect('/login');
        }
        client.close();
      })
    });
  } else { //未登录状态
    req.ueserInfo.U_ID = null;
    req.ueserInfo.uName = null;
    res.redirect('/login');
  }
});

app.use('/', indexRouter);
app.use('/api', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
