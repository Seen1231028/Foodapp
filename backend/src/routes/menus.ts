import { Elysia } from "elysia";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const menuRoutes = new Elysia({ prefix: "/menus" })
  .get("/", async ({ query, set }) => {
    try {
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

      return {
        success: true,
        data: menus,
        count: menus.length
      };
    } catch (error) {
      console.error("Get menus error:", error);
      set.status = 500;
      return { error: "เกิดข้อผิดพลาดในการดึงข้อมูลเมนู" };
    }
  })
  .get("/categories", async ({ set }) => {
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
  .get("/:id", async ({ params, set }) => {
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
  });