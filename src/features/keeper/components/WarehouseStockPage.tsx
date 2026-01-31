import { useState } from 'react';
import { 
  Package, 
  History, 
  Search, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Filter,
  Download
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data based on main_stock & warehouse_stock_logs
const mockStock = [
  { id: 1, name: 'زيت زيتون 1 لتر', barcode: '622123', quantity: 1500, last_update: '2024-03-20' },
  { id: 2, name: 'معجون طماطم 400 جرام', barcode: '622987', quantity: 5000, last_update: '2024-03-19' },
  { id: 3, name: 'تونا قطعة واحدة', barcode: '622444', quantity: 2400, last_update: '2024-03-20' },
];

const mockLogs = [
  { id: 1, type: 'factory', action: 'add', product: 'زيت زيتون 1 لتر', qty: 500, date: '2024-03-20 10:00', keeper: 'محمد علي' },
  { id: 2, type: 'marketer_request', action: 'withdraw', product: 'تونا قطعة واحدة', qty: 100, date: '2024-03-20 09:30', keeper: 'محمد علي' },
  { id: 3, type: 'sales_return', action: 'return', product: 'معجون طماطم', qty: 20, date: '2024-03-19 14:20', keeper: 'محمد علي' },
];

export const WarehouseStockPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">مخزون المستودع الرئيسي</h1>
          <p className="text-muted-foreground text-sm">متابعة الكميات وحركة المخزن (Main Stock)</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 ml-2" /> تصدير تقرير
          </Button>
        </div>
      </div>

      <Tabs defaultValue="inventory" className="w-full">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="inventory" className="gap-2">
            <Package className="w-4 h-4" /> المخزون الحالي
          </TabsTrigger>
          <TabsTrigger value="logs" className="gap-2">
            <History className="w-4 h-4" /> سجل الحركات
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="mt-6">
          <Card className="glass-card">
            <CardHeader className="pb-4">
              <div className="relative max-w-md">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input className="pr-10" placeholder="بحث بالأصناف..." />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">الصنف</TableHead>
                    <TableHead className="text-right">الباركود</TableHead>
                    <TableHead className="text-right">الكمية المتوفرة</TableHead>
                    <TableHead className="text-right">آخر تحديث</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockStock.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-bold">{item.name}</TableCell>
                      <TableCell className="text-muted-foreground">{item.barcode}</TableCell>
                      <TableCell>
                        <span className={`text-lg font-bold ${item.quantity < 500 ? 'text-destructive' : 'text-primary'}`}>
                          {item.quantity.toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm">{item.last_update}</TableCell>
                      <TableCell>
                        {item.quantity < 500 ? (
                          <Badge variant="destructive">مخزون منخفض</Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-green-100 text-green-700">متوفر</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="mt-6">
          <Card className="glass-card">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">النوع</TableHead>
                    <TableHead className="text-right">الحركة</TableHead>
                    <TableHead className="text-right">الصنف</TableHead>
                    <TableHead className="text-right">الكمية</TableHead>
                    <TableHead className="text-right">التاريخ</TableHead>
                    <TableHead className="text-right">بواسطة</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <Badge variant="outline">
                          {log.type === 'factory' ? 'فاتورة مصنع' : log.type === 'marketer_request' ? 'طلب مسوق' : 'إرجاع مبيعات'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {log.action === 'add' ? (
                          <div className="flex items-center text-green-600 gap-1 font-medium">
                            <ArrowUpRight className="w-4 h-4" /> إضافة
                          </div>
                        ) : log.action === 'withdraw' ? (
                          <div className="flex items-center text-amber-600 gap-1 font-medium">
                            <ArrowDownLeft className="w-4 h-4" /> سحب
                          </div>
                        ) : (
                          <div className="flex items-center text-blue-600 gap-1 font-medium">
                            <History className="w-4 h-4" /> إرجاع
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{log.product}</TableCell>
                      <TableCell className="font-bold">{log.qty}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{log.date}</TableCell>
                      <TableCell className="text-xs">{log.keeper}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
