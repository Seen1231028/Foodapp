import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkOrders() {
  try {
    // Check orders
    const orders = await prisma.order.findMany({
      include: {
        user: true,
        items: {
          include: {
            menu: true
          }
        },
        payments: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log(`Found ${orders.length} orders:`)
    
    for (const order of orders) {
      console.log(`\n📋 Order ${order.orderNumber}:`)
      console.log(`  User: ${order.user.fullName} (${order.user.email})`)
      console.log(`  Status: ${order.status}`)
      console.log(`  Total: ${order.totalAmount}฿`)
      console.log(`  Items:`)
      
      for (const item of order.items) {
        console.log(`    - ${item.menu.name} x${item.quantity} = ${item.price}฿`)
      }
      
      if (order.payments && order.payments.length > 0) {
        const payment = order.payments[0]
        console.log(`  Payment: ${payment.status} (${payment.method})`)
      }
      
      if (order.notes) {
        console.log(`  Notes: ${order.notes}`)
      }
    }

    console.log('\n🔍 Order status summary:')
    const statusCounts = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`  ${status}: ${count} orders`)
    })

  } catch (error) {
    console.error('Error checking orders:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkOrders()