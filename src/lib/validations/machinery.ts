import { z } from 'zod'
import { MachineryType } from '@prisma/client'

export const machinerySchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  type: z.nativeEnum(MachineryType),
  description: z.string().optional(),
  hourlyRate: z.number().min(0).optional(),
  dailyRate: z.number().min(0, 'Daily rate must be positive'),
  location: z.string().min(3, 'Location is required'),
  photos: z.array(z.string()).min(1, 'At least one photo is required'),
  availability: z.any(), // JSON field
  isActive: z.boolean().default(true),
})

export const machineryUpdateSchema = machinerySchema.partial()

export type MachineryInput = z.infer<typeof machinerySchema>
export type MachineryUpdateInput = z.infer<typeof machineryUpdateSchema>
