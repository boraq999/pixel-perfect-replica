import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RotateCcw,
  CheckCircle2,
  Search,
  Store,
  Package,
  Camera,
  FileText,
  AlertCircle,
  XCircle,
  ChevronRight,
  ChevronLeft,
  User,
  Calendar,
  Clock,
  Image as ImageIcon,
  ArrowDownLeft
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface ReturnItem {
  product: string;
  qty: number;
  unit_price: number;
}

interface MarketerReturn {
  id: number;
  return_number: string;
  store_name: string;
  marketer_name: string;
  status: 'pending' | 'approved' | 'documented' | 'rejected' | 'cancelled';
  created_at: string;
  items: ReturnItem[];
  approved_by?: string;
  documented_by?: string;
  documented_at?: string;
  keeper_name?: string;
}

const mockReturns: MarketerReturn[] = [
  {
    id: 1,
    return_number: 'RET-2024-001',
    store_name: 'سوبر ماركت الوفاء',
    marketer_name: 'أحمد محمد',
    status: 'pending',
    created_at: '2024-03-17 09:00',
    items: [
      { product: 'عطر الفارس 100مل', qty: 5, unit_price: 150.00 },
      { product: 'بخور ملكي', qty: 2, unit_price: 350.00 },
    ],
  },
];

type ReturnStatus = MarketerReturn['status'];

export const KeeperSalesReturnsPage = () => {
  const [filter, setFilter] = useState<ReturnStatus | 'rejected-cancelled'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReturn, setSelectedReturn] = useState<MarketerReturn | null>(null);
  const [documentingReturn, setDocumentingReturn] = useState<MarketerReturn | null>(null);
  const [returns, setReturns] = useState<MarketerReturn[]>(mockReturns);
  const [documentImage, setDocumentImage] = useState<string | null>(null);

  const handleApprove = (id: number) => {
    setReturns(prev => prev.map(ret =>
      ret.id === id ? { ...ret, status: 'approved', approved_by: 'مسعود (أمين مخزن)' } as MarketerReturn : ret
    ));
    toast.success('تمت الموافقة على طلب الإرجاع');
  };

  const handleReject = (id: number) => {
    setReturns(prev => prev.map(ret =>
      ret.id === id ? { ...ret, status: 'rejected', keeper_name: 'همام (أمين المخزن)' } as MarketerReturn : ret
    ));
    toast.error('تم رفض طلب الإرجاع');
  };

  const handleDocument = () => {
    if (!documentingReturn || !documentImage) {
      toast.error('يرجى رفع صورة الإيصال المختوم أولاً');
      return;
    }

    setReturns(prev => prev.map(ret =>
      ret.id === documentingReturn.id ? {
        ...ret,
        status: 'documented',
        documented_by: 'همام (أمين المخزن)',
        documented_at: new Date().toLocaleString('ar-EG')
      } as MarketerReturn : ret
    ));
    toast.success('تم توثيق استلام المرتجعات بنجاح');
    setDocumentingReturn(null);
    setDocumentImage(null);
  };

  const filteredReturns = returns.filter(ret => {
    let statusMatch = false;
    if (filter === 'rejected-cancelled') {
      statusMatch = ret.status === 'rejected' || ret.status === 'cancelled';
    } else {
      statusMatch = ret.status === filter;
    }

    const searchMatch = !searchQuery ||
      ret.return_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ret.store_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ret.marketer_name.toLowerCase().includes(searchQuery.toLowerCase());

    return statusMatch && searchMatch;
  });

  const getStatusCount = (targetStatus: ReturnStatus | 'rejected-cancelled') => {
    if (targetStatus === 'rejected-cancelled') {
      return returns.filter(r => r.status === 'rejected' || r.status === 'cancelled').length;
    }
    return returns.filter(r => r.status === targetStatus).length;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">في انتظار الموافقة</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20">في انتظار التوثيق</Badge>;
      case 'documented':
        return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">موثق</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/20">مرفوض</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-gray-500/10 text-gray-600 border-gray-500/20">ملغى</Badge>;
      default:
        return null;
    }
  };

  const getTotalAmount = (items: ReturnItem[]) => {
    return items.reduce((sum, item) => sum + (item.qty * item.unit_price), 0).toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="text-right">
          <h1 className="text-2xl font-bold">إرجاع بضاعة من المتاجر</h1>
          <p className="text-muted-foreground text-sm">توثيق استلام المرتجعات وتحديث المخزن والدين</p>
        </div>

        <div className="flex bg-muted p-1 rounded-lg overflow-x-auto no-scrollbar">
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-md text-sm transition-all whitespace-nowrap ${filter === 'pending' ? 'bg-background shadow-sm font-medium' : ''}`}
          >
            في انتظار الموافقة ({getStatusCount('pending')})
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 rounded-md text-sm transition-all whitespace-nowrap ${filter === 'approved' ? 'bg-background shadow-sm font-medium' : ''}`}
          >
            في انتظار التوثيق ({getStatusCount('approved')})
          </button>
          <button
            onClick={() => setFilter('documented')}
            className={`px-4 py-2 rounded-md text-sm transition-all whitespace-nowrap ${filter === 'documented' ? 'bg-background shadow-sm font-medium' : ''}`}
          >
            موثق ({getStatusCount('documented')})
          </button>
          <button
            onClick={() => setFilter('rejected-cancelled')}
            className={`px-4 py-2 rounded-md text-sm transition-all whitespace-nowrap ${filter === 'rejected-cancelled' ? 'bg-background shadow-sm font-medium' : ''}`}
          >
            مرفوض | ملغي ({getStatusCount('rejected-cancelled')})
          </button>
        </div>
      </div>

      <Card className="glass-card">
        <div className="p-4 border-b">
          <div className="relative max-w-md">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              className="pr-10"
              placeholder="بحث برقم الإرجاع، المتجر، أو المسوق..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            <AnimatePresence mode="popLayout">
              {filteredReturns.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-6 hover:bg-muted/30 transition-colors flex flex-col md:flex-row items-center gap-6"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.status === 'documented'
                      ? 'bg-green-500/10 text-green-600'
                      : item.status === 'rejected' || item.status === 'cancelled'
                        ? 'bg-red-500/10 text-red-600'
                        : 'bg-orange-500/10 text-orange-600'
                      }`}>
                      <ArrowDownLeft className="w-6 h-6" />
                    </div>
                    <div className="text-right">
                      <h3 className="font-bold text-lg">{item.return_number}</h3>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><Store className="w-3 h-3" /> {item.store_name}</span>
                        <span className="flex items-center gap-1"><User className="w-3 h-3" /> {item.marketer_name}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {item.created_at}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                    <div className="text-right">
                      <p className="text-[10px] text-muted-foreground uppercase">إجمالي القيمة</p>
                      <p className="font-bold text-lg text-primary">{getTotalAmount(item.items)} د.ل</p>
                    </div>

                    {getStatusBadge(item.status)}

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="hidden md:flex items-center gap-2"
                        onClick={() => setSelectedReturn(item)}
                      >
                        <FileText className="w-4 h-4" />
                        التفاصيل والمراجعة
                      </Button>

                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setSelectedReturn(item)}
                      >
                        <ChevronRight className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredReturns.length === 0 && (
              <div className="p-12 text-center text-muted-foreground">
                <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-20" />
                <p>لا توجد طلبات إرجاع في هذه الحالة حالياً.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Return Details Dialog */}
      <AnimatePresence>
        {selectedReturn && (
          <Dialog open={!!selectedReturn} onOpenChange={() => setSelectedReturn(null)}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <RotateCcw className="w-5 h-5 text-primary" />
                  مراجعة طلب إرجاع: {selectedReturn.return_number}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4 p-4 bg-accent/30 rounded-lg text-right">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">المتجر</p>
                    <p className="font-medium">{selectedReturn.store_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">المسوق</p>
                    <p className="font-medium">{selectedReturn.marketer_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">تاريخ الطلب</p>
                    <p className="font-medium">{selectedReturn.created_at}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">الحالة</p>
                    <div>{getStatusBadge(selectedReturn.status)}</div>
                  </div>

                  {selectedReturn.approved_by && (
                    <div className={`${selectedReturn.documented_by ? 'col-span-1' : 'col-span-2'} mt-2 pt-2 border-t border-dashed`}>
                      <p className="text-xs text-muted-foreground mb-1">تمت الموافقة بواسطة (أمين المخزن)</p>
                      <p className="font-bold text-primary">{selectedReturn.approved_by}</p>
                    </div>
                  )}
                  {selectedReturn.documented_by && (
                    <div className="col-span-1 mt-2 pt-2 border-t border-dashed flex justify-between items-center">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">تم التوثيق بواسطة (أمين المخزن)</p>
                        <p className="font-bold text-primary">{selectedReturn.documented_by}</p>
                      </div>
                      <div className="text-left">
                        <p className="text-xs text-muted-foreground mb-1">تاريخ التوثيق</p>
                        <p className="font-medium text-sm">{selectedReturn.documented_at}</p>
                      </div>
                    </div>
                  )}
                  {selectedReturn.keeper_name && !selectedReturn.documented_by && (
                    <div className="col-span-2 mt-2 pt-2 border-t border-dashed">
                      <p className="text-xs text-muted-foreground mb-1">
                        {selectedReturn.status === 'rejected' ? 'تم الرفض بواسطة (أمين المخزن)' :
                          selectedReturn.status === 'cancelled' ? 'تم الإلغاء بواسطة (أمين المخزن)' :
                            'المسؤول عن الإجراء'}
                      </p>
                      <p className="font-bold text-primary">{selectedReturn.keeper_name}</p>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-bold mb-3 flex items-center justify-end gap-2 text-right">
                    الأصناف المرتجعة
                    <Package className="w-4 h-4" />
                  </h3>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-right" dir="rtl">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="p-3 text-sm font-medium">اسم المنتج</th>
                          <th className="text-center p-3 text-sm font-medium">الكمية</th>
                          <th className="text-left p-3 text-sm font-medium">السعر (د.ل)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {selectedReturn.items.map((item, idx) => (
                          <tr key={idx} className="hover:bg-muted/30 transition-colors">
                            <td className="p-3 text-sm font-medium">{item.product}</td>
                            <td className="p-3 text-sm text-center">
                              <Badge variant="secondary" className="bg-orange-100 text-orange-700">{item.qty}</Badge>
                            </td>
                            <td className="p-3 text-sm text-left">{item.unit_price} د.ل</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-muted/30">
                        <tr>
                          <td colSpan={2} className="p-3 text-right font-bold text-sm">الإجمالي</td>
                          <td className="p-3 text-left font-bold text-lg text-primary">{getTotalAmount(selectedReturn.items)} د.ل</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setSelectedReturn(null)}
                  >
                    <ChevronLeft className="w-4 h-4 ml-2" />
                    إغلاق
                  </Button>

                  {selectedReturn.status === 'pending' && (
                    <>
                      <Button
                        variant="outline"
                        className="flex-1 text-destructive border-destructive/20 hover:bg-destructive/10"
                        onClick={() => {
                          handleReject(selectedReturn.id);
                          setSelectedReturn(null);
                        }}
                      >
                        <XCircle className="w-4 h-4 ml-2" />
                        رفض الطلب
                      </Button>
                      <Button
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={() => {
                          handleApprove(selectedReturn.id);
                          setSelectedReturn(null);
                        }}
                      >
                        <CheckCircle2 className="w-4 h-4 ml-2" />
                        موافقة واعتماد
                      </Button>
                    </>
                  )}

                  {selectedReturn.status === 'approved' && (
                    <Button
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                      onClick={() => {
                        setDocumentingReturn(selectedReturn);
                        setSelectedReturn(null);
                      }}
                    >
                      <Camera className="w-4 h-4 ml-2" />
                      توثيق الاستلام
                    </Button>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      {/* Documentation Dialog */}
      <AnimatePresence>
        {documentingReturn && (
          <Dialog open={!!documentingReturn} onOpenChange={() => {
            setDocumentingReturn(null);
            setDocumentImage(null);
          }}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-purple-600" />
                  توثيق استلام مرتجع: {documentingReturn.return_number}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 pt-4">
                <div
                  className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-4 transition-all cursor-pointer ${documentImage ? 'border-green-500 bg-green-500/5' : 'border-border hover:border-primary/50 hover:bg-primary/5'
                    }`}
                  onClick={() => setDocumentImage('fake-image-data')}
                >
                  {documentImage ? (
                    <>
                      <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center text-green-600">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold text-green-600">تم اختيار الصورة بنجاح</p>
                        <p className="text-xs text-muted-foreground">إيصال_مرتجع_{documentingReturn.return_number}.jpg</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={(e) => {
                        e.stopPropagation();
                        setDocumentImage(null);
                      }}>
                        تغيير الصورة
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <ImageIcon className="w-8 h-8" />
                      </div>
                      <div className="space-y-1 text-right">
                        <p className="font-bold">رفع صورة إيصال المرتجع المختوم</p>
                        <p className="text-xs text-muted-foreground text-center">تأكد من وضوح ختم المتجر وتوقيعك كأمين مخزن</p>
                      </div>
                    </>
                  )}
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3 text-right" dir="rtl">
                  <Clock className="w-5 h-5 text-amber-600 shrink-0" />
                  <p className="text-xs text-amber-800 leading-relaxed">
                    بالتوثيق، سيتم إعادة الأصناف تلقائياً إلى رصيد المخزن المتاح وخصم قيمتها من مديونية المسوق/المتجر.
                  </p>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setDocumentingReturn(null);
                      setDocumentImage(null);
                    }}
                  >
                    إلغاء
                  </Button>
                  <Button
                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                    disabled={!documentImage}
                    onClick={handleDocument}
                  >
                    إتمام التوثيق
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
};
