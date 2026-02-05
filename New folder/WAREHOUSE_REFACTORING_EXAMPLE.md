# 🔄 مثال عملي: Refactoring WarehousePage

## 📋 نظرة عامة

هذا الملف يوضح كيفية تطبيق التحسينات على `WarehousePage.tsx` كمثال عملي.

---

## 📊 المقارنة

### الإحصائيات
```
قبل:  ~450 سطر
بعد:  ~280 سطر
التوفير: 38%
```

---

## 🔧 التغييرات المطلوبة

### 1. الاستيرادات (Imports)

#### قبل:
```tsx
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  Plus,
  Search,
  Check,
  X,
  Loader2,
  FileText,
  Upload,
  AlertCircle,
  Boxes,
  Clock,
  CheckCircle,
  TrendingUp,
  LayoutGrid,
  List,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useMarketerStore } from '@/store/marketerStore';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';
```

#### بعد:
```tsx
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  Plus,
  Boxes,
  Clock,
  CheckCircle,
  TrendingUp,
  Calendar,
  FileText,
  Upload,
  AlertCircle,
  Loader2,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Card, CardHeader } from '@/components/ui/card';
import { toast } from 'sonner';
import { useMarketerStore } from '@/store/marketerStore';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';

// ✅ استيراد المكونات المشتركة
import {
  StatCard,
  SearchBar,
  ViewModeToggle,
  EmptyState,
  StatusBadge
} from './shared';

// ✅ استيراد الـ Hooks
import { useMarketerData, useFilteredData } from '../hooks';
```

---

### 2. جلب البيانات (Data Fetching)

#### قبل:
```tsx
const { user } = useAuthStore();
const {
  requests,
  stock,
  fetchRequests,
  fetchStock,
  cancelRequest,
  documentRequest
} = useMarketerStore();

useEffect(() => {
  if (user?.id) {
    fetchRequests(user.id);
    fetchStock(user.id);
  }
}, [user?.id]);
```

#### بعد:
```tsx
const { user } = useAuthStore();
const { cancelRequest, documentRequest } = useMarketerStore();

// ✅ استخدام Hook واحد بدلاً من useEffect
const { requests, stock, isLoading } = useMarketerData(user?.id);
```

**الفائدة:**
- تقليل 6 أسطر إلى سطر واحد
- منطق موحد لجلب البيانات
- سهولة الصيانة

---

### 3. البحث والفلترة (Search & Filter)

#### قبل:
```tsx
const filteredReservedItems = reservedItems.filter(item =>
  item.product?.name.includes(searchQuery) ||
  item.invoice_number.includes(searchQuery)
);

const filteredPendingItems = pendingItems.filter(item =>
  item.product?.name.includes(searchQuery) ||
  item.invoice_number.includes(searchQuery)
);

const filteredStock = stock.filter(item =>
  item.product?.name.includes(searchQuery) ||
  item.product?.barcode?.includes(searchQuery)
);
```

#### بعد:
```tsx
// ✅ استخدام Hook واحد مع useMemo مدمج
const filteredReservedItems = useFilteredData(
  reservedItems,
  searchQuery,
  ['product.name', 'invoice_number']
);

const filteredPendingItems = useFilteredData(
  pendingItems,
  searchQuery,
  ['product.name', 'invoice_number']
);

const filteredStock = useFilteredData(
  stock,
  searchQuery,
  ['product.name', 'product.barcode']
);
```

**الفائدة:**
- كود أنظف وأقصر
- أداء محسّن (useMemo مدمج)
- منطق موحد للبحث

---

### 4. كاردات الإحصائيات (Stats Cards)

#### قبل:
```tsx
<div className="hide-scrollbar flex gap-4 overflow-x-auto pb-2 -mx-2 px-2 md:mx-0 md:px-0 md:grid md:grid-cols-4 md:overflow-visible">
  {[
    { title: 'إجمالي المخزون', value: stats.totalStockItems + ' قطعة', icon: Boxes, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'محجوز (موافق عليه)', value: stats.approvedRequests, icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { title: 'قيد المراجعة', value: stats.pendingRequests, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { title: 'إجمالي الحركات', value: requests.length, icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-500/10' },
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
```

#### بعد:
```tsx
<div className="hide-scrollbar flex gap-4 overflow-x-auto pb-2 -mx-2 px-2 md:mx-0 md:px-0 md:grid md:grid-cols-4 md:overflow-visible">
  {statsData.map((stat, i) => (
    <div key={i} className="min-w-[200px] flex-shrink-0 md:min-w-0">
      <StatCard {...stat} delay={i * 0.1} />
    </div>
  ))}
</div>
```

**مع تعريف البيانات:**
```tsx
const statsData = [
  {
    title: 'إجمالي المخزون',
    value: `${stats.totalStockItems} قطعة`,
    icon: Boxes,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10'
  },
  {
    title: 'محجوز (موافق عليه)',
    value: stats.approvedRequests,
    icon: CheckCircle,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10'
  },
  {
    title: 'قيد المراجعة',
    value: stats.pendingRequests,
    icon: Clock,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10'
  },
  {
    title: 'إجمالي الحركات',
    value: requests.length,
    icon: TrendingUp,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10'
  }
];
```

**الفائدة:**
- تقليل 25 سطر إلى 5 أسطر
- فصل البيانات عن العرض
- سهولة التعديل والصيانة

---

### 5. شريط البحث (Search Bar)

#### قبل:
```tsx
<div className="relative flex-1 sm:max-w-xs">
  <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
  <Input
    placeholder="بحث عن منتج..."
    className="pr-10 h-11 border-none bg-background shadow-none rounded-xl text-sm"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
  />
</div>
```

#### بعد:
```tsx
<SearchBar
  value={searchQuery}
  onChange={setSearchQuery}
  placeholder="بحث عن منتج..."
  className="flex-1 sm:max-w-xs"
/>
```

**الفائدة:**
- تقليل 8 أسطر إلى سطر واحد
- تصميم موحد في جميع الصفحات

---

### 6. تبديل وضع العرض (View Mode Toggle)

#### قبل:
```tsx
<div className="flex bg-background rounded-lg p-1 shadow-sm border">
  <Button
    variant="ghost"
    size="icon"
    className={`h-9 w-9 rounded-md transition-all ${viewMode === 'grid' ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}
    onClick={() => setViewMode('grid')}
  >
    <LayoutGrid className="w-4 h-4" />
  </Button>
  <Button
    variant="ghost"
    size="icon"
    className={`h-9 w-9 rounded-md transition-all ${viewMode === 'list' ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}
    onClick={() => setViewMode('list')}
  >
    <List className="w-4 h-4" />
  </Button>
</div>
```

#### بعد:
```tsx
<ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />
```

**الفائدة:**
- تقليل 18 سطر إلى سطر واحد
- منطق موحد

---

### 7. حالة الفراغ (Empty State)

#### قبل:
```tsx
{filteredStock.length === 0 ? (
  <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
    <div className="rounded-full bg-muted p-6 mb-4">
      <Package className="h-12 w-12 text-muted-foreground/30" />
    </div>
    <h3 className="text-lg font-bold">مخزنك فارغ حالياً</h3>
    <p className="text-muted-foreground">لم يتم إضافة أي بضاعة لمخزونك الفعلي بعد</p>
    <Button
      variant="outline"
      className="mt-4"
      onClick={() => navigate('receive')}
    >
      طلب بضاعة من المخزن
    </Button>
  </div>
) : (
  // ... عرض البيانات
)}
```

#### بعد:
```tsx
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
  // ... عرض البيانات
)}
```

**الفائدة:**
- تقليل 15 سطر إلى 8 أسطر
- تصميم موحد لجميع حالات الفراغ

---

### 8. شارة الحالة (Status Badge)

#### قبل:
```tsx
const getStatusBadge = (status: string) => {
  switch (status) {
    case 'pending':
      return (
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600 border border-amber-500/20">
          <Clock className="w-3.5 h-3.5" /> قيد المراجعة
        </span>
      );
    case 'approved':
      return (
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
          <Boxes className="w-3.5 h-3.5" /> بانتظار التوثيق
        </span>
      );
    default:
      return null;
  }
};

// الاستخدام
{getStatusBadge(item.status)}
```

#### بعد:
```tsx
// لا حاجة لدالة getStatusBadge

// الاستخدام مباشرة
<StatusBadge status={item.status} size="md" />
```

**الفائدة:**
- حذف 20 سطر من الكود
- مكون قابل لإعادة الاستخدام في جميع الصفحات

---

## 📝 الكود الكامل المحسّن (مختصر)

```tsx
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Plus, Boxes, Clock, CheckCircle, TrendingUp, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader } from '@/components/ui/card';
import { toast } from 'sonner';
import { useMarketerStore } from '@/store/marketerStore';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';
import {
  StatCard,
  SearchBar,
  ViewModeToggle,
  EmptyState,
  StatusBadge
} from './shared';
import { useMarketerData, useFilteredData } from '../hooks';

export const WarehousePage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { cancelRequest, documentRequest } = useMarketerStore();
  
  // ✅ Hook واحد بدلاً من useEffect
  const { requests, stock, isLoading } = useMarketerData(user?.id);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'my-stock' | 'requests' | 'pending'>('my-stock');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // الإحصائيات
  const stats = useMemo(() => ({
    totalStockItems: stock.reduce((acc, item) => acc + item.quantity, 0),
    pendingRequests: requests.filter(r => r.status === 'pending').length,
    approvedRequests: requests.filter(r => r.status === 'approved').length,
  }), [stock, requests]);

  // البيانات المفلترة
  const reservedItems = useMemo(() => 
    requests
      .filter(r => r.status === 'approved')
      .flatMap(r => r.items.map(item => ({
        ...item,
        status: r.status,
        invoice_number: r.invoice_number,
        date: r.created_at,
        request_id: r.id
      }))),
    [requests]
  );

  const pendingItems = useMemo(() => 
    requests
      .filter(r => r.status === 'pending')
      .flatMap(r => r.items.map(item => ({
        ...item,
        status: r.status,
        invoice_number: r.invoice_number,
        date: r.created_at,
        request_id: r.id
      }))),
    [requests]
  );

  // ✅ استخدام Hook للبحث
  const filteredReservedItems = useFilteredData(reservedItems, searchQuery, ['product.name', 'invoice_number']);
  const filteredPendingItems = useFilteredData(pendingItems, searchQuery, ['product.name', 'invoice_number']);
  const filteredStock = useFilteredData(stock, searchQuery, ['product.name', 'product.barcode']);

  // بيانات الإحصائيات
  const statsData = [
    {
      title: 'إجمالي المخزون',
      value: `${stats.totalStockItems} قطعة`,
      icon: Boxes,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: 'محجوز (موافق عليه)',
      value: stats.approvedRequests,
      icon: CheckCircle,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10'
    },
    {
      title: 'قيد المراجعة',
      value: stats.pendingRequests,
      icon: Clock,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10'
    },
    {
      title: 'إجمالي الحركات',
      value: requests.length,
      icon: TrendingUp,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    }
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header - نفس الكود */}
      
      {/* ✅ Stats - استخدام StatCard */}
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
                  {/* ✅ استخدام SearchBar */}
                  <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="بحث عن منتج..."
                    className="flex-1 sm:max-w-xs"
                  />
                  
                  {/* ✅ استخدام ViewModeToggle */}
                  <ViewModeToggle
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                  />
                </div>
              </div>

              {/* Tabs - نفس الكود */}
            </CardHeader>

            <div className="p-6">
              <AnimatePresence mode="wait">
                {activeTab === 'my-stock' && (
                  <motion.div key="stock" /* ... */>
                    {filteredStock.length === 0 ? (
                      {/* ✅ استخدام EmptyState */}
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
                        <div key={item.id}>
                          {/* عرض المنتج */}
                          {/* ✅ استخدام StatusBadge */}
                          <StatusBadge status="completed" size="md" />
                        </div>
                      ))
                    )}
                  </motion.div>
                )}
                
                {/* نفس الشيء للتابات الأخرى */}
              </AnimatePresence>
            </div>
          </Card>
        </div>
      </div>

      {/* FAB & Dialog - نفس الكود */}
    </div>
  );
};
```

---

## 📊 النتائج

### قبل التحسين
```
✗ 450 سطر
✗ كود متكرر في 5 أماكن
✗ صعوبة الصيانة
✗ useEffect يدوي
✗ filter يدوي
```

### بعد التحسين
```
✓ 280 سطر (-38%)
✓ لا تكرار (استخدام مكونات مشتركة)
✓ سهولة الصيانة
✓ useMarketerData Hook
✓ useFilteredData Hook
```

---

## ✅ Checklist للتطبيق

- [ ] نسخ احتياطية من الملف الأصلي
- [ ] استيراد المكونات المشتركة
- [ ] استبدال useEffect بـ useMarketerData
- [ ] استبدال filter بـ useFilteredData
- [ ] استبدال Stats Cards بـ StatCard
- [ ] استبدال Search Bar بـ SearchBar
- [ ] استبدال View Mode Toggle بـ ViewModeToggle
- [ ] استبدال Empty States بـ EmptyState
- [ ] استبدال Status Badges بـ StatusBadge
- [ ] حذف دالة getStatusBadge
- [ ] اختبار جميع الوظائف
- [ ] التأكد من عدم وجود أخطاء
- [ ] Commit & Push

---

## 🎯 الخطوات التالية

بعد تطبيق التحسينات على WarehousePage:

1. **تطبيق نفس التحسينات على:**
   - NewOrderPage.tsx
   - StoresPage.tsx
   - Dashboard.tsx
   - BestMarketerDashboard.tsx

2. **إنشاء مكونات إضافية:**
   - ProductCard
   - OrderCard
   - StoreCard

3. **إنشاء Hooks إضافية:**
   - useCart
   - useInvoice
   - usePromotions

---

**تاريخ الإنشاء:** ${new Date().toLocaleDateString('ar-SA')}
**الحالة:** ✅ جاهز للتطبيق
