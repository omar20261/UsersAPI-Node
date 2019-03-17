const Auth = require('../../app/controller/Auth'),
  User = require('../../app/models/user');
  chai = require('chai'),
  expect = chai.expect;

describe('Auth Test', function() {
  var token;
  var user = {
    Fname: 'fake user name',
    username: 'fakeuser',
    Email:'email@website.com',
    password:'1234567'
  };

    context('## Register', function() {
      it('should create new user', function(done) {
        User.findOne({username:user.username},(err,User)=>{
          if(!err&&User){
            expect(User).to.be.an('object');
            expect(User).to.have.property('Fname').to.equal('fake user name');
            user._id = User._id;
            return done();
          }
          Auth.registerFun({query:{},body:user},(err,Token,User)=>{
            expect(err).to.not.exist;
            expect(Token).to.be.a('string');
            expect(User).to.be.an('object');
            expect(User).to.have.property('Fname').to.equal('fake user name');
            token = Token;
            user._id = User._id;
            done();
          });
        });
      });
    });

    context('## login', function() {
      it('should login and return with token', function(done) {
        Auth.authFun({query:{},body:user},(err,Token)=>{
          expect(err).to.not.exist;
          expect(Token).to.be.a('string');
          token = Token;
          done();
        });
      });
    });

    context('## delete', function() {
      it('should delete taget user without errors', function(done) {
        Auth.delete({ params:{id:user._id} },(err,count)=>{
          expect(err).to.not.exist;
          expect(count).to.be.a('number');
          expect(count).to.be.at.least(1);
          done();
        });
      });
    });

});
