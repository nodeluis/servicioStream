const mongoose=require('../connect');

const chatsis={
    nick:String,
    message:String
}

const chatsismodel=mongoose.model('chatsis',chatsis);

module.exports=chatsismodel;
