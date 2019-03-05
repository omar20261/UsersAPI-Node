const User = require('../models/user');

module.exports = ()=>{
    let newUser = new User({Fname:'Mero',username:'Admin',password:'Admin',Urole : "Admin"});
    BuiltIn(newUser);
}

function BuiltIn(newItem){
User.findOne({username:newItem.username},(err,user)=>{
  if(user){return;}
  else{ User.add(newItem,(err,user)=>{
    if(err){console.log({success:false,msg:"failed To register user"});}
    else{console.log({success:true,msg:"user registered"});} });} });
}
