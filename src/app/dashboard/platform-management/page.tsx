import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { School, Users, Database, Server, Bot } from "lucide-react";
import Link from "next/link";

export default function PlatformManagementPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Platform Administration"
        description="Manage schools, users, data, and application settings across the entire platform."
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline"><School className="w-5 h-5 text-primary" /> School Management</CardTitle>
            <CardDescription>Add, edit, or remove schools from the platform.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button>Manage Schools</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline"><Users className="w-5 h-5 text-primary" /> User Management</CardTitle>
            <CardDescription>Oversee all system administrators and high-level users.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button>Manage Users</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline"><Database className="w-5 h-5 text-primary" /> Data Management</CardTitle>
            <CardDescription>Perform system-wide database operations and backups.</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button variant="secondary">Seed Database</Button>
            <Button variant="destructive">Clear Database</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline"><Server className="w-5 h-5 text-primary" /> App Management</CardTitle>
            <CardDescription>Configure core application settings and integrations.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button>App Settings</Button>
          </CardContent>
        </Card>
      </div>
       <Card className="mt-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline"><Bot className="w-5 h-5 text-primary" /> AI-Powered Development</CardTitle>
          <CardDescription>Use the AI Assistant to build, modify, and manage this application by giving it conversational instructions.</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/dashboard/platform-management/ai-assistant">
            <Button>Launch AI Assistant</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
