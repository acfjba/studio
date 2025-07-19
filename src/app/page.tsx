import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, Key, User, UserCog } from 'lucide-react';
import Link from 'next/link';

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

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
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
