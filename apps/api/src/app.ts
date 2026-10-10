import cors from 'cors';
import express from 'express';
import { env } from './config/env.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { apiRouter } from './routes/index.js';

export const app = express();
app.disable('x-powered-by');
app.use(
  cors({
    origin: env.corsOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: false,
  }),
);
app.use(express.json({ limit: '1mb' }));
app.use('/api', apiRouter);
app.use(notFoundHandler);
app.use(errorHandler);
