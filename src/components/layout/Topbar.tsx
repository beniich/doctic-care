import { Search, Bell } from "lucide-react";

export function Topbar({ title = "TABLEAU DE BORD" }: { title?: string }) {
  // Parsing the title to highlight the last word in Cyan as per design
  const words = title.split(' ');
  const lastWord = words.pop();
  
  return (
    <div className="h-[60px] bg-background/70 backdrop-blur-[20px] border-b border-primary/10 px-6 flex items-center gap-4 sticky top-0 z-50">
      <div className="text-base font-bold text-white flex-1 tracking-[0.02em] uppercase">
        {words.join(' ')} {words.length > 0 && <span>&nbsp;</span>}<span className="text-primary">{lastWord}</span>
      </div>
      
      <div className="relative flex items-center">
        <Search className="absolute left-3 w-3.5 h-3.5 text-white/25" />
        <input 
          placeholder="Rechercher..." 
          className="bg-white/5 border border-primary/20 rounded-[10px] py-[7px] pr-3 pl-[34px] text-white text-xs font-sans w-[220px] outline-none transition-colors focus:border-primary/50 placeholder:text-white/25"
        />
      </div>

      <button aria-label="Notifications" className="w-9 h-9 rounded-xl border border-primary/20 bg-white/5 flex items-center justify-center text-white/50 hover:text-white transition-colors relative cursor-pointer">
        <Bell className="w-4 h-4" />
        <div className="absolute top-[5px] right-[5px] w-2 h-2 rounded-full bg-warning border-[1.5px] border-background"></div>
      </button>

      <div className="flex items-center gap-1.5 bg-success/10 border border-success/20 rounded-full px-3 py-[5px] text-[10px] font-bold tracking-[0.1em] uppercase text-success">
        <div className="w-1.5 h-1.5 rounded-full bg-success animate-[pulse-soft_1.5s_infinite]"></div>
        EN LIGNE
      </div>
    </div>
  );
}
