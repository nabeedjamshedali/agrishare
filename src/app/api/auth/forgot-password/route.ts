import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { randomBytes } from 'crypto'
import { retryDatabaseOperation } from '@/lib/db-retry'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Find user by email
    const user = await retryDatabaseOperation(
      () => prisma.users.findUnique({
        where: { email: email.toLowerCase() },
      }),
      { maxRetries: 3 }
    )

    // Always return success even if user doesn't exist (security best practice)
    if (!user) {
      return NextResponse.json({
        message: 'If an account exists with that email, we have sent password reset instructions.',
      })
    }

    // Generate reset token (valid for 1 hour)
    const resetToken = randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now

    // Store reset token in database
    await retryDatabaseOperation(
      () => prisma.users.update({
        where: { id: user.id },
        data: {
          reset_token: resetToken,
          reset_token_expiry: resetTokenExpiry,
        },
      }),
      { maxRetries: 3 }
    )

    // In a production environment, you would send an email here
    // For now, we'll just log the reset link
    const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`

    console.log('Password reset link:', resetUrl)
    console.log('This link will expire in 1 hour.')

    // TODO: Send email with reset link
    // Example using a hypothetical email service:
    // await sendEmail({
    //   to: user.email,
    //   subject: 'Reset your AgriShare password',
    //   html: `
    //     <p>You requested to reset your password.</p>
    //     <p>Click the link below to reset your password:</p>
    //     <a href="${resetUrl}">Reset Password</a>
    //     <p>This link will expire in 1 hour.</p>
    //     <p>If you didn't request this, please ignore this email.</p>
    //   `
    // })

    return NextResponse.json({
      message: 'If an account exists with that email, we have sent password reset instructions.',
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Failed to process request. Please try again.' },
      { status: 500 }
    )
  }
}
