import { cn } from '@/lib/utils'

export interface KPICardProps {
    title: string;
    value: string | number;
    unit?: string;
    trend?: {
        direction: 'up' | 'down' | 'flat';
        value: number;
        label?: string;
    };
    icon?: string;
    iconColor?: string;
}

export function KPICard({
    title,
    value,
    unit,
    trend,
    icon,
    iconColor = 'text-primary',
}: KPICardProps) {
    return (
        <div className="bg-white dark:bg-card rounded-[1.5rem] border border-border p-6 hover:border-primary dark:hover:border-primary transition-all shadow-sm">
            <div className="flex items-start justify-between mb-4">
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">
                    {title}
                </p>
                {icon && (
                    <span className={cn('material-symbols-outlined text-2xl', iconColor)}>
                        {icon}
                    </span>
                )}
            </div>

            <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-slate-900 dark:text-white tabular-nums">
                    {value}
                </p>
                {unit && (
                    <p className="text-sm font-normal text-slate-500">{unit}</p>
                )}
            </div>

            {trend && (
                <div className={cn(
                    'mt-4 flex items-center gap-1 text-xs font-bold',
                    trend.direction === 'up' ? 'text-emerald-500' :
                        trend.direction === 'down' ? 'text-red-500' :
                            'text-slate-500'
                )}>
                    <span className="material-symbols-outlined text-sm">
                        {trend.direction === 'up' ? 'trending_up' :
                            trend.direction === 'down' ? 'trending_down' :
                                'trending_flat'}
                    </span>
                    <span>
                        {trend.direction === 'up' ? '+' : trend.direction === 'down' ? '-' : ''}
                        {Math.abs(trend.value)}% {trend.label || ''}
                    </span>
                </div>
            )}
        </div>
    )
}
