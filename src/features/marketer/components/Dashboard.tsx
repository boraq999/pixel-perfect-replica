import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Users,
  DollarSign,
  BarChart3,
  Package,
  RotateCcw,
  FileText,
  Plus,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

// Mock data
const mockStats = {
  todaySales: 12500,
  totalOrders: 45,
  newCustomers: 8,
  growthRate: 15.5,
  salesTrend: 12,
  ordersTrend: 8,
  customersTrend: 25,
};

const mockWeeklySales = [
  { day: 'السبت', sales: 4000 },
  { day: 'الأحد', sales: 3000 },
  { day: 'الإثنين', sales: 5000 },
  { day: 'الثلاثاء', sales: 2780 },
  { day: 'الأربعاء', sales: 1890 },
  { day: 'الخميس', sales: 6390 },
  { day: 'الجمعة', sales: 3490 },
];

const mockRecentOrders = [
  { id: '1', storeName: 'متجر الرياض', total: 2500, status: 'completed', date: 'اليوم', items: 5 },
  { id: '2', storeName: 'سوبرماركت النور', total: 1800, status: 'pending', date: 'اليوم', items: 3 },
  { id: '3', storeName: 'مركز السلام', total: 3200, status: 'completed', date: 'أمس', items: 8 },
  { id: '4', storeName: 'متجر الخير', total: 950, status: 'cancelled', date: 'أمس', items: 2 },
];

const quickActions = [
  { label: 'طلب جديد', icon: Plus, href: '/dashboard/stores/new-order', color: 'primary' },
  { label: 'استلام بضاعة', icon: Package, href: '/dashboard/warehouse/receive', color: 'success' },
  { label: 'مرتجع', icon: RotateCcw, href: '/dashboard/stores/returns', color: 'warning' },
  { label: 'تقرير', icon: FileText, href: '/dashboard/reports', color: 'info' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const MarketerDashboard = () => {
  const { user } = useAuthStore();

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Welcome Banner */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden rounded-2xl p-6 text-primary-foreground"
        style={{ background: 'var(--gradient-primary)' }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-20 -top-20 w-60 h-60 rounded-full bg-white/20" />
          <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full bg-white/20" />
        </div>
        <div className="relative z-10">
          <h1 className="text-2xl font-bold mb-2">
            مرحباً بك، {user?.name || 'المستخدم'}! 👋
          </h1>
          <p className="text-primary-foreground/80">
            إليك ملخص أدائك اليوم
          </p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatCard
          title="المبيعات اليوم"
          value={mockStats.todaySales}
          icon={DollarSign}
          trend={mockStats.salesTrend}
          format="currency"
        />
        <StatCard
          title="الطلبات"
          value={mockStats.totalOrders}
          icon={ShoppingCart}
          trend={mockStats.ordersTrend}
        />
        <StatCard
          title="العملاء الجدد"
          value={mockStats.newCustomers}
          icon={Users}
          trend={mockStats.customersTrend}
        />
        <StatCard
          title="معدل النمو"
          value={mockStats.growthRate}
          icon={BarChart3}
          format="percentage"
        />
      </motion.div>

      {/* Charts & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <motion.div
          variants={itemVariants}
          className="stat-card"
        >
          <h3 className="text-lg font-semibold mb-4">المبيعات الأسبوعية</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockWeeklySales}>
                <defs>
                  <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(270, 60%, 50%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(270, 60%, 50%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 30%, 25%)" />
                <XAxis 
                  dataKey="day" 
                  stroke="hsl(215, 20%, 65%)" 
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis 
                  stroke="hsl(215, 20%, 65%)" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(222, 47%, 14%)',
                    border: '1px solid hsl(217, 30%, 25%)',
                    borderRadius: '8px',
                    color: 'hsl(210, 40%, 98%)',
                  }}
                  formatter={(value: number) => [`${value.toLocaleString('ar-SA')} ر.س`, 'المبيعات']}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="hsl(270, 60%, 50%)"
                  strokeWidth={2}
                  fill="url(#salesGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recent Orders */}
        <motion.div
          variants={itemVariants}
          className="stat-card"
        >
          <h3 className="text-lg font-semibold mb-4">الطلبات الأخيرة</h3>
          <div className="space-y-3">
            {mockRecentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-3 rounded-lg bg-accent/30 hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{order.storeName}</p>
                    <p className="text-xs text-muted-foreground">
                      {order.items} منتجات • {order.date}
                    </p>
                  </div>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-sm">
                    {order.total.toLocaleString('ar-SA')} ر.س
                  </p>
                  <StatusBadge status={order.status} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        variants={itemVariants}
        className="stat-card"
      >
        <h3 className="text-lg font-semibold mb-4">إجراءات سريعة</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <motion.button
              key={action.label}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-accent/30 hover:bg-accent/50 transition-all group"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                action.color === 'primary' ? 'bg-primary/20 text-primary group-hover:bg-primary group-hover:text-primary-foreground' :
                action.color === 'success' ? 'bg-success/20 text-success group-hover:bg-success group-hover:text-success-foreground' :
                action.color === 'warning' ? 'bg-warning/20 text-warning group-hover:bg-warning group-hover:text-warning-foreground' :
                'bg-info/20 text-info group-hover:bg-info group-hover:text-info-foreground'
              }`}>
                <action.icon className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium">{action.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  trend?: number;
  format?: 'currency' | 'percentage' | 'number';
}

const StatCard = ({ title, value, icon: Icon, trend, format = 'number' }: StatCardProps) => {
  const formattedValue = format === 'currency'
    ? `${value.toLocaleString('ar-SA')} ر.س`
    : format === 'percentage'
    ? `${value}%`
    : value.toLocaleString('ar-SA');

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="stat-card"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-2xl font-bold">{formattedValue}</p>
          {trend !== undefined && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${
              trend >= 0 ? 'text-success' : 'text-destructive'
            }`}>
              {trend >= 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
          <Icon className="w-6 h-6 text-primary" />
        </div>
      </div>
    </motion.div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const styles = {
    completed: 'bg-success/20 text-success',
    pending: 'bg-warning/20 text-warning',
    cancelled: 'bg-destructive/20 text-destructive',
  };

  const labels = {
    completed: 'مكتمل',
    pending: 'قيد الانتظار',
    cancelled: 'ملغي',
  };

  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${styles[status as keyof typeof styles] || ''}`}>
      {labels[status as keyof typeof labels] || status}
    </span>
  );
};
