import { PageHeader } from "@/components/layout/page-header";
import { HealthInspectionClient } from "@/components/health-safety/health-safety-client";
import { ShieldAlert } from "lucide-react";

export default function HealthSafetyPage() {
  return (
    <div className="flex flex-col gap-8">
       <PageHeader
        title="OHS Incident Reporting"
        description="Create and search for Occupational Health & Safety incident records."
      />
      <HealthInspectionClient />
    </div>
  );
}
