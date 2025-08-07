import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from './config';
import http from 'http';
import expressWinston from 'express-winston';
import { logger } from './config/logger';
import authRouter from './routes/auth';
import userRouter from './routes/user';
import loanPoolsRouter from './routes/loanPools';
import webhooksRouter from './routes/webhooks';
import depositsRouter from './routes/deposits';
import contractEventsRouter from './routes/contractEvents';
import { notFound } from './middleware/notFound';
import { errorHandler } from './middleware/errorHandler';

const { port, apiPrefix } = config;
const app: Express = express();
const server = http.createServer(app);

// Winston logger configuration with file rotation
const loggerOptions: expressWinston.LoggerOptions = {
    winstonInstance: logger,
    meta: true,
    msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
    expressFormat: true,
    colorize: false, // File logs should not have color codes
    ignoreRoute: function (req, res) {
        // Ignore health check routes to reduce log noise
        return req.url === '/health' || req.url === '/ping';
    }
};

// ===== MIDDLEWARE ORDER =====
// 1. CORS and body parsing middleware FIRST
app.use(
    cors({
        origin: 'http://localhost:3000',
        credentials: true
    })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Request logging middleware
app.use(expressWinston.logger(loggerOptions));

// 3. API routes (with proper apiPrefix)
app.use(`${apiPrefix}/auth`, authRouter);
app.use(`${apiPrefix}/user`, userRouter);
app.use(`${apiPrefix}/loan-pools`, loanPoolsRouter);
app.use(`${apiPrefix}/webhooks`, webhooksRouter);
app.use(`${apiPrefix}/deposits`, depositsRouter);
app.use(`${apiPrefix}/contract-events`, contractEventsRouter);

// 4. 404 handler for unmatched routes
app.use(notFound);

// 5. Error handler middleware LAST
app.use(errorHandler);

server.listen(port, () => {
    logger.info(`Server running on port ${port}`);
    logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.info(`Log files are stored in: ${process.cwd()}/logs`);
    logger.info(`Log level set to: ${logger.level} ${process.env.LOG_LEVEL ? '(explicit)' : '(auto)'}`);
});

export default app;
