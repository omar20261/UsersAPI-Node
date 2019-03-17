const sharedFun = require('../services/sharedFun');
const Customers = require('../models/Customer');
/*================== (get List) ====================*/
exports.getList = (req,cb)=>{
  var page = (req.query.num > 0 ? req.query.num : 1) - 1;
  var op = {perPage: 20,page: page,criteria:{}}
  if(parseInt(req.query.perPage)>0){op.perPage=parseInt(req.query.perPage) }
  if(req.query.category){op.criteria.category=req.query.category }
  if(req.query.search){op.perPage=7;op.criteria.name={$regex: new RegExp("^" +req.query.search,"i")} }
  Customers.list(op,cb);
}
/*=================== (get One) =======================*/
exports.getOne = (req,cb)=>{ Customers.findOne({_id:req.params.id},cb); }
/*================== create ==================*/
  exports.create = (req,cb)=>{
    let b = req.body;
    var newItem = new Customers({name:b.name,jobTitle:b.jobTitle,Image:b.Image});
    if(req.user){newItem.AddedBy=req.user._id}
    newItem.save(req,cb);
}
/*============== edit by id ====================*/
exports.Update = (req,cb)=>{let b = req.body;
  let fields = {name:b.name,jobTitle:b.jobTitle,Image:b.Image,oldImg:b.oldImg}
  Customers.findOneAndUpdate({_id:req.body._id},
    {$set:sharedFun.cleanObj(fields)},{new: true}).exec(cb);
}
/*================= delete ======================*/
exports.delete = (req,cb)=>{
  if(!req&&!req.params&&!req.params.id){return cb('Invalid Id')}
  Customers.DocDelete({_id:req.params.id},cb)
}
/*=========================================================*/
