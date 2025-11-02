import { z } from 'zod'

export const bookingSchema = z.object({
  machineryId: z.string(),
  startTime: z.date(),
  endTime: z.date(),
  notes: z.string().optional(),
}).refine((data) => data.endTime > data.startTime, {
  message: 'End time must be after start time',
  path: ['endTime'],
})

export const bookingUpdateSchema = z.object({
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'COMPLETED', 'CANCELLED']),
})

export type BookingInput = z.infer<typeof bookingSchema>
export type BookingUpdateInput = z.infer<typeof bookingUpdateSchema>
