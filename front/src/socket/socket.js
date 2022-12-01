import socketClinet from 'socket.io-client';

export let socket;

export const socketConnect = (UID) =>{
  //해당 주소로 요청 시도
    socket = socketClinet('http://118.128.215.124:4000',{
        path:"/socket.io", query: {
          UID: UID
        }
    });
} 

// socket.emit('boardCreate');