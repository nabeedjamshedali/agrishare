'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send } from 'lucide-react'
import { formatTime } from '@/lib/utils'

interface Message {
  id: string
  senderId: string
  receiverId: string
  message: string
  read: boolean
  createdAt: Date
  sender?: {
    id: string
    name: string
    image?: string | null
  }
}

interface ChatBoxProps {
  bookingId: string
  currentUserId: string
  otherUserId: string
  otherUserName: string
}

/**
 * ChatBox Component
 * Real-time chat interface for booking-based conversations
 * Uses Supabase Realtime for instant message delivery
 */
export function ChatBox({
  bookingId,
  currentUserId,
  otherUserId,
  otherUserName,
}: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  // Auto-scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Fetch initial chat history
  useEffect(() => {
    fetchMessages()
  }, [bookingId])

  // Subscribe to real-time updates
  useEffect(() => {
    // Create a channel for this specific booking chat
    const channel = supabase
      .channel(`chat-booking-${bookingId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'Message',
          filter: `senderId=eq.${otherUserId},receiverId=eq.${currentUserId}`,
        },
        (payload) => {
          // Add new message to the chat when received
          const newMsg = payload.new as any
          setMessages((prev) => [
            ...prev,
            {
              id: newMsg.id,
              senderId: newMsg.senderId,
              receiverId: newMsg.receiverId,
              message: newMsg.message,
              read: newMsg.read,
              createdAt: new Date(newMsg.createdAt),
              sender: {
                id: otherUserId,
                name: otherUserName,
              },
            },
          ])

          // Mark message as read
          markAsRead(newMsg.id)
        }
      )
      .subscribe()

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel)
    }
  }, [bookingId, currentUserId, otherUserId])

  /**
   * Fetch chat history from API
   */
  const fetchMessages = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/messages?userId=${otherUserId}`)
      if (response.ok) {
        const data = await response.json()
        setMessages(data)
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Send a new message
   */
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newMessage.trim() || sending) return

    try {
      setSending(true)

      // Send message via API
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverId: otherUserId,
          message: newMessage.trim(),
        }),
      })

      if (response.ok) {
        const sentMessage = await response.json()

        // Add message to local state immediately
        setMessages((prev) => [
          ...prev,
          {
            ...sentMessage,
            createdAt: new Date(sentMessage.createdAt),
          },
        ])

        setNewMessage('')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message. Please try again.')
    } finally {
      setSending(false)
    }
  }

  /**
   * Mark received messages as read
   */
  const markAsRead = async (messageId: string) => {
    try {
      await fetch(`/api/messages/${messageId}/read`, {
        method: 'PATCH',
      })
    } catch (error) {
      console.error('Error marking message as read:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">Loading messages...</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">Chat with {otherUserName}</h3>
        <p className="text-sm text-gray-500">Booking Chat</p>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg) => {
            const isSentByMe = msg.senderId === currentUserId

            return (
              <div
                key={msg.id}
                className={`flex ${isSentByMe ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-2 ${
                    isSentByMe
                      ? 'bg-[#52B445] text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm break-words">{msg.message}</p>
                  <p
                    className={`text-xs mt-1 ${
                      isSentByMe ? 'text-green-100' : 'text-gray-500'
                    }`}
                  >
                    {formatTime(msg.createdAt)}
                  </p>
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={sending}
            className="flex-1"
          />
          <Button type="submit" disabled={!newMessage.trim() || sending}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}
