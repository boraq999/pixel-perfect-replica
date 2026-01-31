import { useState } from 'react';
import { 
  CreditCard, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  FileText,
  Camera,
  Search,
  ChevronRight,
  Store
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const mockPayments = [
  { id: 1, payment_number: 'PAY-2024-001', store_name: 'سوبر ماركت الوفاء', marketer_name: 'أحمد محمد', amount: 300.00, status: 'pending', created_at: '2024-03-20 12:00' },
  { id: 2, payment_number: 'PAY-2024-002', store_name: 'محل البركة', marketer_name: 'سارة علي', amount: 800.00, status: 'pending', created_at: '2024-03-20 11:30' },
  { id: 3, payment_number: 'PAY-2024-003', store_name: 'أسواق المدينة', marketer_name: 'أحمد محمد', amount: 500.00, status: 'approved', created_at: '2024-03-19 16:00' },
];

export const KeeperPaymentsConfirmationPage = () => {
  const handleApprove = (id: number) => {
    toast.success('تمت الموافقة على الدفعة المالية بنجاح');
  };

  const handleReject = (id: number) => {
    toast.error('تم رفض الدفعة المالية');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-right">توثيق إيصالات القبض</h1>
          <p className="text-muted-foreground text-sm text-right">مراجعة واعتماد الدفعات المالية من المتاجر</p>
        </div>
      </div>

      <div className="grid gap-4">
        {mockPayments.map((payment) => (
          <Card key={payment.id} className="glass-card overflow-hidden hover:shadow-md transition-all">
            <CardContent className="p-0 flex flex-col md:flex-row">
              <div className="p-6 flex-1 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div className="text-right">
                  <h3 className="font-bold text-lg">إيصال #{payment.payment_number}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Store className="w-3 h-3" /> {payment.store_name} بواسطة {payment.marketer_name}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3" /> {payment.created_at}
                  </p>
                </div>
              </div>

              <div className="bg-muted/30 p-6 flex flex-wrap items-center gap-6 justify-between md:justify-end">
                <div className="text-right">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">المبلغ المقبوض</p>
                  <p className="text-2xl font-bold text-primary">{payment.amount.toLocaleString()} د.ل</p>
                </div>

                <Badge variant={payment.status === 'pending' ? 'outline' : 'secondary'} className="h-fit py-1 px-4">
                  {payment.status === 'pending' ? 'بانتظار الموافقة' : 'تمت الموافقة'}
                </Badge>

                <div className="flex gap-2">
                  {payment.status === 'pending' && (
                    <>
                      <Button size="sm" variant="outline" className="text-destructive" onClick={() => handleReject(payment.id)}>
                        <XCircle className="w-4 h-4 ml-2" /> رفض
                      </Button>
                      <Button size="sm" onClick={() => handleApprove(payment.id)}>
                        <CheckCircle2 className="w-4 h-4 ml-2" /> موافقة
                      </Button>
                    </>
                  )}
                  {payment.status === 'approved' && (
                    <Button size="sm" className="bg-green-600 hover:bg-green-700" >
                      <Camera className="w-4 h-4 ml-2" /> عرض الإيصال
                    </Button>
                  )}
                  <Button size="icon" variant="ghost">
                    <ChevronRight className="w-5 h-5" />
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
