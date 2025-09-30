import { Elysia } from "elysia";
import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const orderRoutes = new Elysia({ prefix: "/orders" })
  // ดึงรายการคำสั่งซื้อทั้งหมด
  .get("/", async ({ headers, set, query }) => {
    try {
      // ตรวจสอบ authentication
      const token = headers.authorization?.replace('Bearer ', '');
      if (!token) {
        set.status = 401;
        return { success: false, error: 'ไม่พบ token การยืนยันตัวตน' };
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
      if (!decoded) {
        set.status = 403;
        return { success: false, error: 'Token ไม่ถูกต้อง' };
      }

      // กรอง orders ตาม role
      let whereCondition: any = {};
      
      if (decoded.role === 'shop_owner') {
        // shop_owner ดูได้เฉพาะ orders ของร้านตัวเอง (ในกรณีนี้ดูได้ทั้งหมด)
        whereCondition = {};
      } else if (decoded.role === 'customer') {
        // customer ดูได้เฉพาะ orders ของตัวเอง
        whereCondition = { userId: decoded.userId };
      } else if (decoded.role === 'admin' || decoded.role === 'finance') {
        // admin และ finance ดูได้ทั้งหมด
        whereCondition = {};
      } else {
        set.status = 403;
        return { success: false, error: 'ไม่มีสิทธิ์เข้าถึงข้อมูลคำสั่งซื้อ' };
      }

      // เพิ่ม filter ตาม status ถ้ามี
      if (query.status && query.status !== 'all') {
        whereCondition.status = query.status;
      }

      const orders = await prisma.order.findMany({
        where: whereCondition,
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              phone: true,
              email: true
            }
          },
          items: {
            include: {
              menu: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  image: true
                }
              }
            }
          },
          payments: {
            select: {
              id: true,
              method: true,
              status: true,
              amount: true,
              paidAt: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      // แปลงข้อมูลให้เหมาะกับ frontend
      const formattedOrders = orders.map(order => ({
        id: order.id,
        orderNumber: order.orderNumber,
        customerName: order.user.fullName,
        customerPhone: order.user.phone || '',
        customerEmail: order.user.email,
        items: order.items.map(item => ({
          id: item.id,
          name: item.menu.name,
          quantity: item.quantity,
          price: Number(item.price),
          notes: item.notes,
          image: item.menu.image
        })),
        total: Number(order.totalAmount),
        status: order.status.toLowerCase(),
        notes: order.notes,
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
        payments: order.payments.map(payment => ({
          id: payment.id,
          method: payment.method,
          status: payment.status,
          amount: Number(payment.amount),
          paidAt: payment.paidAt?.toISOString()
        }))
      }));

      set.status = 200;
      return {
        success: true,
        data: formattedOrders,
        total: formattedOrders.length
      };

    } catch (error) {
      console.error("Get orders error:", error);
      set.status = 500;
      return { 
        success: false, 
        error: "เกิดข้อผิดพลาดในการดึงข้อมูลคำสั่งซื้อ" 
      };
    }
  })

  // ดึงข้อมูลคำสั่งซื้อเฉพาะ
  .get("/:id", async ({ headers, set, params }) => {
    try {
      const orderId = parseInt(params.id);
      if (isNaN(orderId)) {
        set.status = 400;
        return { success: false, error: 'รหัสคำสั่งซื้อไม่ถูกต้อง' };
      }

      // ตรวจสอบ authentication
      const token = headers.authorization?.replace('Bearer ', '');
      if (!token) {
        set.status = 401;
        return { success: false, error: 'ไม่พบ token การยืนยันตัวตน' };
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
      
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              phone: true,
              email: true
            }
          },
          items: {
            include: {
              menu: {
                select: {
                  id: true,
                  name: true,
                  description: true,
                  price: true,
                  image: true
                }
              }
            }
          },
          payments: true
        }
      });

      if (!order) {
        set.status = 404;
        return { success: false, error: 'ไม่พบคำสั่งซื้อ' };
      }

      // ตรวจสอบสิทธิ์การเข้าถึง
      if (decoded.role === 'customer' && order.userId !== decoded.userId) {
        set.status = 403;
        return { success: false, error: 'ไม่มีสิทธิ์เข้าถึงคำสั่งซื้อนี้' };
      }

      const formattedOrder = {
        id: order.id,
        orderNumber: order.orderNumber,
        customerName: order.user.fullName,
        customerPhone: order.user.phone || '',
        customerEmail: order.user.email,
        items: order.items.map(item => ({
          id: item.id,
          name: item.menu.name,
          description: item.menu.description,
          quantity: item.quantity,
          price: Number(item.price),
          notes: item.notes,
          image: item.menu.image
        })),
        total: Number(order.totalAmount),
        status: order.status.toLowerCase(),
        notes: order.notes,
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
        payments: order.payments.map(payment => ({
          id: payment.id,
          method: payment.method,
          status: payment.status,
          amount: Number(payment.amount),
          paidAt: payment.paidAt?.toISOString()
        }))
      };

      set.status = 200;
      return {
        success: true,
        data: formattedOrder
      };

    } catch (error) {
      console.error("Get order by ID error:", error);
      set.status = 500;
      return { 
        success: false, 
        error: "เกิดข้อผิดพลาดในการดึงข้อมูลคำสั่งซื้อ" 
      };
    }
  })

  // อัพเดทสถานะคำสั่งซื้อ
  .put("/:id/status", async ({ headers, set, params, body }) => {
    try {
      const orderId = parseInt(params.id);
      if (isNaN(orderId)) {
        set.status = 400;
        return { success: false, error: 'รหัสคำสั่งซื้อไม่ถูกต้อง' };
      }

      // ตรวจสอบ authentication
      const token = headers.authorization?.replace('Bearer ', '');
      if (!token) {
        set.status = 401;
        return { success: false, error: 'ไม่พบ token การยืนยันตัวตน' };
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
      
      // เฉพาะ shop_owner, admin, finance เท่านั้นที่อัพเดทสถานะได้
      if (!['shop_owner', 'admin', 'finance'].includes(decoded.role)) {
        set.status = 403;
        return { success: false, error: 'ไม่มีสิทธิ์อัพเดทสถานะคำสั่งซื้อ' };
      }

      const { status } = body as { status: string };
      
      // ตรวจสอบสถานะที่ถูกต้อง
      const validStatuses = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED'];
      if (!status || !validStatuses.includes(status.toUpperCase())) {
        set.status = 400;
        return { 
          success: false, 
          error: 'สถานะไม่ถูกต้อง กรุณาใช้: ' + validStatuses.join(', ') 
        };
      }

      // ตรวจสอบว่ามี order อยู่หรือไม่
      const existingOrder = await prisma.order.findUnique({
        where: { id: orderId }
      });

      if (!existingOrder) {
        set.status = 404;
        return { success: false, error: 'ไม่พบคำสั่งซื้อ' };
      }

      // อัพเดทสถานะ
      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: { 
          status: status.toUpperCase() as any,
          updatedAt: new Date()
        },
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              phone: true,
              email: true
            }
          },
          items: {
            include: {
              menu: {
                select: {
                  id: true,
                  name: true,
                  price: true
                }
              }
            }
          }
        }
      });

      set.status = 200;
      return {
        success: true,
        message: 'อัพเดทสถานะคำสั่งซื้อเรียบร้อยแล้ว',
        data: {
          id: updatedOrder.id,
          orderNumber: updatedOrder.orderNumber,
          status: updatedOrder.status.toLowerCase(),
          updatedAt: updatedOrder.updatedAt.toISOString()
        }
      };

    } catch (error) {
      console.error("Update order status error:", error);
      set.status = 500;
      return { 
        success: false, 
        error: "เกิดข้อผิดพลาดในการอัพเดทสถานะคำสั่งซื้อ" 
      };
    }
  });