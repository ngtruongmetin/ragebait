import { Router } from 'express';
import { getHealth } from './service.js';
export const healthRouter = Router();
healthRouter.get('/', (_request, response) => response.status(200).json({ data: getHealth() }));
