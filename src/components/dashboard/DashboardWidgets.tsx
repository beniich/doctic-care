import { Users, Calendar, CreditCard, AlertCircle, TrendingUp, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: React.ElementType;
  iconColor?: string;
}

function StatCard({ title, value, change, changeType = "neutral", icon: Icon, iconColor }: StatCardProps) {
  return (
    <Card className="gradient-card group hover:border-primary/30 transition-all duration-300 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <CardHeader className="flex flex-row items-center justify-between pb-3 relative z-10">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={cn(
          "p-2.5 rounded-xl transition-all duration-300 group-hover:scale-110",
          iconColor || "bg-primary/10 group-hover:bg-primary/20"
        )}>
          <Icon className="h-5 w-5 text-primary group-hover:text-primary drop-shadow-glow" />
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="text-3xl font-bold mb-1 text-gradient-hover group-hover:text-gradient transition-all duration-300">
          {value}
        </div>
        {change && (
          <p className={cn(
            "text-xs font-medium flex items-center gap-1",
            changeType === "positive" && "text-success",
            changeType === "negative" && "text-destructive",
            changeType === "neutral" && "text-muted-foreground"
          )}>
            {changeType === "positive" && <TrendingUp className="h-3 w-3" />}
            {change}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export function DashboardStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Patients"
        value="2,847"
        change="+12.5% from last month"
        changeType="positive"
        icon={Users}
      />
      <StatCard
        title="Today's Appointments"
        value="18"
        change="5 completed, 3 pending"
        changeType="neutral"
        icon={Calendar}
        iconColor="bg-accent/10"
      />
      <StatCard
        title="Revenue (MTD)"
        value="$48,352"
        change="+8.2% from last month"
        changeType="positive"
        icon={CreditCard}
        iconColor="bg-success/10"
      />
      <StatCard
        title="Pending Actions"
        value="7"
        change="3 urgent"
        changeType="negative"
        icon={AlertCircle}
        iconColor="bg-warning/10"
      />
    </div>
  );
}

export function UpcomingAppointments() {
  const appointments = [
    { id: 1, patient: "Sarah Johnson", time: "09:00 AM", type: "Consultation", status: "confirmed" },
    { id: 2, patient: "Michael Chen", time: "10:30 AM", type: "Follow-up", status: "confirmed" },
    { id: 3, patient: "Emma Williams", time: "11:45 AM", type: "Lab Review", status: "pending" },
    { id: 4, patient: "James Brown", time: "02:00 PM", type: "Check-up", status: "confirmed" },
    { id: 5, patient: "Olivia Davis", time: "03:30 PM", type: "Consultation", status: "confirmed" },
  ];

  return (
    <Card className="gradient-card group hover:border-primary/30 transition-all duration-300 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <CardHeader className="flex flex-row items-center justify-between pb-3 relative z-10">
        <CardTitle className="flex items-center gap-2 text-primary">
          <Clock className="h-5 w-5" />
          Today's Schedule
        </CardTitle>
        <span className="text-sm text-muted-foreground">{appointments.length} appointments</span>
      </CardHeader>
      <CardContent className="space-y-3 relative z-10">
        {appointments.map((apt) => (
          <div
            key={apt.id}
            className="flex items-center justify-between p-3 rounded-lg bg-muted/10 hover:bg-muted transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-medium text-primary">
                  {apt.patient.split(" ").map((n) => n[0]).join("")}
                </span>
              </div>
              <div>
                <p className="font-medium text-sm text-foreground">{apt.patient}</p>
                <p className="text-xs text-muted-foreground">{apt.type}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">{apt.time}</p>
              <span className={cn(
                "status-badge text-xs",
                apt.status === "confirmed" ? "status-success" : "status-warning"
              )}>
                {apt.status}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function RecentActivity() {
  const activities = [
    { id: 1, action: "New patient registered", patient: "John Smith", time: "5 min ago", type: "patient" },
    { id: 2, action: "Prescription issued", patient: "Sarah Johnson", time: "12 min ago", type: "prescription" },
    { id: 3, action: "Payment received", patient: "Michael Chen", time: "25 min ago", type: "payment" },
    { id: 4, action: "Appointment rescheduled", patient: "Emma Williams", time: "1 hour ago", type: "appointment" },
    { id: 5, action: "Lab results uploaded", patient: "James Brown", time: "2 hours ago", type: "lab" },
  ];

  return (
    <Card className="gradient-card group hover:border-primary/30 transition-all duration-300 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <CardHeader className="flex flex-row items-center justify-between pb-3 relative z-10">
        <CardTitle className="flex items-center gap-2 text-accent">
          <TrendingUp className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 relative z-10">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3 group">
            <div className="w-2 h-2 rounded-full bg-primary mt-2 group-hover:scale-125 transition-transform" />
            <div className="flex-1 min-w-0">
              <p className="text-sm">
                <span className="font-medium text-foreground">{activity.action}</span>
                <span className="text-muted-foreground"> — {activity.patient}</span>
              </p>
              <p className="text-xs text-muted-foreground">{activity.time}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
