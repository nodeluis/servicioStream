const mongoose=require('../connect');

const user={
    nombre:String,
    nick:String,
    email:String,
    password:String,
    notify:[{
        titulo:String,
        idProd:String,
        idChat:String,
        fecha:Date
    }]
};

const usermodel=mongoose.model('user',user);

module.exports=usermodel;
