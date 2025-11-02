import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Create a sample owner user
  const hashedPassword = await bcrypt.hash('password123', 12)

  const owner = await prisma.users.upsert({
    where: { email: 'owner@agrishare.pk' },
    update: {},
    create: {
      email: 'owner@agrishare.pk',
      name: 'Ahmed Khan',
      password: hashedPassword,
      phone: '+92 300 1234567',
      location: 'Faisalabad, Punjab',
      role: 'OWNER',
    },
  })

  console.log('Created owner:', owner.email)

  // Sample machinery data with Pakistani locations and new images
  const machineryData = [
    // TRACTORS
    {
      name: 'John Deere 5075E Tractor',
      type: 'TRACTOR',
      description: 'Powerful 75HP tractor perfect for heavy-duty farming operations. Well-maintained and reliable for all your agricultural needs.',
      hourly_rate: 1200,
      daily_rate: 8000,
      location: 'Faisalabad, Punjab',
      photos: [
        'https://images.unsplash.com/photo-1594771804886-a933bb2d609b?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=882',
        'https://plus.unsplash.com/premium_photo-1661939617052-1b97618f04bd?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=870',
      ],
      available: true,
      owner_id: owner.id,
    },
    {
      name: 'Massey Ferguson 240 Tractor',
      type: 'TRACTOR',
      description: '50HP compact tractor ideal for small to medium-sized farms. Fuel-efficient and easy to operate.',
      hourly_rate: 1000,
      daily_rate: 6500,
      location: 'Multan, Punjab',
      photos: [
        'https://plus.unsplash.com/premium_photo-1661854717339-04b1b5a89b12?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=876',
        'https://images.unsplash.com/photo-1718470822407-f347f8a17798?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=870',
      ],
      available: true,
      owner_id: owner.id,
    },

    // HARVESTERS
    {
      name: 'Combine Harvester - New Holland CR9090',
      type: 'HARVESTER',
      description: 'High-capacity combine harvester for wheat, rice, and corn. Saves time and labor during harvest season.',
      hourly_rate: 2500,
      daily_rate: 15000,
      location: 'Sahiwal, Punjab',
      photos: [
        'https://images.unsplash.com/photo-1635174815612-fd9636f70146?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=812',
        'https://images.unsplash.com/photo-1507311036505-05669fc503cb?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=929',
      ],
      available: true,
      owner_id: owner.id,
    },
    {
      name: 'Rice Harvester - Kubota DC-70',
      type: 'HARVESTER',
      description: 'Specialized rice harvester with excellent cutting and threshing performance. Perfect for paddy fields.',
      hourly_rate: 2000,
      daily_rate: 12000,
      location: 'Gujranwala, Punjab',
      photos: [
        'https://images.unsplash.com/photo-1565647952915-9644fcd446a4?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=870',
        'https://images.unsplash.com/photo-1613062500018-7b2515c9c40b?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=870',
      ],
      available: true,
      owner_id: owner.id,
    },

    // SPRAYERS
    {
      name: 'Agricultural Boom Sprayer',
      type: 'SPRAYER',
      description: 'Tractor-mounted boom sprayer for efficient pesticide and fertilizer application. 400L tank capacity.',
      hourly_rate: 700,
      daily_rate: 4500,
      location: 'Lahore, Punjab',
      photos: [
        'https://plus.unsplash.com/premium_photo-1663047583639-99431ce17d76?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=870',
        'https://images.unsplash.com/photo-1739283487615-756b7290f7fb?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=870',
      ],
      available: true,
      owner_id: owner.id,
    },
    {
      name: 'Backpack Sprayer - Motorized',
      type: 'SPRAYER',
      description: 'Motorized backpack sprayer for small farms and orchards. Easy to use and maintain.',
      hourly_rate: 300,
      daily_rate: 1500,
      location: 'Sialkot, Punjab',
      photos: [
        'https://media.istockphoto.com/id/958953510/photo/agricultural-worker-takes-care-of-his-estate.jpg?s=1024x1024',
      ],
      available: true,
      owner_id: owner.id,
    },

    // TILLERS
    {
      name: 'Rotary Tiller - Heavy Duty',
      type: 'TILLER',
      description: 'Heavy-duty rotary tiller for primary and secondary tillage. 6-foot working width.',
      hourly_rate: 800,
      daily_rate: 5000,
      location: 'Sheikhupura, Punjab',
      photos: [
        'https://plus.unsplash.com/premium_photo-1661934039679-9c893f091ddd?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=870',
        'https://media.istockphoto.com/id/2173867290/photo/rear-view-of-a-large-tractor-with-a-disk-harrow-plow-standing-in-a-field-start-tillage-after.jpg?s=1024x1024',
      ],
      available: true,
      owner_id: owner.id,
    },
    {
      name: 'Disc Harrow Plow',
      type: 'TILLER',
      description: 'Efficient disc harrow for breaking up and leveling soil. Ideal for preparing seedbeds.',
      hourly_rate: 650,
      daily_rate: 4000,
      location: 'Kasur, Punjab',
      photos: [
        'https://media.istockphoto.com/id/692910418/photo/tractor-on-the-field.jpg?s=1024x1024',
      ],
      available: true,
      owner_id: owner.id,
    },

    // IRRIGATION SYSTEMS
    {
      name: 'Drip Irrigation System - 5 Acre',
      type: 'IRRIGATION',
      description: 'Complete drip irrigation system for 5 acres. Water-efficient and perfect for vegetable farming.',
      hourly_rate: 0,
      daily_rate: 3500,
      location: 'Okara, Punjab',
      photos: [
        'https://plus.unsplash.com/premium_photo-1661825536186-19606cd9a0f1?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=419',
        'https://media.istockphoto.com/id/2163202636/photo/multiple-automatic-sprinklers-watering-the-lush-green-lawn-on-a-sunny-day.jpg?s=1024x1024',
      ],
      available: true,
      owner_id: owner.id,
    },

    // WATER PUMPS (OTHER category)
    {
      name: 'Diesel Water Pump - 3 inch',
      type: 'OTHER',
      description: 'Powerful 3-inch diesel water pump for irrigation. Reliable and fuel-efficient.',
      hourly_rate: 400,
      daily_rate: 2500,
      location: 'Jhang, Punjab',
      photos: [
        'https://images.unsplash.com/photo-1696371269814-ae41fc67cf03?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=387',
        'https://images.unsplash.com/photo-1700318092011-6e4666e94ab5?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=580',
      ],
      available: true,
      owner_id: owner.id,
    },

    // TROLLEYS (OTHER category)
    {
      name: 'Tractor Trolley - 100 Mound Capacity',
      type: 'OTHER',
      description: 'Heavy-duty tractor trolley for transporting crops and materials. 100 mound (4 ton) capacity.',
      hourly_rate: 350,
      daily_rate: 2000,
      location: 'Khanewal, Punjab',
      photos: [
        'https://thumbs.dreamstime.com/z/indian-tractor-trolley-green-grass-156278323.jpg',
        'https://thumbs.dreamstime.com/z/carrying-grains-packed-sacks-tractor-trolley-india-indian-rural-village-life-carrying-grains-packed-sacks-tractor-340448557.jpg',
      ],
      available: true,
      owner_id: owner.id,
    },
    {
      name: 'Agricultural Trolley - 50 Mound',
      type: 'OTHER',
      description: 'Medium-sized trolley perfect for harvesting and transport. Well-maintained.',
      hourly_rate: 250,
      daily_rate: 1500,
      location: 'Vehari, Punjab',
      photos: [
        'https://thumbs.dreamstime.com/z/tractors-trolleys-play-very-important-role-harvesting-cutting-cereals-grains-vegetables-tractor-trolley-113820060.jpg',
      ],
      available: true,
      owner_id: owner.id,
    },

    // PLANTERS
    {
      name: 'Seed Drill Planter - 12 Row',
      type: 'PLANTER',
      description: '12-row precision seed drill for wheat, corn, and other crops. Ensures uniform spacing and depth.',
      hourly_rate: 900,
      daily_rate: 5500,
      location: 'Bahawalnagar, Punjab',
      photos: [
        'https://images.unsplash.com/photo-1594771804886-a933bb2d609b?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=882',
      ],
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
