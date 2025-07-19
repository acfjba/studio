"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardList, AlertTriangle } from "lucide-react";

export function HealthSafetyClient() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline">
            <ClipboardList className="w-5 h-5 text-primary" /> Safety Inspections
          </CardTitle>
          <CardDescription>
            Conduct and review safety inspections for school facilities.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button>Manage Inspections</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline">
            <AlertTriangle className="w-5 h-5 text-primary" /> Incident Reports
          </CardTitle>
          <CardDescription>
            Log and manage all health and safety incidents.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button>View & Report Incidents</Button>
        </CardContent>
      </Card>
    </div>
  );
}
