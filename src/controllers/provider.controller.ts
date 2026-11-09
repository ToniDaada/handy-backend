import type { Request, Response } from "express";

import { handleErrors } from "../helper/handleErrors.js";
import { NotFoundError } from "../helper/errors.js";
import { getProviderById, getProviders } from "../models/provider.model.js";
import { paginate, parsePagination } from "../utils/pagination.js";
import { providerFilterSchema, providerIdSchema } from "../utils/types/providerValidatorSchema.js";

export async function listProviders(req: Request, res: Response): Promise<void> {
  try {
    const filters = providerFilterSchema.parse(req.query);
    const pagination = parsePagination(filters);
    const { providers, total } = await getProviders(filters, pagination);

    res.status(200).json({
      message: "Providers retrieved successfully",
      ...paginate(providers, total, pagination),
    });
  } catch (error) {
    handleErrors({ res, error });
  }
}

export async function showProvider(req: Request, res: Response): Promise<void> {
  try {
    const providerId = providerIdSchema.parse(req.params.id);
    const provider = await getProviderById(providerId);

    if (!provider) {
      throw new NotFoundError("Provider not found");
    }

    res.status(200).json({ message: "Provider retrieved successfully", data: provider });
  } catch (error) {
    handleErrors({ res, error });
  }
}
