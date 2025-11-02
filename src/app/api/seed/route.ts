import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST() {
  try {
    // Create owner user
    const hashedPassword = await bcrypt.hash('password123', 12)

    let owner = await prisma.users.findUnique({
      where: { email: 'owner@agrishare.com' }
    })

    if (!owner) {
      owner = await prisma.users.create({
        data: {
          email: 'owner@agrishare.com',
          name: 'Farmer Bob',
          password: hashedPassword,
          phone: '+1 (555) 123-4567',
          location: 'Springfield, IL',
          role: 'OWNER',
        },
      })
    }

    // Sample machinery data
    const machineryData = [
      {
        name: 'John Deere 6155R',
        type: 'TRACTOR',
        description: 'A powerful and versatile John Deere 6155R tractor, perfect for a wide range of agricultural tasks from plowing and tilling to planting and harvesting.',
        hourly_rate: 85,
        daily_rate: 500,
        location: 'Springfield, IL',
        photos: ['https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80'],
        available: true,
        owner_id: owner.id,
      },
      {
        name: 'Case IH Axial-Flow 7150',
        type: 'HARVESTER',
        description: 'High-capacity combine harvester with advanced grain handling system.',
        hourly_rate: 180,
        daily_rate: 1200,
        location: 'Fairview, IA',
        photos: ['https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&q=80'],
        available: true,
        owner_id: owner.id,
      },
      {
        name: 'Kubota M7-171',
        type: 'SPRAYER',
        description: 'Professional-grade sprayer with precision application technology.',
        hourly_rate: 60,
        daily_rate: 400,
        location: 'Green Valley, MO',
        photos: ['https://images.unsplash.com/photo-1589395937011-0e6d9f2b479b?w=800&q=80'],
        available: true,
        owner_id: owner.id,
      },
      {
        name: 'Fendt 1050 Vario',
        type: 'OTHER',
        description: 'Premium high-horsepower tractor with continuously variable transmission.',
        hourly_rate: 120,
        daily_rate: 850,
        location: 'Rural Plains, KS',
        photos: ['https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80'],
        available: true,
        owner_id: owner.id,
      },
      {
        name: 'Claas Lexion 760',
        type: 'HARVESTER',
        description: 'State-of-the-art combine harvester with intelligent automation.',
        hourly_rate: 70,
        daily_rate: 500,
        location: 'Willow Creek, NE',
        photos: ['https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800&q=80'],
        available: true,
        owner_id: owner.id,
      },
      {
        name: 'New Holland T8.435',
        type: 'TRACTOR',
        description: 'Powerful 435 HP tractor with advanced hydraulic system.',
        hourly_rate: 90,
        daily_rate: 650,
        location: 'Farmdale, MN',
        photos: ['https://images.unsplash.com/photo-1527788263495-3518a5c1c42d?w=800&q=80'],
        available: true,
        owner_id: owner.id,
      },
      {
        name: 'Massey Ferguson IDEAL 9T',
        type: 'HARVESTER',
        description: 'Advanced combine with hybrid technology for superior grain quality.',
        hourly_rate: 200,
        daily_rate: 1400,
        location: 'Harvestland, WI',
        photos: ['https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?w=800&q=80'],
        available: true,
        owner_id: owner.id,
      },
      {
        name: 'Vaderstad Carrier 420',
        type: 'TILLER',
        description: 'High-performance cultivator for seedbed preparation.',
        hourly_rate: 55,
        daily_rate: 380,
        location: 'Sunny Acres, ND',
        photos: ['https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800&q=80'],
        available: true,
        owner_id: owner.id,
      },
    ]

    const created = []
    for (const data of machineryData) {
      const machinery = await prisma.machinery.create({ data })
      created.push(machinery.name)
    }

    return NextResponse.json({
      success: true,
      message: `Created ${created.length} machinery items`,
      items: created,
    })
  } catch (error: any) {
    console.error('Seed error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to seed database' },
      { status: 500 }
    )
  }
}
