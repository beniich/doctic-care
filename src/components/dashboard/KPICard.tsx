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
    glowColor?: 'cyan' | 'purple' | 'orange' | 'green';
}

export function KPICard({
    title,
    value,
    unit,
    trend,
    icon,
    glowColor = 'cyan',
}: KPICardProps) {
    const getGlowStyles = () => {
        switch (glowColor) {
            case 'purple':
                return {
                    bg: 'radial-gradient(circle,rgba(155,127,255,0.15) 0%,transparent 70%)',
                    text: 'text-accent text-glow-purple',
                };
            case 'orange':
                return {
                    bg: 'radial-gradient(circle,rgba(255,107,0,0.15) 0%,transparent 70%)',
                    text: 'text-warning',
                };
            case 'green':
                return {
                    bg: 'radial-gradient(circle,rgba(0,230,118,0.15) 0%,transparent 70%)',
                    text: 'text-success',
                };
            case 'cyan':
            default:
                return {
                    bg: 'radial-gradient(circle,rgba(0,200,255,0.15) 0%,transparent 70%)',
                    text: 'text-primary text-glow-cyan',
                };
        }
    };

    const styles = getGlowStyles();

    return (
        <div className="relative bg-card rounded-[1.2rem] border border-border p-[1.125rem] hover:bg-card-hover hover:border-primary/30 transition-all overflow-hidden flex flex-col justify-center h-full min-h-[110px]">
            {/* Glow background */}
            <div 
                className="absolute inset-0 pointer-events-none" 
                style={{ background: styles.bg }}
            />

            <div className="relative z-10 flex flex-col gap-2">
                <p className="text-white/25 text-[10px] font-bold tracking-[0.1em] uppercase">
                    {title}
                </p>

                <div className="flex items-baseline gap-2">
                    <p className={cn("text-[32px] font-mono-tech leading-none", styles.text)}>
                        {value}
                    </p>
                    {unit && (
                        <p className="text-sm font-normal text-white/50">{unit}</p>
                    )}
                </div>

                {trend && (
                    <div className={cn(
                        'mt-2 flex items-center gap-1 text-xs font-bold leading-none',
                        trend.direction === 'up' ? 'text-success' :
                            trend.direction === 'down' ? 'text-destructive' :
                                'text-white/50'
                    )}>
                        <span className="material-symbols-outlined text-sm leading-none">
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
            
            {/* Si une icône est passée, on peut l'afficher en haut à droite en absolute si on veut, 
                mais la maquette ne montre pas d'icône. Je la laisse masquée pour correspondre au design épuré, ou en filigrane */}
            {icon && (
                <div className="absolute top-4 right-4 opacity-5 pointer-events-none text-4xl">
                    <span className="material-symbols-outlined">{icon}</span>
                </div>
            )}
        </div>
    )
}
