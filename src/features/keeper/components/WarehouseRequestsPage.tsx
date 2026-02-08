// صفحة: إدارة طلبات المسوقين (أمين المخزن)
import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
    Package, Filter, Clock, CheckCircle, XCircle, AlertCircle, Truck,
    FileText, Calendar, ChevronRight, ShoppingCart, Boxes, History, Info,
    UserCheck, FileCheck, Eye, Image as ImageIcon, UploadCloud, Camera, FileImage, Printer
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useCurrency } from '@/store/currencyStore';
import { StatCard, SearchBar } from '../../marketer/components/shared';
import { useFilteredData } from '../../marketer/hooks';
import { warehouseRequestsAPI } from '@/api/warehouseRequests';
import type { WarehouseRequest, WarehouseRequestDetails } from '@/api/warehouseRequests';

const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const dateStr = date.toLocaleDateString('en-GB');
    const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    return `${dateStr} ${timeStr}`;
};

const getStatusDetails = (status: WarehouseRequest['status']) => {
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

export const WarehouseRequestsPage = () => {
    const [requests, setRequests] = useState<WarehouseRequest[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRequest, setSelectedRequest] = useState<WarehouseRequestDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('pending');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRequests, setTotalRequests] = useState(0);
    const [totalPending, setTotalPending] = useState(0);
    const [totalApproved, setTotalApproved] = useState(0);
    const [totalDocumented, setTotalDocumented] = useState(0);
    const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
    const [actionType, setActionType] = useState<'approve' | 'reject' | 'document' | null>(null);
    const [actionNotes, setActionNotes] = useState('');
    const [actionImage, setActionImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { formatAmount } = useCurrency();

    useEffect(() => {
        fetchRequests();
        fetchStats();
    }, []);

    useEffect(() => {
        const filters = activeTab === 'all' ? undefined : { status: activeTab as any };
        fetchRequests(filters, 1);
    }, [activeTab]);

    const fetchStats = async () => {
        try {
            const [allRes, pendingRes, approvedRes, documentedRes] = await Promise.all([
                warehouseRequestsAPI.getRequests({} as any),
                warehouseRequestsAPI.getRequests({ status: 'pending' }),
                warehouseRequestsAPI.getRequests({ status: 'approved' }),
                warehouseRequestsAPI.getRequests({ status: 'documented' }),
            ]);
            setTotalRequests(allRes.total || 0);
            setTotalPending(pendingRes.total || 0);
            setTotalApproved(approvedRes.total || 0);
            setTotalDocumented(documentedRes.total || 0);
        } catch (error) {
            console.error('❌ Error fetching stats:', error);
        }
    };

    const fetchRequests = async (filters: any = {}, page = 1) => {
        try {
            setIsLoading(true);
            const response = await warehouseRequestsAPI.getRequests({ ...filters, page });
            setRequests(response.data || []);
            setCurrentPage(response.current_page || 1);
            setTotalPages(response.last_page || 1);
        } catch (error: any) {
            console.error('❌ Error fetching requests:', error);
            toast.error(error.response?.data?.message || 'فشل تحميل الطلبات');
        } finally {
            setIsLoading(false);
        }
    };

    const filteredRequests = useFilteredData(Array.isArray(requests) ? requests : [], searchTerm, ['invoice_number', 'marketer_name']);

    const statsData = useMemo(() => [
        { title: 'إجمالي الطلبات', value: totalRequests, icon: ShoppingCart, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
        { title: 'قيد الانتظار', value: totalPending, icon: Clock, color: 'text-amber-500', bgColor: 'bg-amber-500/10' },
        { title: 'موافق عليه', value: totalApproved, icon: CheckCircle, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10' },
        { title: 'طلبات موثقة', value: totalDocumented, icon: Truck, color: 'text-sky-500', bgColor: 'bg-sky-500/10' },
    ], [totalRequests, totalPending, totalApproved, totalDocumented]);

    const handleViewDetails = async (requestId: number) => {
        try {
            const response = await warehouseRequestsAPI.getRequestDetails(requestId);
            console.log('📄 Detailed Request Info:', response.data.request);
            setSelectedRequest(response.data);
        } catch (error: any) {
            console.error('Error fetching request details:', error);
            toast.error(error.response?.data?.message || 'فشل تحميل تفاصيل الطلب');
        }
    };

    const handleAction = (type: 'approve' | 'reject' | 'document') => {
        setActionType(type);
        setActionNotes('');
        setActionImage(null);
        setPreviewUrl(null);
        setIsActionDialogOpen(true);
    };

    const handleImageChange = (file: File | null) => {
        if (file) {
            setActionImage(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        } else {
            setActionImage(null);
            setPreviewUrl(null);
        }
    };

    const handlePrintInvoice = async (order: WarehouseRequestDetails) => {
        try {
            toast.loading('جاري إنشاء الفاتورة...', { id: 'invoice-generation' });

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
                  <span>تاريخ الطلب: ${formatDateTime(order.request.created_at)}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 6px;">
                  <span>👤</span>
                  <span>المسوق: ${order.request.marketer_name}</span>
                </div>
              </div>
            </div>
            
            <div style="padding: 30px 40px;">
              ${order.request.approver_name || order.request.documenter_name || order.request.rejecter_name ? `
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
                  ${order.request.status === 'rejected' ? `
                    <div style="display: flex; flex-direction: column; gap: 4px;">
                      <span style="font-size: 11px; color: #666; font-weight: 600; text-transform: uppercase;">❌ تم الرفض بواسطة</span>
                      <span style="font-size: 14px; color: #000; font-weight: bold;">${order.request.rejecter_name || 'أمين المخزن'}</span>
                      ${order.request.rejected_at ? `<span style="font-size: 11px; color: #666;">${formatDateTime(order.request.rejected_at)}</span>` : ''}
                    </div>
                  ` : ''}
                </div>
              ` : ''}

              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid #000;">
                <span style="font-size: 18px; font-weight: bold; color: #000;">قائمة الأصناف</span>
                <span style="font-size: 14px; color: #666; background: #f5f5f5; padding: 4px 12px; border-radius: 4px;">
                  ${order.items.length} ${order.items.length === 1 ? 'صنف' : order.items.length === 2 ? 'صنفان' : 'أصناف'}
                </span>
              </div>
              
              <table style="width: 100%; border-collapse: collapse; margin: 20px 0; border: 1px solid #000;">
                <thead style="background: #000; color: #fff;">
                  <tr>
                    <th style="padding: 12px 15px; text-align: right; font-weight: bold; font-size: 13px; border: 1px solid #000;">#</th>
                    <th style="padding: 12px 15px; text-align: right; font-weight: bold; font-size: 13px; border: 1px solid #000;">المنتج</th>
                    <th style="padding: 12px 15px; text-align: center; font-weight: bold; font-size: 13px; border: 1px solid #000;">الكمية</th>
                  </tr>
                </thead>
                <tbody>
                  ${order.items.map((item, idx) => `
                    <tr style="border-bottom: ${idx === order.items.length - 1 ? '2px solid #000' : '1px solid #ddd'};">
                      <td style="padding: 12px 15px; text-align: right; font-size: 14px; border: 1px solid #ddd;">${idx + 1}</td>
                      <td style="padding: 12px 15px; text-align: right; font-size: 14px; border: 1px solid #ddd; font-weight: 600; color: #000;">${item.product_name}</td>
                      <td style="padding: 12px 15px; text-align: center; font-size: 14px; border: 1px solid #ddd; font-weight: bold;">${item.quantity}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>

              <div style="background: #f9f9f9; border: 1px solid #000; border-radius: 8px; padding: 20px; margin-top: 30px;">
                <div style="display: flex; align-items: center; gap: 8px; font-size: 15px; font-weight: bold; margin-bottom: 10px; color: #000;">
                  <span>📝</span>
                  <span>ملاحظات إضافية</span>
                </div>
                <div style="font-size: 13px; color: #666; line-height: 1.6;">
                  ${order.request.rejection_notes || order.request.approval_notes || order.request.notes || 'لا يوجد ملاحظات إضافية على هذا الطلب.'}
                </div>
              </div>

              <div style="margin-top: 50px; display: grid; grid-template-columns: 1fr 1fr; gap: 100px; text-align: center;">
                <div>
                  <div style="border-bottom: 1px solid #000; margin-bottom: 10px; height: 40px;"></div>
                  <p style="font-weight: bold; font-size: 14px;">توقيع المستلم (المسوق)</p>
                </div>
                <div>
                  <div style="border-bottom: 1px solid #000; margin-bottom: 10px; height: 40px;"></div>
                  <p style="font-weight: bold; font-size: 14px;">ختم وتوقيع أمين المخزن</p>
                </div>
              </div>
            </div>

            <div style="text-align: center; padding: 20px; background: #f5f5f5; border-top: 2px solid #000; color: #666; font-size: 11px;">
              <p>تم إنشاء هذا المستند بتاريخ ${new Date().toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
        </div>
      `;

            document.body.appendChild(invoiceElement);

            // تحويل العنصر إلى صورة بجودة وخيارات محسنة لتقليل الحجم
            const canvas = await html2canvas(invoiceElement, {
                scale: 1.5, // تقليل الدقة قليلاً لتقليل الحجم (كان 2)
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
            const fileName = `فاتورة-مخزن-${order.request.invoice_number}.pdf`;
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

    const handleSubmitAction = async () => {
        if (!selectedRequest || !actionType) return;

        // Validate based on action type
        if (actionType === 'reject' && !actionNotes.trim()) {
            toast.error('يجب إدخال سبب الرفض');
            return;
        }
        if (actionType === 'document' && !actionImage) {
            toast.error('يجب رفع صورة التوثيق');
            return;
        }

        setIsSubmitting(true);
        try {
            let response;
            switch (actionType) {
                case 'approve':
                    response = await warehouseRequestsAPI.approveRequest(selectedRequest.request.id);
                    break;
                case 'reject':
                    response = await warehouseRequestsAPI.rejectRequest(selectedRequest.request.id, actionNotes);
                    break;
                case 'document':
                    if (actionImage) {
                        response = await warehouseRequestsAPI.documentRequest(selectedRequest.request.id, actionImage);
                    }
                    break;
            }

            toast.success(response?.message || 'تم تنفيذ العملية بنجاح');
            setIsActionDialogOpen(false);
            setSelectedRequest(null);
            fetchRequests();
            fetchStats();
        } catch (error: any) {
            console.error('❌ Action failed:', error);
            console.error('Error response:', error.response);
            console.error('Error data:', error.response?.data);

            const errorMessage = error.response?.data?.message
                || error.response?.data?.error
                || error.message
                || 'فشل تنفيذ العملية';

            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getActionLabel = () => {
        switch (actionType) {
            case 'approve': return 'الموافقة على الطلب';
            case 'reject': return 'رفض الطلب';
            case 'document': return 'توثيق الطلب';
            default: return '';
        }
    };

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/95 to-primary p-6 text-white shadow-2xl md:p-8">
                <div className="relative z-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                        <div className="flex items-center gap-3">
                            <div className="rounded-2xl bg-white/20 p-2 backdrop-blur-md md:p-3">
                                <Package className="h-6 w-6 md:h-8 md:w-8" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-extrabold tracking-tight md:text-4xl">إدارة طلبات المسوقين</h1>
                                <p className="mt-0.5 text-xs md:mt-1 md:text-base text-primary-foreground/80">الموافقة والتوثيق على طلبات البضاعة</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

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
                <div className="lg:col-span-12 space-y-6">
                    <Card className="border-none shadow-md overflow-hidden">
                        <CardHeader className="bg-muted/30 p-4 md:pb-0">
                            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between pb-4">
                                <div className="flex w-full items-center gap-2">
                                    <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="ابحث برقم الفاتورة أو اسم المسوق..." className="flex-1 sm:max-w-xs" />
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
                                            {filteredRequests.filter(req => tabValue === 'all' || req.status === tabValue).map((request, idx) => {
                                                const status = getStatusDetails(request.status);
                                                return (
                                                    <motion.div key={request.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3, delay: idx * 0.05 }}
                                                        onClick={() => handleViewDetails(request.id)} className="group cursor-pointer rounded-2xl border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-lg active:scale-[0.98] md:p-5">
                                                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                                            <div className="flex items-center gap-4 md:gap-5">
                                                                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl md:h-12 md:w-12 md:rounded-2xl ${status.bg} transition-colors group-hover:scale-110`}>
                                                                    <status.icon className={`h-5 w-5 md:h-6 md:w-6 ${status.color}`} />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <h4 className="font-bold text-base md:text-lg truncate">{request.invoice_number}</h4>
                                                                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                                                                        <span className="flex items-center gap-1">
                                                                            <UserCheck className="h-3 w-3" />
                                                                            {request.marketer_name}
                                                                        </span>
                                                                        <span className="flex items-center gap-1">
                                                                            <Calendar className="h-3 w-3" />
                                                                            {formatDateTime(request.created_at)}
                                                                        </span>
                                                                        {request.status === 'rejected' && (
                                                                            <span className="flex items-center gap-1 text-rose-600 font-bold">
                                                                                <XCircle className="h-3 w-3" />
                                                                                بواسطة: {request.rejecter_name || 'أمين المخزن'} ({request.rejected_at ? formatDateTime(request.rejected_at) : formatDateTime(request.updated_at || request.created_at)})
                                                                            </span>
                                                                        )}
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
                                        {filteredRequests.filter(req => tabValue === 'all' || req.status === tabValue).length === 0 && (
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
                                onClick={() => fetchRequests(undefined, currentPage - 1)}
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
                                onClick={() => fetchRequests(undefined, currentPage + 1)}
                                disabled={currentPage === totalPages || isLoading}
                                className="bg-primary/10 hover:bg-primary/20 border-primary/30"
                            >
                                التالي
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Request Details Dialog */}
            <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    {selectedRequest && (
                        <div className="space-y-6">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2 text-xl">
                                    <FileText className="w-5 h-5 text-primary" />
                                    تفاصيل الطلب: {selectedRequest.request.invoice_number}
                                </DialogTitle>
                                <DialogDescription>
                                    عرض تفاصيل الطلب والأصناف المطلوبة
                                </DialogDescription>
                            </DialogHeader>

                            {/* Request Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-muted/30 rounded-2xl text-sm border">
                                <div className="col-span-full border-b pb-3 mb-1 flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1.5 font-medium">
                                            <UserCheck className="h-4 w-4 text-primary/60" />
                                            المسوق
                                        </p>
                                        <p className="font-bold text-base">{selectedRequest.request.marketer_name}</p>
                                    </div>
                                    <Badge className={`${getStatusDetails(selectedRequest.request.status).bg} ${getStatusDetails(selectedRequest.request.status).color} border-none px-4 py-1.5 text-xs font-bold`}>
                                        {getStatusDetails(selectedRequest.request.status).label}
                                    </Badge>
                                </div>

                                <div>
                                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1.5 font-medium">
                                        <Calendar className="h-4 w-4 text-primary/60" />
                                        تاريخ الطلب
                                    </p>
                                    <p className="font-bold">{formatDateTime(selectedRequest.request.created_at)}</p>
                                </div>

                                {selectedRequest.request.status === 'rejected' && (
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 rounded-lg bg-destructive/10">
                                                <XCircle className="h-4 w-4 text-destructive" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-muted-foreground font-bold uppercase">تم الرفض بواسطة</p>
                                                <p className="font-bold text-rose-700 text-sm">{selectedRequest.request.rejecter_name || 'أمين المخزن'}</p>
                                                {selectedRequest.request.rejected_at && (
                                                    <p className="text-[10px] text-muted-foreground mt-0.5">بتاريخ {formatDateTime(selectedRequest.request.rejected_at)}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {selectedRequest.request.approver_name && (
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 rounded-lg bg-emerald-500/10">
                                                <UserCheck className="h-4 w-4 text-emerald-600" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-muted-foreground font-bold uppercase">تمت الموافقة بواسطة</p>
                                                <p className="font-bold text-emerald-700 text-sm">{selectedRequest.request.approver_name}</p>
                                                {selectedRequest.request.approved_at && (
                                                    <p className="text-[10px] text-muted-foreground mt-0.5">بتاريخ {formatDateTime(selectedRequest.request.approved_at)}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {selectedRequest.request.documenter_name && (
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 rounded-lg bg-sky-500/10">
                                                <FileCheck className="h-4 w-4 text-sky-600" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-muted-foreground font-bold uppercase">تم التوثيق بواسطة</p>
                                                <p className="font-bold text-sky-700 text-sm">{selectedRequest.request.documenter_name}</p>
                                                {selectedRequest.request.documented_at && (
                                                    <p className="text-[10px] text-muted-foreground mt-0.5">بتاريخ {formatDateTime(selectedRequest.request.documented_at)}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Items Table */}
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
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {selectedRequest.items.map((item, i) => (
                                                <tr key={i} className="hover:bg-muted/30 transition-colors">
                                                    <td className="p-3 font-medium">{item.product_name}</td>
                                                    <td className="p-3 text-center"><Badge variant="secondary">{item.quantity}</Badge></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Documentation Info & Notes */}
                            {(selectedRequest.request.status !== 'pending') && (
                                <div className="space-y-4 p-5 bg-primary/5 rounded-2xl border border-primary/10">
                                    <h3 className="text-sm font-bold flex items-center gap-2 text-primary">
                                        <Info className="w-4 h-4" />
                                        معلومات إضافية
                                    </h3>

                                    <div className="space-y-4">
                                        {/* Notes Section */}
                                        {(selectedRequest.request.rejection_notes || selectedRequest.request.approval_notes || selectedRequest.request.notes) && (
                                            <div>
                                                <p className="text-xs text-muted-foreground mb-1.5 font-bold">
                                                    {selectedRequest.request.status === 'rejected' ? 'سبب الرفض' : 'ملاحظات العملية'}
                                                </p>
                                                <p className={`p-4 rounded-xl border italic leading-relaxed text-sm ${selectedRequest.request.status === 'rejected' ? 'bg-destructive/5 text-destructive border-destructive/20' : 'bg-background border-primary/10'}`}>
                                                    {selectedRequest.request.rejection_notes || selectedRequest.request.approval_notes || selectedRequest.request.notes || 'لا يوجد ملاحظات إضافية'}
                                                </p>
                                            </div>
                                        )}

                                        {/* Stamped Image Link */}
                                        {(selectedRequest.request.stamped_image || selectedRequest.request.documentation_image) && (
                                            <div className="flex items-center justify-between p-4 bg-background border rounded-2xl border-primary/20 hover:border-primary/40 transition-all shadow-sm">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                                        <ImageIcon className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold">صورة الفاتورة الموثقة</p>
                                                        <p className="text-[10px] text-muted-foreground italic">تم رفعها كإثبات للاستلام</p>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="gap-2 border-primary/20 hover:bg-primary/5 text-primary font-bold"
                                                    onClick={() => window.open(selectedRequest.request.stamped_image || selectedRequest.request.documentation_image || '', '_blank')}
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    عرض الفاتورة
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="pt-4 border-t flex gap-2 flex-wrap">
                                <Button variant="outline" className="flex-1" onClick={() => setSelectedRequest(null)}>إغلاق</Button>

                                {(selectedRequest.request.status === 'approved' || selectedRequest.request.status === 'documented') && (
                                    <Button variant="default" className="flex-1 gap-2" onClick={() => handlePrintInvoice(selectedRequest)}>
                                        <Printer className="h-4 w-4" />
                                        طباعة الفاتورة
                                    </Button>
                                )}

                                {selectedRequest.request.status === 'pending' && (
                                    <>
                                        <Button variant="default" className="flex-1 gap-2 bg-emerald-600 hover:bg-emerald-700" onClick={() => handleAction('approve')}>
                                            <CheckCircle className="h-4 w-4" />
                                            الموافقة
                                        </Button>
                                        <Button variant="destructive" className="flex-1 gap-2" onClick={() => handleAction('reject')}>
                                            <XCircle className="h-4 w-4" />
                                            رفض
                                        </Button>
                                    </>
                                )}

                                {selectedRequest.request.status === 'approved' && (
                                    <>
                                        <Button variant="default" className="flex-1 gap-2 bg-sky-600 hover:bg-sky-700" onClick={() => handleAction('document')}>
                                            <FileCheck className="h-4 w-4" />
                                            توثيق
                                        </Button>
                                        <Button variant="destructive" className="flex-1 gap-2" onClick={() => handleAction('reject')}>
                                            <XCircle className="h-4 w-4" />
                                            رفض
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Action Dialog */}
            <Dialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>{getActionLabel()}</DialogTitle>
                        <DialogDescription>
                            {actionType === 'approve' && 'هل أنت متأكد من الموافقة على هذا الطلب؟'}
                            {actionType === 'reject' && 'يرجى إدخال سبب الرفض'}
                            {actionType === 'document' && 'يرجى رفع صورة التوثيق'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 pt-4">
                        {actionType === 'reject' && (
                            <div className="space-y-2">
                                <Label htmlFor="notes">ملاحظات (إلزامي لسبب الرفض)</Label>
                                <Textarea
                                    id="notes"
                                    value={actionNotes}
                                    onChange={(e) => setActionNotes(e.target.value)}
                                    placeholder="أدخل سبب الرفض..."
                                    rows={4}
                                    required
                                />
                            </div>
                        )}

                        {actionType === 'document' && (
                            <div className="space-y-4">
                                <Label className="text-sm font-bold flex items-center gap-2">
                                    <Camera className="w-4 h-4 text-primary" />
                                    صورة التوثيق المعتمدة
                                </Label>

                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
                                />

                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`
                                        relative border-2 border-dashed rounded-2xl p-8 transition-all cursor-pointer overflow-hidden
                                        flex flex-col items-center justify-center text-center gap-4
                                        ${previewUrl
                                            ? 'border-emerald-500 bg-emerald-500/5 shadow-inner'
                                            : 'border-border hover:border-primary/50 hover:bg-primary/5 active:scale-[0.98]'
                                        }
                                    `}
                                >
                                    {previewUrl ? (
                                        <div className="space-y-4 w-full">
                                            <div className="relative w-full aspect-video rounded-xl overflow-hidden border shadow-lg mx-auto max-w-[280px]">
                                                <img
                                                    src={previewUrl}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black/20" />
                                                <div className="absolute top-2 right-2 flex gap-1">
                                                    <Badge className="bg-emerald-600 border-none shadow-sm">
                                                        <CheckCircle className="w-3 h-3 ml-1" />
                                                        تم الاختيار
                                                    </Badge>
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="font-bold text-emerald-700 text-sm">تم اختيار الصورة بنجاح</p>
                                                <p className="text-[10px] text-muted-foreground truncate max-w-[200px] mx-auto">
                                                    {actionImage?.name}
                                                </p>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-8 text-xs border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleImageChange(null);
                                                }}
                                            >
                                                تغيير الصورة
                                            </Button>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                                <UploadCloud className="w-8 h-8" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="font-bold text-base">اضغط لرفع صورة التوثيق</p>
                                                <p className="text-xs text-muted-foreground max-w-[200px]">
                                                    تأكد من وضوح الختم والتوقيع على الفاتورة
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-4 pt-2">
                                                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                                                    <FileImage className="w-3 h-3" />
                                                    JPG, PNG, WEBP
                                                </div>
                                                <div className="w-1 h-1 bg-border rounded-full" />
                                                <p className="text-[10px] text-muted-foreground">الحد الأقصى: 10MB</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="flex gap-2 pt-2">
                            <Button variant="outline" className="flex-1" onClick={() => setIsActionDialogOpen(false)} disabled={isSubmitting}>
                                إلغاء
                            </Button>
                            <Button
                                variant="default"
                                className="flex-1"
                                onClick={handleSubmitAction}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'جاري التنفيذ...' : 'تأكيد'}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default WarehouseRequestsPage;
