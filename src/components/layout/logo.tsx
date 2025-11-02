import Link from 'next/link'
import { Tractor } from 'lucide-react'

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`}>
      <div className="bg-[#52B445] p-2 rounded-lg">
        <Tractor className="h-6 w-6 text-white" />
      </div>
      <span className="text-xl font-bold text-[#52B445]">AgriShare</span>
    </Link>
  )
}
