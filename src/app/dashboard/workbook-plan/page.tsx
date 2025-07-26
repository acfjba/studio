
"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Save, Send, ClipboardList, Info, FileText, Download, PlusCircle, Trash2, Copy as CopyIcon, ClipboardPaste, Mail } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/layout/page-header';

interface Activity {
  id: string; 
  label: string; 
  curriculumDetails: string;
  isEditable?: boolean; 
  placeholder?: string;
}

interface DailyPlan {
  day: string; 
  date: string; 
  activities: Activity[];
  dailyComments: string; 
}

const terms = ["1", "2", "3", "4"];
const weeks = Array.from({ length: 14 }, (_, i) => (i + 1).toString());

const initialDailyPlansData: DailyPlan[] = [
  {
    day: "Monday",
    date: "16/06",
    activities: [
      { id: "mon-prayer", label: "PRAYER /ANNOUNCEMENTS.", curriculumDetails: "", isEditable: false },
      { id: "mon-numeracy", label: "NUMERACY LTK 2.6.6.6", curriculumDetails: "Tell the time in analogue and digital form to the hour and half hour\n• Able to investigate the meaning of analogue and digital time and model examples\n• Able to differentiate between analogue and digital clock and watch\n• Able to tell the time to the hour - o'clock\n• Able to discuss analogue clock face - minute hand, hour hand and intervals between numbers", isEditable: true, placeholder: "Enter Numeracy details..." },
      { id: "mon-maths-guide", label: "Maths Guide for Lower Primary-year 1 & 2. Page 99-100", curriculumDetails: "", isEditable: false },
      { id: "mon-moral", label: "MORAL & CIVIC ED MCE 2.3.1.1", curriculumDetails: "Demonstrate proper personal hygiene and healthy habits in school", isEditable: true, placeholder: "Enter Moral & Civic Ed details..." },
      { id: "mon-recess", label: "RECESS", curriculumDetails: "", isEditable: false },
    ],
    dailyComments: ""
  },
  {
    day: "Tuesday",
    date: "17/06",
    activities: [
      { id: "tue-cleaning", label: "Cleaning up school compound", curriculumDetails: "", isEditable: false },
      { id: "tue-calendar", label: "Calendar/Weather/Talk For Learning/Phonics/World Around Us", curriculumDetails: "", isEditable: true, placeholder: "Enter details..." },
      { id: "tue-numeracy", label: "NUMERACY LTK 2.6.6.6", curriculumDetails: "Tell the time in analogue and digital form to the hour and half hour\n• Able to investigate the meaning of analogue and digital time and model examples\n• Able to differentiate between analogue and digital clock and watch\n• Able to tell the time to the hour - o'clock\n• Able to discuss analogue clock face - minute hand, hour hand and intervals between numbers", isEditable: true, placeholder: "Enter Numeracy details..." },
      { id: "tue-maths-guide", label: "Maths Guide for Lower Primary-year 1 & 2. Page 99-100", curriculumDetails: "", isEditable: false },
      { id: "tue-moral", label: "MORAL & CIVIC ED MCE 2.3.1.1", curriculumDetails: "Demonstrate proper personal hygiene and healthy habits in school", isEditable: true, placeholder: "Enter Moral & Civic Ed details..." },
      { id: "tue-recess", label: "RECESS", curriculumDetails: "", isEditable: false },
    ],
    dailyComments: ""
  },
  {
    day: "Wednesday",
    date: "18/06",
    activities: [
      { id: "wed-duties", label: "DUTIES", curriculumDetails: "", isEditable: false },
      { id: "wed-health", label: "HEALTH INSPECTION", curriculumDetails: "", isEditable: false },
      { id: "wed-routine", label: "MORNING ROUTINE", curriculumDetails: "", isEditable: false },
      { id: "wed-calendar", label: "Calendar/Weather/Talk For Learning/Phonics/World Around Us", curriculumDetails: "", isEditable: true, placeholder: "Enter details..." },
      { id: "wed-numeracy", label: "NUMERACY LTK 2.6.6.6", curriculumDetails: "Tell the time in analogue and digital form to the hour and half hour\n• Able to investigate the meaning of analogue and digital time and model examples\n• Able to differentiate between analogue and digital clock and watch\n• Able to tell the time to the hour - o'clock\n• Able to discuss analogue clock face - minute hand, hour hand and intervals between numbers", isEditable: true, placeholder: "Enter Numeracy details..." },
      { id: "wed-maths-guide", label: "Maths Guide for Lower Primary -year 1 & 2. Page 99-100", curriculumDetails: "", isEditable: false },
      { id: "wed-moral", label: "MORAL & CIVIC ED MCE 2.3.2.1", curriculumDetails: "Display knowledge and skills of safety practices in school and during emergencies", isEditable: true, placeholder: "Enter Moral & Civic Ed details..." },
      { id: "wed-recess", label: "RECESS", curriculumDetails: "", isEditable: false },
    ],
    dailyComments: ""
  },
  {
    day: "Thursday",
    date: "19/06",
    activities: [
      { id: "thu-prayer", label: "PRAYER /ANNOUNCEMENTS.", curriculumDetails: "", isEditable: false },
      { id: "thu-calendar", label: "Calendar/Weather/Talk For Learning/Phonics/World Around Us", curriculumDetails: "", isEditable: true, placeholder: "Enter details..." },
      { id: "thu-numeracy", label: "NUMERACY LTK 2.6.6.6", curriculumDetails: "Tell the time in analogue and digital form to the hour and half hour\n• Able to investigate the meaning of analogue and digital time and model examples\n• Able to differentiate between analogue and digital clock and watch\n• Able to tell the time to the hour - o'clock\n• Able to discuss analogue clock face - minute hand, hour hand and intervals between numbers", isEditable: true, placeholder: "Enter Numeracy details..." },
      { id: "thu-maths-guide", label: "Maths Guide for Lower Primary -year 1 & 2. Page 99-100", curriculumDetails: "", isEditable: false },
      { id: "thu-moral", label: "MORAL & CIVIC ED MCE 2.3.2.1", curriculumDetails: "Display knowledge and skills of safety practices in school and during emergencies", isEditable: true, placeholder: "Enter Moral & Civic Ed details..." },
      { id: "thu-recess", label: "RECESS", curriculumDetails: "", isEditable: false },
    ],
    dailyComments: ""
  },
  {
    day: "Friday",
    date: "20/06",
    activities: [
      { id: "fri-flag", label: "FLAG CEREMONY", curriculumDetails: "", isEditable: false },
      { id: "fri-numeracy", label: "NUMERACY LTK 2.6.6.6", curriculumDetails: "Tell the time in analogue and digital form to the hour and half hour\n• Able to investigate the meaning of analogue and digital time and model examples\n• Able to differentiate between analogue and digital clock and watch\n• Able to tell the time to the hour - o'clock\n• Able to discuss analogue clock face - minute hand, hour hand and intervals between numbers", isEditable: true, placeholder: "Enter Numeracy details..." },
      { id: "fri-maths-guide", label: "Maths Guide for Lower Primary-year 1 & 2. Page 99-100", curriculumDetails: "", isEditable: false },
      { id: "fri-moral", label: "MORAL & CIVIC ED MCE 2.3.2.1", curriculumDetails: "Display knowledge and skills of safety practices in school and during emergencies", isEditable: true, placeholder: "Enter Moral & Civic Ed details..." },
      { id: "fri-recess", label: "RECESS", curriculumDetails: "", isEditable: false },
    ],
    dailyComments: ""
  },
];


export default function WorkbookPlanPage() {
  const [yearOfStudy, setYearOfStudy] = useState('Year 2');
  const [programmeDates, setProgrammeDates] = useState('16th-20th June, 2025.');
  const [term, setTerm] = useState('2');
  const [week, setWeek] = useState('7');
  const [dailyPlans, setDailyPlans] = useState<DailyPlan[]>(initialDailyPlansData);
  const [weeklyRemarks, setWeeklyRemarks] = useState("Moral Value:\nTHEME: Being Helpful\nI help mum and dad in the home chores\nI help keep my classroom clean\nI help at home before playing.\nI go to bed early.\nI help my friends read.");
  const [status, setStatus] = useState('Draft');
  const [headTeacherFeedback, setHeadTeacherFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [copiedActivity, setCopiedActivity] = useState<Activity | null>(null);

  const handleActivityLabelChange = (dayIndex: number, activityIndex: number, value: string) => {
    const updatedPlans = [...dailyPlans];
    updatedPlans[dayIndex].activities[activityIndex].label = value;
    setDailyPlans(updatedPlans);
  };

  const handleActivityDetailChange = (dayIndex: number, activityIndex: number, value: string) => {
    const updatedPlans = [...dailyPlans];
    updatedPlans[dayIndex].activities[activityIndex].curriculumDetails = value;
    setDailyPlans(updatedPlans);
  };
  
  const handleDailyCommentsChange = (dayIndex: number, value: string) => {
    const updatedPlans = [...dailyPlans];
    updatedPlans[dayIndex].dailyComments = value;
    setDailyPlans(updatedPlans);
  };

  const handleAddActivity = (dayIndex: number) => {
    const updatedPlans = [...dailyPlans];
    const newActivity: Activity = {
      id: `activity-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      label: "New Activity",
      curriculumDetails: "",
      placeholder: "Enter details for new activity..."
    };
    updatedPlans[dayIndex].activities.push(newActivity);
    setDailyPlans(updatedPlans);
    toast({ title: "Activity Added", description: `New activity added to ${updatedPlans[dayIndex].day}.`});
  };

  const handleDeleteActivity = (dayIndex: number, activityId: string) => {
    if (!window.confirm("Are you sure you want to delete this activity?")) return;
    const updatedPlans = [...dailyPlans];
    updatedPlans[dayIndex].activities = updatedPlans[dayIndex].activities.filter(act => act.id !== activityId);
    setDailyPlans(updatedPlans);
    toast({ title: "Activity Deleted", description: "The activity has been removed."});
  };

  const handleCopyActivity = (activity: Activity) => {
    setCopiedActivity(activity);
    toast({ title: "Activity Copied", description: `"${activity.label}" copied to clipboard.`});
  };

  const handlePasteActivity = (dayIndex: number) => {
    if (!copiedActivity) {
      toast({ variant: "destructive", title: "Paste Error", description: "No activity copied to paste."});
      return;
    }
    const updatedPlans = [...dailyPlans];
    const newPastedActivity: Activity = {
      ...copiedActivity,
      id: `activity-${Date.now()}-${Math.random().toString(36).substring(7)}`, // Ensure unique ID
    };
    updatedPlans[dayIndex].activities.push(newPastedActivity);
    setDailyPlans(updatedPlans);
    toast({ title: "Activity Pasted", description: `Copied activity added to ${updatedPlans[dayIndex].day}.`});
  };

  const handleEmailPlan = () => {
    toast({
      title: "Emailing Plan (Simulated)",
      description: "An email would be sent from your address to the Head Teacher for review.",
    });
  };


  const handleSaveDraft = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Saving draft:", { yearOfStudy, programmeDates, term, week, dailyPlans, weeklyRemarks });
    setStatus('Draft Saved');
    setIsSubmitting(false);
    toast({
      title: "Draft Saved",
      description: "Your workbook plan has been saved as a draft.",
    });
  };

  const validatePlan = (): boolean => {
    if (!yearOfStudy.trim()) {
      toast({ variant: "destructive", title: "Missing Information", description: "Please fill in 'Year of Study'." });
      return false;
    }
    if (!programmeDates.trim()) {
      toast({ variant: "destructive", title: "Missing Information", description: "Please fill in 'Programme Dates'." });
      return false;
    }
    if (!term) {
      toast({ variant: "destructive", title: "Missing Information", description: "Please select a 'Term'." });
      return false;
    }
    if (!week) {
      toast({ variant: "destructive", title: "Missing Information", description: "Please select a 'Week'." });
      return false;
    }

    for (const plan of dailyPlans) {
      for (const activity of plan.activities) {
        if (!activity.label.trim()) {
          toast({
            variant: "destructive",
            title: "Incomplete Plan",
            description: `Please provide a label for an activity on ${plan.day}.`,
          });
          return false;
        }
        if (!activity.curriculumDetails.trim() && activity.placeholder) { 
           toast({
            variant: "destructive",
            title: "Incomplete Plan",
            description: `Please fill in curriculum details for '${activity.label}' on ${plan.day}.`,
          });
          return false;
        }
      }
    }
     if (!weeklyRemarks.trim()) {
        toast({
            variant: "destructive",
            title: "Missing Remarks",
            description: "Please provide weekly remarks / moral value.",
        });
        return false;
    }
    return true;
  };

  const handleSubmitForReview = async () => {
    if (!validatePlan()) {
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log("Submitting for review:", { yearOfStudy, programmeDates, term, week, dailyPlans, weeklyRemarks });
    setStatus('Submitted for Review');
    setIsSubmitting(false);
    toast({
      title: "Plan Submitted",
      description: "Your workbook plan has been submitted for review.",
    });
  };

  const handleSaveAsWord = () => {
    toast({
      title: "Printing Plan...",
      description: "Use the 'Save as PDF' option in the print dialog. This can often be opened with Word.",
    });
    window.print();
  };

  const handleSaveAsPdf = () => {
     toast({
      title: "Printing Plan...",
      description: "Use the 'Save as PDF' option in your browser's print dialog.",
    });
    window.print();
  };


  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Teacher Workbook Plan" description="Programme of Work - Fill in daily lesson activities, curriculum details, and comments." />
      <div className="printable-area">
        <Card className="shadow-xl rounded-lg w-full max-w-6xl mx-auto">
            <CardHeader className="border-b pb-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
                <div className="mb-2 sm:mb-0">
                <CardTitle className="text-2xl font-headline text-primary flex items-center">
                    <ClipboardList className="mr-3 h-7 w-7" />
                    Weekly Plan Details
                </CardTitle>
                <CardDescription className="font-body text-muted-foreground">
                    Fill in the details for the week.
                </CardDescription>
                </div>
                <div className="font-body text-sm flex flex-col items-start sm:items-end">
                    <div>
                        <strong>Status:</strong>
                        <Badge variant={status.includes('Rejected') ? 'destructive' : status.includes('Accepted') ? 'default' : 'secondary'} className="ml-2">
                            {status}
                        </Badge>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                <Label htmlFor="yearOfStudy" className="font-body font-semibold">Year of Study</Label>
                <Input id="yearOfStudy" value={yearOfStudy} onChange={(e) => setYearOfStudy(e.target.value)} className="font-body" placeholder="e.g., Year 2" spellCheck={true} />
                </div>
                <div>
                <Label htmlFor="programmeDates" className="font-body font-semibold">Programme Dates</Label>
                <Input id="programmeDates" value={programmeDates} onChange={(e) => setProgrammeDates(e.target.value)} className="font-body" placeholder="e.g., 16th-20th June, 2025" spellCheck={true} />
                </div>
                <div>
                <Label htmlFor="term" className="font-body font-semibold">Term</Label>
                <Select value={term} onValueChange={setTerm} required>
                    <SelectTrigger id="term" className="font-body">
                    <SelectValue placeholder="Select Term" />
                    </SelectTrigger>
                    <SelectContent>
                    {terms.map(t => <SelectItem key={t} value={t} className="font-body">Term {t}</SelectItem>)}
                    </SelectContent>
                </Select>
                </div>
                <div>
                <Label htmlFor="week" className="font-body font-semibold">Week</Label>
                <Select value={week} onValueChange={setWeek} required>
                    <SelectTrigger id="week" className="font-body">
                    <SelectValue placeholder="Select Week" />
                    </SelectTrigger>
                    <SelectContent>
                    {weeks.map(w => <SelectItem key={w} value={w} className="font-body">Week {w}</SelectItem>)}
                    </SelectContent>
                </Select>
                </div>
            </div>
            </CardHeader>
            <CardContent className="pt-6">
            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                <div className="overflow-x-auto">
                <Table className="min-w-full border">
                    <TableHeader>
                    <TableRow>
                        <TableHead className="font-body font-bold text-accent w-[15%] border-r">Day / Date</TableHead>
                        <TableHead className="font-body font-bold text-accent w-[25%] border-r">Activity / Subject</TableHead>
                        <TableHead className="font-body font-bold text-accent w-[35%] border-r">Curriculum Details / Notes</TableHead>
                        <TableHead className="font-body font-bold text-accent w-[10%] border-r text-center print:hidden">Row Actions</TableHead>
                        <TableHead className="font-body font-bold text-accent w-[15%] text-center">Daily Comments</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {dailyPlans.map((plan, dayIndex) => (
                        <React.Fragment key={plan.day}>
                        {plan.activities.map((activity, activityIndex) => (
                            <TableRow key={activity.id} className={activityIndex < plan.activities.length -1 ? "border-b-0" : "border-b"}>
                            {activityIndex === 0 && (
                                <TableCell className="font-body font-semibold align-top pt-3 border-r" rowSpan={plan.activities.length}>
                                {plan.day}<br/>({plan.date})
                                <div className="mt-2 space-y-1 print:hidden">
                                    <Button variant="outline" size="sm" onClick={() => handleAddActivity(dayIndex)} className="w-full text-xs">
                                    <PlusCircle className="mr-1 h-3 w-3"/> Add Activity
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => handlePasteActivity(dayIndex)} className="w-full text-xs" disabled={!copiedActivity}>
                                    <ClipboardPaste className="mr-1 h-3 w-3"/> Paste Activity
                                    </Button>
                                </div>
                                </TableCell>
                            )}
                            <TableCell className="font-body align-top p-1 border-r">
                                <Input
                                    value={activity.label}
                                    onChange={(e) => handleActivityLabelChange(dayIndex, activityIndex, e.target.value)}
                                    placeholder="Enter activity/subject label..."
                                    className="font-body text-xs h-auto py-1"
                                    spellCheck={true}
                                />
                            </TableCell>
                            <TableCell className="font-body align-top p-1 border-r">
                                <Textarea
                                value={activity.curriculumDetails}
                                onChange={(e) => handleActivityDetailChange(dayIndex, activityIndex, e.target.value)}
                                placeholder={activity.placeholder || "Enter details..."}
                                className="min-h-[60px] font-body text-xs"
                                rows={3}
                                spellCheck={true}
                                />
                            </TableCell>
                            <TableCell className="font-body align-middle p-1 border-r text-center print:hidden">
                                <div className="flex flex-col items-center space-y-1 sm:flex-row sm:space-y-0 sm:space-x-1 sm:justify-center">
                                    <Button variant="ghost" size="icon" onClick={() => handleDeleteActivity(dayIndex, activity.id)} title="Delete Activity">
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => handleCopyActivity(activity)} title="Copy Activity">
                                        <CopyIcon className="h-4 w-4 text-blue-600" />
                                    </Button>
                                </div>
                            </TableCell>
                            {activityIndex === 0 && (
                                <TableCell className="font-body align-middle p-1 text-center" rowSpan={plan.activities.length}>
                                <Textarea
                                    value={plan.dailyComments}
                                    onChange={(e) => handleDailyCommentsChange(dayIndex, e.target.value)}
                                    placeholder="Enter daily comments..."
                                    className="min-h-[80px] font-body text-xs"
                                    rows={3}
                                    spellCheck={true}
                                />
                                </TableCell>
                            )}
                            </TableRow>
                        ))}
                        {dayIndex < dailyPlans.length -1 && (
                            <TableRow className="border-t-2 border-border bg-muted/20 h-2">
                                <TableCell colSpan={5}></TableCell>
                            </TableRow>
                        )}
                        </React.Fragment>
                    ))}
                    </TableBody>
                </Table>
                </div>

                <div className="space-y-2 pt-4">
                <Label htmlFor="weeklyRemarks" className="font-body font-semibold text-lg text-accent">Weekly Remarks / Moral Value</Label>
                <Textarea 
                    id="weeklyRemarks" 
                    value={weeklyRemarks} 
                    onChange={(e) => setWeeklyRemarks(e.target.value)} 
                    className="min-h-[120px] font-body whitespace-pre-line" 
                    rows={5}
                    placeholder="Enter weekly remarks, theme, moral values observed..."
                    spellCheck={true}
                />
                </div>
                
                {headTeacherFeedback && (
                <Card className="mt-6 bg-muted/30 border-accent">
                    <CardHeader>
                        <CardTitle className="font-headline text-base text-accent flex items-center">
                            <Info className="mr-2 h-5 w-5" />
                            Head Teacher Feedback
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="font-body text-sm text-foreground whitespace-pre-line">
                            {headTeacherFeedback}
                        </p>
                    </CardContent>
                </Card>
                )}

                <div className="flex flex-col sm:flex-row flex-wrap justify-end items-center gap-3 pt-6 print:hidden">
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleSaveAsWord}
                    disabled={isSubmitting}
                >
                    <FileText className="mr-2 h-5 w-5" />
                    Save as Word
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleSaveAsPdf}
                    disabled={isSubmitting}
                >
                    <Download className="mr-2 h-5 w-5" />
                    Save as PDF
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleEmailPlan}
                    disabled={isSubmitting}
                >
                    <Mail className="mr-2 h-5 w-5" />
                    Email Plan
                </Button>
                <Button
                    type="button"
                    variant="secondary"
                    onClick={handleSaveDraft}
                    disabled={isSubmitting || status.includes('Submitted') || status.includes('Accepted')}
                >
                    <Save className="mr-2 h-5 w-5" />
                    {isSubmitting && status === 'Draft Saved' ? 'Saving...' : 'Save Draft'}
                </Button>
                <Button
                    type="submit"
                    className="bg-accent text-accent-foreground hover:bg-accent/90"
                    onClick={handleSubmitForReview}
                    disabled={isSubmitting || status.includes('Submitted') || status.includes('Accepted')}
                >
                    <Send className="mr-2 h-5 w-5" />
                    {isSubmitting && status === 'Submitted for Review' ? 'Submitting...' : 'Submit for Review'}
                </Button>
                </div>
            </form>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
