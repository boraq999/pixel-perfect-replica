import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ReceiptText,
  CheckCircle2,
  XCircle,
  Calendar,
  User,
  Store,
  Search,
  FileText,
  Clock,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  Eye,
  Image as ImageIcon,
  UploadCloud
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface Payment {
  id: number;
  payment_number: string;
  store_name: string;
  marketer_name: string;
  amount: number;
  method: 'cash' | 'transfer' | 'certified_check';
  status: 'pending' | 'documented' | 'rejected' | 'cancelled';
  created_at: string;
  receipt_image?: string;
  documented_by?: string;
  documented_at?: string;
}

const mockPayments: Payment[] = [
  {
    id: 1,
    payment_number: 'PAY-2024-001',
    store_name: 'سوبر ماركت الوفاء',
    marketer_name: 'أحمد محمد',
    amount: 500.00,
    method: 'cash',
    status: 'pending',
    created_at: '2024-03-18 14:00',
  },
  {
    id: 2,
    payment_number: 'PAY-2024-002',
    store_name: 'محل البركة',
    marketer_name: 'سارة علي',
    amount: 1500.00,
    method: 'certified_check',
    status: 'pending',
    created_at: '2024-03-19 10:00',
  },
  {
    id: 3,
    payment_number: 'PAY-2024-003',
    store_name: 'بقالة النور',
    marketer_name: 'محمد علي',
    amount: 1200.00,
    method: 'transfer',
    status: 'documented',
    created_at: '2024-03-18 09:30',
    documented_by: 'همام (أمين المخزن)',
    documented_at: '2024-03-18 11:45',
    receipt_image: 'https://images.unsplash.com/photo-1554224155-1696413575b9?w=800&auto=format&fit=crop&q=60'
  }
];

export const KeeperPaymentConfirmationPage = () => {
  const [filter, setFilter] = useState<'pending' | 'documented'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [isApproving, setIsApproving] = useState(false);
  const [uploadImage, setUploadImage] = useState<string | null>(null);

  const handleApprove = (id: number) => {
    if (!uploadImage && filter === 'pending') {
      toast.error('يرجى رفع صورة الإيصال المختوم أولاً لإتمام التوثيق');
      return;
    }

    setIsApproving(true);
    setTimeout(() => {
      setPayments(prev => prev.map(p =>
        p.id === id ? {
          ...p,
          status: 'documented',
          documented_by: 'همام (أمين المخزن)',
          documented_at: new Date().toLocaleString('ar-EG'),
          receipt_image: uploadImage || undefined
        } : p
      ));
      toast.success('تم توثيق إيصال القبض بنجاح');
      setSelectedPayment(null);
      setUploadImage(null);
      setIsApproving(false);
    }, 1000);
  };

  const handleReject = (id: number) => {
    setPayments(prev => prev.map(p =>
      p.id === id ? {
        ...p,
        status: 'rejected',
        documented_by: 'همام (أمين المخزن)',
        documented_at: new Date().toLocaleString('ar-EG')
      } : p
    ));
    toast.error('تم رفض إيصال القبض');
    setSelectedPayment(null);
    setUploadImage(null);
  };

  const filteredPayments = payments.filter(p => {
    const statusMatch = p.status === filter;
    const searchMatch = !searchQuery ||
      p.payment_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.store_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.marketer_name.toLowerCase().includes(searchQuery.toLowerCase());
    return statusMatch && searchMatch;
  });

  const getStatusCount = (status: 'pending' | 'documented') => {
    return payments.filter(p => p.status === status).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="text-right">
          <h1 className="text-2xl font-bold">توثيق إيصالات القبض</h1>
          <p className="text-muted-foreground text-sm">مراجعة واعتماد إيصالات الدفع المستلمة من المتاجر والمسوقين</p>
        </div>

        <div className="flex bg-muted p-1 rounded-lg">
          <button
            onClick={() => setFilter('pending')}
            className={`px-6 py-2 rounded-md text-sm transition-all whitespace-nowrap ${filter === 'pending' ? 'bg-background shadow-sm font-medium' : ''}`}
          >
            في انتظار التوثيق ({getStatusCount('pending')})
          </button>
          <button
            onClick={() => setFilter('documented')}
            className={`px-6 py-2 rounded-md text-sm transition-all whitespace-nowrap ${filter === 'documented' ? 'bg-background shadow-sm font-medium' : ''}`}
          >
            موثق ({getStatusCount('documented')})
          </button>
        </div>
      </div>

      <Card className="glass-card">
        <div className="p-4 border-b">
          <div className="relative max-w-md">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              className="pr-10"
              placeholder="بحث برقم الإيصال، المتجر، أو المسوق..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <CardContent className="p-0 text-right">
          <div className="divide-y divide-border">
            <AnimatePresence mode="popLayout">
              {filteredPayments.map((payment) => (
                <motion.div
                  key={payment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-6 hover:bg-muted/30 transition-colors flex flex-col md:flex-row items-center gap-6"
                >
                  <div className="flex items-center gap-4 flex-1 w-full md:w-auto">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${payment.status === 'documented' ? 'bg-green-500/10 text-green-600' : 'bg-blue-500/10 text-blue-600'
                      }`}>
                      <ReceiptText className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{payment.payment_number}</h3>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><Store className="w-3 h-3" /> {payment.store_name}</span>
                        <span className="flex items-center gap-1"><User className="w-3 h-3" /> {payment.marketer_name}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {payment.created_at}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                    <div className="text-right">
                      <p className="text-[10px] text-muted-foreground uppercase">المبلغ المدفوع</p>
                      <p className="font-bold text-lg text-primary">{payment.amount.toLocaleString()} د.ل</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="hidden md:flex items-center gap-2"
                        onClick={() => setSelectedPayment(payment)}
                      >
                        <FileText className="w-4 h-4" />
                        {payment.status === 'pending' ? 'توثيق الإيصال' : 'عرض التفاصيل'}
                      </Button>

                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setSelectedPayment(payment)}
                      >
                        <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredPayments.length === 0 && (
              <div className="p-12 text-center text-muted-foreground">
                <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-20" />
                <p>لا توجد إيصالات في هذه الحالة حالياً.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Payment Details Dialog */}
      <AnimatePresence>
        {selectedPayment && (
          <Dialog open={!!selectedPayment} onOpenChange={() => setSelectedPayment(null)}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center justify-end gap-2 text-right">
                  تفاصيل إيصال القبض: {selectedPayment.payment_number}
                  <ReceiptText className="w-5 h-5 text-primary" />
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 text-right">
                <div className="grid grid-cols-2 gap-4 p-4 bg-accent/30 rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">المتجر</p>
                    <p className="font-medium">{selectedPayment.store_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">المسوق</p>
                    <p className="font-medium">{selectedPayment.marketer_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">المبلغ</p>
                    <p className="font-bold text-primary">{selectedPayment.amount.toLocaleString()} د.ل</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">طريقة الدفع</p>
                    <Badge variant="secondary" className="font-medium">
                      {selectedPayment.method === 'cash' ? 'نقدي' :
                        selectedPayment.method === 'transfer' ? 'تحويل بنكي' :
                          'شيك مصدق'}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">تاريخ الإنشاء</p>
                    <p className="font-medium">{selectedPayment.created_at}</p>
                  </div>

                  {selectedPayment.documented_by && (
                    <div className="col-span-2 mt-2 pt-2 border-t border-dashed flex justify-between items-center flex-row-reverse">
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground mb-1">تم التوثيق بواسطة (أمين المخزن)</p>
                        <p className="font-bold text-primary">{selectedPayment.documented_by}</p>
                      </div>
                      <div className="text-left">
                        <p className="text-xs text-muted-foreground mb-1">تاريخ التوثيق</p>
                        <p className="font-medium text-sm">{selectedPayment.documented_at}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <h3 className="font-bold flex items-center justify-end gap-2">
                    {selectedPayment.status === 'pending' ? 'رفع صورة إيصال القبض المختوم' : 'صورة الإيصال الموثق'}
                    <ImageIcon className="w-4 h-4" />
                  </h3>

                  {selectedPayment.status === 'pending' ? (
                    <div
                      className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-4 transition-all cursor-pointer ${uploadImage ? 'border-green-500 bg-green-500/5' : 'border-border hover:border-primary/50 hover:bg-primary/5'
                        }`}
                      onClick={() => setUploadImage('https://images.unsplash.com/photo-1554224155-1696413575b9?w=800&auto=format&fit=crop&q=60')}
                    >
                      {uploadImage ? (
                        <>
                          <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center text-green-600">
                            <CheckCircle2 className="w-8 h-8" />
                          </div>
                          <div className="space-y-1">
                            <p className="font-bold text-green-600">تم اختيار الصورة</p>
                            <p className="text-xs text-muted-foreground">التوقيع والختم واضحين</p>
                          </div>
                          <Button variant="ghost" size="sm" onClick={(e) => {
                            e.stopPropagation();
                            setUploadImage(null);
                          }}>تغيير الصورة</Button>
                        </>
                      ) : (
                        <>
                          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <UploadCloud className="w-8 h-8" />
                          </div>
                          <div className="space-y-1 text-right">
                            <p className="font-bold">اسحب أو اضغط لرفع صورة الإيصال</p>
                            <p className="text-xs text-muted-foreground text-center">يجب أن تحتوي الصورة على ختم المتجر وتوقيعك</p>
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="relative rounded-xl border overflow-hidden aspect-[4/3] bg-muted flex items-center justify-center group">
                      <img
                        src={selectedPayment.receipt_image}
                        alt="Payment Receipt"
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button variant="secondary" size="sm" onClick={() => window.open(selectedPayment.receipt_image, '_blank')}>
                          <Eye className="w-4 h-4 ml-2" /> تكبير الصورة
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setSelectedPayment(null)}
                  >
                    <ChevronLeft className="w-4 h-4 ml-2" />
                    إغلاق
                  </Button>

                  {selectedPayment.status === 'pending' && (
                    <>
                      <Button
                        variant="outline"
                        className="flex-1 text-destructive border-destructive/20 hover:bg-destructive/10"
                        onClick={() => handleReject(selectedPayment.id)}
                      >
                        <XCircle className="w-4 h-4 ml-2" />
                        رفض الإيصال
                      </Button>
                      <Button
                        className="flex-[2] bg-primary hover:bg-primary/90 text-white"
                        disabled={isApproving}
                        onClick={() => handleApprove(selectedPayment.id)}
                      >
                        {isApproving ? (
                          <>جاري التوثيق...</>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4 ml-2" />
                            توثيق واعتماد الاستلام
                          </>
                        )}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
};

const Loader2 = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 12a9 9 0 0 1-9 9 9 9 0 0 1-9-9zm-3 0a6 6 0 0 0-6-6v6h6z" /></svg>
);
