const General=require('../../database/collections/chatGeneral');
const express=require('express');
const empty=require('is-empty');
const router=express.Router();

router.get('/',(req,res)=>{
    General.find().exec((err,docs)=>{
        if(!empty(docs)){
            res.json(docs);
        }else{
            res.json({message:'no existen mensajes'});
        }
    });
});

module.exports=router;