import { motion } from 'framer-motion';
import { Home, ArrowRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--gradient-hero)' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="text-9xl font-bold gradient-text mb-4"
        >
          404
        </motion.div>
        <h1 className="text-2xl font-bold mb-2">الصفحة غير موجودة</h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          عذراً، لم نتمكن من العثور على الصفحة التي تبحث عنها
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium gradient-btn"
        >
          <Home className="w-5 h-5" />
          العودة للرئيسية
          <ArrowRight className="w-5 h-5" />
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
