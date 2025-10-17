'use client'

import React, { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/DashboardLayout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts'
import { 
  TrendingUp, TrendingDown, DollarSign, ShoppingCart, 
  Users, Calendar, Download, Filter, Search, Target,
  Activity, Award, ChevronRight, Clock, FileText, FileJson, Printer
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
  orderGrowthRate?: number;
  newCustomerCount?: number;
}

interface HourlyData {
  hour: string;
  orders: number;
  sales: number;
}

interface MonthlySalesData {
  month: string;
  sales: number;
  orders: number;
  avgOrder: number;
}

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

export default function FinanceSalesPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('7days')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)

  // State for data from API
  const [salesData, setSalesData] = useState<SalesData[]>([])
  const [monthlySalesData, setMonthlySalesData] = useState<MonthlySalesData[]>([])
  const [categoryData, setCategoryData] = useState<CategoryData[]>([])
  const [topRestaurants, setTopRestaurants] = useState<TopRestaurant[]>([])
  const [currentMetrics, setCurrentMetrics] = useState<SalesMetrics>({
    totalRevenue: 0,
    totalOrders: 0,
    avgOrderValue: 0,
    totalCustomers: 0,
    growthRate: 0,
    conversionRate: 0
  })
  const [hourlyData, setHourlyData] = useState<HourlyData[]>([])

  // Fetch sales data from API
  const fetchSalesData = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      
      const response = await fetch(`http://localhost:4000/api/finance/sales?period=${selectedPeriod}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch sales data')
      }

      const result = await response.json()

      if (result.success && result.data) {
        setCurrentMetrics(result.data.metrics)
        setSalesData(result.data.salesData || [])
        setHourlyData(result.data.hourlyData || [])
        setTopRestaurants(result.data.topRestaurants || [])
        setCategoryData(result.data.categoryData || [])
        setMonthlySalesData(result.data.monthlySalesData || [])
      }
    } catch (error) {
      console.error('Error fetching sales data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSalesData()
  }, [selectedPeriod])

  // Export to CSV
  const exportToCSV = () => {
    try {
      // UTF-8 BOM for proper Thai character encoding
      const BOM = '\uFEFF'
      
      // Create CSV content
      let csv = BOM + 'Sales Analytics Report\n'
      csv += `Period: ${selectedPeriod}\n`
      csv += `Generated: ${new Date().toLocaleString('th-TH')}\n\n`
      
      // Metrics Summary
      csv += 'METRICS SUMMARY\n'
      csv += 'Metric,Value\n'
      csv += `Total Revenue,₿${currentMetrics.totalRevenue.toLocaleString()}\n`
      csv += `Total Orders,${currentMetrics.totalOrders}\n`
      csv += `Average Order Value,₿${currentMetrics.avgOrderValue.toLocaleString()}\n`
      csv += `Total Customers,${currentMetrics.totalCustomers}\n`
      csv += `Growth Rate,${currentMetrics.growthRate}%\n`
      csv += `Conversion Rate,${currentMetrics.conversionRate}%\n\n`
      
      // Sales Data
      csv += 'SALES DATA\n'
      csv += 'Period,Total Sales,Orders,Avg Order Value,New Customers\n'
      salesData.forEach(item => {
        csv += `${item.period},₿${item.totalSales},${item.orderCount},₿${item.avgOrderValue},${item.newCustomers}\n`
      })
      csv += '\n'
      
      // Top Restaurants
      csv += 'TOP RESTAURANTS\n'
      csv += 'Rank,Name,Sales,Orders,Growth,Rating\n'
      topRestaurants.forEach((restaurant, index) => {
        csv += `${index + 1},${restaurant.name},₿${restaurant.sales.toLocaleString()},${restaurant.orders},${restaurant.growth}%,${restaurant.avgRating}\n`
      })
      csv += '\n'
      
      // Category Data
      csv += 'CATEGORY PERFORMANCE\n'
      csv += 'Category,Share %\n'
      categoryData.forEach(category => {
        csv += `${category.name},${category.value}%\n`
      })
      
      // Create and download
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `sales-analytics-${selectedPeriod}-${Date.now()}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // Cleanup
      setTimeout(() => URL.revokeObjectURL(url), 100)
    } catch (error) {
      console.error('Error exporting to CSV:', error)
      alert('เกิดข้อผิดพลาดในการส่งออกข้อมูล')
    }
  }

  // Export to JSON
  const exportToJSON = () => {
    try {
      const jsonData = {
        reportInfo: {
          title: 'Sales Analytics Report',
          period: selectedPeriod,
          generatedAt: new Date().toISOString(),
          generatedBy: 'Finance Team'
        },
        metrics: currentMetrics,
        salesData,
        hourlyData,
        topRestaurants,
        categoryData,
        monthlySalesData
      }
      
      const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `sales-analytics-${selectedPeriod}-${Date.now()}.json`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // Cleanup
      setTimeout(() => URL.revokeObjectURL(url), 100)
    } catch (error) {
      console.error('Error exporting to JSON:', error)
      alert('เกิดข้อผิดพลาดในการส่งออกข้อมูล')
    }
  }

  // Print Report
  const printReport = () => {
    window.print()
  }

  // Filter restaurants based on search and category
  const filteredRestaurants = topRestaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())
    // Category filtering would need category data from backend
    return matchesSearch
  })

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row lg:flex-row justify-between items-start sm:items-center lg:items-center gap-3 sm:gap-4">
          <div className="w-full sm:w-auto">
            <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">Sales Analytics</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Track sales performance, revenue trends, and customer insights
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">7 Days</SelectItem>
                <SelectItem value="30days">30 Days</SelectItem>
                <SelectItem value="90days">90 Days</SelectItem>
                <SelectItem value="1year">1 Year</SelectItem>
              </SelectContent>
            </Select>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="w-full sm:w-auto">
                  <Download className="w-4 h-4 mr-2" />
                  <span className="sm:inline">Export</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={exportToCSV}>
                  <FileText className="w-4 h-4 mr-2" />
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportToJSON}>
                  <FileJson className="w-4 h-4 mr-2" />
                  Export as JSON
                </DropdownMenuItem>
                <DropdownMenuItem onClick={printReport}>
                  <Printer className="w-4 h-4 mr-2" />
                  Print Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Total Revenue</p>
                <p className="text-xl sm:text-2xl font-bold truncate">₿{currentMetrics.totalRevenue.toLocaleString()}</p>
                <div className="flex items-center text-xs sm:text-sm text-green-600 mt-1">
                  <TrendingUp className="w-3 h-3 mr-1 flex-shrink-0" />
                  <span className="truncate">+{currentMetrics.growthRate}%</span>
                </div>
              </div>
              <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 flex-shrink-0 ml-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Total Orders</p>
                <p className="text-xl sm:text-2xl font-bold truncate">{currentMetrics.totalOrders.toLocaleString()}</p>
                <div className="flex items-center text-xs sm:text-sm text-green-600 mt-1">
                  <TrendingUp className="w-3 h-3 mr-1 flex-shrink-0" />
                  <span className="truncate">+8.2%</span>
                </div>
              </div>
              <ShoppingCart className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 flex-shrink-0 ml-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Avg Order Value</p>
                <p className="text-xl sm:text-2xl font-bold truncate">₿{currentMetrics.avgOrderValue}</p>
                <div className="flex items-center text-xs sm:text-sm text-green-600 mt-1">
                  <TrendingUp className="w-3 h-3 mr-1 flex-shrink-0" />
                  <span className="truncate">+3.1%</span>
                </div>
              </div>
              <Target className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 flex-shrink-0 ml-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Customers</p>
                <p className="text-xl sm:text-2xl font-bold truncate">{currentMetrics.totalCustomers.toLocaleString()}</p>
                <div className="flex items-center text-xs sm:text-sm text-green-600 mt-1">
                  <TrendingUp className="w-3 h-3 mr-1 flex-shrink-0" />
                  <span className="truncate">+15.3%</span>
                </div>
              </div>
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600 flex-shrink-0 ml-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Conversion Rate</p>
                <p className="text-xl sm:text-2xl font-bold truncate">{currentMetrics.conversionRate}%</p>
                <div className="flex items-center text-xs sm:text-sm text-green-600 mt-1">
                  <TrendingUp className="w-3 h-3 mr-1 flex-shrink-0" />
                  <span className="truncate">+0.5%</span>
                </div>
              </div>
              <Activity className="w-6 h-6 sm:w-8 sm:h-8 text-pink-600 flex-shrink-0 ml-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Growth Rate</p>
                <p className="text-xl sm:text-2xl font-bold truncate">{currentMetrics.growthRate}%</p>
                <div className="flex items-center text-xs sm:text-sm text-green-600 mt-1">
                  <TrendingUp className="w-3 h-3 mr-1 flex-shrink-0" />
                  <span className="truncate">+2.1%</span>
                </div>
              </div>
              <Award className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 flex-shrink-0 ml-2" />
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
                {loading ? (
                  <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                    กำลังโหลดข้อมูล...
                  </div>
                ) : salesData.length === 0 ? (
                  <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                    ไม่มีข้อมูล
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`₿${value.toLocaleString()}`, 'Sales']} />
                      <Area type="monotone" dataKey="totalSales" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.1} />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Orders vs Average Order Value</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                    กำลังโหลดข้อมูล...
                  </div>
                ) : salesData.length === 0 ? (
                  <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                    ไม่มีข้อมูล
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Bar yAxisId="left" dataKey="orderCount" fill="#06B6D4" name="Orders" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
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
              {loading ? (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                  กำลังโหลดข้อมูล...
                </div>
              ) : hourlyData.length === 0 ? (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                  ไม่มีข้อมูล
                </div>
              ) : (
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
              )}
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
                {loading ? (
                  <div className="flex items-center justify-center h-[350px] text-muted-foreground">
                    กำลังโหลดข้อมูล...
                  </div>
                ) : monthlySalesData.length === 0 ? (
                  <div className="flex items-center justify-center h-[350px] text-muted-foreground">
                    ไม่มีข้อมูล
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={monthlySalesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`₿${value.toLocaleString()}`, 'Revenue']} />
                      <Area type="monotone" dataKey="sales" stroke="#10B981" fill="#10B981" fillOpacity={0.2} />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>New Customer Acquisition</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center h-[350px] text-muted-foreground">
                    กำลังโหลดข้อมูล...
                  </div>
                ) : salesData.length === 0 ? (
                  <div className="flex items-center justify-center h-[350px] text-muted-foreground">
                    ไม่มีข้อมูล
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="newCustomers" fill="#F59E0B" name="New Customers" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="restaurants" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-3 sm:gap-4">
                <CardTitle className="text-lg sm:text-xl">Top Performing Restaurants</CardTitle>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                    <Input
                      placeholder="Search restaurants..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 w-full"
                    />
                  </div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full sm:w-32">
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
              <div className="space-y-3 sm:space-y-4">
                {loading ? (
                  <div className="text-center py-8 text-sm sm:text-base text-muted-foreground">กำลังโหลดข้อมูล...</div>
                ) : filteredRestaurants.length === 0 ? (
                  <div className="text-center py-8 text-sm sm:text-base text-muted-foreground">ไม่พบข้อมูลร้านค้า</div>
                ) : (
                  filteredRestaurants.map((restaurant, index) => (
                    <div key={restaurant.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border rounded-lg hover:bg-muted/50 transition-colors gap-3 sm:gap-4">
                      <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
                        <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm sm:text-base flex-shrink-0">
                          {index + 1}
                        </div>
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-gradient-to-br from-orange-400 to-pink-400"></div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-sm sm:text-base truncate">{restaurant.name}</h3>
                          <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">★ {restaurant.avgRating}</span>
                            <span>{restaurant.orders} orders</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-left sm:text-right flex-shrink-0">
                        <p className="font-semibold text-base sm:text-lg">₿{restaurant.sales.toLocaleString()}</p>
                        <div className="flex items-center text-xs sm:text-sm text-green-600">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          +{restaurant.growth}%
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sales by Category</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                    กำลังโหลดข้อมูล...
                  </div>
                ) : categoryData.length === 0 ? (
                  <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                    ไม่มีข้อมูล
                  </div>
                ) : (
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
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category Performance</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                    กำลังโหลดข้อมูล...
                  </div>
                ) : categoryData.length === 0 ? (
                  <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                    ไม่มีข้อมูล
                  </div>
                ) : (
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
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      </div>
    </DashboardLayout>
  )
}