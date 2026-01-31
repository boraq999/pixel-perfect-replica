import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ClipboardList,
  Check,
  X,
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
  ChevronRight
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

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
  approved_by?: string;
  documented_by?: string;
  keeper_name?: string; // Used for single-action responsibly like reject/cancel
}

// Mock data based on the workflow
const mockRequests: MarketerRequest[] = [
  {
    id: 1,
    invoice_number: 'REQ-2024-001',
    marketer_name: 'أحمد محمد',
    marketer_id: 5,
    status: 'pending',
    created_at: '2024-03-20 10:30',
    items: [
      { product_id: 1, name: 'عطر الفارس 100مل', quantity: 10 },
      { product_id: 2, name: 'بخور ملكي', quantity: 5 },
    ]
  },
  {
    id: 2,
    invoice_number: 'REQ-2024-002',
    marketer_name: 'سارة علي',
    marketer_id: 6,
    status: 'pending',
    created_at: '2024-03-20 09:15',
    items: [
      { product_id: 1, name: 'عطر الفارس 100مل', quantity: 20 },
      { product_id: 3, name: 'دخون فاخر', quantity: 15 },
    ]
  },
  {
    id: 3,
    invoice_number: 'REQ-2024-003',
    marketer_name: 'محمد عبدالله',
    marketer_id: 7,
    status: 'approved',
    created_at: '2024-03-19 14:20',
    approved_by: 'مسعود (أمين مخزن)',
    items: [
      { product_id: 2, name: 'بخور ملكي', quantity: 8 },
    ]
  },
  {
    id: 4,
    invoice_number: 'REQ-2024-004',
    marketer_name: 'فاطمة أحمد',
    marketer_id: 8,
    status: 'approved',
    created_at: '2024-03-19 11:00',
    approved_by: 'مسعود (أمين مخزن)',
    items: [
      { product_id: 1, name: 'عطر الفارس 100مل', quantity: 15 },
      { product_id: 2, name: 'بخور ملكي', quantity: 10 },
    ]
  },
  {
    id: 5,
    invoice_number: 'REQ-2024-005',
    marketer_name: 'حسن خالد',
    marketer_id: 9,
    status: 'documented',
    created_at: '2024-03-18 16:45',
    approved_by: 'مسعود (أمين مخزن)',
    documented_by: 'همام (المسؤول الحالي)',
    items: [
      { product_id: 3, name: 'دخون فاخر', quantity: 25 },
    ]
  },
  {
    id: 6,
    invoice_number: 'REQ-2024-006',
    marketer_name: 'نور الدين',
    marketer_id: 10,
    status: 'rejected',
    created_at: '2024-03-18 13:30',
    keeper_name: 'أحمد (مسؤول المخزن الرئيسي)',
    items: [
      { product_id: 1, name: 'عطر الفارس 100مل', quantity: 50 },
    ]
  },
];

type RequestStatus = MarketerRequest['status'];

export const KeeperRequestsPage = () => {
  const [filter, setFilter] = useState<RequestStatus | 'rejected-cancelled'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
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

    const searchMatch = !searchQuery ||
      req.invoice_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.marketer_name.toLowerCase().includes(searchQuery.toLowerCase());

    return statusMatch && searchMatch;
  });

  const getStatusCount = (status: RequestStatus | 'rejected-cancelled') => {
    if (status === 'rejected-cancelled') {
      return requests.filter(r => r.status === 'rejected' || r.status === 'cancelled').length;
    }
    return requests.filter(r => r.status === status).length;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">قيد الانتظار</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20">بانتظار التوثيق</Badge>;
      case 'documented':
        return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">تم التوثيق</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/20">مرفوض</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-gray-500/10 text-gray-600 border-gray-500/20">ملغى</Badge>;
      default:
        return null;
    }
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

      <Card className="glass-card">
        <div className="p-4 border-b">
          <div className="relative max-w-md">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              className="pr-10"
              placeholder="بحث برقم الطلب أو اسم المسوق..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            <AnimatePresence mode="popLayout">
              {filteredRequests.map((request) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-6 hover:bg-muted/30 transition-colors flex flex-col md:flex-row items-center gap-6"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${request.status === 'documented'
                      ? 'bg-green-500/10 text-green-600'
                      : request.status === 'rejected' || request.status === 'cancelled'
                        ? 'bg-red-500/10 text-red-600'
                        : 'bg-yellow-500/10 text-yellow-600'
                      }`}>
                      <ClipboardList className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{request.invoice_number}</h3>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><User className="w-3 h-3" /> {request.marketer_name}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {request.created_at}</span>
                        <span className="flex items-center gap-1"><Package className="w-3 h-3" /> {request.items.length} أصناف</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                    {getStatusBadge(request.status)}

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="hidden md:flex items-center gap-2"
                        onClick={() => setSelectedRequest(request)}
                      >
                        <Eye className="w-4 h-4" />
                        مراجعة الطلب
                      </Button>

                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setSelectedRequest(request)}
                      >
                        <ChevronRight className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredRequests.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                لا توجد طلبات في هذه الحالة حالياً.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

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
                    <p className="text-xs text-muted-foreground mb-1">الحالة</p>
                    <div>{getStatusBadge(selectedRequest.status)}</div>
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
                    variant="outline"
                    className="flex-1 order-1"
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
                        className="flex-1 bg-green-600 hover:bg-green-700"
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
                        variant="secondary"
                        className="flex-1 order-2"
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
                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
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
                      variant="secondary"
                      className="flex-1 order-2"
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
                      variant="secondary"
                      className="flex-1 order-2"
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
