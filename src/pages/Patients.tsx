import { useState } from "react";
import { Plus, Filter } from "lucide-react";
import { OutlookLayout } from "@/components/layout/OutlookLayout";
import { ListPane } from "@/components/layout/ListPane";
import { DetailPane } from "@/components/layout/DetailPane";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  bloodType: string;
  lastVisit: string;
  status: "active" | "inactive" | "critical";
  conditions: string[];
  avatar?: string;
}

const mockPatients: Patient[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    dateOfBirth: "1985-03-15",
    gender: "Female",
    bloodType: "A+",
    lastVisit: "2024-01-15",
    status: "active",
    conditions: ["Hypertension", "Diabetes Type 2"],
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "m.chen@email.com",
    phone: "+1 (555) 234-5678",
    dateOfBirth: "1972-08-22",
    gender: "Male",
    bloodType: "O-",
    lastVisit: "2024-01-14",
    status: "critical",
    conditions: ["Cardiac Arrhythmia"],
  },
  {
    id: "3",
    name: "Emma Williams",
    email: "emma.w@email.com",
    phone: "+1 (555) 345-6789",
    dateOfBirth: "1990-11-08",
    gender: "Female",
    bloodType: "B+",
    lastVisit: "2024-01-10",
    status: "active",
    conditions: ["Asthma"],
  },
  {
    id: "4",
    name: "James Brown",
    email: "james.brown@email.com",
    phone: "+1 (555) 456-7890",
    dateOfBirth: "1968-05-30",
    gender: "Male",
    bloodType: "AB+",
    lastVisit: "2024-01-08",
    status: "inactive",
    conditions: [],
  },
  {
    id: "5",
    name: "Olivia Davis",
    email: "olivia.d@email.com",
    phone: "+1 (555) 567-8901",
    dateOfBirth: "1995-02-14",
    gender: "Female",
    bloodType: "A-",
    lastVisit: "2024-01-12",
    status: "active",
    conditions: ["Allergies", "Migraine"],
  },
];

export default function Patients() {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPatients = mockPatients.filter((patient) =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: Patient["status"]) => {
    switch (status) {
      case "active":
        return "status-success";
      case "critical":
        return "status-error";
      case "inactive":
        return "status-warning";
    }
  };

  return (
    <OutlookLayout
      listPane={
        <ListPane
          title="Patients"
          searchPlaceholder="Search patients..."
          onSearch={setSearchQuery}
          actions={
            <div className="flex gap-2">
              <Button variant="ghost" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              <Button size="sm" className="gap-1">
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>
          }
        >
          {filteredPatients.map((patient) => (
            <div
              key={patient.id}
              onClick={() => setSelectedPatient(patient)}
              className={cn(
                "list-item",
                selectedPatient?.id === patient.id && "active"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-medium text-primary">
                    {patient.name.split(" ").map((n) => n[0]).join("")}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm truncate">
                      {patient.name}
                    </span>
                    <span className={cn("status-badge", getStatusColor(patient.status))}>
                      {patient.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    Last visit: {new Date(patient.lastVisit).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </ListPane>
      }
      detailPane={
        <DetailPane
          title={selectedPatient?.name}
          subtitle={selectedPatient ? `Patient ID: ${selectedPatient.id}` : undefined}
          onClose={() => setSelectedPatient(null)}
          emptyState={
            <div className="text-center">
              <p className="text-lg font-medium">Select a patient</p>
              <p className="text-sm">Choose a patient from the list to view details</p>
            </div>
          }
          actions={
            selectedPatient && (
              <Button size="sm">Edit Patient</Button>
            )
          }
        >
          {selectedPatient && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid gap-4 md:grid-cols-2">
                <InfoCard label="Email" value={selectedPatient.email} />
                <InfoCard label="Phone" value={selectedPatient.phone} />
                <InfoCard
                  label="Date of Birth"
                  value={new Date(selectedPatient.dateOfBirth).toLocaleDateString()}
                />
                <InfoCard label="Gender" value={selectedPatient.gender} />
                <InfoCard label="Blood Type" value={selectedPatient.bloodType} />
                <InfoCard
                  label="Last Visit"
                  value={new Date(selectedPatient.lastVisit).toLocaleDateString()}
                />
              </div>

              {/* Medical Conditions */}
              {selectedPatient.conditions.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Medical Conditions
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedPatient.conditions.map((condition) => (
                      <Badge key={condition} variant="secondary">
                        {condition}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
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
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}
