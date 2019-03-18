const config = require('../app/config');
const mongoose = require('mongoose');

describe('Database Connection ', function(done) {

  it('should check the database connection',(done)=>{
    mongoose.connect(config.db,(err)=>{
      if(err){
        console.log(new Error(err));
        return process.exit(1);
      }
       done();
      // console.log(err)
    });
  });

});
