// صفحة: لوحة التحكم (المسوق الأفضل)
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Package,
  ShoppingCart,
  TrendingUp,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Store,
  PackageCheck,
  DollarSign,
  Trophy
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useCurrency } from '@/store/currencyStore';

const stats = [
  {
    title: 'إجمالي المبيعات',
    amount: 125500,
    change: '+12.5%',
    trend: 'up',
    icon: DollarSign,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  {
    title: 'المخزون المتاح',
    amount: 450,
    unit: 'منتج',
    change: '+8 منتج',
    trend: 'up',
    icon: Package,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    title: 'الطلبات النشطة',
    amount: 12,
    unit: 'طلب',
    change: '3 جديد',
    trend: 'up',
    icon: ShoppingCart,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  {
    title: 'الأرباح المتاحة',
    amount: 8750,
    change: 2100,
    trend: 'up',
    icon: TrendingUp,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
  },
];

const recentActivities = [
  {
    id: 1,
    type: 'sale',
    title: 'بيع بضاعة للمتجر',
    store: 'متجر النخبة',
    amount: 2500,
    time: 'منذ ساعة',
    status: 'completed',
  },
  {
    id: 2,
    type: 'order',
    title: 'طلب بضاعة جديد',
    store: 'المخزن الرئيسي',
    amount: 5000,
    time: 'منذ ساعتين',
    status: 'pending',
  },
  {
    id: 3,
    type: 'return',
    title: 'إرجاع بضاعة',
    store: 'متجر الأمل',
    amount: 800,
    time: 'منذ 3 ساعات',
    status: 'completed',
  },
  {
    id: 4,
    type: 'withdrawal',
    title: 'سحب أرباح',
    store: 'حسابي',
    amount: 3000,
    time: 'أمس',
    status: 'approved',
  },
];

const topProducts = [
  { id: 1, name: 'منتج A', sold: 120, revenue: 12000, trend: 'up' },
  { id: 2, name: 'منتج B', sold: 95, revenue: 9500, trend: 'up' },
  { id: 3, name: 'منتج C', sold: 80, revenue: 8000, trend: 'down' },
  { id: 4, name: 'منتج D', sold: 65, revenue: 6500, trend: 'up' },
];

export const BestMarketerDashboard = () => {
  const { user } = useAuthStore();
  const { formatAmount } = useCurrency();

  return (
    <div className="space-y-6">
      {/* Header with Special Badge */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">مرحباً، {user?.name} 👋</h1>
            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white flex items-center gap-1">
              <Trophy className="h-3 w-3" />
              مسوق متميز
            </Badge>
          </div>
          <p className="text-muted-foreground mt-2">
            إليك نظرة عامة على أدائك اليوم
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {'unit' in stat ? `${stat.amount} ${stat.unit}` : formatAmount(stat.amount)}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="h-3 w-3 text-green-500" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-red-500" />
                  )}
                  <span className={stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                    {typeof stat.change === 'number' ? `+${formatAmount(stat.change)}` : stat.change}
                  </span>
                  <span>عن الشهر الماضي</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PackageCheck className="h-5 w-5" />
              الأنشطة الأخيرة
            </CardTitle>
            <CardDescription>آخر العمليات والمعاملات</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${activity.type === 'sale' ? 'bg-green-500/10' :
                      activity.type === 'order' ? 'bg-blue-500/10' :
                        activity.type === 'return' ? 'bg-orange-500/10' :
                          'bg-purple-500/10'
                      }`}>
                      {activity.type === 'sale' && <Store className="h-4 w-4 text-green-500" />}
                      {activity.type === 'order' && <Package className="h-4 w-4 text-blue-500" />}
                      {activity.type === 'return' && <ArrowDownRight className="h-4 w-4 text-orange-500" />}
                      {activity.type === 'withdrawal' && <Wallet className="h-4 w-4 text-purple-500" />}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">{activity.store}</p>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-sm">{formatAmount(activity.amount)}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              أفضل المنتجات مبيعاً
            </CardTitle>
            <CardDescription>المنتجات الأكثر رواجاً هذا الشهر</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.sold} وحدة</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm">{formatAmount(product.revenue)}</p>
                    {product.trend === 'up' ? (
                      <ArrowUpRight className="h-4 w-4 text-green-500" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5">
        <CardHeader>
          <CardTitle>الإجراءات السريعة</CardTitle>
          <CardDescription>الوصول السريع للعمليات الأساسية</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 rounded-lg border bg-card hover:bg-accent transition-colors text-center group">
              <Package className="h-6 w-6 mx-auto mb-2 text-primary group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium">طلب بضاعة</p>
            </button>
            <button className="p-4 rounded-lg border bg-card hover:bg-accent transition-colors text-center group">
              <ShoppingCart className="h-6 w-6 mx-auto mb-2 text-primary group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium">بيع للمتجر</p>
            </button>
            <button className="p-4 rounded-lg border bg-card hover:bg-accent transition-colors text-center group">
              <ArrowDownRight className="h-6 w-6 mx-auto mb-2 text-primary group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium">إرجاع بضاعة</p>
            </button>
            <button className="p-4 rounded-lg border bg-card hover:bg-accent transition-colors text-center group">
              <Wallet className="h-6 w-6 mx-auto mb-2 text-primary group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium">سحب أرباح</p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
