import type { NextFunction, Request, Response } from "express";

export const requestTimer = (req: Request, res: Response, next: NextFunction): void => {
  const startedAt = performance.now();

  res.on("finish", () => {
    const elapsedMilliseconds = Math.round(performance.now() - startedAt);

    console.log(`${req.method} ${req.path} ${res.statusCode} ${elapsedMilliseconds}ms`);
  });

  next();
};
