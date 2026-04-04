import { Search, Settings, CreditCard, PanelLeftOpen, PanelLeftClose, Bell } from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";
import { useNavigate } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface TopbarProps {
  title?: string;
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

export function Topbar({ title = "TABLEAU DE BORD", isSidebarCollapsed, onToggleSidebar }: TopbarProps) {
  const navigate = useNavigate();
  // Parsing the title to highlight the last word
  const words = title.split(' ');
  const lastWord = words.pop();
  
  return (
    <div className="h-[74px] bg-background/60 backdrop-blur-[24px] border-b border-foreground/5 px-8 flex items-center gap-6 sticky top-0 z-50 transition-all duration-300">
      
      {/* Dynamic Sidebar Toggle matching image 1/4 style */}
      <button 
        onClick={onToggleSidebar}
        className="w-11 h-11 flex items-center justify-center rounded-2xl bg-foreground/5 border border-foreground/10 text-foreground/50 hover:text-primary transition-all hover:bg-foreground/10 hover:shadow-lg active:scale-95 group"
      >
        {isSidebarCollapsed ? 
          <PanelLeftOpen className="w-5 h-5 text-primary group-hover:neon-pulse" /> : 
          <PanelLeftClose className="w-5 h-5 group-hover:text-primary" />
        }
      </button>

      {/* Title - Leonardo/Agro Style */}
      <div className="text-xl font-light text-foreground flex-1 tracking-tight uppercase select-none">
        <span className="opacity-60">{words.join(' ')}</span> {words.length > 0 && <span>&nbsp;</span>}<span className="font-black text-primary drop-shadow-[0_0_10px_hsla(var(--primary)/0.3)]">{lastWord}</span>
      </div>
      
      {/* Search Bar - Precisely as in Image 1 "Explorer..." */}
      <div className="hidden lg:flex relative items-center group max-w-md w-full">
        <Search className="absolute left-4 w-4 h-4 text-foreground/30 group-focus-within:text-primary transition-colors" />
        <input 
          placeholder="Explorer la plateforme ou les dossiers patients..." 
          className="bg-foreground/[0.03] border border-foreground/10 rounded-2xl py-3 pr-4 pl-12 text-foreground text-[12px] font-sans w-full outline-none transition-all focus:border-primary/40 focus:bg-foreground/[0.06] focus:ring-4 focus:ring-primary/5 placeholder:text-foreground/25"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 border-l border-foreground/10 pl-6 ml-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <button 
              onClick={() => navigate('/subscription')} 
              className="w-10 h-10 flex items-center justify-center rounded-xl text-foreground/40 hover:text-primary hover:bg-foreground/5 transition-all"
              aria-label="Mon Abonnement"
            >
              <CreditCard className="w-5 h-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent className="glass-card">Mon Abonnement</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button 
              onClick={() => navigate('/settings')} 
              className="w-10 h-10 flex items-center justify-center rounded-xl text-foreground/40 hover:text-primary hover:bg-foreground/5 transition-all"
              aria-label="Paramètres"
            >
              <Settings className="w-5 h-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent className="glass-card">Paramètres</TooltipContent>
        </Tooltip>

        <div className="h-6 w-[1px] bg-foreground/10 mx-2" />

        <div className="flex items-center gap-1.5 glass-card px-2 py-1 bg-foreground/[0.03]">
            <LanguageSwitcher />
            <ThemeToggle />
            <NotificationCenter />
        </div>
      </div>
    </div>
  );
}

