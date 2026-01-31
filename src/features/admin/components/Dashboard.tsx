import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Store, 
  AlertCircle,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Wallet
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

const data = [
  { name: 'السبت', sales: 4000, payments: 2400 },
  { name: 'الأحد', sales: 3000, payments: 1398 },
  { name: 'الاثنين', sales: 2000, payments: 9800 },
  { name: 'الثلاثاء', sales: 2780, payments: 3908 },
  { name: 'الأربعاء', sales: 1890, payments: 4800 },
  { name: 'الخميس', sales: 2390, payments: 3800 },
  { name: 'الجمعة', sales: 3490, payments: 4300 },
];

export const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">لوحة إدارة النظام</h1>
        <div className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
          تحديث تلقائي: 2024-03-20 12:00
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">إجمالي المبيعات</p>
                <h3 className="text-2xl font-bold">45,230 د.ل</h3>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <ArrowUpRight className="w-3 h-3 mr-1" /> +12% من الشهر الماضي
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">الديون المستحقة</p>
                <h3 className="text-2xl font-bold text-destructive">12,450 د.ل</h3>
                <p className="text-xs text-amber-600 flex items-center mt-1">
                  <AlertCircle className="w-3 h-3 mr-1" /> 5 متاجر تجاوزت الحد
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">المسوقين النشطين</p>
                <h3 className="text-2xl font-bold">24</h3>
                <p className="text-xs text-muted-foreground mt-1">من أصل 30 مسوق مسجل</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                <Users className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">عمولات قيد السحب</p>
                <h3 className="text-2xl font-bold">3,120 د.ل</h3>
                <p className="text-xs text-blue-600 mt-1">4 طلبات بانتظار الموافقة</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500">
                <Wallet className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg">تحليل المبيعات والتحصيلات</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip />
                <Area type="monotone" dataKey="sales" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorSales)" />
                <Area type="monotone" dataKey="payments" stroke="#10b981" fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg">أكثر المسوقين تحقيقاً للمبيعات</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={[
                 { name: 'أحمد محمد', value: 8500 },
                 { name: 'سارة خالد', value: 7200 },
                 { name: 'محمد علي', value: 5100 },
                 { name: 'ليلى يوسف', value: 4800 },
                 { name: 'عمر عثمان', value: 3900 },
               ]} layout="vertical">
                 <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                 <XAxis type="number" hide />
                 <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                 <Tooltip />
                 <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
               </BarChart>
             </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
