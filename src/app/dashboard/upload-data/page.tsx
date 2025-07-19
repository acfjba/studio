"use client";

import React, { useState, type ChangeEvent, type FormEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UploadCloud, FileSpreadsheet, FileArchive, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PageHeader } from '@/components/layout/page-header';

export default function UploadDataPage() {
  const [file, setFile] = useState<File | null>(null);
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      const allowedTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'application/vnd.ms-excel', // .xls
        'application/zip', // .zip
        'application/x-zip-compressed' // .zip (alternative MIME type)
      ];
      if (allowedTypes.includes(selectedFile.type) || selectedFile.name.endsWith('.zip')) {
        setFile(selectedFile);
      } else {
        toast({
          variant: "destructive",
          title: "Invalid File Type",
          description: "Please upload a valid Excel (.xlsx, .xls) or ZIP (.zip) file.",
        });
        event.target.value = ''; // Clear the input
        setFile(null);
      }
    } else {
      setFile(null);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      toast({
        variant: "destructive",
        title: "No File Selected",
        description: "Please select an Excel or ZIP file to upload.",
      });
      return;
    }

    setIsSubmitting(true);
    console.log("File to upload:", file);
    console.log("Additional Information:", additionalInfo);

    // Simulate an upload process
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    toast({
      title: "Upload Successful (Simulated)",
      description: `File "${file.name}" and additional info have been logged.`,
    });
    // Reset form
    setFile(null);
    setAdditionalInfo('');
    // Clear file input visually
    const fileInput = document.getElementById('fileUploadInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <div className="flex flex-col gap-8">
        <PageHeader 
            title="Upload Data Files"
            description="Upload your Excel spreadsheets (.xlsx, .xls) or ZIP archives (.zip) along with any relevant notes or descriptions."
        />

        <Card className="shadow-xl rounded-lg max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="font-headline text-xl text-primary flex items-center">
              <FileSpreadsheet className="mr-2 h-6 w-6" />
              <FileArchive className="mr-2 h-6 w-6" />
              Data Upload Form
            </CardTitle>
            <CardDescription className="font-body text-muted-foreground">
              Select your Excel or ZIP file and provide additional details below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fileUploadInput" className="font-body font-semibold text-foreground flex items-center">
                  <UploadCloud className="mr-2 h-5 w-5" />
                  Excel or ZIP File
                </Label>
                <Input
                  id="fileUploadInput"
                  type="file"
                  accept=".xlsx,.xls,.zip"
                  onChange={handleFileChange}
                  required
                  className="font-body file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent/20 file:text-accent-foreground hover:file:bg-accent/30"
                />
                {file && <p className="text-sm text-muted-foreground font-body">Selected file: {file.name} ({file.type || 'N/A'})</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="additionalInfo" className="font-body font-semibold text-foreground flex items-center">
                  <Info className="mr-2 h-5 w-5" />
                  Additional Information (Optional)
                </Label>
                <Textarea
                  id="additionalInfo"
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  placeholder="E.g., Source of the data, specific instructions, context for the file..."
                  className="min-h-[100px] font-body"
                  rows={4}
                />
              </div>

              <Button
                type="submit"
                className="w-full font-bold font-body py-2.5 text-base"
                disabled={isSubmitting || !file}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    <UploadCloud className="mr-2 h-5 w-5" />
                    Upload Data
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
  );
}
