import multer from 'multer';
import path from 'path';
import fs from 'fs';

// สร้าง uploads directory ถ้ายังไม่มี
const uploadsDir = path.join(process.cwd(), 'uploads', 'profiles');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// กำหนดการจัดเก็บไฟล์
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // สร้างชื่อไฟล์ที่ไม่ซ้ำ: user-{userId}-{timestamp}.{ext}
    const userId = (req as any).user?.userId || 'unknown';
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const filename = `user-${userId}-${timestamp}${ext}`;
    cb(null, filename);
  }
});

// ตรวจสอบไฟล์
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // อนุญาตเฉพาะไฟล์รูปภาพ
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('อนุญาตเฉพาะไฟล์รูปภาพ (JPG, PNG, GIF, WebP)'));
  }
};

// กำหนดขนาดไฟล์สูงสุด (5MB)
const limits = {
  fileSize: 5 * 1024 * 1024 // 5MB
};

export const uploadAvatar = multer({
  storage,
  fileFilter,
  limits
});

// Utility function สำหรับลบไฟล์เก่า
export const deleteOldAvatar = (profileImageUrl: string | null) => {
  if (!profileImageUrl) return;
  
  try {
    // ตัดเอาเฉพาะชื่อไฟล์จาก URL
    const filename = path.basename(profileImageUrl);
    const filePath = path.join(uploadsDir, filename);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Deleted old avatar: ${filename}`);
    }
  } catch (error) {
    console.error('Error deleting old avatar:', error);
  }
};

// Utility function สำหรับสร้าง URL ของรูป
export const getAvatarUrl = (filename: string) => {
  return `/uploads/profiles/${filename}`;
};