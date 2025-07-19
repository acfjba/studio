import { PageHeader } from "@/components/layout/page-header";
import { AiAssistantClient } from "./ai-assistant-client";
import { Bot } from "lucide-react";

export default function AiAssistantPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
       <PageHeader
        title="AI Assistant"
        description="Your personal assistant for developing and managing this application."
      />
      <AiAssistantClient />
    </div>
  );
}
