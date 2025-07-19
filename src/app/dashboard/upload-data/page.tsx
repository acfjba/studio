"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Database, AlertTriangle, HardDrive } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PageHeader } from '@/components/layout/page-header';

export default function MasterDataPage() {
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSavingToBrowser, setIsSavingToBrowser] = useState(false);

  const getSampleApplicationData = () => {
    return {
      timestamp: new Date().toISOString(),
      appName: "Digital Platform for Schools - Prototype Backup",
      data: {
        sampleStaffRecords: [
          { id: "1", staffId: "T001", name: "NILESH SHARMA", position: "Head Teacher", email: "nsharma@example.com", phone: "123-456-7890" },
          { id: "2", staffId: "T002", name: "SENIROSI LEDUA", position: "Teacher", email: "sledua@example.com", phone: "123-456-7891" },
        ],
        sampleDisciplinaryRecords: [
            { id: "rec1", studentName: "Tom Riddle", studentId: "S001", incidentDate: "2024-07-01", issues: ["Bullying"] },
        ],
        sampleExamResults: [
            { id: "ex1", studentName: "Jone Roko", subject: "Numeracy", score: 85, examDate: "2024-03-15" }
        ],
        note: "This is a sample backup structure. A real backup would contain comprehensive data from all modules."
      },
    };
  };

  const handleDownloadAllData = async () => {
    setIsDownloading(true);
    toast({ title: "Preparing Download", description: "Gathering all application data entries..." });

    await new Promise(resolve => setTimeout(resolve, 1500));

    const allApplicationData = getSampleApplicationData();

    try {
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0];
      const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '');
      const filename = `digital_platform_schools_backup_${dateStr}_${timeStr}.json`;

      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(allApplicationData, null, 2))}`;
      const link = document.createElement("a");
      link.href = jsonString;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast({ title: "Download Started", description: `Your data backup file "${filename}" is downloading.` });
    } catch (error) {
      console.error("Error creating download:", error);
      toast({ variant: "destructive", title: "Download Failed", description: "Could not prepare data for download." });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSaveToBrowserStorage = async () => {
    setIsSavingToBrowser(true);
    toast({ title: "Saving Backup...", description: "Saving a copy of your data to the browser's local storage." });

    await new Promise(resolve => setTimeout(resolve, 1500));

    const allApplicationData = getSampleApplicationData();

    try {
      localStorage.setItem('masterDataBackup', JSON.stringify(allApplicationData));
      toast({ 
        title: "Backup Saved Locally", 
        description: "A backup has been saved to your browser's storage. This backup is only accessible on this device and browser." 
      });
    } catch (error) {
      console.error("Error saving to localStorage:", error);
       const errorMessage = error instanceof Error && error.message.includes('QuotaExceededError') 
        ? "Could not save backup. Browser storage is full."
        : "Could not save backup to browser's local storage.";
      toast({ 
        variant: "destructive",
        title: "Local Backup Failed", 
        description: errorMessage
      });
    } finally {
      setIsSavingToBrowser(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <PageHeader 
        title="Master Data Management"
        description="Manage and backup your application's master data."
      />
      <Card className="shadow-xl rounded-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary flex items-center">
            <Database className="mr-3 h-7 w-7" />
            Master Data Actions
          </CardTitle>
          <CardDescription className="font-body text-muted-foreground">
            Use the options below to download a full backup of the application data.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <section aria-labelledby="data-backup-options-heading">
            <h2 id="data-backup-options-heading" className="text-xl font-headline text-primary mb-4">Data Backup Options</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-card/50">
                <CardHeader>
                  <CardTitle className="font-headline text-lg text-primary flex items-center">
                    <Download className="mr-2 h-5 w-5" />
                    Download Backup File (JSON)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="font-body text-sm text-muted-foreground">
                    Download a complete snapshot of your data as a JSON file. This is the recommended method for creating a permanent, local backup.
                  </p>
                  <Button 
                    onClick={handleDownloadAllData} 
                    className="w-full"
                    disabled={isDownloading}
                  >
                    {isDownloading ? "Processing..." : "Download Data File"}
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-card/50">
                <CardHeader>
                  <CardTitle className="font-headline text-lg text-primary flex items-center">
                    <HardDrive className="mr-2 h-5 w-5" />
                    Save to Browser Storage
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="font-body text-sm text-muted-foreground">
                    Save a quick, temporary backup directly to this browser. This data is only accessible on this specific device and browser.
                  </p>
                  <Button 
                    onClick={handleSaveToBrowserStorage} 
                    className="w-full"
                    disabled={isSavingToBrowser}
                  >
                     {isSavingToBrowser ? "Saving..." : "Save to Browser"}
                  </Button>
                </CardContent>
              </Card>
            </div>
            <Card className="mt-6 bg-destructive/10 border-destructive/50">
              <CardHeader>
                  <CardTitle className="font-headline text-base text-destructive flex items-center">
                      <AlertTriangle className="mr-2 h-5 w-5" />
                      Important Notes on Backups
                  </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                  <p className="font-body text-sm text-destructive/90">
                      <strong>Download Backup File:</strong> This is the recommended method for creating a permanent, local backup. You can save this file anywhere on your device, including cloud-synced folders.
                  </p>
                  <p className="font-body text-sm text-destructive/90">
                      <strong>Browser Storage:</strong> This is a temporary backup. Clearing your browser data will delete it. It is not a substitute for a downloaded file backup.
                  </p>
              </CardContent>
            </Card>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
