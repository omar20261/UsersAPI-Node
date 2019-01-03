const MsgsTranslate = require('../config/Msg_Translate');
const def_Lang='En';
const _ = require('lodash');
const sharp = require('./sharp');
/*==========================*/
exports.cb=(req,res)=>{ return (err,doc,count)=>{
  if(ErrorHandler({req,res,err})){return;}
  res.json({success:true,doc:doc,count:count?count:0});} }
  /*-----------------------------*/
  exports.cleanObj=(obj)=> JSON.parse(JSON.stringify(obj));
   // exports.cleanObj=(obj)=> _.pickBy(obj,_.identity);
/*==============================*/
exports.ErrorHandler=ErrorHandler=(op)=>{
  if(op.err){let ErrMsg;let lang =_.get(op,'req.query.lang',def_Lang);
    if(MsgsTranslate[lang]){ErrMsg = MsgsTranslate[lang][op.err];}
    if(op.err.name === 'MongoError' && op.err.code === 11000){ErrMsg=err_Translate['duplicate_value']}
    op.res.json({success:false,doc:[],msg:/*"Error : "+*/ErrMsg?ErrMsg:op.err});return true;
  }else{return false}
}
/*============ Download File ==============*/
exports.Download=(data,id,res)=>{
  if(!data){return res.end('Error : file not found');}
var type = data.split(",")[0].replace(/.*:|;.*/gi, ""),extinction=type.replace(/.*\//gi, "");
res.setHeader('Content-disposition', 'attachment; filename=' + 'File_'+id+'.'+extinction);
res.send(new Buffer(data.split(",")[1], 'base64'));
}
/*=========== Render File =============*/
exports.Render=(ctrl,data,res)=>{
  if(!data){return res.end('Error : file not found');}
  var type = data.split(",")[0].match(/:.*;/g)[0]//.replace(/.*:|;.*/mgi, "");
  res.writeHead(200, {'Content-Type': type?type.replace(/ |:|;/mgi, ""):''/*,'Content-Length': img.length*/});
  // sharp.resize(ctrl,new Buffer(data.split(",")[1], 'base64'),(err,img)=>{
  //   if(err){res.end('');}
  res.end(new Buffer(data.split(",")[1], 'base64'));
  // });
}
/*====================================*/
