import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Create a sample owner user
  const hashedPassword = await bcrypt.hash('password123', 12)

  const owner = await prisma.users.upsert({
    where: { email: 'owner@agrishare.com' },
    update: {},
    create: {
      email: 'owner@agrishare.com',
      name: 'Farmer Bob',
      password: hashedPassword,
      phone: '+1 (555) 123-4567',
      location: 'Springfield, IL',
      role: 'OWNER',
    },
  })

  console.log('Created owner:', owner.email)

  // Sample machinery data with real image URLs
  const machineryData = [
    {
      name: 'John Deere 6155R',
      type: 'TRACTOR',
      description: 'A powerful and versatile John Deere 6155R tractor, perfect for a wide range of agricultural tasks from plowing and tilling to planting and harvesting. Equipped with advanced GPS guidance and comfortable cabin.',
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
      description: 'High-capacity combine harvester with advanced grain handling system. Perfect for large-scale harvesting operations with minimal grain loss.',
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
      description: 'Professional-grade sprayer with precision application technology. Ideal for crop protection and fertilizer application.',
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
      description: 'Premium high-horsepower tractor with continuously variable transmission. Excellent for heavy-duty field work.',
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
      description: 'State-of-the-art combine harvester with intelligent automation. Maximum efficiency for grain harvesting.',
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
      description: 'Powerful 435 HP tractor with advanced hydraulic system. Perfect for demanding agricultural applications.',
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
      description: 'Advanced combine with hybrid technology for superior grain quality and fuel efficiency.',
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
      description: 'High-performance cultivator for seedbed preparation. Creates optimal soil structure for planting.',
      hourly_rate: 55,
      daily_rate: 380,
      location: 'Sunny Acres, ND',
      photos: ['https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800&q=80'],
      available: true,
      owner_id: owner.id,
    },
  ]

  for (const machinery of machineryData) {
    const created = await prisma.machinery.create({
      data: machinery,
    })
    console.log('Created machinery:', created.name)
  }

  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
