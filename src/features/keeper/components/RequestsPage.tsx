import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ClipboardList, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search,
  ChevronRight,
  Package,
  FileText,
  Camera
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

// Mock data based on database structure
const mockRequests = [
  {
    id: 1,
    invoice_number: 'REQ-2024-001',
    marketer_name: 'أحمد محمد',
    status: 'pending',
    created_at: '2024-03-20 10:30',
    items_count: 5,
  },
  {
    id: 2,
    invoice_number: 'REQ-2024-002',
    marketer_name: 'سارة علي',
    status: 'approved',
    created_at: '2024-03-20 09:15',
    items_count: 3,
  },
];

export const KeeperRequestsPage = () => {
  const [filter, setFilter] = useState('pending');

  const handleApprove = (id: number) => {
    toast.success('تمت الموافقة على الطلب مبدئياً');
  };

  const handleReject = (id: number) => {
    toast.error('تم رفض الطلب');
  };

  const handleDocument = (id: number) => {
    toast.info('يرجى رفع صورة الفاتورة الموقعة لإتمام التوثيق');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">طلبات المسوقين</h1>
          <p className="text-muted-foreground text-sm">متابعة واعتماد طلبات سحب البضاعة</p>
        </div>
        
        <div className="flex bg-muted p-1 rounded-lg">
          <button 
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-md text-sm transition-all ${filter === 'pending' ? 'bg-background shadow-sm' : ''}`}
          >
            قيد الانتظار
          </button>
          <button 
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 rounded-md text-sm transition-all ${filter === 'approved' ? 'bg-background shadow-sm' : ''}`}
          >
            بانتظار التوثيق
          </button>
          <button 
            onClick={() => setFilter('documented')}
            className={`px-4 py-2 rounded-md text-sm transition-all ${filter === 'documented' ? 'bg-background shadow-sm' : ''}`}
          >
            تم التوثيق
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {mockRequests.filter(r => filter === 'all' || r.status === filter).map((request) => (
          <motion.div
            key={request.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <ClipboardList className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-right">
                    <h3 className="font-bold">{request.invoice_number}</h3>
                    <p className="text-sm text-muted-foreground">{request.marketer_name} • {request.created_at}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-center md:text-right">
                    <p className="text-xs text-muted-foreground">عدد الأصناف</p>
                    <p className="font-medium">{request.items_count} صنف</p>
                  </div>
                  
                  <Badge variant={request.status === 'pending' ? 'outline' : 'secondary'} className="h-fit">
                    {request.status === 'pending' ? 'قيد الانتظار' : 'تمت الموافقة'}
                  </Badge>

                  <div className="flex gap-2">
                    {request.status === 'pending' && (
                      <>
                        <Button size="sm" variant="outline" className="text-destructive" onClick={() => handleReject(request.id)}>
                          <XCircle className="w-4 h-4 mr-2" /> رفض
                        </Button>
                        <Button size="sm" onClick={() => handleApprove(request.id)}>
                          <CheckCircle2 className="w-4 h-4 mr-2" /> موافقة
                        </Button>
                      </>
                    )}
                    {request.status === 'approved' && (
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700" onClick={() => handleDocument(request.id)}>
                        <Camera className="w-4 h-4 mr-2" /> توثيق الاستلام
                      </Button>
                    )}
                    <Button size="icon" variant="ghost">
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
