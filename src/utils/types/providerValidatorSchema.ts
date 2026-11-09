import { z } from "zod";

const optionalText = (fieldName: string) =>
  z.preprocess(
    value => (value === "" ? undefined : value),
    z.string().trim().min(1, `${fieldName} cannot be empty`).optional(),
  );

const optionalMoney = (fieldName: string) =>
  z.preprocess(
    value => (value === "" ? undefined : value),
    z.coerce.number().int(`${fieldName} must be a whole number of kobo`).nonnegative(`${fieldName} cannot be negative`).optional(),
  );

export const providerFilterSchema = z
  .object({
    category: optionalText("category"),
    city: optionalText("city"),
    search: optionalText("search"),
    min_price: optionalMoney("min_price"),
    max_price: optionalMoney("max_price"),
    page: z.coerce.number().int("page must be a whole number").positive("page must be at least 1").default(1),
    limit: z.coerce.number().int("limit must be a whole number").min(1, "limit must be at least 1").max(100, "limit cannot be more than 100").default(10),
  })
  .refine(query => query.min_price === undefined || query.max_price === undefined || query.min_price <= query.max_price, {
    message: "max_price must be greater than or equal to min_price",
    path: ["max_price"],
  });

export const providerIdSchema = z.string().uuid("Provider id must be a valid UUID");

export type ProviderFilters = z.infer<typeof providerFilterSchema>;
