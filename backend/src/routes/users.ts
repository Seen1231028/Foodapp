import { Elysia, t } from "elysia";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

// Middleware to verify admin token
const verifyAdminToken = async (headers: any) => {
  const authHeader = headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error("No authorization header provided");
  }

  const token = authHeader.substring(7);
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as any;
    console.log('Decoded token:', decoded);
    
    // Get user and check if admin
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { role: true }
    });

    console.log('Found user:', user ? {
      id: user.id,
      username: user.username,
      isActive: user.isActive,
      role: user.role.name
    } : 'null');

    if (!user) {
      throw new Error("User not found");
    }

    if (!user.isActive) {
      throw new Error("User account is deactivated");
    }

    if (user.role.name !== 'admin') {
      throw new Error(`Insufficient permissions. User role: ${user.role.name}, required: admin`);
    }

    return user;
  } catch (jwtError) {
    console.error('JWT verification error:', jwtError);
    throw new Error("Invalid token");
  }
};

export const userRoutes = new Elysia({ prefix: "/users" })
  // Get all users (Admin only)
  .get("/", async ({ headers, set, query }) => {
    try {
      await verifyAdminToken(headers);

      const page = parseInt(query.page as string) || 1;
      const limit = parseInt(query.limit as string) || 10;
      const search = query.search as string || '';
      const roleFilter = query.role as string || '';

      const skip = (page - 1) * limit;

      // Build where condition
      const whereCondition: any = {};
      
      if (search) {
        whereCondition.OR = [
          { username: { contains: search, mode: 'insensitive' } },
          { fullName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } }
        ];
      }

      if (roleFilter) {
        whereCondition.role = {
          name: roleFilter
        };
      }

      const [users, totalCount] = await Promise.all([
        prisma.user.findMany({
          where: whereCondition,
          include: {
            role: {
              select: {
                id: true,
                name: true,
                description: true
              }
            }
          },
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' }
        }),
        prisma.user.count({ where: whereCondition })
      ]);

      // Remove passwords from response
      const usersWithoutPasswords = users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });

      return {
        success: true,
        data: {
          users: usersWithoutPasswords,
          pagination: {
            page,
            limit,
            total: totalCount,
            totalPages: Math.ceil(totalCount / limit)
          }
        }
      };
    } catch (error) {
      console.error('Get users error:', error);
      set.status = error instanceof Error && error.message.includes('token') ? 401 : 
                   error instanceof Error && error.message.includes('permission') ? 403 : 500;
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  })

  // Get user by ID (Admin only)
  .get("/:id", async ({ headers, params, set }) => {
    try {
      await verifyAdminToken(headers);

      const userId = parseInt(params.id);
      if (!userId) {
        set.status = 400;
        return { success: false, error: 'Invalid user ID' };
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          role: {
            select: {
              id: true,
              name: true,
              description: true
            }
          }
        }
      });

      if (!user) {
        set.status = 404;
        return { success: false, error: 'User not found' };
      }

      const { password, ...userWithoutPassword } = user;

      return {
        success: true,
        data: userWithoutPassword
      };
    } catch (error) {
      console.error('Get user error:', error);
      set.status = 401;
      return { success: false, error: 'Unauthorized access' };
    }
  })

  // Create new user (Admin only)
  .post("/", async ({ headers, body, set }) => {
    try {
      await verifyAdminToken(headers);

      const { username, email, password, fullName, phone, roleId } = body as {
        username: string;
        email: string;
        password: string;
        fullName: string;
        phone?: string;
        roleId: number;
      };

      // Validate required fields
      if (!username || !email || !password || !fullName || !roleId) {
        set.status = 400;
        return { success: false, error: 'กรุณากรอกข้อมูลให้ครบถ้วน' };
      }

      // Check if user already exists
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ username }, { email }]
        }
      });

      if (existingUser) {
        set.status = 400;
        return { success: false, error: 'ชื่อผู้ใช้หรืออีเมลนี้มีอยู่ในระบบแล้ว' };
      }

      // Check if role exists
      const role = await prisma.role.findUnique({
        where: { id: roleId }
      });

      if (!role) {
        set.status = 400;
        return { success: false, error: 'บทบาทที่เลือกไม่ถูกต้อง' };
      }

      // Hash password
      const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "12");
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create user
      const newUser = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
          fullName,
          phone,
          roleId,
          isActive: true
        },
        include: {
          role: {
            select: {
              id: true,
              name: true,
              description: true
            }
          }
        }
      });

      const { password: _, ...userWithoutPassword } = newUser;

      return {
        success: true,
        message: 'เพิ่มผู้ใช้สำเร็จ',
        data: userWithoutPassword
      };
    } catch (error) {
      console.error('Create user error:', error);
      set.status = 500;
      return { success: false, error: 'เกิดข้อผิดพลาดในการเพิ่มผู้ใช้' };
    }
  })

  // Update user (Admin only)
  .put("/:id", async ({ headers, params, body, set }) => {
    try {
      await verifyAdminToken(headers);

      const userId = parseInt(params.id);
      if (!userId) {
        set.status = 400;
        return { success: false, error: 'Invalid user ID' };
      }

      const { username, email, fullName, phone, roleId, isActive, password } = body as {
        username?: string;
        email?: string;
        fullName?: string;
        phone?: string;
        roleId?: number;
        isActive?: boolean;
        password?: string;
      };

      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!existingUser) {
        set.status = 404;
        return { success: false, error: 'ไม่พบผู้ใช้ที่ต้องการแก้ไข' };
      }

      // Check for duplicate username/email (excluding current user)
      if (username || email) {
        const duplicateCheck = await prisma.user.findFirst({
          where: {
            AND: [
              { id: { not: userId } },
              {
                OR: [
                  ...(username ? [{ username }] : []),
                  ...(email ? [{ email }] : [])
                ]
              }
            ]
          }
        });

        if (duplicateCheck) {
          set.status = 400;
          return { success: false, error: 'ชื่อผู้ใช้หรืออีเมลนี้มีอยู่ในระบบแล้ว' };
        }
      }

      // Check if role exists (if roleId provided)
      if (roleId) {
        const role = await prisma.role.findUnique({
          where: { id: roleId }
        });

        if (!role) {
          set.status = 400;
          return { success: false, error: 'บทบาทที่เลือกไม่ถูกต้อง' };
        }
      }

      // Prepare update data
      const updateData: any = {};
      if (username) updateData.username = username;
      if (email) updateData.email = email;
      if (fullName) updateData.fullName = fullName;
      if (phone !== undefined) updateData.phone = phone;
      if (roleId) updateData.roleId = roleId;
      if (isActive !== undefined) updateData.isActive = isActive;

      // Hash password if provided
      if (password) {
        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "12");
        updateData.password = await bcrypt.hash(password, saltRounds);
      }

      // Update user
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updateData,
        include: {
          role: {
            select: {
              id: true,
              name: true,
              description: true
            }
          }
        }
      });

      const { password: _, ...userWithoutPassword } = updatedUser;

      return {
        success: true,
        message: 'อัปเดตข้อมูลผู้ใช้สำเร็จ',
        data: userWithoutPassword
      };
    } catch (error) {
      console.error('Update user error:', error);
      set.status = 500;
      return { success: false, error: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูลผู้ใช้' };
    }
  })

  // Delete user (Admin only)
  .delete("/:id", async ({ headers, params, set }) => {
    try {
      const adminUser = await verifyAdminToken(headers);

      const userId = parseInt(params.id);
      if (!userId) {
        set.status = 400;
        return { success: false, error: 'Invalid user ID' };
      }

      // Check if user exists
      const userToDelete = await prisma.user.findUnique({
        where: { id: userId },
        include: { role: true }
      });

      if (!userToDelete) {
        set.status = 404;
        return { success: false, error: 'ไม่พบผู้ใช้ที่ต้องการลบ' };
      }

      // Prevent admin from deleting themselves
      if (userToDelete.id === adminUser.id) {
        set.status = 400;
        return { success: false, error: 'ไม่สามารถลบบัญชีของตนเองได้' };
      }

      // Prevent deletion of other admin users (optional)
      if (userToDelete.role.name === 'admin') {
        set.status = 400;
        return { success: false, error: 'ไม่สามารถลบบัญชีผู้ดูแลระบบได้' };
      }

      // Soft delete (deactivate) instead of hard delete to preserve data integrity
      await prisma.user.update({
        where: { id: userId },
        data: { isActive: false }
      });

      return {
        success: true,
        message: 'ปิดการใช้งานบัญชีผู้ใช้สำเร็จ'
      };
    } catch (error) {
      console.error('Delete user error:', error);
      set.status = 500;
      return { success: false, error: 'เกิดข้อผิดพลาดในการลบผู้ใช้' };
    }
  })

  // Get all roles (for dropdown)
  .get("/roles/list", async ({ headers, set }) => {
    try {
      await verifyAdminToken(headers);

      const roles = await prisma.role.findMany({
        select: {
          id: true,
          name: true,
          description: true
        },
        orderBy: { id: 'asc' }
      });

      return {
        success: true,
        data: roles
      };
    } catch (error) {
      console.error('Get roles error:', error);
      set.status = error instanceof Error && error.message.includes('token') ? 401 : 
                   error instanceof Error && error.message.includes('permission') ? 403 : 500;
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch roles' 
      };
    }
  })

  // Toggle user status (activate/deactivate)
  .patch("/:id/toggle-status", async ({ headers, params, set }) => {
    try {
      const adminUser = await verifyAdminToken(headers);

      const userId = parseInt(params.id);
      if (!userId) {
        set.status = 400;
        return { success: false, error: 'Invalid user ID' };
      }

      const userToToggle = await prisma.user.findUnique({
        where: { id: userId },
        include: { role: true }
      });

      if (!userToToggle) {
        set.status = 404;
        return { success: false, error: 'ไม่พบผู้ใช้' };
      }

      // Prevent admin from deactivating themselves
      if (userToToggle.id === adminUser.id) {
        set.status = 400;
        return { success: false, error: 'ไม่สามารถเปลี่ยนสถานะบัญชีของตนเองได้' };
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { isActive: !userToToggle.isActive },
        include: {
          role: {
            select: {
              id: true,
              name: true,
              description: true
            }
          }
        }
      });

      const { password, ...userWithoutPassword } = updatedUser;

      return {
        success: true,
        message: `${updatedUser.isActive ? 'เปิด' : 'ปิด'}การใช้งานบัญชีสำเร็จ`,
        data: userWithoutPassword
      };
    } catch (error) {
      console.error('Toggle user status error:', error);
      set.status = 500;
      return { success: false, error: 'เกิดข้อผิดพลาดในการเปลี่ยนสถานะผู้ใช้' };
    }
  })

  // Get user stats (Admin only)
  .get("/stats", async ({ headers, set }) => {
    try {
      await verifyAdminToken(headers);

      const totalUsers = await prisma.user.count();
      const activeUsers = await prisma.user.count({
        where: { isActive: true }
      });
      
      const usersByRole = await prisma.user.groupBy({
        by: ['roleId'],
        _count: {
          id: true
        }
      });

      // Get role details separately
      const roles = await prisma.role.findMany();
      const roleMap = roles.reduce((acc, role) => {
        acc[role.id] = role;
        return acc;
      }, {} as Record<number, any>);

      const recentUsers = await prisma.user.findMany({
        take: 5,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          role: true
        }
      });

      // Get user registrations in last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const newUsersThisMonth = await prisma.user.count({
        where: {
          createdAt: {
            gte: thirtyDaysAgo
          }
        }
      });

      return {
        success: true,
        data: {
          totalUsers,
          activeUsers,
          inactiveUsers: totalUsers - activeUsers,
          newUsersThisMonth,
          usersByRole: usersByRole.map(item => ({
            roleId: item.roleId,
            roleName: roleMap[item.roleId]?.name || 'Unknown',
            count: item._count.id
          })),
          recentUsers: recentUsers.map(user => ({
            id: user.id,
            username: user.username,
            fullName: user.fullName,
            role: user.role.name,
            createdAt: user.createdAt
          }))
        }
      };
    } catch (error) {
      console.error("Get user stats error:", error);
      set.status = 500;
      return { error: "เกิดข้อผิดพลาดในการดึงสถิติผู้ใช้" };
    }
  })

  // Get current user profile
  .get("/profile", async ({ headers, set }) => {
    try {
      const authHeader = headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        set.status = 401;
        return { error: "ไม่พบ authorization header" };
      }

      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as any;
      
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        include: {
          role: {
            select: {
              id: true,
              name: true,
              description: true
            }
          }
        }
      });

      if (!user) {
        set.status = 404;
        return { error: "ไม่พบข้อมูลผู้ใช้" };
      }

      if (!user.isActive) {
        set.status = 403;
        return { error: "บัญชีผู้ใช้ถูกระงับ" };
      }

      const { password, ...userWithoutPassword } = user;
      
      return {
        success: true,
        data: {
          ...userWithoutPassword,
          profileImage: user.profileImage || '/images/default-avatar.png'
        }
      };
    } catch (error) {
      console.error("Get profile error:", error);
      set.status = 500;
      return { error: "เกิดข้อผิดพลาดในการดึงข้อมูลโปรไฟล์" };
    }
  })

  // Update current user profile
  .put("/profile", async ({ headers, body, set }) => {
    try {
      const authHeader = headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        set.status = 401;
        return { error: "ไม่พบ authorization header" };
      }

      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as any;
      
      const { fullName, phone, profileImage, currentPassword, newPassword } = body as any;

      // Get current user
      const currentUser = await prisma.user.findUnique({
        where: { id: decoded.userId }
      });

      if (!currentUser) {
        set.status = 404;
        return { error: "ไม่พบข้อมูลผู้ใช้" };
      }

      // Prepare update data
      const updateData: any = {
        fullName,
        phone,
        profileImage,
        updatedAt: new Date()
      };

      // Handle password change
      if (newPassword) {
        if (!currentPassword) {
          set.status = 400;
          return { error: "กรุณาใส่รหัสผ่านปัจจุบัน" };
        }

        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, currentUser.password);
        if (!isCurrentPasswordValid) {
          set.status = 400;
          return { error: "รหัสผ่านปัจจุบันไม่ถูกต้อง" };
        }

        updateData.password = await bcrypt.hash(newPassword, 10);
      }

      const updatedUser = await prisma.user.update({
        where: { id: decoded.userId },
        data: updateData,
        include: {
          role: {
            select: {
              id: true,
              name: true,
              description: true
            }
          }
        }
      });

      const { password, ...userWithoutPassword } = updatedUser;

      return {
        success: true,
        message: "อัปเดตโปรไฟล์สำเร็จ",
        data: {
          ...userWithoutPassword,
          profileImage: updatedUser.profileImage || '/images/default-avatar.png'
        }
      };
    } catch (error) {
      console.error("Update profile error:", error);
      set.status = 500;
      return { error: "เกิดข้อผิดพลาดในการอัปเดตโปรไฟล์" };
    }
  })

  // Upload avatar
  .post("/upload-avatar", async ({ headers, body, set }) => {
    try {
      const authHeader = headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        set.status = 401;
        return { error: "ไม่พบ authorization header" };
      }

      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as any;
      
      // ตรวจสอบว่ามีไฟล์หรือไม่
      if (!body || !(body as any).avatar) {
        set.status = 400;
        return { error: "กรุณาเลือกไฟล์รูปภาพ" };
      }

      const file = (body as any).avatar as File;
      
      // ตรวจสอบประเภทไฟล์
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        set.status = 400;
        return { error: "อนุญาตเฉพาะไฟล์รูปภาพ (JPG, PNG, GIF, WebP)" };
      }

      // ตรวจสอบขนาดไฟล์ (5MB)
      if (file.size > 5 * 1024 * 1024) {
        set.status = 400;
        return { error: "ขนาดไฟล์ต้องไม่เกิน 5MB" };
      }

      // สร้างชื่อไฟล์ใหม่
      const timestamp = Date.now();
      const ext = file.name.split('.').pop() || 'jpg';
      const filename = `user-${decoded.userId}-${timestamp}.${ext}`;
      
      // บันทึกไฟล์
      const uploadsDir = './uploads/profiles';
      const fs = require('fs');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const filePath = `${uploadsDir}/${filename}`;
      const buffer = await file.arrayBuffer();
      fs.writeFileSync(filePath, Buffer.from(buffer));

      // ลบรูปเก่า (ถ้ามี)
      const currentUser = await prisma.user.findUnique({
        where: { id: decoded.userId }
      });

      if (currentUser?.profileImage && currentUser.profileImage.startsWith('/uploads/')) {
        const oldFilePath = `.${currentUser.profileImage}`;
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }

      // อัปเดต database
      const profileImageUrl = `/uploads/profiles/${filename}`;
      const updatedUser = await prisma.user.update({
        where: { id: decoded.userId },
        data: { 
          profileImage: profileImageUrl,
          updatedAt: new Date()
        },
        include: {
          role: {
            select: {
              id: true,
              name: true,
              description: true
            }
          }
        }
      });

      const { password, ...userWithoutPassword } = updatedUser;

      return {
        success: true,
        message: "อัปโหลดรูปโปรไฟล์สำเร็จ",
        data: {
          ...userWithoutPassword,
          profileImage: updatedUser.profileImage
        }
      };
    } catch (error) {
      console.error("Upload avatar error:", error);
      set.status = 500;
      return { error: "เกิดข้อผิดพลาดในการอัปโหลดรูป" };
    }
  });