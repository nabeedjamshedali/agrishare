import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { retryDatabaseOperation, DatabaseConnectionError } from '@/lib/db-retry'

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

    // Users can only update their own profile
    if (session.user.id !== id) {
      return NextResponse.json(
        { error: 'Forbidden: You can only update your own profile' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { name, phone, location } = body

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    // Update user with retry logic
    const updatedUser = await retryDatabaseOperation(
      () =>
        prisma.users.update({
          where: { id },
          data: {
            name,
            phone: phone || null,
            location: location || null,
          },
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            location: true,
            role: true,
            created_at: true,
          },
        }),
      { maxRetries: 3 }
    )

    return NextResponse.json(updatedUser)
  } catch (error: any) {
    console.error('Error updating user:', error)

    if (error instanceof DatabaseConnectionError) {
      return NextResponse.json(
        { error: 'Unable to connect to database. Please try again.' },
        { status: 503 }
      )
    }

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update user profile' },
      { status: 500 }
    )
  }
}
