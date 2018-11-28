var express = require('express');
var router = express.Router();
var async = require('async');

const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://127.0.0.1:27017';

//注册
router.post('/register', function (req, res, next) {
  var uName = req.body.uName;
  var uPwd = req.body.uPwd;
  var age = +req.body.age;
  var sex = req.body.sex || 男;
  var isAdmin = req.body.isAdmin === "是" ? true : false;
  //后台验证
  if (!uName || !uPwd || !age) {
    res.send('信息填写不完整！');
    return;
  }
  MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
    if (err) {
      res.send('数据库连接出错');
      return;
    }
    //选择数据库
    const db = client.db('text');
    async.series([
      function (cb) { //查询用户名是否重复
        db.collection('user').find({ uName: uName }).count((err, num) => {
          if (err) {
            cb('查询失败');
          } else if (num > 0) {
            cb('用户名已经注册过了!');
          } else {
            cb(null);
          }
        })
      },
      function (cb) {
        db.collection('user').insertOne({
          uName: uName,
          uPwd: uPwd,
          age: age,
          sex: sex,
          isAdmin: isAdmin
        }, err => {
          if (err) cb('存储失败!');
          else cb(null);
        })
      }
    ], (err, data) => {
      if (err) {
        res.send(err);
      } else {
        res.send('0');
      }
      client.close();
    });
  });
});

//登录
router.post('/login', function (req, res, next) {
  let loginDate = {
    message: '',
    code: 0
  }
  if (!req.body.uName) { //用户名验证
    loginDate.message = '用户名不能为空';
    loginDate.code = 1;
    res.send(JSON.stringify(loginDate));
    return;
  }
  if (!req.body.uPwd) { //密码验证
    loginDate.message = '密码不能为空';
    loginDate.code = 1;
    res.send(JSON.stringify(loginDate));
    return;
  }
  //连接数据库查询
  MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
    //选择数据库
    let db = client.db('text');
    async.series([
      function (cb) {
        db.collection('user').find({ 'uName': req.body.uName }).count((err, num) => {
          if (err) cb('连接数据库失败!');
          else if (num > 0) cb(null);
          else cb('用户名不存在!');
        });
      },
      function (cb) {
        db.collection('user').find({ 'uName': req.body.uName, 'uPwd': req.body.uPwd }).toArray((err, items) => {
          if (err) cb('查询数据库失败!');
          else if (items.length === 0) cb('密码错误!');
          else cb(null, items[0]['_id']); //调取ID
        })
      }
    ], (err, data) => {
      if (err) {
        loginDate.message = err;
        loginDate.code = 1;
      } else if (data[1]) {
        //设置cookie
        res.cookie('U_ID', data[1], {
          maxAge: 1000 * 60 * 30  //cookie有效时间30分钟
        });
        loginDate.message = '登录成功';
        loginDate.code = 0;
      }
      res.send(JSON.stringify(loginDate));
      client.close();
    })

  })
});

module.exports = router;
