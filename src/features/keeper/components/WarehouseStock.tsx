import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  Search, 
  Plus, 
  ArrowDownToLine, 
  History,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Boxes
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

// Mock data for main stock
const mockStock = [
  { id: 'p1', name: 'عطر الفارس 100مل', barcode: '6250001', quantity: 450, min_limit: 50 },
  { id: 'p2', name: 'بخور ملكي', barcode: '6250002', quantity: 120, min_limit: 30 },
  { id: 'p3', name: 'زيت العود الأصلي', barcode: '6250003', quantity: 15, min_limit: 20 },
  { id: 'p4', name: 'معطر غرف لافندر', barcode: '6250004', quantity: 800, min_limit: 100 },
];

export const WarehouseStockPage = () => {
  const [stock, setStock] = useState(mockStock);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStock = stock.filter(item => 
    item.name.includes(searchQuery) || item.barcode.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">مخزون المستودع الرئيسي</h1>
          <p className="text-muted-foreground">مراقبة وإدارة الكميات المتوفرة في المخزن</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <History className="w-4 h-4 ml-2" />
            سجل الحركات
          </Button>
          <Button className="gradient-btn">
            <Plus className="w-4 h-4 ml-2" />
            إضافة مخزون (فاتورة مصنع)
          </Button>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-6 border-r-4 border-r-blue-500">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">إجمالي الأصناف</p>
            <Boxes className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold mt-2">{stock.length}</p>
        </div>
        
        <div className="glass-card p-6 border-r-4 border-r-green-500">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">إجمالي القطع</p>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold mt-2">
            {stock.reduce((acc, curr) => acc + curr.quantity, 0)}
          </p>
        </div>

        <div className="glass-card p-6 border-r-4 border-r-red-500">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">أصناف منخفضة</p>
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-3xl font-bold mt-2">
            {stock.filter(item => item.quantity < item.min_limit).length}
          </p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder="بحث بالاسم أو الباركود..." 
          className="pr-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-accent/50 border-b border-border text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-bold">المنتج</th>
                <th className="px-6 py-4 font-bold">الباركود</th>
                <th className="px-6 py-4 font-bold">الكمية الحالية</th>
                <th className="px-6 py-4 font-bold">الحالة</th>
                <th className="px-6 py-4 font-bold">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredStock.map((item) => (
                <tr key={item.id} className="hover:bg-accent/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Package className="w-5 h-5 text-primary" />
                      </div>
                      <span className="font-bold">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{item.barcode}</td>
                  <td className="px-6 py-4">
                    <span className={`text-lg font-bold ${item.quantity < item.min_limit ? 'text-destructive' : ''}`}>
                      {item.quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {item.quantity < item.min_limit ? (
                      <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">منخفض</Badge>
                    ) : (
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">جيد</Badge>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <Button variant="ghost" size="sm" className="hover:text-primary">
                      <ArrowUpRight className="w-4 h-4 ml-1" />
                      تفاصيل
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
