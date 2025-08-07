import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../../logs');

// Define log levels
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define log colors
const logColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
};

// Add colors to winston
winston.addColors(logColors);

// Determine log level based on environment
const getLogLevel = (): string => {
  if (process.env.LOG_LEVEL) {
    return process.env.LOG_LEVEL;
  }
  
  // Default log levels based on environment
  return process.env.NODE_ENV === 'development' ? 'debug' : 'info';
};

// Create the logger
const logger = winston.createLogger({
  level: getLogLevel(),
  levels: logLevels,
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    // Console transport for development
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.printf(
          (info) => `${info.timestamp} ${info.level}: ${info.message}`
        )
      ),
    }),

    // File transport for all logs with weekly rotation
    new DailyRotateFile({
      filename: path.join(logsDir, 'application-%DATE%.log'),
      datePattern: 'YYYY-WW', // Weekly rotation (WW = week number)
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '52w', // Keep 52 weeks (1 year) of logs
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    }),

    // Separate file for error logs with weekly rotation
    new DailyRotateFile({
      level: 'error',
      filename: path.join(logsDir, 'error-%DATE%.log'),
      datePattern: 'YYYY-WW',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '52w',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    }),

    // Separate file for HTTP logs with weekly rotation
    new DailyRotateFile({
      level: 'http',
      filename: path.join(logsDir, 'http-%DATE%.log'),
      datePattern: 'YYYY-WW',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '52w',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    }),
  ],

  // Handle uncaught exceptions
  exceptionHandlers: [
    new winston.transports.Console(),
    new DailyRotateFile({
      filename: path.join(logsDir, 'exceptions-%DATE%.log'),
      datePattern: 'YYYY-WW',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '52w',
    }),
  ],

  // Handle unhandled promise rejections
  rejectionHandlers: [
    new winston.transports.Console(),
    new DailyRotateFile({
      filename: path.join(logsDir, 'rejections-%DATE%.log'),
      datePattern: 'YYYY-WW',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '52w',
    }),
  ],
});

// Create a stream object for Morgan HTTP logging middleware
const stream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

export { logger, stream };
