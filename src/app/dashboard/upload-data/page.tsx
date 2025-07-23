
"use client";

import React, { useState, type ChangeEvent, type FormEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UploadCloud, FileArchive, Download, Info, Loader2 } from "lucide-react";
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
        'application/zip', 
        'application/x-zip-compressed', 
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'application/vnd.ms-excel', // .xls
      ];
      if (allowedTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
      } else {
        toast({
          variant: "destructive",
          title: "Invalid File Type",
          description: "Please upload a valid ZIP or Excel file.",
        });
        event.target.value = '';
        setFile(null);
      }
    } else {
      setFile(null);
    }
  };

  const handleDownloadSample = () => {
    const sampleContent = "This is a placeholder file for a ZIP archive sample. In a real application, this would be a downloadable ZIP file containing template spreadsheets (e.g., students.csv, staff.csv).";
    
    // Use a data URI to make the download more reliable in sandboxed environments.
    const encodedUri = encodeURI(`data:text/plain;charset=utf-8,${sampleContent}`);
    const link = document.createElement('a');
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "sample-template.zip");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Sample Downloaded",
      description: "A placeholder sample file has been downloaded.",
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      toast({
        variant: "destructive",
        title: "No File Selected",
        description: "Please select a file to upload.",
      });
      return;
    }

    setIsSubmitting(true);
    console.log("File to upload:", file.name);
    console.log("Additional Information:", additionalInfo);

    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    toast({
      title: "Upload Successful (Simulated)",
      description: `File "${file.name}" has been received for processing.`,
    });
    
    setFile(null);
    setAdditionalInfo('');
    const fileInput = document.getElementById('fileUploadInput') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  return (
    <div className="flex flex-col gap-8">
        <PageHeader 
            title="Bulk Data Management"
            description="Upload ZIP archives for bulk data processing."
        />

        <Card className="shadow-xl rounded-lg max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="font-headline text-xl text-primary flex items-center">
              <FileArchive className="mr-2 h-6 w-6" />
              ZIP Archive Upload
            </CardTitle>
            <CardDescription className="font-body text-muted-foreground">
              Upload a ZIP archive containing your data files.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fileUploadInput" className="font-body font-semibold text-foreground flex items-center">
                  <UploadCloud className="mr-2 h-5 w-5" />
                  ZIP Archive
                </Label>
                <Input
                  id="fileUploadInput"
                  type="file"
                  accept=".zip"
                  onChange={handleFileChange}
                  required
                  className="font-body file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent/20 file:text-accent-foreground hover:file:bg-accent/30"
                />
                {file && <p className="text-sm text-muted-foreground font-body">Selected file: {file.name}</p>}
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
                  placeholder="E.g., Source of the data, specific instructions for processing..."
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
                  <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Submitting...</>
                ) : (
                  <><UploadCloud className="mr-2 h-5 w-5" /> Upload & Process Data</>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <Button onClick={handleDownloadSample} variant="outline" className="w-full">
                <Download className="mr-2 h-4 w-4" /> Download Sample ZIP
            </Button>
          </CardFooter>
        </Card>
      </div>
  );
}
