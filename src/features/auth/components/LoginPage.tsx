import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, Zap, ShoppingCart, Package, ShieldCheck, Trophy } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';

const loginSchema = z.object({
  username: z.string().min(3, 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.username, data.password);
      toast.success('تم تسجيل الدخول بنجاح');
      
      // Navigation will be handled based on API response role
      const { user } = useAuthStore.getState();
      if (user?.role === 'admin') {
        navigate('/admin');
      } else if (user?.role === 'keeper' || user?.role === 'warehouse_keeper') {
        navigate('/keeper');
      } else {
        navigate('/dashboard');
      }
      
    } catch (error: any) {
      toast.error(error.message || 'فشل تسجيل الدخول');
    }
  };

  const handleQuickLogin = async (role: 'salesman' | 'warehouse' | 'admin') => {
    let username = '';
    if (role === 'salesman') username = 'salesman1';
    else if (role === 'warehouse') username = 'keeper1';
    else username = 'admin';

    const password = role === 'admin' ? 'admin123' : role === 'warehouse' ? 'keeper123' : 'sales123';
    
    setValue('username', username);
    setValue('password', password);
    
    try {
      await login(username, password);
      toast.success('تم تسجيل الدخول بنجاح');
      
      const { user } = useAuthStore.getState();
      if (user?.role === 'admin') navigate('/admin');
      else if (user?.role === 'keeper' || user?.role === 'warehouse_keeper') navigate('/keeper');
      else navigate('/dashboard');

    } catch (error: any) {
      toast.error(error.message || 'فشل تسجيل الدخول السريع');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ background: 'var(--gradient-hero)' }}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-30"
          style={{ background: 'radial-gradient(circle, hsl(270 60% 50% / 0.4), transparent)' }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Main Container - Two Column Layout */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-5xl z-10 glass-card overflow-hidden grid grid-cols-1 md:grid-cols-2"
      >
        
        {/* Right Side: Login Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center order-1 md:order-2 bg-background/50">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-2 gradient-text">تسجيل الدخول</h1>
            <p className="text-muted-foreground">أدخل بيانات الحساب للوصول للنظام</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80 block text-right">اسم المستخدم</label>
              <input
                type="text"
                {...register('username')}
                className="input-glass text-right"
                placeholder="admin / salesman1 / keeper1"
                disabled={isLoading}
              />
              {errors.username && <p className="text-xs text-destructive text-right">{errors.username.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80 block text-right">كلمة المرور</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  className="input-glass text-right pr-12"
                  placeholder="********"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive text-right">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-xl font-bold gradient-btn animate-glow disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : 'دخول للنظام'}
            </button>
          </form>
        </div>

        {/* Left Side: Quick Login Section */}
        <div className="gradient-btn p-8 md:p-12 flex flex-col justify-between items-center text-center order-2 md:order-1 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
             <Zap className="absolute -top-10 -left-10 w-40 h-40 rotate-12" />
          </div>

          <div className="relative z-10 w-full">
            <div className="mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 bg-white/20 backdrop-blur-sm">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">الدخول السريع</h2>
              <p className="text-white/80">اختر دورك الوظيفي للبدء فوراً</p>
            </div>

            <div className="space-y-3 w-full max-w-sm mx-auto">
              {/* Admin Option */}
              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                disabled={isLoading}
                className="w-full flex items-center gap-4 p-3 rounded-2xl bg-white/20 hover:bg-white/30 border border-white/20 transition-all group disabled:opacity-50 shadow-lg"
              >
                <div className="w-10 h-10 rounded-xl bg-red-500/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <div className="text-right">
                  <h3 className="font-bold text-white text-sm">دخول كمسؤول</h3>
                  <p className="text-[10px] text-white/60 uppercase">System Administrator</p>
                </div>
              </button>

              {/* Best Marketer Option - Featured */}
              <button
                type="button"
                onClick={() => handleQuickLogin('salesman')}
                disabled={isLoading}
                className="w-full flex items-center gap-4 p-3 rounded-2xl bg-gradient-to-r from-yellow-500/30 to-orange-500/30 hover:from-yellow-500/40 hover:to-orange-500/40 border-2 border-yellow-400/50 transition-all group disabled:opacity-50 shadow-lg relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 animate-pulse" />
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform relative z-10">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <div className="text-right relative z-10">
                  <h3 className="font-bold text-white text-sm flex items-center gap-1">
                    دخول كمسوق
                    <span className="text-[8px] px-1.5 py-0.5 bg-yellow-400/30 rounded-full">PRO</span>
                  </h3>
                  <p className="text-[10px] text-white/80 uppercase font-medium">Marketer Account</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('warehouse')}
                disabled={isLoading}
                className="w-full flex items-center gap-4 p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 transition-all group disabled:opacity-50"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-500/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div className="text-right">
                  <h3 className="font-bold text-white text-sm">أمين مخزن</h3>
                  <p className="text-[10px] text-white/60 uppercase">Warehouse Account</p>
                </div>
              </button>
            </div>
          </div>

          <div className="mt-8 text-white/60 text-[10px] relative z-10">
            <p>جميع الحقوق محفوظة © تقنية للتوزيع 2024</p>
            <p className="mt-1">إصدار النظام V2.5.0</p>
          </div>
        </div>

      </motion.div>
    </div>
  );
};
