import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, Zap } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';

const loginSchema = z.object({
  username: z.string()
    .min(3, 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل')
    .max(50, 'اسم المستخدم طويل جداً'),
  password: z.string()
    .min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل')
    .max(100, 'كلمة المرور طويلة جداً'),
  rememberMe: z.boolean().optional(),
  userType: z.enum(['marketer', 'storekeeper'], { required_error: 'الرجاء اختيار نوع المستخدم' }),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: false,
      password: 'password',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.username, data.password, data.rememberMe);
      toast.success('تم تسجيل الدخول بنجاح');
      if (data.userType === 'marketer') {
        navigate('/dashboard');
      } else {
        navigate('/storekeeper/dashboard');
      }
    } catch (error: any) {
      toast.error(error.message || 'فشل تسجيل الدخول');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ background: 'var(--gradient-hero)' }}>
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-30"
          style={{ background: 'radial-gradient(circle, hsl(270 60% 50% / 0.4), transparent)' }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/4 right-1/4 w-[300px] h-[300px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, hsl(330 80% 55% / 0.4), transparent)' }}
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md z-10"
      >
        <div className="glass-card p-8">
          {/* Logo */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 gradient-btn animate-glow">
              <Zap className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold mb-2 gradient-text">
              نظام إدارة التوزيع
            </h1>
            <p className="text-muted-foreground">
              مرحباً بك، قم بتسجيل الدخول للمتابعة
            </p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* User Type */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-sm font-medium text-foreground/80 mb-2">نوع المستخدم</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" {...register('userType')} value="marketer" className="radio" />
                  <span className="text-sm">مسوق</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" {...register('userType')} value="storekeeper" className="radio" />
                  <span className="text-sm">أمين مخزن</span>
                </label>
              </div>
              {errors.userType && <p className="mt-2 text-sm text-destructive">{errors.userType.message}</p>}
            </motion.div>

            {/* Username */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-sm font-medium text-foreground/80 mb-2">
                اسم المستخدم
              </label>
              <input
                type="text"
                {...register('username')}
                className="input-glass"
                placeholder="أدخل اسم المستخدم"
                disabled={isLoading}
              />
              {errors.username && (
                <p className="mt-2 text-sm text-destructive">
                  {errors.username.message}
                </p>
              )}
            </motion.div>

            {/* Password */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-sm font-medium text-foreground/80 mb-2">
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  className="input-glass pl-12"
                  placeholder="أدخل كلمة المرور"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </motion.div>

            {/* Remember Me & Forgot Password */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-between"
            >
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('rememberMe')}
                  className="w-4 h-4 rounded border-border bg-input text-primary focus:ring-primary focus:ring-offset-0"
                  disabled={isLoading}
                />
                <span className="text-sm text-muted-foreground">تذكرني</span>
              </label>
              <a href="#" className="text-sm text-primary hover:text-primary/80 transition-colors">
                نسيت كلمة المرور؟
              </a>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-lg font-medium gradient-btn disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  جاري تسجيل الدخول...
                </span>
              ) : (
                'تسجيل الدخول'
              )}
            </motion.button>
          </form>

          {/* Register Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6 text-center"
          >
            <p className="text-sm text-muted-foreground">
              ليس لديك حساب؟{' '}
              <a href="#" className="text-primary hover:text-primary/80 font-medium transition-colors">
                سجل الآن
              </a>
            </p>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 text-center text-sm text-muted-foreground"
        >
          <p>© 2026 Taqnia Distribution Manager. جميع الحقوق محفوظة.</p>
        </motion.div>
      </motion.div>
    </div>
  );
};
