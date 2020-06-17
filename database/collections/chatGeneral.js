const mongoose=require('../connect');

const general={
    fecha:Date,
    msg:String,
    nick:String
};

const generalmodel=mongoose.model('general',general);

module.exports=generalmodel;