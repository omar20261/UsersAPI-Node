const mongoose = require('mongoose');
const sharedFun = require('../services/sharedFun');
const Bluebird = require("bluebird");
const _ = require('lodash');
const async = require('async');
// const sharp = require('../controller/sharp');

/*---------- Imgs Schema------------*/
const MySchema = mongoose.Schema({
  fileData:{type:String},
},{timestamps: true});
/*-----  statics  --- */
MySchema.statics = {
  add:(Data,cb)=>{
    if(Data){
      // sharp.resize({width:200},new Buffer(Data.split(",")[1], 'base64'),(err,img)=>{
      //   let d=Data.split(",")[0]+','+Buffer.from(img).toString('base64');
      let newItem = new Files({fileData:Data});newItem.save(cb);
      // });
    }
    else{cb(null,false);}
  },
  Add_Multiple:(item,names,oldImg,cb)=>{
    Files.DocDelete({_id:oldImg},(err,doc)=>{
      if(err){return cb(err)}
      if(_.isEmpty(names)){return cb();}
      async.eachOfSeries(names,(v,i,cback)=>{let IsArr=_.isArray(item[v]);
        let ItemFiles = IsArr?item[v]:[item[v]];
        async.eachOfSeries(ItemFiles,(filedata,i2,cback2)=>{
          if(!(v in item)  || ((v in item) && !filedata) || (filedata && filedata.length <= 24)){return cback2();}
          Files.add(filedata,(err,doc)=>{
            if(err){return cback2(err);}
            if(IsArr){item[v][i2]=_.get(doc,'_id',null);}
            else{item[v]=_.get(doc,'_id',null);}
            cback2();
          });
        },cback);
      },cb);
    });
  }
  ,Render:(req,res)=>{
    Files.findOne({_id:req.params.id})
    .exec((err,doc)=>{if(!doc){return;}
    sharedFun.Render(req.query,doc.fileData,res);});
  },Download:(req,res)=>{
    Files.findOne({_id:req.params.id})
    .exec((err,doc)=>{if(!doc){return;}
    sharedFun.Download(doc.fileData,doc._id,res);});
  },DocDelete:(q,cb)=>{
    Files.find(q)
      .then((modules) => Bluebird.each(modules, (module) => module.remove()))
      .then((doc)=>cb(null,doc.length))
      .catch(cb)
  }
  ,list:(options,cb)=>{
    var criteria = options.criteria || {};
    Files.find(criteria)
    .select(options.select)
    .sort({'createdAt': -1})
    .limit(options.perPage).skip(options.perPage * options.page)
    .exec(cb);
  }
}
/*==============( post remove )========================*/
MySchema.post('remove',(doc)=>{
  console.log('====== file removed ==========')
});
/*======================================*/
const Files = module.exports = mongoose.model("file",MySchema);
