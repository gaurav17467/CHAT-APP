const path =require("path");
const http =require("http");
const socketio =require("socket.io");
const express =require("express");
const formatMessage=require('./utils/messages');
const {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
  } = require('./utils/users');

const app=express();
const server=http.createServer(app);
const io= socketio(server);

//set static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName= 'chat app ';

//Run when client connects
io.on('connection', socket=>{

    socket.on('joinRoom',({username,room})=>{
        const user =userJoin(socket.id,username,room);

        socket.join(user.room); 


    //welcome current user

    //socket.emit only emits for client
    //socket.broadcast.emit emits to everyone except the client
    //io.emit emits to everyone

    socket.emit('message',formatMessage(botName,"welcome to chat-app"));

    //broadcast when a user connects
    socket.broadcast.to(user.room).emit('message',formatMessage(botName, `${user.username} has joined the chat`));
    
    //send users and room info
    io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });


    });

    //listen for chat message

    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);
    
        io.to(user.room).emit('message', formatMessage(user.username, msg));
      });

    //runs when client disconnects
    socket.on('disconnect',()=>{

        const user=userLeave(socket.id)
        if(user){
            io.to(user.room).emit('message',formatMessage(botName,`${user.username} has left the chat`));

        //send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
          });
        }
    });

});

const PORT=3000 || process.env.PORT;

server.listen(PORT, ()=> console.log('SERVER is running on port ' +PORT));