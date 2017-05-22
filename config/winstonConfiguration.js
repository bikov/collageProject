/**
 * Created by bikov on 5/19/2017.
 */
let winston = require('winston');

module.exports = function(output){
    winston.add(winston.transports.File, {
        level:'info',
        filename:`${output}\\log.log`
    });

    winston.cli();
};