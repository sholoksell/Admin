import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package, 
  TrendingUp, 
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const revenueData = [
  { name: 'Jan', revenue: 4000, orders: 240 },
  { name: 'Feb', revenue: 3000, orders: 198 },
  { name: 'Mar', revenue: 5000, orders: 300 },
  { name: 'Apr', revenue: 4500, orders: 278 },
  { name: 'May', revenue: 6000, orders: 389 },
  { name: 'Jun', revenue: 5500, orders: 349 },
  { name: 'Jul', revenue: 7000, orders: 430 },
];

const categoryData = [
  { name: 'Electronics', value: 35 },
  { name: 'Clothing', value: 25 },
  { name: 'Food', value: 20 },
  { name: 'Home', value: 15 },
  { name: 'Other', value: 5 },
];

const COLORS = ['hsl(217, 91%, 60%)', 'hsl(142, 76%, 36%)', 'hsl(38, 92%, 50%)', 'hsl(280, 65%, 60%)', 'hsl(0, 84%, 60%)'];

const recentOrders = [
  { id: '#ORD-001', customer: 'John Doe', amount: 'BDT 125.00', status: 'Delivered', date: '2 hours ago' },
  { id: '#ORD-002', customer: 'Jane Smith', amount: 'BDT 89.50', status: 'Processing', date: '3 hours ago' },
  { id: '#ORD-003', customer: 'Mike Johnson', amount: 'BDT 234.00', status: 'Pending', date: '5 hours ago' },
  { id: '#ORD-004', customer: 'Sarah Williams', amount: 'BDT 67.00', status: 'Shipped', date: '6 hours ago' },
  { id: '#ORD-005', customer: 'Tom Brown', amount: 'BDT 156.00', status: 'Delivered', date: '8 hours ago' },
];

const statusColors: Record<string, string> = {
  Delivered: 'bg-success/20 text-success',
  Processing: 'bg-primary/20 text-primary',
  Pending: 'bg-warning/20 text-warning',
  Shipped: 'bg-chart-4/20 text-chart-4',
};

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your store overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value="BDT 45,231"
          change="+20.1%"
          trend="up"
          icon={DollarSign}
          gradient="gradient-primary"
        />
        <StatCard
          title="Orders"
          value="1,234"
          change="+12.5%"
          trend="up"
          icon={ShoppingCart}
          gradient="gradient-success"
        />
        <StatCard
          title="Customers"
          value="3,456"
          change="+8.2%"
          trend="up"
          icon={Users}
          gradient="gradient-warning"
        />
        <StatCard
          title="Products"
          value="567"
          change="-2.4%"
          trend="down"
          icon={Package}
          gradient="bg-chart-4"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2 glass-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 17%)" />
                  <XAxis dataKey="name" stroke="hsl(215, 20%, 55%)" />
                  <YAxis stroke="hsl(215, 20%, 55%)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(222, 47%, 10%)',
                      border: '1px solid hsl(217, 33%, 17%)',
                      borderRadius: '8px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(217, 91%, 60%)"
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card className="glass-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Sales by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(222, 47%, 10%)',
                      border: '1px solid hsl(217, 33%, 17%)',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-3 -mt-4">
                {categoryData.map((item, index) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index] }}
                    />
                    <span className="text-xs text-muted-foreground">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders Chart & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders Bar Chart */}
        <Card className="glass-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Orders Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 17%)" />
                  <XAxis dataKey="name" stroke="hsl(215, 20%, 55%)" />
                  <YAxis stroke="hsl(215, 20%, 55%)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(222, 47%, 10%)',
                      border: '1px solid hsl(217, 33%, 17%)',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="orders" fill="hsl(142, 76%, 36%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders Table */}
        <Card className="glass-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <ShoppingCart className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{order.id}</p>
                      <p className="text-sm text-muted-foreground">{order.customer}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">{order.amount}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
}

function StatCard({ title, value, change, trend, icon: Icon, gradient }: StatCardProps) {
  return (
    <Card className="glass-card border-border overflow-hidden group hover:border-primary/50 transition-colors">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold text-foreground mt-1">{value}</p>
            <div className={`flex items-center gap-1 mt-2 ${trend === 'up' ? 'text-success' : 'text-destructive'}`}>
              {trend === 'up' ? (
                <ArrowUpRight className="w-4 h-4" />
              ) : (
                <ArrowDownRight className="w-4 h-4" />
              )}
              <span className="text-sm font-medium">{change}</span>
              <span className="text-xs text-muted-foreground">vs last month</span>
            </div>
          </div>
          <div className={`w-12 h-12 rounded-xl ${gradient} flex items-center justify-center group-hover:scale-110 transition-transform`}>
            <Icon className="w-6 h-6 text-primary-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
