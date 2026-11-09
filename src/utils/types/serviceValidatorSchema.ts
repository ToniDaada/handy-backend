import { z } from "zod";

export const serviceIdSchema = z.string().uuid("Service id must be a valid UUID");

export const serviceListQuerySchema = z.object({
  page: z.coerce.number().int("page must be a whole number").positive("page must be at least 1").default(1),
  limit: z.coerce.number().int("limit must be a whole number").min(1, "limit must be at least 1").max(100, "limit cannot be more than 100").default(10),
});

export const createServiceSchema = z.object({
  title: z.string().trim().min(2, "Give the service a title"),
  description: z.string().trim().min(5, "Give a short service description").optional(),
  price_minor: z.number().int("price_minor must be a whole number of kobo").nonnegative("price_minor cannot be negative"),
  duration_minutes: z.number().int("duration_minutes must be a whole number").positive("duration_minutes must be greater than zero"),
  is_active: z.boolean().optional(),
});

export const updateServiceSchema = createServiceSchema.partial().refine(data => Object.keys(data).length > 0, {
  message: "Provide at least one field to update",
});

export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
