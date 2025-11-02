import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { retryDatabaseOperation, DatabaseConnectionError } from '@/lib/db-retry'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const machinery = await retryDatabaseOperation(
      () =>
        prisma.machinery.findUnique({
          where: { id },
          include: {
            users: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                created_at: true,
              },
            },
          },
        }),
      { maxRetries: 3 }
    )

    if (!machinery) {
      return NextResponse.json(
        { error: 'Machinery not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(machinery)
  } catch (error: any) {
    console.error('Error fetching machinery:', error)

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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const updatedMachinery = await retryDatabaseOperation(
      () =>
        prisma.machinery.update({
          where: { id },
          data: {
            name: body.name,
            type: body.type,
            description: body.description,
            hourly_rate: body.hourly_rate,
            daily_rate: body.daily_rate,
            location: body.location,
            photos: body.photos,
            available: body.available,
          },
        }),
      { maxRetries: 3 }
    )

    return NextResponse.json(updatedMachinery)
  } catch (error: any) {
    console.error('Error updating machinery:', error)

    if (error instanceof DatabaseConnectionError) {
      return NextResponse.json(
        { error: 'Unable to connect to database. Please try again.' },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update machinery' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await retryDatabaseOperation(
      () =>
        prisma.machinery.delete({
          where: { id },
        }),
      { maxRetries: 3 }
    )

    return NextResponse.json({ message: 'Machinery deleted successfully' })
  } catch (error: any) {
    console.error('Error deleting machinery:', error)

    if (error instanceof DatabaseConnectionError) {
      return NextResponse.json(
        { error: 'Unable to connect to database. Please try again.' },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to delete machinery' },
      { status: 500 }
    )
  }
}
 
