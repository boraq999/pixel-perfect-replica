// صفحة: إدارة الطلبات (المسوق الأفضل) - مع تكامل API
import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Package, Plus, Filter, Clock, CheckCircle, XCircle, AlertCircle, Truck,
  FileText, Calendar, ChevronRight, Download, ShoppingCart, Boxes, History, Info, UserCheck, ChevronLeft, ChevronRight as ChevronRightIcon, DollarSign, Printer
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useCurrency } from '@/store/currencyStore';
import { StatCard, SearchBar, PageHeader } from './shared';
import { useFilteredData } from '../hooks';
import { marketerRequestsAPI } from '@/api/marketerRequests';
import { productsAPI, type Product } from '@/api/products';
import type { MarketerRequest, MarketerRequestDetails } from '@/types/marketer';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface NewOrderItem {
  product_id: number;
  quantity: number;
}

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  const dateStr = date.toLocaleDateString('en-GB');
  const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  return `${dateStr} ${timeStr}`;
};

const getStatusDetails = (status: MarketerRequest['status']) => {
  switch (status) {
    case 'pending':
      return { label: 'قيد الانتظار', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20' };
    case 'approved':
      return { label: 'تمت الموافقة', icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' };
    case 'rejected':
      return { label: 'مرفوض', icon: XCircle, color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/20' };
    case 'documented':
      return { label: 'موثق', icon: Truck, color: 'text-sky-500', bg: 'bg-sky-500/10', border: 'border-sky-500/20' };
    case 'cancelled':
      return { label: 'ملغي', icon: AlertCircle, color: 'text-slate-500', bg: 'bg-slate-500/10', border: 'border-slate-500/20' };
  }
};

export const OrderManagementPage = () => {
  const [orders, setOrders] = useState<MarketerRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<MarketerRequestDetails | null>(null);
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);
  const [orderItems, setOrderItems] = useState<NewOrderItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalPending, setTotalPending] = useState(0);
  const [totalApproved, setTotalApproved] = useState(0);
  const [totalDocumented, setTotalDocumented] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const { formatAmount } = useCurrency();

  useEffect(() => {
    fetchOrders();
    fetchStats();
    fetchProducts();
  }, []);

  useEffect(() => {
    const filters = activeTab === 'all' ? undefined : { status: activeTab };
    fetchOrders(filters, 1);
  }, [activeTab]);

  const fetchProducts = async () => {
    try {
      setIsLoadingProducts(true);
      const response = await productsAPI.getProducts();
      setProducts(response.data?.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const fetchStats = async () => {
    try {
      const [allRes, pendingRes, approvedRes, documentedRes] = await Promise.all([
        marketerRequestsAPI.getRequests({} as any),
        marketerRequestsAPI.getRequests({ status: 'pending' } as any),
        marketerRequestsAPI.getRequests({ status: 'approved' } as any),
        marketerRequestsAPI.getRequests({ status: 'documented' } as any),
      ]);
      setTotalOrders(allRes.data.total || 0);
      setTotalPending(pendingRes.data.total || 0);
      setTotalApproved(approvedRes.data.total || 0);
      setTotalDocumented(documentedRes.data.total || 0);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchOrders = async (filters?: { status?: string; from_date?: string; to_date?: string }, page = 1) => {
    try {
      setIsLoading(true);
      const response = await marketerRequestsAPI.getRequests({ ...filters, page } as any);
      setOrders(response.data.data || []);
      setCurrentPage(response.data.current_page || 1);
      setTotalPages(response.data.last_page || 1);
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      toast.error(error.response?.data?.message || 'فشل تحميل الطلبات');
    } finally {
      setIsLoading(false);
    }
  };

  const stats = useMemo(() => {
    if (!Array.isArray(orders)) return { total: 0, pending: 0, documented: 0 };
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      documented: orders.filter(o => o.status === 'documented').length,
    };
  }, [orders]);

  const filteredOrders = useFilteredData(Array.isArray(orders) ? orders : [], searchTerm, ['invoice_number']);

  const statsData = useMemo(() => [
    { title: 'إجمالي الطلبات', value: totalOrders, icon: ShoppingCart, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
    { title: 'قيد الانتظار', value: totalPending, icon: Clock, color: 'text-amber-500', bgColor: 'bg-amber-500/10' },
    { title: 'موافق عليه', value: totalApproved, icon: Truck, color: 'text-indigo-500', bgColor: 'bg-indigo-500/10' },
    { title: 'طلبات موثقة', value: totalDocumented, icon: CheckCircle, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10' },
  ], [totalOrders, totalPending, totalApproved, totalDocumented]);

  const addOrderItem = () => {
    setOrderItems([...orderItems, { product_id: 0, quantity: 1 }]);
  };

  const removeOrderItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const handleCreateOrder = async () => {
    if (orderItems.length === 0 || orderItems.some(item => item.product_id === 0)) {
      toast.error('يجب إضافة منتج واحد على الأقل واختيار المنتجات');
      return;
    }

    // Validate quantities against available stock
    for (const item of orderItems) {
      const product = products.find(p => p.id === item.product_id);
      if (product && item.quantity > product.main_stock_quantity) {
        toast.error(`الكمية المطلوبة من ${product.name} تتجاوز المخزون المتاح (متوفر: ${product.main_stock_quantity})`);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const response = await marketerRequestsAPI.createRequest({ items: orderItems });
      toast.success(response.message || 'تم إنشاء الطلب بنجاح');
      setIsNewOrderOpen(false);
      setOrderItems([]);
      const filters = activeTab === 'all' ? undefined : { status: activeTab };
      fetchOrders(filters, 1);
      fetchStats();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'فشل إنشاء الطلب');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewDetails = async (orderId: number) => {
    try {
      const response = await marketerRequestsAPI.getRequestDetails(orderId);
      setSelectedOrder(response.data);
    } catch (error: any) {
      console.error('Error fetching order details:', error);
      toast.error(error.response?.data?.message || 'فشل تحميل تفاصيل الطلب');
    }
  };

  const handlePrintInvoice = async (order: MarketerRequestDetails) => {
    try {
      toast.loading('جاري إنشاء الفاتورة...', { id: 'invoice-generation' });

      // حساب المجموع الفرعي
      const subtotal = order.items.reduce((sum, item) => sum + (item.current_price * item.quantity), 0);
      const taxRate = 0;
      const taxAmount = subtotal * taxRate;
      const total = subtotal + taxAmount;

      // إنشاء عنصر مخفي للفاتورة
      const invoiceElement = document.createElement('div');
      invoiceElement.style.position = 'absolute';
      invoiceElement.style.left = '-9999px';
      invoiceElement.style.top = '0';
      invoiceElement.style.width = '800px';
      invoiceElement.innerHTML = `
        <div style="font-family: 'Cairo', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #ffffff; direction: rtl; color: #000;">
          <div style="max-width: 800px; margin: 0 auto; background: white; border: 2px solid #000;">
            <div style="background: #000; color: #fff; padding: 30px 40px; text-align: center; border-bottom: 3px solid #000;">
              <div style="display: inline-block; padding: 4px 12px; background: #fff; color: #000; font-size: 11px; font-weight: bold; border-radius: 4px; margin-bottom: 10px;">
                ${getStatusDetails(order.request.status).label}
              </div>
              <div style="font-size: 36px; font-weight: bold; letter-spacing: 2px; margin: 10px 0;">
                ${order.request.invoice_number}
              </div>
              <div style="display: flex; justify-content: center; gap: 30px; margin-top: 15px; font-size: 13px;">
                <div style="display: flex; align-items: center; gap: 6px;">
                  <span>📅</span>
                  <span>تم الطلب بتاريخ: ${formatDateTime(order.request.created_at)}</span>
                </div>
              </div>
            </div>
            
            <div style="padding: 30px 40px;">
              ${order.request.approver_name || order.request.documenter_name ? `
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; padding: 15px; background: #f9f9f9; border: 1px solid #ddd; border-radius: 6px;">
                  ${order.request.approver_name ? `
                    <div style="display: flex; flex-direction: column; gap: 4px;">
                      <span style="font-size: 11px; color: #666; font-weight: 600; text-transform: uppercase;">✅ تمت الموافقة بواسطة</span>
                      <span style="font-size: 14px; color: #000; font-weight: bold;">${order.request.approver_name}</span>
                      ${order.request.approved_at ? `<span style="font-size: 11px; color: #666;">${formatDateTime(order.request.approved_at)}</span>` : ''}
                    </div>
                  ` : ''}
                  ${order.request.documenter_name ? `
                    <div style="display: flex; flex-direction: column; gap: 4px;">
                      <span style="font-size: 11px; color: #666; font-weight: 600; text-transform: uppercase;">📝 تم التوثيق بواسطة</span>
                      <span style="font-size: 14px; color: #000; font-weight: bold;">${order.request.documenter_name}</span>
                      ${order.request.documented_at ? `<span style="font-size: 11px; color: #666;">${formatDateTime(order.request.documented_at)}</span>` : ''}
                    </div>
                  ` : ''}
                </div>
              ` : ''}

              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid #000;">
                <span style="font-size: 18px; font-weight: bold; color: #000;">ملخص الأصناف</span>
                <span style="font-size: 14px; color: #666; background: #f5f5f5; padding: 4px 12px; border-radius: 4px;">
                  ${order.items.length} ${order.items.length === 1 ? 'صنف' : order.items.length === 2 ? 'صنفان' : 'أصناف'}
                </span>
              </div>
              
              <table style="width: 100%; border-collapse: collapse; margin: 20px 0; border: 1px solid #000;">
                <thead style="background: #000; color: #fff;">
                  <tr>
                    <th style="padding: 12px 15px; text-align: right; font-weight: bold; font-size: 13px; border: 1px solid #000;">المنتج</th>
                    <th style="padding: 12px 15px; text-align: center; font-weight: bold; font-size: 13px; border: 1px solid #000;">الكمية</th>
                    <th style="padding: 12px 15px; text-align: center; font-weight: bold; font-size: 13px; border: 1px solid #000;">المبلغ</th>
                    <th style="padding: 12px 15px; text-align: center; font-weight: bold; font-size: 13px; border: 1px solid #000;">الإجمالي</th>
                  </tr>
                </thead>
                <tbody>
                  ${order.items.map((item, idx) => `
                    <tr style="border-bottom: ${idx === order.items.length - 1 ? '2px solid #000' : '1px solid #ddd'};">
                      <td style="padding: 12px 15px; text-align: right; font-size: 14px; border: 1px solid #ddd; font-weight: 600; color: #000;">${item.product_name}</td>
                      <td style="padding: 12px 15px; text-align: center; font-size: 14px; border: 1px solid #ddd;">${item.quantity}</td>
                      <td style="padding: 12px 15px; text-align: center; font-size: 14px; border: 1px solid #ddd;">${formatAmount(item.current_price)}</td>
                      <td style="padding: 12px 15px; text-align: center; font-size: 14px; border: 1px solid #ddd;"><strong>${formatAmount(item.current_price * item.quantity)}</strong></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>

              <div style="background: #f9f9f9; border: 1px solid #000; border-radius: 8px; padding: 20px; margin-top: 30px;">
                <div style="display: flex; align-items: center; gap: 8px; font-size: 15px; font-weight: bold; margin-bottom: 15px; color: #000;">
                  <span>📋</span>
                  <span>ملاحظات إضافية</span>
                </div>
                <div style="display: grid; gap: 10px;">
                  <div style="display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; color: #666;">
                    <span style="font-weight: 600;">المجموع الفرعي:</span>
                    <span style="font-weight: bold;">${formatAmount(subtotal)}</span>
                  </div>
                  ${taxRate > 0 ? `
                    <div style="display: flex; justify-content: space-between; padding: 8px 0; font-size: 13px; color: #666;">
                      <span style="font-weight: 600;">الضريبة (${taxRate * 100}%):</span>
                      <span style="font-weight: bold;">${formatAmount(taxAmount)}</span>
                    </div>
                  ` : ''}
                  <div style="display: flex; justify-content: space-between; border-top: 2px solid #000; padding-top: 15px; margin-top: 10px; font-size: 18px; font-weight: bold;">
                    <span style="font-weight: 600;">الإجمالي:</span>
                    <span style="font-size: 24px; color: #000;">${formatAmount(total)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div style="text-align: center; padding: 20px; background: #f5f5f5; border-top: 2px solid #000; color: #666; font-size: 11px;">
              <p>تم إنشاء هذه الفاتورة بتاريخ ${new Date().toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(invoiceElement);

      // تحويل العنصر إلى صورة بجودة وخيارات محسنة لتقليل الحجم
      const canvas = await html2canvas(invoiceElement, {
        scale: 1.5, // تقليل الدقة قليلاً لتقليل الحجم
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      document.body.removeChild(invoiceElement);

      // استخدام JPEG بدلاً من PNG لضغط أفضل
      const imgData = canvas.toDataURL('image/jpeg', 0.8); // جودة 80%

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true // تفعيل ضغط PDF
      });

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight, undefined, 'FAST'); // استخدام وضع FAST للرسم

      // تنزيل الملف
      const fileName = `فاتورة-${order.request.invoice_number}.pdf`;
      pdf.save(fileName);

      toast.success('تم تنزيل الفاتورة بنجاح', { id: 'invoice-generation' });

      // طباعة الفاتورة من المتصفح
      setTimeout(() => {
        const pdfBlob = pdf.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);

        const printFrame = document.createElement('iframe');
        printFrame.style.display = 'none';
        printFrame.src = pdfUrl;
        document.body.appendChild(printFrame);

        printFrame.onload = () => {
          printFrame.contentWindow?.print();
          setTimeout(() => {
            document.body.removeChild(printFrame);
            URL.revokeObjectURL(pdfUrl);
          }, 100);
        };
      }, 500);

    } catch (error) {
      console.error('Error generating invoice:', error);
      toast.error('فشل إنشاء الفاتورة', { id: 'invoice-generation' });
    }
  };

  const handleCancelOrder = async (orderId: number, notes?: string) => {
    try {
      const response = await marketerRequestsAPI.cancelRequest(orderId, notes);
      toast.success(response.message || 'تم إلغاء الطلب بنجاح');
      setSelectedOrder(null);
      fetchOrders();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'فشل إلغاء الطلب');
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <PageHeader
        title="إدارة طلبات البضاعة"
        subtitle="تتبع وإدارة مخزونك بكل سهولة"
        icon={Package}
        action={{
          label: "إنشاء طلب جديد",
          icon: Plus,
          onClick: () => setIsNewOrderOpen(true)
        }}
      />

      {/* Stats */}
      <div className="hide-scrollbar flex gap-4 overflow-x-auto pb-2 -mx-2 px-2">
        {statsData.map((stat, i) => (
          <div key={i} className="min-w-[200px] flex-shrink-0">
            <StatCard {...stat} delay={i * 0.1} />
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="lg:grid lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-8 space-y-6">
          <Card className="border-none shadow-md overflow-hidden">
            <CardHeader className="bg-muted/30 p-4 md:pb-0">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between pb-4">
                <div className="flex w-full items-center gap-2">
                  <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="ابحث برقم الفاتورة..." className="flex-1 sm:max-w-xs" />
                  <Button variant="ghost" className="h-11 rounded-xl px-4 gap-2 text-muted-foreground hover:bg-background text-sm">
                    <Filter className="h-4 w-4" />
                    تصفية
                  </Button>
                </div>
              </div>
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value)} className="w-full">
                <TabsList className="h-12 w-full justify-start gap-2 bg-transparent p-0 border-b rounded-none overflow-x-auto hide-scrollbar flex-nowrap">
                  {[
                    { id: 'pending', label: 'قيد الانتظار' },
                    { id: 'approved', label: 'موافق عليه' },
                    { id: 'documented', label: 'الموثقة' },
                    { id: 'rejected', label: 'المرفوضة' },
                    { id: 'cancelled', label: 'الملغية' },
                    { id: 'all', label: 'الكل' },
                  ].map(tab => (
                    <TabsTrigger key={tab.id} value={tab.id} className="rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 text-sm font-semibold transition-all data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary flex-shrink-0">
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {['pending', 'approved', 'documented', 'rejected', 'cancelled', 'all'].map((tabValue) => (
                  <TabsContent key={tabValue} value={tabValue} className="mt-6 space-y-4">
                    <AnimatePresence mode="popLayout">
                      {filteredOrders.filter(order => tabValue === 'all' || order.status === tabValue).map((order, idx) => {
                        const status = getStatusDetails(order.status);
                        return (
                          <motion.div key={order.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3, delay: idx * 0.05 }}
                            onClick={() => handleViewDetails(order.id)} className="group cursor-pointer rounded-2xl border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-lg active:scale-[0.98] md:p-5">
                            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                              <div className="flex items-center gap-4 md:gap-5">
                                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl md:h-12 md:w-12 md:rounded-2xl ${status.bg} transition-colors group-hover:scale-110`}>
                                  <status.icon className={`h-5 w-5 md:h-6 md:w-6 ${status.color}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-bold text-base md:text-lg truncate">{order.invoice_number}</h4>
                                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      {formatDateTime(order.created_at)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className={`flex h-7 items-center gap-1 rounded-full px-3 ${status.bg} ${status.color} text-[10px] font-bold border ${status.border} md:h-8 md:px-4 md:text-xs`}>
                                  <status.icon className="h-3 w-3" />
                                  {status.label}
                                </div>
                                <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 md:h-5 md:w-5" />
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchOrders(undefined, currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
                className="bg-primary/10 hover:bg-primary/20 border-primary/30"
              >
                السابق
              </Button>
              <span className="text-sm font-bold text-foreground px-3">
                صفحة {currentPage} من {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchOrders(undefined, currentPage + 1)}
                disabled={currentPage === totalPages || isLoading}
                className="bg-primary/10 hover:bg-primary/20 border-primary/30"
              >
                التالي
              </Button>
            </div>
          )}
        </div>

        {/* Right Column */}
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
                { title: 'مراجعة المخزن', desc: 'يتم التأكد من توفر الكميات من قبل أمين المخزن', icon: CheckCircle, color: 'amber' },
                { title: 'الموافقة والشحن', desc: 'اعتماد الطلب وبدء عملية النقل إلى مستودعك', icon: Truck, color: 'indigo' },
                { title: 'إضافة للمخزون', desc: 'عند التأكيد تضاف الكميات تلقائياً لمخزونك', icon: Boxes, color: 'emerald' },
              ].map((step, i) => (
                <div key={i} className="relative flex gap-4">
                  {i < 3 && <div className="absolute top-10 right-4 h-full w-[2px] bg-muted" />}
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
        </div>
      </div>

      {/* FAB */}
      <motion.div className="fixed bottom-6 right-6 z-50 md:hidden" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.5 }}>
        <Button onClick={() => setIsNewOrderOpen(true)} size="icon" className="h-16 w-16 rounded-full bg-primary text-white shadow-2xl shadow-primary/40">
          <Plus className="h-8 w-8" />
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
            <DialogDescription>اختر المنتجات والكميات التي ترغب في إضافتها إلى عهدتك من المخزن الرئيسي</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 pt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <Package className="h-4 w-4 text-primary" />
                  المنتجات المطلوبة
                </h3>
                <Button variant="outline" size="sm" onClick={addOrderItem} className="h-8 text-xs">إضافة منتج</Button>
              </div>
              <div className="space-y-3">
                {orderItems.map((item, index) => {
                  const selectedProduct = products.find(p => p.id === item.product_id);
                  return (
                    <div key={index} className="flex items-start gap-3 rounded-lg border bg-muted/20 p-3">
                      <div className="flex-1 space-y-2">
                        <Label className="text-xs font-medium text-muted-foreground">المنتج</Label>
                        <Select value={item.product_id.toString()} onValueChange={(value) => {
                          const updatedItems = [...orderItems];
                          updatedItems[index].product_id = parseInt(value);
                          setOrderItems(updatedItems);
                        }}>
                          <SelectTrigger className="h-11 text-sm">
                            <SelectValue placeholder="اختر المنتج...">
                              {selectedProduct ? selectedProduct.name : "اختر المنتج..."}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent className="max-h-[300px]">
                            {isLoadingProducts ? (
                              <div className="p-4 text-center text-sm text-muted-foreground">جاري التحميل...</div>
                            ) : products.filter(p => p.is_active && p.main_stock_quantity > 0).length === 0 ? (
                              <div className="p-4 text-center text-sm text-muted-foreground">لا توجد منتجات متاحة</div>
                            ) : (
                              products.filter(p => p.is_active && p.main_stock_quantity > 0).map((product) => (
                                <SelectItem key={product.id} value={product.id.toString()} className="cursor-pointer py-2.5">
                                  <div className="flex items-center justify-between gap-4 w-full">
                                    <span className="font-medium">{product.name}</span>
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                      <span className="font-bold text-emerald-600">{formatAmount(product.current_price)}</span>
                                      <span className="font-semibold">{product.main_stock_quantity} متوفر</span>
                                    </div>
                                  </div>
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        {selectedProduct && (
                          <div className="flex items-center gap-3 text-xs">
                            <span className="flex items-center gap-1 text-emerald-600">
                              <DollarSign className="h-3.5 w-3.5" />
                              <span className="font-bold">{formatAmount(selectedProduct.current_price)}</span>
                            </span>
                            <span className="text-muted-foreground">•</span>
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <Package className="h-3.5 w-3.5" />
                              <span className="font-semibold">{selectedProduct.main_stock_quantity} متوفر</span>
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="w-28 space-y-2">
                        <Label className="text-xs font-medium text-muted-foreground">الكمية</Label>
                        <Input
                          type="number"
                          min="1"
                          max={products.find(p => p.id === item.product_id)?.main_stock_quantity || 999999}
                          value={item.quantity}
                          onChange={(e) => {
                            const updatedItems = [...orderItems];
                            const maxQty = products.find(p => p.id === item.product_id)?.main_stock_quantity || 999999;
                            const newQty = parseInt(e.target.value) || 1;
                            updatedItems[index].quantity = Math.min(newQty, maxQty);
                            setOrderItems(updatedItems);
                          }}
                          className="h-11 text-sm text-center font-semibold"
                        />
                      </div>
                      <div className="pt-7">
                        <Button variant="ghost" size="icon" onClick={() => removeOrderItem(index)} className="h-11 w-11 text-destructive hover:bg-destructive/10 hover:text-destructive">
                          <XCircle className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
              {orderItems.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 rounded-lg border border-dashed text-muted-foreground text-xs">
                  {isLoadingProducts ? 'جاري تحميل المنتجات...' : 'لا توجد أصناف مضافة حالياً.'}
                </div>
              )}
              {orderItems.length > 0 && (
                <div className="rounded-xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-4 space-y-2.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground font-medium">إجمالي الأصناف:</span>
                    <span className="font-bold text-foreground">{orderItems.length} صنف</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground font-medium">إجمالي الكمية:</span>
                    <span className="font-bold text-foreground">{orderItems.reduce((sum, item) => sum + item.quantity, 0)} وحدة</span>
                  </div>
                  <div className="flex items-center justify-between pt-2.5 border-t-2 border-primary/20">
                    <span className="font-semibold text-base">الإجمالي المتوقع:</span>
                    <span className="font-bold text-lg text-primary">
                      {formatAmount(
                        orderItems.reduce((sum, item) => {
                          const product = products.find(p => p.id === item.product_id);
                          return sum + (product ? product.current_price * item.quantity : 0);
                        }, 0)
                      )}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="pt-4 border-t flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setIsNewOrderOpen(false)}>إلغاء</Button>
              <Button disabled={orderItems.length === 0 || isSubmitting} onClick={handleCreateOrder} className="flex-1">
                {isSubmitting ? 'جاري الإرسال...' : 'تأكيد الطلب'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedOrder && (
            <div className="space-y-6">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-xl">
                  <FileText className="w-5 h-5 text-primary" />
                  تفاصيل الطلب: {selectedOrder.request.invoice_number}
                </DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-muted/30 rounded-2xl text-sm border">
                <div className="col-span-full border-b pb-3 mb-1 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1.5 font-medium">
                      <Calendar className="h-4 w-4 text-primary/60" />
                      تاريخ تقديم الطلب
                    </p>
                    <p className="font-bold text-base">{formatDateTime(selectedOrder.request.created_at)}</p>
                  </div>
                  <Badge className={`${getStatusDetails(selectedOrder.request.status).bg} ${getStatusDetails(selectedOrder.request.status).color} border-none px-4 py-1.5 text-xs font-bold`}>
                    {getStatusDetails(selectedOrder.request.status).label}
                  </Badge>
                </div>
                {selectedOrder.request.approver_name && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-emerald-500/10">
                        <UserCheck className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase">تمت الموافقة بواسطة</p>
                        <p className="font-bold text-emerald-700 text-sm">{selectedOrder.request.approver_name}</p>
                        {selectedOrder.request.approved_at && (
                          <p className="text-[10px] text-muted-foreground mt-0.5">بتاريخ {formatDateTime(selectedOrder.request.approved_at)}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                {selectedOrder.request.documenter_name && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-sky-500/10">
                        <FileText className="h-4 w-4 text-sky-600" />
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase">تم التوثيق بواسطة</p>
                        <p className="font-bold text-sky-700 text-sm">{selectedOrder.request.documenter_name}</p>
                        {selectedOrder.request.documented_at && (
                          <p className="text-[10px] text-muted-foreground mt-0.5">بتاريخ {formatDateTime(selectedOrder.request.documented_at)}</p>
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
                <div className="rounded-lg border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-right p-3 font-medium">المنتج</th>
                        <th className="text-center p-3 font-medium">الكمية</th>
                        <th className="text-left p-3 font-medium">السعر</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {selectedOrder.items.map((item, i) => (
                        <tr key={i} className="hover:bg-muted/30 transition-colors">
                          <td className="p-3 font-medium">{item.product_name}</td>
                          <td className="p-3 text-center"><Badge variant="secondary">{item.quantity}</Badge></td>
                          <td className="p-3 text-left text-muted-foreground">{formatAmount(item.current_price)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="pt-4 border-t flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setSelectedOrder(null)}>إغلاق</Button>
                {(selectedOrder.request.status === 'approved' || selectedOrder.request.status === 'documented') && (
                  <Button variant="default" className="flex-1 gap-2" onClick={() => handlePrintInvoice(selectedOrder)}>
                    <Printer className="h-4 w-4" />
                    طباعة الفاتورة
                  </Button>
                )}
                {(selectedOrder.request.status === 'pending' || selectedOrder.request.status === 'approved') && (
                  <Button variant="destructive" className="flex-1 gap-2" onClick={() => handleCancelOrder(selectedOrder.request.id, 'إلغاء من المسوق')}>
                    <XCircle className="h-4 w-4" />
                    إلغاء الطلب
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderManagementPage;
