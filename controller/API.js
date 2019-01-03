const sharedFun = require('./sharedFun');
const items = require('../models/items');
/*================== (get List) ====================*/
exports.getList = (req,res)=>{
  var page = (req.query.Page > 0 ? req.query.Page : 1) - 1;
  var op = {perPage: 7,page: page,criteria:{}}
  if(req.query.PerPage){op.perPage=parseInt(req.query.PerPage);}
  if(req.query.search){op.perPage=7;op.criteria.name={$regex: new RegExp("^" +req.query.search,"i")} }
  items.list(op,sharedFun.cb(req,res));
}
/*=================== (get One) =======================*/
exports.get = (req,res)=>{ items.findOne({_id:req.params.id},sharedFun.cb(req,res)); }
/*================== add ==================*/
exports.add = (req,res)=>{let i = req.body;
    var newItem = new items({name:i.name,jobTitle:i.jobTitle,Image:i.Image});
    if(req.user){newItem.AddedBy=req.user._id}
    newItem.save(req,sharedFun.cb(req,res));
}
/*============== edit by id ====================*/
exports.Update = (req,res)=>{let i = req.body;
  let fields = {name:i.name,jobTitle:i.jobTitle,Image:i.Image,oldImg:i.oldImg}
  items.findOneAndUpdate({_id:req.body._id},
    {$set:sharedFun.cleanObj(fields)},{new: true}).exec(sharedFun.cb(req,res));
}
/*================= delete ======================*/
exports.delete = (req,res)=>{
  items.DocDelete({_id:req.params.id},sharedFun.cb(req,res))
}
/*=========================================================*/
