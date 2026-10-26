import type { NextFunction, Request, Response } from "express";

export function requireApiKey(req: Request, res: Response, next: NextFunction): void {
  const providedApiKey = req.get("x-api-key");
  const configuredApiKey = process.env.API_KEY;

  if (!configuredApiKey || providedApiKey !== configuredApiKey) {
    res.status(401).json({ message: "A valid x-api-key header is required." });
    return;
  }

  next();
}
