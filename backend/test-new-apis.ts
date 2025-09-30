import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testNewApis() {
  try {
    console.log('🧪 Testing new APIs...')

    // Test dashboard stats
    console.log('\n📊 Testing Dashboard Stats:')
    
    const stats = await Promise.all([
      prisma.order.count(),
      prisma.order.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { totalAmount: true }
      }),
      prisma.menu.count({ where: { isActive: true } }),
      prisma.order.count({
        where: {
          status: { in: ['PENDING', 'PREPARING', 'READY', 'CONFIRMED'] }
        }
      })
    ])

    console.log('Dashboard Stats:')
    console.log(`  Total Orders: ${stats[0]}`)
    console.log(`  Total Revenue: ฿${Number(stats[1]._sum.totalAmount) || 0}`)
    console.log(`  Total Menu Items: ${stats[2]}`)
    console.log(`  Pending Orders: ${stats[3]}`)

    // Test today's stats
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const todayStats = await Promise.all([
      prisma.order.count({
        where: {
          createdAt: { gte: today, lt: tomorrow }
        }
      }),
      prisma.order.aggregate({
        where: {
          status: 'COMPLETED',
          createdAt: { gte: today, lt: tomorrow }
        },
        _sum: { totalAmount: true }
      })
    ])

    console.log(`  Today's Orders: ${todayStats[0]}`)
    console.log(`  Today's Revenue: ฿${Number(todayStats[1]._sum.totalAmount) || 0}`)

    // Test menu data
    console.log('\n🍽️ Testing Menu Data:')
    const menus = await prisma.menu.findMany({
      where: { isActive: true },
      include: {
        category: {
          select: { id: true, name: true }
        }
      },
      take: 5
    })

    console.log(`Found ${menus.length} menu items:`)
    menus.forEach(menu => {
      console.log(`  - ${menu.name} (${menu.category.name}) - ฿${menu.price} - ${menu.isAvailable ? 'Available' : 'Unavailable'}`)
    })

    // Test categories
    console.log('\n📂 Testing Categories:')
    const categories = await prisma.category.findMany({
      where: { isActive: true }
    })

    console.log(`Found ${categories.length} categories:`)
    categories.forEach(cat => {
      console.log(`  - ${cat.name}`)
    })

    console.log('\n✅ All API data ready!')

  } catch (error) {
    console.error('❌ Error testing APIs:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testNewApis()