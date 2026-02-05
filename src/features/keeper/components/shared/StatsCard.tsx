import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: string;
    subtitle: string;
    icon: LucideIcon;
    trend: 'up' | 'down' | 'neutral';
    trendValue?: string;
    color: 'primary' | 'warning' | 'destructive' | 'success';
}

export const StatsCard = ({ title, value, subtitle, icon: Icon, trend, trendValue, color }: StatsCardProps) => {
    const colorStyles = {
        primary: 'text-primary bg-primary/10',
        warning: 'text-amber-500 bg-amber-500/10',
        destructive: 'text-red-500 bg-red-500/10',
        success: 'text-emerald-500 bg-emerald-500/10'
    };

    return (
        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-xl ${colorStyles[color]}`}>
                        <Icon className="w-6 h-6" />
                    </div>
                    {trend !== 'neutral' && (
                        <div className={`flex items-center gap-1 text-xs font-medium ${trend === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
                            {trendValue}
                            {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        </div>
                    )}
                </div>
                <div className="space-y-1">
                    <h3 className="text-2xl font-bold">{value}</h3>
                    <p className="text-sm text-muted-foreground">{title}</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">{subtitle}</p>
                </div>
            </CardContent>
        </Card>
    );
};
