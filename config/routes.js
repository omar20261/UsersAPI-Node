const Auth = require('../controller/Auth');
const Files = require('../models/Files');
const API = require('../controller/API');

module.exports = function (app, passport) {
let   user = passport.authenticate('jwt',{session:false}),
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
  /*=====================Test API (ignore it)======================*/
  app.get('/apiOne/:id',Admin,API.get);
  /*-----------------------------------*/
  app.get('/api',Admin,API.getList);
  /*-----------------------------------*/
  app.post('/api',Admin,API.add);
  /*-------------------------------------------*/
  app.put('/api',Admin,API.Update);
 /*----------------------------*/
  app.delete('/api/:id',Admin,API.delete);
  /*==============================================================*/



}
