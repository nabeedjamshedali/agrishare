import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { retryDatabaseOperation, DatabaseConnectionError } from '@/lib/db-retry'

/**
 * GET /api/chat/conversations
 * Fetch all conversations for the current user
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all unique conversations for this user
    const conversations = await retryDatabaseOperation(
      () =>
        prisma.$queryRaw`
          SELECT DISTINCT ON (conversation_user_id)
            c.id,
            c.message,
            c.timestamp,
            c.is_read,
            c.sender_id,
            c.receiver_id,
            c.machinery_id,
            CASE
              WHEN c.sender_id = ${session.user.id}::uuid THEN c.receiver_id
              ELSE c.sender_id
            END as conversation_user_id,
            u.name as other_user_name,
            u.role as other_user_role
          FROM chat c
          INNER JOIN users u ON (
            CASE
              WHEN c.sender_id = ${session.user.id}::uuid THEN c.receiver_id = u.id
              ELSE c.sender_id = u.id
            END
          )
          WHERE c.sender_id = ${session.user.id}::uuid OR c.receiver_id = ${session.user.id}::uuid
          ORDER BY conversation_user_id, c.timestamp DESC
        `,
      { maxRetries: 3 }
    )

    return NextResponse.json(conversations)
  } catch (error: any) {
    console.error('Error fetching conversations:', error)

    if (error instanceof DatabaseConnectionError) {
      return NextResponse.json(
        { error: 'Unable to connect to database. Please try again.' },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    )
  }
}
