# Food App Project

## คำอธิบายโปรเจ็กต์

โปรเจ็กต์ Food App เป็นแอปพลิเคชันสำหรับสั่งอาหารออนไลน์ที่ใช้ Docker Compose ในการรันระบบแบบ microservices

### เทคโนโลยีที่ใช้

**Backend:**
- Bun (JavaScript/TypeScript Runtime)
- Hono (Web Framework)
- Prisma (ORM)
- PostgreSQL (Database)

**Frontend:**
- Next.js 14 (React Framework)
- TypeScript
- Tailwind CSS

**Database:**
- PostgreSQL 16

## ขั้นตอนการเริ่มต้นโปรเจ็กต์

### 1. ตรวจสอบความพร้อม

ให้แน่ใจว่าคุณมีโปรแกรมต่อไปนี้ติดตั้งแล้ว:
- Docker
- Docker Compose

### 2. รันโปรเจ็กต์

```bash
# เข้าไปในโฟลเดอร์โปรเจ็กต์
cd /c/Users/thann/Desktop/MyProject/Foodapp

# รันโปรเจ็กต์ด้วย Docker Compose
docker-compose up --build
```

### 3. การเข้าถึงแอปพลิเคชัน

- **Frontend (เว็บไซต์):** http://localhost:3000
- **Backend API:** http://localhost:4000
- **Database:** localhost:5432 (username: postgres, password: postgres)

### 4. การหยุดโปรเจ็กต์

```bash
# หยุดและลบ containers
docker-compose down

# หยุดและลบ containers รวมถึง volumes
docker-compose down -v
```

## โครงสร้างโปรเจ็กต์

```
Foodapp/
├── docker-compose.yml          # การตั้งค่า Docker Compose
├── backend/                    # Backend API (Bun + Hono)
│   ├── Dockerfile
│   ├── package.json
│   ├── prisma/
│   │   └── schema.prisma      # Database Schema
│   └── src/
│       ├── index.ts           # Main server file
│       └── routes/            # API Routes
├── frontend/                   # Frontend (Next.js)
│   ├── Dockerfile
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   └── app/                   # Next.js App Router
└── db/
    └── init.sql               # Database initialization
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - สมัครสมาชิก
- `POST /api/auth/login` - เข้าสู่ระบบ

### Users
- `GET /api/users` - ดูรายชื่อผู้ใช้ทั้งหมด
- `GET /api/users/:id` - ดูข้อมูลผู้ใช้
- `PUT /api/users/:id` - แก้ไขข้อมูลผู้ใช้
- `DELETE /api/users/:id` - ลบผู้ใช้

### Menus
- `GET /api/menus` - ดูรายการอาหารทั้งหมด
- `GET /api/menus/:id` - ดูข้อมูลอาหาร
- `POST /api/menus` - เพิ่มรายการอาหาร
- `PUT /api/menus/:id` - แก้ไขรายการอาหาร
- `DELETE /api/menus/:id` - ลบรายการอาหาร

### Orders
- `GET /api/orders` - ดูรายการสั่งซื้อทั้งหมด
- `GET /api/orders/:id` - ดูข้อมูลการสั่งซื้อ
- `POST /api/orders` - สร้างการสั่งซื้อใหม่
- `PUT /api/orders/:id/status` - อัปเดตสถานะการสั่งซื้อ
- `POST /api/orders/:id/payments` - เพิ่มการชำระเงิน

## Database Schema

โปรเจ็กต์มี 6 ตารางหลัก:
1. **roles** - บทบาทผู้ใช้ (admin, shop_owner, customer)
2. **users** - ข้อมูลผู้ใช้
3. **menus** - รายการอาหาร
4. **orders** - การสั่งซื้อ
5. **order_items** - รายการอาหารในแต่ละออเดอร์
6. **payments** - การชำระเงิน

## การพัฒนาต่อ

### Backend Development
```bash
# เข้าไปใน backend container
docker-compose exec backend bash

# รัน Prisma commands
bun run db:generate    # Generate Prisma client
bun run db:push        # Push schema to database
bun run db:migrate     # Run migrations
bun run db:studio      # Open Prisma Studio
```

### Frontend Development
```bash
# เข้าไปใน frontend container
docker-compose exec frontend bash

# Install packages
npm install <package-name>
```

## การแก้ไขปัญหาเบื้องต้น

### ถ้า container ไม่สามารถรันได้
```bash
# ลบ containers และ images เก่า
docker-compose down -v
docker system prune -f

# Build ใหม่
docker-compose up --build
```

### ถ้า database connection error
1. ตรวจสอบว่า PostgreSQL container รันอยู่
2. ตรวจสอบ environment variables ใน docker-compose.yml
3. รอให้ database พร้อมก่อนที่ backend จะเริ่มต้น

### ถ้า frontend ไม่สามารถเรียก API ได้
1. ตรวจสอบ network configuration ใน docker-compose.yml
2. ตรวจสอบ CORS settings ใน backend
3. ตรวจสอบ proxy configuration ใน next.config.js

## สิ่งที่ต้องทำต่อไป

1. **เพิ่ม Authentication Middleware** - ป้องกัน API endpoints
2. **เพิ่มการ Validation** - ตรวจสอบข้อมูลที่ส่งมา
3. **เพิ่ม Error Handling** - จัดการ error ให้ดีขึ้น
4. **เพิ่ม UI Components** - สร้าง components สำหรับ login, cart, orders
5. **เพิ่ม Testing** - Unit tests และ Integration tests
6. **เพิ่ม Logging** - บันทึก logs สำหรับ debugging
7. **เพิ่ม File Upload** - สำหรับรูปภาพอาหาร
8. **เพิ่ม Real-time Updates** - WebSockets สำหรับ order status

## การติดต่อ

หากมีปัญหาหรือคำถาม สามารถสร้าง issue ใน repository นี้ได้เลยครับ