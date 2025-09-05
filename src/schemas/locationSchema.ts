import { z } from "zod";
import { LocationType } from "../types/locationTypes";

export const locationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.object({
    street: z.string(),
    city: z.string(),
  }),
  description: z.string().min(1, "Description is required"),
  type: z.nativeEnum(LocationType),
  images: z
    .array(z.instanceof(File))
    .min(1, "Please upload at least one image.")
    .max(5, "You can upload up to 5 images only."),
});

export const updateLocation = locationSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided to update the Location",
  });

export type UpdateLocationSchema = z.infer<typeof updateLocation>;
export type CreateLocationSchema = z.infer<typeof locationSchema>;
