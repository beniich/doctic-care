import { OutlookLayout } from "@/components/layout/OutlookLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Building2,
  Bell,
  Shield,
  Palette,
  Database,
  Wifi,
  WifiOff,
} from "lucide-react";

export default function Settings() {
  return (
    <OutlookLayout
      singlePane={
        <div className="p-8 max-w-4xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground mt-1">
              Manage your clinic preferences and system configuration
            </p>
          </div>

          {/* Profile Settings */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Profile Settings
              </CardTitle>
              <CardDescription>
                Your personal information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue="Dr. Sarah Anderson" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="dr.anderson@doctic.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" defaultValue="+1 (555) 123-4567" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialty">Specialty</Label>
                  <Input id="specialty" defaultValue="General Practice" />
                </div>
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>

          {/* Clinic Settings */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Clinic Information
              </CardTitle>
              <CardDescription>
                Your clinic's details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="clinic-name">Clinic Name</Label>
                  <Input id="clinic-name" defaultValue="Doctic Medical Center" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clinic-phone">Clinic Phone</Label>
                  <Input id="clinic-phone" defaultValue="+1 (555) 000-0000" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" defaultValue="123 Medical Plaza, Suite 100, New York, NY 10001" />
              </div>
              <Button>Update Clinic Info</Button>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Notifications
              </CardTitle>
              <CardDescription>
                Configure how you receive alerts and updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Appointment Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive reminders before scheduled appointments
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>New Patient Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when new patients register
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Billing Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Alerts for overdue payments and invoices
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Digest</Label>
                  <p className="text-sm text-muted-foreground">
                    Daily summary of clinic activities
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Security & Privacy
              </CardTitle>
              <CardDescription>
                Manage your security settings and access controls
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Button variant="outline" size="sm">Enable</Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Session Timeout</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically log out after 30 minutes of inactivity
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Audit Logging</Label>
                  <p className="text-sm text-muted-foreground">
                    Track all actions for compliance purposes
                  </p>
                </div>
                <Badge variant="secondary" className="status-success">Enabled</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Offline Mode */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                Offline Mode
              </CardTitle>
              <CardDescription>
                Configure offline-first functionality
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Wifi className="h-5 w-5 text-success" />
                  <div>
                    <Label>Connection Status</Label>
                    <p className="text-sm text-muted-foreground">
                      You are currently online
                    </p>
                  </div>
                </div>
                <Badge className="status-success">Connected</Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Offline Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Cache data locally for offline access
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto-Sync</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically sync data when connection is restored
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="pt-4">
                <Button variant="outline" className="gap-2">
                  <Database className="h-4 w-4" />
                  Sync Now
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                Appearance
              </CardTitle>
              <CardDescription>
                Customize the look and feel of your workspace
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Use dark theme for the interface
                  </p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Compact View</Label>
                  <p className="text-sm text-muted-foreground">
                    Show more content with reduced spacing
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </div>
      }
    />
  );
}
