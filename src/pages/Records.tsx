import { useState } from "react";
import { Plus, Filter, FileText as FileIcon, Download, Eye } from "lucide-react";
import { OutlookLayout } from "@/components/layout/OutlookLayout";
import { ListPane } from "@/components/layout/ListPane";
import { DetailPane } from "@/components/layout/DetailPane";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface MedicalRecord {
  id: string;
  patientName: string;
  patientId: string;
  type: "consultation" | "lab-result" | "prescription" | "imaging" | "procedure";
  title: string;
  date: string;
  provider: string;
  summary: string;
  attachments: number;
  status: "final" | "draft" | "pending-review";
}

const mockRecords: MedicalRecord[] = [
  {
    id: "1",
    patientName: "Sarah Johnson",
    patientId: "PAT-001",
    type: "consultation",
    title: "Annual Health Check-up",
    date: "2024-01-15",
    provider: "Dr. Anderson",
    summary: "Patient presents for annual wellness examination. Vital signs normal. Recommended routine blood work.",
    attachments: 2,
    status: "final",
  },
  {
    id: "2",
    patientName: "Michael Chen",
    patientId: "PAT-002",
    type: "lab-result",
    title: "Complete Blood Count (CBC)",
    date: "2024-01-14",
    provider: "Lab Services",
    summary: "All values within normal range. WBC: 7.2, RBC: 4.8, Hemoglobin: 14.5, Platelets: 250",
    attachments: 1,
    status: "final",
  },
  {
    id: "3",
    patientName: "Emma Williams",
    patientId: "PAT-003",
    type: "prescription",
    title: "Asthma Medication Renewal",
    date: "2024-01-12",
    provider: "Dr. Anderson",
    summary: "Renewed prescription for albuterol inhaler. 2 puffs every 4-6 hours as needed.",
    attachments: 0,
    status: "final",
  },
  {
    id: "4",
    patientName: "James Brown",
    patientId: "PAT-004",
    type: "imaging",
    title: "Chest X-Ray",
    date: "2024-01-10",
    provider: "Radiology Dept",
    summary: "No acute cardiopulmonary abnormality. Heart size normal. Lungs are clear.",
    attachments: 3,
    status: "pending-review",
  },
  {
    id: "5",
    patientName: "Olivia Davis",
    patientId: "PAT-005",
    type: "procedure",
    title: "Minor Laceration Repair",
    date: "2024-01-08",
    provider: "Dr. Martinez",
    summary: "2cm laceration on left forearm. Cleaned and sutured with 5 stitches. Follow-up in 7 days.",
    attachments: 1,
    status: "final",
  },
];

export default function Records() {
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRecords = mockRecords.filter((record) =>
    record.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTypeColor = (type: MedicalRecord["type"]) => {
    switch (type) {
      case "consultation":
        return "bg-primary/10 text-primary";
      case "lab-result":
        return "bg-accent/10 text-accent";
      case "prescription":
        return "bg-success/10 text-success";
      case "imaging":
        return "bg-info/10 text-info";
      case "procedure":
        return "bg-warning/10 text-warning";
    }
  };

  const getStatusColor = (status: MedicalRecord["status"]) => {
    switch (status) {
      case "final":
        return "status-success";
      case "draft":
        return "bg-muted text-muted-foreground";
      case "pending-review":
        return "status-warning";
    }
  };

  return (
    <OutlookLayout
      listPane={
        <ListPane
          title="Medical Records"
          searchPlaceholder="Search records..."
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
          {filteredRecords.map((record) => (
            <div
              key={record.id}
              onClick={() => setSelectedRecord(record)}
              className={cn(
                "list-item",
                selectedRecord?.id === record.id && "active"
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                  getTypeColor(record.type)
                )}>
                  <FileIcon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm truncate">
                      {record.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{record.patientName}</span>
                    <span>•</span>
                    <span>{new Date(record.date).toLocaleDateString()}</span>
                  </div>
                </div>
                <span className={cn("status-badge text-xs", getStatusColor(record.status))}>
                  {record.status.replace("-", " ")}
                </span>
              </div>
            </div>
          ))}
        </ListPane>
      }
      detailPane={
        <DetailPane
          title={selectedRecord?.title}
          subtitle={selectedRecord ? `${selectedRecord.patientName} • ${selectedRecord.patientId}` : undefined}
          onClose={() => setSelectedRecord(null)}
          emptyState={
            <div className="text-center">
              <p className="text-lg font-medium">Select a record</p>
              <p className="text-sm">Choose a record from the list to view details</p>
            </div>
          }
          actions={
            selectedRecord && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-1">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
                <Button variant="outline" size="sm" className="gap-1">
                  <Eye className="h-4 w-4" />
                  Print
                </Button>
              </div>
            )
          }
        >
          {selectedRecord && (
            <div className="space-y-6">
              {/* Record Info */}
              <div className="grid gap-4 md:grid-cols-2">
                <InfoCard label="Record Type" value={selectedRecord.type.replace("-", " ")} />
                <InfoCard label="Provider" value={selectedRecord.provider} />
                <InfoCard
                  label="Date"
                  value={new Date(selectedRecord.date).toLocaleDateString()}
                />
                <InfoCard label="Attachments" value={`${selectedRecord.attachments} files`} />
              </div>

              {/* Summary */}
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground mb-2">Summary</p>
                <p className="text-sm leading-relaxed">{selectedRecord.summary}</p>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
                <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                  View Full Record
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                  Add Note
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                  Share with Patient
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
