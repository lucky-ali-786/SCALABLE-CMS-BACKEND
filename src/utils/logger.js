import { createLogger, format as _format, transports as _transports } from 'winston';
const { combine, timestamp, label, printf } = _format;
const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});
const logger = createLogger({
  level: 'info',
  format: combine(
    label({ label: 'right meow!' }),
    timestamp(),
    myFormat
  ),
  defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write all logs with importance level of `error` or higher to `error.log`
    //   (i.e., error, fatal, but not other levels)
    //
    new _transports.File({ filename: 'error.log', level: 'error' }),
    //
    // - Write all logs with importance level of `info` or higher to `combined.log`
    //   (i.e., fatal, error, warn, and info, but not trace)
    //
    new _transports.File({ filename: 'combined.log' }),
  ],
});
//and use this logger code anywhere in the project like this:
// logger.info('This is an info message');
// logger.error('This is an error message');
// jahan pe zarurat ho wahan pe import karke use kar sakte ho
// example:
// import logger from './utils/logger.js';
// logger.info('This is an info message');
export default logger;