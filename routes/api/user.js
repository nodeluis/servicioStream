const User=require('../../database/collections/user');
const express=require('express');
const empty=require('is-empty');
const sha1=require('sha1');
const jwt=require('jsonwebtoken');
const router=express.Router();

router.get('/',(req,res)=>{
    User.find().exec((err,docs)=>{
        if(!empty(docs)){
            res.json(docs);
        }else{
            res.json({message:'no existen usuarios en la bd'});
        }
    });
});

router.post('/',(req,res)=>{
    let data=req.body;
    User.findOne({email:data.email}).exec(async(err,doc)=>{
      if(empty(doc)){
        data.password=sha1(data.password);
        data.notify=[];
        let insertar=new User(data);
        let result=await insertar.save();
        if(!empty(result)){
            res.json({message:'usuario registrado'});
        }else{
            res.json({message:'existieron errores en el registro'});
        }
      }else{
        res.json({message:'el email ya existe'});
      }
    });
});

router.post('/nickv',async(req,res)=>{
    let result=await User.findOne({nick:req.body.nick});
    if(empty(result)){
      res.json({val:false});
    }else{
      res.json({val:true});
    }
});

router.post('/emailv',async(req,res)=>{
    let result=await User.findOne({email:req.body.email});
    if(empty(result)){
      res.json({val:false});
    }else{
      res.json({val:true});
    }
});

router.post('/login',(req,res)=>{
    User.findOne({email:req.body.email}).select('nombre nick password').exec((err,doc)=>{
      if(!empty(doc)){
        if(doc.password==sha1(req.body.password)){
          let token=jwt.sign({
            email:doc.email,
            id:doc._id
          },process.env.JWT_TOKEN||'miClave',{
            expiresIn:"1h"
          });
          res.json({
            message:'Bienvenido',
            token:token,
            user:{
              nombre:doc.nombre,
              nick:doc.nick,
              id:doc._id
            }
          });
        }else{
          res.json({message:'El password es incorrecto'});
        }
      }else{
        res.json({message:'El email no existe'});
      }
    });
});

module.exports=router;
