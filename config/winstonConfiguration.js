let winston = require('winston');

module.exports = function(output){
    winston.add(winston.transports.File, {
        level:'info',
        filename:`${output}\\log.log`
    });

    winston.cli();
};