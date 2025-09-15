'use client';

import { DashboardLayout } from "@/components";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Users, UserPlus, UserCheck, UserX, AlertCircle } from "lucide-react";

// Mock data - ในอนาคตจะดึงจาก API
const usersStats = {
  total: 1250,
  active: 1180,
  inactive: 70,
  newThisMonth: 45
};

const recentUsers = [
  { id: 1, name: "สมชาย ใจดี", email: "somchai@email.com", role: "customer", status: "active", joinDate: "2024-09-15" },
  { id: 2, name: "สมหญิง รักเรียน", email: "somying@email.com", role: "shop_owner", status: "active", joinDate: "2024-09-14" },
  { id: 3, name: "วิชัย สู้ไฟ", email: "wichai@email.com", role: "customer", status: "inactive", joinDate: "2024-09-13" },
  { id: 4, name: "นิดา ใส่ใจ", email: "nida@email.com", role: "finance", status: "active", joinDate: "2024-09-12" },
  { id: 5, name: "ประยุทธ์ มั่นใจ", email: "prayut@email.com", role: "customer", status: "active", joinDate: "2024-09-11" }
];

const getRoleBadgeVariant = (role: string) => {
  switch (role) {
    case 'admin': return 'default';
    case 'shop_owner': return 'secondary';
    case 'finance': return 'outline';
    case 'customer': return 'outline';
    default: return 'outline';
  }
};

const getRoleText = (role: string) => {
  switch (role) {
    case 'admin': return 'ผู้ดูแลระบบ';
    case 'shop_owner': return 'เจ้าของร้าน';
    case 'finance': return 'การเงิน';
    case 'customer': return 'ลูกค้า';
    default: return role;
  }
};

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'active': return 'default';
    case 'inactive': return 'secondary';
    default: return 'outline';
  }
};

export default function AdminUsersPage() {
  return (
    <DashboardLayout title="จัดการผู้ใช้">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ผู้ใช้ทั้งหมด</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usersStats.total.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">จำนวนผู้ใช้ในระบบ</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ผู้ใช้ที่ใช้งาน</CardTitle>
              <UserCheck className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{usersStats.active.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {((usersStats.active / usersStats.total) * 100).toFixed(1)}% ของผู้ใช้ทั้งหมด
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ผู้ใช้ไม่ใช้งาน</CardTitle>
              <UserX className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{usersStats.inactive}</div>
              <p className="text-xs text-muted-foreground">
                {((usersStats.inactive / usersStats.total) * 100).toFixed(1)}% ของผู้ใช้ทั้งหมด
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">สมาชิกใหม่เดือนนี้</CardTitle>
              <UserPlus className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{usersStats.newThisMonth}</div>
              <p className="text-xs text-muted-foreground">+12% จากเดือนที่แล้ว</p>
            </CardContent>
          </Card>
        </div>

        {/* Alert */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>การจัดการผู้ใช้</AlertTitle>
          <AlertDescription>
            คุณสามารถจัดการสิทธิ์ การเปิด/ปิดการใช้งาน และดูรายละเอียดของผู้ใช้ทั้งหมดในระบบได้ที่นี่
          </AlertDescription>
        </Alert>

        {/* Recent Users Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>ผู้ใช้ล่าสุด</CardTitle>
                <CardDescription>รายชื่อผู้ใช้ที่เข้าร่วมระบบล่าสุด</CardDescription>
              </div>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                เพิ่มผู้ใช้ใหม่
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers.map((user, index) => (
                <div key={user.id}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-card-foreground">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={getRoleBadgeVariant(user.role)}>
                        {getRoleText(user.role)}
                      </Badge>
                      <Badge variant={getStatusBadgeVariant(user.status)}>
                        {user.status === 'active' ? 'ใช้งาน' : 'ไม่ใช้งาน'}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(user.joinDate).toLocaleDateString('th-TH')}
                      </span>
                      <Button variant="outline" size="sm">
                        จัดการ
                      </Button>
                    </div>
                  </div>
                  {index < recentUsers.length - 1 && <Separator className="mt-4 bg-border" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}