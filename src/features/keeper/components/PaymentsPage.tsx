import { useState } from 'react';
import { 
  CreditCard, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Store, 
  DollarSign, 
  Image as ImageIcon,
  Clock,
  Eye
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const mockPayments = [
  { id: 1, payment_no: 'PAY-8801', store: 'أسواق المدينة', marketer: 'أحمد محمد', amount: '500.00', method: 'كاش', status: 'pending', date: '2024-03-20 11:30' },
  { id: 2, payment_no: 'PAY-8802', store: 'محل البركة', marketer: 'سارة خالد', amount: '1200.00', method: 'صك مصدق', status: 'pending', date: '2024-03-20 10:15' },
];

export const KeeperPaymentsPage = () => {
  return (
    <div className="space-y-6 text-right" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold">توثيق إيصالات القبض (التسديد)</h1>
        <p className="text-muted-foreground text-sm">مراجعة واعتماد المبالغ المالية المسددة من المتاجر</p>
      </div>

      <div className="grid gap-4">
        {mockPayments.map((payment) => (
          <Card key={payment.id} className="glass-card overflow-hidden hover:shadow-md transition-all">
            <CardContent className="p-0 flex flex-col md:flex-row">
              <div className="p-6 flex-1 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{payment.store}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {payment.date} • المسوق: {payment.marketer}
                  </p>
                  <div className="mt-1 flex gap-2">
                    <Badge variant="secondary" className="text-[10px]">{payment.method}</Badge>
                    <Badge variant="outline" className="text-[10px]">{payment.payment_no}</Badge>
                  </div>
                </div>
              </div>

              <div className="bg-muted/30 p-6 flex flex-wrap items-center gap-6 justify-between md:justify-end border-r border-border/50">
                <div className="text-center md:text-right">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">المبلغ المسدد</p>
                  <p className="text-2xl font-bold text-green-600">{payment.amount} د.ل</p>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="h-10">
                    <Eye className="w-4 h-4 ml-1" /> عرض الإيصال
                  </Button>
                  <Button variant="outline" className="text-destructive h-10 border-destructive/20 hover:bg-destructive/5">
                    <XCircle className="w-4 h-4 ml-1" /> رفض
                  </Button>
                  <Button className="bg-green-600 hover:bg-green-700 h-10 px-6" onClick={() => toast.success('تم اعتماد التسديد وتحديث رصيد المتجر')}>
                    <CheckCircle2 className="w-4 h-4 ml-1" /> اعتماد القبض
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
