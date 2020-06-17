const mongoose=require('mongoose');

mongoose.connect('mongodb://172.18.0.2:27017/chat').then(()=>{
  console.log('succes db');
}).catch((err)=>{
  console.log(err);
});
mongoose.set('useFindAndModify', false);

module.exports=mongoose;
