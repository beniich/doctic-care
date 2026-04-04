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
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";
import { useAuth } from "@/contexts/AuthContext";

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

const bottomNavItems: NavItem[] = [
  { icon: CreditCard, label: "My Subscription", path: "/subscription" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

const contentItems: NavItem[] = [
  { icon: Film, label: "Streaming & Vidéos", path: "/streaming" },
  { icon: Share2, label: "Réseaux Sociaux", path: "/publish-social" },
  { icon: MessageSquare, label: "Messages", path: "/messages" },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
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
  const filteredBottomNavItems = filterNavItems(bottomNavItems);
  const filteredContentItems = filterNavItems(contentItems);

  const NavItemButton = ({ item }: { item: NavItem }) => {
    const isActive = location.pathname === item.path;
    const Icon = item.icon;

    const button = (
      <Button
        variant="ghost"
        onClick={() => navigate(item.path)}
        className={cn(
          "w-full justify-start gap-3 h-10 px-3 transition-all duration-200 rounded-lg group",
          isActive 
            ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(0,180,255,0.05)]" 
            : "text-white/50 hover:bg-white/[0.03] hover:text-white",
          collapsed && "justify-center px-0"
        )}
      >
        <div className={cn(
          "p-1.5 rounded-md transition-all duration-300",
          isActive ? "bg-primary/20" : "bg-transparent group-hover:bg-white/5"
        )}>
          <Icon className={cn("h-4 w-4 flex-shrink-0", isActive ? "text-primary shadow-[0_0_8px_rgba(0,210,255,0.5)]" : "text-inherit")} />
        </div>
        {!collapsed && (
          <div className="flex-1 flex items-center justify-between overflow-hidden">
            <span className={cn("text-[13px] truncate", isActive ? "font-semibold" : "font-medium")}>{item.label}</span>
            {item.badge && (
              <span className="bg-primary/20 text-primary text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-primary/30">
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
          <TooltipContent side="right" className="bg-black/80 backdrop-blur-md border-white/10 text-white text-xs">
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
        "flex flex-col h-screen transition-all duration-300 border-r border-white/[0.04] bg-[#050508] relative",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.02] to-transparent pointer-events-none" />

      {/* Logo Header Doctic Purple Style */}
      <div className="flex items-center gap-3 px-4 py-6 mb-2">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent border border-white/10 shadow-lg shadow-primary/20 flex-shrink-0">
          <ShieldAlert className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="flex flex-col leading-none">
            <span className="font-extrabold text-[15px] tracking-tight text-white">DOCTIC CARE</span>
            <span className="text-[9px] text-primary/70 tracking-[0.2em] uppercase font-bold mt-1">Medical OS</span>
          </div>
        )}
      </div>

      <nav className="flex-1 py-2 px-3 space-y-7 overflow-y-auto scrollbar-none">
        {/* Main Modules */}
        <div className="space-y-1">
          {!collapsed && <h3 className="px-2 text-[10px] font-bold text-white/20 uppercase tracking-[0.1em] mb-3">Menu Principal</h3>}
          {filteredNavItems.map((item) => (
            <NavItemButton key={item.path} item={item} />
          ))}
        </div>

        {/* Content Modules */}
        <div className="space-y-1">
          {!collapsed && <h3 className="px-2 text-[10px] font-bold text-white/20 uppercase tracking-[0.1em] mb-3">Communication</h3>}
          {filteredContentItems.map((item) => (
            <NavItemButton key={item.path} item={item} />
          ))}
        </div>
      </nav>

      {/* Bottom Navigation & Footer */}
      <div className="pt-4 pb-6 px-3 border-t border-white/[0.04] space-y-4 bg-black/20">
        <div className="space-y-1">
          {filteredBottomNavItems.map((item) => (
            <NavItemButton key={item.path} item={item} />
          ))}
        </div>

        {/* Language & Notifications */}
        <div className={cn(
          "flex items-center justify-between gap-2 px-1",
          collapsed && "flex-col h-auto py-2"
        )}>
          <div className="flex items-center gap-1">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
          <NotificationCenter />
        </div>

        {/* Footer Info */}
        {!collapsed && (
          <div className="px-2 py-3 mt-2 border-t border-white/[0.03] space-y-2">
            <div className="flex items-center justify-between text-[10px] text-white/30 font-medium whitespace-nowrap">
               <span>{new Date().toLocaleDateString('fr-FR')}</span>
               <span className="truncate ml-2 text-primary/50">{user?.tenant?.name || 'Doctic Organization'}</span>
            </div>
            <div className="text-[10px] text-white/20 font-bold flex items-center justify-between">
               <span>DocticCare v2.1</span>
               <span className="flex items-center gap-1">© {new Date().getFullYear()}</span>
            </div>
          </div>
        )}

        {/* Collapse Toggle */}
        <Button
          variant="ghost"
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "w-full h-9 px-2 text-white/40 hover:text-white hover:bg-white/5",
            collapsed ? "justify-center" : "justify-between"
          )}
        >
          {!collapsed && <span className="text-xs font-semibold">Réduire le menu</span>}
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
    </aside>
  );
}
