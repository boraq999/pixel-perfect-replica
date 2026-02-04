import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Store,
  Plus,
  Search,
  Phone,
  MapPin,
  DollarSign,
  ShoppingCart,
  Eye,
  Edit,
  Trash2,
  MessageCircle
} from 'lucide-react';
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
import { useCurrency } from '@/store/currencyStore';

// Mock data
const mockStores = [
  { id: '1', name: 'متجر الرياض', address: 'حي النزهة، الرياض', phone: '0501234567', balance: 5000, ordersCount: 25 },
  { id: '2', name: 'سوبرماركت النور', address: 'حي العليا، الرياض', phone: '0507654321', balance: 3200, ordersCount: 18 },
  { id: '3', name: 'مركز السلام', address: 'حي السلامة، جدة', phone: '0559876543', balance: 8500, ordersCount: 42 },
  { id: '4', name: 'متجر الخير', address: 'حي الروضة، الدمام', phone: '0541239876', balance: 1200, ordersCount: 8 },
  { id: '5', name: 'بقالة الأمل', address: 'حي الملك فهد، الرياض', phone: '0562345678', balance: 2800, ordersCount: 15 },
];

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
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState<StoreFormData>({
    name: '',
    address: '',
    phone: ''
  });
  const { formatAmount } = useCurrency();

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

  const handleWhatsApp = (phone: string, storeName: string) => {
    const message = encodeURIComponent(`مرحباً ${storeName}، هذه رسالة من نظام تقنية للتوزيع.`);
    window.open(`https://wa.me/966${phone.slice(1)}?text=${message}`, '_blank');
    toast.success('جاري فتح واتساب...');
  };

  const filteredStores = mockStores.filter(store =>
    store.name.includes(searchQuery) ||
    store.address.includes(searchQuery) ||
    store.phone.includes(searchQuery)
  );

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
          <h1 className="text-2xl font-bold">إدارة المتاجر</h1>
          <p className="text-muted-foreground">إدارة المتاجر وإنشاء الطلبات</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} className="gradient-btn">
          <Plus className="w-4 h-4 ml-2" />
          إضافة متجر جديد
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Store className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{mockStores.length}</p>
              <p className="text-sm text-muted-foreground">إجمالي المتاجر</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {formatAmount(mockStores.reduce((sum, s) => sum + s.balance, 0))}
              </p>
              <p className="text-sm text-muted-foreground">إجمالي الأرصدة</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-info/20 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-info" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {mockStores.reduce((sum, s) => sum + s.ordersCount, 0)}
              </p>
              <p className="text-sm text-muted-foreground">إجمالي الطلبات</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-warning/20 flex items-center justify-center">
              <Store className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">3</p>
              <p className="text-sm text-muted-foreground">متاجر جديدة</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div variants={itemVariants} className="relative max-w-md">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="بحث عن متجر..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pr-10"
        />
      </motion.div>

      {/* Stores Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStores.map((store) => (
          <motion.div
            key={store.id}
            whileHover={{ scale: 1.02 }}
            className="stat-card group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Store className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{store.name}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {store.address}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  رقم الهاتف
                </span>
                <span dir="ltr">{store.phone}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">الرصيد</span>
                <span className="font-semibold text-success">{formatAmount(store.balance)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">الطلبات</span>
                <span>{store.ordersCount} طلب</span>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-border">
              <Button
                size="sm"
                className="flex-1 gradient-btn"
                onClick={() => handleNewOrder(store.id)}
              >
                <ShoppingCart className="w-4 h-4 ml-1" />
                طلب جديد
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleWhatsApp(store.phone, store.name)}
              >
                <MessageCircle className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Add Store Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Store className="w-5 h-5 text-primary" />
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
