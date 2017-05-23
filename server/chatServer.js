let winston = require('winston'),
    Promise = require('bluebird'),
    rooms = ['main'];

module.exports =(io)=> io.sockets.on('connection', function (socket) {
    socket.on('clientMessage', function (content) {
        socket.emit('serverMessage', `You said: ${content}`, true);
        let room = socket.room;
        setUserName(socket)
            .then(() => socket.broadcast.to(room).emit('serverMessage', `${socket.username} said:  ${content}`,false));
        winston.info(`user ${socket.username}   sent message: ${content} to room: ${room}`);
    });

    socket.on('login', function (username) {
        joinRoom(socket,rooms[0],username);
        socket.emit('serverMessage', `Currently logged in as: ${username}`, true);
        winston.info(`user: ${username} logged in`);
    });

    socket.on('disconnect', function () {
        setUserName(socket)
            .then(()=> socket.broadcast.emit('serverMessage', `User ${socket.username} disconnected`, false))
            .then(()=> winston.info(`user ${socket.username} disconnected`));
    });

    socket.on('getRooms', function () {
        socket.emit('rooms',rooms);
        winston.info(`user ${socket.username} asked rooms, current rooms: ${rooms}`);
    });

    socket.on('join', function (room) {
            if (!(rooms.indexOf(room) > -1)) {
                rooms.push(room);
                socket.broadcast.emit('newRoom');
            }
            if (socket.room) {
                socket.leave(socket.room, ()=>joinRoom(socket, room));
            } else {
                joinRoom(socket, room);
            }
    });
    socket.emit('login');
    socket.emit('rooms',rooms);
});

function setUserName(socket, username) {
    return new Promise((resolve)=> {
        if(username){
            socket.username = username;
        }
        else if (!socket.username) {
            socket.username = socket.id;
        }
        resolve();
    })
}

function joinRoom(socket, room, userName) {
    socket.join(room);
    socket.emit('serverMessage', `You joined room ${room}`, true);
    socket.room = room;
    setUserName(socket, userName)
        .then(() => socket.to(room).emit('serverMessage', `User ${socket.username} joined this room`, false))
        .then(winston.info(`user ${socket.username} joined room ${room}`));
}