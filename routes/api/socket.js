var arraySockets=[];

module.exports=(io)=>{
  io.sockets.on('connection',socket=>{
    //capturar socket
    socket.on('mensaje',(str)=>{
      io.sockets.emit('respuesta',str);
    });
    /*socket.on('Voice',data=>{
      io.sockets.emit('Voice',data);
    });*/
    socket.on('reunion',(id)=>{
      let index=arraySockets.findIndex(dat=>{return dat==id});
      if(index==-1){
        arraySockets.push(id);
      }
    });
    socket.on('getIds',()=>{
      console.log(arraySockets);
      io.sockets.emit('listaConectados',arraySockets);
    });
    socket.on('disconnect',()=>{
      let index=arraySockets.findIndex(dat=>{return dat==socket.id});
      if(index!=-1){
        arraySockets.splice(index,1);
      }
      io.sockets.emit('salio',socket.id);
    });
    //conectar peers
    socket.on('nodos',(data)=>{
      while(data.length>0){
        let envio=data.pop();
        socket.to(envio).emit('construir',data);
      }
    });

    socket.on('p2p',(data)=>{
      socket.to(data.id).emit('p2p',data);
    });

    socket.on('respConnect',(data)=>{
      socket.to(data.id).emit('terminate',data);
    });

    //actualizar grupos
    socket.on('upGroups',(dt)=>{
      console.log('emite');
      io.sockets.emit('groups',dt);
    });

    socket.on('probarAndroid',data=>{
      console.log(socket.id);
      console.log(data);
      io.sockets.emit("json",data);
    });

  });
};
