var winston = require('winston'),
    conf = process.env;

exports.init = function() {

  var socketIo;

  var logTransports = [
    new (winston.transports.Console)({ 
          level: conf.CONSOLE_LOG_LEVEL || 'debug',
          colorize: true,
          timestamp: true
    }),
    new (winston.transports.File)({ 
          filename: conf.AGENT_LOG_FILE || './agent.log',
          level: conf.FILE_LOG_LEVEL || 'warn',
          timestamp: true
    })
  ];


  if (conf.LOG_VIEWER == "on"){
    socketIo = require('./log-viewer');
    logTransports.push(new (socketIo.socketIoLogger)({
      level: conf.VIEWER_LOG_LEVEL || 'debug',
      timestamp: true,
      prettyPrint: true
    }));
  }

  return new (winston.Logger)({
    transports: logTransports,
    exitOnError: false
  });
  
};  
