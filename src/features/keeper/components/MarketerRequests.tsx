import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ClipboardList, 
  Check, 
  X, 
  Search, 
  Filter, 
  Eye,
  ArrowRightLeft,
  User,
  Package,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

// Mock data based on prompt
const mockRequests = [
  {
    id: 'req-1',
    invoice_number: 'REQ-2024-001',
    marketer_name: 'أحمد محمد',
    status: 'pending',
    created_at: '2024-05-20T10:00:00Z',
    items: [
      { product_id: 'p1', name: 'عطر الفارس 100مل', quantity: 10 },
      { product_id: 'p2', name: 'بخور ملكي', quantity: 5 },
    ]
  },
  {
    id: 'req-2',
    invoice_number: 'REQ-2024-002',
    marketer_name: 'سارة علي',
    status: 'approved',
    created_at: '2024-05-19T14:30:00Z',
    items: [
      { product_id: 'p1', name: 'عطر الفارس 100مل', quantity: 20 },
    ]
  }
];

export const MarketerRequestsPage = () => {
  const [requests, setRequests] = useState(mockRequests);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAction = (id: string, action: 'approved' | 'rejected') => {
    setRequests(prev => prev.map(req => 
      req.id === id ? { ...req, status: action } : req
    ));
    toast.success(action === 'approved' ? 'تمت الموافقة على الطلب' : 'تم رفض الطلب');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">قيد الانتظار</Badge>;
      case 'approved': return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">تمت الموافقة</Badge>;
      case 'rejected': return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">مرفوض</Badge>;
      case 'documented': return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">تم التوثيق</Badge>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">طلبات المسوقين</h1>
        <p className="text-muted-foreground">إدارة واعتماد طلبات سحب البضاعة من قبل المسوقين</p>
      </header>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="بحث برقم الطلب أو اسم المسوق..." 
            className="pr-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 ml-2" />
          تصفية
        </Button>
      </div>

      <div className="grid gap-4">
        {requests.map((request) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={request.id}
            className="glass-card p-6 flex flex-col lg:flex-row justify-between gap-6"
          >
            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between lg:justify-start lg:gap-4">
                <span className="font-bold text-lg">{request.invoice_number}</span>
                {getStatusBadge(request.status)}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="w-4 h-4" />
                  <span>المسوق: <b>{request.marketer_name}</b></span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>بتاريخ: {new Date(request.created_at).toLocaleDateString('ar-LY')}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Package className="w-4 h-4" />
                  <span>{request.items.length} أصناف مطلوب</span>
                </div>
              </div>

              <div className="bg-accent/30 rounded-lg p-3">
                <p className="text-xs font-medium mb-2 opacity-70">الأصناف المطلوبة:</p>
                <div className="flex flex-wrap gap-2">
                  {request.items.map((item, idx) => (
                    <span key={idx} className="bg-background px-3 py-1 rounded-md text-sm border border-border">
                      {item.name} <b className="text-primary mr-1">{item.quantity}</b>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 lg:flex-col lg:justify-center border-t lg:border-t-0 lg:border-r border-border pt-4 lg:pt-0 lg:pr-6">
              {request.status === 'pending' ? (
                <>
                  <Button 
                    className="flex-1 lg:w-full bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => handleAction(request.id, 'approved')}
                  >
                    <Check className="w-4 h-4 ml-2" />
                    موافقة
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 lg:w-full text-destructive hover:bg-destructive/10 border-destructive/20"
                    onClick={() => handleAction(request.id, 'rejected')}
                  >
                    <X className="w-4 h-4 ml-2" />
                    رفض
                  </Button>
                </>
              ) : (
                <Button variant="ghost" className="w-full">
                  <Eye className="w-4 h-4 ml-2" />
                  عرض التفاصيل
                </Button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
