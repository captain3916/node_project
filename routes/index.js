var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const url = 'mongodb://127.0.0.1:27017';

/* GET home page. */


/*
router.use((req, res, next) => {
  console.log(typeof req.cookies.U_ID);
  req.ueserInfo = {
    U_ID: null,
    uName: null
  };

  if (req.cookies.U_ID) { //如果缓存里面有用户ID
    MongoClient.connect(url, (err, client) => {
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
          next();
        }
      })
    });
  } else { //未登录状态
    req.ueserInfo.U_ID = null;
    req.ueserInfo.uName = null;
    next();
  }
});
*/



router.get('/', function (req, res, next) {
  res.render('index', {
    uName: req.ueserInfo.uName
  });
});

router.get('/users', function (req, res, next) {
  res.render('users', {
    uName: req.ueserInfo.uName
  });
});

router.get('/phone', function (req, res, next) {
  res.render('phone', {
    uName: req.ueserInfo.uName
  });
});

router.get('/brand', function (req, res, next) {
  res.render('brand', {
    uName: req.ueserInfo.uName
  });

});


router.get('/login', function (req, res, next) { //登录
  res.render('login');
});

router.get('/register', function (req, res, next) {
  res.render('register');
});


router.get('/logout', function (req, res, next) { //收到退出登录的请求
  //删除cookie中的缓存
  res.cookie('U_ID', "");
  res.send('0'); //告诉前端，删除cook成功
});


module.exports = router;
