import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create roles
  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: {
      name: 'admin',
      description: 'ผู้ดูแลระบบ - จัดการสิทธิ์ผู้ใช้งานและระบบทั้งหมด'
    }
  })

  const shopOwnerRole = await prisma.role.upsert({
    where: { name: 'shop_owner' },
    update: {},
    create: {
      name: 'shop_owner',
      description: 'เจ้าของร้าน - จัดการเมนู คำสั่งซื้อ และดูรายงาน'
    }
  })

  const customerRole = await prisma.role.upsert({
    where: { name: 'customer' },
    update: {},
    create: {
      name: 'customer',
      description: 'ลูกค้า - สั่งอาหาร ชำระเงิน และตรวจสอบสถานะ'
    }
  })

  const financeRole = await prisma.role.upsert({
    where: { name: 'finance' },
    update: {},
    create: {
      name: 'finance',
      description: 'ฝ่ายการเงิน - ตรวจสอบยอดเงินและออกรายงานทางการเงิน'
    }
  })

  console.log('✅ Roles created')

  // Create categories
  const categories = [
    { name: 'อาหารจานหลัก', description: 'ข้าว ก๋วยเตี๋ยว และอาหารหลัก' },
    { name: 'อาหารทานเล่น', description: 'ขนมและอาหารทานเล่น' },
    { name: 'เครื่องดื่ม', description: 'น้ำผลไม้ กาแฟ ชา และเครื่องดื่มต่างๆ' },
    { name: 'ของหวาน', description: 'ไอศกรีม เค้ก และของหวานต่างๆ' }
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category
    })
  }

  console.log('✅ Categories created')

  // Create system settings
  const settings = [
    { key: 'restaurant_name', value: 'ZeenZilla Food Court', type: 'string' },
    { key: 'restaurant_phone', value: '02-123-4567', type: 'string' },
    { key: 'restaurant_address', value: '123 ถนนรัชดาภิเษก เขตดินแดง กรุงเทพฯ 10400', type: 'string' },
    { key: 'order_preparation_time', value: '15', type: 'number' },
    { key: 'max_orders_per_user', value: '5', type: 'number' },
    { key: 'allow_guest_orders', value: 'false', type: 'boolean' },
    { key: 'payment_methods', value: '["CASH","BANK_TRANSFER","WALLET"]', type: 'json' }
  ]

  for (const setting of settings) {
    await prisma.systemSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting
    })
  }

  console.log('✅ System settings created')

  // Create admin users
  const saltRounds = 12
  const adminPassword = await bcrypt.hash('admin123', saltRounds)
  const shopOwnerPassword = await bcrypt.hash('shop123', saltRounds)
  const customerPassword = await bcrypt.hash('customer123', saltRounds)
  const financePassword = await bcrypt.hash('finance123', saltRounds)

  // Admin user
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@zeenzilla.com',
      password: adminPassword,
      fullName: 'ผู้ดูแลระบบ',
      phone: '081-234-5678',
      roleId: adminRole.id,
      isActive: true
    }
  })

  // Shop Owner user
  await prisma.user.upsert({
    where: { username: 'shopowner' },
    update: {},
    create: {
      username: 'shopowner',
      email: 'shop@zeenzilla.com',
      password: shopOwnerPassword,
      fullName: 'เจ้าของร้าน ZeenZilla',
      phone: '082-345-6789',
      roleId: shopOwnerRole.id,
      isActive: true
    }
  })

  // Customer user
  await prisma.user.upsert({
    where: { username: 'customer' },
    update: {},
    create: {
      username: 'customer',
      email: 'customer@example.com',
      password: customerPassword,
      fullName: 'ลูกค้าทดสอบ',
      phone: '083-456-7890',
      roleId: customerRole.id,
      isActive: true
    }
  })

  // Finance user
  await prisma.user.upsert({
    where: { username: 'finance' },
    update: {},
    create: {
      username: 'finance',
      email: 'finance@zeenzilla.com',
      password: financePassword,
      fullName: 'ฝ่ายการเงิน',
      phone: '084-567-8901',
      roleId: financeRole.id,
      isActive: true
    }
  })

  console.log('✅ Demo users created')

  // Create sample menu items
  const existingCategories = await prisma.category.findMany();
  const mainCourse = existingCategories.find(c => c.name === 'อาหารจานหลัก');
  const snacks = existingCategories.find(c => c.name === 'อาหารทานเล่น');
  const drinks = existingCategories.find(c => c.name === 'เครื่องดื่ม');
  const desserts = existingCategories.find(c => c.name === 'ของหวาน');

  if (mainCourse) {
    await prisma.menu.createMany({
      data: [
        {
          name: 'ข้าวผัดกุ้ง',
          description: 'ข้าวผัดกุ้งสดรสเข้มข้น เสิร์ฟพร้อมผักกาดดอง',
          price: 80,
          image: '/api/placeholder/300/200',
          categoryId: mainCourse.id,
          preparationTime: 15
        },
        {
          name: 'ก๋วยเตี๋ยวต้มยำ',
          description: 'ก๋วยเตี๋ยวต้มยำกุ้งรสจัดจ้าน เผ็ดร้อนตามแบบไทยแท้',
          price: 65,
          image: '/api/placeholder/300/200',
          categoryId: mainCourse.id,
          preparationTime: 20
        },
        {
          name: 'ผัดไทยกุ้งสด',
          description: 'ผัดไทยกุ้งสดเส้นหมี่ รสชาติหวานเปรี้ยว',
          price: 85,
          image: '/api/placeholder/300/200',
          categoryId: mainCourse.id,
          preparationTime: 18
        }
      ]
    });
  }

  if (drinks) {
    await prisma.menu.createMany({
      data: [
        {
          name: 'ชาไทยเย็น',
          description: 'ชาไทยเย็นหวานมัน เสิร์ฟพร้อมน้ำแข็ง',
          price: 25,
          image: '/api/placeholder/300/200',
          categoryId: drinks.id,
          preparationTime: 5
        },
        {
          name: 'กาแฟดำร้อน',
          description: 'กาแฟคั่วใหม่ รสชาติเข้มข้น',
          price: 30,
          image: '/api/placeholder/300/200',
          categoryId: drinks.id,
          preparationTime: 8
        }
      ]
    });
  }

  // Create sample orders
  const customerUser = await prisma.user.findFirst({
    where: { username: 'customer' }
  });

  const menus = await prisma.menu.findMany();

  if (customerUser && menus.length > 0) {
    // Create sample orders
    for (let i = 1; i <= 5; i++) {
      const order = await prisma.order.create({
        data: {
          orderNumber: `ORD-${Date.now()}-${i}`,
          userId: customerUser.id,
          status: i <= 3 ? 'COMPLETED' : 'PENDING',
          totalAmount: 120 + (i * 10),
          notes: `Test order ${i}`,
        }
      });

      // Add order items
      await prisma.orderItem.createMany({
        data: [
          {
            orderId: order.id,
            menuId: menus[0].id,
            quantity: 1,
            price: menus[0].price
          },
          {
            orderId: order.id,
            menuId: menus[1]?.id || menus[0].id,
            quantity: 2,
            price: menus[1]?.price || menus[0].price
          }
        ]
      });

      // Add payment
      await prisma.payment.create({
        data: {
          orderId: order.id,
          amount: order.totalAmount,
          method: 'CASH',
          status: i <= 3 ? 'PAID' : 'PENDING',
          paidAt: i <= 3 ? new Date() : null
        }
      });
    }
  }

  console.log('✅ Sample menus and orders created')
  console.log('📋 Demo login credentials:')
  console.log('   Admin: admin / admin123')
  console.log('   Shop Owner: shopowner / shop123')
  console.log('   Customer: customer / customer123')
  console.log('   Finance: finance / finance123')

  console.log('🎉 Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })