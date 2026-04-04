import { Search, Settings, CreditCard, PanelLeftOpen, PanelLeftClose } from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";
import { useNavigate } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

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
    <div className="h-[70px] bg-background/70 backdrop-blur-[20px] border-b border-white/5 px-8 flex items-center gap-6 sticky top-0 z-50">
      {/* Sidebar Toggle at Topbar end or start? User said "pret de l'icon dark mode" (Top Right) 
          but usually the toggle is at the start (Left). I'll place it near the title as a menu trigger. */}
      
      <button 
        onClick={onToggleSidebar}
        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white transition-all hover:bg-white/10"
      >
        {isSidebarCollapsed ? <PanelLeftOpen className="w-5 h-5 text-primary" /> : <PanelLeftClose className="w-5 h-5" />}
      </button>

      <div className="text-xl font-light text-white flex-1 tracking-tight uppercase">
        {words.join(' ')} {words.length > 0 && <span>&nbsp;</span>}<span className="font-black text-primary">{lastWord}</span>
      </div>
      
      <div className="hidden lg:flex relative items-center">
        <Search className="absolute left-4 w-4 h-4 text-white/20" />
        <input 
          placeholder="Explorer la plateforme..." 
          className="bg-white/5 border border-white/10 rounded-xl py-2.5 pr-4 pl-11 text-white text-[11px] font-sans w-[320px] outline-none transition-all focus:border-primary/40 focus:bg-white/10 placeholder:text-white/20"
        />
      </div>

      <div className="flex items-center gap-4 border-l border-white/10 pl-6 ml-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <button 
              onClick={() => navigate('/subscription')} 
              className="p-2 text-white/40 hover:text-primary transition-colors"
              aria-label="Mon Abonnement"
              title="Mon Abonnement"
            >
              <CreditCard className="w-5 h-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent>Mon Abonnement</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button 
              onClick={() => navigate('/settings')} 
              className="p-2 text-white/40 hover:text-primary transition-colors"
              aria-label="Paramètres"
              title="Paramètres"
            >
              <Settings className="w-5 h-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent>Paramètres</TooltipContent>
        </Tooltip>

        <div className="h-6 w-[1px] bg-white/10 mx-1" />

        <LanguageSwitcher />
        <ThemeToggle />
        <NotificationCenter />
      </div>
    </div>
  );
}
