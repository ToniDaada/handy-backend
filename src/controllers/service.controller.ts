import type { Request, Response } from "express";

import { handleErrors } from "../helper/handleErrors.js";
import {
  createProviderService,
  deleteProviderService,
  getProviderServices,
  updateProviderService,
} from "../models/service.model.js";
import { paginate, parsePagination } from "../utils/pagination.js";
import { providerIdSchema } from "../utils/types/providerValidatorSchema.js";
import { createServiceSchema, serviceIdSchema, serviceListQuerySchema, updateServiceSchema } from "../utils/types/serviceValidatorSchema.js";

export async function listServices(req: Request, res: Response): Promise<void> {
  try {
    const providerId = providerIdSchema.parse(req.params.id);
    const query = serviceListQuerySchema.parse(req.query);
    const pagination = parsePagination(query);
    const { services, total } = await getProviderServices(providerId, pagination);

    res.status(200).json({
      message: "Services retrieved successfully",
      ...paginate(services, total, pagination),
    });
  } catch (error) {
    handleErrors({ res, error });
  }
}

export async function createService(req: Request, res: Response): Promise<void> {
  try {
    const providerId = providerIdSchema.parse(req.params.id);
    const input = createServiceSchema.parse(req.body);
    const service = await createProviderService(providerId, input);

    res.status(201).json({ message: "Service created successfully", data: service });
  } catch (error) {
    handleErrors({ res, error });
  }
}

export async function updateService(req: Request, res: Response): Promise<void> {
  try {
    const providerId = providerIdSchema.parse(req.params.id);
    const serviceId = serviceIdSchema.parse(req.params.serviceId);
    const input = updateServiceSchema.parse(req.body);
    const service = await updateProviderService(providerId, serviceId, input);

    res.status(200).json({ message: "Service updated successfully", data: service });
  } catch (error) {
    handleErrors({ res, error });
  }
}

export async function deleteService(req: Request, res: Response): Promise<void> {
  try {
    const providerId = providerIdSchema.parse(req.params.id);
    const serviceId = serviceIdSchema.parse(req.params.serviceId);
    const service = await deleteProviderService(providerId, serviceId);

    res.status(200).json({ message: "Service deleted successfully", data: service });
  } catch (error) {
    handleErrors({ res, error });
  }
}
