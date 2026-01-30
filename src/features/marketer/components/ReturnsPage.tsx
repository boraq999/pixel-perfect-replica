import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  RotateCcw, 
  Search, 
  Store,
  Package,
  Plus,
  Minus,
  Trash2,
  Check,
  Loader2,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

// Mock data
const mockStores = [
  { id: '1', name: 'متجر الرياض' },
  { id: '2', name: 'سوبرماركت النور' },
  { id: '3', name: 'مركز السلام' },
];

const mockOrderProducts = [
  { id: '1', name: 'حليب كامل الدسم', orderedQty: 20, price: 8 },
  { id: '2', name: 'زبادي طبيعي', orderedQty: 15, price: 5 },
  { id: '3', name: 'عصير برتقال', orderedQty: 30, price: 12 },
];

interface ReturnItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  reason: string;
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

const returnReasons = [
  'منتج تالف',
  'منتج منتهي الصلاحية',
  'طلب خاطئ',
  'زيادة في الكمية',
  'سبب آخر'
];

export const ReturnsPage = () => {
  const navigate = useNavigate();
  const [storeId, setStoreId] = useState('');
  const [items, setItems] = useState<ReturnItem[]>([]);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addProduct = (productId: string) => {
    const product = mockOrderProducts.find(p => p.id === productId);
    if (!product) return;

    const existingIndex = items.findIndex(item => item.productId === productId);
    
    if (existingIndex >= 0) {
      toast.error('المنتج مضاف مسبقاً');
      return;
    }

    setItems([...items, {
      productId: product.id,
      productName: product.name,
      quantity: 1,
      price: product.price,
      reason: returnReasons[0]
    }]);
  };

  const updateQuantity = (index: number, change: number) => {
    const newItems = [...items];
    const product = mockOrderProducts.find(p => p.id === newItems[index].productId);
    const maxQty = product?.orderedQty || 1;
    newItems[index].quantity = Math.min(maxQty, Math.max(1, newItems[index].quantity + change));
    setItems(newItems);
  };

  const updateReason = (index: number, reason: string) => {
    const newItems = [...items];
    newItems[index].reason = reason;
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const total = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);

  const handleSubmit = async () => {
    if (!storeId) {
      toast.error('يرجى اختيار المتجر');
      return;
    }
    if (items.length === 0) {
      toast.error('يرجى إضافة منتج واحد على الأقل');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success('تم تسجيل المرتجع بنجاح!');
    setIsSubmitting(false);
    navigate('/dashboard/stores');
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowRight className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">تسجيل مرتجع</h1>
          <p className="text-muted-foreground">تسجيل المنتجات المرتجعة من المتجر</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Return Form */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
          {/* Store Selection */}
          <div className="stat-card">
            <Label className="text-base font-semibold mb-3 block">اختر المتجر</Label>
            <Select value={storeId} onValueChange={setStoreId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="اختر المتجر" />
              </SelectTrigger>
              <SelectContent>
                {mockStores.map(store => (
                  <SelectItem key={store.id} value={store.id}>
                    <div className="flex items-center gap-2">
                      <Store className="w-4 h-4" />
                      {store.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Products */}
          <div className="stat-card">
            <Label className="text-base font-semibold mb-3 block">المنتجات المتاحة للإرجاع</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {mockOrderProducts.map(product => (
                <motion.button
                  key={product.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => addProduct(product.id)}
                  className="p-3 rounded-lg bg-accent/30 hover:bg-accent/50 transition-colors text-right"
                >
                  <div className="flex items-start justify-between">
                    <Package className="w-4 h-4 text-muted-foreground" />
                    <div className="text-right">
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-muted-foreground">الكمية: {product.orderedQty}</p>
                      <p className="text-sm font-semibold text-warning mt-1">{product.price} ر.س</p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Return Items */}
          {items.length > 0 && (
            <div className="stat-card">
              <Label className="text-base font-semibold mb-3 block">المنتجات المرتجعة</Label>
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg bg-accent/30 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-warning/20 flex items-center justify-center">
                          <RotateCcw className="w-5 h-5 text-warning" />
                        </div>
                        <div>
                          <p className="font-medium">{item.productName}</p>
                          <p className="text-sm text-muted-foreground">{item.price} ر.س للوحدة</p>
                        </div>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                        onClick={() => removeItem(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4">
                      {/* Quantity */}
                      <div className="flex items-center gap-2">
                        <Label className="text-sm">الكمية:</Label>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(index, -1)}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(index, 1)}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>

                      {/* Reason */}
                      <div className="flex-1 min-w-[200px]">
                        <Select value={item.reason} onValueChange={(value) => updateReason(index, value)}>
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {returnReasons.map(reason => (
                              <SelectItem key={reason} value={reason}>
                                {reason}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Item Total */}
                      <div className="text-left">
                        <p className="font-semibold text-warning">{(item.quantity * item.price).toFixed(2)} ر.س</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Summary */}
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="stat-card sticky top-24">
            <h3 className="text-lg font-semibold mb-4">ملخص المرتجع</h3>

            {/* Warning */}
            <div className="flex items-start gap-2 p-3 rounded-lg bg-warning/10 border border-warning/20 mb-4">
              <AlertCircle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
              <p className="text-sm text-warning">
                سيتم خصم قيمة المرتجع من رصيد المتجر
              </p>
            </div>

            {/* Notes */}
            <div className="space-y-2 mb-6">
              <Label>ملاحظات</Label>
              <Textarea
                placeholder="أضف ملاحظات للمرتجع..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>

            {/* Summary */}
            <div className="space-y-2 pt-4 border-t border-border">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">عدد المنتجات</span>
                <span>{items.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">إجمالي الكمية</span>
                <span>{items.reduce((sum, item) => sum + item.quantity, 0)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2">
                <span>إجمالي المرتجع</span>
                <span className="text-warning">{total.toFixed(2)} ر.س</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 mt-6">
              <Button 
                onClick={handleSubmit} 
                disabled={isSubmitting || items.length === 0}
                className="w-full bg-warning text-warning-foreground hover:bg-warning/90"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin ml-2" />
                    جاري التسجيل...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 ml-2" />
                    تسجيل المرتجع
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate(-1)}
                disabled={isSubmitting}
              >
                إلغاء
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
