import { PageHeader } from "@/components/layout/page-header";
import { HealthSafetyClient } from "@/components/health-safety/health-safety-client";

export default function HealthSafetyPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Health & Safety Management"
        description="Manage school safety protocols and incident reports."
      />
      <HealthSafetyClient />
    </div>
  );
}
