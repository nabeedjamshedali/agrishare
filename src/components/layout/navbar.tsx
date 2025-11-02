'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Logo } from './logo'
import { Button } from '@/components/ui/button'
import { Home, Search, LayoutDashboard, MessageSquare, User } from 'lucide-react'

export function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Logo />

            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <Link
                href="/"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-[#52B445]"
              >
                <Home className="h-4 w-4 mr-1" />
                Home
              </Link>
              <Link
                href="/browse"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-[#52B445]"
              >
                <Search className="h-4 w-4 mr-1" />
                Browse Machinery
              </Link>
              {session && (
                <>
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-[#52B445]"
                  >
                    <LayoutDashboard className="h-4 w-4 mr-1" />
                    Dashboard
                  </Link>
                  <Link
                    href="/messages"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-[#52B445]"
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Messages
                  </Link>
                  <Link
                    href="/profile"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-[#52B445]"
                  >
                    <User className="h-4 w-4 mr-1" />
                    Profile
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <span className="text-sm text-gray-700">
                  Hi, {session.user?.name}
                </span>
                <Button variant="outline" onClick={() => signOut()}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/signin">
                  <Button variant="outline">Login</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
