import { LoginForm } from '@/components/login/login-form';
import { School } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
           <LoginForm />
        </div>
      </div>
      <div className="hidden bg-zinc-100 lg:flex items-center justify-center flex-col text-center p-8 dark:bg-zinc-800">
         <School className="h-24 w-24 text-primary mb-4" />
        <h1 className="text-5xl font-bold font-headline text-zinc-900 dark:text-zinc-50">Digital Platform for Schools</h1>
        <p className="mt-4 text-xl text-zinc-600 dark:text-zinc-400">
          A comprehensive management system for educational institutions in Fiji.
        </p>
      </div>
    </div>
  );
}
