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
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { NavigationItem } from '@/types/marketer';

const navigation: NavigationItem[] = [
  { name: 'لوحة التحكم', href: '/dashboard', icon: Home },
  { name: 'المخزن', href: '/dashboard/warehouse', icon: Package },
  { name: 'المتاجر', href: '/dashboard/stores', icon: Store },
  { name: 'العمليات', href: '/dashboard/operations', icon: BarChart3 },
  { name: 'الإعدادات', href: '/dashboard/settings', icon: Settings },
];

export const MarketerLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

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
              <Sidebar navigation={navigation} onClose={() => setSidebarOpen(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:right-0 lg:flex lg:w-72 lg:flex-col">
        <div className="flex flex-col flex-grow bg-sidebar border-l border-sidebar-border">
          <Sidebar navigation={navigation} />
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
                  <span className="hidden sm:block text-sm font-medium">
                    {user?.name || 'المستخدم'}
                  </span>
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
  onClose?: () => void;
}

const Sidebar = ({ navigation, onClose }: SidebarProps) => {
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
            <p className="text-xs text-muted-foreground">إدارة التوزيع</p>
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
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            end={item.href === '/dashboard'}
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
          <p className="text-xs text-muted-foreground mb-2">الإصدار 1.0.0</p>
          <p className="text-xs text-muted-foreground">© 2026 Taqnia</p>
        </div>
      </div>
    </div>
  );
};
