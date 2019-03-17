const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
const config = require('../config');
const passport = require('passport');

exports.setupStrategy = (passport) => {
  let opts = {jwtFromRequest:ExtractJwt.fromAuthHeader(),secretOrKey:config.secret};
  verifyFun = (jwt_payload,done) => {
   User.findOne({_id:jwt_payload._id},(err,user) => {
     if(err){return done(err,false);}
     if(user){return done(null,user);}
     else{return done(null,false);} }); }

  passport.use(new JwtStrategy(opts, verifyFun) );
}


exports.authenticate = (req, res, next)=>{
  passport.authenticate('jwt', { session: false}, (err, user, info) => {
    if (err) { return next(err); }
    if (!user) {
        if (info.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Your token has expired." });
        } else {
            return res.status(401).json({ message: info.message });
        }
    }
    req.user = user;
    return next();
  })(req, res, next);
};
