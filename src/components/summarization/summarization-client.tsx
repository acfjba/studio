'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Wand2, FileText } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { summarizeDocument, type SummarizeDocumentOutput } from '@/ai/flows/summarize-document';

const formSchema = z.object({
  documentContent: z.string().min(50, {
    message: 'Document content must be at least 50 characters.',
  }),
  documentType: z.string({
    required_error: 'Please select a document type.',
  }),
});

export function SummarizationClient() {
  const [summary, setSummary] = useState<SummarizeDocumentOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      documentContent: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setSummary(null);
    try {
      const result = await summarizeDocument(values);
      setSummary(result);
    } catch (error) {
      console.error('Summarization failed:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate summary. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle className="font-headline">Input Document</CardTitle>
              <CardDescription>
                Paste the document content and select the type to generate a summary.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="documentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a document type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="counselling session notes">Counselling Session Notes</SelectItem>
                        <SelectItem value="individual work plans">Individual Work Plans</SelectItem>
                        <SelectItem value="staff records">Staff Records</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="documentContent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document Content</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Paste your document here..."
                        className="resize-y min-h-[300px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate Summary
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Generated Summary</CardTitle>
          <CardDescription>The AI-generated summary will appear below.</CardDescription>
        </CardHeader>
        <CardContent className="min-h-[400px]">
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-muted-foreground">The AI is thinking...</p>
            </div>
          )}
          {summary && !isLoading && (
            <div className="prose dark:prose-invert max-w-none">
              <p>{summary.summary}</p>
            </div>
          )}
          {!summary && !isLoading && (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 border-2 border-dashed rounded-lg">
                <FileText className="h-16 w-16 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-semibold text-muted-foreground">Summary will be displayed here</h3>
                <p className="mt-1 text-sm text-muted-foreground">Enter a document and click 'Generate Summary' to start.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
