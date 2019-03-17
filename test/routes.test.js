var app = require('../server'),
  chai = require('chai'),
  passport = require('passport'),
  sinon = require('sinon'),
  request = require('supertest'),
  expect = chai.expect;
describe('Routes', function(done) {

  var passportStub;

  var Customer = {
    name: 'Customer 1',
    jobTitle:'Customer job Title'
  };

  before(async ()=> {

      passportStub =  sinon.stub(passport,"authenticate").callsFake((strategy, options, callback) => {
        return (req,res,next)=>{
          if(req.headers&&req.headers.authorization=='my-fake-token'){
            callback(null, { "username": "test@techbrij.com"}, null);
          }else{
            callback(null,null,{"name":"JsonWebTokenError","message":"invalid signature"});
          }
        };
      });

  });

  after(() => {
    passportStub.restore();
  });

  context('## Check Authentication middleware', function() {

    it('should return with invalid token message', function(done) {
      request(app).get('/CustomersList')
        .set('Authorization','my-invalid-fake-token').expect(401)
        .end(function(err, res) {
          expect(err).to.not.exist;
          expect(res.body.message).to.equal('invalid signature');
          done();
       });
     });

   });

  context('## GET /CustomersList', function() {
    it('should get all Customers', function(done) {
      request(app).get('/CustomersList')
        .set('Authorization','my-fake-token').expect(200)
        .end(function(err, res) {
          expect(err).to.not.exist;
          expect(res.body.doc).to.be.an('array');
          // expect(res.statusCode).to.equal(200);
          // expect(res.body.doc).to.be.empty;
          done();
       });
     });
  });

  context('## POST /Customer ', function() {
    it('should create a Customer', function(done) {
      request(app)
        .post('/Customer')
        .set('Authorization','my-fake-token').expect(200)
        .send(Customer)
        .end(function(err, res) {
          expect(err).to.not.exist;
          expect(res.body.success).to.equal(true);
          expect(res.body.doc).to.have.property('name').to.equal('Customer 1');
          Customer = res.body.doc;
          done();
        });
    });
  });

  context('## GET /OneCustomer/:ID', function() {
    it('should get the taget Customer', function(done) {
       request(app)
         .get('/OneCustomer/' + Customer._id)
         .set('Authorization','my-fake-token').expect(200)
         .end(function(err, res) {
           expect(err).to.not.exist;
           expect(res.body.success).to.equal(true);
           expect(res.body.doc).to.have.property('name').to.equal('Customer 1');
           done();
        });
    });
  });

  context('## PUT /Customer ', function() {
      it('should modify the taget Customer', function(done) {
        Customer.name = 'updated Customer name'
        request(app)
          .put('/Customer')
          .set('Authorization','my-fake-token').expect(200)
          .send(Customer)
          .end(function(err, res) {
            expect(err).to.not.exist;
            expect(res.body.success).to.equal(true);
            expect(res.body.doc).to.have.property('name').to.equal('updated Customer name');
            done();
          });
      });
    });

    context('## DELETE /Customer/:ID', function() {
      it('should delete the taget Customer', function(done) {
        request(app)
          .delete('/Customer/' + Customer._id)
          .set('Authorization','my-fake-token').expect(200)
          .end(function(err, res) {
            expect(err).to.not.exist;
            expect(res.body.success).to.equal(true);
            done();
        });
      });
    });

  });
