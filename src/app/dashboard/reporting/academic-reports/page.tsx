
"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function AcademicReportsPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Academic Reports"
        description="Generate and view reports on student performance and exam results."
      />
      <Card>
        <CardHeader>
          <CardTitle>Academic Report Generator</CardTitle>
          <CardDescription>This section is under development.</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-12">
            <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">The academic report generation feature is not yet available.</p>
        </CardContent>
      </Card>
    </div>
  );
}
