import { useState } from 'react';
import {
  CreditCard, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  DollarSign,
  FileText,
  Search,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

// Mock data for store payments awaiting keeper approval
const mockPayments = [
  { id: 1, payment_number: 'PAY-2024-001', store_name: 'سوبر ماركت الوفاء', marketer_name: 'أحمد محمد', amount: 350.00, date: '2024-03-19', status: 'pending' },
  { id: 2, payment_number: 'PAY-2024-002', store_name: 'محل البركة', marketer_name: 'سارة علي', amount: 120.00, date: '2024-03-20', status: 'pending' },
];

export const PaymentReceiptConfirmationPage = () => {
  const handleApprove = (id: number) => {
    toast.success(`تمت الموافقة على إيصال القبض رقم ${id}.`);
  };

  const handleReject = (id: number) => {
    toast.error(`تم رفض إيصال القبض رقم ${id}.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-right">توثيق إيصالات القبض</h1>
          <p className="text-muted-foreground text-sm text-right">مراجعة واعتماد إيصالات الدفع من المتاجر (Payment Receipt Confirmation)</p>
        </div>
      </div>

      <Card className="glass-card">
        <CardHeader className="border-b bg-muted/30">
          <div className="relative max-w-md">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input className="pr-10" placeholder="بحث برقم الإيصال أو اسم المتجر..." />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {mockPayments.map((payment) => (
              <div key={payment.id} className="flex flex-col md:flex-row items-center justify-between p-4 hover:bg-muted/30 transition-colors gap-4">
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <CreditCard className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-right">
                    <h3 className="font-bold">{payment.payment_number}</h3>
                    <p className="text-sm text-muted-foreground">من: {payment.store_name} • بواسطة: {payment.marketer_name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-center md:text-right">
                    <p className="text-xs text-muted-foreground">المبلغ</p>
                    <p className="font-bold text-lg text-primary">{payment.amount.toLocaleString()} د.ل</p>
                  </div>
                  <Badge variant="outline" className="bg-amber-100 text-amber-700">قيد المراجعة</Badge>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="text-destructive" onClick={() => handleReject(payment.id)}>
                      <XCircle className="w-4 h-4 ml-2" /> رفض
                    </Button>
                    <Button size="sm" onClick={() => handleApprove(payment.id)}>
                      <CheckCircle2 className="w-4 h-4 ml-2" /> موافقة
                    </Button>
                  </div>
                  <Button size="icon" variant="ghost">
                      <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          {mockPayments.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>لا توجد إيصالات قبض بانتظار المراجعة حالياً.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
