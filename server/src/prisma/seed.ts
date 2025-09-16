import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seeding...');

  try {
    const adminData = [
      {
        email: process.env.DEFAULT_ADMIN_EMAIL || 'admin@photocap.com',
        password: process.env.DEFAULT_ADMIN_PASSWORD || 'admin123',
        name: process.env.DEFAULT_ADMIN_NAME || 'Super Admin',
        role: 'SUPER_ADMIN' as const
      }
    ];

    for (const admin of adminData) {
      const existingAdmin = await prisma.admin.findUnique({
        where: { email: admin.email }
      });

      if (existingAdmin) {
        console.log(`⚠️  Admin with email ${admin.email} already exists, skipping...`);
        continue;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(admin.password, 12);

      // Create admin
      const createdAdmin = await prisma.admin.create({
        data: {
          email: admin.email,
          password: hashedPassword,
          name: admin.name,
          role: admin.role
        }
      });

      console.log(`✅ Created admin: ${createdAdmin.name} (${createdAdmin.email}) - Role: ${createdAdmin.role}`);
    }

    console.log('🎉 Seeding completed successfully!');
    console.log('\n📋 Admin Accounts Created:');
    console.log('================================');
    
    const allAdmins = await prisma.admin.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true
      }
    });

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });