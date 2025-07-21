
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, Key, User, UserCog, Book, MessageSquareQuote } from 'lucide-react';
import Link from 'next/link';
import { useActionState } from 'react';
import { submitFeedback } from './actions';
import { useToast } from '@/hooks/use-toast';
import React, { useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const initialState = {
  message: '',
  error: false,
};

function FeedbackForm() {
  const [state, formAction] = useActionState(submitFeedback, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message) {
      if (state.error) {
        toast({
          variant: 'destructive',
          title: 'Feedback Error',
          description: state.message,
        });
      } else {
        toast({
          title: 'Feedback Submitted',
          description: state.message,
        });
      }
    }
  }, [state, toast]);

  return (
    <Card className="bg-background/80 text-left col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center">
            <MessageSquareQuote className="h-6 w-6 mr-2 text-primary" />
            Provide Feedback
        </CardTitle>
        <CardDescription>
            Help us improve the platform by sharing your thoughts.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="feedback-message">Your Feedback</Label>
            <Textarea 
              id="feedback-message"
              name="message"
              placeholder="Tell us what you think..."
              required
            />
          </div>
          <Button type="submit" className="w-full">Submit Feedback</Button>
        </form>
      </CardContent>
    </Card>
  );
}


export default function HomePage() {
  return (
    <div className="relative min-h-screen w-full bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('https://storage.googleapis.com/aai-web-samples/apps/school-platform-bg.png')" }}>
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm"></div>

      <div className="absolute top-4 right-4 z-10">
        <Link href="/presentation">
          <Button variant="outline">View Presentation</Button>
        </Link>
      </div>

      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-4xl text-center">
            <h1 className="text-5xl font-extrabold tracking-tight text-primary sm:text-6xl md:text-7xl">
                Welcome to the TRA Platform
            </h1>
            <p className="mt-4 text-lg text-muted-foreground sm:text-xl">
                Empowering Fijian schools with a digital platform for performance & efficiency.
            </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <RoleCard 
                icon={Book}
                title="Kindergarten"
                description="Manage kindergarten class activities, student records, and inventory in a dedicated environment."
            />
            <RoleCard 
                icon={User}
                title="Teacher"
                description="Manage lesson plans, record student data (exams, discipline, counselling), and track classroom inventory."
            />
            <RoleCard 
                icon={Briefcase}
                title="Head Teacher"
                description="Oversee teacher submissions, review school-wide reports, and manage administrative tasks."
            />
             <RoleCard 
                icon={UserCog}
                title="Primary Admin"
                description="Manage all school operations, including user accounts, academic records, and data reporting."
            />
             <RoleCard 
                icon={Key}
                title="System Admin"
                description="Manage the entire platform, including schools, system settings, and permissions."
            />
             <FeedbackForm />
        </div>

        <div className="mt-12">
            <Link href="/login">
                <Button size="lg" className="rounded-full px-10 py-6 text-lg font-bold shadow-lg">
                    Proceed to Login
                </Button>
            </Link>
        </div>
      </main>
    </div>
  );
}

function RoleCard({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) {
    return (
        <Card className="bg-background/80 text-center">
            <CardHeader className="items-center">
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Icon className="h-6 w-6" />
                </div>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    );
}
