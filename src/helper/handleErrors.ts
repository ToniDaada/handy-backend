import type { Response } from "express";
import { ZodError } from "zod";

import { Prisma } from "../generated/prisma/client.js";
import { AppError } from "./errors.js";

export function handleErrors({ res, error }: { res: Response; error: unknown }): Response {
  if (error instanceof ZodError) {
    const errors = error.errors.map(issue => ({
      field: issue.path.join("."),
      message: issue.message,
    }));

    return res.status(400).json({ message: "Validation error", errors });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    const field = (error.meta?.target as string[] | undefined)?.[0] ?? "field";

    return res.status(409).json({
      message: "Duplicate entry",
      error: { field, message: `${field} already exists` },
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
    return res.status(404).json({ message: "Record not found" });
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  console.error("Unhandled error:", error);
  return res.status(500).json({ message: "Internal Server Error" });
}
