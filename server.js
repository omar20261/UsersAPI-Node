const express = require('express');
const path = require('path');
const bodyParser=require('body-parser');
const cors = require('cors');
const passport = require('passport');
const config = require('./config/config');

const app = express();
/*---------------mongoose-----------------*/
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(config.db,{ }).connection;
/*------ mongoose OnConection  or OnError ------*/
mongoose.connection.on('connected',()=>{ console.log('Connected to the Database '+config.db); });
mongoose.connection.on('error',(err)=>{  console.log('Database Error : '+err);});
/* ---------------- cors MW ----------------*/
   app.use(cors());
/* ----------- Set Static Folder ------------- */
app.use(express.static(path.join(__dirname,'public')));
/* --- body Parser MW -----*/
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({extended:false}));
/*------------passport-------------*/
app.use(passport.initialize());
app.use(passport.session());
/*-----------------init DB data ----------------------*/
require('./config/init')();
/*----------------passport--------------------------*/
require('./config/passport')(passport);
/*----------routes---------*/
require('./config/routes')(app,passport);
/*------ -------*/
app.get('*',(req,res) => { res.sendFile(path.join(__dirname,'public/index.html')) });
/*-----------------------------*/
process.on('uncaughtException',(e)=>{console.log('---uncaughtException----',e); });
/*---------- app listening  ---------*/
app.listen(config.port,() => {  console.log('server started on port '+config.port); });
/*-----------------------------------------------------------------------*/
