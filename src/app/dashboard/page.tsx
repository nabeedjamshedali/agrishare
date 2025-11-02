'use client'

import { redirect } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Booking {
  id: string
  start_time: string
  end_time: string
  total_price: number
  status: string
  machinery: {
    id: string
    name: string
    type: string
    photos: string[]
    users?: {
      name: string
      email: string
    }
  }
  users?: {
    name: string
    email: string
  }
}

interface Machinery {
  id: string
  name: string
  type: string
  daily_rate: number
  available: boolean
  photos: string[]
  location: string
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [machinery, setMachinery] = useState<Machinery[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session) {
      fetchData()
    }
  }, [session])

  const fetchData = async () => {
    try {
      if (session?.user?.role === 'OWNER') {
        // Fetch machinery owned by this user (including unavailable items)
        const machineryRes = await fetch(`/api/machinery?owner_id=${session.user.id}`)
        if (machineryRes.ok) {
          const data = await machineryRes.json()
          setMachinery(data)
        }

        // Fetch bookings for owned machinery
        const bookingsRes = await fetch('/api/bookings?role=owner')
        if (bookingsRes.ok) {
          const data = await bookingsRes.json()
          setBookings(data)
        }
      } else {
        // Fetch bookings made by this user
        const bookingsRes = await fetch('/api/bookings?role=renter')
        if (bookingsRes.ok) {
          const data = await bookingsRes.json()
          setBookings(data)
        }
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (!session) {
    redirect('/auth/signin')
  }

  const userName = session.user?.name?.split(' ')[0] || 'User'
  const activeBookings = bookings.filter(
    (b) => b.status === 'CONFIRMED' || b.status === 'PENDING'
  )
  const totalSpent = bookings
    .filter((b) => b.status === 'CONFIRMED')
    .reduce((sum, b) => sum + b.total_price, 0)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back, {userName}!</h1>
          <p className="text-gray-600 mt-1">Here's an overview of your bookings and activities.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">
                {session.user.role === 'OWNER' ? 'Listed Machinery' : 'Current Bookings'}
              </h3>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {loading ? '...' : session.user.role === 'OWNER' ? machinery.length : activeBookings.length}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {session.user.role === 'OWNER' ? 'Total items' : 'Active rentals'}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Total {session.user.role === 'OWNER' ? 'Earned' : 'Spent'}</h3>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">${loading ? '...' : totalSpent.toFixed(2)}</p>
            <p className="text-sm text-gray-500 mt-1">All time</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Unread Messages</h3>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">0</p>
            <p className="text-sm text-gray-500 mt-1">New conversations</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Pending Requests</h3>
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {loading ? '...' : bookings.filter((b) => b.status === 'PENDING').length}
            </p>
            <p className="text-sm text-gray-500 mt-1">Awaiting action</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Current Bookings or Machinery */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  {session.user.role === 'OWNER' ? 'Your Machinery Listings' : 'Current Bookings'}
                </h2>
                <p className="text-sm text-gray-600">
                  {session.user.role === 'OWNER'
                    ? 'Manage your listed machinery and view booking requests.'
                    : 'Your active and upcoming machinery rentals.'}
                </p>
              </div>
              <div className="p-6">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                  </div>
                ) : session.user.role === 'OWNER' ? (
                  machinery.length === 0 ? (
                    <div className="text-center py-12">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No machinery listed</h3>
                      <p className="mt-1 text-sm text-gray-500">Get started by listing your machinery.</p>
                      <div className="mt-6">
                        <Link
                          href="/machinery/add"
                          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                        >
                          List Machinery
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {machinery.map((item) => (
                        <Link
                          key={item.id}
                          href={`/machinery/${item.id}`}
                          className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:border-green-500 transition-colors"
                        >
                          <div className="relative w-20 h-20 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden">
                            {item.photos[0] && (
                              <Image src={item.photos[0]} alt={item.name} fill className="object-cover" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-sm font-semibold text-gray-900">{item.name}</h3>
                            <p className="text-sm text-gray-600">{item.type}</p>
                            <p className="text-sm text-gray-600">{item.location}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-green-600">${item.daily_rate}/day</p>
                            <p className={`text-sm ${item.available ? 'text-green-600' : 'text-red-600'}`}>
                              {item.available ? 'Available' : 'Unavailable'}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )
                ) : activeBookings.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No active bookings</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by browsing available machinery.</p>
                    <div className="mt-6">
                      <Link
                        href="/browse"
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                      >
                        Browse Machinery
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
                      >
                        <div className="relative w-20 h-20 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden">
                          {booking.machinery.photos[0] && (
                            <Image
                              src={booking.machinery.photos[0]}
                              alt={booking.machinery.name}
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-gray-900">{booking.machinery.name}</h3>
                          <p className="text-sm text-gray-600">
                            {new Date(booking.start_time).toLocaleDateString()} -{' '}
                            {new Date(booking.end_time).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-600">
                            Owner: {booking.machinery.users?.name}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">${booking.total_price}</p>
                          <span
                            className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                              booking.status === 'CONFIRMED'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {booking.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Messages */}
            <div className="bg-white rounded-lg shadow mb-6">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                  <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                </svg>
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-600 mb-4">
                  You have <span className="font-semibold text-green-600">0 unread message(s)</span>. Keep
                  conversations going to ensure smooth rentals.
                </p>
                <Link
                  href="/messages"
                  className="inline-flex items-center justify-center w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                >
                  Go to Messages
                </Link>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
              </div>
              <div className="p-6 space-y-3">
                {session.user.role === 'OWNER' ? (
                  <>
                    <Link
                      href="/machinery/add"
                      className="block w-full px-4 py-2 text-center border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      List New Machinery
                    </Link>
                    <Link
                      href="/profile"
                      className="block w-full px-4 py-2 text-center border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Edit Profile
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/browse"
                      className="block w-full px-4 py-2 text-center border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Browse Machinery
                    </Link>
                    <Link
                      href="/profile"
                      className="block w-full px-4 py-2 text-center border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Edit Profile
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
