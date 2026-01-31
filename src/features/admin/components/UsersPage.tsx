import { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  MoreVertical, 
  Shield, 
  Smartphone,
  CheckCircle2,
  XCircle,
  Percent
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const mockUsers = [
  { id: 1, name: 'أحمد محمد', username: 'ahmad', role: 'marketer', phone: '0912345678', commission: '5%', status: 'active' },
  { id: 2, name: 'محمد علي', username: 'moe', role: 'keeper', phone: '0922345678', commission: '-', status: 'active' },
  { id: 3, name: 'سارة خالد', username: 'sara', role: 'admin', phone: '0913345678', commission: '-', status: 'active' },
];

export const AdminUsersPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">إدارة المستخدمين</h1>
          <p className="text-muted-foreground text-sm">إضافة وتعديل صلاحيات الموظفين والمسوقين</p>
        </div>
        <Button className="gradient-btn">
          <UserPlus className="w-4 h-4 ml-2" /> إضافة مستخدم جديد
        </Button>
      </div>

      <Card className="glass-card overflow-hidden">
        <CardHeader className="border-b bg-muted/30">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input className="pr-10 bg-background" placeholder="بحث عن مستخدم..." />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">الاسم</TableHead>
                <TableHead className="text-right">اسم المستخدم</TableHead>
                <TableHead className="text-right">الدور</TableHead>
                <TableHead className="text-right">رقم الهاتف</TableHead>
                <TableHead className="text-right">نسبة العموله</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-left">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Shield className="w-3 h-3 text-primary" />
                      <span className="text-xs">{user.role === 'admin' ? 'مدير' : user.role === 'keeper' ? 'أمين مخزن' : 'مسوق'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs">{user.phone}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-blue-600 font-bold">
                       <Percent className="w-3 h-3" /> {user.commission}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
                      <CheckCircle2 className="w-3 h-3 ml-1" /> نشط
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
