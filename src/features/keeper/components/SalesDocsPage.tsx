import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckSquare,
  Search,
  FileText,
  User,
  Store,
  Calendar,
  Camera,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const mockSales = [
  { id: 1, invoice: 'SAL-2024-101', marketer: 'أحمد محمد', store: 'سوبر ماركت الوفاء', total: 1250.00, date: '2024-03-20', status: 'pending' },
  { id: 2, invoice: 'SAL-2024-102', marketer: 'سارة خالد', store: 'محل البركة', total: 450.00, date: '2024-03-20', status: 'pending' },
  { id: 3, invoice: 'SAL-2024-103', marketer: 'محمد علي', store: 'بقالة النور', total: 2100.00, date: '2024-03-19', status: 'documented' },
  { id: 4, invoice: 'SAL-2024-104', marketer: 'فاطمة أحمد', store: 'سوبر ماركت الأمل', total: 1800.00, date: '2024-03-19', status: 'documented' },
];

export const KeeperSalesDocsPage = () => {
  const [filter, setFilter] = useState<'pending' | 'documented'>('pending');

  const filteredSales = mockSales.filter(sale => sale.status === filter);
  const pendingCount = mockSales.filter(s => s.status === 'pending').length;
  const documentedCount = mockSales.filter(s => s.status === 'documented').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">توثيق فواتير البيع</h1>
          <p className="text-muted-foreground text-sm">اعتماد فواتير المبيعات الميدانية وتحديث المخزون المعلق</p>
        </div>

        <div className="flex bg-muted p-1 rounded-lg">
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-md text-sm transition-all ${filter === 'pending' ? 'bg-background shadow-sm' : ''}`}
          >
            في انتظار التوثيق ({pendingCount})
          </button>
          <button
            onClick={() => setFilter('documented')}
            className={`px-4 py-2 rounded-md text-sm transition-all ${filter === 'documented' ? 'bg-background shadow-sm' : ''}`}
          >
            موثق ({documentedCount})
          </button>
        </div>
      </div>

      <Card className="glass-card">
        <div className="p-4 border-b">
          <div className="relative max-w-md">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input className="pr-10" placeholder="بحث برقم الفاتورة أو اسم المتجر..." />
          </div>
        </div>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {filteredSales.map((sale) => (
              <motion.div
                key={sale.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 hover:bg-muted/30 transition-colors flex flex-col md:flex-row items-center gap-6"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${sale.status === 'documented'
                      ? 'bg-green-500/10 text-green-600'
                      : 'bg-yellow-500/10 text-yellow-600'
                    }`}>
                    {sale.status === 'documented' ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      <FileText className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{sale.invoice}</h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><User className="w-3 h-3" /> {sale.marketer}</span>
                      <span className="flex items-center gap-1"><Store className="w-3 h-3" /> {sale.store}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {sale.date}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-right">
                    <p className="text-[10px] text-muted-foreground uppercase">إجمالي الفاتورة</p>
                    <p className="text-xl font-bold text-primary">{sale.total.toLocaleString()} د.ل</p>
                  </div>

                  <Badge
                    variant="outline"
                    className={`h-fit ${sale.status === 'documented'
                        ? 'bg-green-500/10 text-green-600 border-green-500/20'
                        : 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
                      }`}
                  >
                    {sale.status === 'documented' ? 'موثق' : 'بانتظار التوثيق'}
                  </Badge>

                  <div className="flex gap-2">
                    {sale.status === 'pending' && (
                      <Button className="bg-primary hover:bg-primary/90 h-10 px-6">
                        <Camera className="w-4 h-4 ml-2" /> توثيق الفاتورة
                      </Button>
                    )}
                    <Button size="icon" variant="ghost">
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}

            {filteredSales.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                لا توجد فواتير في هذه الحالة حالياً.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
