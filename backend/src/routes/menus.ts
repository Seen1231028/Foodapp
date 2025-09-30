import { Elysia } from "elysia";
import { PrismaClient } from "@prisma/client";
import { saveBase64Image, deleteImage } from '../utils/image';
import { jwt } from '@elysiajs/jwt'
import { cors } from '@elysiajs/cors'

const prisma = new PrismaClient();

export const menuRoutes = new Elysia({ prefix: "/menus" })
  .use(cors())
  .use(jwt({
    name: 'jwt',
    secret: process.env.JWT_SECRET || 'default-secret'
  }))
  .derive(async ({ jwt, headers, request }) => {
    // Skip auth for GET requests (public menu viewing)
    if (request.method === 'GET') {
      return {}
    }

    try {
      const authHeader = headers.authorization
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('No token provided')
      }

      const token = authHeader.split(' ')[1]
      
      // Mock token for development
      if (token === 'mock-token') {
        const mockUser = {
          id: 1,
          name: 'Mock Admin',
          email: 'admin@mock.com',
          role: { name: 'admin' }
        }
        return { user: mockUser }
      }
      
      const payload = await jwt.verify(token) as any
      if (!payload || !payload.userId) {
        throw new Error('Invalid token')
      }

      const user = await prisma.user.findUnique({
        where: { id: Number(payload.userId) },
        include: { role: true }
      })

      if (!user) {
        throw new Error('User not found')
      }

      // Check if user has permission for menu management
      if (!['shop_owner', 'admin'].includes(user.role.name)) {
        throw new Error('Insufficient permissions')
      }

      return { user }
    } catch (error) {
      console.error('Auth error:', error)
      throw error
    }
  })
  .get("/", async ({ query, set }: any) => {
    try {
      console.log('📋 GET /menus called with query:', query)
      
      const { category, search, available } = query as {
        category?: string;
        search?: string;
        available?: string;
      };

      const where: any = { isActive: true };

      if (category) {
        where.category = { name: category };
      }

      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ];
      }

      if (available !== undefined) {
        where.isAvailable = available === 'true';
      }

      console.log('🔍 Query where condition:', JSON.stringify(where, null, 2))

      const menus = await prisma.menu.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      console.log(`✅ Found ${menus.length} menus`)

      return {
        success: true,
        data: menus,
        count: menus.length
      };
    } catch (error) {
      console.error("❌ Get menus error:", error);
      set.status = 500;
      return { error: "เกิดข้อผิดพลาดในการดึงข้อมูลเมนู", details: String(error) };
    }
  })
  .get("/categories", async ({ set }: any) => {
    try {
      const categories = await prisma.category.findMany({
        where: { isActive: true },
        orderBy: { name: 'asc' }
      });

      return {
        success: true,
        data: categories
      };
    } catch (error) {
      console.error("Get categories error:", error);
      set.status = 500;
      return { error: "เกิดข้อผิดพลาดในการดึงข้อมูลหมวดหมู่" };
    }
  })
  .get("/:id", async ({ params, set }: any) => {
    try {
      const id = parseInt(params.id);
      
      const menu = await prisma.menu.findFirst({
        where: { 
          id,
          isActive: true 
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              description: true
            }
          }
        }
      });

      if (!menu) {
        set.status = 404;
        return { error: "ไม่พบเมนูที่ระบุ" };
      }

      return {
        success: true,
        data: menu
      };
    } catch (error) {
      console.error("Get menu error:", error);
      set.status = 500;
      return { error: "เกิดข้อผิดพลาดในการดึงข้อมูลเมนู" };
    }
  })
  
  // Management endpoints (require authentication)
  .post("/", async ({ body, user, set }: any) => {
    try {
      const { name, description, price, categoryId, image, preparationTime } = body as {
        name: string
        description?: string
        price: number
        categoryId: number
        image?: string
        preparationTime?: number
      }

      const menu = await prisma.menu.create({
        data: {
          name,
          description,
          price,
          categoryId,
          image,
          preparationTime: preparationTime || 15
        },
        include: {
          category: {
            select: { id: true, name: true }
          }
        }
      })

      return {
        success: true,
        data: menu,
        message: 'เพิ่มเมนูใหม่สำเร็จ'
      }
    } catch (error) {
      console.error("Create menu error:", error);
      set.status = 500;
      return { error: "เกิดข้อผิดพลาดในการเพิ่มเมนู" };
    }
  })
  
  .put("/:id", async ({ params, body, user, set }: any) => {
    try {
      const id = parseInt(params.id as string);
      const { name, description, price, categoryId, image, preparationTime, isAvailable } = body as {
        name?: string
        description?: string
        price?: number
        categoryId?: number
        image?: string
        preparationTime?: number
        isAvailable?: boolean
      }

      // Check if menu exists
      const existingMenu = await prisma.menu.findFirst({
        where: { id, isActive: true }
      });

      if (!existingMenu) {
        set.status = 404;
        return { error: "ไม่พบเมนูที่ระบุ" };
      }

      const updatedMenu = await prisma.menu.update({
        where: { id },
        data: {
          ...(name && { name }),
          ...(description !== undefined && { description }),
          ...(price && { price }),
          ...(categoryId && { categoryId }),
          ...(image !== undefined && { image }),
          ...(preparationTime && { preparationTime }),
          ...(isAvailable !== undefined && { isAvailable })
        },
        include: {
          category: {
            select: { id: true, name: true }
          }
        }
      })

      return {
        success: true,
        data: updatedMenu,
        message: 'อัพเดตเมนูสำเร็จ'
      }
    } catch (error) {
      console.error("Update menu error:", error);
      set.status = 500;
      return { error: "เกิดข้อผิดพลาดในการอัพเดตเมนู" };
    }
  })
  // Upload/replace menu image (base64) POST /menus/:id/image { image: 'data:image/...'}
  .post('/:id/image', async ({ params, body, user, set }: any) => {
    try {
      const id = parseInt(params.id as string);
      if (isNaN(id)) { set.status = 400; return { success: false, error: 'รหัสเมนูไม่ถูกต้อง' }; }
      if (!user) { set.status = 401; return { success: false, error: 'ไม่ได้รับอนุญาต' }; }
      if (!['shop_owner','admin'].includes(user.role.name)) { set.status = 403; return { success: false, error: 'ไม่มีสิทธิ์อัปโหลดรูปเมนู' }; }
      const { image } = body as { image?: string };
      if (!image) { set.status = 400; return { success: false, error: 'กรุณาส่งรูป (base64 data URL)' }; }
      const menu = await prisma.menu.findFirst({ where: { id, isActive: true } });
      if (!menu) { set.status = 404; return { success: false, error: 'ไม่พบเมนู' }; }
      const result = saveBase64Image(image, 'menus');
      if (menu.image && menu.image !== result.relativePath) deleteImage(menu.image);
      const updated = await prisma.menu.update({ where: { id }, data: { image: result.relativePath } });
      return { success: true, data: { id: updated.id, image: updated.image } };
    } catch (e) {
      console.error('Upload menu image error:', e);
      set.status = 500; return { success: false, error: 'อัปโหลดรูปเมนูไม่สำเร็จ' };
    }
  })
  
  .delete("/:id", async ({ params, user, set }: any) => {
    try {
      const id = parseInt(params.id as string);

      // Check if menu exists
      const existingMenu = await prisma.menu.findFirst({
        where: { id, isActive: true }
      });

      if (!existingMenu) {
        set.status = 404;
        return { error: "ไม่พบเมนูที่ระบุ" };
      }

      // Soft delete - mark as inactive
      await prisma.menu.update({
        where: { id },
        data: { isActive: false }
      })

      return {
        success: true,
        message: 'ลบเมนูสำเร็จ'
      }
    } catch (error) {
      console.error("Delete menu error:", error);
      set.status = 500;
      return { error: "เกิดข้อผิดพลาดในการลบเมนู" };
    }
  })
  
  .patch("/:id/availability", async ({ params, body, user, set }: any) => {
    try {
      const id = parseInt(params.id as string);
      const { isAvailable } = body as { isAvailable: boolean }

      // Check if menu exists
      const existingMenu = await prisma.menu.findFirst({
        where: { id, isActive: true }
      });

      if (!existingMenu) {
        set.status = 404;
        return { error: "ไม่พบเมนูที่ระบุ" };
      }

      const updatedMenu = await prisma.menu.update({
        where: { id },
        data: { isAvailable },
        include: {
          category: {
            select: { id: true, name: true }
          }
        }
      })

      return {
        success: true,
        data: updatedMenu,
        message: `${isAvailable ? 'เปิด' : 'ปิด'}จำหน่ายเมนูสำเร็จ`
      }
    } catch (error) {
      console.error("Toggle menu availability error:", error);
      set.status = 500;
      return { error: "เกิดข้อผิดพลาดในการเปลี่ยนสถานะเมนู" };
    }
  });