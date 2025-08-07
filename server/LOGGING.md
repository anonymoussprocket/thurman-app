# Server Logging Configuration

This server uses Winston with daily rotation for comprehensive logging.

## Log Files

All log files are stored in the `logs/` directory with weekly rotation:

- **`application-YYYY-WW.log`**: All application logs (info, warn, error, debug)
- **`error-YYYY-WW.log`**: Error-level logs only
- **`http-YYYY-WW.log`**: HTTP request/response logs
- **`exceptions-YYYY-WW.log`**: Uncaught exceptions
- **`rejections-YYYY-WW.log`**: Unhandled promise rejections

## Log Rotation

- **Rotation**: Weekly (every Sunday)
- **Archive**: Old logs are automatically gzipped
- **Retention**: 52 weeks (1 year) of logs are kept
- **Max Size**: 20MB per log file before rotation

## Log Levels

Available log levels (from highest to lowest priority):
- `error`: Error conditions
- `warn`: Warning conditions  
- `info`: General information (default in production)
- `http`: HTTP request logs
- `debug`: Debug information (default in development)

### Automatic Log Level Selection

The log level is automatically determined based on the environment:
- **Development** (`NODE_ENV=development`): `debug` level
- **Production** (`NODE_ENV=production`): `info` level
- **Other environments**: `info` level (default)

### Manual Override

You can override the automatic selection using the `LOG_LEVEL` environment variable:
```bash
# Force debug level in production
LOG_LEVEL=debug npm start

# Force info level in development  
LOG_LEVEL=info npm run dev
```

## Usage in Code

### Import the logger
```typescript
import { logger } from './config/logger';
// or
import { logger, logError, logInfo } from './utils/logger';
```

### Basic logging
```typescript
logger.info('User logged in', { userId: '123' });
logger.error('Database connection failed', { error: err });
logger.warn('High memory usage detected', { usage: '85%' });
logger.debug('Processing request', { requestId: 'abc-123' });
```

### Convenience functions
```typescript
import { logError, logInfo, logWarn } from './utils/logger';

logInfo('Server started successfully');
logError('Failed to process payment', error, { userId: '123' });
logWarn('Rate limit exceeded', { ip: req.ip });
```

## Log Format

Logs are stored in JSON format for easy parsing and analysis:

```json
{
  "timestamp": "2025-08-07 12:53:11",
  "level": "error",
  "message": "Database connection failed",
  "error": {
    "message": "Connection timeout",
    "stack": "Error: Connection timeout\n    at ...",
    "name": "ConnectionError"
  },
  "userId": "123"
}
```

## Console Output

In development, logs are also displayed in the console with colors for better readability.

## Configuration

The logging configuration is located in:
- **Main config**: `src/config/logger.ts`
- **Utility functions**: `src/utils/logger.ts`
- **App integration**: `src/app.ts`

## Environment Variables

- `NODE_ENV`: Determines automatic log level selection
  - `development`: Sets log level to `debug`
  - `production`: Sets log level to `info`
  - Other values: Defaults to `info`
- `LOG_LEVEL`: Manual override for log level (takes precedence over `NODE_ENV`)
  - Available values: `error`, `warn`, `info`, `http`, `debug`

## Monitoring

Log files can be monitored using tools like:
- `tail -f logs/application-*.log` - Real-time monitoring
- Log aggregation services (ELK stack, Splunk, etc.)
- Custom monitoring scripts
