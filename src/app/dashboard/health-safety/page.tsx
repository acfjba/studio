import { PageHeader } from "@/components/layout/page-header";
import { HealthInspectionClient } from "@/components/health-safety/health-safety-client";

export default function HealthSafetyPage() {
  return (
    <div className="flex flex-col gap-8">
      <HealthInspectionClient />
    </div>
  );
}
