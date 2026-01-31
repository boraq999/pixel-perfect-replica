import {
  Package, 
  ClipboardList, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Truck,
  ArrowUpLeft,
  TrendingDown,
  CornerDownLeft
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const mockStats = {
  pendingRequests: 7,
  lowStockItems: 3,
  pendingReturns: 2,
  todayDeliveries: 5,
};

const mockRecentActivities = [
  { id: 1, type: 'request', description: 'طلب بضاعة جديد من المسوق أحمد محمد', status: 'pending', time: 'قبل 10 دقائق' },
  { id: 2, type: 'return', description: 'طلب إرجاع بضاعة من متجر الوفاء', status: 'pending', time: 'قبل ساعة' },
  { id: 3, type: 'delivery', description: 'تم توثيق استلام بضاعة للمسوق سارة علي', status: 'completed', time: 'قبل 3 ساعات' },
];

export const KeeperDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">لوحة أمين المخزن</h1>
        <Button variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 ml-2" /> تحديث
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">طلبات المسوقين المعلقة</p>
              <h3 className="text-2xl font-bold text-amber-600">{mockStats.pendingRequests}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
              <ClipboardList className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">أصناف المخزون المنخفض</p>
              <h3 className="text-2xl font-bold text-destructive">{mockStats.lowStockItems}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
              <AlertCircle className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">طلبات الإرجاع الجديدة</p>
              <h3 className="text-2xl font-bold text-blue-600">{mockStats.pendingReturns}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <CornerDownLeft className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">التسليمات المجدولة اليوم</p>
              <h3 className="text-2xl font-bold text-green-600">{mockStats.todayDeliveries}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <Truck className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card className="glass-card">
        <CardHeader className="border-b bg-muted/30">
          <CardTitle className="text-lg">الأنشطة الأخيرة</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {mockRecentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activity.status === 'pending' ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}>
                    {activity.type === 'request' ? <ClipboardList className="w-4 h-4" /> : activity.type === 'return' ? <CornerDownLeft className="w-4 h-4" /> : <Truck className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="font-medium">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
                <Badge variant={activity.status === 'pending' ? 'outline' : 'secondary'}>
                  {activity.status === 'pending' ? 'قيد الانتظار' : 'تم الإنجاز'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
