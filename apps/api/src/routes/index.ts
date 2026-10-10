import { Router } from 'express';
import { healthRouter } from '../features/health/routes.js';
export const apiRouter = Router();
apiRouter.use('/health', healthRouter);
