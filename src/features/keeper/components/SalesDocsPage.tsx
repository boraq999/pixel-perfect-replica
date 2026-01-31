import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckSquare,
  Search,
  FileText,
  User,
  Store,
  Calendar,
  Camera,
  CheckCircle2,
  ChevronRight,
  Eye,
  Package,
  ChevronLeft,
  XCircle,
  Clock,
  Image as ImageIcon,
  ClipboardList
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface SaleItem {
  product_id: number;
  name: string;
  quantity: number;
  price: number;
  discount: number;
}

interface MarketerSale {
  id: number;
  invoice: string;
  marketer: string;
  store: string;
  total: number;
  date: string;
  status: 'pending' | 'documented';
  items: SaleItem[];
  documented_by?: string;
  documented_at?: string;
}

const mockSales: MarketerSale[] = [
  {
    id: 1,
    invoice: 'SAL-2024-101',
    marketer: 'أحمد محمد',
    store: 'سوبر ماركت الوفاء',
    total: 1250.00,
    date: '2024-03-20',
    status: 'pending',
    items: [
      { product_id: 1, name: 'عطر الفارس 100مل', quantity: 5, price: 150, discount: 50 },
      { product_id: 2, name: 'بخور ملكي', quantity: 2, price: 250, discount: 0 },
    ]
  },
  {
    id: 2,
    invoice: 'SAL-2024-102',
    marketer: 'سارة خالد',
    store: 'محل البركة',
    total: 450.00,
    date: '2024-03-20',
    status: 'pending',
    items: [
      { product_id: 3, name: 'دخون فاخر', quantity: 3, price: 150, discount: 0 },
    ]
  },
  {
    id: 3,
    invoice: 'SAL-2024-103',
    marketer: 'محمد علي',
    store: 'بقالة النور',
    total: 2100.00,
    date: '2024-03-19',
    status: 'documented',
    documented_by: 'همام (أمين المخزن)',
    documented_at: '2024-03-19 15:30',
    items: [
      { product_id: 1, name: 'عطر الفارس 100مل', quantity: 10, price: 150, discount: 100 },
      { product_id: 2, name: 'بخور ملكي', quantity: 2, price: 350, discount: 0 },
    ]
  },
  {
    id: 4,
    invoice: 'SAL-2024-104',
    marketer: 'فاطمة أحمد',
    store: 'سوبر ماركت الأمل',
    total: 1800.00,
    date: '2024-03-19',
    status: 'documented',
    documented_by: 'أحمد (مسؤول المخزن)',
    documented_at: '2024-03-19 12:45',
    items: [
      { product_id: 3, name: 'دخون فاخر', quantity: 12, price: 150, discount: 0 },
    ]
  },
];

export const KeeperSalesDocsPage = () => {
  const [filter, setFilter] = useState<'pending' | 'documented'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSale, setSelectedSale] = useState<MarketerSale | null>(null);
  const [documentingSale, setDocumentingSale] = useState<MarketerSale | null>(null);
  const [documentImage, setDocumentImage] = useState<string | null>(null);
  const [sales, setSales] = useState<MarketerSale[]>(mockSales);

  const handleDocument = () => {
    if (!documentingSale || !documentImage) {
      toast.error('يرجى رفع صورة الفاتورة الموقعة أولاً');
      return;
    }

    setSales(prev => prev.map(sale =>
      sale.id === documentingSale.id ? {
        ...sale,
        status: 'documented',
        documented_by: 'همام (أمين المخزن)',
        documented_at: new Date().toLocaleString('ar-EG')
      } : sale
    ));
    toast.success('تم توثيق فاتورة البيع بنجاح');
    setDocumentingSale(null);
    setDocumentImage(null);
  };

  const filteredSales = sales.filter(sale => {
    const statusMatch = sale.status === filter;
    const searchMatch = !searchQuery ||
      sale.invoice.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.store.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.marketer.toLowerCase().includes(searchQuery.toLowerCase());
    return statusMatch && searchMatch;
  });

  const pendingCount = sales.filter(s => s.status === 'pending').length;
  const documentedCount = sales.filter(s => s.status === 'documented').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">بانتظار التوثيق</Badge>;
      case 'documented':
        return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">موثق</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">توثيق فواتير البيع</h1>
          <p className="text-muted-foreground text-sm">اعتماد فواتير المبيعات الميدانية وتحديث المخزون المعلق</p>
        </div>

        <div className="flex bg-muted p-1 rounded-lg">
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-md text-sm transition-all ${filter === 'pending' ? 'bg-background shadow-sm font-medium' : ''}`}
          >
            في انتظار التوثيق ({pendingCount})
          </button>
          <button
            onClick={() => setFilter('documented')}
            className={`px-4 py-2 rounded-md text-sm transition-all ${filter === 'documented' ? 'bg-background shadow-sm font-medium' : ''}`}
          >
            موثق ({documentedCount})
          </button>
        </div>
      </div>

      <Card className="glass-card">
        <div className="p-4 border-b">
          <div className="relative max-w-md">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              className="pr-10"
              placeholder="بحث برقم الفاتورة أو اسم المتجر..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            <AnimatePresence mode="popLayout">
              {filteredSales.map((sale) => (
                <motion.div
                  key={sale.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-6 hover:bg-muted/30 transition-colors flex flex-col md:flex-row items-center gap-6"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${sale.status === 'documented'
                      ? 'bg-green-500/10 text-green-600'
                      : 'bg-yellow-500/10 text-yellow-600'
                      }`}>
                      {sale.status === 'documented' ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : (
                        <FileText className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{sale.invoice}</h3>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><User className="w-3 h-3" /> {sale.marketer}</span>
                        <span className="flex items-center gap-1"><Store className="w-3 h-3" /> {sale.store}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {sale.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                    <div className="text-right">
                      <p className="text-[10px] text-muted-foreground uppercase">إجمالي الفاتورة</p>
                      <p className="text-xl font-bold text-primary">{sale.total.toLocaleString()} د.ل</p>
                    </div>

                    {getStatusBadge(sale.status)}

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="hidden md:flex items-center gap-2"
                        onClick={() => setSelectedSale(sale)}
                      >
                        <Eye className="w-4 h-4" />
                        مراجعة الفاتورة
                      </Button>

                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setSelectedSale(sale)}
                      >
                        <ChevronRight className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredSales.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                لا توجد فواتير في هذه الحالة حالياً.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Sale Details Dialog */}
      <AnimatePresence>
        {selectedSale && (
          <Dialog open={!!selectedSale} onOpenChange={() => setSelectedSale(null)}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto font-ar">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-xl">
                  <FileText className="w-5 h-5 text-primary" />
                  تفاصيل فاتورة البيع: {selectedSale.invoice}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4 p-4 bg-accent/30 rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">المسوق</p>
                    <p className="font-medium">{selectedSale.marketer}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">المتجر</p>
                    <p className="font-medium">{selectedSale.store}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">تاريخ الفاتورة</p>
                    <p className="font-medium">{selectedSale.date}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">الحالة</p>
                    <div>{getStatusBadge(selectedSale.status)}</div>
                  </div>

                  {selectedSale.documented_by && (
                    <div className="col-span-2 mt-2 pt-2 border-t border-dashed flex justify-between items-center">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">تم التوثيق بواسطة (أمين المخزن)</p>
                        <p className="font-bold text-primary">{selectedSale.documented_by}</p>
                      </div>
                      <div className="text-left">
                        <p className="text-xs text-muted-foreground mb-1">تاريخ التوثيق</p>
                        <p className="font-medium text-sm">{selectedSale.documented_at}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-bold mb-3 flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    الأصناف المباعة
                  </h3>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="text-right p-3 text-sm font-medium">اسم المنتج</th>
                          <th className="text-center p-3 text-sm font-medium">الكمية</th>
                          <th className="text-left p-3 text-sm font-medium">السعر</th>
                          <th className="text-left p-3 text-sm font-medium">التخفيض</th>
                          <th className="text-left p-3 text-sm font-medium">المجموع</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {selectedSale.items.map((item, idx) => (
                          <tr key={idx} className="hover:bg-muted/30 transition-colors text-sm">
                            <td className="p-3 font-medium">{item.name}</td>
                            <td className="p-3 text-center">
                              <Badge variant="secondary">{item.quantity}</Badge>
                            </td>
                            <td className="p-3 text-left">{item.price.toLocaleString()} د.ل</td>
                            <td className="p-3 text-left text-destructive">
                              {(item.discount || 0) > 0 ? `${item.discount.toLocaleString()} د.ل` : '-'}
                            </td>
                            <td className="p-3 text-left font-bold">
                              {((item.price * item.quantity) - (item.discount || 0)).toLocaleString()} د.ل
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-muted/30">
                        <tr>
                          <td colSpan={4} className="p-3 text-left font-bold text-sm">الإجمالي الكلي</td>
                          <td className="p-3 text-left font-bold text-lg text-primary">{selectedSale.total.toLocaleString()} د.ل</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setSelectedSale(null)}
                  >
                    <ChevronLeft className="w-4 h-4 ml-2" />
                    إغلاق
                  </Button>

                  {selectedSale.status === 'pending' && (
                    <Button
                      className="flex-1 bg-primary hover:bg-primary/90"
                      onClick={() => {
                        setDocumentingSale(selectedSale);
                        setSelectedSale(null);
                      }}
                    >
                      <Camera className="w-4 h-4 ml-2" />
                      توثيق الفاتورة
                    </Button>
                  )}

                  {selectedSale.status === 'documented' && (
                    <Button
                      variant="secondary"
                      className="flex-1"
                      onClick={() => {
                        toast.info('جاري عرض الفاتورة الموثقة...');
                      }}
                    >
                      <Eye className="w-4 h-4 ml-2" />
                      رؤية الفاتورة
                    </Button>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      {/* Documentation Dialog (Same as RequestsPage) */}
      <AnimatePresence>
        {documentingSale && (
          <Dialog open={!!documentingSale} onOpenChange={() => {
            setDocumentingSale(null);
            setDocumentImage(null);
          }}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-primary" />
                  توثيق فاتورة بيع: {documentingSale.invoice}
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
                        <p className="text-xs text-muted-foreground">فاتورة_مبيعات_{documentingSale.invoice}.jpg</p>
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
                      <div className="space-y-1">
                        <p className="font-bold">رفع صورة الفاتورة الموقعة</p>
                        <p className="text-xs text-muted-foreground">تأكد من وضوح ختم المتجر وتوقيع المستلم</p>
                      </div>
                    </>
                  )}
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
                  <Clock className="w-5 h-5 text-amber-600 shrink-0" />
                  <p className="text-xs text-amber-800 leading-relaxed">
                    بالضغط على إتمام التوثيق، فإنك تؤكد استلام المبلغ المالي أو سند القبض وتطابق الأصناف مع ما تم بيعه مسبقاً.
                  </p>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setDocumentingSale(null);
                      setDocumentImage(null);
                    }}
                  >
                    إلغاء
                  </Button>
                  <Button
                    className="flex-1 bg-primary hover:bg-primary/90"
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
