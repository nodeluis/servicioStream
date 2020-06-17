const mongoose=require('../connect');

const chat={
    creador:String,
    nombre:String,
    description:String,
    mensaje:[{
        fecha:Date,
        nick:String,
        msg:String
    }],
    admin:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    }],
    participante:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    }]
};

const chatmodel=mongoose.model('chat',chat);

module.exports=chatmodel;
