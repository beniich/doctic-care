import { ReactNode, useState } from "react";
import { AppSidebar } from "./AppSidebar";
import { Topbar } from "./Topbar";

interface OutlookLayoutProps {
  title?: string;
  listPane?: ReactNode;
  detailPane?: ReactNode;
  singlePane?: ReactNode;
  children?: ReactNode;
}

export function OutlookLayout({ title, listPane, detailPane, singlePane, children }: OutlookLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  // Single pane mode for dashboard and similar pages
  if (singlePane) {
    return (
      <div className="outlook-layout bg-background overflow-hidden relative flex shadow-2xl">
        <AppSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
        <main className="flex-1 overflow-auto flex flex-col relative h-screen">
          <Topbar 
            title={title || "TABLEAU DE BORD"} 
            isSidebarCollapsed={collapsed} 
            onToggleSidebar={() => setCollapsed(!collapsed)} 
          />
          <div className="flex-1 overflow-auto scrollbar-thin">
            {singlePane}
            {children}
          </div>
        </main>
      </div>
    );
  }

  // Three-pane Outlook-style layout
  return (
    <div className="outlook-layout bg-background overflow-hidden relative flex">
      <AppSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar 
          title={title || "VUE DÉTAILLÉE"} 
          isSidebarCollapsed={collapsed} 
          onToggleSidebar={() => setCollapsed(!collapsed)} 
        />
        <div className="flex-1 flex overflow-hidden">
          <div className="outlook-list-pane w-80 flex flex-col border-r border-sidebar-border">
            {listPane}
          </div>
          <div className="outlook-detail-pane flex-1 flex flex-col overflow-auto bg-black/10">
            {detailPane}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
