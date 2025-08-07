// Re-export logger for easy import throughout the application
export { logger } from '../config/logger';

// Convenience functions for common logging patterns
export const logError = (message: string, error?: Error | unknown, meta?: any) => {
  const { logger } = require('../config/logger');
  
  if (error instanceof Error) {
    logger.error(message, {
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name,
      },
      ...meta,
    });
  } else {
    logger.error(message, { error, ...meta });
  }
};

export const logInfo = (message: string, meta?: any) => {
  const { logger } = require('../config/logger');
  logger.info(message, meta);
};

export const logWarn = (message: string, meta?: any) => {
  const { logger } = require('../config/logger');
  logger.warn(message, meta);
};

export const logDebug = (message: string, meta?: any) => {
  const { logger } = require('../config/logger');
  logger.debug(message, meta);
};

export const logHttp = (message: string, meta?: any) => {
  const { logger } = require('../config/logger');
  logger.http(message, meta);
};
