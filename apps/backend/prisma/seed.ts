import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

config(); // Load environment variables from .env file
console.log('Database URL is ', process.env.DATABASE_URL ? 'Found' : 'Not found'); // Log the database URL to verify it's loaded correctly

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL || '',
});

const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('Seeding database...');
    
    // 1. Clean up existing data
    await prisma.booking.deleteMany();
    await prisma.property.deleteMany();
    await prisma.user.deleteMany();

    // 2. Seed users
    const users = await prisma.user.create({
        data: {
            email: 'user@bookinginapp.com',
            password: 'securepassword123',
            name: 'John Doe',
        }
    });
    console.log(`Created user: ${users.name} (${users.email})`);

// 3. Seed some cool Indonesian Properties
  const properties = [
    {
      title: 'Aesthetic Bamboo Villa Ubud',
      description: 'An eco-friendly bamboo villa hidden in the rice fields of Ubud, Bali. Perfect for healing.',
      pricePerNight: 1500000.00, // Rp 1.500.000
      totalRooms: 3,
    },
    {
      title: 'Pine Ridge Glamping Lembang',
      description: 'Luxury glamping tents surrounded by pine forests in Lembang, Bandung. Cool mountain air included.',
      pricePerNight: 850000.00, // Rp 850.000
      totalRooms: 5,
    },
    {
      title: 'Modern Minimalist Studio Kost',
      description: 'Premium coliving space in South Jakarta. High-speed internet, close to MRT stations.',
      pricePerNight: 350000.00, // Rp 350.000
      totalRooms: 10,
    },
  ];

  for (const property of properties) {
    const createdProperty = await prisma.property.create({ data: property });
    console.log(`Created property: ${createdProperty.title} (ID: ${createdProperty.id})`);
    }
    console.log('Database seeding completed.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

