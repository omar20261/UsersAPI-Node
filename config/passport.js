const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
const config = require('./config');

module.exports= (passport) => {
  let opts = {jwtFromRequest:ExtractJwt.fromAuthHeader(),secretOrKey:config.secret};
  verifyFun = (jwt_payload,done) => {
   User.findOne({_id:jwt_payload._id},(err,user) => {
     if(err){return done(err,false);}
     if(user){return done(null,user);}
     else{return done(null,false);} }); }

  passport.use(new JwtStrategy(opts, verifyFun) );
}
