'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Download, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Users,
  Star,
  Clock,
  Target,
  Loader2
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { useState, useEffect } from "react";
import { getShopReports, ShopReportData } from "@/utils/reportApi";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function ShopReportsPage() {
  const [timeRange, setTimeRange] = useState("month");
  const [reportData, setReportData] = useState<ShopReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ดึงข้อมูลจาก API
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getShopReports();
        setReportData(data);
      } catch (err) {
        console.error('Error fetching reports:', err);
        setError('ไม่สามารถดึงข้อมูลรายงานได้');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, [timeRange]); // เมื่อเปลี่ยน timeRange ให้โหลดใหม่

  // ถ้ากำลังโหลด
  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">รายงานยอดขาย</h1>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-orange-500" />
            <p className="text-gray-600">กำลังโหลดข้อมูลรายงาน...</p>
          </div>
        </div>
      </div>
    );
  }

  // ถ้ามี error
  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">รายงานยอดขาย</h1>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              ลองใหม่อีกครั้ง
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ถ้าไม่มีข้อมูล
  if (!reportData) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">รายงานยอดขาย</h1>
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-gray-600">ไม่พบข้อมูลรายงาน</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">รายงานยอดขาย</h1>
      
      <div className="space-y-6">
        {/* Header with Export */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">รายงานประสิทธิภาพร้าน</h2>
            <p className="text-muted-foreground">ข้อมูลการดำเนินงานและการเติบโตของร้าน</p>
          </div>
          <div className="flex items-center gap-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">สัปดาห์นี้</SelectItem>
                <SelectItem value="month">เดือนนี้</SelectItem>
                <SelectItem value="quarter">ไตรมาสนี้</SelectItem>
                <SelectItem value="year">ปีนี้</SelectItem>
              </SelectContent>
            </Select>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              ส่งออกรายงาน
            </Button>
          </div>
        </div>

        {/* Performance Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportData.performanceStats.map((stat) => {
            const getIcon = (label: string) => {
              switch (label) {
                case "รายได้เดือนนี้": return DollarSign;
                case "คำสั่งซื้อเดือนนี้": return ShoppingBag;
                case "ลูกค้าใหม่": return Users;
                case "คะแนนเฉลี่ย": return Star;
                case "เวลาเตรียมเฉลี่ย": return Clock;
                case "เป้าหมายรายได้": return Target;
                default: return DollarSign;
              }
            };
            const IconComponent = getIcon(stat.label);
            return (
              <Card key={stat.label}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {stat.changeType === "increase" ? (
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-600" />
                        )}
                        <span className={`text-sm ${stat.changeType === "increase" ? "text-green-600" : "text-red-600"}`}>
                          {stat.change}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                    </div>
                    <div className="p-2 bg-muted rounded-full">
                      <IconComponent className="h-6 w-6 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle>รายได้รายเดือน</CardTitle>
              <CardDescription>เปรียบเทียบรายได้ คำสั่งซื้อ และลูกค้าใหม่</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={reportData.salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'revenue' ? `฿${value.toLocaleString()}` : value,
                      name === 'revenue' ? 'รายได้' : name === 'orders' ? 'คำสั่งซื้อ' : 'ลูกค้าใหม่'
                    ]}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} name="รายได้" />
                  <Line type="monotone" dataKey="orders" stroke="#82ca9d" strokeWidth={2} name="คำสั่งซื้อ" />
                  <Line type="monotone" dataKey="customers" stroke="#ffc658" strokeWidth={2} name="ลูกค้าใหม่" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Weekly Performance */}
          <Card>
            <CardHeader>
              <CardTitle>ประสิทธิภาพรายสัปดาห์</CardTitle>
              <CardDescription>คำสั่งซื้อและรายได้รายวัน</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={reportData.weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'revenue' ? `฿${value.toLocaleString()}` : `${value} คำสั่ง`,
                      name === 'revenue' ? 'รายได้' : 'คำสั่งซื้อ'
                    ]}
                  />
                  <Legend />
                  <Bar dataKey="orders" fill="#8884d8" name="คำสั่งซื้อ" />
                  <Bar dataKey="revenue" fill="#82ca9d" name="รายได้" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Menu Items */}
          <Card>
            <CardHeader>
              <CardTitle>เมนูยอดนิยม</CardTitle>
              <CardDescription>เมนูที่ขายดีที่สุด 5 อันดับ</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportData.topMenuItems.map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.orders} คำสั่งซื้อ • ฿{item.revenue.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline">{item.percentage}%</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sales Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>การกระจายยอดขาย</CardTitle>
              <CardDescription>สัดส่วนยอดขายตามเมนู</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={reportData.topMenuItems}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name} ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="percentage"
                  >
                    {reportData.topMenuItems.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'สัดส่วน']} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Summary Insights */}
        <Card>
          <CardHeader>
            <CardTitle>สรุปและข้อเสนะแนะ</CardTitle>
            <CardDescription>ข้อมูลเชิงลึกและแนวทางปรับปรุง</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-green-600">จุดแข็ง</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <span>รายได้เติบโตอย่างต่อเนื่อง 15.5% เมื่อเทียบกับเดือนที่แล้ว</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <span>คะแนนความพึงพอใจลูกค้าอยู่ในระดับสูง (4.6/5)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <span>เวลาการเตรียมอาหารลดลง ทำให้บริการเร็วขึ้น</span>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold text-orange-600">จุดที่ควรปรับปรุง</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <span>ยังไม่ถึงเป้าหมายรายได้ประจำเดือน (89%)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <span>ควรเพิ่มความหนอนหลายในเมนูเพื่อกระจายยอดขาย</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <span>วันจันทร์และพุธมียอดขายต่ำ ควรมีโปรโมชั่นพิเศษ</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}