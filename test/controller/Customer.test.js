const Customers = require('../../app/controller/Customer'),
 chai = require('chai'),
 expect = chai.expect;

describe('Customers CRUD', function() {

  var Customer = {
    name: 'Customer 1',
    jobTitle:'Customer job Title'
  };

  context('## Customers List', function() {
    it('should get all Customers', function(done) {
      Customers.getList({query:{}},(err,doc)=>{
        expect(err).to.not.exist;
        expect(doc).to.be.an('array');
        done();
      });
    });
  });

  context('## Create Customer ', function() {
    it('should create a Customer', function(done) {
      Customers.create({query:{},body:Customer},(err,doc)=>{
          expect(err).to.not.exist;
          expect(doc).to.be.an('object');
          expect(doc).to.have.property('name').to.equal('Customer 1');
          Customer = doc;
          done();
        });
    });
  });

  context('## Get a Customer by id', function() {
    it('should get the taget Customer', function(done) {
      Customers.getOne({query:{},params:{id:Customer._id}},(err,doc)=>{
        expect(err).to.not.exist;
        expect(doc).to.be.an('object');
        expect(doc).to.have.property('name').to.equal('Customer 1');
        done();
      });
    });
  });

  context('## Update a Customer by id', function() {
    it('should modify the taget Customer', function(done) {
      Customer.name = 'updated Customer name'
      Customers.Update({query:{},params:{},body:Customer},(err,doc)=>{
        expect(err).to.not.exist;
        expect(doc).to.be.an('object');
        expect(doc).to.have.property('name').to.equal('updated Customer name');
        done();
      });
    });
  });

  context('## Delete a Customer by id', function() {
    it('should delete the taget Customer', function(done) {
      Customers.delete({query:{},params:{id:Customer._id}},(err,count)=>{
        expect(err).to.not.exist;
        expect(count).to.be.a('number');
        expect(count).to.be.at.least(1);
        done();
      });
    });
  });

});
