
import React from 'react';
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Server, Globe, GitBranch, Zap, Layers, Rocket } from "lucide-react";

export default function HostingInfoPage() {
    return (
        <div className="space-y-8">
            <PageHeader
                title="Hosting Explained"
                description="Understanding the difference between Firebase App Hosting and Firebase Hosting."
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <Card className="shadow-lg border-primary/20">
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl text-primary flex items-center gap-3">
                            <Rocket className="w-7 h-7" />
                            Firebase App Hosting (This Project)
                        </CardTitle>
                        <CardDescription>
                            A modern, integrated, and fully-managed solution for web apps built with frameworks like Next.js.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-start gap-4">
                            <GitBranch className="h-5 w-5 mt-1 text-accent" />
                            <div>
                                <h4 className="font-semibold">Git-Based Deployments</h4>
                                <p className="text-sm text-muted-foreground">
                                    You connect your GitHub repository, and App Hosting automatically builds and deploys your application whenever you push new code. It's a zero-configuration CI/CD pipeline out of the box.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <Layers className="h-5 w-5 mt-1 text-accent" />
                            <div>
                                <h4 className="font-semibold">All-in-One Infrastructure</h4>
                                <p className="text-sm text-muted-foreground">
                                    It intelligently splits your app, deploying static parts (like HTML/CSS) to a global CDN and dynamic parts (like server-side code) to a secure, scalable server environment (Cloud Run) automatically. You don't manage any servers.
                                </p>
                            </div>
                        </div>
                         <div className="flex items-start gap-4">
                            <Zap className="h-5 w-5 mt-1 text-accent" />
                            <div>
                                <h4 className="font-semibold">Optimized for Frameworks</h4>
                                <p className="text-sm text-muted-foreground">
                                    Specifically designed to understand and optimize frameworks like Next.js, handling features like Server-Side Rendering (SSR), API routes, and image optimization without any complex setup. This project uses the `apphosting.yaml` file to manage this.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl flex items-center gap-3">
                            <Globe className="w-7 h-7" />
                             Firebase Hosting (Traditional)
                        </CardTitle>
                        <CardDescription>
                            A powerful and fast solution primarily for hosting static web assets, which can be extended for dynamic content.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-start gap-4">
                            <Server className="h-5 w-5 mt-1 text-accent" />
                            <div>
                                <h4 className="font-semibold">Static Asset Focus</h4>
                                <p className="text-sm text-muted-foreground">
                                    World-class for serving static files (HTML, CSS, JavaScript, images) very quickly from a global Content Delivery Network (CDN). This is its primary strength.
                                </p>
                            </div>
                        </div>
                         <div className="flex items-start gap-4">
                            <Layers className="h-5 w-5 mt-1 text-accent" />
                            <div>
                                <h4 className="font-semibold">Manual Backend Integration</h4>
                                <p className="text-sm text-muted-foreground">
                                    To run server-side code (like API endpoints), you have to manually connect it to a separate backend service like Cloud Functions or Cloud Run. You manage the frontend and backend configurations separately.
                                </p>
                            </div>
                        </div>
                         <div className="flex items-start gap-4">
                            <Zap className="h-5 w-5 mt-1 text-accent" />
                            <div>
                                <h4 className="font-semibold">Manual Deployment</h4>
                                <p className="text-sm text-muted-foreground">
                                   Deployment is typically done by running a command (`firebase deploy`) from your local machine after you have built your application's assets.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            
             <Card className="bg-muted/50">
                <CardHeader>
                    <CardTitle className="font-headline text-xl">Analogy: Which one to choose?</CardTitle>
                </CardHeader>
                <CardContent>
                     <p className="text-foreground">
                        Think of **Firebase Hosting** as getting a high-performance engine and a car frame. You get the essential, powerful pieces, but you have to wire up the transmission and interior yourself. It offers great flexibility.
                        <br/><br/>
                        **Firebase App Hosting** is like getting a brand-new, fully-assembled car. You just provide the destination (your code repository), and it handles everything else, from fueling up (building) to driving itself there (deploying), perfectly tuned for the way it was built (the framework). This is the approach your current project is using.
                    </p>
                </CardContent>
            </Card>

        </div>
    );
}
