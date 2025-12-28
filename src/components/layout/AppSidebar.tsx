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
          "w-full justify-start gap-3 h-11 px-3 text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent",
          isActive && "bg-sidebar-accent text-sidebar-primary font-medium",
          collapsed && "justify-center px-0"
        )}
      >
        <Icon className="h-5 w-5 flex-shrink-0" />
        {!collapsed && (
          <>
            <span className="flex-1 text-left">{item.label}</span>
            {item.badge && (
              <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
          </>
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
        "outlook-sidebar flex flex-col h-screen transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo Header */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-sidebar-border">
        <div className="flex items-center justify-center w-9 h-9">
          <img src="/logo.png" alt="Doctic Logo" className="w-full h-full object-contain" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="font-bold text-lg text-sidebar-foreground">Doctic</span>
            <span className="text-xs text-sidebar-foreground/60">Medical OS</span>
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
          "flex items-center h-11 px-3",
          collapsed && "justify-center px-0"
        )}>
          <ThemeToggle />
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
