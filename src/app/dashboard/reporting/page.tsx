import { PageHeader } from "@/components/layout/page-header";
import { ReportingClient } from "@/components/reporting/reporting-client";

export default function ReportingPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Reporting & Analytics"
        description="Generate and view detailed reports on school performance."
      />
      <ReportingClient />
    </div>
  );
}
