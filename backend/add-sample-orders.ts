import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addSampleOrders() {
  try {
    console.log('🌱 Adding sample orders...');

    // Get existing users first
    const existingUsers = await prisma.user.findMany({
      include: { role: true }
    });
    console.log('Existing users:', existingUsers.map(u => ({ email: u.email, role: u.role.name })));

    // Get customer role
    const customerRole = await prisma.role.findUnique({ where: { name: 'customer' } });
    if (!customerRole) {
      throw new Error('Customer role not found');
    }

    // Use existing users or create new ones
    let customer1 = existingUsers.find(u => u.role.name === 'customer');
    let customer2 = existingUsers.find(u => u.role.name === 'admin');
    let customer3 = existingUsers.find(u => u.role.name === 'shop_owner');

    // If no customer found, create some
    if (!customer1) {
      customer1 = await prisma.user.create({
        data: {
          username: 'customer1',
          email: 'customer1@test.com',
          password: '$2b$10$hashedpassword',
          fullName: 'สมชาย ใจดี',
          phone: '081-234-5678',
          roleId: customerRole.id
        },
        include: { role: true }
      });
    }

    if (!customer2) {
      customer2 = await prisma.user.create({
        data: {
          username: 'customer2',
          email: 'customer2@test.com',
          password: '$2b$10$hashedpassword',
          fullName: 'สมหญิง รักดี',
          phone: '081-987-6543',
          roleId: customerRole.id
        },
        include: { role: true }
      });
    }

    if (!customer3) {
      customer3 = await prisma.user.create({
        data: {
          username: 'customer3',
          email: 'customer3@test.com',
          password: '$2b$10$hashedpassword',
          fullName: 'วิชัย ดีใจ',
          phone: '081-555-1234',
          roleId: customerRole.id
        },
        include: { role: true }
      });
    }

    // Get menu items
    const menus = await prisma.menu.findMany({
      where: {
        name: {
          in: ['ข้าวผัดกุ้ง', 'ต้มยำกุ้ง', 'ผัดไทย', 'แกงเขียวหวานไก่', 'ข้าวสวย', 'น้ำส้มสด', 'ชาไทยเย็น', 'กาแฟดำร้อน', 'มะม่วงข้าวเหนียว']
        }
      }
    });

    if (menus.length === 0) {
      console.log('❌ No menu items found. Please run seed first.');
      return;
    }

    // Ensure we have users
    if (!customer1 || !customer2 || !customer3) {
      throw new Error('Failed to create or find users');
    }

    // Create orders with items
    const orders = [
      {
        orderNumber: 'ORD-001',
        userId: customer1.id,
        status: 'PENDING',
        totalAmount: 390.00,
        notes: 'ไม่ใส่พริก',
        items: [
          { menuName: 'ข้าวผัดกุ้ง', quantity: 2, price: 120.00 },
          { menuName: 'ต้มยำกุ้ง', quantity: 1, price: 150.00 }
        ]
      },
      {
        orderNumber: 'ORD-002',
        userId: customer2.id,
        status: 'PREPARING',
        totalAmount: 140.00,
        notes: null,
        items: [
          { menuName: 'ผัดไทย', quantity: 1, price: 80.00 },
          { menuName: 'น้ำส้มสด', quantity: 2, price: 30.00 }
        ]
      },
      {
        orderNumber: 'ORD-003',
        userId: customer3.id,
        status: 'READY',
        totalAmount: 160.00,
        notes: null,
        items: [
          { menuName: 'แกงเขียวหวานไก่', quantity: 1, price: 120.00 },
          { menuName: 'ข้าวสวย', quantity: 2, price: 20.00 }
        ]
      },
      {
        orderNumber: 'ORD-004',
        userId: customer1.id,
        status: 'COMPLETED',
        totalAmount: 190.00,
        notes: 'เพิ่มน้ำแข็ง',
        items: [
          { menuName: 'ผัดไทย', quantity: 1, price: 80.00 },
          { menuName: 'ชาไทยเย็น', quantity: 2, price: 25.00 },
          { menuName: 'มะม่วงข้าวเหนียว', quantity: 1, price: 60.00 }
        ]
      },
      {
        orderNumber: 'ORD-005',
        userId: customer2.id,
        status: 'CONFIRMED',
        totalAmount: 180.00,
        notes: null,
        items: [
          { menuName: 'ข้าวผัดกุ้ง', quantity: 1, price: 120.00 },
          { menuName: 'กาแฟดำร้อน', quantity: 2, price: 30.00 }
        ]
      }
    ];

    // Check if orders already exist
    const existingOrders = await prisma.order.findMany({
      where: {
        orderNumber: {
          in: ['ORD-001', 'ORD-002', 'ORD-003', 'ORD-004', 'ORD-005']
        }
      }
    });

    if (existingOrders.length > 0) {
      console.log('✅ Orders already exist:', existingOrders.map(o => o.orderNumber));
      return;
    }

    console.log('🍽️ Creating orders...');

    for (const orderData of orders) {
      // Create order
      const order = await prisma.order.create({
        data: {
          orderNumber: orderData.orderNumber,
          userId: orderData.userId,
          status: orderData.status as any,
          totalAmount: orderData.totalAmount,
          notes: orderData.notes
        }
      });

      // Create order items
      for (const item of orderData.items) {
        const menu = menus.find(m => m.name === item.menuName);
        if (menu) {
          await prisma.orderItem.create({
            data: {
              orderId: order.id,
              menuId: menu.id,
              quantity: item.quantity,
              price: item.price
            }
          });
        }
      }

      // Create payment for completed orders
      if (orderData.status === 'COMPLETED') {
        await prisma.payment.create({
          data: {
            orderId: order.id,
            amount: orderData.totalAmount,
            method: 'CASH',
            status: 'PAID',
            paidAt: new Date()
          }
        });
      } else {
        await prisma.payment.create({
          data: {
            orderId: order.id,
            amount: orderData.totalAmount,
            method: 'CASH',
            status: 'PENDING'
          }
        });
      }

      console.log(`✅ Created order ${orderData.orderNumber}`);
    }

    console.log('🎉 Sample orders added successfully!');
  } catch (error) {
    console.error('❌ Error adding sample orders:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addSampleOrders();