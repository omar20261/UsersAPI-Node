const mongoose = require('mongoose'),types=mongoose.Schema.Types;
const config = require('../config');
const bcrypt = require('bcryptjs');
const Files = require('./Files');
const Bluebird = require("bluebird");
/*-----  User Schema  --- */
const MySchema = mongoose.Schema({
  Fname:{type:String,required:true},
  Lname:{type:String},
  username:{type:String,required:true,unique:true},
  Email:{type:String},
  Image:{type:String},
  password:{type:String,required:true},
  Urole:{type:String, default: null}
},{timestamps: true});
/*--------statics----------*/
MySchema.statics = {
  add:(newItem,cb)=>{
    User.bcryptPass(newItem,(err,item)=>{
      if(err){return cb(err)};
      newItem.save(cb);
    });
  }
  ,bcryptPass:(item,cb)=>{
    if(!item.password){return cb('password is required');}
    bcrypt.genSalt(10,(err,salt)=>{
      bcrypt.hash(item.password,salt,(err,hash)=>{
        if(err){return cb(err)};
       item.password = hash;
       cb(null,item)
      });
    });
  }
  ,comparePassword:(password,hash,cb)=>{
    bcrypt.compare(password,hash,(err,isMatch) => {
      if(err){cb(true);};
      cb(null,isMatch);
    });
  },DocDelete:(q,cb)=>{
    User.find(q)
      .then((modules) => Bluebird.each(modules, (module) => module.remove()))
      .then((doc)=>cb(null,doc.length))
      .catch(cb)
  }
}
/*==============( Multiple images With Names  )========================*/
let ImgNames=['Image'];
/*----------------------- (add)  ------------------------*/
MySchema.pre('save',function (next,req,cb){
  Files.Add_Multiple(this,ImgNames,[],(err,doc)=>{if(err){cb(err);};next();});
});
/*--------------------- (Update) ---------------------------*/
MySchema.pre('findOneAndUpdate',function (next,cb){
  Files.Add_Multiple(this.getUpdate().$set,ImgNames,this.getUpdate().$set.oldImg,(err,doc)=>{if(err){cb(err);};next();});
});
/*---------------------- (remove) --------------------------*/
MySchema.post('remove',(doc)=>{
  // let ids = _.flatten(_.map(ImgNames,(v)=>doc[v]))
  // Files.DocDelete({_id:ids},(err,doc)=>{});
});
const User = module.exports = mongoose.model("User",MySchema);
