import { z } from "zod";

export const createEventSchema = z.object({
  locationId: z.string().optional().nullable(),
  address: z.string().min(10, "Address is required"),
  title: z
    .string()
    .min(5, "Title is required and must be at least 5 characters."),
  description: z
    .string()
    .min(20, "Description is required and must be at least 20 characters."),
  startsAt: z.date(),
  endsAt: z.date().optional(),
});

export const updateEventSchema = createEventSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided to update the location",
  });

export type CreateEventSchema = z.infer<typeof createEventSchema>;
export type UpdateEventSchema = z.infer<typeof updateEventSchema>;
