import { z } from 'zod'

export const reviewSchema = z.object({
  bookingId: z.string(),
  machineryId: z.string(),
  revieweeId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
})

export const reviewResponseSchema = z.object({
  response: z.string().min(1, 'Response is required'),
})

export type ReviewInput = z.infer<typeof reviewSchema>
export type ReviewResponseInput = z.infer<typeof reviewResponseSchema>
