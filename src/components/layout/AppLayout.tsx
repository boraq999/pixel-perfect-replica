import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Home,
    Package,
    Store,
    BarChart3,
    Settings,
    LogOut,
    Menu,
    X,
    Bell,
    User,
    Zap,
    ChevronDown,
    Users,
    ShoppingCart,
    ClipboardList,
    FileText,
    CreditCard,
    History,
    ReceiptText,
    ArrowDownLeft,
    ClipboardCheck,
    Wallet,
    PackageCheck,
    Trophy
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { UserRole } from '@/types/auth';
import { ThemeToggle } from '@/components/theme-toggle';

interface NavigationItem {
    name: string;
    href: string;
    icon: any;
}

const navItems: Record<UserRole, NavigationItem[]> = {
    admin: [
        { name: 'لوحة التحكم', href: '/admin', icon: Home },
        { name: 'إدارة المستخدمين', href: '/admin/users', icon: Users },
        { name: 'إدارة المنتجات', href: '/admin/products', icon: Package },
        { name: 'إدارة المتاجر', href: '/admin/stores', icon: Store },
        { name: 'مراجعة السحوبات', href: '/admin/withdrawals', icon: CreditCard },
        { name: 'التقارير المالية', href: '/admin/reports', icon: BarChart3 },
        { name: 'الإعدادات', href: '/admin/settings', icon: Settings },
    ],
    keeper: [
        { name: 'لوحة التحكم', href: '/keeper', icon: Home },
        { name: 'المخزن الرئيسي', href: '/keeper/stock', icon: Package },
        { name: 'فواتير المصنع', href: '/keeper/factory-invoices', icon: FileText },
        { name: 'طلبات المسوقين', href: '/keeper/requests', icon: ClipboardList },
        { name: 'توثيق البيع', href: '/keeper/sales-docs', icon: ClipboardCheck },
        { name: 'توثيق إيصالات القبض', href: '/keeper/payment-confirmation', icon: ReceiptText },
        { name: 'طلبات الإرجاع', href: '/keeper/sales-returns', icon: ArrowDownLeft },
        { name: 'الإعدادات', href: '/keeper/settings', icon: Settings },
    ],
    marketer: [
        { name: 'لوحة التحكم', href: '/dashboard', icon: Home },
        { name: 'مخزوني الفعلي', href: '/dashboard/warehouse', icon: ShoppingCart },
        { name: 'المتاجر والبيع', href: '/dashboard/stores', icon: Store },
        { name: 'عملياتي', href: '/dashboard/operations', icon: History },
        { name: 'الإعدادات', href: '/dashboard/settings', icon: Settings },
    ],
};

export const AppLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Special navigation for best marketer
    const bestMarketerNavItems: NavigationItem[] = [
        { name: 'لوحة التحكم', href: '/best-marketer', icon: Home },
        { name: 'إدارة الطلبات', href: '/best-marketer/orders', icon: PackageCheck },
        { name: 'مخزوني الفعلي', href: '/best-marketer/warehouse', icon: ShoppingCart },
        { name: 'المتاجر والبيع', href: '/best-marketer/stores', icon: Store },
        { name: 'الإرجاعات', href: '/best-marketer/returns', icon: ArrowDownLeft },
        { name: 'الأرباح والسحوبات', href: '/best-marketer/profits', icon: Wallet },
        { name: 'عملياتي', href: '/best-marketer/operations', icon: History },
        { name: 'الإعدادات', href: '/best-marketer/settings', icon: Settings },
    ];

    const currentNavigation = user 
        ? (user.id === 'marketer-2' ? bestMarketerNavItems : navItems[user.role])
        : [];

    return (
        <div className="min-h-screen bg-background">
            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 lg:hidden"
                    >
                        <div
                            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                            onClick={() => setSidebarOpen(false)}
                        />
                        <motion.div
                            initial={{ x: 100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 100, opacity: 0 }}
                            transition={{ type: 'spring', damping: 25 }}
                            className="absolute inset-y-0 right-0 w-72 bg-sidebar border-l border-sidebar-border shadow-xl"
                        >
                            <Sidebar navigation={currentNavigation} userRole={user?.role} onClose={() => setSidebarOpen(false)} />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Desktop Sidebar */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:right-0 lg:flex lg:w-72 lg:flex-col">
                <div className="flex flex-col flex-grow bg-sidebar border-l border-sidebar-border">
                    <Sidebar navigation={currentNavigation} userRole={user?.role} />
                </div>
            </div>

            {/* Main Content */}
            <div className="lg:pr-72">
                {/* Header */}
                <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
                    <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                        <button
                            type="button"
                            className="lg:hidden p-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu className="h-6 w-6" />
                        </button>

                        <div className="flex items-center gap-4">
                            <div className="text-right hidden sm:block">
                                <p className="text-xs text-muted-foreground">{user?.role === 'admin' ? 'مدير' : user?.role === 'keeper' ? 'أمين مخزن' : 'مسوق'}</p>
                                <p className="text-sm font-bold">{user?.name}</p>
                            </div>

                            <ThemeToggle />

                            {/* Notifications */}
                            <button className="relative p-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
                                <Bell className="h-5 w-5" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
                            </button>

                            {/* User Menu */}
                            <div className="relative">
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                        <User className="w-4 h-4 text-primary" />
                                    </div>
                                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                </button>

                                <AnimatePresence>
                                    {userMenuOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute left-0 mt-2 w-48 bg-popover border border-border rounded-lg shadow-lg py-1 z-50"
                                        >
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-accent transition-colors"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                تسجيل الخروج
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="py-6 px-4 sm:px-6 lg:px-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

interface SidebarProps {
    navigation: NavigationItem[];
    userRole?: UserRole;
    onClose?: () => void;
}

const Sidebar = ({ navigation, userRole, onClose }: SidebarProps) => {
    return (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center justify-between p-6 border-b border-sidebar-border">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl gradient-btn flex items-center justify-center">
                        <Zap className="w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="font-bold text-foreground">تقنية</h1>
                        <p className="text-xs text-muted-foreground">نظام إدارة التوزيع</p>
                    </div>
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="lg:hidden p-2 rounded-lg text-muted-foreground hover:bg-accent transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navigation.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.href}
                        end={item.href === '/dashboard' || item.href === '/admin' || item.href === '/keeper' || item.href === '/best-marketer'}
                        onClick={onClose}
                        className={({ isActive }) =>
                            `nav-link ${isActive ? 'active' : ''}`
                        }
                    >
                        <item.icon className="w-5 h-5" />
                        <span>{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-sidebar-border">
                <div className="glass-card p-4 text-center">
                    <p className="text-xs font-bold text-primary mb-1 uppercase">{userRole}</p>
                    <p className="text-[10px] text-muted-foreground">© 2024 Taqnia Distribution</p>
                    <p className="text-[10px] text-muted-foreground">V 2.5.0</p>
                </div>
            </div>
        </div>
    );
};
