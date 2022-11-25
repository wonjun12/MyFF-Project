import socketClinet from 'socket.io-client';

export let socket;

export const socketConnect = (UID) =>{
    socket = socketClinet('http://localhost:4000',{
        path:"/socket.io", query: {
          UID: UID
        }
    });
} 

// socket.emit('boardCreate');