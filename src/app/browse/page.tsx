'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'

interface Machinery {
  id: string
  name: string
  type: string
  description: string
  hourly_rate: number
  daily_rate: number
  location: string
  photos: string[]
  users: {
    name: string
    location: string
  }
}

export default function BrowsePage() {
  const { data: session } = useSession()
  const [machinery, setMachinery] = useState<Machinery[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filterType, setFilterType] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  // Redirect owners to dashboard
  useEffect(() => {
    if (session?.user?.role === 'OWNER') {
      window.location.href = '/dashboard'
    }
  }, [session])

  useEffect(() => {
    fetchMachinery()
  }, [])

  const fetchMachinery = async () => {
    try {
      const res = await fetch('/api/machinery')
      if (res.ok) {
        const data = await res.json()
        setMachinery(data)
      }
    } catch (error) {
      console.error('Failed to fetch machinery:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      TRACTOR: 'bg-green-100 text-green-700',
      HARVESTER: 'bg-orange-100 text-orange-700',
      SPRAYER: 'bg-blue-100 text-blue-700',
      PLANTER: 'bg-purple-100 text-purple-700',
      TILLER: 'bg-yellow-100 text-yellow-700',
      IRRIGATION: 'bg-cyan-100 text-cyan-700',
      OTHER: 'bg-gray-100 text-gray-700',
    }
    return colors[type] || colors.OTHER
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Discover Agricultural Machinery
          </h1>
          <p className="text-lg text-gray-600">
            Find the perfect equipment for your farming needs, from tractors to harvesters.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow p-6 sticky top-8">
              {/* View Options */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">View Options</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Grid View
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      viewMode === 'list'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    List View
                  </button>
                </div>
              </div>

              {/* Filter by Type */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Filter by Type</h3>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="All">All</option>
                  <option value="TRACTOR">Tractor</option>
                  <option value="HARVESTER">Harvester</option>
                  <option value="PLANTER">Planter</option>
                  <option value="SPRAYER">Sprayer</option>
                  <option value="TILLER">Tiller</option>
                  <option value="IRRIGATION">Irrigation</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              {/* Location */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Location</h3>
                <input
                  type="text"
                  placeholder="Enter location"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Price Range</h3>
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>$0</span>
                  <span>$500</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="500"
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                />
              </div>

              {/* Sort By */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Sort By</h3>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent">
                  <option>Nearest</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest First</option>
                </select>
              </div>

              <button className="w-full mt-6 px-4 py-2 text-sm text-green-600 hover:text-green-700 font-medium">
                Reset Filters
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search Bar */}
            <div className="mb-6 flex gap-4">
              <input
                type="text"
                placeholder="Search machinery..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <select className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                <option value="">All Types</option>
                <option value="TRACTOR">Tractor</option>
                <option value="HARVESTER">Harvester</option>
                <option value="PLANTER">Planter</option>
                <option value="SPRAYER">Sprayer</option>
                <option value="TILLER">Tiller</option>
                <option value="IRRIGATION">Irrigation</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Available Machinery</h2>
              <p className="text-sm text-gray-600">Showing {machinery.length} results</p>
            </div>

            {/* Machinery Grid */}
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
              </div>
            ) : machinery.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <p className="text-gray-600 text-lg mb-4">No machinery available at the moment.</p>
                {session?.user?.role === 'OWNER' && (
                  <Link
                    href="/machinery/new"
                    className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    List Your Machinery
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {machinery.map((item) => (
                  <Link key={item.id} href={`/machinery/${item.id}`} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden group">
                    <div className="relative h-48 bg-gray-200">
                      {item.photos[0] ? (
                        <Image
                          src={item.photos[0]}
                          alt={item.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="h-full flex items-center justify-center text-gray-400 text-5xl">
                          📷
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${getTypeColor(item.type)}`}>
                          {item.type}
                        </span>
                        <div className="flex items-center text-sm text-gray-600">
                          <svg className="w-4 h-4 mr-1 text-yellow-400 fill-current" viewBox="0 0 20 20">
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                          4.8
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-green-600 transition-colors">{item.name}</h3>
                      <p className="text-sm text-gray-600 mb-3 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {item.location}
                      </p>
                      <div className="flex items-baseline mb-4">
                        <span className="text-2xl font-bold text-green-600">${item.daily_rate}</span>
                        <span className="text-sm text-gray-600 ml-1">/daily</span>
                      </div>
                      {item.hourly_rate > 0 && (
                        <p className="text-sm text-gray-600 mb-4">
                          ${item.hourly_rate}/hourly
                        </p>
                      )}
                      <div className="w-full px-4 py-2 bg-green-600 text-white rounded-lg group-hover:bg-green-700 transition-colors font-medium text-center">
                        View Details
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination */}
            {machinery.length > 0 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center gap-2">
                  <button className="px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100">
                    &larr;
                  </button>
                  <button className="px-4 py-2 rounded-md bg-green-600 text-white">1</button>
                  <button className="px-4 py-2 rounded-md text-gray-600 hover:bg-gray-100">2</button>
                  <button className="px-4 py-2 rounded-md text-gray-600 hover:bg-gray-100">3</button>
                  <button className="px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100">
                    &rarr;
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
