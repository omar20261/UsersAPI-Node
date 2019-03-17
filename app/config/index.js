var environment_variables= {
   prod:{
     port: process.env.PORT,
     db: process.env.MONGOLAB_URI || "mongodb://localhost/api_db",
     secret: process.env.SECRET || '9raOHbNfeDu43eifySLGww'
   },
   dev:{
     port: process.env.PORT || 3500,
     db: process.env.MONGOLAB_URI || "mongodb://localhost/api_testdb",
     secret: process.env.SECRET || '9raOHbNfeDu43eifySLGww'
   },
   test:{
     port: process.env.PORT || 3500,
     db: process.env.MONGOLAB_URI || "mongodb://localhost/api_testdb",
     secret: process.env.SECRET || '9raOHbNfeDu43eifySLGww'
   }
 }

 module.exports=environment_variables[process.env.NODE_ENV||'dev']
