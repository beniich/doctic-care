import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  Package,
  CreditCard,
  Settings,
  Bot,
  ChevronLeft,
  ChevronRight,
  Building2,
  Network,
  Pill,
  Video,
  Film,
  Share2,
  MessageSquare,
  ShieldAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from "@/contexts/AuthContext";
import { LogoIcon } from "./LogoIcon";

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
  badge?: number;
  allowedRoles?: string[];
}

const navItems: NavItem[] = [
  { icon: ShieldAlert, label: "Doctic Control", path: "/admin", allowedRoles: ['SUPER_ADMIN'] },
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Users, label: "Patients", path: "/patients", badge: 12, allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'DOCTOR', 'ASSISTANT'] },
  { icon: Calendar, label: "Appointments", path: "/appointments", badge: 5, allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'DOCTOR', 'ASSISTANT'] },
  { icon: FileText, label: "Medical Records", path: "/records", allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'DOCTOR'] },
  { icon: Pill, label: "Prescriptions", path: "/prescriptions", allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'DOCTOR'] },
  { icon: Video, label: "Teleconsultation", path: "/teleconsult", allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'DOCTOR'] },
  { icon: Package, label: "Products", path: "/products", allowedRoles: ['SUPER_ADMIN', 'ADMIN'] },
  { icon: CreditCard, label: "Patient Billing", path: "/billing", allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'DOCTOR'] },
  { icon: Building2, label: "SaaS Billing", path: "/saas-billing", allowedRoles: ['SUPER_ADMIN', 'ADMIN'] },
  { icon: Network, label: "Multi-Tenant", path: "/network", allowedRoles: ['SUPER_ADMIN'] },
  { icon: Bot, label: "AI Assistant", path: "/assistant", allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'DOCTOR'] },
];

const contentItems: NavItem[] = [
  { icon: Film, label: "Streaming & Vidéos", path: "/streaming" },
  { icon: Share2, label: "Réseaux Sociaux", path: "/publish-social" },
  { icon: MessageSquare, label: "Messages", path: "/messages" },
];

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function AppSidebar({ collapsed, onToggle }: AppSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const filterNavItems = (items: NavItem[]) => {
    if (!user) return [];
    return items.filter(item => {
      // If no roles specified, it's public
      if (!item.allowedRoles) return true;
      return item.allowedRoles.includes(user.role);
    });
  };

  const filteredNavItems = filterNavItems(navItems);
  const filteredContentItems = filterNavItems(contentItems);

  const NavItemButton = ({ item }: { item: NavItem }) => {
    const isActive = location.pathname === item.path;
    const Icon = item.icon;

    const button = (
      <Button
        variant="ghost"
        onClick={() => navigate(item.path)}
        className={cn(
          "w-full justify-start gap-3 h-11 px-3 transition-all duration-300 rounded-xl group relative overflow-hidden",
          isActive 
            ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_20px_hsla(var(--primary)/0.1)]" 
            : "text-sidebar-foreground/60 hover:bg-foreground/[0.03] hover:text-sidebar-foreground",
          collapsed && "justify-center px-0"
        )}
      >
        {/* Shine effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />
        
        <div className={cn(
          "h-8 w-8 transition-all duration-500 glass-neon-icon flex flex-shrink-0",
          isActive ? "border-primary/60 scale-105 shadow-[0_0_15px_hsla(var(--primary)/0.3)] bg-primary/20" : "border-foreground/10 opacity-70 group-hover:opacity-100 group-hover:border-foreground/20 group-hover:scale-105"
        )}>
          <Icon className={cn("h-4 w-4 transition-all duration-500", isActive ? "text-primary neon-pulse" : "text-inherit")} />
        </div>
        {!collapsed && (
          <div className="flex-1 flex items-center justify-between overflow-hidden">
            <span className={cn("text-[13px] tracking-tight transition-all duration-300", isActive ? "font-bold translate-x-0.5" : "font-medium group-hover:translate-x-0.5")}>{item.label}</span>
            {item.badge && (
              <span className={cn(
                  "text-[9px] font-black px-1.5 py-0.5 rounded-md border transition-all duration-300",
                  isActive ? "bg-primary text-primary-foreground border-primary shadow-glow" : "bg-foreground/5 text-foreground/40 border-foreground/10"
              )}>
                {item.badge}
              </span>
            )}
          </div>
        )}
      </Button>
    );

    if (collapsed) {
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent side="right" className="glass-card border-primary/20 text-foreground text-xs font-bold px-3 py-2">
            {item.label}
          </TooltipContent>
        </Tooltip>
      );
    }

    return button;
  };

  return (
    <aside
      className={cn(
        "flex flex-col h-screen transition-all duration-500 border-r border-sidebar-border bg-sidebar backdrop-blur-3xl relative z-40",
        collapsed ? "w-20" : "w-72"
      )}
    >
      {/* Decorative gradient overlay */}
      <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-primary/[0.05] to-transparent pointer-events-none" />

      {/* Logo Header Doctic Purple Style */}
      <div className="flex items-center gap-3 px-6 py-8 mb-4">
        <div className="relative group">
            <div className="absolute -inset-2 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <LogoIcon className="w-10 h-10 relative transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3" />
        </div>
        {!collapsed && (
          <div className="flex flex-col leading-none">
            <span className="font-black text-[16px] tracking-tighter text-sidebar-foreground uppercase">DOCTIC<span className="text-primary italic ml-0.5">CARE</span></span>
            <span className="text-[10px] text-primary/60 tracking-[0.25em] uppercase font-bold mt-1.5 opacity-80">Medical OS</span>
          </div>
        )}
      </div>

      <nav className="flex-1 py-2 px-4 space-y-9 overflow-y-auto scrollbar-none custom-scroll">
        {/* Main Modules */}
        <div className="space-y-1.5">
          {!collapsed && <h3 className="px-3 text-[10px] font-black text-sidebar-foreground/30 uppercase tracking-[0.2em] mb-4">Menu Principal</h3>}
          {filteredNavItems.map((item) => (
            <NavItemButton key={item.path} item={item} />
          ))}
        </div>

        {/* Content Modules */}
        <div className="space-y-1.5">
          {!collapsed && <h3 className="px-3 text-[10px] font-black text-sidebar-foreground/30 uppercase tracking-[0.2em] mb-4">Communication</h3>}
          {filteredContentItems.map((item) => (
            <NavItemButton key={item.path} item={item} />
          ))}
        </div>
      </nav>

      {/* Bottom Footer Info */}
      <div className="mt-auto pt-6 pb-10 px-4 border-t border-foreground/5 bg-gradient-to-t from-black/20 to-transparent">
        {!collapsed && (
          <div className="px-4 py-2 space-y-2">
            <div className="flex items-center justify-between text-[10px] text-sidebar-foreground/40 font-bold whitespace-nowrap">
               <span className="opacity-60">{new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
               <span className="text-primary tracking-widest animate-pulse">LIVE</span>
            </div>
            <div className="flex items-center justify-between">
                <span className="text-[10px] text-sidebar-foreground/20 font-black uppercase tracking-widest">v2.3 Stable</span>
                <div className="w-2 h-2 rounded-full bg-success animate-ping" />
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

