import { UserRole, BookingStatus, PaymentStatus, MachineryType } from '@prisma/client'

export type { UserRole, BookingStatus, PaymentStatus, MachineryType }

export interface User {
  id: string
  name: string
  email: string
  image?: string | null
  role: UserRole
  phone?: string | null
  location?: string | null
  bio?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Machinery {
  id: string
  ownerId: string
  name: string
  type: MachineryType
  description?: string | null
  hourlyRate?: number | null
  dailyRate: number
  location: string
  photos: string[]
  availability: any
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  owner?: User
  _count?: {
    reviews: number
    bookings: number
  }
}

export interface Booking {
  id: string
  machineryId: string
  renterId: string
  startTime: Date
  endTime: Date
  status: BookingStatus
  totalAmount: number
  paymentStatus: PaymentStatus
  notes?: string | null
  createdAt: Date
  updatedAt: Date
  machinery?: Machinery
  renter?: User
  payment?: Payment
  review?: Review
}

export interface Payment {
  id: string
  bookingId: string
  amount: number
  status: PaymentStatus
  transactionId?: string | null
  paymentMethod?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Message {
  id: string
  senderId: string
  receiverId: string
  message: string
  read: boolean
  createdAt: Date
  sender?: User
  receiver?: User
}

export interface Review {
  id: string
  bookingId: string
  machineryId: string
  reviewerId: string
  revieweeId: string
  rating: number
  comment?: string | null
  response?: string | null
  createdAt: Date
  updatedAt: Date
  reviewer?: User
  reviewee?: User
  machinery?: Machinery
}

export interface MachineryWithDetails extends Machinery {
  owner: User
  reviews: Review[]
  averageRating?: number
}
