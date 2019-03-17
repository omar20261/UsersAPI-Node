const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('../config');
const sharedFun = require('../services/sharedFun');
const _ = require('lodash');
/*====================(register)===================*/
exports.register = (req,res)=>{
  registerFun(req,(err,token,user)=>{
    if(sharedFun.ErrorHandler({res,req,err})){return;}
    res.json({success:true,token:token,user:user});
  });
}
/* --- (register function) --- */
exports.registerFun = registerFun = (req,cb)=>{
  let b = req.body;
  let newUser = new User({Fname:b.Fname,Lname:b.Lname,Email:b.Email,username:b.username,password:b.password,Image:b.Image});
  User.add(newUser,(err,user)=>{
    if(err){return cb(err);}
    sendUserInfo(user,(token)=>{ cb(null,token,user); });
  });
}
/*====================( auth )===================*/
exports.auth = (req,res) => {
  authFun(req,(err,token)=>{
    if(sharedFun.ErrorHandler({res,req,err})){return;}
    res.json({success:true,token:token});
  });
}
/* =========== ( auth function ) =========== */
exports.authFun = authFun = (req,cb)=>{
  const username =req.body.username,password =req.body.password;
  if(!username || !password){return cb('Invalid Username or Password');}
  User.findOne({$and:[ {username:username} , {username:{$exists:true}} ]},(err,user)=>{
    if(err){return cb(err);}
    if(!user){return cb('Invalid Username or Password');}
    User.comparePassword(password,user.password,(err,isMatch) =>{
      if(err){return cb(err);}
      if(isMatch){ sendUserInfo(user,(token)=>{ cb(null,token);}); }
      else{ cb('Invalid Username or Password');}
    });
  });
}
// User.bcryptPass({password:'Trond123456!!!'},(err,item)=>{console.log(item)})
/*====================(authSocial)===================*/
  exports.authSocial = (req,res) => {
    const token =req.body.token,
          uid =req.body.uid,
          provider =req.body.provider;
    SocialLogin(provider,uid,token,(err,data)=>{
      if(sharedFun.ErrorHandler({res,req,err})){return;}
      const doc = JSON.parse(data);
      User.GetOne({Email:doc.email},(err,user)=>{
        if(sharedFun.ErrorHandler({res,req,err})){return;}
        if(user){return sendUserInfo(user,(token)=>{ res.json({success:true,token:token}); }); }
        else{createSocialUser(req,res,doc);}
      });
    });
  }
/*===============================================*/
  function createSocialUser(req,res,data){
    let newUser = new User({name:data.name,Email:data.email});
    if(data.id){newUser.SocialImg='https://graph.facebook.com/'+data.id+'/picture?type=large'; }
    if(data.picture){newUser.SocialImg=data.picture; }
    newUser.save((err,user)=>{
      if(sharedFun.ErrorHandler({res,req,err})){return;}
      sendUserInfo(user,(token)=>{ res.json({success:true,token:token}); });
    });
  }
  /*===============================================*/
  exports.update = (req,res) => {let i=req.body;
    let fields = {Fname:i.Fname,Lname:i.Lname,Email:i.Email,Image:i.Image,oldImg:i.oldImg}
    User.findOneAndUpdate({_id:req.user._id},
      {$set:sharedFun.cleanObj(fields)},{new: true}).exec((err,user)=>{
      if(sharedFun.ErrorHandler({res,req,err})){return;}
      sendUserInfo(user,(token)=>{ res.json({success:true,token:token}); });
    });
  }
  /*===============================================*/
  exports.changePass = (req,res) => {
    const NewPass=req.body.NewPassword,OldPass=req.body.CurrentPassword;
    User.comparePassword(OldPass,req.user.password,(err,isMatch) =>{
        if(sharedFun.ErrorHandler({res,req,err})){return;}
        if(isMatch){
          User.bcryptPass({password:NewPass},(err,item)=>{
            if(sharedFun.ErrorHandler({res,req,err})){return;}
            User.findOneAndUpdate({_id:req.user._id},
              {$set:{password:item.password}},{new: true}).exec((err,user)=>{
              if(sharedFun.ErrorHandler({res,req,err})){return;}
              sendUserInfo(user,(token)=>{ res.json({success:true,token:token}); });
            });
          });
        }else{sharedFun.ErrorHandler({res,req,err:'Incorrect Password'});return;}
      });
  }
/*===============sendUserInfo===================*/
function sendUserInfo(user,cb){
  let arr=['password', 'Urole'];
  const token = jwt.sign(_.omit(user.toJSON(),arr),config.secret,{  expiresIn:604800 /* 1 week */  });
  if(cb){cb('JWT '+token);}
}
/*====================( delete )===================*/
exports.delete = deleteFun = (req,cb)=>{
  if(!req&&!req.params&&!req.params.id){return cb('Invalid Id')}
  User.DocDelete({_id:req.params.id},cb)
}
/*=================================================*/
exports.requiresAdmin = function(req,res,next) {
    if(req.user.Urole === "Admin"){next();}
    else{res.status(401).send('Unauthorized');}
}
