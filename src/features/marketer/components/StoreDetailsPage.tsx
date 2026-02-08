import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    Store as StoreIcon,
    User,
    Phone,
    MapPin,
    Wallet,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    RefreshCcw,
    FileText,
    CreditCard,
    RotateCcw,
    Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { storesAPI } from '@/api/stores';
import { useCurrency } from '@/store/currencyStore';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { PageHeader } from './shared';

interface LedgerEntry {
    id: number;
    entry_type: 'sale' | 'payment' | 'return';
    amount: number;
    sale_invoice_number: string | null;
    payment_receipt_number: string | null;
    return_number: string | null;
    marketer_name: string;
    created_at: string;
}

interface StoreDetails {
    store: {
        id: number;
        name: string;
        owner_name: string;
        phone: string;
        location: string;
        address: string;
        is_active: boolean;
    };
    summary: {
        total_sales: number;
        total_payments: number;
        total_returns: number;
        remaining_debt: number;
    };
    ledger: LedgerEntry[];
}

export const StoreDetailsPage = () => {
    const { storeId } = useParams<{ storeId: string }>();
    const navigate = useNavigate();
    const { formatAmount } = useCurrency();
    const [data, setData] = useState<StoreDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            if (!storeId) return;
            try {
                const response = await storesAPI.getStoreDebtsDetails(storeId);
                setData(response.data);
            } catch (error) {
                console.error('Failed to fetch store details:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDetails();
    }, [storeId]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-muted-foreground">
                <Loader2 className="w-12 h-12 animate-spin mb-4 text-primary" />
                <p className="text-lg">جاري تحميل تفاصيل المتجر...</p>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-muted-foreground">
                <StoreIcon className="w-20 h-20 mb-4 opacity-20" />
                <p className="text-xl font-bold">المتجر غير موجود</p>
                <Button variant="link" onClick={() => navigate('/dashboard/stores')}>العودة لقائمة المتاجر</Button>
            </div>
        );
    }

    const { store, summary, ledger } = data;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const getEntryIcon = (type: string) => {
        switch (type) {
            case 'sale': return <ArrowUpRight className="w-4 h-4 text-primary" />;
            case 'payment': return <CreditCard className="w-4 h-4 text-emerald-500" />;
            case 'return': return <RotateCcw className="w-4 h-4 text-amber-500" />;
            default: return <FileText className="w-4 h-4" />;
        }
    };

    const getEntryLabel = (type: string) => {
        switch (type) {
            case 'sale': return 'فاتورة مبيعات';
            case 'payment': return 'إيصال قبض';
            case 'return': return 'مرجوعات';
            default: return 'حركة';
        }
    };

    return (
        <div className="container mx-auto p-4 md:p-8 space-y-8 pb-20">
            <PageHeader
                title={store.name}
                subtitle="عرض التفاصيل وسجل الحركات المالية"
                icon={StoreIcon}
                onBack={() => navigate('/dashboard/stores')}
            />

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
                {/* Ledger Section - Moved to Right (First in RTL) */}
                <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6 order-2 lg:order-1">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <RefreshCcw className="w-6 h-6 text-primary" />
                            <h2 className="text-2xl font-black">سجل الحركات المالية</h2>
                        </div>
                        <p className="text-sm text-muted-foreground">آخر {ledger.length} حركة</p>
                    </div>

                    <div className="space-y-4">
                        {ledger.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground bg-card/40 rounded-[2rem] border border-dashed border-border/50">
                                <FileText className="w-16 h-16 mb-4 opacity-10" />
                                <p>لا توجد حركات مسجلة لهذا المتجر بعد</p>
                            </div>
                        ) : (
                            ledger.map((entry) => (
                                <motion.div
                                    key={entry.id}
                                    whileHover={{ x: -10 }}
                                    className="relative p-4 sm:p-6 rounded-[1.5rem] border border-border/50 bg-card/40 backdrop-blur-sm transition-all hover:border-primary/50 group"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="flex items-start sm:items-center gap-4 sm:gap-5">
                                            <div className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl shrink-0 ${entry.entry_type === 'sale' ? 'bg-primary/10' :
                                                entry.entry_type === 'payment' ? 'bg-emerald-500/10' : 'bg-amber-500/10'
                                                }`}>
                                                {getEntryIcon(entry.entry_type)}
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                                    <span className="font-bold text-base sm:text-lg truncate">{getEntryLabel(entry.entry_type)}</span>
                                                    <span className="text-[10px] sm:text-xs text-muted-foreground px-2 py-0.5 rounded-full bg-accent/50 border border-border/50 whitespace-nowrap">
                                                        #{entry.sale_invoice_number || entry.payment_receipt_number || entry.return_number}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-[10px] sm:text-xs text-muted-foreground">
                                                    <span className="flex items-center gap-1.5">
                                                        <Calendar className="w-3 h-3 shrink-0" />
                                                        {format(new Date(entry.created_at), 'PPP', { locale: ar })}
                                                    </span>
                                                    <span className="flex items-center gap-1.5">
                                                        <User className="w-3 h-3 shrink-0" />
                                                        بواسطة: {entry.marketer_name}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 mt-1 sm:mt-0 border-border/30">
                                            <p className="text-xs sm:hidden text-muted-foreground font-bold uppercase tracking-widest">المبلغ الصافي</p>
                                            <div className="text-left sm:text-left">
                                                <p className={`text-xl sm:text-2xl font-black ${entry.amount > 0 ? 'text-primary' :
                                                    entry.entry_type === 'payment' ? 'text-emerald-500' : 'text-amber-500'
                                                    }`} dir="ltr">
                                                    {entry.amount > 0 ? '+' : ''}{formatAmount(entry.amount)}
                                                </p>
                                                <p className="hidden sm:block text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-1">المبلغ الصافي</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </motion.div>

                {/* Info & Summary Sidebar - Moved to Left (Second in RTL) */}
                <motion.div variants={itemVariants} className="lg:col-span-1 space-y-6 order-1 lg:order-2">
                    {/* Store Info Card - Updated Design */}
                    <Card className="rounded-[2rem] border-border/50 bg-primary/5 p-8 relative overflow-hidden group">
                        <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl transition-all group-hover:bg-primary/20" />
                        <div className="relative space-y-8">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <StoreIcon className="w-6 h-6 text-primary" />
                                    <h3 className="text-xl font-bold">بيانات المتجر</h3>
                                </div>
                                <Badge
                                    className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-tight ${store.is_active
                                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                        : "bg-red-500/10 text-red-600 border-red-500/20"
                                        }`}
                                    variant="outline"
                                >
                                    {store.is_active ? 'نشط' : 'معطل'}
                                </Badge>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center gap-4 transition-colors">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-sm font-bold text-muted-foreground/70 uppercase tracking-tight">المالك المسؤول</p>
                                        <p className="text-sm font-semibold text-foreground">{store.owner_name || 'غير مسجل'}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 transition-colors">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-sm font-bold text-muted-foreground/70 uppercase tracking-tight">رقم التواصل</p>
                                        <a href={`tel:${store.phone}`} className="text-sm font-semibold text-foreground hover:text-primary transition-colors inline-block" dir="ltr">
                                            {store.phone}
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 transition-colors">
                                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-sm font-bold text-muted-foreground/70 uppercase tracking-tight">الموقع والعنوان</p>
                                        <p className="text-sm font-semibold text-foreground leading-snug">{store.location} {store.address && `- ${store.address}`}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Quick Summary Card */}
                    <Card className="rounded-[2rem] border-border/50 bg-primary/5 p-8 relative overflow-hidden group">
                        <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl transition-all group-hover:bg-primary/20" />
                        <div className="relative space-y-6">
                            <div className="flex items-center gap-3 mb-2">
                                <Wallet className="w-6 h-6 text-primary" />
                                <h3 className="text-xl font-bold">الملخص المالي</h3>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground text-sm">إجمالي المبيعات</span>
                                    <span className="font-bold">{formatAmount(summary.total_sales)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground text-sm">إجمالي المدفوعات</span>
                                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatAmount(Math.abs(summary.total_payments))}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm border-b border-border/50 pb-4">
                                    <span className="text-muted-foreground">إجمالي المرجوعات</span>
                                    <span className="font-bold text-amber-600 dark:text-amber-400">{formatAmount(Math.abs(summary.total_returns))}</span>
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                    <span className="text-lg font-bold">الرصيد المتبقي</span>
                                    <span className="text-2xl font-black text-primary">{formatAmount(summary.remaining_debt)}</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </motion.div>
        </div >
    );
};
