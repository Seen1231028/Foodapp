import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    // Check if admin role exists
    let adminRole = await prisma.role.findFirst({
      where: { name: 'admin' }
    });

    if (!adminRole) {
      console.log('Creating admin role...');
      adminRole = await prisma.role.create({
        data: {
          name: 'admin',
          description: 'ผู้ดูแลระบบ'
        }
      });
    }

    // Check if admin user exists
    const existingAdmin = await prisma.user.findFirst({
      where: { 
        role: { name: 'admin' }
      }
    });

    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.username);
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    const adminUser = await prisma.user.create({
      data: {
        username: 'admin',
        email: 'admin@zeenzilla.com',
        password: hashedPassword,
        fullName: 'ผู้ดูแลระบบ',
        phone: '0123456789',
        roleId: adminRole.id,
        isActive: true
      }
    });

    console.log('Admin user created successfully!');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('Email: admin@zeenzilla.com');

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();