import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { retryDatabaseOperation, DatabaseConnectionError } from '@/lib/db-retry'

/**
 * PUT /api/bookings/[id]/status
 * Update booking status (accept/reject)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { status } = body

    // Validate status
    if (!['CONFIRMED', 'CANCELLED'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be CONFIRMED or CANCELLED' },
        { status: 400 }
      )
    }

    // Get the booking with machinery info
    const booking = await retryDatabaseOperation(
      () =>
        prisma.bookings.findUnique({
          where: { id },
          include: {
            machinery: {
              select: {
                owner_id: true,
              },
            },
          },
        }),
      { maxRetries: 3 }
    )

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // Verify that the current user is the machinery owner
    if (booking.machinery.owner_id !== session.user.id) {
      return NextResponse.json(
        { error: 'Only the machinery owner can update booking status' },
        { status: 403 }
      )
    }

    // Verify booking is in PENDING status
    if (booking.status !== 'PENDING') {
      return NextResponse.json(
        { error: `Cannot update booking with status ${booking.status}` },
        { status: 400 }
      )
    }

    // Update the booking status
    const updatedBooking = await retryDatabaseOperation(
      () =>
        prisma.bookings.update({
          where: { id },
          data: { status },
          include: {
            machinery: {
              select: {
                id: true,
                name: true,
                type: true,
                photos: true,
                users: {
                  select: {
                    name: true,
                    email: true,
                  },
                },
              },
            },
            users: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        }),
      { maxRetries: 3 }
    )

    return NextResponse.json(updatedBooking)
  } catch (error: any) {
    console.error('Error updating booking status:', error)

    if (error instanceof DatabaseConnectionError) {
      return NextResponse.json(
        { error: 'Unable to connect to database. Please try again.' },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update booking status' },
      { status: 500 }
    )
  }
}
