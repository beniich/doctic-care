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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
  badge?: number;
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Users, label: "Patients", path: "/patients", badge: 12 },
  { icon: Calendar, label: "Appointments", path: "/appointments", badge: 5 },
  { icon: FileText, label: "Medical Records", path: "/records" },
  { icon: Pill, label: "Prescriptions", path: "/prescriptions" },
  { icon: Video, label: "Teleconsultation", path: "/teleconsult" },
  { icon: Package, label: "Products", path: "/products" },
  { icon: CreditCard, label: "Patient Billing", path: "/billing" },
  { icon: Building2, label: "SaaS Billing", path: "/saas-billing" },
  { icon: Network, label: "Multi-Tenant", path: "/network" },
  { icon: Bot, label: "AI Assistant", path: "/assistant" },
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

  const NavItemButton = ({ item }: { item: NavItem }) => {
    const isActive = location.pathname === item.path;
    const Icon = item.icon;

    const button = (
      <Button
        variant="ghost"
        onClick={() => navigate(item.path)}
        className={cn(
          "w-full justify-start gap-3 h-11 px-3 text-sidebar-foreground border border-transparent transition-all duration-200",
          isActive 
            ? "bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20 text-primary font-semibold shadow-[inset_0_0_10px_rgba(0,200,255,0.05)]" 
            : "hover:bg-white/5 hover:text-white",
          collapsed && "justify-center px-0"
        )}
      >
        <Icon className="h-5 w-5 flex-shrink-0" />
        {!collapsed && (
          <div className="flex-1 flex items-center justify-between">
            <span className="text-left">{item.label}</span>
            <div className="flex items-center gap-2">
              {item.badge && (
                <span className="bg-primary/10 text-primary border border-primary/20 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
              {isActive && <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_5px_rgba(0,200,255,0.8)]" />}
            </div>
          </div>
        )}
      </Button>
    );

    if (collapsed) {
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent side="right" className="flex items-center gap-2">
            {item.label}
            {item.badge && (
              <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
          </TooltipContent>
        </Tooltip>
      );
    }

    return button;
  };

  return (
    <aside
      className={cn(
        "outlook-sidebar flex flex-col h-screen transition-all duration-300 border-r border-sidebar-border bg-black/20 backdrop-blur-md",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo Header Doctic Purple Style */}
      <div className="flex items-center gap-3 px-4 py-5 mb-4 border-b border-transparent">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/30 border border-primary/30 flex-shrink-0">
          <svg width="18" height="18" fill="none" stroke="currentColor" className="text-primary" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="font-extrabold text-[17px] tracking-wide text-white leading-tight">DOCTIC</span>
            <span className="text-[9px] text-primary tracking-[0.15em] uppercase mt-0.5">Medical OS</span>
          </div>
        )}
      </div>

      <nav className="flex-1 py-4 px-2 space-y-6 overflow-y-auto scrollbar-thin">
        {/* Main Modules */}
        <div className="space-y-1">
          {!collapsed && <h3 className="px-3 text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider mb-2">Principal</h3>}
          {navItems.map((item) => (
            <NavItemButton key={item.path} item={item} />
          ))}
        </div>

        {/* Content Modules */}
        <div className="space-y-1">
          {!collapsed && <h3 className="px-3 text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider mb-2">Contenu & Partage</h3>}
          {contentItems.map((item) => (
            <NavItemButton key={item.path} item={item} />
          ))}
        </div>
      </nav>

      {/* Bottom Navigation */}
      <div className="py-4 px-2 border-t border-sidebar-border space-y-1">
        {bottomNavItems.map((item) => (
          <NavItemButton key={item.path} item={item} />
        ))}

        {/* Theme Toggle */}
        <div className={cn(
          "flex items-center h-11 px-3 gap-2",
          collapsed && "justify-center px-0 flex-col h-auto py-2"
        )}>
          <ThemeToggle />
          <LanguageSwitcher />
        </div>
        
        {/* Notifications */}
        <div className={cn(
          "flex items-center h-11 px-3",
          collapsed && "justify-center px-0"
        )}>
          <NotificationCenter />
        </div>

        {/* Collapse Toggle */}
        <Button
          variant="ghost"
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "w-full justify-start gap-3 h-11 px-3 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent",
            collapsed && "justify-center px-0"
          )}
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <>
              <ChevronLeft className="h-5 w-5" />
              <span>Collapse</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}
