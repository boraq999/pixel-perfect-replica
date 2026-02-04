import { motion } from 'framer-motion';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  color?: string;
  bgColor?: string;
  delay?: number;
}

export const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  color = 'text-primary',
  bgColor = 'bg-primary/10',
  delay = 0
}: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className="border-none shadow-sm transition-all hover:shadow-md">
        <CardContent className="flex items-center gap-4 p-4 md:p-6">
          <div className={`rounded-xl md:rounded-2xl ${bgColor} p-3 md:p-4`}>
            <Icon className={`h-5 w-5 md:h-6 md:w-6 ${color}`} />
          </div>
          <div className="flex-1">
            <p className="text-[10px] md:text-sm font-medium text-muted-foreground">
              {title}
            </p>
            <h3 className="text-lg md:text-2xl font-bold font-ar">{value}</h3>
            {trend && (
              <div
                className={`flex items-center gap-1 mt-1 text-xs ${
                  trend.direction === 'up' ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {trend.direction === 'up' ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span>{Math.abs(trend.value)}%</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
