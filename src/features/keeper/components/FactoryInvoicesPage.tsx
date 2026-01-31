import { useState } from 'react';
import { 
  FilePlus, 
  FileText, 
  Plus, 
  Trash2, 
  Save, 
  Image as ImageIcon,
  CheckCircle2,
  Package
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export const FactoryInvoicesPage = () => {
  const [items, setItems] = useState([{ id: 1, product: '', qty: 0, cost: 0, expiry: '' }]);

  const addItem = () => {
    setItems([...items, { id: Date.now(), product: '', qty: 0, cost: 0, expiry: '' }]);
  };

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleSave = () => {
    toast.success('تم حفظ فاتورة المصنع وتحديث المخزن الرئيسي');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-right">فواتير المصنع الواردة</h1>
          <p className="text-muted-foreground text-sm text-right">إضافة بضاعة جديدة للمخزن الرئيسي (Factory Invoices)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Invoice Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="glass-card">
            <CardHeader className="border-b bg-muted/30">
              <CardTitle className="text-lg flex items-center gap-2">
                <FilePlus className="w-5 h-5 text-primary" /> تفاصيل الفاتورة
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="space-y-2">
                  <Label>رقم الفاتورة (من المصنع)</Label>
                  <Input placeholder="مثلاً: FAC-2024-001" />
                </div>
                <div className="space-y-2">
                  <Label>تاريخ الاستلام</Label>
                  <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold flex items-center gap-2">
                    <Package className="w-4 h-4" /> قائمة الأصناف
                  </h3>
                  <Button onClick={addItem} variant="outline" size="sm" className="h-8">
                    <Plus className="w-4 h-4 ml-1" /> إضافة صنف
                  </Button>
                </div>

                <div className="border rounded-xl overflow-hidden">
                  <table className="w-full text-sm text-right">
                    <thead className="bg-muted text-muted-foreground">
                      <tr>
                        <th className="p-3">اسم المنتج / الصنف</th>
                        <th className="p-3">الكمية</th>
                        <th className="p-3">تكلفة الوحدة</th>
                        <th className="p-3">تاريخ الانتهاء</th>
                        <th className="p-3"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {items.map((item, index) => (
                        <tr key={item.id} className="hover:bg-muted/30">
                          <td className="p-2">
                            <Input placeholder="اسم المنتج" variant="ghost" className="h-8" />
                          </td>
                          <td className="p-2 w-24">
                            <Input type="number" placeholder="0" variant="ghost" className="h-8 text-center" />
                          </td>
                          <td className="p-2 w-32">
                            <Input type="number" placeholder="0.00" variant="ghost" className="h-8 text-center" />
                          </td>
                          <td className="p-2 w-40">
                            <Input type="date" variant="ghost" className="h-8" />
                          </td>
                          <td className="p-2 w-10">
                            {items.length > 1 && (
                              <button onClick={() => removeItem(item.id)} className="text-destructive hover:scale-110 transition-transform">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Attachments & Summary */}
        <div className="space-y-6">
          <Card className="glass-card">
            <CardHeader className="border-b bg-muted/30">
              <CardTitle className="text-lg">توثيق الفاتورة</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-2 hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-all">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-sm">رفع صورة الفاتورة المختومة</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG تصل إلى 5MB</p>
                </div>
              </div>

              <div className="pt-4 space-y-2">
                <Label>ملاحظات إضافية</Label>
                <Input placeholder="أدخل أي ملاحظات هنا..." />
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-muted-foreground">إجمالي الفاتورة:</span>
                  <span className="text-xl font-bold text-primary">0.00 د.ل</span>
                </div>
                <Button className="w-full gradient-btn h-12" onClick={handleSave}>
                  <Save className="w-4 h-4 ml-2" /> حفظ واعتماد الفاتورة
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex gap-3">
             <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0" />
             <p className="text-xs text-amber-800">بمجرد الضغط على حفظ، سيتم إضافة الكميات مباشرة إلى المخزن الرئيسي (Main Stock) وتسجيل الحركة في السجلات.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
