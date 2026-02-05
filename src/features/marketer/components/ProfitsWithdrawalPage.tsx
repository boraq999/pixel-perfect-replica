// صفحة: الأرباح والسحوبات (المسوق الأفضل)
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Wallet,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  FileText,
  AlertCircle,
  ChevronRight,
  Plus,
  Search,
  History,
  Info
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useCurrency } from '@/store/currencyStore';
import { StatCard, SearchBar } from './shared';

interface WithdrawalRequest {
  id: string;
  request_number: string;
  request_date: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
  admin_notes?: string;
  approved_date?: string;
  approved_by?: string;
}

interface ProfitDetails {
  total_commissions: number;
  total_withdrawals: number;
  available_balance: number;
  pending_withdrawals: number;
}

const mockProfitDetails: ProfitDetails = {
  total_commissions: 25000,
  total_withdrawals: 16250,
  available_balance: 8750,
  pending_withdrawals: 2000,
};

const mockWithdrawals: WithdrawalRequest[] = [
  {
    id: '1',
    request_number: 'WD-2024-001',
    request_date: '2024-01-15',
    amount: 5000,
    status: 'approved',
    notes: 'سحب الأرباح الشهرية',
    admin_notes: 'تمت الموافقة',
    approved_date: '2024-01-16',
    approved_by: 'أحمد المحسن',
  },
  {
    id: '2',
    request_number: 'WD-2024-002',
    request_date: '2024-01-20',
    amount: 3000,
    status: 'approved',
    notes: 'سحب جزئي',
    approved_date: '2024-01-21',
    approved_by: 'محمد علي',
  },
  {
    id: '3',
    request_number: 'WD-2024-003',
    request_date: '2024-01-25',
    amount: 2000,
    status: 'pending',
    notes: 'سحب أرباح',
  },
  {
    id: '4',
    request_number: 'WD-2024-004',
    request_date: '2024-01-10',
    amount: 1500,
    status: 'rejected',
    notes: 'طلب سحب',
    admin_notes: 'الرصيد غير كافٍ',
  },
];

const getStatusIcon = (status: WithdrawalRequest['status']) => {
  switch (status) {
    case 'pending':
      return <Clock className="h-4 w-4" />;
    case 'approved':
      return <CheckCircle className="h-4 w-4" />;
    case 'rejected':
      return <XCircle className="h-4 w-4" />;
  }
};

const getStatusColor = (status: WithdrawalRequest['status']) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    case 'approved':
      return 'bg-green-500/10 text-green-500 border-green-500/20';
    case 'rejected':
      return 'bg-red-500/10 text-red-500 border-red-500/20';
  }
};

const getStatusText = (status: WithdrawalRequest['status']) => {
  switch (status) {
    case 'pending':
      return 'قيد المراجعة';
    case 'approved':
      return 'تمت الموافقة';
    case 'rejected':
      return 'مرفوض';
  }
};

export const ProfitsWithdrawalPage = () => {
  const [withdrawals] = useState<WithdrawalRequest[]>(mockWithdrawals);
  const [profitDetails] = useState<ProfitDetails>(mockProfitDetails);
  const [isNewWithdrawalOpen, setIsNewWithdrawalOpen] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState<string>('');
  const [withdrawalNotes, setWithdrawalNotes] = useState<string>('');
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<WithdrawalRequest | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { formatAmount } = useCurrency();

  // Stats data
  const statsData = useMemo(() => [
    { title: 'إجمالي الأرباح', value: formatAmount(profitDetails.total_commissions), icon: TrendingUp, color: 'text-green-500', bgColor: 'bg-green-500/10' },
    { title: 'إجمالي المسحوب', value: formatAmount(profitDetails.total_withdrawals), icon: ArrowUpRight, color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
    { title: 'الرصيد المتاح للسحب', value: formatAmount(profitDetails.available_balance), icon: DollarSign, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
  ], [profitDetails, formatAmount]);

  // Filter withdrawals
  const filteredWithdrawals = useMemo(() => {
    if (!searchQuery.trim()) return withdrawals;
    return withdrawals.filter(w =>
      w.request_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.notes?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [withdrawals, searchQuery]);

  const handleNewWithdrawal = () => {
    console.log('New withdrawal:', { amount: withdrawalAmount, notes: withdrawalNotes });
    setIsNewWithdrawalOpen(false);
    setWithdrawalAmount('');
    setWithdrawalNotes('');
  };

  const canWithdraw = parseFloat(withdrawalAmount) > 0 &&
    parseFloat(withdrawalAmount) <= profitDetails.available_balance;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/95 to-primary p-6 text-white shadow-2xl md:p-8"
      >
        <div className="absolute top-0 right-0 h-full w-1/2 bg-[url('/pattern.svg')] opacity-10 mix-blend-overlay" />
        <div className="relative z-10 flex items-center gap-3">
          <div className="rounded-2xl bg-white/20 p-2 backdrop-blur-md md:p-3">
            <Wallet className="h-6 w-6 md:h-8 md:w-8" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight md:text-4xl">إدارة الأرباح والسحوبات</h1>
            <p className="mt-0.5 text-xs md:mt-1 md:text-base text-primary-foreground/80">عرض وإدارة أرباحك وطلبات السحب</p>
          </div>
        </div>
      </motion.div>

      {/* Profit Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="hide-scrollbar flex gap-4 overflow-x-auto pb-2 -mx-2 px-2"
      >
        {statsData.map((stat, i) => (
          <div key={i} className="min-w-[200px] flex-shrink-0">
            <StatCard {...stat} delay={i * 0.1} />
          </div>
        ))}
      </motion.div>

      {/* Process Flow Info */}
      <Card className="bg-gradient-to-br from-green-500/5 via-blue-500/5 to-purple-500/5 border-green-500/20">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            خطوات عملية سحب الأرباح
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500/10 text-green-500 font-bold text-sm flex-shrink-0">
                1
              </div>
              <div>
                <p className="font-semibold text-sm">طلب السحب</p>
                <p className="text-xs text-muted-foreground">المسوق يقوم بطلب سحب أرباحه</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/10 text-blue-500 font-bold text-sm flex-shrink-0">
                2
              </div>
              <div>
                <p className="font-semibold text-sm">المراجعة</p>
                <p className="text-xs text-muted-foreground">المدير يراجع الطلب</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-500/10 text-purple-500 font-bold text-sm flex-shrink-0">
                3
              </div>
              <div>
                <p className="font-semibold text-sm">الموافقة</p>
                <p className="text-xs text-muted-foreground">الموافقة أو الرفض</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-500/10 text-orange-500 font-bold text-sm flex-shrink-0">
                4
              </div>
              <div>
                <p className="font-semibold text-sm">التحويل</p>
                <p className="text-xs text-muted-foreground">تحويل المبلغ للمسوق</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* New Withdrawal Button */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-lg font-bold mb-1">هل تريد سحب أرباحك؟</h3>
              <p className="text-sm text-muted-foreground">
                الرصيد المتاح للسحب: <span className="font-bold text-primary">{formatAmount(profitDetails.available_balance)}</span>
              </p>
            </div>
            <Dialog open={isNewWithdrawalOpen} onOpenChange={setIsNewWithdrawalOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="gap-2 w-full md:w-auto">
                  <Wallet className="h-5 w-5" />
                  طلب سحب جديد
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-2xl">طلب سحب أرباح</DialogTitle>
                  <DialogDescription>
                    أدخل المبلغ الذي تريد سحبه من أرباحك المتاحة
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      الرصيد المتاح للسحب: <span className="font-bold">{formatAmount(profitDetails.available_balance)}</span>
                    </AlertDescription>
                  </Alert>

                  <div>
                    <Label>المبلغ المطلوب سحبه *</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={withdrawalAmount}
                      onChange={(e) => setWithdrawalAmount(e.target.value)}
                      className="text-lg font-bold"
                    />
                    {parseFloat(withdrawalAmount) > profitDetails.available_balance && (
                      <p className="text-sm text-red-500 mt-1">
                        المبلغ المطلوب أكبر من الرصيد المتاح
                      </p>
                    )}
                  </div>

                  <div>
                    <Label>ملاحظات (اختياري)</Label>
                    <Input
                      placeholder="أي ملاحظات إضافية..."
                      value={withdrawalNotes}
                      onChange={(e) => setWithdrawalNotes(e.target.value)}
                    />
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">المبلغ المطلوب:</span>
                        <span className="font-bold">{formatAmount(parseFloat(withdrawalAmount || '0'))}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">الرصيد المتبقي:</span>
                        <span className="font-bold">
                          {formatAmount(profitDetails.available_balance - parseFloat(withdrawalAmount || '0'))}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsNewWithdrawalOpen(false)}>
                    إلغاء
                  </Button>
                  <Button onClick={handleNewWithdrawal} disabled={!canWithdraw}>
                    إرسال الطلب
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Area */}
      <div className="lg:grid lg:grid-cols-12 lg:gap-8">
        {/* Left Column: Withdrawals History */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="border-none shadow-md overflow-hidden">
            <CardHeader className="bg-muted/30 p-4 md:pb-0">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between pb-4">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    سجل طلبات السحب
                  </CardTitle>
                  <CardDescription>جميع طلبات السحب السابقة والحالية</CardDescription>
                </div>
                <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="بحث عن طلب..."
                  className="w-full sm:max-w-xs"
                />
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="h-12 w-full justify-start gap-2 bg-transparent p-0 border-b rounded-none overflow-x-auto hide-scrollbar flex-nowrap">
                  {[
                    { id: 'all', label: 'كل الطلبات' },
                    { id: 'pending', label: 'قيد الانتظار' },
                    { id: 'approved', label: 'معتمد' },
                    { id: 'rejected', label: 'مرفوض' },
                    { id: 'cancelled', label: 'ملغي' },
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

                <TabsContent value="all" className="space-y-4 mt-6">
                  {filteredWithdrawals.map((withdrawal) => (
                    <motion.div
                      key={withdrawal.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      onClick={() => setSelectedWithdrawal(withdrawal)}
                      className="group cursor-pointer rounded-2xl border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-lg active:scale-[0.98] md:p-5"
                    >
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-4 md:gap-5">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl md:h-12 md:w-12 md:rounded-2xl bg-primary/10 transition-colors group-hover:scale-110">
                            <Wallet className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 text-xs">
                              <span className="flex items-center gap-1 text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                {withdrawal.request_date}
                              </span>
                              <div className={`flex h-6 items-center gap-1 rounded-full px-2 md:hidden ${getStatusColor(withdrawal.status)} text-[10px] font-bold`}>
                                {getStatusIcon(withdrawal.status)}
                                {getStatusText(withdrawal.status)}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-center md:justify-end md:gap-6">
                          <div className="text-center md:text-right">
                            <p className="text-[10px] font-medium text-muted-foreground">المبلغ</p>
                            <p className="text-base font-extrabold text-primary md:text-lg font-ar">{formatAmount(withdrawal.amount)}</p>
                            {withdrawal.approved_date && (
                              <p className="text-[10px] text-muted-foreground mt-1">
                                تمت الموافقة: {withdrawal.approved_date}
                              </p>
                            )}
                          </div>
                          <div className="hidden md:flex items-center gap-3">
                            <div className={`flex h-7 items-center gap-1 rounded-full px-3 ${getStatusColor(withdrawal.status)} text-[10px] font-bold md:h-8 md:px-4 md:text-xs`}>
                              {getStatusIcon(withdrawal.status)}
                              {getStatusText(withdrawal.status)}
                            </div>
                            <div className="rounded-full p-1.5 transition-colors group-hover:bg-accent md:p-2">
                              <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 md:h-5 md:w-5" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </TabsContent>

                {['pending', 'approved', 'rejected', 'cancelled'].map((status) => (
                  <TabsContent key={status} value={status} className="space-y-4 mt-6">
                    {filteredWithdrawals
                      .filter((w) => w.status === status)
                      .map((withdrawal) => (
                        <motion.div
                          key={withdrawal.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                          onClick={() => setSelectedWithdrawal(withdrawal)}
                          className="group cursor-pointer rounded-2xl border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-lg active:scale-[0.98] md:p-5"
                        >
                          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <div className="flex items-center gap-4 md:gap-5">
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl md:h-12 md:w-12 md:rounded-2xl bg-primary/10 transition-colors group-hover:scale-110">
                                <Wallet className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 text-xs">
                                  <span className="flex items-center gap-1 text-muted-foreground">
                                    <Calendar className="h-3 w-3" />
                                    {withdrawal.request_date}
                                  </span>
                                  <div className={`flex h-6 items-center gap-1 rounded-full px-2 md:hidden ${getStatusColor(withdrawal.status)} text-[10px] font-bold`}>
                                    {getStatusIcon(withdrawal.status)}
                                    {getStatusText(withdrawal.status)}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-center md:justify-end md:gap-6">
                              <div className="text-center md:text-right">
                                <p className="text-[10px] font-medium text-muted-foreground">المبلغ</p>
                                <p className="text-base font-extrabold text-primary md:text-lg font-ar">{formatAmount(withdrawal.amount)}</p>
                                {withdrawal.approved_date && (
                                  <p className="text-[10px] text-muted-foreground mt-1">
                                    تمت الموافقة: {withdrawal.approved_date}
                                  </p>
                                )}
                              </div>
                              <div className="hidden md:flex items-center gap-3">
                                <div className={`flex h-7 items-center gap-1 rounded-full px-3 ${getStatusColor(withdrawal.status)} text-[10px] font-bold md:h-8 md:px-4 md:text-xs`}>
                                  {getStatusIcon(withdrawal.status)}
                                  {getStatusText(withdrawal.status)}
                                </div>
                                <div className="rounded-full p-1.5 transition-colors group-hover:bg-accent md:p-2">
                                  <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 md:h-5 md:w-5" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Mobile: Process & Help Sections (Stacked) */}
        <div className="mt-8 space-y-6 lg:hidden">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-none shadow-md">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <History className="h-4 w-4 text-primary" />
                  دورة حياة طلب السحب
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="flex flex-col gap-4">
                  {[
                    { title: 'طلب', icon: Plus, color: 'blue' },
                    { title: 'مراجعة', icon: Search, color: 'amber' },
                    { title: 'اعتماد', icon: CheckCircle, color: 'emerald' },
                    { title: 'تحويل', icon: Wallet, color: 'indigo' },
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
                  هل واجهت مشكلة؟ تواصل مع إدارة المالية مباشرة.
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
                { title: 'طلب السحب', desc: 'تحديد المبلغ المطلوب سحبه من الأرباح المتاحة', icon: Plus, color: 'blue' },
                { title: 'مراجعة الطلب', desc: 'يتم مراجعة الطلب والتأكد من صحة البيانات', icon: Search, color: 'amber' },
                { title: 'الموافقة', desc: 'اعتماد الطلب من قبل الإدارة المالية', icon: CheckCircle, color: 'emerald' },
                { title: 'التحويل', desc: 'تحويل المبلغ إلى حسابك البنكي المسجل', icon: Wallet, color: 'indigo' },
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
                إذا كان لديك أي استفسار بخصوص طلبات السحب أو واجهت مشكلة في التحويل، يمكنك التواصل مباشرة مع الإدارة المالية.
              </p>
              <Button variant="outline" className="w-full rounded-xl border-indigo-200 bg-white/50 text-indigo-700 hover:bg-white hover:text-indigo-800">
                تواصل مع الدعم
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Withdrawal Details Dialog */}
      <Dialog open={!!selectedWithdrawal} onOpenChange={() => setSelectedWithdrawal(null)}>
        <DialogContent className="max-w-2xl [&>button]:bg-muted/80 [&>button]:hover:bg-muted [&>button]:rounded-full [&>button]:h-8 [&>button]:w-8 [&>button]:flex [&>button]:items-center [&>button]:justify-center">
          {selectedWithdrawal && (
            <div className="space-y-6">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-2xl">
                  <Wallet className="w-6 h-6 text-primary" />
                  تفاصيل طلب السحب
                </DialogTitle>
              </DialogHeader>

              {/* Status and Date Card */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 bg-muted/30 rounded-2xl border">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-primary/10">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">تاريخ الطلب</p>
                      <p className="font-bold text-sm">{selectedWithdrawal.request_date}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-primary/10">
                      {getStatusIcon(selectedWithdrawal.status)}
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">الحالة</p>
                      <Badge className={`${getStatusColor(selectedWithdrawal.status)} border-none px-3 py-1 text-xs font-bold`}>
                        {getStatusText(selectedWithdrawal.status)}
                      </Badge>
                    </div>
                  </div>
                </div>
                {selectedWithdrawal.approved_by && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-green-500/10">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">اعتمد بواسطة</p>
                        <p className="font-bold text-sm text-green-700">{selectedWithdrawal.approved_by}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Amount Card */}
              <div className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl border border-primary/20 text-center">
                <p className="text-sm text-muted-foreground mb-2">المبلغ المطلوب</p>
                <p className="text-4xl font-black text-primary">{formatAmount(selectedWithdrawal.amount)}</p>
              </div>

              {/* Additional Info */}
              {selectedWithdrawal.status === 'approved' && selectedWithdrawal.approved_date && (
                <div className="p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-xs text-green-700 font-bold">تمت الموافقة</p>
                      <p className="text-sm text-green-800 font-medium">{selectedWithdrawal.approved_date}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter className="gap-2">
            {selectedWithdrawal?.status === 'pending' && (
              <Button 
                variant="destructive" 
                onClick={() => {
                  // Handle cancel logic here
                  console.log('Cancel withdrawal:', selectedWithdrawal.id);
                  setSelectedWithdrawal(null);
                }} 
                className="flex-1"
              >
                <XCircle className="h-4 w-4 ml-2" />
                إلغاء الطلب
              </Button>
            )}
            <Button 
              onClick={() => setSelectedWithdrawal(null)} 
              className="flex-1 bg-muted hover:bg-muted/80 border-2 border-border"
            >
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mobile Floating Action Button (FAB) */}
      <motion.div
        className="fixed bottom-6 right-6 z-50 md:hidden"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.5 }}
      >
        <Button
          onClick={() => setIsNewWithdrawalOpen(true)}
          size="icon"
          className="h-16 w-16 rounded-full bg-primary text-white shadow-2xl shadow-primary/40 p-0 active:scale-90 transition-transform"
        >
          <Wallet className="h-16 w-16" />
        </Button>
      </motion.div>
    </motion.div>
  );
};
