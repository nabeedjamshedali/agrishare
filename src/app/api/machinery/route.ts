import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { retryDatabaseOperation, DatabaseConnectionError } from '@/lib/db-retry'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const ownerId = searchParams.get('owner_id')

    // Build query based on parameters
    const whereClause: any = {}

    if (ownerId) {
      // Fetch all machinery for specific owner (including unavailable)
      whereClause.owner_id = ownerId
    } else {
      // Fetch only available machinery for browse page
      whereClause.available = true
    }

    const machinery = await retryDatabaseOperation(
      () =>
        prisma.machinery.findMany({
          where: whereClause,
          include: {
            users: {
              select: {
                name: true,
                location: true,
              },
            },
          },
          orderBy: {
            created_at: 'desc',
          },
        }),
      { maxRetries: 3 }
    )

    return NextResponse.json(machinery)
  } catch (error: any) {
    console.error('Failed to fetch machinery:', error)

    if (error instanceof DatabaseConnectionError) {
      return NextResponse.json(
        { error: 'Unable to connect to database. Please try again.' },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to fetch machinery' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'OWNER') {
      return NextResponse.json(
        { error: 'Only owners can list machinery' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const {
      name,
      type,
      description,
      hourly_rate,
      daily_rate,
      location,
      photos,
      available,
      owner_id,
    } = body

    // Validate required fields
    if (!name || !type || !daily_rate || !location) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Ensure owner_id matches session user
    if (owner_id !== session.user.id) {
      return NextResponse.json(
        { error: 'Invalid owner ID' },
        { status: 403 }
      )
    }

    // Create machinery with retry logic
    const machinery = await retryDatabaseOperation(
      () =>
        prisma.machinery.create({
          data: {
            name,
            type,
            description: description || '',
            hourly_rate: hourly_rate ? Number.parseFloat(hourly_rate) : 0,
            daily_rate: Number.parseFloat(daily_rate),
            location,
            photos: photos || [],
            available: available !== false,
            owner_id,
          },
          include: {
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

    return NextResponse.json(machinery, { status: 201 })
  } catch (error: any) {
    console.error('Error creating machinery:', error)

    if (error instanceof DatabaseConnectionError) {
      return NextResponse.json(
        { error: 'Unable to connect to database. Please try again.' },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create machinery' },
      { status: 500 }
    )
  }
}
