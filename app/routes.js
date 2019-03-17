const sharedFun = require('./services/sharedFun');
const Auth = require('./controller/Auth');
const Files = require('./models/Files');
const Customer = require('./controller/Customer');
const passportManager = require('./services/passportManager');

module.exports = function (app) {
let user = passportManager.authenticate,//passport.authenticate('jwt',{session:false}),
    Admin=[user,Auth.requiresAdmin];
  /*-----------Register---------------*/
  app.post('/register',Auth.register);
  /*-----------Authenticate---------------*/
  app.post('/auth',Auth.auth);
  /*-----------profile---------------*/
  app.put('/user',[user],Auth.update);
  /*-----------  ---------------*/
  app.put('/changePass',[user],Auth.changePass);
  /*=================== files =====================================*/
  /*--------------render---------------------*/
  app.get('/render/:id',Files.Render);
  /*--------------download---------------------*/
  app.get('/download/:id',Files.Download);
  /*===================== Customers API ======================*/
    app.get('/OneCustomer/:id',[user], (req,res)=>Customer.getOne(req,sharedFun.cb(req,res)) );
  /*-----------------------------------*/
    app.get('/CustomersList',[user], (req,res)=>Customer.getList(req,sharedFun.cb(req,res)) );
  /*-----------------------------------*/
    app.post('/Customer',[user], (req,res)=>Customer.create(req,sharedFun.cb(req,res)) );
  /*-------------------------------------------*/
    app.put('/Customer',[user], (req,res)=>Customer.Update(req,sharedFun.cb(req,res)) );
 /*----------------------------*/
    app.delete('/Customer/:id',[user], (req,res)=>Customer.delete(req,sharedFun.cb(req,res)) );
  /*==============================================================*/




}
