import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  ClipboardList,
  AlertCircle,
  Truck,
  RotateCcw,
  Clock,
  Box
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useKeeperData } from '../hooks/useKeeperData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { StatsCard } from './shared/StatsCard';
import { RequestStatusBadge } from './shared/RequestStatusBadge';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export const KeeperDashboard = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { stats, lowStockCount, marketerRequests, isLoading, fetchInitialData } = useKeeperData();

  const quickActions = [
    { label: 'استلام بضاعة', icon: Box, href: '/keeper/stock/receive', color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'طلبات المسوقين', icon: ClipboardList, href: '/keeper/requests', color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'المرتجعات', icon: RotateCcw, href: '/keeper/returns', color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { label: 'جرد المخزون', icon: Package, href: '/keeper/stock', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 p-1"
    >
      {/* Welcome Section */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            مرحباً، {user?.name || 'أمين المخزن'} 👋
          </h1>
          <p className="text-muted-foreground mt-2">
            لديك <span className="text-primary font-bold">{marketerRequests.filter(r => r.status === 'pending').length}</span> طلبات جديدة تتطلب انتباهك اليوم.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => fetchInitialData()} disabled={isLoading}>
            {isLoading ? 'جاري التحديث...' : 'تحديث البيانات'}
          </Button>
          <Button onClick={() => navigate('/keeper/requests')}>عرض الطلبات</Button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="إجمالي المنتجات"
          value="12,450"
          subtitle="وحدة في المخزون"
          icon={Package}
          trend="up"
          trendValue="5%"
          color="primary"
        />
        <StatsCard
          title="الطلبات المعلقة"
          value={stats.pending_requests.toString()}
          subtitle="طلب بانتظار الموافقة"
          icon={ClipboardList}
          trend="neutral"
          color="warning"
        />
        <StatsCard
          title="تنبيهات المخزون"
          value={lowStockCount.toString()}
          subtitle="منتج قارب على النفاد"
          icon={AlertCircle}
          trend={lowStockCount > 0 ? "down" : "neutral"}
          color="destructive"
        />
        <StatsCard
          title="الحركة اليومية"
          value={stats.daily_movements.toString()}
          subtitle="عملية دخول/خروج"
          icon={Truck}
          trend="up"
          trendValue="12%"
          color="success"
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Requests Section */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-4">
          <Card className="h-full border-none shadow-md bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>أحدث الطلبات</CardTitle>
                <CardDescription>طلبات المسوقين التي تحتاج إلى معالجة</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-primary" onClick={() => navigate('/keeper/requests')}>
                عرض الكل
              </Button>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {marketerRequests.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground">
                      لا توجد طلبات جديدة حالياً
                    </div>
                  ) : (
                    marketerRequests.slice(0, 5).map((req, i) => (
                      <motion.div
                        key={req.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center justify-between p-4 rounded-xl border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
                        onClick={() => navigate(`/keeper/requests/${req.id}`)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <ClipboardList className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold">{req.invoice_number}</h4>
                              <div className="scale-90 origin-right">
                                <RequestStatusBadge status={req.status} />
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                              <Clock className="w-3 h-3" />
                              {new Date(req.created_at).toLocaleDateString('ar-LY')}
                              <span>•</span>
                              <span>{req.items?.length || 0} منتجات</span>
                            </p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">التفاصيل</Button>
                      </motion.div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions & Low Stock */}
        <motion.div variants={itemVariants} className="space-y-6">
          <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>إجراءات سريعة</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => navigate(action.href)}
                  className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl border hover:border-primary/50 hover:bg-accent transition-all group"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${action.bg} ${action.color} group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-medium">{action.label}</span>
                </button>
              ))}
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-destructive/5">
            <CardHeader>
              <CardTitle className="text-destructive flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                نواقص المخزون
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {lowStockCount === 0 ? (
                  <p className="text-sm text-muted-foreground">المخزون في حالة جيدة</p>
                ) : (
                  <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-destructive/20">
                    <div className="flex items-center gap-3">
                      <Package className="w-8 h-8 text-destructive/50" />
                      <div>
                        <p className="font-medium text-sm">منتجات تحتاج إعادة طلب</p>
                        <p className="text-xs text-muted-foreground">{lowStockCount} منتجات أقل من الحد الأدنى</p>
                      </div>
                    </div>
                    <Button size="sm" variant="destructive" className="h-8">عرض</Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};
