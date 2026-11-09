import { NotFoundError } from "../helper/errors.js";
import { prisma } from "../helper/prisma.js";
import type { PaginationQuery } from "../interface.js";
import type { CreateServiceInput, UpdateServiceInput } from "../utils/types/serviceValidatorSchema.js";

async function ensureProviderExists(providerId: string): Promise<void> {
  const provider = await prisma.providerProfile.findUnique({
    where: { id: providerId },
    select: { id: true },
  });

  if (!provider) {
    throw new NotFoundError("Provider not found");
  }
}

export async function getProviderServices(providerId: string, pagination: PaginationQuery) {
  await ensureProviderExists(providerId);

  const where = { providerId };
  const [services, total] = await Promise.all([
    prisma.service.findMany({
      where,
      skip: (pagination.page - 1) * pagination.limit,
      take: pagination.limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.service.count({ where }),
  ]);

  return { services, total };
}

export async function createProviderService(providerId: string, data: CreateServiceInput) {
  await ensureProviderExists(providerId);

  return prisma.service.create({
    data: { ...data, providerId },
  });
}

export async function updateProviderService(providerId: string, serviceId: string, data: UpdateServiceInput) {
  const service = await prisma.service.findFirst({
    where: { id: serviceId, providerId },
    select: { id: true },
  });

  if (!service) {
    throw new NotFoundError("Service not found for this provider");
  }

  return prisma.service.update({
    where: { id: serviceId },
    data,
  });
}

export async function deleteProviderService(providerId: string, serviceId: string) {
  const service = await prisma.service.findFirst({
    where: { id: serviceId, providerId },
    select: { id: true },
  });

  if (!service) {
    throw new NotFoundError("Service not found for this provider");
  }

  return prisma.service.delete({ where: { id: serviceId } });
}
