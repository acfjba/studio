
"use client";

import React from 'react';
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LessonPlanSchema, type LessonPlanFormData } from "@/lib/schemas/lesson-planner";
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Printer, Download, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const terms = ["1", "2", "3", "4"];
const weeks = Array.from({ length: 14 }, (_, i) => (i + 1).toString());

export default function LessonPlannerPage() {
    const { toast } = useToast();
    const { 
        register, 
        handleSubmit, 
        control, 
        getValues,
        formState: { errors, isSubmitting } 
    } = useForm<LessonPlanFormData>({
        resolver: zodResolver(LessonPlanSchema),
        defaultValues: {
            subject: "",
            topic: "",
            term: "",
            week: "",
            objectives: "",
            activities: "",
            resources: "",
            assessment: ""
        }
    });

    const onSubmitHandler: SubmitHandler<LessonPlanFormData> = async (data) => {
        console.log("Submitting Lesson Plan (Simulated):", data);
        await new Promise(resolve => setTimeout(resolve, 1500));
        toast({
            title: "Lesson Plan Saved (Simulated)",
            description: `Your lesson plan for ${data.subject} - Week ${data.week} has been saved.`,
        });
    };

    const handleEmailPlan = () => {
        toast({
            title: "Emailing Plan (Simulated)",
            description: "An email would be sent from your address to the Head Teacher for review.",
        });
    };

    const handlePrint = () => {
        toast({ title: "Printing Plan...", description: "Use your browser's print dialog to save as PDF or print." });
        window.print();
    };

    const handleExportCsv = () => {
        const data = getValues();
        const headers = ["Subject", "Topic", "Term", "Week", "Objectives", "Activities", "Resources", "Assessment"];
        const row = [
            `"${(data.subject || "").replace(/"/g, '""')}"`,
            `"${(data.topic || "").replace(/"/g, '""')}"`,
            `"${data.term}"`,
            `"${data.week}"`,
            `"${(data.objectives || "").replace(/"/g, '""')}"`,
            `"${(data.activities || "").replace(/"/g, '""')}"`,
            `"${(data.resources || "").replace(/"/g, '""')}"`,
            `"${(data.assessment || "").replace(/"/g, '""')}"`
        ];
        
        const csvContent = "data:text/csv;charset=utf-8," 
        + headers.join(',') + '\n' + row.join(',');
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `lesson_plan_${data.subject || 'untitled'}_week_${data.week || 'na'}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast({ title: "Exported to CSV", description: "The lesson plan data has been downloaded." });
    };

    return (
        <div className="flex flex-col gap-8 printable-area">
            <PageHeader
                title="Lesson Planner"
                description="Create a detailed lesson plan for a specific subject and week."
            />
            <Card className="shadow-xl rounded-lg w-full max-w-4xl mx-auto">
                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label htmlFor="subject">Subject</Label>
                                <Input id="subject" {...register("subject")} placeholder="e.g., Mathematics" />
                                {errors.subject && <p className="text-destructive text-xs mt-1">{errors.subject.message}</p>}
                            </div>
                            <div>
                                <Label htmlFor="topic">Topic</Label>
                                <Input id="topic" {...register("topic")} placeholder="e.g., Introduction to Algebra" />
                                {errors.topic && <p className="text-destructive text-xs mt-1">{errors.topic.message}</p>}
                            </div>
                            <div>
                                <Label htmlFor="term">Term</Label>
                                <Controller
                                    name="term"
                                    control={control}
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger><SelectValue placeholder="Select Term" /></SelectTrigger>
                                            <SelectContent>
                                                {terms.map(t => <SelectItem key={t} value={t}>Term {t}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.term && <p className="text-destructive text-xs mt-1">{errors.term.message}</p>}
                            </div>
                            <div>
                                <Label htmlFor="week">Week</Label>
                                <Controller
                                    name="week"
                                    control={control}
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger><SelectValue placeholder="Select Week" /></SelectTrigger>
                                            <SelectContent>
                                                {weeks.map(w => <SelectItem key={w} value={w}>Week {w}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.week && <p className="text-destructive text-xs mt-1">{errors.week.message}</p>}
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="objectives">Learning Objectives</Label>
                            <Textarea id="objectives" {...register("objectives")} rows={3} placeholder="List what students will be able to do by the end of the lesson..." />
                            {errors.objectives && <p className="text-destructive text-xs mt-1">{errors.objectives.message}</p>}
                        </div>
                        
                        <div>
                            <Label htmlFor="activities">Learning Activities</Label>
                            <Textarea id="activities" {...register("activities")} rows={5} placeholder="Describe the sequence of activities (e.g., Monday: Introduction, Tuesday: Group work...)" />
                            {errors.activities && <p className="text-destructive text-xs mt-1">{errors.activities.message}</p>}
                        </div>

                        <div>
                            <Label htmlFor="resources">Resources</Label>
                            <Textarea id="resources" {...register("resources")} rows={3} placeholder="List all materials, textbooks, digital tools, etc., needed for the lesson." />
                            {errors.resources && <p className="text-destructive text-xs mt-1">{errors.resources.message}</p>}
                        </div>
                        
                        <div>
                            <Label htmlFor="assessment">Assessment Methods</Label>
                            <Textarea id="assessment" {...register("assessment")} rows={3} placeholder="How will you measure student understanding? (e.g., Quiz, Observation, Exit ticket...)" />
                            {errors.assessment && <p className="text-destructive text-xs mt-1">{errors.assessment.message}</p>}
                        </div>

                        <div className="flex flex-wrap justify-end gap-4 pt-4 print:hidden">
                            <Button variant="outline" type="button" onClick={handleExportCsv} disabled={isSubmitting}>
                                <Download className="mr-2 h-4 w-4" /> Export as CSV
                            </Button>
                            <Button variant="outline" type="button" onClick={handlePrint} disabled={isSubmitting}>
                                <Printer className="mr-2 h-4 w-4" /> Print / Save PDF
                            </Button>
                            <Button variant="outline" type="button" onClick={handleEmailPlan} disabled={isSubmitting}>
                                <Mail className="mr-2 h-4 w-4" /> Email Plan
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                <Save className="mr-2 h-5 w-5" />
                                {isSubmitting ? "Saving..." : "Save Lesson Plan"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
