var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const url = 'mongodb://127.0.0.1:27017';

/* GET home page. */


router.get('/', function (req, res, next) {
  res.render('index', {
    uName: req.ueserInfo.uName
  });
});


//将用户数据渲染到页面
router.get('/users', function (req, res, next) {

  let pageSize = +req.query.pageSize || 5; //每页信息有几条？
  let currentPage = +req.query.currentPage || 1; //当前访问的是第几页？
  let totalUsersNum = 0; //总用户数量
  let page = 0; // 总共几页

  MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
    if (err) {
      res.render('error', {
        message: '数据库连接失败！',
        error: err
      })
      return;
    }
    let db = client.db('text');
    db.collection('user').find().count().then(num => {
      totalUsersNum = num;
      page = Math.ceil(num / pageSize);
      db.collection('user').find().limit(pageSize).skip(currentPage * pageSize - pageSize).toArray((err, items) => {
        if (err) {
          res.render('error', {
            message: '数据库连接失败！',
            error: err
          })
          return;
        }
        res.render('users', {
          uName: req.ueserInfo.uName,
          users: items,
          page: page,
          pageSize: pageSize,
          currentPage: currentPage
        });
      });
    }, err => {
      res.render('error', {
        message: '数据库连接失败！',
        error: err
      })
    })

  })
});

//删除某个用户
router.get('/deleteUser', (req, res, next) => {
  let id = req.query._id;
  MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
    if (err) {
      res.render('error', {
        message: '连接数据库失败',
        error: err
      })
      return;
    }
    var db = client.db('text');
    db.collection('user').deleteOne({ _id: ObjectId(id) }, (err, data) => {
      if (err) {
        res.render('error', {
          message: '删除失败',
          error: err
        })
        client.close();
        return;
      }
      if (data.deletedCount == 1) { //删除成功
        res.redirect('/users');
      } else {
        res.render('error', {
          message: '删除失败,未找到数据！',
          error: err
        })
      }
      client.close();
    });
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
