import { Elysia, t } from "elysia";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const authRoutes = new Elysia({ prefix: "/auth" })
  .post("/register", async ({ body, set }) => {
    try {
      const { username, email, password, fullName, phone, roleId } = body as {
        username: string;
        email: string;
        password: string;
        fullName: string;
        phone?: string;
        roleId?: number;
      };

      // Validate required fields
      if (!username || !email || !password || !fullName) {
        set.status = 400;
        return { error: "กรุณากรอกข้อมูลให้ครบถ้วน" };
      }

      // Check if user already exists
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ username }, { email }]
        }
      });

      if (existingUser) {
        set.status = 400;
        return { error: "ชื่อผู้ใช้หรืออีเมลนี้มีอยู่ในระบบแล้ว" };
      }

      // Hash password with high salt rounds for security
      const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "12");
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Default to customer role if not specified
      const defaultRoleId = roleId || 3;

      // Create user
      const user = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
          fullName,
          phone,
          roleId: defaultRoleId
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

      // Generate JWT token
      const token = jwt.sign(
        {
          userId: user.id,
          username: user.username,
          email: user.email,
          role: user.role.name
        },
        process.env.JWT_SECRET || "your-secret-key",
        { expiresIn: process.env.JWT_EXPIRES_IN || "7d" } as jwt.SignOptions
      );

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      set.status = 201;
      return {
        message: "สมัครสมาชิกสำเร็จ",
        user: userWithoutPassword,
        token
      };
    } catch (error) {
      console.error("Register error:", error);
      set.status = 500;
      return { error: "เกิดข้อผิดพลาดในการสมัครสมาชิก" };
    }
  })
  .post("/login", async ({ body, set }) => {
    try {
      const { username, password } = body as {
        username: string;
        password: string;
      };

      if (!username || !password) {
        set.status = 400;
        return { error: "กรุณากรอกชื่อผู้ใช้และรหัสผ่าน" };
      }

      // Find user by username or email
      const user = await prisma.user.findFirst({
        where: {
          AND: [
            { isActive: true },
            {
              OR: [{ username }, { email: username }]
            }
          ]
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

      if (!user) {
        set.status = 401;
        return { error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" };
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        set.status = 401;
        return { error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" };
      }

      // Update last login
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() }
      });

      // Generate JWT token
      const token = jwt.sign(
        {
          userId: user.id,
          username: user.username,
          email: user.email,
          role: user.role.name
        },
        process.env.JWT_SECRET || "your-secret-key",
        { expiresIn: process.env.JWT_EXPIRES_IN || "7d" } as jwt.SignOptions
      );

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      return {
        message: "เข้าสู่ระบบสำเร็จ",
        user: userWithoutPassword,
        token
      };
    } catch (error) {
      console.error("Login error:", error);
      set.status = 500;
      return { error: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ" };
    }
  })
  .post("/verify-token", async ({ headers, set }) => {
    try {
      const authHeader = headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        set.status = 401;
        return { error: "ไม่พบ token การยืนยันตัวตน" };
      }

      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as any;

      // Get fresh user data
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

      if (!user || !user.isActive) {
        set.status = 401;
        return { error: "ผู้ใช้ไม่พบหรือถูกระงับการใช้งาน" };
      }

      const { password: _, ...userWithoutPassword } = user;

      return {
        message: "Token ถูกต้อง",
        user: userWithoutPassword
      };
    } catch (error) {
      console.error("Token verification error:", error);
      set.status = 401;
      return { error: "Token ไม่ถูกต้องหรือหมดอายุ" };
    }
  })
  
  .post("/forgot-password", async ({ body, set }) => {
    try {
      const { email } = body as { email: string };

      if (!email) {
        set.status = 400;
        return { error: "กรุณากรอกอีเมล" };
      }

      // Check if email exists
      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        set.status = 404;
        return { error: "ไม่พบอีเมลในระบบ" };
      }

      return {
        message: "พบอีเมลในระบบ สามารถตั้งรหัสผ่านใหม่ได้"
      };
    } catch (error) {
      console.error("Forgot password error:", error);
      set.status = 500;
      return { error: "เกิดข้อผิดพลาดในระบบ" };
    }
  })
  
  .post("/reset-password", async ({ body, set }) => {
    try {
      const { email, newPassword } = body as { email: string; newPassword: string };

      if (!email || !newPassword) {
        set.status = 400;
        return { error: "กรุณากรอกข้อมูลให้ครบถ้วน" };
      }

      // Check if email exists
      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        set.status = 404;
        return { error: "ไม่พบอีเมลในระบบ" };
      }

      // Hash new password
      const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "12");
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      // Update password
      await prisma.user.update({
        where: { email },
        data: { password: hashedPassword }
      });

      return {
        message: "เปลี่ยนรหัสผ่านสำเร็จ"
      };
    } catch (error) {
      console.error("Reset password error:", error);
      set.status = 500;
      return { error: "เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน" };
    }
  });