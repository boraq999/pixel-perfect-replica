// صفحة: مخزوني الفعلي (المسوق الأفضل)
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  Plus,
  Search,
  ArrowDownToLine,
  Check,
  X,
  Loader2,
  FileText,
  Upload,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useMarketerStore } from '@/store/marketerStore';
import { useAuthStore } from '@/store/authStore';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const WarehousePage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    requests,
    stock,
    fetchRequests,
    fetchStock,
    cancelRequest,
    documentRequest,
    isLoading
  } = useMarketerStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'my-stock' | 'requests'>('my-stock');
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchRequests(user.id);
      fetchStock(user.id);
    }
  }, [user?.id]);

  const handleCancelRequest = async (id: string) => {
    try {
      await cancelRequest(id);
      toast.success('تم إلغاء الطلب بنجاح');
    } catch (error) {
      toast.error('فشل إلغاء الطلب');
    }
  };

  const handleDocumentRequest = async () => {
    if (!selectedRequest) return;
    setUploading(true);
    try {
      // Simulate image upload
      await new Promise(resolve => setTimeout(resolve, 1500));
      await documentRequest(selectedRequest.id, 'keeper-1', 'path/to/signed-image.jpg');
      toast.success('تم توثيق استلام البضاعة وتحديث المخزون');
      setIsUploadDialogOpen(false);
      setSelectedRequest(null);
    } catch (error) {
      toast.error('فشل توثيق الاستلام');
    } finally {
      setUploading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">قيد الانتظار</Badge>;
      case 'approved': return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">تمت الموافقة</Badge>;
      case 'rejected': return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">مرفوض</Badge>;
      case 'documented': return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">تم الاستلام</Badge>;
      case 'cancelled': return <Badge variant="outline" className="bg-gray-500/10 text-gray-500 border-gray-500/20">ملغي</Badge>;
      default: return null;
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">المخزن وطلبات البضاعة</h1>
          <p className="text-muted-foreground">إدارة مخزونك وطلباتك من المخزن الرئيسي</p>
        </div>
        <Button onClick={() => navigate('receive')} className="gradient-btn">
          <Plus className="w-4 h-4 ml-2" />
          طلب بضاعة جديد
        </Button>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={itemVariants} className="flex gap-2 p-1 bg-accent/30 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('my-stock')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'my-stock'
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:text-foreground'
            }`}
        >
          المخزون الفعلي
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'requests'
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:text-foreground'
            }`}
        >
          المحجوز
        </button>
      </motion.div>

      {/* Search */}
      <motion.div variants={itemVariants} className="relative max-w-md">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="بحث..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pr-10"
        />
      </motion.div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'requests' ? (
          <motion.div
            key="requests"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-4"
          >
            {requests.filter(r => r.status === 'approved' || r.status === 'pending').length === 0 ? (
              <div className="text-center py-12 glass-card">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                <p className="text-muted-foreground">لا توجد طلبات محجوزة حالياً</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Reserved (Approved) Section */}
                {requests.filter(r => r.status === 'approved').length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-primary flex items-center gap-2 px-2">
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      بضاعة محجوزة (بانتظار التوثيق)
                    </h3>
                    {requests.filter(r => r.status === 'approved').map((request) => (
                      <div key={request.id} className="glass-card p-6 flex flex-col md:flex-row justify-between gap-4 border-primary/20 shadow-lg shadow-primary/5">
                        <div className="flex gap-4">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                            <Package className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-lg">{request.invoice_number}</span>
                              {getStatusBadge(request.status)}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              بتاريخ: {new Date(request.created_at).toLocaleDateString('ar-LY')}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {request.items.map((item, idx) => (
                                <span key={idx} className="text-xs bg-accent/50 px-2 py-1 rounded">
                                  {item.product?.name} ({item.quantity})
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20"
                            onClick={() => {
                              setSelectedRequest(request);
                              setIsUploadDialogOpen(true);
                            }}
                          >
                            <Upload className="w-4 h-4 ml-1" />
                            توثيق الاستلام
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pending Section */}
                {requests.filter(r => r.status === 'pending').length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-muted-foreground px-2">طلبات قيد المراجعة</h3>
                    {requests.filter(r => r.status === 'pending').map((request) => (
                      <div key={request.id} className="glass-card p-6 flex flex-col md:flex-row justify-between gap-4 opacity-80">
                        <div className="flex gap-4">
                          <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center shrink-0">
                            <FileText className="w-6 h-6 text-muted-foreground" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-lg">{request.invoice_number}</span>
                              {getStatusBadge(request.status)}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              بتاريخ: {new Date(request.created_at).toLocaleDateString('ar-LY')}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {request.items.map((item, idx) => (
                                <span key={idx} className="text-xs bg-accent/50 px-2 py-1 rounded">
                                  {item.product?.name} ({item.quantity})
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:bg-destructive/10"
                            onClick={() => handleCancelRequest(request.id)}
                          >
                            <X className="w-4 h-4 ml-1" />
                            إلغاء الطلب
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="stock"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {stock.length === 0 ? (
              <div className="col-span-full text-center py-12 glass-card">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                <p className="text-muted-foreground">مخزنك فارغ حالياً</p>
              </div>
            ) : (
              stock.map((item) => (
                <div key={item.id} className="glass-card p-4 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Package className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-2xl font-bold">{item.quantity}</span>
                  </div>
                  <h3 className="font-bold">{item.product?.name}</h3>
                  <p className="text-sm text-muted-foreground">{item.product?.barcode}</p>
                </div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Confirmation Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>توثيق استلام البضاعة</DialogTitle>
            <DialogDescription>
              يجب رفع صورة الفاتورة الموقعة لتأكيد استلامك للبضاعة من أمين المخزن.
            </DialogDescription>
          </DialogHeader>

          <div className="py-8 flex flex-col items-center justify-center border-2 border-dashed border-muted rounded-xl bg-accent/20">
            <Upload className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
            <p className="text-sm text-muted-foreground">اسحب الصورة هنا أو اضغط للاختيار</p>
            <Input type="file" className="hidden" id="file-upload" />
            <Button variant="outline" size="sm" className="mt-4" onClick={() => document.getElementById('file-upload')?.click()}>
              اختر ملف
            </Button>
          </div>

          <div className="bg-blue-500/10 p-4 rounded-lg flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-500 shrink-0" />
            <p className="text-xs text-blue-700 leading-relaxed">
              بمجرد التوثيق، سيتم إضافة الكميات إلى مخزونك الفعلي وخصمها من المخزن الرئيسي.
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>إلغاء</Button>
            <Button className="gradient-btn" onClick={handleDocumentRequest} disabled={uploading}>
              {uploading ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : <Check className="w-4 h-4 ml-2" />}
              تأكيد وتوثيق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};
