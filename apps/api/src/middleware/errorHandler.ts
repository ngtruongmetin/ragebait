import type { ErrorRequestHandler, RequestHandler } from 'express';
import { ZodError } from 'zod';

export class PublicApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
  }
}

export const notFoundHandler: RequestHandler = (request, response) =>
  response.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: `Route ${request.method} ${request.path} was not found.`,
    },
  });
export const errorHandler: ErrorRequestHandler = (error: unknown, _request, response, _next) => {
  void _next;
  if (error instanceof ZodError)
    return response
      .status(400)
      .json({ error: { code: 'VALIDATION_ERROR', message: 'Invalid request data.' } });
  if (error instanceof PublicApiError)
    return response.status(error.status).json({ error: { code: error.code, message: error.message } });
  console.error('Unhandled request error', error);
  return response
    .status(500)
    .json({ error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred.' } });
};
