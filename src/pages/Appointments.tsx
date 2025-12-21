import { useState } from "react";
import { Plus, Filter, Clock, Video, MapPin } from "lucide-react";
import { OutlookLayout } from "@/components/layout/OutlookLayout";
import { ListPane } from "@/components/layout/ListPane";
import { DetailPane } from "@/components/layout/DetailPane";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Appointment {
  id: string;
  patientName: string;
  patientEmail: string;
  doctorName: string;
  date: string;
  time: string;
  duration: number;
  type: "consultation" | "follow-up" | "procedure" | "telehealth";
  status: "scheduled" | "confirmed" | "in-progress" | "completed" | "cancelled";
  reason: string;
  notes?: string;
  location?: string;
}

const mockAppointments: Appointment[] = [
  {
    id: "1",
    patientName: "Sarah Johnson",
    patientEmail: "sarah.johnson@email.com",
    doctorName: "Dr. Anderson",
    date: "2024-01-16",
    time: "09:00",
    duration: 30,
    type: "consultation",
    status: "confirmed",
    reason: "Annual check-up",
    notes: "Patient requested blood work",
    location: "Room 101",
  },
  {
    id: "2",
    patientName: "Michael Chen",
    patientEmail: "m.chen@email.com",
    doctorName: "Dr. Anderson",
    date: "2024-01-16",
    time: "10:30",
    duration: 45,
    type: "follow-up",
    status: "scheduled",
    reason: "Post-surgery follow-up",
    location: "Room 102",
  },
  {
    id: "3",
    patientName: "Emma Williams",
    patientEmail: "emma.w@email.com",
    doctorName: "Dr. Anderson",
    date: "2024-01-16",
    time: "11:45",
    duration: 30,
    type: "telehealth",
    status: "confirmed",
    reason: "Prescription renewal",
  },
  {
    id: "4",
    patientName: "James Brown",
    patientEmail: "james.brown@email.com",
    doctorName: "Dr. Anderson",
    date: "2024-01-16",
    time: "14:00",
    duration: 60,
    type: "procedure",
    status: "scheduled",
    reason: "Minor procedure",
    notes: "Patient should fast for 8 hours",
    location: "Procedure Room A",
  },
  {
    id: "5",
    patientName: "Olivia Davis",
    patientEmail: "olivia.d@email.com",
    doctorName: "Dr. Anderson",
    date: "2024-01-16",
    time: "15:30",
    duration: 30,
    type: "consultation",
    status: "confirmed",
    reason: "Headache consultation",
    location: "Room 103",
  },
];

export default function Appointments() {
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAppointments = mockAppointments.filter((apt) =>
    apt.patientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: Appointment["status"]) => {
    switch (status) {
      case "confirmed":
        return "status-success";
      case "scheduled":
        return "status-info";
      case "in-progress":
        return "status-warning";
      case "completed":
        return "bg-muted text-muted-foreground";
      case "cancelled":
        return "status-error";
    }
  };

  const getTypeIcon = (type: Appointment["type"]) => {
    switch (type) {
      case "telehealth":
        return <Video className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  return (
    <OutlookLayout
      listPane={
        <ListPane
          title="Appointments"
          searchPlaceholder="Search appointments..."
          onSearch={setSearchQuery}
          actions={
            <div className="flex gap-2">
              <Button variant="ghost" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              <Button size="sm" className="gap-1">
                <Plus className="h-4 w-4" />
                New
              </Button>
            </div>
          }
        >
          {filteredAppointments.map((apt) => (
            <div
              key={apt.id}
              onClick={() => setSelectedAppointment(apt)}
              className={cn(
                "list-item",
                selectedAppointment?.id === apt.id && "active"
              )}
            >
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center text-center min-w-[50px]">
                  <span className="text-lg font-bold text-primary">{apt.time}</span>
                  <span className="text-xs text-muted-foreground">{apt.duration}m</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm truncate">
                      {apt.patientName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {getTypeIcon(apt.type)}
                    <span className="capitalize">{apt.type}</span>
                  </div>
                </div>
                <span className={cn("status-badge text-xs", getStatusColor(apt.status))}>
                  {apt.status}
                </span>
              </div>
            </div>
          ))}
        </ListPane>
      }
      detailPane={
        <DetailPane
          title={selectedAppointment?.patientName}
          subtitle={
            selectedAppointment
              ? `${new Date(selectedAppointment.date).toLocaleDateString()} at ${selectedAppointment.time}`
              : undefined
          }
          onClose={() => setSelectedAppointment(null)}
          emptyState={
            <div className="text-center">
              <p className="text-lg font-medium">Select an appointment</p>
              <p className="text-sm">Choose an appointment from the list to view details</p>
            </div>
          }
          actions={
            selectedAppointment && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Reschedule</Button>
                <Button size="sm">Start Visit</Button>
              </div>
            )
          }
        >
          {selectedAppointment && (
            <div className="space-y-6">
              {/* Appointment Info */}
              <div className="grid gap-4 md:grid-cols-2">
                <InfoCard label="Patient Email" value={selectedAppointment.patientEmail} />
                <InfoCard label="Provider" value={selectedAppointment.doctorName} />
                <InfoCard
                  label="Date & Time"
                  value={`${new Date(selectedAppointment.date).toLocaleDateString()} at ${selectedAppointment.time}`}
                />
                <InfoCard label="Duration" value={`${selectedAppointment.duration} minutes`} />
                <InfoCard label="Type" value={selectedAppointment.type} />
                {selectedAppointment.location && (
                  <InfoCard label="Location" value={selectedAppointment.location} />
                )}
              </div>

              {/* Reason & Notes */}
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Reason for Visit</p>
                  <p className="text-sm">{selectedAppointment.reason}</p>
                </div>

                {selectedAppointment.notes && (
                  <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
                    <p className="text-xs text-warning mb-1 font-medium">Notes</p>
                    <p className="text-sm">{selectedAppointment.notes}</p>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
                <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                  View Patient Record
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                  Send Reminder
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                  Add to Calendar
                </Badge>
              </div>
            </div>
          )}
        </DetailPane>
      }
    />
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 rounded-lg bg-muted/50">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="text-sm font-medium capitalize">{value}</p>
    </div>
  );
}
