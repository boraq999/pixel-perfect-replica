import { useState } from 'react';
import { 
  Package, 
  Tag, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Percent, 
  Gift,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const mockProducts = [
  { id: 1, name: 'زيت زيتون 1 لتر', barcode: '622123456789', price: '25.00', stock: 150, status: 'active' },
  { id: 2, name: 'معجون طماطم 400 جرام', barcode: '622987654321', price: '3.50', stock: 500, status: 'active' },
];

const mockPromotions = [
  { id: 1, product: 'زيت زيتون 1 لتر', min_qty: 10, free_qty: 1, start: '2024-03-01', end: '2024-04-01', status: 'active' },
];

export const AdminProductsPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">إدارة المنتجات والترقيات</h1>
          <p className="text-muted-foreground text-sm">التحكم في الأصناف، الأسعار، والعروض الترويجية</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Tag className="w-4 h-4 ml-2" /> إدارة الخصومات
          </Button>
          <Button className="gradient-btn">
            <Plus className="w-4 h-4 ml-2" /> إضافة صنف جديد
          </Button>
        </div>
      </div>

      <Tabs defaultValue="products" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md bg-muted/50 p-1">
          <TabsTrigger value="products">الأصناف (المنتجات)</TabsTrigger>
          <TabsTrigger value="promotions">العروض الترويجية</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="mt-6">
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div className="relative w-full max-w-sm">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input className="pr-10" placeholder="البحث بالاسم أو الباركود..." />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {mockProducts.map((product) => (
                  <div key={product.id} className="group relative p-4 rounded-xl border bg-card hover:shadow-lg transition-all border-border/50">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <Package className="w-6 h-6" />
                      </div>
                      <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">نشط</Badge>
                    </div>
                    <h3 className="font-bold text-lg mb-1">{product.name}</h3>
                    <p className="text-xs text-muted-foreground mb-4">باركود: {product.barcode}</p>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                      <div>
                        <p className="text-[10px] text-muted-foreground">السعر</p>
                        <p className="font-bold text-primary">{product.price} د.ل</p>
                      </div>
                      <div className="text-left">
                        <p className="text-[10px] text-muted-foreground text-left">المخزن</p>
                        <p className="font-bold">{product.stock} قطعة</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="sm" variant="ghost" className="flex-1 text-xs">
                        <Edit className="w-3 h-3 ml-1" /> تعديل
                      </Button>
                      <Button size="sm" variant="ghost" className="flex-1 text-xs text-destructive">
                        <Trash2 className="w-3 h-3 ml-1" /> حذف
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="promotions" className="mt-6">
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Gift className="w-5 h-5 text-purple-600" /> العروض النشطة حالياً
              </CardTitle>
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 ml-1" /> عرض جديد
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockPromotions.map((promo) => (
                  <div key={promo.id} className="flex items-center justify-between p-4 rounded-xl border border-dashed border-purple-200 bg-purple-50/30">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                        <Percent className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold">{promo.product}</h4>
                        <p className="text-sm text-muted-foreground">اشتري {promo.min_qty} واحصل على {promo.free_qty} مجاناً</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="hidden md:block">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" /> {promo.start} إلى {promo.end}
                        </div>
                      </div>
                      <Badge className="bg-purple-600">نشط</Badge>
                      <Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button>
                    </div>
                  </div>
                ))}
                <div className="p-8 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-muted-foreground bg-muted/20">
                  <AlertCircle className="w-8 h-8 mb-2 opacity-20" />
                  <p className="text-sm">لا توجد عروض ترويجية أخرى حالياً</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const MoreVertical = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
);
