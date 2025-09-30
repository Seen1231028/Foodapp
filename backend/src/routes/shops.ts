import { Elysia } from 'elysia';
import { PrismaClient } from '@prisma/client';
import { saveBase64Image, deleteImage } from '../utils/image';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// Runtime safeguard: if database has no shops, create a few demo entries so UI isn't empty.
// This is idempotent: it only runs when count == 0, and links a few existing menus (if any).
async function ensureDemoShopsIfEmpty() {
  try {
    // @ts-ignore
    const count = await (prisma as any).shop.count();
    if (count > 0) return; // Already have shops
    console.log('⚠️ No shops found. Creating runtime demo shops...');
    // Try to find a shop owner user to assign. If missing, ownerId can be null.
    const shopOwnerUser = await prisma.user.findFirst({ where: { username: 'shopowner' } });
    const baseShops = [
      { name: 'Golden Thai Kitchen', description: 'อาหารไทยต้นตำรับ', image: null as string | null },
      { name: 'Sakura Sushi Bar', description: 'ซูชิและอาหารญี่ปุ่น', image: null },
      { name: 'Western Grill House', description: 'สเต็กและอาหารตะวันตก', image: null }
    ];
    for (const s of baseShops) {
      // @ts-ignore
      await (prisma as any).shop.create({ data: { name: s.name, description: s.description, image: s.image, ownerId: shopOwnerUser?.id || null } });
    }
    // Optionally distribute some existing menus to these shops so menuCount displays >0
    try {
      // @ts-ignore
      const shops = await (prisma as any).shop.findMany();
      const menus = await prisma.menu.findMany();
      if (shops.length && menus.length) {
        for (let i = 0; i < menus.length; i++) {
          const shop = shops[i % shops.length];
            await prisma.menu.update({ where: { id: menus[i].id }, data: { shopId: shop.id } });
        }
        console.log('🔗 Linked existing menus to newly created demo shops');
      }
    } catch (linkErr) {
      console.warn('Could not link menus to demo shops:', linkErr);
    }
  } catch (e) {
    console.warn('ensureDemoShopsIfEmpty failed (non-critical):', e);
  }
}

export const shopRoutes = new Elysia({ prefix: '/shops' })
  // Recommended shops
  .get('/recommended', async ({ query, set }) => {
    try {
      const limit = Math.min(parseInt((query as any)?.limit) || 6, 24);
      // @ts-ignore
      const shops = await (prisma as any).shop.findMany({
        where: { isActive: true },
        include: {
          menus: { where: { isActive: true, isAvailable: true }, select: { id: true } },
          owner: { select: { id: true, fullName: true, profileImage: true } }
        },
        orderBy: [{ updatedAt: 'desc' }],
        take: limit
      });
      if (!shops.length) {
        // Attempt to auto-create demo shops then re-query once
        await ensureDemoShopsIfEmpty();
        // @ts-ignore
        const shopsAfter = await (prisma as any).shop.findMany({
          where: { isActive: true },
          include: {
            menus: { where: { isActive: true, isAvailable: true }, select: { id: true } },
            owner: { select: { id: true, fullName: true, profileImage: true } }
          },
          orderBy: [{ updatedAt: 'desc' }],
          take: limit
        });
        // Replace shops variable reference for scoring
        // @ts-ignore
        (shops as any).push(...shopsAfter);
      }
      const scored = (shops as any[]).map((s: any) => ({
        id: s.id,
        name: s.name,
        description: s.description,
        image: s.image || null,
        menuCount: s.menus.length,
        owner: s.owner ? { id: s.owner.id, name: s.owner.fullName, avatar: s.owner.profileImage } : null,
        updatedAt: s.updatedAt,
        score: s.menus.length
      })).sort((a: any, b: any) => b.score - a.score);
      return { success: true, data: scored };
    } catch (error) {
      console.error('Get recommended shops error:', error);
      set.status = 500;
      return { success: false, error: 'เกิดข้อผิดพลาดในการดึงร้านแนะนำ' };
    }
  })
  // Get single shop with menus
  .get('/:id', async ({ params, set }) => {
    try {
      const id = parseInt(params.id);
      if (isNaN(id)) { set.status = 400; return { success: false, error: 'รหัสร้านไม่ถูกต้อง' }; }
      // @ts-ignore
      const shop = await (prisma as any).shop.findUnique({
        where: { id },
        include: {
          menus: { where: { isActive: true }, select: { id: true, name: true, price: true, image: true, isAvailable: true } },
          owner: { select: { id: true, fullName: true, profileImage: true } }
        }
      });
      if (!shop) { set.status = 404; return { success: false, error: 'ไม่พบร้านค้า' }; }
      return { success: true, data: shop };
    } catch (e) {
      console.error('Get shop error:', e);
      set.status = 500; return { success: false, error: 'เกิดข้อผิดพลาดในการดึงข้อมูลร้าน' };
    }
  })
  // Upload/replace shop image (auth required, roles: shop_owner, admin)
  .post('/:id/image', async ({ params, body, set, headers }) => {
    try {
      const id = parseInt(params.id);
      if (isNaN(id)) { set.status = 400; return { success: false, error: 'รหัสร้านไม่ถูกต้อง' }; }
      const { image } = body as { image?: string };
      if (!image) { set.status = 400; return { success: false, error: 'กรุณาส่งข้อมูลรูป (base64 data URL)' }; }
      const token = headers.authorization?.replace('Bearer ', '');
      if (!token) { set.status = 401; return { success: false, error: 'ไม่ได้ส่ง token' }; }
      let decoded: any;
      try { decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret'); } catch { set.status = 401; return { success: false, error: 'token ไม่ถูกต้อง' }; }
      if (!['shop_owner','admin'].includes(decoded.role)) { set.status = 403; return { success: false, error: 'ไม่มีสิทธิ์อัปโหลดรูป' }; }
      // @ts-ignore
      const shop = await (prisma as any).shop.findUnique({ where: { id } });
      if (!shop) { set.status = 404; return { success: false, error: 'ไม่พบร้านค้า' }; }
      // If shop_owner must own the shop (simple check: match userId to ownerId if set)
      if (decoded.role === 'shop_owner' && shop.ownerId && shop.ownerId !== decoded.userId) {
        set.status = 403; return { success: false, error: 'ไม่ใช่เจ้าของร้าน' };
      }
      const result = saveBase64Image(image, 'shops');
      if (shop.image && shop.image !== result.relativePath) deleteImage(shop.image);
      // @ts-ignore
      const updated = await (prisma as any).shop.update({ where: { id }, data: { image: result.relativePath } });
      return { success: true, data: { id: updated.id, image: updated.image } };
    } catch (error) {
      console.error('Upload shop image error:', error);
      set.status = 500; return { success: false, error: 'อัปโหลดรูปไม่สำเร็จ' };
    }
  });

export default shopRoutes;