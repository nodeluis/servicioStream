const ChatSis=require('../../database/collections/chat719');
var arraySockets=[];
var transmition=[];

module.exports=(io)=>{
  io.sockets.on('connection',socket=>{
    //capturar socket
    socket.on('conectados',(data)=>{
      //let index=arraySockets.findIndex(dat=>{return dat.nick==data.nick});
      //if(index==-1){
        arraySockets.push(data);
      //}
      io.sockets.emit('conectados',arraySockets);
      transmition.forEach(dat=>{
        socket.to(dat).emit('p2pinit',{id:data.id});
      });
    });
    //actualizar grupos
    socket.on('upGroups',(dt)=>{
      console.log('emite');
      io.sockets.emit('groups',dt);
    });
    //logica de los pares
    socket.on('p2p',(data)=>{
      socket.to(data.id).emit('p2p',data);
    });
    socket.on('p2pres',(data)=>{
      let index=transmition.findIndex(dat=>{return dat==data.id});
      if(index==-1){
          transmition.push(data.id);
      }
      socket.to(data.id).emit('p2pres',data);
    });
    //destruir pares
    socket.on('p2pdestroy',(data)=>{
      let index=transmition.findIndex(dat=>{return dat==data.id});
      if(index!=-1){
          transmition.splice(index,1);
      }
      socket.to(data.id).emit('p2pdestroy',data);
    });
    //chat719
    socket.on('chat719',async (data)=>{
      io.sockets.emit('chat719',data);
      let ins=new ChatSis(data);
      await ins.save();
    });
    //desconectados
    socket.on('disconnect',()=>{
      let index=arraySockets.findIndex(dat=>{return dat.id==socket.id});
      if(index!=-1){
        arraySockets.splice(index,1);
      }
      io.sockets.emit('remove',{
        id:socket.id,
        content:arraySockets
      });
      io.sockets.emit('conectados',arraySockets);
    });

  });
};
