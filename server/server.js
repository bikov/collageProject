let fs = require('fs'),
    path  = require('path'),
    express = require('express'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    chat = require('./chatServer')(io),
    config = require('../config/serverConfig.json'),
    winstonConfigurator = require('../config/winstonConfiguration'),
    winston = require('winston');

winstonConfigurator(path.normalize(__dirname + '/../'));
app.use(express.static(path.normalize(__dirname+'/../public')));

server.on('listening',()=> winston.info(`application listening on port: ${config.port}`));
server.listen(config.port);

app.get('/', (req, res) => {
    fs.readFile(path.normalize(__dirname + '/../public/index.html'),
        function(err, data) {
            if (err) {
                winston.error(`Unable to open index.html because: \t '${err}'`);
                return res.status(500).end('Error loading index.html');
            }
            res.status(200).end(data);
        }
    ); 
});