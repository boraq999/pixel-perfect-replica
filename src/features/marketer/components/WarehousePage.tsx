// صفحة: مخزوني الفعلي (المسوق الأفضل)
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  Plus,
  Check,
  Loader2,
  FileText,
  Upload,
  AlertCircle,
  Boxes,
  Clock,
  CheckCircle,
  TrendingUp,
  Calendar
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
import { Card, CardHeader } from '@/components/ui/card';
import { toast } from 'sonner';
import { useMarketerStore } from '@/store/marketerStore';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';
import { StatCard, SearchBar, ViewModeToggle, EmptyState, StatusBadge } from './shared';
import { useMarketerData, useFilteredData } from '../hooks';

export const WarehousePage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { cancelRequest, documentRequest } = useMarketerStore();
  const { requests, stock, isLoading } = useMarketerData(user?.id);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'my-stock' | 'requests' | 'pending'>('my-stock');
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const stats = useMemo(() => {
    return {
      totalStockItems: stock.reduce((acc, item) => acc + item.quantity, 0),
      reservedRequests: requests.filter(r => r.status === 'approved' || r.status === 'pending').length,
      pendingRequests: requests.filter(r => r.status === 'pending').length,
      approvedRequests: requests.filter(r => r.status === 'approved').length,
    };
  }, [stock, requests]);

  const reservedItems = useMemo(() => {
    return requests
      .filter(r => r.status === 'approved')
      .flatMap(r => r.items.map(item => ({
        ...item,
        status: r.status,
        invoice_number: r.invoice_number,
        date: r.created_at,
        request_id: r.id
      })));
  }, [requests]);

  const pendingItems = useMemo(() => {
    return requests
      .filter(r => r.status === 'pending')
      .flatMap(r => r.items.map(item => ({
        ...item,
        status: r.status,
        invoice_number: r.invoice_number,
        date: r.created_at,
        request_id: r.id
      })));
  }, [requests]);

  const filteredReservedItems = useFilteredData(reservedItems, searchQuery, ['product', 'invoice_number']);
  const filteredPendingItems = useFilteredData(pendingItems, searchQuery, ['product', 'invoice_number']);
  const filteredStock = useFilteredData(stock, searchQuery, ['product']);

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

  const statsData = [
    { title: 'إجمالي المخزون', value: `${stats.totalStockItems} قطعة`, icon: Boxes, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
    { title: 'محجوز (موافق عليه)', value: stats.approvedRequests, icon: CheckCircle, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10' },
    { title: 'قيد المراجعة', value: stats.pendingRequests, icon: Clock, color: 'text-amber-500', bgColor: 'bg-amber-500/10' },
    { title: 'إجمالي الحركات', value: requests.length, icon: TrendingUp, color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Premium Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/95 to-primary p-6 text-white shadow-2xl md:p-8">
        <div className="absolute top-0 right-0 h-full w-1/2 bg-[url('/pattern.svg')] opacity-10 mix-blend-overlay" />
        <div className="relative z-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-white/20 p-2 backdrop-blur-md md:p-3">
                <Boxes className="h-6 w-6 md:h-8 md:w-8" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight md:text-4xl text-white">مخزوني الفعلي</h1>
                <p className="mt-0.5 text-xs md:mt-1 md:text-base text-white/80">إدارة البضاعة ومتابعة حالة الطلبات</p>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden md:block"
          >
            <Button
              onClick={() => navigate('receive')}
              size="lg"
              className="h-14 gap-2 rounded-2xl bg-white px-8 font-bold text-primary shadow-xl hover:bg-white/90 font-ar"
            >
              <Plus className="h-5 w-5" />
              طلب بضاعة جديد
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Stats */}
      <div className="hide-scrollbar flex gap-4 overflow-x-auto pb-2 -mx-2 px-2 md:mx-0 md:px-0 md:grid md:grid-cols-4 md:overflow-visible">
        {statsData.map((stat, i) => (
          <div key={i} className="min-w-[200px] flex-shrink-0 md:min-w-0">
            <StatCard {...stat} delay={i * 0.1} />
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="lg:grid lg:grid-cols-1 gap-8">
        <div className="space-y-6">
          <Card className="border-none shadow-md overflow-hidden min-h-[500px]">
            <CardHeader className="bg-muted/30 p-4 md:pb-0">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between pb-4">
                <div className="flex w-full items-center gap-2">
                  <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="بحث عن منتج..."
                    className="flex-1 sm:max-w-xs"
                  />
                  <ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />
                </div>
              </div>

              <div className="flex gap-6 border-b">
                <button
                  onClick={() => setActiveTab('my-stock')}
                  className={`pb-4 text-sm font-bold transition-all relative ${activeTab === 'my-stock' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  المخزون الفعلي
                  {activeTab === 'my-stock' && (
                    <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('requests')}
                  className={`pb-4 text-sm font-bold transition-all relative ${activeTab === 'requests' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  محجوزة
                  {activeTab === 'requests' && (
                    <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('pending')}
                  className={`pb-4 text-sm font-bold transition-all relative ${activeTab === 'pending' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  قيد المراجعة
                  {activeTab === 'pending' && (
                    <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                  )}
                </button>
              </div>
            </CardHeader>

            <div className="p-6">
              <AnimatePresence mode="wait">
                {activeTab === 'pending' ? (
                  <motion.div
                    key="pending"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "flex flex-col gap-3"}
                  >
                    {filteredPendingItems.length === 0 ? (
                      <EmptyState
                        icon={Clock}
                        title="لا توجد طلبات قيد المراجعة"
                        description="جميع طلباتك تمت مراجعتها"
                      />
                    ) : (
                      filteredPendingItems.map((item, idx) => (
                        <motion.div
                          key={`${item.id}-${idx}`}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          className={`group rounded-2xl border bg-card transition-all hover:border-amber-500/50 hover:shadow-lg ${viewMode === 'grid' ? 'p-6 flex flex-col items-center text-center' : 'p-4 flex items-center justify-between'}`}
                        >
                          <div className={`flex items-center gap-4 ${viewMode === 'grid' ? 'flex-col mb-4' : ''}`}>
                            <div className="h-14 w-14 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110 bg-amber-500/10 text-amber-600">
                              <Clock className="h-7 w-7" />
                            </div>
                            <div className={viewMode === 'grid' ? '' : 'text-right flex-1'}>
                              <div className="flex items-center gap-2 justify-center md:justify-start mb-1">
                                <h3 className="font-bold text-lg">{item.product?.name}</h3>
                              </div>
                              <p className="text-xs text-muted-foreground mb-2">رقم الطلب: {item.invoice_number}</p>
                              <StatusBadge status={item.status as any} size="md" />
                            </div>
                          </div>
                          <div className={viewMode === 'grid' ? 'w-full pt-4 border-t' : 'text-left pl-4 border-l'}>
                            <div className="flex flex-col items-center">
                              <span className="text-xs text-muted-foreground font-medium mb-1">الكمية المطلوبة</span>
                              <span className="text-3xl font-black font-ar text-amber-500">{item.quantity}</span>
                            </div>
                          </div>
                          {viewMode === 'list' && (
                            <div className="mr-6 flex items-center gap-2 text-xs text-muted-foreground min-w-[120px]">
                              <Calendar className="w-3 h-3" />
                              {new Date(item.date).toLocaleDateString('ar-LY')}
                            </div>
                          )}
                        </motion.div>
                      ))
                    )}
                  </motion.div>
                ) : activeTab === 'requests' ? (
                  <motion.div
                    key="requests"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "flex flex-col gap-3"}
                  >
                    {filteredReservedItems.length === 0 ? (
                      <EmptyState
                        icon={FileText}
                        title="لا توجد بضاعة محجوزة"
                        description="جميع طلباتك تمت معالجتها أو لم تقم بطلب بضاعة بعد"
                      />
                    ) : (
                      filteredReservedItems.map((item, idx) => (
                        <motion.div
                          key={`${item.id}-${idx}`}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          className={`group rounded-2xl border bg-card transition-all hover:border-primary/50 hover:shadow-lg ${viewMode === 'grid' ? 'p-6 flex flex-col items-center text-center' : 'p-4 flex items-center justify-between'}`}
                        >
                          <div className={`flex items-center gap-4 ${viewMode === 'grid' ? 'flex-col mb-4' : ''}`}>
                            <div className="h-14 w-14 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110 bg-emerald-500/10 text-emerald-600">
                              <Package className="h-7 w-7" />
                            </div>
                            <div className={viewMode === 'grid' ? '' : 'text-right flex-1'}>
                              <div className="flex items-center gap-2 justify-center md:justify-start mb-1">
                                <h3 className="font-bold text-lg">{item.product?.name}</h3>
                              </div>
                              <p className="text-xs text-muted-foreground mb-2">رقم الطلب: {item.invoice_number}</p>
                              <StatusBadge status={item.status as any} size="md" />
                            </div>
                          </div>
                          <div className={viewMode === 'grid' ? 'w-full pt-4 border-t' : 'text-left pl-4 border-l'}>
                            <div className="flex flex-col items-center">
                              <span className="text-xs text-muted-foreground font-medium mb-1">الكمية المحجوزة</span>
                              <span className="text-3xl font-black font-ar text-emerald-600">{item.quantity}</span>
                            </div>
                          </div>
                          {viewMode === 'list' && (
                            <div className="mr-6 flex items-center gap-2 text-xs text-muted-foreground min-w-[120px]">
                              <Calendar className="w-3 h-3" />
                              {new Date(item.date).toLocaleDateString('ar-LY')}
                            </div>
                          )}
                        </motion.div>
                      ))
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="stock"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "flex flex-col gap-3"}
                  >
                    {filteredStock.length === 0 ? (
                      <EmptyState
                        icon={Package}
                        title="مخزنك فارغ حالياً"
                        description="لم يتم إضافة أي بضاعة لمخزونك الفعلي بعد"
                        action={{
                          label: 'طلب بضاعة من المخزن',
                          onClick: () => navigate('receive')
                        }}
                      />
                    ) : (
                      filteredStock.map((item, idx) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          className={`group rounded-2xl border bg-card transition-all hover:border-primary/50 hover:shadow-lg ${viewMode === 'grid' ? 'p-6 flex flex-col items-center text-center' : 'p-4 flex items-center justify-between'}`}
                        >
                          <div className={`flex items-center gap-4 ${viewMode === 'grid' ? 'flex-col mb-4' : ''}`}>
                            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                              <Package className="h-7 w-7" />
                            </div>
                            <div className={viewMode === 'grid' ? '' : 'text-right flex-1'}>
                              <div className="flex items-center gap-2 justify-center md:justify-start mb-1">
                                <h3 className="font-bold text-lg">{item.product?.name}</h3>
                              </div>
                              <p className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-md inline-block">
                                {item.product?.barcode}
                              </p>
                            </div>
                          </div>
                          <div className={viewMode === 'grid' ? 'w-full pt-4 border-t' : 'text-left pl-4 border-l'}>
                            <div className="flex flex-col items-center">
                              <span className="text-xs text-muted-foreground font-medium mb-1">الكمية المتوفرة</span>
                              <span className="text-3xl font-black text-primary font-ar">{item.quantity}</span>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Card>
        </div>
      </div>

      {/* Mobile FAB */}
      <motion.div
        className="fixed bottom-6 right-6 z-50 md:hidden"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.5 }}
      >
        <Button
          onClick={() => navigate('receive')}
          size="icon"
          className="h-16 w-16 rounded-full bg-primary text-white shadow-2xl shadow-primary/40 flex items-center justify-center active:scale-90 transition-transform"
        >
          <Plus className="h-8 w-8" />
        </Button>
      </motion.div>

      {/* Upload Dialog */}
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
    </div>
  );
};
