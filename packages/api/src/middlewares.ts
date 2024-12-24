import { NextFunction, Request, Response } from "express";
import { LRUCache } from "lru-cache";

export const STATUS_CODES = {
  OK: 200,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
};

function notFound(req: Request, res: Response, next: NextFunction) {
  res.status(STATUS_CODES.NOT_FOUND);

  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);

  next(error);
}

/* eslint-disable no-unused-vars */
export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err);
  const statusCode =
    res.statusCode !== 200
      ? res.statusCode
      : STATUS_CODES.INTERNAL_SERVER_ERROR;

  const message =
    err &&
    (err instanceof Error || (typeof err === "object" && "message" in err))
      ? err.message
      : "Internal Server Error";

  res.status(statusCode).json({
    status: statusCode,
    message,
  });
}

function errorCatchMiddleware<T>(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<T>
) {
  return function (req: Request, res: Response, next: NextFunction) {
    return Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// Rate limiter middleware
const rateLimitCache = new LRUCache<string, number>({
  max: 500, // Maximum number of entries
  ttl: 1000 * 60, // Time to live for each entry (1 minute)
});

const rateLimiter = (limit = 10) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = (req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress) as string;

    const currentHits = rateLimitCache.get(ip) || 0;

    if (currentHits >= limit) {
      return res
        .status(STATUS_CODES.TOO_MANY_REQUESTS)
        .json({ message: "Too many requests. Please try again later." });
    }

    rateLimitCache.set(ip, currentHits + 1);
    next();
  };
};

export default { notFound, errorHandler, rateLimiter, errorCatchMiddleware };
