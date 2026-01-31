import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  UserPlus, 
  Search, 
  Shield, 
  Mail, 
  Phone, 
  MoreVertical,
  Edit,
  Trash2,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const mockUsers = [
  { id: '1', name: 'أحمد محمد', username: 'ahmed_m', role: 'marketer', email: 'ahmed@taqnia.com', status: 'active', phone: '0912345678' },
  { id: '2', name: 'سالم علي', username: 'salem_a', role: 'keeper', email: 'salem@taqnia.com', status: 'active', phone: '0922345678' },
  { id: '3', name: 'خالد عمر', username: 'khaled_o', role: 'admin', email: 'khaled@taqnia.com', status: 'active', phone: '0911111111' },
];

export const UserManagementPage = () => {
  const [users] = useState(mockUsers);

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">إدارة المستخدمين</h1>
          <p className="text-muted-foreground">إضافة وإدارة أدوار المستخدمين في النظام</p>
        </div>
        <Button className="gradient-btn">
          <UserPlus className="w-4 h-4 ml-2" />
          مستخدم جديد
        </Button>
      </header>

      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="بحث عن مستخدم..." className="pr-10" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            key={user.id}
            className="glass-card p-6 relative group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <Badge variant="outline" className={
                user.role === 'admin' ? 'bg-purple-500/10 text-purple-500' :
                user.role === 'keeper' ? 'bg-blue-500/10 text-blue-500' :
                'bg-green-500/10 text-green-500'
              }>
                {user.role}
              </Badge>
            </div>

            <div className="space-y-3">
              <div>
                <h3 className="font-bold text-lg">{user.name}</h3>
                <p className="text-sm text-muted-foreground">@{user.username}</p>
              </div>

              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{user.phone}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-xs font-medium text-green-600">نشط</span>
              </div>
            </div>

            <div className="absolute top-6 left-6 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button size="icon" variant="ghost" className="h-8 w-8">
                <Edit className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
