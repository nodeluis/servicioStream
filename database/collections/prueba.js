const mongoose=require('../connect');

const prueba={
    titulo:String,
    precio:Number,
    description:String,
    creador:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'user'
    },
    chat:[{
      idUser:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
      },
      messages:[{
        name:String,
        message:String
      }]
    }],
    foto:[{
      url:String
    }]
};

const pruebamodel=mongoose.model('prueba',prueba);

module.exports=pruebamodel;
