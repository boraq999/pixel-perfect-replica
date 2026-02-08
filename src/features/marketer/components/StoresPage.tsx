// صفحة: المتاجر والبيع (المسوق الأفضل)
import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Store as StoreIcon,
  Plus,
  Phone,
  MapPin,
  DollarSign,
  ShoppingCart,
  MessageCircle,
  Loader2,
  ChevronRight,
  ChevronLeft,
  User,
  Wallet,
  CheckCircle2,
  XCircle,
  MapPinned,
  Eye
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useMarketerStore } from '@/store/marketerStore';
import { useCurrency } from '@/store/currencyStore';
import { StatCard, SearchBar, PageHeader } from './shared';
import { useFilteredData } from '../hooks';

interface StoreFormData {
  name: string;
  address: string;
  phone: string;
}

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

export const StoresPage = () => {
  const navigate = useNavigate();
  const { stores, isLoading, fetchStores, storesPagination, totalStoresBalance } = useMarketerStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState<StoreFormData>({
    name: '',
    address: '',
    phone: ''
  });
  const { formatAmount } = useCurrency();

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const filteredStores = useFilteredData(stores, searchQuery, ['name', 'address', 'phone', 'location']);

  const statsData = useMemo(() => [
    {
      title: 'إجمالي المتاجر',
      value: storesPagination?.total || stores.length,
      icon: StoreIcon,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'إجمالي الأرصدة',
      value: formatAmount(totalStoresBalance),
      icon: DollarSign,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      title: 'محافظات التغطية',
      value: new Set(stores.map(s => s.location).filter(Boolean)).size,
      icon: MapPin,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: 'متاجر نشطة',
      value: storesPagination?.total || stores.length, // نفترض الكل نشط حالياً أو نضيف الفلترة لاحقاً
      icon: StoreIcon,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10'
    },
  ], [stores, storesPagination, totalStoresBalance, formatAmount]);

  const handleAddStore = () => {
    if (!formData.name || !formData.phone) {
      toast.error('يرجى إدخال اسم المتجر ورقم الهاتف');
      return;
    }
    toast.success(`تمت إضافة ${formData.name} بنجاح`);
    setIsAddDialogOpen(false);
    setFormData({ name: '', address: '', phone: '' });
  };

  const handleNewOrder = (storeId: string) => {
    navigate(`/dashboard/stores/new-order?storeId=${storeId}`);
  };

  const handleViewDetails = (storeId: string) => {
    navigate(`/dashboard/stores/${storeId}`);
  };

  const handleWhatsApp = (phone: string, storeName: string) => {
    const message = encodeURIComponent(`مرحباً ${storeName}، هذه رسالة من نظام تقنية للتوزيع.`);
    window.open(`https://wa.me/966${phone.slice(1)}?text=${message}`, '_blank');
    toast.success('جاري فتح واتساب...');
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >

      {/* Header */}
      <PageHeader
        title="إدارة المتاجر والبيع"
        subtitle="إدارة بيانات العملاء وتحليل أداء المبيعات"
        icon={StoreIcon}
        action={{
          label: "إضافة متجر جديد",
          icon: Plus,
          onClick: () => setIsAddDialogOpen(true)
        }}
      />

      {/* Stats */}
      <motion.div variants={itemVariants} className="hide-scrollbar flex gap-4 overflow-x-auto pb-2 -mx-2 px-2">
        {statsData.map((stat, i) => (
          <div key={i} className="min-w-[200px] flex-shrink-0">
            <StatCard {...stat} delay={i * 0.1} />
          </div>
        ))}
      </motion.div>

      {/* Search */}
      <motion.div variants={itemVariants} className="max-w-md">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="بحث عن متجر..."
        />
      </motion.div>

      {/* Stores Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary" />
          <p>جاري تحميل المتاجر...</p>
        </div>
      ) : filteredStores.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground bg-muted/20 rounded-3xl border border-dashed">
          <StoreIcon className="w-16 h-16 mb-4 opacity-20" />
          <p className="text-xl font-semibold">لم يتم العثور على أي متاجر</p>
          <p>حاول استخدام كلمات بحث أخرى</p>
        </div>
      ) : (
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStores.map((store) => (
            <motion.div
              key={store.id}
              layout
              whileHover={{ y: -5 }}
              className="relative overflow-hidden rounded-3xl border border-border bg-card/40 p-6 shadow-sm backdrop-blur-sm transition-all hover:shadow-xl hover:shadow-primary/5 hover:border-primary/50 group"
            >
              {/* Background Decoration */}
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/5 blur-3xl group-hover:bg-primary/10 transition-colors" />

              <div className="relative flex flex-col h-full">
                {/* Header: Logo & Status */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                      <StoreIcon className="h-7 w-7" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold tracking-tight">{store.name}</h3>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                        <MapPinned className="h-3.5 w-3.5" />
                        <span className="truncate max-w-[150px]">{store.location || 'غير محدد'}</span>
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider h-fit ${store.is_active
                      ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                      : "bg-red-500/10 text-red-600 border-red-500/20"
                      }`}
                  >
                    <span className="flex items-center gap-1">
                      {store.is_active ? (
                        <>
                          <CheckCircle2 className="h-3 w-3" />
                          نشط
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3 w-3" />
                          معطل
                        </>
                      )}
                    </span>
                  </Badge>
                </div>

                {/* Content: Details Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-3 rounded-2xl bg-accent/30 border border-border/50 group-hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="h-3.5 w-3.5 text-primary" />
                      <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-tighter">المالك</span>
                    </div>
                    <p className="text-sm font-bold truncate">
                      {store.owner_name || 'غير مسجل'}
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-accent/30 border border-border/50 group-hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-2 mb-1">
                      <Wallet className="h-3.5 w-3.5 text-emerald-500" />
                      <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-tighter">الرصيد</span>
                    </div>
                    <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      {formatAmount(store.remaining_debt || 0)}
                    </p>
                  </div>
                </div>

                {/* Footer: Contact & Actions */}
                <div className="flex gap-2 w-full">
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-10 w-10 rounded-xl border-border/60 hover:bg-primary/10 hover:text-primary hover:border-primary/50 transition-all active:scale-95 shadow-sm shrink-0"
                    onClick={() => handleViewDetails(store.id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <a
                    href={`tel:${store.phone}`}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border/60 bg-transparent text-muted-foreground hover:bg-blue-500/10 hover:text-blue-500 hover:border-blue-500/50 transition-all active:scale-95 shadow-sm shrink-0"
                  >
                    <Phone className="h-4 w-4" />
                  </a>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-10 w-10 rounded-xl border-border/60 hover:bg-green-500/10 hover:text-green-500 hover:border-green-500/50 transition-all active:scale-95 shadow-sm shrink-0"
                    onClick={() => handleWhatsApp(store.phone, store.name)}
                  >
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-primary/95 to-primary text-white h-10 flex-1 rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all font-bold border-none"
                    onClick={() => handleNewOrder(store.id)}
                  >
                    <ShoppingCart className="h-4 w-4 ml-1.5" />
                    طلب جديد
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Pagination */}
      {storesPagination && storesPagination.last_page > 1 && (
        <motion.div variants={itemVariants} className="flex justify-center items-center gap-4 pt-6 pb-12">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchStores({ page: storesPagination.current_page - 1 })}
            disabled={storesPagination.current_page === 1 || isLoading}
            className="rounded-xl h-10 px-4"
          >
            <ChevronRight className="w-4 h-4 ml-2" />
            السابق
          </Button>

          <div className="flex items-center gap-1.5 px-4 h-10 rounded-xl bg-accent/50 border border-border">
            <span className="text-sm font-bold text-primary">
              {storesPagination.current_page}
            </span>
            <span className="text-xs text-muted-foreground mr-1">
              من {storesPagination.last_page} ص
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchStores({ page: storesPagination.current_page + 1 })}
            disabled={storesPagination.current_page === storesPagination.last_page || isLoading}
            className="rounded-xl h-10 px-4"
          >
            التالي
            <ChevronLeft className="w-4 h-4 mr-2" />
          </Button>
        </motion.div>
      )}

      {/* Add Store Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <StoreIcon className="w-5 h-5 text-primary" />
              إضافة متجر جديد
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>اسم المتجر *</Label>
              <Input
                placeholder="أدخل اسم المتجر"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>العنوان</Label>
              <Input
                placeholder="أدخل العنوان"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>رقم الهاتف *</Label>
              <Input
                placeholder="05xxxxxxxx"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                dir="ltr"
              />
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleAddStore} className="gradient-btn">
              <Plus className="w-4 h-4 ml-2" />
              إضافة المتجر
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};
