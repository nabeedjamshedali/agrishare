import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { retryDatabaseOperation, DatabaseConnectionError } from '@/lib/db-retry'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Users can only view their own stats
    if (session.user.id !== id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Get user stats with retry logic
    const [machinery, bookings, totalEarnings] = await Promise.all([
      // Count machinery listings
      retryDatabaseOperation(
        () => prisma.machinery.count({ where: { owner_id: id } }),
        { maxRetries: 3 }
      ),
      // Count bookings
      retryDatabaseOperation(
        () => prisma.bookings.count({
          where: {
            machinery: { owner_id: id },
            status: { in: ['CONFIRMED', 'COMPLETED'] }
          }
        }),
        { maxRetries: 3 }
      ),
      // Calculate total earnings
      retryDatabaseOperation(
        () => prisma.bookings.aggregate({
          where: {
            machinery: { owner_id: id },
            status: 'COMPLETED'
          },
          _sum: {
            total_price: true
          }
        }),
        { maxRetries: 3 }
      ),
    ])

    // Get average rating
    const reviews = await retryDatabaseOperation(
      () => prisma.reviews.aggregate({
        where: {
          machinery: { owner_id: id }
        },
        _avg: {
          rating: true
        },
        _count: {
          rating: true
        }
      }),
      { maxRetries: 3 }
    )

    return NextResponse.json({
      machineryCount: machinery,
      bookingsCount: bookings,
      totalEarnings: totalEarnings._sum.total_price || 0,
      averageRating: reviews._avg.rating || 0,
      reviewsCount: reviews._count.rating || 0,
    })
  } catch (error: any) {
    console.error('Error fetching user stats:', error)

    if (error instanceof DatabaseConnectionError) {
      return NextResponse.json(
        { error: 'Unable to connect to database. Please try again.' },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to fetch user stats' },
      { status: 500 }
    )
  }
}
