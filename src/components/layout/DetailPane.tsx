import { ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DetailPaneProps {
  title?: string;
  subtitle?: string;
  onClose?: () => void;
  actions?: ReactNode;
  children: ReactNode;
  emptyState?: ReactNode;
}

export function DetailPane({
  title,
  subtitle,
  onClose,
  actions,
  children,
  emptyState,
}: DetailPaneProps) {
  if (!title && emptyState) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        {emptyState}
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="flex-shrink-0 px-6 py-4 border-b border-border bg-card/50">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            {title && (
              <h2 className="text-xl font-semibold text-foreground truncate">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
            )}
          </div>
          <div className="flex items-center gap-2 ml-4">
            {actions}
            {onClose && (
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-6 animate-fade-in">
        {children}
      </div>
    </>
  );
}
