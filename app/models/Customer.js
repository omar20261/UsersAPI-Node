const mongoose = require('mongoose'),types=mongoose.Schema.Types;
const Files = require('./Files');
const Bluebird = require("bluebird");
const _ = require('lodash');

/*-----  item Schema  --- */
const MySchema = mongoose.Schema({
  name:{type:String,required:true},
  jobTitle:{type:String},
  active:{type:Boolean},
  Image:{type:String},
  AddedBy:{type:types.ObjectId,ref: 'User'},
  MoreInfo:{type:types.Mixed},
},{timestamps: true});
/*-----  statics  --- */
MySchema.statics = {
  add:(item,cb)=>{
    let newItem = new ItemModule(item)
    newItem.save(cb);
  },
  bcryptPass:(item,cb)=>{
    if(!item.password){return cb('password is required');}
    bcrypt.genSalt(10,(err,salt)=>{
      bcrypt.hash(item.password,salt,(err,hash)=>{
        if(err){return cb(err)};
       item.password = hash;
       cb(null,item)
      });
    });
  },
comparePassword:(password,hash,cb) =>{
  if(!password || !hash){return cb('null_password');}
  bcrypt.compare(password,hash,(err,isMatch) => {
    if(err){return cb(err);}
    cb(null,isMatch);});
},
DocDelete:(q,cb)=>{
    ItemModule.find(q)
      .then((modules) => Bluebird.each(modules, (module) => module.remove()))
      .then((doc)=>cb(null,doc.length))
      .catch(cb)
  }
  ,list:(options,cb)=>{
    var criteria = options.criteria || {};
    ItemModule.find(criteria)
    .select(options.select)
    .sort({'createdAt': -1})
    .limit(options.perPage).skip(options.perPage * options.page)
    .exec((err,doc)=>{ if(err){cb(err);return;}
      ItemModule.count(criteria,(err,count)=>{
        cb(err,doc,count);});
      });
  }
}
/*==============( Multiple images With Names  )========================*/
let ImgNames=['Image'];
/*----------------------- (add)  ------------------------*/
MySchema.pre('save',function (next,req,cb){
  Files.Add_Multiple(this,ImgNames,[],(err,doc)=>{if(err){cb(err);};next();});
});
/*--------------------- (Update) ---------------------------*/
MySchema.pre('findOneAndUpdate',function (next,cb){
  Files.Add_Multiple(this.getUpdate().$set,ImgNames,this.getUpdate().$set.oldImg,(err,doc)=>{if(err){cb(err);};next();});
});
/*---------------------- (remove) --------------------------*/
MySchema.post('remove',(doc)=>{
  let ids = _.flatten(_.map(ImgNames,(v)=>doc[v]))
  Files.DocDelete({_id:ids},(err,doc)=>{});
});
/*======================================*/
const ItemModule = module.exports = mongoose.model("customers",MySchema);
