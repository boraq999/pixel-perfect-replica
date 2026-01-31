import { useState } from 'react';
import { 
  ReceiptText, 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  User, 
  Store, 
  DollarSign,
  Search,
  UploadCloud,
  FileText
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

// Mock data for store_payments awaiting approval
const mockPayments = [
  {
    id: 1,
    payment_number: 'PAY-2024-001',
    store_name: 'سوبر ماركت الوفاء',
    marketer_name: 'أحمد محمد',
    amount: 500.00,
    method: 'cash',
    status: 'pending',
    created_at: '2024-03-18 14:00',
    receipt_image: '/placeholder.png' // Placeholder image
  },
  {
    id: 2,
    payment_number: 'PAY-2024-002',
    store_name: 'محل البركة',
    marketer_name: 'سارة علي',
    amount: 150.00,
    method: 'transfer',
    status: 'pending',
    created_at: '2024-03-19 10:00',
    receipt_image: '/placeholder.png'
  },
];

export const KeeperPaymentConfirmationPage = () => {
  const [selectedPayment, setSelectedPayment] = useState<typeof mockPayments[0] | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleApprove = () => {
    if (selectedPayment) {
      setUploading(true);
      setTimeout(() => {
        toast.success(`تم اعتماد إيصال الدفع رقم ${selectedPayment.payment_number}.`);
        setSelectedPayment(null);
        setUploading(false);
      }, 1500);
    }
  };

  const handleReject = () => {
    if (selectedPayment) {
      toast.error(`تم رفض إيصال الدفع رقم ${selectedPayment.payment_number}.`);
      setSelectedPayment(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-right">توثيق إيصالات القبض</h1>
          <p className="text-muted-foreground text-sm text-right">مراجعة واعتماد إيصالات الدفع المستلمة من المتاجر/المسوقين</p>
        </div>
      </div>

      {!selectedPayment ? (
        <Card className="glass-card">
          <CardHeader className="border-b bg-muted/30">
            <div className="relative max-w-md">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input className="pr-10" placeholder="بحث برقم الإيصال أو اسم المتجر..." />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {mockPayments.length > 0 ? (mockPayments.map((payment) => (
                <div key={payment.id} className="flex flex-col md:flex-row items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0 text-blue-600">
                      <ReceiptText className="w-6 h-6" />
                    </div>
                    <div className="text-right">
                      <h3 className="font-bold">{payment.payment_number}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Store className="w-3 h-3" /> {payment.store_name} • <User className="w-3 h-3" /> {payment.marketer_name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4 md:mt-0">
                    <Badge variant="outline" className="text-lg font-bold text-primary px-3 py-1 bg-primary/10">
                      {payment.amount.toLocaleString()} د.ل
                    </Badge>
                    <Button size="sm" variant="outline" onClick={() => setSelectedPayment(payment)}>
                      <FileText className="w-4 h-4 ml-2" /> مراجعة
                    </Button>
                  </div>
                </div>
              ))) : (
                <div className="p-8 text-center text-muted-foreground">
                  لا توجد إيصالات بانتظار المراجعة حالياً.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="glass-card">
          <CardHeader className="border-b bg-muted/30">
            <CardTitle className="text-lg flex items-center gap-2">
              <ReceiptText className="w-5 h-5 text-blue-600" /> مراجعة إيصال: {selectedPayment.payment_number}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <p className="text-sm text-muted-foreground">المتجر: <span className="font-medium text-foreground">{selectedPayment.store_name}</span></p>
              <p className="text-sm text-muted-foreground">المسوق: <span className="font-medium text-foreground">{selectedPayment.marketer_name}</span></p>
              <p className="text-sm text-muted-foreground">المبلغ: <span className="font-medium text-primary">{selectedPayment.amount.toLocaleString()} د.ل</span></p>
              <p className="text-sm text-muted-foreground">طريقة الدفع: <span className="font-medium text-foreground">{selectedPayment.method === 'cash' ? 'نقدي' : 'تحويل بنكي'}</span></p>
            </div>

            <div className="border-t pt-6 space-y-4">
              <Label>صورة إيصال الدفع</Label>
              <div className="w-full h-48 rounded-lg bg-muted flex items-center justify-center overflow-hidden border">
                {selectedPayment.receipt_image ? (
                  <img src={selectedPayment.receipt_image} alt="Receipt" className="object-cover w-full h-full" />
                ) : (
                  <span className="text-muted-foreground text-sm">لا توجد صورة</span>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t pt-6">
              <Button variant="outline" onClick={handleReject} disabled={uploading} className="text-destructive">
                <XCircle className="w-4 h-4 ml-2" /> رفض
              </Button>
              <Button onClick={handleApprove} disabled={uploading}>
                {uploading ? (
                  <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 ml-2" />
                )}
                اعتماد الإيصال
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const Loader2 = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 12a9 9 0 0 1-9 9 9 9 0 0 1-9-9zm-3 0a6 6 0 0 0-6-6v6h6z"/></svg>
);
