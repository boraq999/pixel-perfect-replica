import { useState } from 'react';
import { 
  Wallet, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  FileCheck,
  Camera,
  Search,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const mockWithdrawals = [
  { id: 1, marketer: 'أحمد محمد', amount: 450.00, date: '2024-03-20', status: 'pending' },
  { id: 2, marketer: 'سارة خالد', amount: 1200.00, date: '2024-03-19', status: 'approved' },
];

export const AdminWithdrawalsPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">طلبات سحب العمولات</h1>
          <p className="text-muted-foreground text-sm">مراجعة واعتماد طلبات سحب الأرباح للمسوقين</p>
        </div>
      </div>

      <div className="grid gap-4">
        {mockWithdrawals.map((request) => (
          <Card key={request.id} className="glass-card overflow-hidden hover:shadow-md transition-all">
            <CardContent className="p-0 flex flex-col md:flex-row">
              <div className="p-6 flex-1 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                  <Wallet className="w-6 h-6" />
                </div>
                <div className="text-right">
                  <h3 className="font-bold text-lg">{request.marketer}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {request.date}
                  </p>
                </div>
              </div>

              <div className="bg-muted/30 p-6 flex flex-wrap items-center gap-6 justify-between md:justify-end">
                <div className="text-right">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">المبلغ المطلوب</p>
                  <p className="text-2xl font-bold text-primary">{request.amount.toLocaleString()} د.ل</p>
                </div>

                <Badge variant={request.status === 'pending' ? 'outline' : 'secondary'} className="h-fit py-1 px-4">
                  {request.status === 'pending' ? 'بانتظار الموافقة' : 'تمت الموافقة'}
                </Badge>

                <div className="flex gap-2">
                  {request.status === 'pending' && (
                    <>
                      <Button variant="ghost" className="text-destructive h-10 px-4">
                        <XCircle className="w-4 h-4 ml-2" /> رفض
                      </Button>
                      <Button className="bg-primary h-10 px-6">
                        <CheckCircle2 className="w-4 h-4 ml-2" /> موافقة
                      </Button>
                    </>
                  )}
                  {request.status === 'approved' && (
                    <Button className="bg-green-600 hover:bg-green-700 h-10 px-6">
                      <Camera className="w-4 h-4 ml-2" /> رفع إيصال الدفع
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
