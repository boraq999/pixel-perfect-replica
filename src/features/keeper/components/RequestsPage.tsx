import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ClipboardList,
  Search,
  Eye,
  User,
  Package,
  Clock,
  Camera,
  Image as ImageIcon,
  XCircle,
  CheckCircle2,
  Calendar,
  FileText,
  Printer,
  ChevronLeft,
  ChevronRight,
  Truck,
  Package2,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { RequestStatusBadge } from './shared/RequestStatusBadge';

interface RequestItem {
  product_id: number;
  name: string;
  quantity: number;
}

interface MarketerRequest {
  id: number;
  invoice_number: string;
  marketer_name: string;
  marketer_id: number;
  status: 'pending' | 'approved' | 'documented' | 'rejected' | 'cancelled';
  created_at: string;
  items: RequestItem[];
  total: number;
  approved_by?: string;
  documented_by?: string;
  keeper_name?: string; // Used for single-action responsibly like reject/cancel
}

// Mock data based on the workflow
const mockRequests: MarketerRequest[] = [
  {
    id: 1,
    invoice_number: 'ORD-2024-001',
    marketer_name: 'أحمد محمد',
    marketer_id: 5,
    status: 'approved',
    created_at: '2024-01-15',
    total: 15600.50,
    items: [
      { product_id: 1, name: 'عطر الفارس 100مل', quantity: 10 },
      { product_id: 2, name: 'بخور ملكي', quantity: 5 },
    ]
  },
  {
    id: 2,
    invoice_number: 'ORD-2024-002',
    marketer_name: 'سارة علي',
    marketer_id: 6,
    status: 'pending',
    created_at: '2024-01-16',
    total: 8500.00,
    items: [
      { product_id: 1, name: 'عطر الفارس 100مل', quantity: 20 },
      { product_id: 3, name: 'دخون فاخر', quantity: 15 },
    ]
  },
  {
    id: 3,
    invoice_number: 'ORD-2024-003',
    marketer_name: 'محمد عبدالله',
    marketer_id: 7,
    status: 'documented',
    created_at: '2024-01-17',
    total: 12000.00,
    items: [
      { product_id: 2, name: 'بخور ملكي', quantity: 8 },
    ]
  },
  {
    id: 4,
    invoice_number: 'ORD-2024-004',
    marketer_name: 'فاطمة أحمد',
    marketer_id: 8,
    status: 'approved',
    created_at: '2024-01-19',
    total: 9250.75,
    items: [
      { product_id: 1, name: 'عطر الفارس 100مل', quantity: 15 },
      { product_id: 2, name: 'بخور ملكي', quantity: 10 },
    ]
  },
  {
    id: 5,
    invoice_number: 'ORD-2024-005',
    marketer_name: 'حسن خالد',
    marketer_id: 9,
    status: 'rejected',
    created_at: '2024-01-20',
    total: 3500.00,
    items: [
      { product_id: 3, name: 'دخون فاخر', quantity: 5 },
    ]
  }
];

type RequestStatus = MarketerRequest['status'];

export const KeeperRequestsPage = () => {
  const [filter, setFilter] = useState<RequestStatus | 'rejected-cancelled'>('pending');
  const [invoiceSearch, setInvoiceSearch] = useState('');
  const [marketerSearch, setMarketerSearch] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<MarketerRequest | null>(null);
  const [documentingRequest, setDocumentingRequest] = useState<MarketerRequest | null>(null);
  const [requests, setRequests] = useState<MarketerRequest[]>(mockRequests);
  const [documentImage, setDocumentImage] = useState<string | null>(null);

  const handleApprove = (id: number) => {
    setRequests(prev => prev.map(req =>
      req.id === id ? { ...req, status: 'approved', approved_by: 'مسعود (أمين مخزن)' } as MarketerRequest : req
    ));
    toast.success('تمت الموافقة على الطلب');
  };

  const handleReject = (id: number) => {
    setRequests(prev => prev.map(req =>
      req.id === id ? { ...req, status: 'rejected', keeper_name: 'همام (أمين المخزن)' } as MarketerRequest : req
    ));
    toast.error('تم رفض الطلب');
  };

  const handleCancel = (id: number) => {
    setRequests(prev => prev.map(req =>
      req.id === id ? { ...req, status: 'cancelled', keeper_name: 'همام (أمين المخزن)' } as MarketerRequest : req
    ));
    toast.info('تم إلغاء الطلب');
  };

  const handleDocument = () => {
    if (!documentingRequest || !documentImage) {
      toast.error('يرجى رفع صورة الفاتورة الموقعة أولاً');
      return;
    }

    setRequests(prev => prev.map(req =>
      req.id === documentingRequest.id ? {
        ...req,
        status: 'documented',
        documented_by: 'همام (أمين المخزن)'
      } as MarketerRequest : req
    ));
    toast.success('تم توثيق الاستلام وتحديث المخزن بنجاح');
    setDocumentingRequest(null);
    setDocumentImage(null);
  };

  const filteredRequests = requests.filter(req => {
    let statusMatch = false;
    if (filter === 'rejected-cancelled') {
      statusMatch = req.status === 'rejected' || req.status === 'cancelled';
    } else {
      statusMatch = req.status === filter;
    }

    const invoiceMatch = !invoiceSearch ||
      req.invoice_number.toLowerCase().includes(invoiceSearch.toLowerCase());

    const marketerMatch = !marketerSearch ||
      req.marketer_name.toLowerCase().includes(marketerSearch.toLowerCase());

    return statusMatch && invoiceMatch && marketerMatch;
  });

  const getStatusCount = (status: RequestStatus | 'rejected-cancelled') => {
    if (status === 'rejected-cancelled') {
      return requests.filter(r => r.status === 'rejected' || r.status === 'cancelled').length;
    }
    return requests.filter(r => r.status === status).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">طلبات المسوقين</h1>
          <p className="text-muted-foreground text-sm">متابعة واعتماد طلبات سحب البضاعة</p>
        </div>

        <div className="flex bg-muted p-1 rounded-lg">
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-md text-sm transition-all ${filter === 'pending' ? 'bg-background shadow-sm font-medium' : ''}`}
          >
            قيد الانتظار ({getStatusCount('pending')})
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 rounded-md text-sm transition-all ${filter === 'approved' ? 'bg-background shadow-sm font-medium' : ''}`}
          >
            بانتظار التوثيق ({getStatusCount('approved')})
          </button>
          <button
            onClick={() => setFilter('documented')}
            className={`px-4 py-2 rounded-md text-sm transition-all ${filter === 'documented' ? 'bg-background shadow-sm font-medium' : ''}`}
          >
            تم التوثيق ({getStatusCount('documented')})
          </button>
          <button
            onClick={() => setFilter('rejected-cancelled')}
            className={`px-4 py-2 rounded-md text-sm transition-all ${filter === 'rejected-cancelled' ? 'bg-background shadow-sm font-medium' : ''}`}
          >
            مرفوض / ملغى ({getStatusCount('rejected-cancelled')})
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="glass-card p-4 rounded-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                className="pr-10 bg-background/50 border-none shadow-sm h-12 rounded-xl"
                placeholder="رقم الفاتورة..."
                value={invoiceSearch}
                onChange={(e) => setInvoiceSearch(e.target.value)}
              />
            </div>
            <div className="relative">
              <User className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                className="pr-10 bg-background/50 border-none shadow-sm h-12 rounded-xl"
                placeholder="اسم المسوق..."
                value={marketerSearch}
                onChange={(e) => setMarketerSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredRequests.map((request) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group relative cursor-pointer"
                onClick={() => setSelectedRequest(request)}
              >
                <div className="bg-card border border-border rounded-[1.5rem] p-5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-0.5">
                  <div className="flex flex-col md:flex-row items-center gap-5">
                    {/* Status Icon */}
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${request.status === 'approved'
                      ? 'bg-success/10 text-success'
                      : request.status === 'pending'
                        ? 'bg-warning/10 text-warning'
                        : request.status === 'documented'
                          ? 'bg-info/10 text-info'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                      {request.status === 'approved' && <CheckCircle2 className="w-6 h-6" />}
                      {request.status === 'pending' && <Clock className="w-6 h-6" />}
                      {request.status === 'documented' && <Truck className="w-6 h-6" />}
                      {(request.status === 'rejected' || request.status === 'cancelled') && <XCircle className="w-6 h-6" />}
                    </div>

                    {/* Basic Info */}
                    <div className="flex-1 text-center md:text-right">
                      <h3 className="text-lg font-black text-foreground tracking-tight mb-1">
                        {request.invoice_number}
                      </h3>
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1 text-[13px] text-muted-foreground font-medium">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 opacity-70" />
                          {request.created_at}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-border hidden md:block" />
                        <span className="flex items-center gap-1.5 text-primary/80">
                          <User className="w-3.5 h-3.5" />
                          {request.marketer_name}
                        </span>
                      </div>
                    </div>

                    {/* Status Badge & Arrow */}
                    <div className="flex items-center gap-4">
                      <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs border ${request.status === 'approved'
                        ? 'bg-success/10 text-success border-success/20'
                        : request.status === 'pending'
                          ? 'bg-warning/10 text-warning border-warning/20'
                          : request.status === 'documented'
                            ? 'bg-info/10 text-info border-info/20'
                            : 'bg-muted text-muted-foreground border-border'
                        }`}>
                        {request.status === 'approved' && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {request.status === 'pending' && <Clock className="w-3.5 h-3.5" />}
                        {request.status === 'documented' && <Truck className="w-3.5 h-3.5" />}
                        {(request.status === 'rejected' || request.status === 'cancelled') && <XCircle className="w-3.5 h-3.5" />}
                        {request.status === 'approved' && "تمت الموافقة"}
                        {request.status === 'pending' && "قيد الانتظار"}
                        {request.status === 'documented' && "تم التسليم"}
                        {request.status === 'rejected' && "مرفوض"}
                        {request.status === 'cancelled' && "ملغى"}
                      </div>

                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                        <ChevronRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredRequests.length === 0 && (
            <div className="p-12 text-center bg-white dark:bg-zinc-900 rounded-[2rem] border-2 border-dashed border-zinc-200 dark:border-zinc-800">
              <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-zinc-400" />
              </div>
              <p className="text-zinc-500 font-bold text-lg">لا توجد طلبات في هذه الحالة حالياً.</p>
              <p className="text-zinc-400 text-sm">حاول تغيير الفلتر أو البحث عن طلب آخر</p>
            </div>
          )}
        </div>
      </div>

      {/* Request Details Dialog */}
      <AnimatePresence>
        {selectedRequest && (
          <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  تفاصيل الطلب: {selectedRequest.invoice_number}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4 p-4 bg-accent/30 rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">المسوق</p>
                    <p className="font-medium">{selectedRequest.marketer_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">تاريخ الطلب</p>
                    <p className="font-medium">{selectedRequest.created_at}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1.5">الحالة</p>
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full font-bold text-[10px] border w-fit ${selectedRequest.status === 'approved'
                      ? 'bg-success/10 text-success border-success/10'
                      : selectedRequest.status === 'pending'
                        ? 'bg-warning/10 text-warning border-warning/10'
                        : selectedRequest.status === 'documented'
                          ? 'bg-info/10 text-info border-info/10'
                          : 'bg-muted text-muted-foreground border-border'
                      }`}>
                      {selectedRequest.status === 'approved' && <CheckCircle2 className="w-3 h-3" />}
                      {selectedRequest.status === 'pending' && <Clock className="w-3 h-3" />}
                      {selectedRequest.status === 'documented' && <Truck className="w-3 h-3" />}
                      {selectedRequest.status === 'approved' && "تمت الموافقة"}
                      {selectedRequest.status === 'pending' && "قيد الانتظار"}
                      {selectedRequest.status === 'documented' && "تم التسليم"}
                      {selectedRequest.status === 'rejected' && "مرفوض"}
                      {selectedRequest.status === 'cancelled' && "ملغى"}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">عدد الأصناف</p>
                    <p className="font-medium">{selectedRequest.items.length} صنف</p>
                  </div>

                  {/* Responsible persons section - Double display requested */}
                  {selectedRequest.approved_by && (
                    <div className={`${selectedRequest.documented_by ? 'col-span-1' : 'col-span-2'} mt-2 pt-2 border-t border-dashed`}>
                      <p className="text-xs text-muted-foreground mb-1">تمت الموافقة بواسطة (أمين المخزن)</p>
                      <p className="font-bold text-primary">{selectedRequest.approved_by}</p>
                    </div>
                  )}
                  {selectedRequest.documented_by && (
                    <div className="col-span-1 mt-2 pt-2 border-t border-dashed">
                      <p className="text-xs text-muted-foreground mb-1">تم التوثيق بواسطة (أمين المخزن)</p>
                      <p className="font-bold text-primary">{selectedRequest.documented_by}</p>
                    </div>
                  )}
                  {selectedRequest.keeper_name && !selectedRequest.documented_by && (
                    <div className="col-span-2 mt-2 pt-2 border-t border-dashed">
                      <p className="text-xs text-muted-foreground mb-1">
                        {selectedRequest.status === 'rejected' ? 'تم الرفض بواسطة (أمين المخزن)' :
                          selectedRequest.status === 'cancelled' ? 'تم الإلغاء بواسطة (أمين المخزن)' :
                            'المسؤول عن الإجراء'}
                      </p>
                      <p className="font-bold text-primary">{selectedRequest.keeper_name}</p>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-bold mb-3 flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    الأصناف المطلوبة
                  </h3>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="text-right p-3 text-sm font-medium">#</th>
                          <th className="text-right p-3 text-sm font-medium">اسم المنتج</th>
                          <th className="text-center p-3 text-sm font-medium">الكمية</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {selectedRequest.items.map((item, idx) => (
                          <tr key={idx} className="hover:bg-muted/30 transition-colors">
                            <td className="p-3 text-sm">{idx + 1}</td>
                            <td className="p-3 text-sm font-medium">{item.name}</td>
                            <td className="p-3 text-sm text-center">
                              <Badge variant="secondary">{item.quantity}</Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-4 border-t">
                  <Button
                    variant="secondary"
                    className="flex-1 font-bold"
                    onClick={() => setSelectedRequest(null)}
                  >
                    <ChevronLeft className="w-4 h-4 ml-2" />
                    إغلاق
                  </Button>

                  {selectedRequest.status === 'pending' && (
                    <>
                      <Button
                        variant="outline"
                        className="flex-1 text-destructive border-destructive/20 hover:bg-destructive/10"
                        onClick={() => {
                          handleCancel(selectedRequest.id);
                          setSelectedRequest(null);
                        }}
                      >
                        <XCircle className="w-4 h-4 ml-2" />
                        إلغاء الطلب
                      </Button>
                      <Button
                        className="flex-1 bg-success text-success-foreground hover:bg-success/90 font-bold"
                        onClick={() => {
                          handleApprove(selectedRequest.id);
                          setSelectedRequest(null);
                        }}
                      >
                        <CheckCircle2 className="w-4 h-4 ml-2" />
                        موافقة واعتماد
                      </Button>
                    </>
                  )}

                  {selectedRequest.status === 'approved' && (
                    <>
                      <Button
                        variant="ghost"
                        className="flex-1 border hover:bg-accent"
                        onClick={() => {
                          toast.info('جاري تجهيز الفاتورة للطباعة...');
                          window.print();
                        }}
                      >
                        <Printer className="w-4 h-4 ml-2" />
                        طباعة الفاتورة
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 text-destructive border-destructive/20 hover:bg-destructive/10"
                        onClick={() => {
                          handleCancel(selectedRequest.id);
                          setSelectedRequest(null);
                        }}
                      >
                        <XCircle className="w-4 h-4 ml-2" />
                        إلغاء الطلب
                      </Button>
                      <Button
                        className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-bold"
                        onClick={() => {
                          setDocumentingRequest(selectedRequest);
                          setSelectedRequest(null);
                        }}
                      >
                        <Camera className="w-4 h-4 ml-2" />
                        توثيق الاستلام
                      </Button>
                    </>
                  )}

                  {(selectedRequest.status === 'rejected' || selectedRequest.status === 'cancelled') && (
                    <Button
                      variant="ghost"
                      className="flex-1 border hover:bg-accent"
                      onClick={() => {
                        toast.info('جاري تجهيز الفاتورة للطباعة...');
                        window.print();
                      }}
                    >
                      <Printer className="w-4 h-4 ml-2" />
                      طباعة الفاتورة
                    </Button>
                  )}

                  {selectedRequest.status === 'documented' && (
                    <Button
                      variant="ghost"
                      className="flex-1 border hover:bg-accent"
                      onClick={() => {
                        toast.info('جاري عرض الفاتورة الموثقة...');
                        // Logic to view the invoice/image would go here
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

      {/* Documentation Dialog */}
      <AnimatePresence>
        {documentingRequest && (
          <Dialog open={!!documentingRequest} onOpenChange={() => {
            setDocumentingRequest(null);
            setDocumentImage(null);
          }}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-purple-600" />
                  توثيق استلام: {documentingRequest.invoice_number}
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
                        <p className="text-xs text-muted-foreground">فاتورة_موقعة_{documentingRequest.invoice_number}.jpg</p>
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
                        <p className="text-xs text-muted-foreground">PNG, JPG تصل إلى 10MB</p>
                      </div>
                    </>
                  )}
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
                  <Clock className="w-5 h-5 text-amber-600 shrink-0" />
                  <p className="text-xs text-amber-800 leading-relaxed">
                    يجب أن تكون الفاتورة موقعة من المسوق وتحتوي على ختم الاستلام. تفتيش المخزون وتحديث الكميات سيتم فوراً بعد الاعتماد.
                  </p>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setDocumentingRequest(null);
                      setDocumentImage(null);
                    }}
                  >
                    إلغاء
                  </Button>
                  <Button
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-lg shadow-primary/20"
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
