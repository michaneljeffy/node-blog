var express = require('express');
var router = express.Router();
var crypto = require('crypto');

var User = require('../models/user.js');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
    title: '主页',
    user:req.session.user,
    success:flash('success').toString(),
    error:flash('error').toString()
 });
});

router.get('/reg',function(req,res,next){
  res.render('reg',{
    title:'注册',
    user:req.session.user,
    success:flash('success').toString(),
    error:flash('error').toString()
  })
});

router.post('/reg',function(req,res,next){
  var name = req.body.name,
   password= req.body.password,
   password_re= req.body['password-repeat'];

   if(password!=password_re)
    {
      req.flash('error','两次输入的密码不一致');
      res.redirect('/reg');
    }

    var md5= crypto.createHash('md5'),
    password= md5.update(req.body.password).digest('hex');

    var newUser = new User(
      {
        name:req.body.name,
        password:req.body.password,
        email:req.body.email
      }
    );

    //check user exist or not

    User.get(newUser.name,function(err,user){
      if(err)
        {
          req.flash('error',err);
          return res.redirect('/');
        }

        if (user)
          {
            req.flash('error','用户已经存在');
            return res.redirect('/reg');
          }

          //不存在保存
          newUser.save(function(err,user){
            if(err)
              {
                req.flash('error',err);
                return res.redirect('/');
              }

              req.session.user = user;
              req.flash('success','注册成功');
              res.redirect('/');//返回主页
          });
    });
});

router.get('/login',function(req,res,next){
  res.render('login',{title:'登录'})
});

router.post('/login',function(req,res,next){
  res.redirect('/');
})

router.get('/logout',function(req,res,next){
  req.next.session.user= null;
  req.next.flash('success','登出成功');
  res.next.redirect('/');
});
module.exports = router;
