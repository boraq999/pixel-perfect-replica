import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Package,
  Plus,
  Search,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Truck,
  FileText,
  TrendingUp,
  Calendar,
  ChevronRight,
  MoreVertical,
  Download,
  Eye,
  ArrowRight,
  ShoppingCart,
  Boxes,
  History,
  Info,
  UserCheck
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { useCurrency } from '@/store/currencyStore';

interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total: number;
}

interface Order {
  id: string;
  order_number: string;
  order_date: string;
  status: 'pending' | 'approved' | 'rejected' | 'delivered' | 'cancelled';
  total_amount: number;
  items: OrderItem[];
  notes?: string;
  approved_by?: string;
  approval_date?: string;
  rejected_by?: string;
  rejection_date?: string;
  verified_by?: string;
  verification_date?: string;
}

const mockOrders: Order[] = [
  {
    id: '1',
    order_number: 'ORD-2024-001',
    order_date: '2024-01-15',
    status: 'approved',
    total_amount: 15600.50,
    items: [
      { product_id: 'P1', product_name: 'عجينة تمر فاخرة - 1 كجم', quantity: 50, unit_price: 212, total: 10600 },
      { product_id: 'P2', product_name: 'تمر خلاص القصيم - 500 جم', quantity: 25, unit_price: 200, total: 5000 },
    ],
    notes: 'تغليف خاص للهدايا',
    approved_by: 'أحمد المحسن',
    approval_date: '2024-01-16 10:30 AM'
  },
  {
    id: '2',
    order_number: 'ORD-2024-002',
    order_date: '2024-01-16',
    status: 'pending',
    total_amount: 8500.00,
    items: [
      { product_id: 'P3', product_name: 'قهوة عربية مختصة - 250 جم', quantity: 30, unit_price: 150, total: 4500 },
      { product_id: 'P4', product_name: 'شوكولاتة بالحليب واللوز', quantity: 20, unit_price: 200, total: 4000 },
    ],
  },
  {
    id: '3',
    order_number: 'ORD-2024-003',
    order_date: '2024-01-17',
    status: 'delivered',
    total_amount: 12000.00,
    items: [
      { product_id: 'P5', product_name: 'عسل سدر طبيعي - 1 كجم', quantity: 40, unit_price: 300, total: 12000 },
    ],
    approved_by: 'محمد علي',
    approval_date: '2024-01-18 02:15 PM',
    verified_by: 'سامي الحربي',
    verification_date: '2024-01-19 11:00 AM'
  },
  {
    id: '4',
    order_number: 'ORD-2024-004',
    order_date: '2024-01-20',
    status: 'rejected',
    total_amount: 3200.00,
    items: [
      { product_id: 'P6', product_name: 'زعفران أصلي - 5 جم', quantity: 10, unit_price: 320, total: 3200 },
    ],
    notes: 'الكمية غير متوفرة في المخزن حالياً',
    rejected_by: 'خالد السعيد',
    rejection_date: '2024-01-21 09:15 AM'
  },
];

const getStatusDetails = (status: Order['status']) => {
  switch (status) {
    case 'pending':
      return { label: 'قيد الانتظار', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20' };
    case 'approved':
      return { label: 'تمت الموافقة', icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' };
    case 'rejected':
      return { label: 'مرفوض', icon: XCircle, color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/20' };
    case 'delivered':
      return { label: 'تم التسليم', icon: Truck, color: 'text-sky-500', bg: 'bg-sky-500/10', border: 'border-sky-500/20' };
    case 'cancelled':
      return { label: 'ملغي', icon: AlertCircle, color: 'text-slate-500', bg: 'bg-slate-500/10', border: 'border-slate-500/20' };
  }
};


export const OrderManagementPage = () => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { formatAmount } = useCurrency();

  // Stats calculation
  const stats = useMemo(() => {
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      totalAmount: orders.reduce((acc, o) => acc + o.total_amount, 0),
    };
  }, [orders]);

  const filteredOrders = orders.filter(order =>
    order.order_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addOrderItem = () => {
    setOrderItems([
      ...orderItems,
      {
        product_id: '',
        product_name: '',
        quantity: 1,
        unit_price: 0,
        total: 0,
      }
    ]);
  };

  const removeOrderItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    return orderItems.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
  };

  const handleCreateOrder = () => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      const newOrder: Order = {
        id: Math.random().toString(36).substr(2, 9),
        order_number: `ORD-${new Date().getFullYear()}-${String(orders.length + 1).padStart(3, '0')}`,
        order_date: new Date().toISOString().split('T')[0],
        status: 'pending',
        total_amount: calculateTotal(),
        items: orderItems,
      };
      setOrders([newOrder, ...orders]);
      setIsNewOrderOpen(false);
      setOrderItems([]);
      setIsSubmitting(false);
      toast.success('تم إنشاء الطلب بنجاح وهو قيد المراجعة الآن');
    }, 1500);
  };

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
                <Package className="h-6 w-6 md:h-8 md:w-8" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight md:text-4xl">إدارة طلبات البضاعة</h1>
                <p className="mt-0.5 text-xs md:mt-1 md:text-base text-primary-foreground/80">تتبع وإدارة مخزونك بكل سهولة</p>
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
              onClick={() => setIsNewOrderOpen(true)}
              size="lg"
              className="h-14 gap-2 rounded-2xl bg-white px-8 font-bold text-primary shadow-xl hover:bg-white/90 font-ar"
            >
              <Plus className="h-5 w-5" />
              إنشاء طلب جديد
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Stats - Horizontal Scroll on Mobile */}
      <div className="hide-scrollbar flex gap-4 overflow-x-auto pb-2 -mx-2 px-2 md:mx-0 md:px-0 md:grid md:grid-cols-4 md:overflow-visible">
        {[
          { title: 'إجمالي الطلبات', value: stats.total, icon: ShoppingCart, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { title: 'بانتظار الموافقة', value: stats.pending, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { title: 'طلبات مكتملة', value: stats.delivered, icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { title: 'إجمالي القيمة', value: formatAmount(stats.totalAmount), icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-500/10' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="min-w-[200px] flex-shrink-0 md:min-w-0"
          >
            <Card className="border-none shadow-sm transition-all hover:shadow-md">
              <CardContent className="flex items-center gap-4 p-4 md:p-6">
                <div className={`rounded-xl md:rounded-2xl ${stat.bg} p-3 md:p-4`}>
                  <stat.icon className={`h-5 w-5 md:h-6 md:w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-[10px] md:text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <h3 className="text-lg md:text-2xl font-bold font-ar">{stat.value}</h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="lg:grid lg:grid-cols-12 lg:gap-8">
        {/* Left Column: Filters and List */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="border-none shadow-md overflow-hidden">
            <CardHeader className="bg-muted/30 p-4 md:pb-0">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between pb-4">
                <div className="flex w-full items-center gap-2">
                  <div className="relative flex-1 sm:max-w-xs">
                    <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="ابحث..."
                      className="pr-10 h-11 border-none bg-background shadow-none rounded-xl text-sm"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button variant="ghost" className="h-11 rounded-xl px-4 gap-2 text-muted-foreground hover:bg-background text-sm">
                    <Filter className="h-4 w-4" />
                    تصفية
                  </Button>
                </div>
              </div>
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="h-12 w-full justify-start gap-2 bg-transparent p-0 border-b rounded-none overflow-x-auto hide-scrollbar flex-nowrap">
                  {[
                    { id: 'all', label: 'الكل' },
                    { id: 'pending', label: 'قيد المراجعة' },
                    { id: 'approved', label: 'المقبولة' },
                    { id: 'delivered', label: 'المستلمة' },
                    { id: 'rejected', label: 'المرفوضة' },
                    { id: 'cancelled', label: 'الملغية' },
                  ].map(tab => (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className="rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 text-sm font-semibold transition-all data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary flex-shrink-0"
                    >
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {['all', 'pending', 'approved', 'delivered', 'rejected', 'cancelled'].map((tabValue) => (
                  <TabsContent key={tabValue} value={tabValue} className="mt-6 space-y-4">
                    <AnimatePresence mode="popLayout">
                      {filteredOrders
                        .filter(order => tabValue === 'all' || order.status === tabValue)
                        .map((order, idx) => {
                          const status = getStatusDetails(order.status);

                          return (
                            <motion.div
                              key={order.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              transition={{ duration: 0.3, delay: idx * 0.05 }}
                              onClick={() => setSelectedOrder(order)}
                              className="group cursor-pointer rounded-2xl border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-lg active:scale-[0.98] md:p-5"
                            >
                              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                <div className="flex items-center gap-4 md:gap-5">
                                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl md:h-12 md:w-12 md:rounded-2xl ${status.bg} transition-colors group-hover:scale-110`}>
                                    <status.icon className={`h-5 w-5 md:h-6 md:w-6 ${status.color}`} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <h4 className="font-bold text-base md:text-lg truncate">{order.order_number}</h4>
                                    </div>
                                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                                      <span className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {order.order_date}
                                      </span>
                                      <span className="hidden h-1 w-1 rounded-full bg-muted-foreground/30 sm:block" />
                                      <span className="flex items-center gap-1">
                                        <Boxes className="h-3 w-3" />
                                        {order.items.length} منتجات
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between border-t pt-3 md:border-none md:pt-0 md:gap-6">
                                  <div className="text-right">
                                    <p className="text-[10px] font-medium text-muted-foreground">الإجمالي</p>
                                    <p className="text-base font-extrabold text-primary md:text-lg font-ar">{formatAmount(order.total_amount)}</p>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <div className={`flex h-7 items-center gap-1 rounded-full px-3 ${status.bg} ${status.color} text-[10px] font-bold border ${status.border} md:h-8 md:px-4 md:text-xs`}>
                                      <status.icon className="h-3 w-3" />
                                      {status.label}
                                    </div>
                                    <div className="rounded-full p-1.5 transition-colors group-hover:bg-accent md:p-2">
                                      <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 md:h-5 md:w-5" />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                    </AnimatePresence>

                    {filteredOrders.filter(order => tabValue === 'all' || order.status === tabValue).length === 0 && (
                      <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="rounded-full bg-muted p-6 mb-4">
                          <Package className="h-12 w-12 text-muted-foreground/30" />
                        </div>
                        <h3 className="text-lg font-bold">لا توجد نتائج</h3>
                        <p className="text-muted-foreground">لم نتمكن من العثور على أي طلبات في هذا القسم</p>
                      </div>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            </CardHeader>
          </Card>
        </div>

        {/* Mobile: Process & Help Sections (Stacked) */}
        <div className="mt-8 space-y-6 lg:hidden">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-none shadow-md">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <History className="h-4 w-4 text-primary" />
                  دورة حياة الطلب
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="flex flex-col gap-4">
                  {[
                    { title: 'إنشاء', icon: Plus, color: 'blue' },
                    { title: 'مراجعة', icon: Search, color: 'amber' },
                    { title: 'اعتماد', icon: Truck, color: 'indigo' },
                    { title: 'مخزون', icon: Boxes, color: 'emerald' },
                  ].map((step, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-${step.color}-500/10 text-${step.color}-600`}>
                        <step.icon className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-xs font-bold">{step.title}</span>
                      {i < 3 && <ChevronRight className="h-3 w-3 text-muted-foreground/30" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md bg-gradient-to-br from-indigo-500/10 to-purple-500/10">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="flex items-center gap-2 text-base text-indigo-700">
                  <Info className="h-4 w-4" />
                  المساعدة
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-xs text-indigo-600/80 mb-3 font-medium">
                  هل واجهت مشكلة؟ تواصل مع إدارة العمليات مباشرة.
                </p>
                <Button variant="outline" size="sm" className="w-full rounded-xl border-indigo-200 bg-white/50 text-indigo-700 text-xs">
                  تواصل مع الدعم
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column: Process & Help (Desktop Only) */}
        <div className="hidden lg:block lg:col-span-4 space-y-6">
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <History className="h-5 w-5 text-primary" />
                تتبع الخطوات
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-0">
              {[
                { title: 'إنشاء الطلب', desc: 'تحديد المنتجات والكميات المطلوبة بدقة', icon: Plus, color: 'blue' },
                { title: 'مراجعة المخزن', desc: 'يتم التأكد من توفر الكميات من قبل أمين المخزن', icon: Search, color: 'amber' },
                { title: 'الموافقة والشحن', desc: 'اعتماد الطلب وبدء عملية النقل إلى مستودعك', icon: Truck, color: 'indigo' },
                { title: 'إضافة للمخزون', desc: 'عند التأكيد تضاف الكميات تلقائياً لمخزونك', icon: Boxes, color: 'emerald' },
              ].map((step, i) => (
                <div key={i} className="relative flex gap-4">
                  {i < 3 && (
                    <div className="absolute top-10 right-4 h-full w-[2px] bg-muted" />
                  )}
                  <div className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-${step.color}-500/10 text-${step.color}-600`}>
                    <step.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm leading-none mb-1">{step.title}</h5>
                    <p className="text-xs text-muted-foreground">{step.desc}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-indigo-700">
                <Info className="h-5 w-5" />
                هل تحتاج مساعدة؟
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              <p className="text-sm text-indigo-600/80 leading-relaxed font-medium">
                إذا كان لديك أي استفسار بخصوص طلباتك أو واجهت مشكلة في التوريد، يمكنك التواصل مباشرة مع إدارة العمليات.
              </p>
              <Button variant="outline" className="w-full rounded-xl border-indigo-200 bg-white/50 text-indigo-700 hover:bg-white hover:text-indigo-800">
                تواصل مع الدعم
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Mobile Floating Action Button (FAB) */}
      <motion.div
        className="fixed bottom-6 right-6 z-50 md:hidden"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.5 }}
      >
        <Button
          onClick={() => setIsNewOrderOpen(true)}
          size="icon"
          className="h-16 w-16 rounded-full bg-primary text-white shadow-2xl shadow-primary/40 flex items-center justify-center active:scale-90 transition-transform"
        >
          <Truck className="h-10 w-10" />
        </Button>
      </motion.div>

      {/* New Order Dialog */}
      <Dialog open={isNewOrderOpen} onOpenChange={setIsNewOrderOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Plus className="w-5 h-5 text-primary" />
              طلب بضاعة جديد
            </DialogTitle>
            <DialogDescription>
              اختر المنتجات والكميات التي ترغب في إضافتها إلى عهدتك من المخزن الرئيسي
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 pt-4">

            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <Package className="h-4 w-4 text-primary" />
                  المنتجات المطلوبة
                </h3>
                <Button variant="outline" size="sm" onClick={addOrderItem} className="h-8 text-xs">
                  إضافة منتج
                </Button>
              </div>

              <div className="space-y-3">
                {orderItems.map((item, index) => (
                  <div key={index} className="flex items-end gap-3 rounded-lg border bg-muted/20 p-3">
                    <div className="flex-1 space-y-1.5">
                      <Label className="text-[10px] text-muted-foreground">المنتج</Label>
                      <Select onValueChange={(val) => {
                        const updatedItems = [...orderItems];
                        updatedItems[index].product_id = val;
                        updatedItems[index].product_name = val === 'p1' ? 'عجينة تمر فاخرة' : 'تمر خلاص القصيم';
                        updatedItems[index].unit_price = val === 'p1' ? 212 : 200;
                        setOrderItems(updatedItems);
                      }}>
                        <SelectTrigger className="h-9 text-xs">
                          <SelectValue placeholder="اختر منتج" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="p1">عجينة تمر فاخرة - 1 كجم</SelectItem>
                          <SelectItem value="p2">تمر خلاص القصيم - 500 جم</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-20 space-y-1.5">
                      <Label className="text-[10px] text-muted-foreground">الكمية</Label>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => {
                          const updatedItems = [...orderItems];
                          updatedItems[index].quantity = parseInt(e.target.value) || 1;
                          setOrderItems(updatedItems);
                        }}
                        className="h-9 text-xs"
                      />
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeOrderItem(index)} className="h-9 w-9 text-destructive">
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {orderItems.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 rounded-lg border border-dashed text-muted-foreground text-xs">
                  لا توجد أصناف مضافة حالياً.
                </div>
              )}
            </div>

            <div className="pt-4 border-t flex flex-col items-center justify-between gap-4 md:flex-row">
              <div>
                <p className="text-xs text-muted-foreground">الإجمالي الكلي</p>
                <p className="text-xl font-bold text-primary">{formatAmount(calculateTotal())}</p>
              </div>
              <div className="flex w-full gap-2 md:w-auto">
                <Button variant="outline" className="flex-1 px-8" onClick={() => setIsNewOrderOpen(false)}>
                  إلغاء
                </Button>
                <Button
                  disabled={orderItems.length === 0 || isSubmitting}
                  onClick={handleCreateOrder}
                  className="flex-1 px-8"
                >
                  {isSubmitting ? 'جاري الإرسال...' : 'تأكيد الطلب'}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Order Details Standard Modal */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedOrder && (
            <div className="space-y-6">
              <DialogHeader>
                <DialogTitle className="flex items-center text-xl">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    تفاصيل الطلب: {selectedOrder.order_number}
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-muted/30 rounded-2xl text-sm border border-muted-foreground/10">
                <div className="col-span-full border-b border-muted pb-3 mb-1 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1.5 font-medium">
                      <Calendar className="h-4 w-4 text-primary/60" />
                      تاريخ تقديم الطلب
                    </p>
                    <p className="font-bold text-base">{selectedOrder.order_date}</p>
                  </div>
                  <Badge className={`${getStatusDetails(selectedOrder.status).bg} ${getStatusDetails(selectedOrder.status).color} border-none px-4 py-1.5 text-xs font-bold`}>
                    {getStatusDetails(selectedOrder.status).label}
                  </Badge>
                </div>

                {(selectedOrder.status === 'approved' || selectedOrder.status === 'delivered') && (
                  <>
                    {selectedOrder.approved_by && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-emerald-500/10">
                            <UserCheck className="h-4 w-4 text-emerald-600" />
                          </div>
                          <div>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">تمت الموافقة بواسطة</p>
                            <p className="font-bold text-emerald-700 text-sm">{selectedOrder.approved_by}</p>
                          </div>
                        </div>
                        {selectedOrder.approval_date && (
                          <div className="flex items-center gap-2 pr-2 border-r-2 border-emerald-100 mr-2">
                            <Clock className="h-3 w-3 text-emerald-400" />
                            <p className="text-[11px] text-muted-foreground font-medium">{selectedOrder.approval_date}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {selectedOrder.status === 'delivered' && selectedOrder.verified_by && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-sky-500/10">
                            <CheckCircle className="h-4 w-4 text-sky-600" />
                          </div>
                          <div>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">تم التوثيق بواسطة</p>
                            <p className="font-bold text-sky-700 text-sm">{selectedOrder.verified_by}</p>
                          </div>
                        </div>
                        {selectedOrder.verification_date && (
                          <div className="flex items-center gap-2 pr-2 border-r-2 border-sky-100 mr-2">
                            <Calendar className="h-3 w-3 text-sky-400" />
                            <p className="text-[11px] text-muted-foreground font-medium">{selectedOrder.verification_date}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}

                {selectedOrder.status === 'rejected' && (
                  <div className="col-span-full space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-rose-500/5 border border-rose-500/10">
                      <div className="p-2 rounded-lg bg-rose-500/10">
                        <UserCheck className="h-5 w-5 text-rose-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground font-bold italic mb-0.5">تم الرفض بواسطة</p>
                        <p className="font-black text-rose-700">{selectedOrder.rejected_by}</p>
                        {selectedOrder.rejection_date && (
                          <p className="text-[11px] text-rose-600/70 mt-1 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {selectedOrder.rejection_date}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <Package className="w-4 h-4 text-primary" />
                  الأصناف المطلوبة
                </h3>

                {/* Mobile View: Card List */}
                <div className="space-y-3 md:hidden">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="rounded-xl border bg-muted/20 p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-sm">{item.product_name}</span>
                        <Badge variant="secondary">الكمية: {item.quantity}</Badge>
                      </div>
                      <div className="flex justify-between items-center text-xs pt-2 border-t border-muted">
                        <div>
                          <p className="text-muted-foreground">سعر الوحدة</p>
                          <p className="font-medium">{formatAmount(item.unit_price)}</p>
                        </div>
                        <div className="text-left">
                          <p className="text-muted-foreground">الإجمالي</p>
                          <p className="font-bold text-primary">{formatAmount(item.total)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="rounded-xl bg-primary/5 p-4 flex justify-between items-center border border-primary/10">
                    <span className="font-bold">الإجمالي الكلي</span>
                    <span className="text-lg font-black text-primary">{formatAmount(selectedOrder.total_amount)}</span>
                  </div>
                </div>

                {/* Desktop View: Table */}
                <div className="hidden md:block rounded-lg border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-right p-3 font-medium">المنتج</th>
                        <th className="text-center p-3 font-medium">الكمية</th>
                        <th className="text-left p-3 font-medium">السعر</th>
                        <th className="text-left p-3 font-medium">الإجمالي</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {selectedOrder.items.map((item, i) => (
                        <tr key={i} className="hover:bg-muted/30 transition-colors">
                          <td className="p-3 font-medium">{item.product_name}</td>
                          <td className="p-3 text-center">
                            <Badge variant="secondary">{item.quantity}</Badge>
                          </td>
                          <td className="p-3 text-left text-muted-foreground">{formatAmount(item.unit_price)}</td>
                          <td className="p-3 text-left font-bold text-primary">{formatAmount(item.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-muted/30">
                      <tr>
                        <td colSpan={3} className="p-3 text-left font-bold">الإجمالي الكلي</td>
                        <td className="p-3 text-left font-bold text-primary text-lg">{formatAmount(selectedOrder.total_amount)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              <div className="pt-4 border-t flex flex-row gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setSelectedOrder(null)}>
                  إغلاق
                </Button>
                {(selectedOrder.status === 'pending' || selectedOrder.status === 'approved') && (
                  <Button
                    variant="destructive"
                    className="flex-1 gap-2"
                    onClick={() => {
                      toast.error('تم إلغاء الطلب بنجاح');
                      setSelectedOrder(null);
                    }}
                  >
                    <XCircle className="h-4 w-4" />
                    إلغاء الفاتورة
                  </Button>
                )}
                <Button variant="secondary" className="flex-1 gap-2" onClick={() => toast.info('جاري تحميل نسخة PDF')}>
                  <Download className="h-4 w-4" />
                  رؤية الفاتورة
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderManagementPage;

