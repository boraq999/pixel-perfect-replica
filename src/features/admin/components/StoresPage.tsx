import { useState } from 'react';
import { 
  Store, 
  MapPin, 
  Phone, 
  User, 
  Search, 
  History,
  ArrowRightLeft,
  AlertTriangle,
  Plus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const mockStores = [
  { id: 1, name: 'سوبر ماركت الوفاء', owner: 'إبراهيم حسن', phone: '0912223344', location: 'حي الأندلس', debt: 3500.00, status: 'active' },
  { id: 2, name: 'محل البركة للمواد الغذائية', owner: 'عوض علي', phone: '0925556677', location: 'وسط البلاد', debt: 1200.50, status: 'active' },
  { id: 3, name: 'أسواق المدينة العالمية', owner: 'محمود الفيتوري', phone: '0918889900', location: 'تاجوراء', debt: 8900.00, status: 'active' },
];

export const AdminStoresPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">إدارة المتاجر والديون</h1>
          <p className="text-muted-foreground text-sm">متابعة حسابات المتاجر، الديون، ومواقع التوزيع</p>
        </div>
        <Button className="gradient-btn">
          <Plus className="w-4 h-4 ml-2" /> تسجيل متجر جديد
        </Button>
      </div>

      <Card className="glass-card">
        <CardHeader className="pb-4">
          <div className="relative max-w-md">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input className="pr-10" placeholder="البحث باسم المتجر أو الموقع..." />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mockStores.map((store) => (
              <Card key={store.id} className="overflow-hidden border-border/50 hover:shadow-lg transition-all group">
                <div className="h-2 bg-primary/20 group-hover:bg-primary transition-colors" />
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <Store className="w-6 h-6" />
                    </div>
                    {store.debt > 5000 && (
                      <Badge variant="destructive" className="animate-pulse">
                        <AlertTriangle className="w-3 h-3 ml-1" /> تجاوز الحد
                      </Badge>
                    )}
                  </div>

                  <h3 className="font-bold text-lg mb-1">{store.name}</h3>
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-sm text-muted-foreground gap-2">
                      <User className="w-3 h-3" /> {store.owner}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground gap-2">
                      <Phone className="w-3 h-3" /> {store.phone}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground gap-2">
                      <MapPin className="w-3 h-3" /> {store.location}
                    </div>
                  </div>

                  <div className="pt-4 border-t flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-muted-foreground">الرصيد الحالي (دين)</p>
                      <p className={`text-lg font-bold ${store.debt > 0 ? 'text-destructive' : 'text-green-600'}`}>
                        {store.debt.toLocaleString()} د.ل
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="icon" variant="outline" className="h-8 w-8 rounded-full">
                        <History className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="outline" className="h-8 w-8 rounded-full">
                        <ArrowRightLeft className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
