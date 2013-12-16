var winston = require('winston'),
    conf = process.env;

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({ 
        level: conf.CONSOLE_LOG_LEVEL || 'verbose',
        colorize: true
    }),
    new (winston.transports.File)({ 
        filename: process.env.AGENT_LOG_FILE || './agent.log',
        colorize: true,
        level: conf.FILE_LOG_LEVEL || 'warn'
    })
  ],
  exitOnError: false
});

module.exports = logger;
