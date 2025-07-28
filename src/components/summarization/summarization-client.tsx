"use client";

import React, { useState } from 'react';
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from 'zod';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { summarizeDocument, type SummarizeDocumentOutput } from '@/ai/flows/summarize-document';

const formSchema = z.object({
  documentContent: z.string().min(50, "Please enter at least 50 characters."),
  documentType: z
    .enum(["meeting-notes", "article", "report", "other"], { required_error: "Select a type" }),
});
type FormData = z.infer<typeof formSchema>;

export default function SummarizationClient() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(formSchema)
  });
  const [summary, setSummary] = useState<SummarizeDocumentOutput | null>(null);
  const { toast } = useToast();

  const onSubmit: SubmitHandler<FormData> = async (values) => {
    setSummary(null);
    try {
      // <-- Pass only the text, not the whole object
      const result = await summarizeDocument(values.documentContent);
      setSummary(result);
    } catch (err) {
      console.error('Summarization failed:', err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not summarize document.'
      });
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
        <div>
          <label htmlFor="documentType" className="block font-medium">Document Type</label>
          <select
            id="documentType"
            {...register("documentType")}
            className="mt-1 block w-full border rounded px-2 py-1"
          >
            <option value="">Select type…</option>
            <option value="meeting-notes">Meeting Notes</option>
            <option value="article">Article</option>
            <option value="report">Report</option>
            <option value="other">Other</option>
          </select>
          {errors.documentType && (
            <p className="text-destructive text-sm">{errors.documentType.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="documentContent" className="block font-medium">Content</label>
          <Textarea
            id="documentContent"
            rows={8}
            placeholder="Paste your text here…"
            {...register("documentContent")}
          />
          {errors.documentContent && (
            <p className="text-destructive text-sm">{errors.documentContent.message}</p>
          )}
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Summarizing…" : "Summarize"}
        </Button>
      </form>

      {summary && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h3 className="font-semibold mb-2">Summary</h3>
          <p>{summary.summary}</p>
        </div>
      )}
    </div>
  );
}
