import { Search } from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";

export function Topbar({ title = "TABLEAU DE BORD" }: { title?: string }) {
  // Parsing the title to highlight the last word in Cyan as per design
  const words = title.split(' ');
  const lastWord = words.pop();
  
  return (
    <div className="h-[70px] bg-background/70 backdrop-blur-[20px] border-b border-white/5 px-8 flex items-center gap-6 sticky top-0 z-50">
      <div className="text-xl font-light text-white flex-1 tracking-tight uppercase">
        {words.join(' ')} {words.length > 0 && <span>&nbsp;</span>}<span className="font-black text-primary">{lastWord}</span>
      </div>
      
      <div className="hidden md:flex relative items-center">
        <Search className="absolute left-4 w-4 h-4 text-white/20" />
        <input 
          placeholder="Rechercher dans Doctic..." 
          className="bg-white/5 border border-white/10 rounded-xl py-2.5 pr-4 pl-11 text-white text-xs font-sans w-[280px] outline-none transition-all focus:border-primary/40 focus:bg-white/10 placeholder:text-white/20"
        />
      </div>

      <div className="flex items-center gap-4 border-l border-white/10 pl-6 ml-2">
        <LanguageSwitcher />
        <ThemeToggle />
        <NotificationCenter />
        
        <div className="hidden lg:flex items-center gap-2 bg-success/10 border border-success/20 rounded-full px-4 py-1.5 text-[10px] font-black tracking-[0.15em] uppercase text-success">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
          SYNC
        </div>
      </div>
    </div>
  );
}
