import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { retryDatabaseOperation, DatabaseConnectionError } from '@/lib/db-retry'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { machinery_id, start_time, end_time, total_price } = body

    // Validate required fields
    if (!machinery_id || !start_time || !end_time || !total_price) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if machinery exists and is available with retry
    const machinery = await retryDatabaseOperation(
      () =>
        prisma.machinery.findUnique({
          where: { id: machinery_id },
        }),
      { maxRetries: 3 }
    )

    if (!machinery) {
      return NextResponse.json(
        { error: 'Machinery not found' },
        { status: 404 }
      )
    }

    if (!machinery.available) {
      return NextResponse.json(
        { error: 'Machinery is not available' },
        { status: 400 }
      )
    }

    // Check for booking conflicts with retry
    const conflictingBooking = await retryDatabaseOperation(
      () =>
        prisma.bookings.findFirst({
          where: {
            machinery_id,
            status: {
              in: ['PENDING', 'CONFIRMED'],
            },
            OR: [
              {
                AND: [
                  { start_time: { lte: new Date(start_time) } },
                  { end_time: { gte: new Date(start_time) } },
                ],
              },
              {
                AND: [
                  { start_time: { lte: new Date(end_time) } },
                  { end_time: { gte: new Date(end_time) } },
                ],
              },
              {
                AND: [
                  { start_time: { gte: new Date(start_time) } },
                  { end_time: { lte: new Date(end_time) } },
                ],
              },
            ],
          },
        }),
      { maxRetries: 3 }
    )

    if (conflictingBooking) {
      return NextResponse.json(
        { error: 'Machinery is already booked for the selected dates' },
        { status: 400 }
      )
    }

    // Create the booking with retry
    const booking = await retryDatabaseOperation(
      () =>
        prisma.bookings.create({
          data: {
            machinery_id,
            renter_id: session.user.id,
            start_time: new Date(start_time),
            end_time: new Date(end_time),
            total_price: Number.parseFloat(total_price),
            status: 'PENDING',
          },
          include: {
            machinery: true,
            users: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        }),
      { maxRetries: 3 }
    )

    return NextResponse.json(booking, { status: 201 })
  } catch (error: any) {
    console.error('Error creating booking:', error)

    if (error instanceof DatabaseConnectionError) {
      return NextResponse.json(
        { error: 'Unable to connect to database. Please try again.' },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const userRole = searchParams.get('role') // 'renter' or 'owner'

    let bookings

    if (userRole === 'owner') {
      // Get bookings for machinery owned by this user with retry
      bookings = await retryDatabaseOperation(
        () =>
          prisma.bookings.findMany({
            where: {
              machinery: {
                owner_id: session.user.id,
              },
            },
            include: {
              machinery: true,
              users: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  phone: true,
                },
              },
            },
            orderBy: {
              created_at: 'desc',
            },
          }),
        { maxRetries: 3 }
      )
    } else {
      // Get bookings made by this user with retry
      bookings = await retryDatabaseOperation(
        () =>
          prisma.bookings.findMany({
            where: {
              renter_id: session.user.id,
            },
            include: {
              machinery: {
                include: {
                  users: {
                    select: {
                      id: true,
                      name: true,
                      email: true,
                      phone: true,
                    },
                  },
                },
              },
            },
            orderBy: {
              created_at: 'desc',
            },
          }),
        { maxRetries: 3 }
      )
    }

    return NextResponse.json(bookings)
  } catch (error: any) {
    console.error('Error fetching bookings:', error)

    if (error instanceof DatabaseConnectionError) {
      return NextResponse.json(
        { error: 'Unable to connect to database. Please try again.' },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}
 
