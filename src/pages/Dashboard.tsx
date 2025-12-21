import { OutlookLayout } from "@/components/layout/OutlookLayout";
import { DashboardStats, UpcomingAppointments, RecentActivity } from "@/components/dashboard/DashboardWidgets";
import heroMedicalBg from "@/assets/hero-medical-bg.jpg";

export default function Dashboard() {
  return (
    <OutlookLayout
      singlePane={
        <div className="min-h-full">
          {/* Hero Section */}
          <div 
            className="relative h-48 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroMedicalBg})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-accent/80" />
            <div className="relative h-full flex flex-col justify-center px-8">
              <h1 className="text-3xl font-bold text-primary-foreground">
                Welcome back, Dr. Anderson
              </h1>
              <p className="text-primary-foreground/80 mt-2">
                Here's an overview of your clinic today
              </p>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="p-8 space-y-8 -mt-8 relative">
            {/* Stats Cards */}
            <DashboardStats />

            {/* Two Column Layout */}
            <div className="grid gap-6 lg:grid-cols-2">
              <UpcomingAppointments />
              <RecentActivity />
            </div>
          </div>
        </div>
      }
    />
  );
}
