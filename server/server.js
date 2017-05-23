//noinspection JSDuplicatedDeclaration
/**
 * Created by bikov on 5/12/2017.
 */
let fs = require('fs'),
    path  = require('path'),
    express = require('express'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    chat = require('./chatServer')(io),
    config = require('../config/config.json'),
    winstonConfigurator = require('../config/winstonConfiguration'),
    winston = require('winston');

winstonConfigurator(path.normalize(__dirname + '/../'));
app.use(express.static(path.normalize(__dirname+'/../public')));
server.on('listening',()=> winston.info(`listening on port: ${config.port}`));
server.listen(config.port);
app.get('/', (req, res) => {
    fs.readFile(path.normalize(__dirname + '/../public/index.html'),
        function(err, data) {
            if (err) {
                winston.error(`Unable to open index.html because: \t '${err}'`);
                res.writeHead(500);
                return res.end('Error loading index.html');
            }
            res.writeHead(200);
            res.end(data);
        }
    ); 
});