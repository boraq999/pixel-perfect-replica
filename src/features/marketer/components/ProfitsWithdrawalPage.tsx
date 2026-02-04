import { useState } from 'react';
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
  AlertCircle
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

interface WithdrawalRequest {
  id: string;
  request_number: string;
  request_date: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
  admin_notes?: string;
  approved_date?: string;
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
  },
  {
    id: '2',
    request_number: 'WD-2024-002',
    request_date: '2024-01-20',
    amount: 3000,
    status: 'approved',
    notes: 'سحب جزئي',
    approved_date: '2024-01-21',
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
  const { formatAmount } = useCurrency();

  const handleNewWithdrawal = () => {
    // Handle new withdrawal request
    console.log('New withdrawal:', { amount: withdrawalAmount, notes: withdrawalNotes });
    setIsNewWithdrawalOpen(false);
    setWithdrawalAmount('');
    setWithdrawalNotes('');
  };

  const canWithdraw = parseFloat(withdrawalAmount) > 0 &&
    parseFloat(withdrawalAmount) <= profitDetails.available_balance;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Wallet className="h-8 w-8" />
            إدارة الأرباح والسحوبات
          </h1>
          <p className="text-muted-foreground mt-2">
            عرض وإدارة أرباحك وطلبات السحب
          </p>
        </div>
      </div>

      {/* Profit Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-green-500/20 bg-green-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              إجمالي العمولات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {formatAmount(profitDetails.total_commissions)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              جميع العمولات المكتسبة
            </p>
          </CardContent>
        </Card>

        <Card className="border-blue-500/20 bg-blue-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-blue-500" />
              الرصيد المتاح
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">
              {formatAmount(profitDetails.available_balance)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              المبلغ المتاح للسحب
            </p>
          </CardContent>
        </Card>

        <Card className="border-purple-500/20 bg-purple-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <ArrowUpRight className="h-4 w-4 text-purple-500" />
              إجمالي السحوبات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-500">
              {formatAmount(profitDetails.total_withdrawals)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              المبالغ المسحوبة
            </p>
          </CardContent>
        </Card>

        <Card className="border-yellow-500/20 bg-yellow-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-500" />
              سحوبات معلقة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">
              {formatAmount(profitDetails.pending_withdrawals)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              قيد المراجعة
            </p>
          </CardContent>
        </Card>
      </div>

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
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold mb-1">هل تريد سحب أرباحك؟</h3>
              <p className="text-sm text-muted-foreground">
                الرصيد المتاح للسحب: <span className="font-bold text-primary">{formatAmount(profitDetails.available_balance)}</span>
              </p>
            </div>
            <Dialog open={isNewWithdrawalOpen} onOpenChange={setIsNewWithdrawalOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="gap-2">
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

      {/* Withdrawals History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            سجل طلبات السحب
          </CardTitle>
          <CardDescription>جميع طلبات السحب السابقة والحالية</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">الكل</TabsTrigger>
              <TabsTrigger value="pending">قيد المراجعة</TabsTrigger>
              <TabsTrigger value="approved">موافق عليها</TabsTrigger>
              <TabsTrigger value="rejected">مرفوضة</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4 mt-6">
              {withdrawals.map((withdrawal) => (
                <Card
                  key={withdrawal.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedWithdrawal(withdrawal)}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <Wallet className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold">{withdrawal.request_number}</h3>
                          <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                            <Calendar className="h-3 w-3" />
                            {withdrawal.request_date}
                          </p>
                          {withdrawal.notes && (
                            <p className="text-sm text-muted-foreground mt-1">{withdrawal.notes}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-left">
                        <Badge className={`${getStatusColor(withdrawal.status)} mb-2`}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(withdrawal.status)}
                            {getStatusText(withdrawal.status)}
                          </span>
                        </Badge>
                        <p className="text-xl font-bold">{formatAmount(withdrawal.amount)}</p>
                        {withdrawal.approved_date && (
                          <p className="text-xs text-muted-foreground mt-1">
                            تمت الموافقة: {withdrawal.approved_date}
                          </p>
                        )}
                      </div>
                    </div>

                    {withdrawal.admin_notes && (
                      <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm">
                          <span className="font-semibold">ملاحظة الإدارة:</span> {withdrawal.admin_notes}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {['pending', 'approved', 'rejected'].map((status) => (
              <TabsContent key={status} value={status} className="space-y-4 mt-6">
                {withdrawals
                  .filter((w) => w.status === status)
                  .map((withdrawal) => (
                    <Card key={withdrawal.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-bold">{withdrawal.request_number}</h3>
                            <p className="text-sm text-muted-foreground">{withdrawal.request_date}</p>
                          </div>
                          <div>
                            <p className="text-xl font-bold">{formatAmount(withdrawal.amount)}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Withdrawal Details Dialog */}
      <Dialog open={!!selectedWithdrawal} onOpenChange={() => setSelectedWithdrawal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl">تفاصيل طلب السحب</DialogTitle>
            <DialogDescription>رقم الطلب: {selectedWithdrawal?.request_number}</DialogDescription>
          </DialogHeader>
          {selectedWithdrawal && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>تاريخ الطلب</Label>
                  <p className="text-sm font-medium mt-1">{selectedWithdrawal.request_date}</p>
                </div>
                <div>
                  <Label>الحالة</Label>
                  <Badge className={`${getStatusColor(selectedWithdrawal.status)} mt-1`}>
                    {getStatusText(selectedWithdrawal.status)}
                  </Badge>
                </div>
              </div>

              <div>
                <Label>المبلغ المطلوب</Label>
                <p className="text-2xl font-bold mt-1">{formatAmount(selectedWithdrawal.amount)}</p>
              </div>

              {selectedWithdrawal.notes && (
                <div>
                  <Label>ملاحظات الطلب</Label>
                  <p className="text-sm mt-1 p-3 bg-muted rounded">{selectedWithdrawal.notes}</p>
                </div>
              )}

              {selectedWithdrawal.admin_notes && (
                <div>
                  <Label>ملاحظة الإدارة</Label>
                  <p className="text-sm mt-1 p-3 bg-yellow-500/10 rounded border border-yellow-500/20">
                    {selectedWithdrawal.admin_notes}
                  </p>
                </div>
              )}

              {selectedWithdrawal.approved_date && (
                <div>
                  <Label>تاريخ الموافقة</Label>
                  <p className="text-sm font-medium mt-1">{selectedWithdrawal.approved_date}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedWithdrawal(null)}>
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
