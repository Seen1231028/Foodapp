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