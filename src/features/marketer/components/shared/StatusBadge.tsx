import { Clock, CheckCircle, XCircle, Boxes } from 'lucide-react';

type Status = 'pending' | 'approved' | 'completed' | 'cancelled' | 'documented';

interface StatusBadgeProps {
  status: Status;
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig = {
  pending: {
    label: 'قيد المراجعة',
    icon: Clock,
    className: 'bg-amber-500/10 text-amber-600 border-amber-500/20'
  },
  approved: {
    label: 'بانتظار التوثيق',
    icon: Boxes,
    className: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
  },
  completed: {
    label: 'مكتمل',
    icon: CheckCircle,
    className: 'bg-green-500/10 text-green-600 border-green-500/20'
  },
  cancelled: {
    label: 'ملغي',
    icon: XCircle,
    className: 'bg-red-500/10 text-red-600 border-red-500/20'
  },
  documented: {
    label: 'موثق',
    icon: CheckCircle,
    className: 'bg-blue-500/10 text-blue-600 border-blue-500/20'
  }
};

const sizeConfig = {
  sm: 'px-2 py-0.5 text-[10px] gap-1',
  md: 'px-2.5 py-1 text-xs gap-1.5',
  lg: 'px-3 py-1.5 text-sm gap-2'
};

const iconSizeConfig = {
  sm: 'w-3 h-3',
  md: 'w-3.5 h-3.5',
  lg: 'w-4 h-4'
};

export const StatusBadge = ({ status, size = 'md' }: StatusBadgeProps) => {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={`flex items-center rounded-full font-medium border ${config.className} ${sizeConfig[size]}`}
    >
      <Icon className={iconSizeConfig[size]} />
      {config.label}
    </span>
  );
};
