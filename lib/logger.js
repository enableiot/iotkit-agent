var winston = require('winston'),
    conf = process.env,
    socketIo = require('./log-viewer');

exports.init = function() {
  return new (winston.Logger)({
      transports: [
      new (winston.transports.Console)({ 
            level: conf.CONSOLE_LOG_LEVEL || 'debug',
            "colorize": true,
            "timestamp": true
      }),

      new (winston.transports.File)({ 
            filename: conf.AGENT_LOG_FILE || './agent.log',
            level: conf.FILE_LOG_LEVEL || 'warn',
            "timestamp": true
      }),
      
      new (socketIo.socketIoLogger)({ 
          level: conf.FILE_LOG_LEVEL || 'warn',
          "timestamp": true
      })
    ],
    exitOnError: false
  });
};  
