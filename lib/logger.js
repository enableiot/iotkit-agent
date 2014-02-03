var winston = require('winston'),
    conf = process.env;

exports.init = function(utils) {

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

  var localConf = utils.getConfig();
  if (localConf.log_viewer== "on"){
    logTransports.push(require('./log-viewer').init(localConf));
  }

  return new (winston.Logger)({
    transports: logTransports,
    exitOnError: false
  });
  
};  
