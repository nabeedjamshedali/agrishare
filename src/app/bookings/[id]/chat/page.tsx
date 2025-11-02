import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { ChatBox } from '@/components/chat/ChatBox'

/**
 * Booking Chat Page
 * Displays real-time chat interface for a specific booking
 * Allows owners and renters to communicate about the booking
 */
export default async function BookingChatPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/auth/signin')
  }

  // Fetch booking details with machinery and users
  const booking = await prisma.booking.findUnique({
    where: { id: params.id },
    include: {
      machinery: {
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
      renter: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  })

  if (!booking) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Booking not found</h1>
          <p className="mt-2 text-gray-600">The booking you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  const currentUserId = (session.user as any).id

  // Verify user is part of this booking
  if (
    booking.renterId !== currentUserId &&
    booking.machinery.ownerId !== currentUserId
  ) {
    redirect('/dashboard')
  }

  // Determine the other user in the conversation
  const isRenter = booking.renterId === currentUserId
  const otherUser = isRenter ? booking.machinery.owner : booking.renter
  const otherUserId = isRenter ? booking.machinery.ownerId : booking.renterId

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Booking Info Header */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
        <h1 className="text-xl font-bold text-gray-900 mb-2">
          {booking.machinery.name}
        </h1>
        <div className="text-sm text-gray-600 space-y-1">
          <p>
            <span className="font-medium">Booking ID:</span> {booking.id.slice(0, 8)}...
          </p>
          <p>
            <span className="font-medium">Status:</span>{' '}
            <span
              className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                booking.status === 'APPROVED'
                  ? 'bg-green-100 text-green-800'
                  : booking.status === 'PENDING'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {booking.status}
            </span>
          </p>
          <p>
            <span className="font-medium">Period:</span>{' '}
            {new Date(booking.startTime).toLocaleDateString()} -{' '}
            {new Date(booking.endTime).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="h-[600px]">
        <ChatBox
          bookingId={booking.id}
          currentUserId={currentUserId}
          otherUserId={otherUserId}
          otherUserName={otherUser.name}
        />
      </div>
    </div>
  )
}
