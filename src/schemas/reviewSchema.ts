import z from "zod";

const reviewSceham = z.object({
  locationId: z.string(),
  userId: z.string(),
  comment: z.string(),
  rating: z.number().min(1, "Choose rating!"),
});

export default reviewSceham;

export type ReviewForm = z.infer<typeof reviewSceham>;
