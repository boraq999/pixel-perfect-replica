import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Bell, 
  Shield, 
  Palette,
  Smartphone,
  Save,
  Camera,
  Check,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';
import { ThemePalette } from '@/components/ThemePalette';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

interface SettingsSection {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
}

const sections: SettingsSection[] = [
  { id: 'profile', title: 'الملف الشخصي', icon: User },
  { id: 'appearance', title: 'المظهر والثيمات', icon: Palette },
  { id: 'notifications', title: 'الإشعارات', icon: Bell },
  { id: 'security', title: 'الأمان', icon: Shield },
];

export const SettingsPage = () => {
  const { user } = useAuthStore();
  const [activeSection, setActiveSection] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  
  // Profile settings
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '0501234567',
  });

  // Notification settings
  const [notifications, setNotifications] = useState({
    orders: true,
    warehouse: true,
    reports: false,
    marketing: true,
    sound: true,
  });

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast.success('تم حفظ الإعدادات بنجاح');
    setIsSaving(false);
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div className="space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-10 h-10 text-primary" />
                </div>
                <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <div>
                <h3 className="font-semibold">{profileData.name}</h3>
                <p className="text-sm text-muted-foreground">مسوّق</p>
              </div>
            </div>

            <Separator />

            {/* Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>الاسم الكامل</Label>
                <Input
                  value={profileData.name}
                  onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>البريد الإلكتروني</Label>
                <Input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                  dir="ltr"
                />
              </div>
              <div className="space-y-2">
                <Label>رقم الهاتف</Label>
                <Input
                  value={profileData.phone}
                  onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                  dir="ltr"
                />
              </div>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">اختر الثيم المناسب</h3>
              <p className="text-sm text-muted-foreground">
                اختر من بين 5 ثيمات مختلفة لتخصيص تجربتك. الثيم المتوهج يتميز بتأثيرات ضوئية خاصة.
              </p>
            </div>
            
            <ThemePalette />
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-accent/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Bell className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">إشعارات الطلبات</p>
                    <p className="text-sm text-muted-foreground">تلقي إشعارات عند وصول طلب جديد</p>
                  </div>
                </div>
                <Switch
                  checked={notifications.orders}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, orders: checked }))}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-accent/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
                    <Bell className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="font-medium">إشعارات المخزن</p>
                    <p className="text-sm text-muted-foreground">تنبيهات حول المخزون والحركات</p>
                  </div>
                </div>
                <Switch
                  checked={notifications.warehouse}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, warehouse: checked }))}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-accent/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-info/20 flex items-center justify-center">
                    <Bell className="w-5 h-5 text-info" />
                  </div>
                  <div>
                    <p className="font-medium">التقارير الدورية</p>
                    <p className="text-sm text-muted-foreground">استلام تقارير الأداء الأسبوعية</p>
                  </div>
                </div>
                <Switch
                  checked={notifications.reports}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, reports: checked }))}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-accent/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-warning/20 flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-warning" />
                  </div>
                  <div>
                    <p className="font-medium">صوت الإشعارات</p>
                    <p className="text-sm text-muted-foreground">تشغيل صوت عند وصول إشعار</p>
                  </div>
                </div>
                <Switch
                  checked={notifications.sound}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, sound: checked }))}
                />
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            {/* Change Password */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold">تغيير كلمة المرور</h3>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label>كلمة المرور الحالية</Label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <div className="space-y-2">
                  <Label>كلمة المرور الجديدة</Label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <div className="space-y-2">
                  <Label>تأكيد كلمة المرور الجديدة</Label>
                  <Input type="password" placeholder="••••••••" />
                </div>
              </div>
            </div>

            <Separator />

            {/* Two Factor Auth */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-accent/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="font-medium">المصادقة الثنائية</p>
                  <p className="text-sm text-muted-foreground">حماية إضافية لحسابك</p>
                </div>
              </div>
              <Button variant="outline" size="sm">تفعيل</Button>
            </div>

            {/* Sessions */}
            <div className="space-y-3">
              <h3 className="text-base font-semibold">الجلسات النشطة</h3>
              <div className="p-4 rounded-lg bg-accent/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Smartphone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">هذا الجهاز</p>
                      <p className="text-sm text-muted-foreground">Chrome • الرياض</p>
                    </div>
                  </div>
                  <span className="text-xs text-success bg-success/20 px-2 py-1 rounded">نشط الآن</span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold">الإعدادات</h1>
        <p className="text-muted-foreground">إدارة حسابك وتفضيلاتك</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <div className="stat-card p-2">
            <nav className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeSection === section.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  }`}
                >
                  <section.icon className="w-5 h-5" />
                  <span>{section.title}</span>
                </button>
              ))}
            </nav>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div variants={itemVariants} className="lg:col-span-3">
          <div className="stat-card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">
                {sections.find(s => s.id === activeSection)?.title}
              </h2>
              <Button onClick={handleSave} disabled={isSaving} className="gradient-btn">
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin ml-2" />
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 ml-2" />
                    حفظ التغييرات
                  </>
                )}
              </Button>
            </div>
            {renderSection()}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
