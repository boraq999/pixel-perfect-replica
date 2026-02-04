// صفحة: إرجاعات (المسوق الأفضل)
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  RotateCcw,
  Package,
  Plus,
  Minus,
  Trash2,
  Check,
  Loader2,
  ArrowRight,
  AlertCircle,
  ShoppingBag,
  TrendingDown,
  FileText,
  Search
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
import { useCurrency } from '@/store/currencyStore';
import { StatCard, SearchBar } from './shared';

// Mock data - فواتير وهمية
const mockInvoices: Record<string, { invoiceNumber: string; storeName: string; products: Array<{ id: string; name: string; orderedQty: number; price: number }> }> = {
  'INV-001': {
    invoiceNumber: 'INV-001',
    storeName: 'متجر الرياض',
    products: [
      { id: '1', name: 'حليب كامل الدسم', orderedQty: 20, price: 8 },
      { id: '2', name: 'زبادي طبيعي', orderedQty: 15, price: 5 },
      { id: '3', name: 'عصير برتقال', orderedQty: 30, price: 12 },
    ]
  },
  'INV-002': {
    invoiceNumber: 'INV-002',
    storeName: 'سوبرماركت النور',
    products: [
      { id: '4', name: 'عجينة تمر فاخرة', orderedQty: 10, price: 212 },
      { id: '5', name: 'قهوة عربية', orderedQty: 25, price: 150 },
    ]
  },
};

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
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoiceData, setInvoiceData] = useState<typeof mockInvoices[string] | null>(null);
  const [items, setItems] = useState<ReturnItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const { formatAmount } = useCurrency();

  // Stats calculation
  const stats = useMemo(() => ({
    totalProducts: items.length,
    totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
    totalAmount: items.reduce((sum, item) => sum + (item.quantity * item.price), 0),
  }), [items]);

  const statsData = useMemo(() => [
    { title: 'عدد المنتجات', value: stats.totalProducts, icon: Package, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
    { title: 'إجمالي الكمية', value: stats.totalQuantity, icon: ShoppingBag, color: 'text-amber-500', bgColor: 'bg-amber-500/10' },
    { title: 'قيمة المرتجع', value: formatAmount(stats.totalAmount), icon: TrendingDown, color: 'text-rose-500', bgColor: 'bg-rose-500/10' },
  ], [stats, formatAmount]);

  const searchInvoice = async () => {
    if (!invoiceNumber.trim()) {
      toast.error('يرجى إدخال رقم الفاتورة');
      return;
    }

    setIsSearching(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const invoice = mockInvoices[invoiceNumber.toUpperCase()];
    if (invoice) {
      setInvoiceData(invoice);
      setItems([]);
      toast.success('تم العثور على الفاتورة');
    } else {
      setInvoiceData(null);
      toast.error('لم يتم العثور على الفاتورة');
    }
    setIsSearching(false);
  };

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!invoiceData) return [];
    if (!searchQuery.trim()) return invoiceData.products;
    return invoiceData.products.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [invoiceData, searchQuery]);

  const addProduct = (productId: string) => {
    if (!invoiceData) return;
    const product = invoiceData.products.find(p => p.id === productId);
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

  const updateQuantity = (index: number, value: number) => {
    if (!invoiceData) return;
    const newItems = [...items];
    const product = invoiceData.products.find(p => p.id === newItems[index].productId);
    const maxQty = product?.orderedQty || 1;
    const validValue = Math.min(maxQty, Math.max(1, value));
    newItems[index].quantity = validValue;
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

  const handleSubmit = async () => {
    if (!invoiceData) {
      toast.error('يرجى البحث عن الفاتورة أولاً');
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
      <motion.div variants={itemVariants} className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/95 to-primary p-6 text-white shadow-2xl md:p-8">
        <div className="absolute top-0 right-0 h-full w-1/2 bg-[url('/pattern.svg')] opacity-10 mix-blend-overlay" />
        <div className="relative z-10 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="text-white hover:bg-white/20">
            <ArrowRight className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-white/20 p-2 backdrop-blur-md md:p-3">
              <RotateCcw className="h-6 w-6 md:h-8 md:w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight md:text-4xl">تسجيل مرتجع</h1>
              <p className="mt-0.5 text-xs md:mt-1 md:text-base text-primary-foreground/80">تسجيل المنتجات المرتجعة من المتجر</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      {items.length > 0 && (
        <motion.div variants={itemVariants} className="hide-scrollbar flex gap-4 overflow-x-auto pb-2 -mx-2 px-2">
          {statsData.map((stat, i) => (
            <div key={i} className="min-w-[200px] flex-shrink-0">
              <StatCard {...stat} delay={i * 0.1} />
            </div>
          ))}
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Return Form */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
          {/* Invoice Search */}
          <div className="stat-card">
            <Label className="text-base font-semibold mb-3 block flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              رقم الفاتورة
            </Label>
            <div className="flex gap-2">
              <Input
                placeholder="أدخل رقم الفاتورة (مثال: INV-001)"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchInvoice()}
                className="flex-1"
              />
              <Button onClick={searchInvoice} disabled={isSearching}>
                {isSearching ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
              </Button>
            </div>
            {invoiceData && (
              <div className="mt-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <p className="text-sm font-medium text-emerald-700">
                  المتجر: {invoiceData.storeName}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  عدد المنتجات: {invoiceData.products.length}
                </p>
              </div>
            )}
          </div>

          {/* Products */}
          {invoiceData && (
            <div className="stat-card">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-3">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  المنتجات المتاحة للإرجاع
                </Label>
                <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="بحث عن منتج..."
                  className="w-full sm:max-w-xs"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredProducts.map(product => (
                  <motion.button
                    key={product.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => addProduct(product.id)}
                    className="group relative p-4 rounded-xl bg-gradient-to-br from-accent/40 to-accent/20 hover:from-primary/10 hover:to-primary/5 border border-border hover:border-primary/30 transition-all text-right overflow-hidden"
                  >
                    <div className="absolute top-2 left-2 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Package className="w-4 h-4 text-primary" />
                    </div>
                    <div className="space-y-2 pr-2">
                      <p className="font-bold text-sm leading-tight">{product.name}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>متوفر: {product.orderedQty}</span>
                        </div>
                        <div className="px-2 py-1 rounded-md bg-primary/10 border border-primary/20">
                          <p className="text-sm font-bold text-primary">{formatAmount(product.price)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.button>
                ))}
              </div>
            </div>
          )}

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
                          <p className="text-sm text-muted-foreground">{formatAmount(item.price)} للوحدة</p>
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
                          onClick={() => updateQuantity(index, item.quantity - 1)}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <Input
                          type="number"
                          min="1"
                          max={invoiceData?.products.find(p => p.id === item.productId)?.orderedQty || 1}
                          value={item.quantity}
                          onChange={(e) => updateQuantity(index, parseInt(e.target.value) || 1)}
                          className="w-16 h-8 text-center font-medium"
                        />
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(index, item.quantity + 1)}
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
                        <p className="font-semibold text-warning">{formatAmount(item.quantity * item.price)}</p>
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
                <span>{stats.totalProducts}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">إجمالي الكمية</span>
                <span>{stats.totalQuantity}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2">
                <span>إجمالي المرتجع</span>
                <span className="text-warning">{formatAmount(stats.totalAmount)}</span>
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
