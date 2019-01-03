const sharp = require('sharp');

exports.resize=(ctrl,Buffer,cb)=>{
  if(!ctrl.width){return cb(null,Buffer);};
  if(ctrl.height){ctrl.height=parseInt(ctrl.height)}
  sharp(Buffer).resize(parseInt(ctrl.width),ctrl.height).toBuffer()
  .then(d=>cb(null,d)).catch(cb)
}
