module.exports={
  port: process.env.PORT || 3500,
  db: process.env.MONGOLAB_URI || "mongodb://localhost/api",
  secret:'mysecret'
 }
