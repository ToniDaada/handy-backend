import type { Prisma } from "../generated/prisma/client.js";
import { prisma } from "../helper/prisma.js";
import type { PaginationQuery } from "../interface.js";
import type { ProviderFilters } from "../utils/types/providerValidatorSchema.js";

const providerDetails = {
  user: {
    select: {
      id: true,
      email: true,
      first_name: true,
      last_name: true,
    },
  },
  services: {
    orderBy: { createdAt: "desc" as const },
  },
};

export async function getProviders(filters: ProviderFilters, pagination: PaginationQuery) {
  const servicePrice: Prisma.IntFilter = {};

  if (filters.min_price !== undefined) {
    servicePrice.gte = filters.min_price;
  }

  if (filters.max_price !== undefined) {
    servicePrice.lte = filters.max_price;
  }

  const where: Prisma.ProviderProfileWhereInput = {
    category: filters.category ? { equals: filters.category, mode: "insensitive" } : undefined,
    city: filters.city ? { equals: filters.city, mode: "insensitive" } : undefined,
    services:
      filters.min_price !== undefined || filters.max_price !== undefined
        ? { some: { price_minor: servicePrice } }
        : undefined,
    OR: filters.search
      ? [
          { bio: { contains: filters.search, mode: "insensitive" } },
          { user: { first_name: { contains: filters.search, mode: "insensitive" } } },
          { user: { last_name: { contains: filters.search, mode: "insensitive" } } },
        ]
      : undefined,
  };

  const [providers, total] = await Promise.all([
    prisma.providerProfile.findMany({
      where,
      include: providerDetails,
      skip: (pagination.page - 1) * pagination.limit,
      take: pagination.limit,
      orderBy: { user: { first_name: "asc" } },
    }),
    prisma.providerProfile.count({ where }),
  ]);

  return { providers, total };
}

export function getProviderById(id: string) {
  return prisma.providerProfile.findUnique({
    where: { id },
    include: providerDetails,
  });
}
