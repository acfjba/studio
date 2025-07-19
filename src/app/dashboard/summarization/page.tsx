import { PageHeader } from "@/components/layout/page-header";
import { SummarizationClient } from "@/components/summarization/summarization-client";

export default function SummarizationPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="AI Document Summarization"
        description="Generate concise summaries from counselling notes, work plans, and records."
      />
      <SummarizationClient />
    </div>
  );
}
