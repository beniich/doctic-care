import { ReactNode } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ListPaneProps {
  title: string;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  actions?: ReactNode;
  children: ReactNode;
}

export function ListPane({
  title,
  searchPlaceholder = "Search...",
  onSearch,
  actions,
  children,
}: ListPaneProps) {
  return (
    <>
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          {actions}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            className="pl-9 bg-muted/50 border-0"
            onChange={(e) => onSearch?.(e.target.value)}
          />
        </div>
      </div>

      {/* List Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {children}
      </div>
    </>
  );
}
