'use client'

import React, { useState } from 'react'
import { DashboardLayout } from '@/components/DashboardLayout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts'
import { 
  TrendingUp, TrendingDown, DollarSign, ShoppingCart, 
  Users, Calendar, Download, Filter, Search, Target,
  Activity, Award, ChevronRight, Clock
} from 'lucide-react'

interface SalesData {
  period: string;
  totalSales: number;
  orderCount: number;
  avgOrderValue: number;
  newCustomers: number;
  growth?: number;
}

interface TopRestaurant {
  id: string;
  name: string;
  sales: number;
  orders: number;
  growth: number;
  avgRating: number;
  image: string;
}

interface SalesMetrics {
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  totalCustomers: number;
  growthRate: number;
  conversionRate: number;
}

export default function FinanceSalesPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('7days')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [activeTab, setActiveTab] = useState('overview')

  // Mock sales data
  const salesData: SalesData[] = [
    { period: 'Mon', totalSales: 45000, orderCount: 245, avgOrderValue: 183.67, newCustomers: 32 },
    { period: 'Tue', totalSales: 52000, orderCount: 289, avgOrderValue: 180.28, newCustomers: 45 },
    { period: 'Wed', totalSales: 48000, orderCount: 267, avgOrderValue: 179.78, newCustomers: 38 },
    { period: 'Thu', totalSales: 58000, orderCount: 312, avgOrderValue: 185.90, newCustomers: 52 },
    { period: 'Fri', totalSales: 67000, orderCount: 378, avgOrderValue: 177.25, newCustomers: 68 },
    { period: 'Sat', totalSales: 78000, orderCount: 445, avgOrderValue: 175.28, newCustomers: 89 },
    { period: 'Sun', totalSales: 72000, orderCount: 398, avgOrderValue: 180.90, newCustomers: 76 }
  ]

  const monthlySalesData = [
    { month: 'Jan', sales: 1420000, orders: 8450, avgOrder: 168 },
    { month: 'Feb', sales: 1380000, orders: 8200, avgOrder: 168 },
    { month: 'Mar', sales: 1520000, orders: 9100, avgOrder: 167 },
    { month: 'Apr', sales: 1680000, orders: 9800, avgOrder: 171 },
    { month: 'May', sales: 1750000, orders: 10200, avgOrder: 172 },
    { month: 'Jun', sales: 1890000, orders: 11000, avgOrder: 172 }
  ]

  const categoryData = [
    { name: 'Thai Food', value: 35, color: '#8B5CF6' },
    { name: 'Japanese', value: 25, color: '#06B6D4' },
    { name: 'Western', value: 20, color: '#10B981' },
    { name: 'Chinese', value: 12, color: '#F59E0B' },
    { name: 'Others', value: 8, color: '#EF4444' }
  ]

  const topRestaurants: TopRestaurant[] = [
    {
      id: '1',
      name: 'Golden Thai Kitchen',
      sales: 125000,
      orders: 678,
      growth: 15.2,
      avgRating: 4.8,
      image: '/api/placeholder/60/60'
    },
    {
      id: '2', 
      name: 'Sakura Sushi Bar',
      sales: 98000,
      orders: 543,
      growth: 12.8,
      avgRating: 4.7,
      image: '/api/placeholder/60/60'
    },
    {
      id: '3',
      name: 'Bella Italia',
      sales: 87000,
      orders: 489,
      growth: 8.5,
      avgRating: 4.6,
      image: '/api/placeholder/60/60'
    },
    {
      id: '4',
      name: 'Dragon Palace',
      sales: 76000,
      orders: 412,
      growth: 10.3,
      avgRating: 4.5,
      image: '/api/placeholder/60/60'
    },
    {
      id: '5',
      name: 'Burger Junction',
      sales: 65000,
      orders: 398,
      growth: 6.7,
      avgRating: 4.4,
      image: '/api/placeholder/60/60'
    }
  ]

  const currentMetrics: SalesMetrics = {
    totalRevenue: 420000,
    totalOrders: 2334,
    avgOrderValue: 180,
    totalCustomers: 1876,
    growthRate: 12.5,
    conversionRate: 3.2
  }

  const hourlyData = [
    { hour: '6AM', orders: 12, sales: 2100 },
    { hour: '7AM', orders: 28, sales: 4900 },
    { hour: '8AM', orders: 45, sales: 8100 },
    { hour: '9AM', orders: 38, sales: 6800 },
    { hour: '10AM', orders: 32, sales: 5700 },
    { hour: '11AM', orders: 52, sales: 9400 },
    { hour: '12PM', orders: 89, sales: 16200 },
    { hour: '1PM', orders: 95, sales: 17100 },
    { hour: '2PM', orders: 67, sales: 12100 },
    { hour: '3PM', orders: 43, sales: 7700 },
    { hour: '4PM', orders: 38, sales: 6800 },
    { hour: '5PM', orders: 56, sales: 10100 },
    { hour: '6PM', orders: 87, sales: 15700 },
    { hour: '7PM', orders: 102, sales: 18400 },
    { hour: '8PM', orders: 98, sales: 17600 },
    { hour: '9PM', orders: 76, sales: 13700 },
    { hour: '10PM', orders: 54, sales: 9700 },
    { hour: '11PM', orders: 32, sales: 5800 }
  ]

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Sales Analytics</h1>
            <p className="text-muted-foreground">
              Track sales performance, revenue trends, and customer insights
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">7 Days</SelectItem>
                <SelectItem value="30days">30 Days</SelectItem>
                <SelectItem value="90days">90 Days</SelectItem>
                <SelectItem value="1year">1 Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">₿{currentMetrics.totalRevenue.toLocaleString()}</p>
                <div className="flex items-center text-sm text-green-600 mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +{currentMetrics.growthRate}%
                </div>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{currentMetrics.totalOrders.toLocaleString()}</p>
                <div className="flex items-center text-sm text-green-600 mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +8.2%
                </div>
              </div>
              <ShoppingCart className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Order Value</p>
                <p className="text-2xl font-bold">₿{currentMetrics.avgOrderValue}</p>
                <div className="flex items-center text-sm text-green-600 mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +3.1%
                </div>
              </div>
              <Target className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Customers</p>
                <p className="text-2xl font-bold">{currentMetrics.totalCustomers.toLocaleString()}</p>
                <div className="flex items-center text-sm text-green-600 mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +15.3%
                </div>
              </div>
              <Users className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold">{currentMetrics.conversionRate}%</p>
                <div className="flex items-center text-sm text-green-600 mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +0.5%
                </div>
              </div>
              <Activity className="w-8 h-8 text-pink-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Growth Rate</p>
                <p className="text-2xl font-bold">{currentMetrics.growthRate}%</p>
                <div className="flex items-center text-sm text-green-600 mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +2.1%
                </div>
              </div>
              <Award className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="restaurants">Top Restaurants</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Daily Sales Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₿${value.toLocaleString()}`, 'Sales']} />
                    <Area type="monotone" dataKey="totalSales" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.1} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Orders vs Average Order Value</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Bar yAxisId="left" dataKey="orderCount" fill="#06B6D4" name="Orders" />
                    <Line yAxisId="right" type="monotone" dataKey="avgOrderValue" stroke="#F59E0B" name="Avg Order Value" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Hourly Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Hourly Sales Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Line yAxisId="left" type="monotone" dataKey="orders" stroke="#8B5CF6" name="Orders" strokeWidth={2} />
                  <Line yAxisId="right" type="monotone" dataKey="sales" stroke="#10B981" name="Sales (₿)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Revenue Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={monthlySalesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₿${value.toLocaleString()}`, 'Revenue']} />
                    <Area type="monotone" dataKey="sales" stroke="#10B981" fill="#10B981" fillOpacity={0.2} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>New Customer Acquisition</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="newCustomers" fill="#F59E0B" name="New Customers" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="restaurants" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle>Top Performing Restaurants</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                    <Input
                      placeholder="Search restaurants..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 w-64"
                    />
                  </div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="thai">Thai Food</SelectItem>
                      <SelectItem value="japanese">Japanese</SelectItem>
                      <SelectItem value="western">Western</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topRestaurants.map((restaurant, index) => (
                  <div key={restaurant.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
                        {index + 1}
                      </div>
                      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                        <div className="w-8 h-8 rounded bg-gradient-to-br from-orange-400 to-pink-400"></div>
                      </div>
                      <div>
                        <h3 className="font-semibold">{restaurant.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>★ {restaurant.avgRating}</span>
                          <span>{restaurant.orders} orders</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₿{restaurant.sales.toLocaleString()}</p>
                      <div className="flex items-center text-sm text-green-600">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +{restaurant.growth}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sales by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Share']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryData.map((category) => (
                    <div key={category.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded" 
                          style={{ backgroundColor: category.color }}
                        ></div>
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{category.value}%</div>
                        <div className="text-sm text-muted-foreground">of total sales</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      </div>
    </DashboardLayout>
  )
}