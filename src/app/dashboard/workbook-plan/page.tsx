
"use client";

import React, { useState } from 'react';
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { PageHeader } from "@/components/layout/page-header";
import { generateLessonPlan, type GenerateLessonPlanOutput } from "@/ai/flows/generate-lesson-plan";
import { Loader2, Wand2, PlusCircle, Trash2, FileText, Printer, Save, FilePlus2 } from "lucide-react";
import { Skeleton } from '@/components/ui/skeleton';

const lessonPlanFormSchema = z.object({
  topic: z.string().min(3, "Topic must be at least 3 characters."),
  gradeLevel: z.coerce.number({invalid_type_error: "Please enter a valid number"}).min(1, "Grade level is required.").max(13),
  subject: z.string().min(3, "Subject is required."),
  durationMinutes: z.coerce.number().min(10, "Duration must be at least 10 minutes."),
  learningObjectives: z.array(z.object({ value: z.string().min(5, "Objective cannot be empty.") })).min(1, "At least one learning objective is required."),
});

type LessonPlanFormData = z.infer<typeof lessonPlanFormSchema>;

export default function WorkbookPlanPage() {
  const { toast } = useToast();
  const [selectedTerm, setSelectedTerm] = useState("2");
  const [selectedWeek, setSelectedWeek] = useState("5");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<GenerateLessonPlanOutput | null>(null);

  const form = useForm<LessonPlanFormData>({
    resolver: zodResolver(lessonPlanFormSchema),
    defaultValues: {
      topic: "",
      gradeLevel: 10,
      subject: "Biology",
      durationMinutes: 40,
      learningObjectives: [{ value: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "learningObjectives",
  });

  const handleGeneratePlan = async (data: LessonPlanFormData) => {
    setIsLoading(true);
    setGeneratedPlan(null);
    try {
      const result = await generateLessonPlan({
        ...data,
        learningObjectives: data.learningObjectives.map(obj => obj.value),
      });
      setGeneratedPlan(result);
      toast({
        title: "Lesson Plan Generated!",
        description: `Your plan for "${result.lessonTitle}" is ready.`,
      });
    } catch (error) {
      console.error("Failed to generate lesson plan:", error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "There was an error generating the lesson plan. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    toast({ title: "Printing...", description: "Use your browser's print dialog to save or print the plan." });
    window.print();
  }

  const handleSave = () => {
     toast({ title: "Plan Saved (Simulated)", description: "Your lesson plan has been saved to your records." });
  }

  const handleNewPlan = () => {
    setGeneratedPlan(null);
    form.reset();
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Weekly Workbook Plan"
        description="Use the AI assistant to generate a detailed lesson plan for your selected week."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start printable-area">
        {/* --- FORM CARD --- */}
        <Card className="lg:col-span-1 print:hidden">
          <CardHeader>
            <CardTitle>Lesson Details</CardTitle>
            <CardDescription>Provide the details for your lesson.</CardDescription>
          </CardHeader>
          <form onSubmit={form.handleSubmit(handleGeneratePlan)}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="term-select">Term</Label>
                  <Select value={selectedTerm} onValueChange={setSelectedTerm}>
                    <SelectTrigger id="term-select"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4].map(t => <SelectItem key={t} value={String(t)}>Term {t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="week-select">Week</Label>
                   <Select value={selectedWeek} onValueChange={setSelectedWeek}>
                    <SelectTrigger id="week-select"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 14 }, (_, i) => i + 1).map(w => <SelectItem key={w} value={String(w)}>Week {w}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" {...form.register("subject")} />
                {form.formState.errors.subject && <p className="text-sm text-destructive mt-1">{form.formState.errors.subject.message}</p>}
              </div>
              
              <div>
                <Label htmlFor="topic">Topic</Label>
                <Input id="topic" {...form.register("topic")} placeholder="e.g., Photosynthesis" />
                 {form.formState.errors.topic && <p className="text-sm text-destructive mt-1">{form.formState.errors.topic.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <Label htmlFor="gradeLevel">Grade Level</Label>
                    <Input id="gradeLevel" type="number" {...form.register("gradeLevel")} />
                     {form.formState.errors.gradeLevel && <p className="text-sm text-destructive mt-1">{form.formState.errors.gradeLevel.message}</p>}
                  </div>
                 <div>
                    <Label htmlFor="durationMinutes">Duration (mins)</Label>
                    <Input id="durationMinutes" type="number" {...form.register("durationMinutes")} />
                     {form.formState.errors.durationMinutes && <p className="text-sm text-destructive mt-1">{form.formState.errors.durationMinutes.message}</p>}
                 </div>
              </div>

              <div>
                <Label>Learning Objectives</Label>
                <div className="space-y-2">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                      <Input
                        {...form.register(`learningObjectives.${index}.value`)}
                        placeholder={`Objective ${index + 1}`}
                      />
                      <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} disabled={fields.length <= 1}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                   {form.formState.errors.learningObjectives && <p className="text-sm text-destructive mt-1">{form.formState.errors.learningObjectives.message || form.formState.errors.learningObjectives?.[0]?.value?.message}</p>}
                  <Button type="button" variant="outline" size="sm" onClick={() => append({ value: "" })}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Objective
                  </Button>
                </div>
              </div>

            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                {isLoading ? "Generating Plan..." : "Generate Plan with AI"}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* --- DISPLAY CARD --- */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Generated Lesson Plan</CardTitle>
                <CardDescription>Review the AI-generated plan below.</CardDescription>
              </div>
               {generatedPlan && (
                <div className="flex gap-2 print:hidden">
                    <Button variant="outline" onClick={handleSave}><Save className="mr-2 h-4 w-4" /> Save</Button>
                    <Button variant="outline" onClick={handlePrint}><Printer className="mr-2 h-4 w-4" /> Print</Button>
                    <Button onClick={handleNewPlan}><FilePlus2 className="mr-2 h-4 w-4" /> New Plan</Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="min-h-[500px]">
            {isLoading && (
              <div className="space-y-4">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Separator className="my-4"/>
                  <Skeleton className="h-6 w-1/4" />
                  <Skeleton className="h-10 w-full" />
                   <Skeleton className="h-6 w-1/4" />
                  <Skeleton className="h-20 w-full" />
              </div>
            )}

            {!isLoading && !generatedPlan && (
              <div className="flex flex-col items-center justify-center h-full text-center p-8 border-2 border-dashed rounded-lg">
                <FileText className="h-16 w-16 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-semibold text-muted-foreground">Your lesson plan will appear here</h3>
                <p className="mt-1 text-sm text-muted-foreground">Fill out the form and click 'Generate Plan' to begin.</p>
              </div>
            )}

            {!isLoading && generatedPlan && (
              <div className="prose dark:prose-invert max-w-none">
                <h2 className="text-2xl font-bold">{generatedPlan.lessonTitle}</h2>
                <Separator className="my-4" />
                
                <h3 className="font-bold">Learning Objectives:</h3>
                <ul>
                  {generatedPlan.objectives.map((obj, i) => <li key={i}>{obj}</li>)}
                </ul>

                <h3 className="font-bold">Materials Needed:</h3>
                <ul>
                  {generatedPlan.materials.map((mat, i) => <li key={i}>{mat}</li>)}
                </ul>
                
                <Separator className="my-4" />

                <h3 className="font-bold">Lesson Activities:</h3>
                {generatedPlan.activities.map((activity, i) => (
                  <div key={i} className="mt-4">
                    <h4 className="font-semibold">{activity.name} ({activity.duration} mins)</h4>
                    <p className="text-sm">{activity.description}</p>
                  </div>
                ))}
                
                <Separator className="my-4" />

                <h3 className="font-bold">Assessment:</h3>
                 <h4 className="font-semibold">{generatedPlan.assessment.method}</h4>
                <p className="text-sm">{generatedPlan.assessment.description}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
