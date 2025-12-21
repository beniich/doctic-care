import { ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";

interface OutlookLayoutProps {
  listPane?: ReactNode;
  detailPane?: ReactNode;
  singlePane?: ReactNode;
}

export function OutlookLayout({ listPane, detailPane, singlePane }: OutlookLayoutProps) {
  // Single pane mode for dashboard and similar pages
  if (singlePane) {
    return (
      <div className="outlook-layout">
        <AppSidebar />
        <main className="flex-1 overflow-auto scrollbar-thin">
          {singlePane}
        </main>
      </div>
    );
  }

  // Three-pane Outlook-style layout
  return (
    <div className="outlook-layout">
      <AppSidebar />
      <div className="outlook-list-pane w-80 flex flex-col">
        {listPane}
      </div>
      <div className="outlook-detail-pane flex flex-col">
        {detailPane}
      </div>
    </div>
  );
}
