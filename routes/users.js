var express = require('express');
var router = express.Router();

const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://127.0.0.1:27017';

/* GET users listing. */
router.post('/register', function (req, res, next) {
  MongoClient.connect(url, (err, client) => {
    //选择数据库
    const db = client.db('text');

    //查询是否找到同名数据
    let pro = db.collection('user').find({ 'uName': req.body.uName }).count();

    //返回的是一个Promise对象
    pro.then((data) => {
      console.log('正确');
      if (!data) { //用户名没有重复
        //保存用户信息
        console.log(typeof req.body);
        db.collection('user').insertOne(req.body);
        res.send('' + data);
        client.close();//关闭连接
      } else {
        //用户名已经注册了
        res.send("" + data);
        client.close();//关闭连接
      }
    }, (err) => {
      res.send(err);
      client.close();//关闭连接
    });
  });
});

router.post('/login', function (req, res, next) {
  MongoClient.connect(url, (err, client) => {

    let loginDate = {
      message: '',
      code: 0
    }

    //选择数据库
    let db = client.db('text');

    let pro = db.collection('user').find({ 'uName': req.body.uName }).count();

    pro.then((data) => {
      if (data) { //能找到用户

        //验证密码
        db.collection('user').find(req.body).toArray((err, items) => {
          if (items.length) {
            //console.log(items); //[ { _id: 5bf91b03af10ca2d60c3f11d, uName: 'hello', uPwd: '123456' } ]
            loginDate.message = '登录成功';
            loginDate.code = 0;

            //设置cookie
            // console.log(typeof items[0]._id); //object
            // console.log(items[0]['_id']);
            res.cookie('U_ID', items[0]['_id']);
            res.send(JSON.stringify(loginDate));
          } else {
            loginDate.message = '密码错误';
            loginDate.code = 1;
            res.send(JSON.stringify(loginDate));
          }
        });
        client.close();//关闭连接

      } else {
        //没找到用户
        loginDate.message = '用户名不存在';
        loginDate.code = 2;
        res.send(JSON.stringify(loginDate));
        client.close();//关闭连接
      }
    }, (err) => {
      loginDate.message = '数据库连接错误';
      loginDate.code = 3;
      res.send(JSON.stringify(loginDate));
      client.close();//关闭连接
    });

  })
});

module.exports = router;
