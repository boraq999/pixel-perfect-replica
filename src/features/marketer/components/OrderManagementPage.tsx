import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  FileText
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
}

const mockOrders: Order[] = [
  {
    id: '1',
    order_number: 'ORD-2024-001',
    order_date: '2024-01-15',
    status: 'approved',
    total_amount: 15000,
    items: [
      { product_id: 'P1', product_name: 'منتج A', quantity: 50, unit_price: 200, total: 10000 },
      { product_id: 'P2', product_name: 'منتج B', quantity: 25, unit_price: 200, total: 5000 },
    ],
    notes: 'طلب عاجل'
  },
  {
    id: '2',
    order_number: 'ORD-2024-002',
    order_date: '2024-01-16',
    status: 'pending',
    total_amount: 8500,
    items: [
      { product_id: 'P3', product_name: 'منتج C', quantity: 30, unit_price: 150, total: 4500 },
      { product_id: 'P4', product_name: 'منتج D', quantity: 20, unit_price: 200, total: 4000 },
    ],
  },
  {
    id: '3',
    order_number: 'ORD-2024-003',
    order_date: '2024-01-17',
    status: 'delivered',
    total_amount: 12000,
    items: [
      { product_id: 'P5', product_name: 'منتج E', quantity: 40, unit_price: 300, total: 12000 },
    ],
  },
];

const getStatusIcon = (status: Order['status']) => {
  switch (status) {
    case 'pending':
      return <Clock className="h-4 w-4" />;
    case 'approved':
      return <CheckCircle className="h-4 w-4" />;
    case 'rejected':
      return <XCircle className="h-4 w-4" />;
    case 'delivered':
      return <Truck className="h-4 w-4" />;
    case 'cancelled':
      return <AlertCircle className="h-4 w-4" />;
  }
};

const getStatusColor = (status: Order['status']) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    case 'approved':
      return 'bg-green-500/10 text-green-500 border-green-500/20';
    case 'rejected':
      return 'bg-red-500/10 text-red-500 border-red-500/20';
    case 'delivered':
      return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    case 'cancelled':
      return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
  }
};

const getStatusText = (status: Order['status']) => {
  switch (status) {
    case 'pending':
      return 'قيد الانتظار';
    case 'approved':
      return 'تمت الموافقة';
    case 'rejected':
      return 'مرفوض';
    case 'delivered':
      return 'تم التسليم';
    case 'cancelled':
      return 'ملغي';
  }
};

export const OrderManagementPage = () => {
  const [orders] = useState<Order[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  const filteredOrders = orders.filter(order =>
    order.order_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addOrderItem = () => {
    setOrderItems([
      ...orderItems,
      {
        product_id: '',
        product_name: '',
        quantity: 0,
        unit_price: 0,
        total: 0,
      }
    ]);
  };

  const removeOrderItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    return orderItems.reduce((sum, item) => sum + item.total, 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Package className="h-8 w-8" />
            إدارة طلبات البضاعة
          </h1>
          <p className="text-muted-foreground mt-2">
            عملية طلب بضاعة من المخزن الرئيسي
          </p>
        </div>
        <Dialog open={isNewOrderOpen} onOpenChange={setIsNewOrderOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              طلب بضاعة جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">طلب بضاعة جديد</DialogTitle>
              <DialogDescription>
                أضف المنتجات والكميات المطلوبة من المخزن الرئيسي
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <Label>ملاحظات الطلب (اختياري)</Label>
                  <Input placeholder="أي ملاحظات خاصة بالطلب..." />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-lg">المنتجات</Label>
                  <Button variant="outline" size="sm" onClick={addOrderItem}>
                    <Plus className="h-4 w-4 ml-2" />
                    إضافة منتج
                  </Button>
                </div>

                {orderItems.map((item, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="grid gap-4 md:grid-cols-5">
                        <div className="md:col-span-2">
                          <Label>المنتج</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر منتج" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="p1">منتج A</SelectItem>
                              <SelectItem value="p2">منتج B</SelectItem>
                              <SelectItem value="p3">منتج C</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>الكمية</Label>
                          <Input type="number" placeholder="0" />
                        </div>
                        <div>
                          <Label>السعر</Label>
                          <Input type="number" placeholder="0.00" disabled />
                        </div>
                        <div className="flex items-end">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeOrderItem(index)}
                            className="w-full"
                          >
                            حذف
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {orderItems.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-3 opacity-20" />
                    <p>لم تتم إضافة أي منتجات بعد</p>
                    <p className="text-sm">انقر على "إضافة منتج" للبدء</p>
                  </div>
                )}
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="flex items-center justify-between text-lg font-bold">
                  <span>الإجمالي:</span>
                  <span className="text-primary">{calculateTotal().toFixed(2)} ر.س</span>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNewOrderOpen(false)}>
                إلغاء
              </Button>
              <Button onClick={() => setIsNewOrderOpen(false)}>
                إرسال الطلب
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Process Flow Info */}
      <Card className="bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 border-blue-500/20">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            خطوات عملية طلب البضاعة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/10 text-blue-500 font-bold text-sm flex-shrink-0">
                1
              </div>
              <div>
                <p className="font-semibold text-sm">إنشاء الطلب</p>
                <p className="text-xs text-muted-foreground">المسوق يقوم بإنشاء طلب بضاعة</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-500/10 text-purple-500 font-bold text-sm flex-shrink-0">
                2
              </div>
              <div>
                <p className="font-semibold text-sm">الموافقة</p>
                <p className="text-xs text-muted-foreground">أمين المخزن يوافق على الطلب</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-pink-500/10 text-pink-500 font-bold text-sm flex-shrink-0">
                3
              </div>
              <div>
                <p className="font-semibold text-sm">التأكيد</p>
                <p className="text-xs text-muted-foreground">المسوق يؤكد استلام البضاعة</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500/10 text-green-500 font-bold text-sm flex-shrink-0">
                4
              </div>
              <div>
                <p className="font-semibold text-sm">إضافة للمخزون</p>
                <p className="text-xs text-muted-foreground">البضاعة تضاف لمخزون المسوق</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="البحث برقم الطلب..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          تصفية
        </Button>
      </div>

      {/* Orders Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">الكل</TabsTrigger>
          <TabsTrigger value="pending">قيد الانتظار</TabsTrigger>
          <TabsTrigger value="approved">موافق عليها</TabsTrigger>
          <TabsTrigger value="delivered">مسلمة</TabsTrigger>
          <TabsTrigger value="rejected">مرفوضة</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-6">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedOrder(order)}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Package className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{order.order_number}</h3>
                      <p className="text-sm text-muted-foreground">{order.order_date}</p>
                    </div>
                  </div>
                  <div className="text-left">
                    <Badge className={`${getStatusColor(order.status)} mb-2`}>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(order.status)}
                        {getStatusText(order.status)}
                      </span>
                    </Badge>
                    <p className="text-lg font-bold">{order.total_amount.toFixed(2)} ر.س</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredOrders.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              لا توجد طلبات حالياً.
            </div>
          )}
        </TabsContent>

        {['pending', 'approved', 'delivered', 'rejected'].map((status) => (
          <TabsContent key={status} value={status} className="space-y-4 mt-6">
            {filteredOrders
              .filter((order) => order.status === status)
              .map((order) => (
                <Card key={order.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedOrder(order)}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <Package className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{order.order_number}</h3>
                          <p className="text-sm text-muted-foreground">{order.order_date}</p>
                        </div>
                      </div>
                      <div className="text-left">
                        <Badge className={`${getStatusColor(order.status)} mb-2`}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(order.status)}
                            {getStatusText(order.status)}
                          </span>
                        </Badge>
                        <p className="text-lg font-bold">{order.total_amount.toFixed(2)} ر.س</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

            {filteredOrders.filter((order) => order.status === status).length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                لا توجد طلبات في هذه الحالة حالياً.
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">تفاصيل الطلب</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>رقم الطلب</Label>
                  <p className="text-sm font-medium mt-1">{selectedOrder.order_number}</p>
                </div>
                <div>
                  <Label>تاريخ الطلب</Label>
                  <p className="text-sm font-medium mt-1">{selectedOrder.order_date}</p>
                </div>
                <div>
                  <Label>الحالة</Label>
                  <Badge className={`${getStatusColor(selectedOrder.status)} mt-1`}>
                    {getStatusText(selectedOrder.status)}
                  </Badge>
                </div>
                <div>
                  <Label>الإجمالي</Label>
                  <p className="text-lg font-bold mt-1">{selectedOrder.total_amount.toFixed(2)} ر.س</p>
                </div>
              </div>

              <div>
                <Label className="text-lg mb-3 block">المنتجات</Label>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-right p-3 text-sm font-medium">المنتج</th>
                        <th className="text-right p-3 text-sm font-medium">الكمية</th>
                        <th className="text-right p-3 text-sm font-medium">سعر الوحدة</th>
                        <th className="text-right p-3 text-sm font-medium">الإجمالي</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items.map((item, idx) => (
                        <tr key={idx} className="border-t">
                          <td className="p-3 text-sm">{item.product_name}</td>
                          <td className="p-3 text-sm">{item.quantity}</td>
                          <td className="p-3 text-sm">{item.unit_price.toFixed(2)} ر.س</td>
                          <td className="p-3 text-sm font-medium">{item.total.toFixed(2)} ر.س</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-muted">
                      <tr>
                        <td colSpan={3} className="p-3 text-sm font-bold text-left">الإجمالي الكلي:</td>
                        <td className="p-3 text-sm font-bold">{selectedOrder.total_amount.toFixed(2)} ر.س</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {selectedOrder.notes && (
                <div>
                  <Label>الملاحظات</Label>
                  <p className="text-sm mt-1 p-3 bg-muted rounded">{selectedOrder.notes}</p>
                </div>
              )}
            </div>
          )}
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setSelectedOrder(null)}>
              إغلاق
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
