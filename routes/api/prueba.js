const Prueba=require('../../database/collections/prueba');
const User=require('../../database/collections/user');
const express=require('express');
const router=express.Router();
const empty=require('is-empty');
const multer=require('multer');
const fs=require('fs');
const path=require('path');


router.get('/',(req, res)=>{
    Prueba.find({},(err,docs)=>{
      if(!empty(docs)){
        res.json(docs);
      }else{
        res.json({message:'no existen chats'});
      }
    });
});

router.post('/',async(req,res)=>{
    console.log(req.body);
    req.body.chat=[];
    req.body.foto=[];
    let pru=new Prueba(req.body);
    let result=await pru.save();
    if(!empty(result)){
      res.json({message:'producto insertado'});
    }else{
      res.json({
        message:'error',
        error:result
      });
    }
});

router.get('/elim',(req,res)=>{
    Prueba.find({},(err,docs)=>{
      docs.forEach(async dat=>{
        dat.chat=[];
        await Prueba.findByIdAndUpdate(dat._id,dat);
      });
    });
    User.find({},(err,docs)=>{
      docs.forEach(async dat=>{
        dat.notify=[];
        await User.findByIdAndUpdate(dat._id,dat);
      });
    });
    res.json({message:'actualizado'});
});

router.post('/send',(req,res)=>{
    console.log(req.body);
    let idPr=req.body.id;
    let idUs=req.body.user;
    let name=req.body.name;
    let message=req.body.message;
    Prueba.findOne({_id:idPr}).select('chat titulo creador').exec(async(err,doc)=>{
      if(!empty(doc)){
        try{
          let idChat=req.body.idChat;
          let index=doc.chat.findIndex(dat=>{return dat._id==idChat});
          let user=await User.findOne({_id:(idUs==doc.creador?doc.chat[index].idUser:doc.creador)}).select('notify nombre');
          doc.chat[index].messages.push({
            name,
            message
          });
          let index2=user.notify.findIndex(dat=>{return dat.idChat==idChat});
          if(index2==-1){
            user.notify.push({
              titulo:doc.titulo,
              idProd:idPr,
              idChat:idChat,
              fecha:new Date()
            });
          }else{
            user.notify[index2].fecha=new Date();
          }
          User.findByIdAndUpdate(user._id,user,()=>{
            console.log('usuario notificado');
          });
        } catch(e){
          let index=doc.chat.findIndex(dat=>{return dat.idUser==idUs});
          let user=await User.findOne({_id:doc.creador}).select('notify nombre');
          let idChat;
          if(index==-1){
            doc.chat.push({
              idUser:idUs,
              messages:[{
                name,
                message
              }]
            });
            idChat=doc.chat[doc.chat.length-1]._id;
          }else{
            doc.chat[index].messages.push({
              name,
              message
            });
            idChat=doc.chat[index]._id
          }
          let index2=user.notify.findIndex(dat=>{return dat.idChat==idChat});
          console.log(index2);
          if(index2==-1){
            user.notify.push({
              titulo:doc.titulo,
              idProd:idPr,
              idChat:idChat,
              fecha:new Date()
            });
          }else{
            user.notify[index2].fecha=new Date();
          }
          User.findByIdAndUpdate(user._id,user,()=>{
            console.log('usuario notificado');
          });
        }
        Prueba.findByIdAndUpdate(doc._id,doc,()=>{
          res.json({message:'insertado'});
        });
      }else{
        res.json({message:'no existe producto'});
      }
    });
});

const storage = multer.diskStorage({
    destination: function (res, file, cb) {
        try {
            fs.statSync('./public/uploads');
        } catch (e) {
            fs.mkdirSync('./public/uploads/');
        }
        cb(null, './public/uploads/');
    },
    filename: (res, file, cb) => {
        cb(null, 'IMG-' + Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({storage: storage });

router.post('/images',upload.array('img', 12),async(req,res)=>{
    let images=[];
    req.files.forEach(dat=>{
      images.push({
        url:'uploads/'+dat.filename
      });
    });
    req.body.foto=images;
    req.body.chat=[];
    let ins=new Prueba(req.body);
    let result=await ins.save();
    console.log(result);
    if(!empty(result)){
      res.json({
        message:'se envio',
      });
    }else{
      res.json({message:'error al insertar'});
    }
});







module.exports=router;
