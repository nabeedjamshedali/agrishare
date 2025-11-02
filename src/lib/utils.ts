import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export function formatTime(date: Date | string): string {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function calculateDuration(start: Date | string, end: Date | string): number {
  const startDate = new Date(start)
  const endDate = new Date(end)
  const hours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60)
  return Math.max(0, hours)
}

export function calculateBookingCost(
  startTime: Date | string,
  endTime: Date | string,
  hourlyRate?: number,
  dailyRate?: number
): number {
  const hours = calculateDuration(startTime, endTime)
  const days = Math.ceil(hours / 24)

  if (days >= 1 && dailyRate) {
    return days * dailyRate
  }

  if (hourlyRate) {
    return hours * hourlyRate
  }

  if (dailyRate) {
    return (hours / 24) * dailyRate
  }

  return 0
}
