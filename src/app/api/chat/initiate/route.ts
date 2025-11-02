import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { retryDatabaseOperation, DatabaseConnectionError } from '@/lib/db-retry'

/**
 * POST /api/chat/initiate
 * Initialize a chat between renter and machinery owner
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { receiverId, machineryId } = body

    if (!receiverId) {
      return NextResponse.json(
        { error: 'Receiver ID is required' },
        { status: 400 }
      )
    }

    // Check if users exist
    const [sender, receiver] = await Promise.all([
      retryDatabaseOperation(
        () => prisma.users.findUnique({ where: { id: session.user.id } }),
        { maxRetries: 3 }
      ),
      retryDatabaseOperation(
        () => prisma.users.findUnique({ where: { id: receiverId } }),
        { maxRetries: 3 }
      ),
    ])

    if (!sender || !receiver) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if a chat already exists between these users
    const existingChat = await retryDatabaseOperation(
      () =>
        prisma.chat.findFirst({
          where: {
            OR: [
              {
                sender_id: session.user.id,
                receiver_id: receiverId,
              },
              {
                sender_id: receiverId,
                receiver_id: session.user.id,
              },
            ],
            ...(machineryId && { machinery_id: machineryId }),
          },
          orderBy: {
            timestamp: 'desc',
          },
        }),
      { maxRetries: 3 }
    )

    if (existingChat) {
      // Chat already exists, return the conversation info
      return NextResponse.json({
        chatId: existingChat.id,
        senderId: existingChat.sender_id,
        receiverId: existingChat.receiver_id,
        message: 'Chat already exists',
        existing: true,
      })
    }

    // Create initial chat message
    const initialMessage = machineryId
      ? `Hi, I'm interested in your machinery.`
      : `Hi, I'd like to connect with you.`

    const newChat = await retryDatabaseOperation(
      () =>
        prisma.chat.create({
          data: {
            sender_id: session.user.id,
            receiver_id: receiverId,
            message: initialMessage,
            machinery_id: machineryId || null,
            booking_id: null,
            is_read: false,
          },
        }),
      { maxRetries: 3 }
    )

    return NextResponse.json({
      chatId: newChat.id,
      senderId: newChat.sender_id,
      receiverId: newChat.receiver_id,
      message: 'Chat initiated successfully',
      existing: false,
    })
  } catch (error: any) {
    console.error('Error initiating chat:', error)

    if (error instanceof DatabaseConnectionError) {
      return NextResponse.json(
        { error: 'Unable to connect to database. Please try again.' },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to initiate chat' },
      { status: 500 }
    )
  }
}
