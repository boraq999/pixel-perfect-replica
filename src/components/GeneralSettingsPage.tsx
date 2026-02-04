import { useState, useMemo } from 'react';
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
    Loader2,
    Heart,
    AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';
import { ThemePalette } from '@/components/ThemePalette';
import { useFavoriteThemes } from '@/hooks/useFavoriteThemes';
import { themes, themeCategories, getThemesByCategory } from '@/config/themes';
import { useTheme } from 'next-themes';

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
    { id: 'favorites', title: 'الثيمات المفضلة', icon: Heart },
    { id: 'appearance', title: 'جميع الثيمات', icon: Palette },
    { id: 'notifications', title: 'الإشعارات', icon: Bell },
    { id: 'security', title: 'الأمان', icon: Shield },
];

export const GeneralSettingsPage = () => {
    const { user } = useAuthStore();
    const { theme: currentTheme, setTheme } = useTheme();
    const { favoriteThemes, toggleFavorite, isFavorite } = useFavoriteThemes();
    const [activeSection, setActiveSection] = useState('profile');
    const [isSaving, setIsSaving] = useState(false);

    // Profile settings
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: '0501234567',
    });

    // Role labels
    const roleLabel = useMemo(() => {
        switch (user?.role) {
            case 'admin': return 'مسؤول النظام';
            case 'keeper': return 'أمين المخزن';
            case 'marketer': return 'مسوّق';
            default: return 'مستخدم';
        }
    }, [user?.role]);

    // General notification settings structure based on role
    const initialNotifications = useMemo(() => {
        const base = { sound: true };
        if (user?.role === 'admin') {
            return { ...base, system: true, users: true, reports: true, security: true };
        }
        if (user?.role === 'keeper') {
            return { ...base, requests: true, stock: true, returns: true, invoices: true };
        }
        // marketer or default
        return { ...base, orders: true, warehouse: true, reports: true, marketing: true };
    }, [user?.role]);

    const [notifications, setNotifications] = useState<Record<string, boolean>>(initialNotifications);

    const handleSave = async () => {
        setIsSaving(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        toast.success('تم حفظ الإعدادات بنجاح');
        setIsSaving(false);
    };

    const renderNotificationItem = (id: string, label: string, desc: string, Icon: any, colorClass: string) => (
        <div key={id} className="flex items-center justify-between p-4 rounded-lg bg-accent/30">
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${colorClass} flex items-center justify-center`}>
                    <Icon className="w-5 h-5" />
                </div>
                <div>
                    <p className="font-medium">{label}</p>
                    <p className="text-sm text-muted-foreground">{desc}</p>
                </div>
            </div>
            <Switch
                checked={notifications[id]}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, [id]: checked }))}
            />
        </div>
    );

    const renderNotifications = () => {
        const items = [];
        if (user?.role === 'admin') {
            items.push(['system', 'إشعارات النظام', 'تحديثات وصيانة النظام', Bell, 'bg-primary/20 text-primary']);
            items.push(['users', 'إشعارات المستخدمين', 'تنبيهات عن نشاط المستخدمين', Bell, 'bg-success/20 text-success']);
            items.push(['reports', 'التقارير الإدارية', 'تقارير الأداء والإحصائيات', Bell, 'bg-info/20 text-info']);
            items.push(['security', 'تنبيهات الأمان', 'إشعارات هامة عن الأمان', Shield, 'bg-destructive/20 text-destructive']);
        } else if (user?.role === 'keeper') {
            items.push(['requests', 'إشعارات الطلبات', 'تلقي إشعارات عند وصول طلب جديد من المسوقين', Bell, 'bg-primary/20 text-primary']);
            items.push(['stock', 'تنبيهات المخزون', 'تنبيهات عند انخفاض مستويات المخزون', Bell, 'bg-success/20 text-success']);
            items.push(['returns', 'المرتجعات', 'إشعارات عند استلام مرتجعات جديدة', Bell, 'bg-warning/20 text-warning']);
            items.push(['invoices', 'فواتير المصنع', 'تنبيهات عند وصول فواتير جديدة', Bell, 'bg-info/20 text-info']);
        } else {
            items.push(['orders', 'إشعارات الطلبات', 'تلقي إشعارات عند وصول طلب جديد', Bell, 'bg-primary/20 text-primary']);
            items.push(['warehouse', 'إشعارات المخزن', 'تنبيهات حول المخزون والحركات', Bell, 'bg-success/20 text-success']);
            items.push(['reports', 'التقارير الدورية', 'استلام تقارير الأداء الأسبوعية', Bell, 'bg-info/20 text-info']);
            items.push(['marketing', 'التسويق', 'تنبيهات حول الحملات والعروض', Bell, 'bg-warning/20 text-warning']);
        }

        // Add common items
        items.push(['sound', 'صوت الإشعارات', 'تشغيل صوت عند وصول إشعار', Smartphone, 'bg-warning/20 text-warning']);

        return (
            <div className="space-y-4">
                {items.map(([id, label, desc, icon, color]) => renderNotificationItem(id as string, label as string, desc as string, icon, color as string))}
            </div>
        );
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
                                <p className="text-sm text-muted-foreground">{roleLabel}</p>
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

            case 'favorites':
                return (
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Heart className="w-5 h-5 text-primary" />
                                اختر ثيماتك المفضلة
                            </h3>
                            <div className="bg-info/10 border border-info/30 rounded-lg p-4 flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-info mt-0.5 flex-shrink-0" />
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-info">يمكنك اختيار 3 ثيمات كحد أقصى</p>
                                    <p className="text-xs text-muted-foreground">
                                        اضغط على أي ثيم لإضافته للمفضلة. الثيمات المفضلة ستظهر في التبديل السريع أعلى الشاشة.
                                        اضغط مرة أخرى لإزالته من المفضلة.
                                    </p>
                                    <p className="text-xs font-medium text-foreground mt-2">
                                        الثيمات المفضلة حالياً: {favoriteThemes.length}/3
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Dark Themes */}
                        <div className="space-y-3">
                            <h4 className="text-base font-semibold flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-gradient-to-br from-gray-800 to-gray-950"></div>
                                {themeCategories.dark}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {getThemesByCategory('dark').map((theme) => {
                                    const Icon = theme.icon;
                                    const isFav = isFavorite(theme.id);
                                    const isActive = currentTheme === theme.id;

                                    return (
                                        <motion.div
                                            key={theme.id}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => {
                                                const result = toggleFavorite(theme.id);
                                                if (!result.success && result.message) {
                                                    toast.error(result.message);
                                                } else if (result.success) {
                                                    toast.success(isFav ? 'تم إزالة الثيم من المفضلة' : 'تم إضافة الثيم للمفضلة');
                                                }
                                            }}
                                            className={`relative cursor-pointer rounded-xl p-4 transition-all border-2 ${isFav
                                                ? 'border-primary bg-primary/10'
                                                : 'border-border hover:border-primary/50 bg-card'
                                                }`}
                                        >
                                            {isFav && (
                                                <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                                                    <Check className="w-5 h-5 text-primary-foreground" />
                                                </div>
                                            )}
                                            {isActive && (
                                                <div className="absolute top-2 left-2 px-2 py-1 rounded-full bg-success text-success-foreground text-xs font-medium">
                                                    نشط
                                                </div>
                                            )}
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${theme.colors.from} ${theme.colors.to} flex items-center justify-center ${theme.id === 'aurora' ? 'animate-pulse' : ''}`}>
                                                    <Icon className="w-6 h-6 text-white" />
                                                </div>
                                                <div>
                                                    <h5 className="font-semibold">{theme.name}</h5>
                                                    <p className="text-xs text-muted-foreground">{theme.nameEn}</p>
                                                </div>
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-3">{theme.description}</p>
                                            <Button
                                                size="sm"
                                                variant={isActive ? "default" : "outline"}
                                                className="w-full"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setTheme(theme.id);
                                                    toast.success(`تم تفعيل ثيم ${theme.name}`);
                                                }}
                                            >
                                                {isActive ? 'الثيم الحالي' : 'تطبيق الثيم'}
                                            </Button>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Light Themes */}
                        <div className="space-y-3">
                            <h4 className="text-base font-semibold flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-gradient-to-br from-yellow-300 to-orange-300"></div>
                                {themeCategories.light}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {getThemesByCategory('light').map((theme) => {
                                    const Icon = theme.icon;
                                    const isFav = isFavorite(theme.id);
                                    const isActive = currentTheme === theme.id;

                                    return (
                                        <motion.div
                                            key={theme.id}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => {
                                                const result = toggleFavorite(theme.id);
                                                if (!result.success && result.message) {
                                                    toast.error(result.message);
                                                } else if (result.success) {
                                                    toast.success(isFav ? 'تم إزالة الثيم من المفضلة' : 'تم إضافة الثيم للمفضلة');
                                                }
                                            }}
                                            className={`relative cursor-pointer rounded-xl p-4 transition-all border-2 ${isFav
                                                ? 'border-primary bg-primary/10'
                                                : 'border-border hover:border-primary/50 bg-card'
                                                }`}
                                        >
                                            {isFav && (
                                                <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                                                    <Check className="w-5 h-5 text-primary-foreground" />
                                                </div>
                                            )}
                                            {isActive && (
                                                <div className="absolute top-2 left-2 px-2 py-1 rounded-full bg-success text-success-foreground text-xs font-medium">
                                                    نشط
                                                </div>
                                            )}
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${theme.colors.from} ${theme.colors.to} flex items-center justify-center`}>
                                                    <Icon className="w-6 h-6 text-white" />
                                                </div>
                                                <div>
                                                    <h5 className="font-semibold text-gray-900 dark:text-foreground">{theme.name}</h5>
                                                    <p className="text-xs text-gray-700 dark:text-foreground/70">{theme.nameEn}</p>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-800 dark:text-foreground/80 mb-3">{theme.description}</p>
                                            <Button
                                                size="sm"
                                                variant={isActive ? "default" : "outline"}
                                                className="w-full"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setTheme(theme.id);
                                                    toast.success(`تم تفعيل ثيم ${theme.name}`);
                                                }}
                                            >
                                                {isActive ? 'الثيم الحالي' : 'تطبيق الثيم'}
                                            </Button>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Nature Themes */}
                        <div className="space-y-3">
                            <h4 className="text-base font-semibold flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-gradient-to-br from-green-500 to-emerald-500"></div>
                                {themeCategories.nature}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {getThemesByCategory('nature').map((theme) => {
                                    const Icon = theme.icon;
                                    const isFav = isFavorite(theme.id);
                                    const isActive = currentTheme === theme.id;

                                    return (
                                        <motion.div
                                            key={theme.id}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => {
                                                const result = toggleFavorite(theme.id);
                                                if (!result.success && result.message) {
                                                    toast.error(result.message);
                                                } else if (result.success) {
                                                    toast.success(isFav ? 'تم إزالة الثيم من المفضلة' : 'تم إضافة الثيم للمفضلة');
                                                }
                                            }}
                                            className={`relative cursor-pointer rounded-xl p-4 transition-all border-2 ${isFav
                                                ? 'border-primary bg-primary/10'
                                                : 'border-border hover:border-primary/50 bg-card'
                                                }`}
                                        >
                                            {isFav && (
                                                <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                                                    <Check className="w-5 h-5 text-primary-foreground" />
                                                </div>
                                            )}
                                            {isActive && (
                                                <div className="absolute top-2 left-2 px-2 py-1 rounded-full bg-success text-success-foreground text-xs font-medium">
                                                    نشط
                                                </div>
                                            )}
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${theme.colors.from} ${theme.colors.to} flex items-center justify-center`}>
                                                    <Icon className="w-6 h-6 text-white" />
                                                </div>
                                                <div>
                                                    <h5 className="font-semibold text-gray-900 dark:text-foreground">{theme.name}</h5>
                                                    <p className="text-xs text-gray-700 dark:text-foreground/70">{theme.nameEn}</p>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-800 dark:text-foreground/80 mb-3">{theme.description}</p>
                                            <Button
                                                size="sm"
                                                variant={isActive ? "default" : "outline"}
                                                className="w-full"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setTheme(theme.id);
                                                    toast.success(`تم تفعيل ثيم ${theme.name}`);
                                                }}
                                            >
                                                {isActive ? 'الثيم الحالي' : 'تطبيق الثيم'}
                                            </Button>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                );

            case 'appearance':
                return (
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold">جميع الثيمات</h3>
                            <p className="text-sm text-muted-foreground">
                                استعرض جميع الثيمات المتاحة. يمكنك تطبيق أي ثيم مباشرة أو إضافته للمفضلة من تبويب "الثيمات المفضلة".
                            </p>
                        </div>

                        <ThemePalette />
                    </div>
                );

            case 'notifications':
                return renderNotifications();

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
                <p className="text-muted-foreground">إدارة حسابك وتفضيلات {roleLabel}</p>
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
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeSection === section.id
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

export default GeneralSettingsPage;
