import { useState } from 'react';
import { 
  RotateCcw, 
  CheckCircle2, 
  Search, 
  Store, 
  Package, 
  Camera,
  FileText,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const mockReturns = [
  { id: 1, invoice_no: 'RET-1001', store: 'سوبر ماركت الوفاء', marketer: 'أحمد محمد', status: 'pending', date: '2024-03-20', total: '120.00' },
  { id: 2, invoice_no: 'RET-1002', store: 'محل البركة', marketer: 'سارة خالد', status: 'pending', date: '2024-03-20', total: '45.50' },
];

export const KeeperReturnsPage = () => {
  return (
    <div className="space-y-6 text-right" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold">إرجاع بضاعة من المتاجر</h1>
        <p className="text-muted-foreground text-sm">توثيق استلام المرتجعات وتحديث المخزن والدين</p>
      </div>

      <div className="grid gap-4">
        {mockReturns.map((item) => (
          <Card key={item.id} className="glass-card hover:shadow-md transition-all">
            <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                  <RotateCcw className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold">{item.invoice_no}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Store className="w-3 h-3" /> {item.store}
                  </div>
                  <p className="text-xs text-muted-foreground">المسوق: {item.marketer} • {item.date}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 justify-between w-full md:w-auto">
                <div className="text-center md:text-right">
                  <p className="text-[10px] text-muted-foreground uppercase">قيمة المرتجع</p>
                  <p className="font-bold text-lg text-orange-600">{item.total} د.ل</p>
                </div>

                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                  بانتظار التوثيق
                </Badge>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <FileText className="w-4 h-4 ml-1" /> التفاصيل
                  </Button>
                  <Button size="sm" className="bg-orange-600 hover:bg-orange-700" onClick={() => toast.info('يرجى رفع صورة الإيصال المختوم')}>
                    <Camera className="w-4 h-4 ml-1" /> توثيق الاستلام
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {mockReturns.length === 0 && (
          <div className="p-12 text-center border-2 border-dashed rounded-xl text-muted-foreground">
            <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-20" />
            <p>لا توجد طلبات إرجاع بانتظار التوثيق حالياً</p>
          </div>
        )}
      </div>
    </div>
  );
};
