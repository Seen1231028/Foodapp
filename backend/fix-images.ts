import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixImages() {
  try {
    const result = await prisma.menu.updateMany({
      where: { 
        image: { 
          contains: '/api/placeholder' 
        } 
      },
      data: { 
        image: null 
      }
    });
    
    console.log(`✅ Updated ${result.count} menu items - removed placeholder images`);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixImages();
