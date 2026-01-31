import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  Check, 
  Loader2,
  ArrowRight,
  Package,
  Store as StoreIcon,
  Tag,
  Percent,
  CircleDollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { useMarketerStore } from '@/store/marketerStore';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';
import { DiscountType, SalesInvoiceItem } from '@/types/marketer';

export const NewOrderPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { 
    stock, 
    stores, 
    promotions, 
    createSalesInvoice, 
    isLoading,
    fetchInitialData 
  } = useMarketerStore();
  
  const [selectedStoreId, setSelectedStoreId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<{ product_id: string; quantity: number }[]>([]);
  const [discountType, setDiscountType] = useState<DiscountType>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const addToCart = (productId: string) => {
    const stockItem = stock.find(s => s.product_id === productId);
    if (!stockItem || stockItem.quantity <= 0) {
      toast.error('هذا المنتج غير متوفر في مخزونك');
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.product_id === productId);
      if (existing) {
        if (existing.quantity >= stockItem.quantity) {
          toast.error('لا يمكنك تجاوز الكمية المتوفرة في مخزونك');
          return prev;
        }
        return prev.map(item => 
          item.product_id === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product_id: productId, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    const stockItem = stock.find(s => s.product_id === productId);
    setCart(prev => prev.map(item => {
      if (item.product_id === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        if (stockItem && newQty > stockItem.quantity) {
          toast.error('الكمية المطلوبة تتجاوز المخزون');
          return item;
        }
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const calculatePromotions = (productId: string, quantity: number) => {
    const promo = promotions.find(p => p.product_id === productId && p.is_active);
    if (promo && quantity >= promo.min_quantity) {
      const sets = Math.floor(quantity / promo.min_quantity);
      return { free: sets * promo.free_quantity, promoId: promo.id };
    }
    return { free: 0, promoId: undefined };
  };

  const cartItems = cart.map(item => {
    const stockItem = stock.find(s => s.product_id === item.product_id);
    const product = stockItem?.product;
    const { free, promoId } = calculatePromotions(item.product_id, item.quantity);
    const unitPrice = product?.current_price || 0;
    const totalPrice = item.quantity * unitPrice;

    return {
      ...item,
      product,
      free_quantity: free,
      unit_price: unitPrice,
      total_price: totalPrice,
      promotion_id: promoId
    };
  });

  const subtotal = cartItems.reduce((acc, item) => acc + item.total_price, 0);
  const invoiceDiscountAmount = discountType === 'percentage' 
    ? (subtotal * (discountValue / 100)) 
    : discountValue;
  const totalAmount = subtotal - invoiceDiscountAmount;

  const handleSubmit = async () => {
    if (!selectedStoreId) {
      toast.error('الرجاء اختيار المتجر أولاً');
      return;
    }
    if (cart.length === 0) {
      toast.error('الرجاء إضافة منتجات للفاتورة');
      return;
    }

    setSubmitting(true);
    try {
      const invoiceData = {
        marketer_id: user?.id,
        store_id: selectedStoreId,
        subtotal,
        product_discount: 0, // Simplified
        invoice_discount_type: discountType,
        invoice_discount_value: discountValue,
        invoice_discount_amount: invoiceDiscountAmount,
        total_amount: totalAmount,
        items: cartItems.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          free_quantity: item.free_quantity,
          unit_price: item.unit_price,
          total_price: item.total_price,
          promotion_id: item.promotion_id
        }))
      };

      await createSalesInvoice(invoiceData);
      toast.success('تم إنشاء فاتورة البيع بنجاح');
      navigate('/dashboard/operations');
    } catch (error) {
      toast.error('فشل إنشاء الفاتورة');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredStock = stock.filter(s => 
    s.product?.name.includes(searchQuery) || s.product?.barcode.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowRight className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-right">إنشاء فاتورة مبيعات</h1>
          <p className="text-muted-foreground text-right">بيع بضاعة لمتجر وتسجيلها في النظام</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Store Selection */}
          <div className="glass-card p-6">
            <label className="flex items-center gap-2 mb-4 font-bold">
              <StoreIcon className="w-5 h-5 text-primary" />
              اختيار المتجر
            </label>
            <Select value={selectedStoreId} onValueChange={setSelectedStoreId}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="اختر المتجر الذي تبيع له..." />
              </SelectTrigger>
              <SelectContent>
                {stores.map(store => (
                  <SelectItem key={store.id} value={store.id}>
                    {store.name} - {store.location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Product Search & Selection */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="بحث في مخزونك الخاص..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10 h-12"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredStock.map(item => (
                <motion.div 
                  layout
                  key={item.id} 
                  className={`glass-card p-4 flex gap-4 items-center group transition-colors ${item.quantity <= 0 ? 'opacity-50 grayscale' : 'hover:border-primary/50 cursor-pointer'}`}
                  onClick={() => item.quantity > 0 && addToCart(item.product_id)}
                >
                  <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Package className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0 text-right">
                    <h3 className="font-bold truncate">{item.product?.name}</h3>
                    <p className="text-xs text-muted-foreground">متوفر: {item.quantity} قطعة</p>
                    <p className="text-sm font-bold text-primary mt-1">{item.product?.current_price} د.ل</p>
                  </div>
                  <Button 
                    size="icon" 
                    className="rounded-full gradient-btn"
                    disabled={item.quantity <= 0}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Invoice Summary */}
        <div className="lg:col-span-1">
          <div className="glass-card p-6 sticky top-6 flex flex-col h-fit">
            <div className="flex items-center gap-2 mb-6 border-b pb-4">
              <ShoppingCart className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-lg">مخلص الفاتورة</h2>
            </div>

            <div className="space-y-4 mb-6 max-h-[300px] overflow-auto pr-2 custom-scrollbar">
              {cartItems.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">الفاتورة فارغة</p>
                </div>
              ) : (
                cartItems.map(item => (
                  <div key={item.product_id} className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <button className="text-muted-foreground hover:text-destructive" onClick={() => removeFromCart(item.product_id)}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="flex items-center gap-2 bg-accent/30 rounded-lg p-1">
                        <button className="w-6 h-6 flex items-center justify-center rounded bg-background" onClick={() => updateQuantity(item.product_id, -1)}><Minus className="w-3 h-3" /></button>
                        <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                        <button className="w-6 h-6 flex items-center justify-center rounded bg-background" onClick={() => updateQuantity(item.product_id, 1)}><Plus className="w-3 h-3" /></button>
                      </div>
                      <div className="flex-1 text-right min-w-0">
                        <p className="text-sm font-medium truncate">{item.product?.name}</p>
                        <p className="text-xs text-muted-foreground">{item.total_price} د.ل</p>
                      </div>
                    </div>
                    {item.free_quantity > 0 && (
                      <p className="text-[10px] text-green-600 font-bold text-right bg-green-50 rounded px-2 py-0.5">
                        🎁 عرض: +{item.free_quantity} قطعة مجانية
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Discount Section */}
            <div className="border-t pt-4 space-y-4 mb-6">
              <div className="flex items-center justify-between gap-2">
                <div className="flex bg-accent/30 rounded-lg p-1">
                  <button 
                    className={`px-3 py-1 text-xs rounded-md transition-colors ${discountType === 'percentage' ? 'bg-primary text-white' : 'hover:bg-accent'}`}
                    onClick={() => setDiscountType('percentage')}
                  >
                    %
                  </button>
                  <button 
                    className={`px-3 py-1 text-xs rounded-md transition-colors ${discountType === 'fixed' ? 'bg-primary text-white' : 'hover:bg-accent'}`}
                    onClick={() => setDiscountType('fixed')}
                  >
                    د.ل
                  </button>
                </div>
                <label className="text-sm font-medium flex items-center gap-1">
                   خصم الفاتورة <Tag className="w-3 h-3" />
                </label>
              </div>
              <Input 
                type="number" 
                value={discountValue} 
                onChange={(e) => setDiscountValue(Number(e.target.value))}
                className="text-right"
                placeholder="0.00"
              />
            </div>

            {/* Totals */}
            <div className="space-y-2 mb-8 bg-accent/20 p-4 rounded-xl">
              <div className="flex justify-between text-sm">
                <span>{subtotal.toFixed(2)} د.ل</span>
                <span className="text-muted-foreground">المجموع الفرعي</span>
              </div>
              <div className="flex justify-between text-sm text-red-500">
                <span>-{invoiceDiscountAmount.toFixed(2)} د.ل</span>
                <span>خصم الفاتورة</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                <span className="text-primary">{totalAmount.toFixed(2)} د.ل</span>
                <span>الإجمالي</span>
              </div>
            </div>

            <Button 
              className="w-full py-7 text-lg font-bold gradient-btn shadow-lg animate-glow"
              disabled={submitting || cart.length === 0 || !selectedStoreId}
              onClick={handleSubmit}
            >
              {submitting ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <div className="flex items-center gap-2">
                   إتمام عملية البيع
                   <CircleDollarSign className="w-6 h-6" />
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
