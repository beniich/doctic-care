import { cn } from '@/lib/utils'

export interface KPICardProps {
    title: string;
    value: string | number;
    unit?: string;
    statusLabel?: string;
    trend?: {
        direction: 'up' | 'down' | 'flat';
        value: number;
        label?: string;
    };
    icon?: any;
    iconColor?: string;
    glowColor?: 'cyan' | 'orange' | 'green' | 'steel';
}

export function KPICard({
    title,
    value,
    unit,
    statusLabel,
    trend,
    icon: Icon,
    glowColor = 'cyan',
}: KPICardProps) {
    const getGlowStyles = () => {
        switch (glowColor) {
            case 'orange':
                return {
                    bg: 'radial-gradient(circle,hsla(25, 100%, 50%, 0.1) 0%,transparent 70%)',
                    text: 'text-accent drop-shadow-[0_0_8px_hsla(25,100%,50%,0.5)]',
                };
            case 'green':
                return {
                    bg: 'radial-gradient(circle,hsla(145, 100%, 45%, 0.1) 0%,transparent 70%)',
                    text: 'text-success drop-shadow-[0_0_8px_hsla(145,100%,45%,0.5)]',
                };
            case 'steel':
                return {
                    bg: 'radial-gradient(circle,hsla(255, 30%, 20%, 0.1) 0%,transparent 70%)',
                    text: 'text-foreground/70',
                };
            case 'cyan':
            default:
                return {
                    bg: 'radial-gradient(circle,hsla(193, 100%, 50%, 0.1) 0%,transparent 70%)',
                    text: 'text-primary drop-shadow-[0_0_12px_hsla(193,100%,50%,0.6)]',
                };
        }
    };

    const styles = getGlowStyles();

    return (
        <div className="relative glass-card bg-card/40 rounded-[1.8rem] border border-white/5 p-8 hover:bg-card-hover hover:border-primary/30 transition-all duration-500 overflow-hidden flex flex-col justify-center h-full min-h-[160px] group">
            {/* Glow background */}
            <div 
                className="absolute inset-0 pointer-events-none group-hover:opacity-100 opacity-60 transition-opacity" 
                style={{ background: styles.bg }}
            />

            <div className="relative z-10 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <p className="text-white/40 text-[11px] font-bold tracking-[0.2em] uppercase">
                        {title}
                    </p>
                    {Icon && (
                        <div className="glass-neon-icon w-9 h-9 opacity-30 group-hover:opacity-100 transition-opacity">
                            <Icon className="h-4 w-4 text-primary neon-pulse" />
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-1">
                    <p className={cn("text-[38px] font-bold leading-none tracking-tight text-white")}>
                        {value}
                        {unit && <span className="text-lg ml-1 font-medium opacity-50">{unit}</span>}
                    </p>
                    {statusLabel && (
                        <p className={cn("text-[10px] font-black tracking-[0.25em] uppercase mt-2", styles.text)}>
                            {statusLabel}
                        </p>
                    )}
                </div>

                {trend && (
                    <div className={cn(
                        'mt-2 flex items-center gap-1 text-xs font-bold leading-none',
                        trend.direction === 'up' ? 'text-success' :
                            trend.direction === 'down' ? 'text-destructive' :
                                'text-white/30'
                    )}>
                        <span>
                            {trend.direction === 'up' ? '↑' : trend.direction === 'down' ? '↓' : '→'}
                        </span>
                        <span>
                            {trend.direction === 'up' ? '+' : trend.direction === 'down' ? '-' : ''}
                            {Math.abs(trend.value)}% {trend.label || ''}
                        </span>
                    </div>
                )}
            </div>
        </div>
    )
}
