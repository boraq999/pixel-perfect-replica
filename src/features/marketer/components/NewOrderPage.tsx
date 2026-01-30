import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, 
  Plus, 
  Minus,
  Trash2,
  Store,
  CreditCard,
  Banknote,
  Clock,
  Check,
  Loader2,
  ArrowRight
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
import { useNavigate, useSearchParams } from 'react-router-dom';

// Mock data
const mockStores = [
  { id: '1', name: 'متجر الرياض' },
  { id: '2', name: 'سوبرماركت النور' },
  { id: '3', name: 'مركز السلام' },
  { id: '4', name: 'متجر الخير' },
];

const mockProducts = [
  { id: '1', name: 'حليب كامل الدسم', price: 8, category: 'ألبان' },
  { id: '2', name: 'زبادي طبيعي', price: 5, category: 'ألبان' },
  { id: '3', name: 'عصير برتقال', price: 12, category: 'مشروبات' },
  { id: '4', name: 'ماء معدني', price: 2, category: 'مشروبات' },
  { id: '5', name: 'خبز أبيض', price: 4, category: 'مخبوزات' },
  { id: '6', name: 'جبنة بيضاء', price: 15, category: 'ألبان' },
  { id: '7', name: 'بيض بلدي', price: 25, category: 'طعام' },
  { id: '8', name: 'زيت زيتون', price: 45, category: 'زيوت' },
];

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  discount: number;
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

export const NewOrderPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedStoreId = searchParams.get('storeId') || '';

  const [storeId, setStoreId] = useState(preselectedStoreId);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'credit' | 'deferred'>('cash');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addProduct = (productId: string) => {
    const product = mockProducts.find(p => p.id === productId);
    if (!product) return;

    const existingIndex = items.findIndex(item => item.productId === productId);
    
    if (existingIndex >= 0) {
      const newItems = [...items];
      newItems[existingIndex].quantity += 1;
      setItems(newItems);
    } else {
      setItems([...items, {
        productId: product.id,
        productName: product.name,
        quantity: 1,
        price: product.price,
        discount: 0
      }]);
    }
  };

  const updateQuantity = (index: number, change: number) => {
    const newItems = [...items];
    newItems[index].quantity = Math.max(1, newItems[index].quantity + change);
    setItems(newItems);
  };

  const updateDiscount = (index: number, discount: number) => {
    const newItems = [...items];
    newItems[index].discount = Math.min(100, Math.max(0, discount));
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const calculateItemTotal = (item: OrderItem) => {
    const subtotal = item.quantity * item.price;
    return subtotal * (1 - item.discount / 100);
  };

  const total = items.reduce((sum, item) => sum + calculateItemTotal(item), 0);

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
    
    toast.success('تم إنشاء الطلب بنجاح!');
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
          <h1 className="text-2xl font-bold">طلب مبيعات جديد</h1>
          <p className="text-muted-foreground">إنشاء طلب جديد للمتجر</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products Selection */}
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
            <Label className="text-base font-semibold mb-3 block">المنتجات</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {mockProducts.map(product => (
                <motion.button
                  key={product.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => addProduct(product.id)}
                  className="p-3 rounded-lg bg-accent/30 hover:bg-accent/50 transition-colors text-right"
                >
                  <p className="font-medium text-sm">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.category}</p>
                  <p className="text-sm font-semibold text-primary mt-1">{product.price} ر.س</p>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Order Items */}
          {items.length > 0 && (
            <div className="stat-card">
              <Label className="text-base font-semibold mb-3 block">عناصر الطلب</Label>
              <div className="space-y-3">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-3 rounded-lg bg-accent/30"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm text-muted-foreground">{item.price} ر.س للوحدة</p>
                    </div>
                    
                    {/* Quantity */}
                    <div className="flex items-center gap-2">
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

                    {/* Discount */}
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={item.discount}
                        onChange={(e) => updateDiscount(index, parseInt(e.target.value) || 0)}
                        className="w-16 h-8 text-center"
                      />
                      <span className="text-sm text-muted-foreground">%</span>
                    </div>

                    {/* Item Total */}
                    <div className="w-24 text-left">
                      <p className="font-semibold">{calculateItemTotal(item).toFixed(2)} ر.س</p>
                    </div>

                    {/* Remove */}
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => removeItem(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Order Summary */}
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="stat-card sticky top-24">
            <h3 className="text-lg font-semibold mb-4">ملخص الطلب</h3>
            
            {/* Payment Method */}
            <div className="space-y-3 mb-6">
              <Label>طريقة الدفع</Label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-3 rounded-lg border text-center transition-all ${
                    paymentMethod === 'cash' 
                      ? 'border-primary bg-primary/10 text-primary' 
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <Banknote className="w-5 h-5 mx-auto mb-1" />
                  <span className="text-xs">نقداً</span>
                </button>
                <button
                  onClick={() => setPaymentMethod('credit')}
                  className={`p-3 rounded-lg border text-center transition-all ${
                    paymentMethod === 'credit' 
                      ? 'border-primary bg-primary/10 text-primary' 
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <CreditCard className="w-5 h-5 mx-auto mb-1" />
                  <span className="text-xs">بطاقة</span>
                </button>
                <button
                  onClick={() => setPaymentMethod('deferred')}
                  className={`p-3 rounded-lg border text-center transition-all ${
                    paymentMethod === 'deferred' 
                      ? 'border-primary bg-primary/10 text-primary' 
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <Clock className="w-5 h-5 mx-auto mb-1" />
                  <span className="text-xs">آجل</span>
                </button>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2 mb-6">
              <Label>ملاحظات</Label>
              <Textarea
                placeholder="أضف ملاحظات للطلب..."
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
                <span>الإجمالي</span>
                <span className="text-primary">{total.toFixed(2)} ر.س</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 mt-6">
              <Button 
                onClick={handleSubmit} 
                disabled={isSubmitting || items.length === 0}
                className="w-full gradient-btn"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin ml-2" />
                    جاري الإنشاء...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 ml-2" />
                    إنشاء الطلب
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
