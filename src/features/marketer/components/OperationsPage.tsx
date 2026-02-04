import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Filter,
  DollarSign,
  ShoppingCart,
  Package,
  Store,
  FileText,
  Printer
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  Legend
} from 'recharts';
import { toast } from 'sonner';
import { useCurrency } from '@/store/currencyStore';

// Mock data
const salesData = [
  { month: 'يناير', sales: 45000, orders: 120 },
  { month: 'فبراير', sales: 52000, orders: 145 },
  { month: 'مارس', sales: 48000, orders: 130 },
  { month: 'أبريل', sales: 61000, orders: 165 },
  { month: 'مايو', sales: 55000, orders: 150 },
  { month: 'يونيو', sales: 67000, orders: 180 },
];

const categoryData = [
  { name: 'ألبان', value: 35, color: 'hsl(270, 60%, 50%)' },
  { name: 'مشروبات', value: 25, color: 'hsl(330, 80%, 60%)' },
  { name: 'مخبوزات', value: 20, color: 'hsl(200, 70%, 50%)' },
  { name: 'زيوت', value: 12, color: 'hsl(45, 90%, 50%)' },
  { name: 'أخرى', value: 8, color: 'hsl(150, 60%, 50%)' },
];

const topProducts = [
  { name: 'حليب كامل الدسم', sales: 1250, trend: 12 },
  { name: 'عصير برتقال', sales: 980, trend: -5 },
  { name: 'زبادي طبيعي', sales: 850, trend: 8 },
  { name: 'ماء معدني', sales: 720, trend: 15 },
  { name: 'خبز أبيض', sales: 650, trend: 3 },
];

const topStores = [
  { name: 'مركز السلام', orders: 42, amount: 12500 },
  { name: 'متجر الرياض', orders: 25, amount: 8500 },
  { name: 'سوبرماركت النور', orders: 18, amount: 6200 },
  { name: 'متجر الخير', orders: 8, amount: 2800 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const OperationsPage = () => {
  const [period, setPeriod] = useState('month');
  const { formatAmount } = useCurrency();

  const handleExport = (type: string) => {
    toast.success(`جاري تصدير تقرير ${type}...`);
  };

  const handlePrint = () => {
    window.print();
    toast.success('جاري الطباعة...');
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">العمليات والتقارير</h1>
          <p className="text-muted-foreground">تحليل الأداء والإحصائيات</p>
        </div>
        <div className="flex gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[140px]">
              <Calendar className="w-4 h-4 ml-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">هذا الأسبوع</SelectItem>
              <SelectItem value="month">هذا الشهر</SelectItem>
              <SelectItem value="quarter">هذا الربع</SelectItem>
              <SelectItem value="year">هذه السنة</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="w-4 h-4 ml-2" />
            طباعة
          </Button>
          <Button onClick={() => handleExport('المبيعات')} className="gradient-btn">
            <Download className="w-4 h-4 ml-2" />
            تصدير
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">إجمالي المبيعات</p>
              <p className="text-2xl font-bold">{formatAmount(328000)}</p>
              <div className="flex items-center gap-1 mt-1 text-success text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>+15%</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-primary" />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">إجمالي الطلبات</p>
              <p className="text-2xl font-bold">890</p>
              <div className="flex items-center gap-1 mt-1 text-success text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>+8%</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-info/20 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-info" />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">المنتجات المباعة</p>
              <p className="text-2xl font-bold">4,250</p>
              <div className="flex items-center gap-1 mt-1 text-success text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>+12%</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
              <Package className="w-5 h-5 text-success" />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">المتاجر النشطة</p>
              <p className="text-2xl font-bold">24</p>
              <div className="flex items-center gap-1 mt-1 text-destructive text-sm">
                <TrendingDown className="w-4 h-4" />
                <span>-2%</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-warning/20 flex items-center justify-center">
              <Store className="w-5 h-5 text-warning" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <motion.div variants={itemVariants} className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">المبيعات الشهرية</h3>
            <Button variant="ghost" size="sm" onClick={() => handleExport('المبيعات الشهرية')}>
              <FileText className="w-4 h-4" />
            </Button>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="salesGradient2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(270, 60%, 50%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(270, 60%, 50%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 30%, 25%)" />
                <XAxis dataKey="month" stroke="hsl(215, 20%, 65%)" fontSize={12} />
                <YAxis stroke="hsl(215, 20%, 65%)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(222, 47%, 14%)',
                    border: '1px solid hsl(217, 30%, 25%)',
                    borderRadius: '8px',
                    color: 'hsl(210, 40%, 98%)',
                  }}
                  formatter={(value: number) => [formatAmount(value), 'المبيعات']}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="hsl(270, 60%, 50%)"
                  strokeWidth={2}
                  fill="url(#salesGradient2)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Category Distribution */}
        <motion.div variants={itemVariants} className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">توزيع المبيعات حسب الفئة</h3>
          </div>
          <div className="h-64">
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
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend
                  formatter={(value) => <span style={{ color: 'hsl(215, 20%, 65%)' }}>{value}</span>}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(222, 47%, 14%)',
                    border: '1px solid hsl(217, 30%, 25%)',
                    borderRadius: '8px',
                    color: 'hsl(210, 40%, 98%)',
                  }}
                  formatter={(value: number) => [`${value}%`, 'النسبة']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <motion.div variants={itemVariants} className="stat-card">
          <h3 className="text-lg font-semibold mb-4">أكثر المنتجات مبيعاً</h3>
          <div className="space-y-3">
            {topProducts.map((product, index) => (
              <div
                key={product.name}
                className="flex items-center justify-between p-3 rounded-lg bg-accent/30"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-sm font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                  <span className="font-medium">{product.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-muted-foreground">{product.sales} وحدة</span>
                  <span className={`flex items-center gap-1 text-sm ${product.trend >= 0 ? 'text-success' : 'text-destructive'
                    }`}>
                    {product.trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {Math.abs(product.trend)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Stores */}
        <motion.div variants={itemVariants} className="stat-card">
          <h3 className="text-lg font-semibold mb-4">أكثر المتاجر نشاطاً</h3>
          <div className="space-y-3">
            {topStores.map((store, index) => (
              <div
                key={store.name}
                className="flex items-center justify-between p-3 rounded-lg bg-accent/30"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-info/20 text-info text-sm font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                  <div>
                    <span className="font-medium">{store.name}</span>
                    <p className="text-xs text-muted-foreground">{store.orders} طلب</p>
                  </div>
                </div>
                <span className="font-semibold text-success">
                  {formatAmount(store.amount)}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
