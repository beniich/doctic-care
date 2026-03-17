import { ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";
import { Topbar } from "./Topbar";

interface OutlookLayoutProps {
  title?: string;
  listPane?: ReactNode;
  detailPane?: ReactNode;
  singlePane?: ReactNode;
}

export function OutlookLayout({ title, listPane, detailPane, singlePane }: OutlookLayoutProps) {
  // Single pane mode for dashboard and similar pages
  if (singlePane) {
    return (
      <div className="outlook-layout bg-background overflow-hidden">
        <AppSidebar />
        <main className="flex-1 overflow-auto scrollbar-thin flex flex-col relative w-full h-screen">
          <Topbar title={title || "TABLEAU DE BORD"} />
          <div className="flex-1 overflow-auto">
            {singlePane}
          </div>
        </main>
      </div>
    );
  }

  // Three-pane Outlook-style layout
  return (
    <div className="outlook-layout bg-background overflow-hidden relative">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title={title || "VUE DÉTAILLÉE"} />
        <div className="flex-1 flex overflow-hidden">
          <div className="outlook-list-pane w-80 flex flex-col border-r border-sidebar-border">
            {listPane}
          </div>
          <div className="outlook-detail-pane flex-1 flex flex-col overflow-auto bg-black/10">
            {detailPane}
          </div>
        </div>
      </div>
    </div>
  );
}
