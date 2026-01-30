import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  RotateCcw, 
  Plus, 
  Search, 
  Calendar,
  ArrowDownToLine,
  ArrowUpFromLine,
  Check,
  X,
  Loader2
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

// Mock data
const mockProducts = [
  { id: '1', name: 'حليب كامل الدسم', category: 'ألبان', stock: 150 },
  { id: '2', name: 'زبادي طبيعي', category: 'ألبان', stock: 80 },
  { id: '3', name: 'عصير برتقال', category: 'مشروبات', stock: 200 },
  { id: '4', name: 'ماء معدني', category: 'مشروبات', stock: 500 },
  { id: '5', name: 'خبز أبيض', category: 'مخبوزات', stock: 45 },
];

const mockTransactions = [
  { id: '1', type: 'receive', product: 'حليب كامل الدسم', quantity: 50, date: '2026-01-30', status: 'completed' },
  { id: '2', type: 'return', product: 'زبادي طبيعي', quantity: 10, date: '2026-01-30', status: 'pending' },
  { id: '3', type: 'receive', product: 'عصير برتقال', quantity: 100, date: '2026-01-29', status: 'completed' },
  { id: '4', type: 'return', product: 'خبز أبيض', quantity: 5, date: '2026-01-29', status: 'completed' },
];

type TransactionType = 'receive' | 'return';

interface TransactionFormData {
  productId: string;
  quantity: number;
  notes: string;
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

export const WarehousePage = () => {
  const [activeTab, setActiveTab] = useState<'transactions' | 'products'>('transactions');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<TransactionType>('receive');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<TransactionFormData>({
    productId: '',
    quantity: 1,
    notes: ''
  });

  const openReceiveDialog = () => {
    setTransactionType('receive');
    setFormData({ productId: '', quantity: 1, notes: '' });
    setIsDialogOpen(true);
  };

  const openReturnDialog = () => {
    setTransactionType('return');
    setFormData({ productId: '', quantity: 1, notes: '' });
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.productId) {
      toast.error('يرجى اختيار المنتج');
      return;
    }
    if (formData.quantity < 1) {
      toast.error('الكمية يجب أن تكون أكبر من صفر');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const product = mockProducts.find(p => p.id === formData.productId);
    
    if (transactionType === 'receive') {
      toast.success(`تم استلام ${formData.quantity} وحدة من ${product?.name}`);
    } else {
      toast.success(`تم إرجاع ${formData.quantity} وحدة من ${product?.name}`);
    }
    
    setIsSubmitting(false);
    setIsDialogOpen(false);
  };

  const filteredProducts = mockProducts.filter(product =>
    product.name.includes(searchQuery) || product.category.includes(searchQuery)
  );

  const filteredTransactions = mockTransactions.filter(tx =>
    tx.product.includes(searchQuery)
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
          <h1 className="text-2xl font-bold">إدارة المخزن</h1>
          <p className="text-muted-foreground">استلام وإرجاع البضائع</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={openReceiveDialog} className="gradient-btn">
            <ArrowDownToLine className="w-4 h-4 ml-2" />
            استلام بضاعة
          </Button>
          <Button onClick={openReturnDialog} variant="outline">
            <ArrowUpFromLine className="w-4 h-4 ml-2" />
            إرجاع بضاعة
          </Button>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={itemVariants} className="flex gap-2 p-1 bg-accent/30 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('transactions')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === 'transactions' 
              ? 'bg-primary text-primary-foreground' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          سجل الحركات
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === 'products' 
              ? 'bg-primary text-primary-foreground' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          المنتجات
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
        {activeTab === 'transactions' ? (
          <motion.div
            key="transactions"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="stat-card"
          >
            <h3 className="text-lg font-semibold mb-4">سجل الحركات</h3>
            <div className="space-y-3">
              {filteredTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-accent/30 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      tx.type === 'receive' 
                        ? 'bg-success/20 text-success' 
                        : 'bg-warning/20 text-warning'
                    }`}>
                      {tx.type === 'receive' ? (
                        <ArrowDownToLine className="w-5 h-5" />
                      ) : (
                        <ArrowUpFromLine className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{tx.product}</p>
                      <p className="text-sm text-muted-foreground">
                        {tx.type === 'receive' ? 'استلام' : 'إرجاع'} • {tx.date}
                      </p>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold">{tx.quantity} وحدة</p>
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                      tx.status === 'completed' 
                        ? 'bg-success/20 text-success' 
                        : 'bg-warning/20 text-warning'
                    }`}>
                      {tx.status === 'completed' ? 'مكتمل' : 'قيد الانتظار'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="products"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="stat-card"
          >
            <h3 className="text-lg font-semibold mb-4">المنتجات المتوفرة</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="p-4 rounded-lg bg-accent/30 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.category}</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Package className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">المخزون</span>
                    <span className={`font-bold ${
                      product.stock < 50 ? 'text-destructive' : 
                      product.stock < 100 ? 'text-warning' : 'text-success'
                    }`}>
                      {product.stock} وحدة
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transaction Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {transactionType === 'receive' ? (
                <>
                  <ArrowDownToLine className="w-5 h-5 text-success" />
                  استلام بضاعة من المخزن
                </>
              ) : (
                <>
                  <ArrowUpFromLine className="w-5 h-5 text-warning" />
                  إرجاع بضاعة للمخزن
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>المنتج</Label>
              <Select 
                value={formData.productId} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, productId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر المنتج" />
                </SelectTrigger>
                <SelectContent>
                  {mockProducts.map(product => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} ({product.stock} وحدة)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>الكمية</Label>
              <Input
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
              />
            </div>

            <div className="space-y-2">
              <Label>ملاحظات (اختياري)</Label>
              <Textarea
                placeholder="أضف ملاحظات..."
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
              إلغاء
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting} className="gradient-btn">
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin ml-2" />
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 ml-2" />
                  تأكيد
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};
