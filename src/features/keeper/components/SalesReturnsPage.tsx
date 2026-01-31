import { useState } from 'react';
import { 
  ArrowDownLeft, 
  CheckCircle2, 
  XCircle, 
  Box, 
  User, 
  Store, 
  Search,
  ChevronRight,
  ClipboardList
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

// Mock data for sales_returns awaiting approval
const mockReturns = [
  {
    id: 1,
    return_number: 'RET-2024-001',
    store_name: 'سوبر ماركت الوفاء',
    marketer_name: 'أحمد محمد',
    status: 'pending',
    created_at: '2024-03-17 09:00',
    items: [
      { product: 'زيت زيتون 1 لتر', qty: 5, unit_price: 25.00 },
      { product: 'شاي أخضر 200 جرام', qty: 2, unit_price: 12.00 },
    ],
  },
  {
    id: 2,
    return_number: 'RET-2024-002',
    store_name: 'محل البركة',
    marketer_name: 'سارة علي',
    status: 'pending',
    created_at: '2024-03-18 11:30',
    items: [
      { product: 'أرز بسمتي 5 كجم', qty: 10, unit_price: 50.00 },
    ],
  },
];

export const KeeperSalesReturnsPage = () => {
  const [selectedReturn, setSelectedReturn] = useState<typeof mockReturns[0] | null>(null);

  const handleApprove = () => {
    if (selectedReturn) {
      toast.success(`تمت الموافقة على طلب الإرجاع رقم ${selectedReturn.return_number}.`);
      setSelectedReturn(null);
    }
  };

  const handleReject = () => {
    if (selectedReturn) {
      toast.error(`تم رفض طلب الإرجاع رقم ${selectedReturn.return_number}.`);
      setSelectedReturn(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-right">طلبات إرجاع المبيعات</h1>
          <p className="text-muted-foreground text-sm text-right">مراجعة واعتماد طلبات إرجاع البضاعة من المتاجر/المسوقين</p>
        </div>
      </div>

      {!selectedReturn ? (
        <Card className="glass-card">
          <CardHeader className="border-b bg-muted/30">
            <div className="relative max-w-md">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input className="pr-10" placeholder="بحث برقم الإرجاع أو اسم المتجر..." />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {mockReturns.length > 0 ? (mockReturns.map((returnReq) => (
                <div key={returnReq.id} className="flex flex-col md:flex-row items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center shrink-0 text-orange-600">
                      <ArrowDownLeft className="w-6 h-6" />
                    </div>
                    <div className="text-right">
                      <h3 className="font-bold">{returnReq.return_number}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Store className="w-3 h-3" /> {returnReq.store_name} • <User className="w-3 h-3" /> {returnReq.marketer_name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4 md:mt-0">
                    <Badge variant="outline" className="h-fit py-1 px-3">
                      قيد الانتظار
                    </Badge>
                    <Button size="sm" variant="outline" onClick={() => setSelectedReturn(returnReq)}>
                      <ClipboardList className="w-4 h-4 ml-2" /> مراجعة
                    </Button>
                  </div>
                </div>
              ))) : (
                <div className="p-8 text-center text-muted-foreground">
                  لا توجد طلبات إرجاع بانتظار المراجعة حالياً.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="glass-card">
          <CardHeader className="border-b bg-muted/30">
            <CardTitle className="text-lg flex items-center gap-2">
              <ArrowDownLeft className="w-5 h-5 text-orange-600" /> مراجعة طلب إرجاع: {selectedReturn.return_number}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <p className="text-sm text-muted-foreground">المتجر: <span className="font-medium text-foreground">{selectedReturn.store_name}</span></p>
              <p className="text-sm text-muted-foreground">المسوق: <span className="font-medium text-foreground">{selectedReturn.marketer_name}</span></p>
              <p className="text-sm text-muted-foreground">تاريخ الطلب: <span className="font-medium text-foreground">{selectedReturn.created_at}</span></p>
            </div>

            <div className="space-y-2 border-t pt-4">
              <h3 className="font-bold flex items-center gap-2 text-right"><Box className="w-4 h-4"/> الأصناف المرتجعة</h3>
              <div className="divide-y border rounded-xl">
                {selectedReturn.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 text-sm">
                    <span>{item.product}</span>
                    <Badge variant="secondary">الكمية: {item.qty} • {item.unit_price} د.ل/قطعة</Badge>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t pt-6">
              <Button variant="outline" onClick={handleReject} className="text-destructive">
                <XCircle className="w-4 h-4 ml-2" /> رفض الطلب
              </Button>
              <Button onClick={handleApprove}>
                <CheckCircle2 className="w-4 h-4 ml-2" /> موافقة على الإرجاع
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
