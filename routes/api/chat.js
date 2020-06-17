const Chat=require('../../database/collections/chat');
const express=require('express');
const empty=require('is-empty');
const router=express.Router();

router.get('/',(req,res)=>{
    Chat.find().exec((err,docs)=>{
        if(!empty(docs)){
            res.json(docs);
        }else{
            res.json({message:'no existen mensajes'});
        }
    });
});

router.post('/',async(req,res)=>{
    let ad=[];
    ad.push(req.body.id);
    let data={
      creador:req.body.creador,
      nombre:req.body.nombre,
      description:req.body.description,
      mensaje:[],
      admin:ad,
      participante:[]
    }
    let ins=new Chat(data);
    let result= await ins.save();
    if(!empty(result)){
      res.json({message:'Grupo insertado'});
    }else {
      res.json({message:'error'});
    }
});


module.exports=router;
