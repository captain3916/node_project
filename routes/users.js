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
  res.send('登录成功');
});

module.exports = router;
