import { Badge } from '@/components/ui/badge';
import { RequestStatus } from '@/types/common';
import { CheckCircle2, Clock, Truck, XCircle, AlertCircle } from 'lucide-react';

interface RequestStatusBadgeProps {
    status: RequestStatus | string;
}

export const RequestStatusBadge = ({ status }: RequestStatusBadgeProps) => {
    const config = {
        pending: {
            label: 'قيد الانتظار',
            icon: Clock,
            className: 'bg-warning/10 text-warning border-warning/10'
        },
        approved: {
            label: 'تمت الموافقة',
            icon: CheckCircle2,
            className: 'bg-success/10 text-success border-success/10'
        },
        documented: {
            label: 'تم التسليم',
            icon: Truck,
            className: 'bg-info/10 text-info border-info/10'
        },
        rejected: {
            label: 'مرفوض',
            icon: XCircle,
            className: 'bg-destructive/10 text-destructive border-destructive/10'
        },
        cancelled: {
            label: 'ملغى',
            icon: AlertCircle,
            className: 'bg-muted text-muted-foreground border-border'
        }
    };

    const current = config[status as keyof typeof config] || {
        label: status,
        icon: AlertCircle,
        className: 'bg-muted text-muted-foreground border-border'
    };

    const Icon = current.icon;

    return (
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold text-[10px] border ${current.className}`}>
            <Icon className="w-3 h-3" />
            <span>{current.label}</span>
        </div>
    );
};
