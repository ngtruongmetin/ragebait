import { Router } from 'express';
import { healthRouter } from '../features/health/routes.js';
import { rageShieldRouter } from '../features/rageShield/routes.js';
export const apiRouter = Router();
apiRouter.use('/health', healthRouter);
apiRouter.use('/rage-shield', rageShieldRouter);
