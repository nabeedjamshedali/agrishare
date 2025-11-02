import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { retryDatabaseOperation, DatabaseConnectionError } from '@/lib/db-retry'

/**
 * GET /api/chat/messages?userId=xxx
 * Fetch all messages between current user and another user
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const otherUserId = searchParams.get('userId')

    if (!otherUserId) {
      return NextResponse.json(
        { error: 'userId parameter is required' },
        { status: 400 }
      )
    }

    // Fetch all messages between the two users
    const messages = await retryDatabaseOperation(
      () =>
        prisma.chat.findMany({
          where: {
            OR: [
              {
                sender_id: session.user.id,
                receiver_id: otherUserId,
              },
              {
                sender_id: otherUserId,
                receiver_id: session.user.id,
              },
            ],
          },
          include: {
            users_chat_sender_idTousers: {
              select: {
                id: true,
                name: true,
                role: true,
              },
            },
            users_chat_receiver_idTousers: {
              select: {
                id: true,
                name: true,
                role: true,
              },
            },
          },
          orderBy: {
            timestamp: 'asc',
          },
        }),
      { maxRetries: 3 }
    )

    // Mark messages as read where current user is the receiver
    await retryDatabaseOperation(
      () =>
        prisma.chat.updateMany({
          where: {
            sender_id: otherUserId,
            receiver_id: session.user.id,
            is_read: false,
          },
          data: {
            is_read: true,
          },
        }),
      { maxRetries: 3 }
    )

    return NextResponse.json(messages)
  } catch (error: any) {
    console.error('Error fetching messages:', error)

    if (error instanceof DatabaseConnectionError) {
      return NextResponse.json(
        { error: 'Unable to connect to database. Please try again.' },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/chat/messages
 * Send a new message
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { receiverId, message, machineryId } = body

    if (!receiverId || !message) {
      return NextResponse.json(
        { error: 'receiverId and message are required' },
        { status: 400 }
      )
    }

    // Create new message
    const newMessage = await retryDatabaseOperation(
      () =>
        prisma.chat.create({
          data: {
            sender_id: session.user.id,
            receiver_id: receiverId,
            message,
            machinery_id: machineryId || null,
            booking_id: null,
            is_read: false,
          },
          include: {
            users_chat_sender_idTousers: {
              select: {
                id: true,
                name: true,
                role: true,
              },
            },
            users_chat_receiver_idTousers: {
              select: {
                id: true,
                name: true,
                role: true,
              },
            },
          },
        }),
      { maxRetries: 3 }
    )

    return NextResponse.json(newMessage)
  } catch (error: any) {
    console.error('Error sending message:', error)

    if (error instanceof DatabaseConnectionError) {
      return NextResponse.json(
        { error: 'Unable to connect to database. Please try again.' },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
