const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('../config/config');
const sharedFun = require('./sharedFun');
const _ = require('lodash');
/*====================(register)===================*/
exports.register = (req,res)=>{let i = req.body;
  let newUser = new User({Fname:i.Fname,Lname:i.Lname
    ,Email:i.Email,password:i.password,Image:i.Image});
      User.add(newUser,(err,user)=>{
    if(sharedFun.ErrorHandler({res,req,err})){return;}
    sendUserInfo(req,res,user,true);
 });
}
/*====================(auth)===================*/
exports.auth = (req,res) => {
  const username =req.body.username,password =req.body.password;
  User.findOne({username:username},(err,user)=>{
    if(sharedFun.ErrorHandler({res,req,err})){return;}
    if(!user){sharedFun.ErrorHandler({res,req,err:'Invalid Username or Password'});return;}
    User.comparePassword(password,user.password,(err,isMatch) =>{
      if(sharedFun.ErrorHandler({res,req,err})){return;}
      if(isMatch){sendUserInfo(req,res,user,true);}
      else{sharedFun.ErrorHandler({res,req,err:'Invalid Username or Password'});return;}
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
        if(user){sendUserInfo(req,res,user,true);return;}
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
      sendUserInfo(req,res,user,true);
    });
  }
  /*===============================================*/
  exports.update = (req,res) => {let i=req.body;
    let fields = {Fname:i.Fname,Lname:i.Lname,Email:i.Email,Image:i.Image,oldImg:i.oldImg}
    User.findOneAndUpdate({_id:req.user._id},
      {$set:sharedFun.cleanObj(fields)},{new: true}).exec((err,user)=>{
      if(sharedFun.ErrorHandler({res,req,err})){return;}
      sendUserInfo(req,res,user,true);});
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
              sendUserInfo(req,res,user,true);});
          });
        }else{sharedFun.ErrorHandler({res,req,err:'Incorrect Password'});return;}
      });
  }
/*===============sendUserInfo===================*/
function sendUserInfo(req,res,user,signRes){let arr=['password', 'Urole'];
  const token = jwt.sign(_.omit(user.toJSON(),arr),config.secret,{  expiresIn:604800 /* 1 week */  });
    res.json({success:true,token:'JWT '+token});
}
/*=================================================*/
exports.requiresAdmin = function(req,res,next) {
    if(req.user.Urole === "Admin"){next();}
    else{res.status(401).send('Unauthorized');}
}
