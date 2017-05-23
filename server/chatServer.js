/**
 * Created by bikov on 5/13/2017.
 */
let winston = require('winston');
module.exports =(io)=> io.sockets.on('connection', function (socket) {
    socket.on('clientMessage', function (content) {
        socket.emit('serverMessage', `You said: '${content}'`);
        setUserName(socket);
        winston.info(`user: ${socket.username} \t sent message: '${content}'`);
        socket.broadcast.emit('serverMessage', `${socket.username} said: ' ${content}'`);
    });

    socket.on('login', function (username) {
        setUserName(socket, username);
        socket.emit('serverMessage', `Currently logged in as: ${username}`);
        socket.broadcast.emit('serverMessage', `User ${username}  logged in`);
    });

    socket.on('disconnect', function () {
        setUserName(socket);
        socket.broadcast.emit('serverMessage', `User ${socket.username} disconnected`);
    });

    socket.on('join', function (room) {
        winston.info(`user ${socket.username} joined room: ${room}`)
        if(socket.room){
            socket.leave(room, ()=>joinRoom(socket,room));
        }else {
            joinRoom(socket, room);
        }
    });
    socket.emit('login');
});

function setUserName(socket, username) {
    if(username){
        socket.username = username;
    }
    else if (!socket.username) {
        socket.username = socket.id;
    }
}

function joinRoom(socket, room) {
    socket.room = room;
    socket.join(room);
    setUserName();
    socket.emit('serverMessage', `You joined room ${room}`);
    socket.broadcast.to(room).emit('serverMessage', `User ${socket.username} joined this room`);
}