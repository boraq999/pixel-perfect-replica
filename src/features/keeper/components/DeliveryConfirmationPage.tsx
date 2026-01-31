import { useState } from 'react';
import { 
  ClipboardCheck, 
  Camera, 
  Search, 
  ChevronRight, 
  FileText,
  UploadCloud,
  Package
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

// Mock data for approved marketer requests awaiting documentation
const mockDeliveries = [
  { 
    id: 1, 
    invoice_number: 'REQ-2024-002', 
    marketer_name: 'سارة علي', 
    status: 'approved', 
    created_at: '2024-03-20 09:15',
    items: [
      { product: 'معجون طماطم 400 جرام', qty: 100 },
      { product: 'زيت زيتون 1 لتر', qty: 10 },
    ]
  },
  { 
    id: 2, 
    invoice_number: 'REQ-2024-003', 
    marketer_name: 'أحمد حسين', 
    status: 'approved', 
    created_at: '2024-03-21 11:00',
    items: [
      { product: 'أرز بسمتي 5 كجم', qty: 50 },
    ]
  },
];

export const KeeperDeliveryConfirmationPage = () => {
  const [selectedRequest, setSelectedRequest] = useState<typeof mockDeliveries[0] | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleDocument = () => {
    if (selectedRequest) {
      setUploading(true);
      setTimeout(() => {
        toast.success(`تم توثيق استلام الطلب رقم ${selectedRequest.invoice_number} بنجاح.`);
        setSelectedRequest(null);
        setUploading(false);
        // In a real app, you'd update the request status via API and refresh data
      }, 1500);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-right">توثيق استلام البضاعة</h1>
          <p className="text-muted-foreground text-sm text-right">اعتماد استلام المسوق للبضاعة ورفع الفواتير الموقعة</p>
        </div>
      </div>

      {!selectedRequest ? (
        <Card className="glass-card">
          <CardHeader className="border-b bg-muted/30">
            <div className="relative max-w-md">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input className="pr-10" placeholder="بحث برقم الفاتورة أو اسم المسوق..." />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {mockDeliveries.length > 0 ? (mockDeliveries.map((request) => (
                <div key={request.id} className="flex flex-col md:flex-row items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <ClipboardCheck className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-right">
                      <h3 className="font-bold">{request.invoice_number}</h3>
                      <p className="text-sm text-muted-foreground">{request.marketer_name} • {request.created_at}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4 md:mt-0">
                    <Button size="sm" variant="outline" onClick={() => setSelectedRequest(request)}>
                      <Camera className="w-4 h-4 ml-2" /> توثيق
                    </Button>
                    <Button size="icon" variant="ghost">
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              ))) : (
                <div className="p-8 text-center text-muted-foreground">
                  لا توجد طلبات بانتظار التوثيق حالياً.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="glass-card">
          <CardHeader className="border-b bg-muted/30">
            <CardTitle className="text-lg flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-primary" /> توثيق الطلب: {selectedRequest.invoice_number}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">المسوق: <span className="font-medium text-foreground">{selectedRequest.marketer_name}</span></p>
              <p className="text-sm text-muted-foreground">تاريخ الطلب: <span className="font-medium text-foreground">{selectedRequest.created_at}</span></p>
            </div>

            <div className="space-y-2 border-t pt-4">
              <h3 className="font-bold flex items-center gap-2 text-right"><Package className="w-4 h-4"/> الأصناف المطلوبة</h3>
              <div className="divide-y border rounded-xl">
                {selectedRequest.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 text-sm">
                    <span>{item.product}</span>
                    <Badge variant="secondary">الكمية: {item.qty}</Badge>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-6 space-y-4">
              <Label htmlFor="signed-image">رفع صورة الفاتورة الموقعة</Label>
              <div className="border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-2 hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-all">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-sm">اسحب وأفلت الصورة هنا أو <span className="text-primary">اضغط للرفع</span></p>
                  <p className="text-xs text-muted-foreground">PNG, JPG يصل إلى 5MB</p>
                </div>
                <Input id="signed-image" type="file" className="sr-only" />
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t pt-6">
              <Button variant="outline" onClick={() => setSelectedRequest(null)} disabled={uploading}>
                إلغاء
              </Button>
              <Button onClick={handleDocument} disabled={uploading}>
                {uploading ? (
                  <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                ) : (
                  <FileText className="w-4 h-4 ml-2" />
                )}
                توثيق الطلب
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const Loader2 = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 12a9 9 0 0 1-9 9 9 9 0 0 1-9-9zm-3 0a6 6 0 0 0-6-6v6h6z"/></svg>
);
