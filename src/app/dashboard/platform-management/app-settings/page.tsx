
"use client";

import React, { useState } from 'react';
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Palette, ToggleRight, Bell, Save } from "lucide-react";
import { Separator } from '@/components/ui/separator';

export default function AppSettingsPage() {
    const { toast } = useToast();

    // State for theme customization
    const [primaryColor, setPrimaryColor] = useState('231 48% 48%');
    const [accentColor, setAccentColor] = useState('174 100% 29%');
    const [backgroundColor, setBackgroundColor] = useState('231 20% 90%');

    // State for feature toggles
    const [featureFlags, setFeatureFlags] = useState({
        libraryModule: true,
        counsellingModule: true,
        kpiReporting: true,
        aiSummarization: true,
    });

    // State for notification settings
    const [notificationEmail, setNotificationEmail] = useState('admin@schooldata.com');

    const handleSaveSettings = () => {
        console.log("Saving App Settings (Simulated):", {
            theme: { primaryColor, accentColor, backgroundColor },
            features: featureFlags,
            notifications: { notificationEmail }
        });

        toast({
            title: "Settings Saved (Simulated)",
            description: "Application settings have been updated. In a real app, this might require an app restart.",
        });
    };

    const handleFeatureToggle = (feature: keyof typeof featureFlags) => {
        setFeatureFlags(prev => ({ ...prev, [feature]: !prev[feature] }));
    };

    return (
        <div className="flex flex-col gap-8">
            <PageHeader
                title="Application Settings"
                description="Configure system-wide settings, theme, and features."
            />
            <div className="grid gap-8 lg:grid-cols-3">
                {/* Main Settings Cards */}
                <div className="lg:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 font-headline"><Palette /> Theme Customization</CardTitle>
                            <CardDescription>Change the core colors of the application. Enter HSL values without the 'hsl()' wrapper.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="primaryColor">Primary Color</Label>
                                    <Input id="primaryColor" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} />
                                </div>
                                <div>
                                    <Label htmlFor="accentColor">Accent Color</Label>
                                    <Input id="accentColor" value={accentColor} onChange={e => setAccentColor(e.target.value)} />
                                </div>
                                <div>
                                    <Label htmlFor="backgroundColor">Background Color</Label>
                                    <Input id="backgroundColor" value={backgroundColor} onChange={e => setBackgroundColor(e.target.value)} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 font-headline"><ToggleRight /> Feature Toggles</CardTitle>
                            <CardDescription>Enable or disable major application modules globally.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <div className="flex items-center justify-between p-3 rounded-md border">
                                <Label htmlFor="ff-library">Library Module</Label>
                                <Switch id="ff-library" checked={featureFlags.libraryModule} onCheckedChange={() => handleFeatureToggle('libraryModule')} />
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-md border">
                                <Label htmlFor="ff-counselling">Counselling Module</Label>
                                <Switch id="ff-counselling" checked={featureFlags.counsellingModule} onCheckedChange={() => handleFeatureToggle('counsellingModule')} />
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-md border">
                                <Label htmlFor="ff-kpi">KPI Reporting</Label>
                                <Switch id="ff-kpi" checked={featureFlags.kpiReporting} onCheckedChange={() => handleFeatureToggle('kpiReporting')} />
                            </div>
                             <div className="flex items-center justify-between p-3 rounded-md border">
                                <Label htmlFor="ff-ai-summarization">AI Document Summarization</Label>
                                <Switch id="ff-ai-summarization" checked={featureFlags.aiSummarization} onCheckedChange={() => handleFeatureToggle('aiSummarization')} />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Side Card */}
                <div className="lg:col-span-1 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 font-headline"><Bell /> Notification Settings</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Label htmlFor="notificationEmail">System Notification Email</Label>
                            <Input id="notificationEmail" type="email" value={notificationEmail} onChange={e => setNotificationEmail(e.target.value)} placeholder="admin@example.com" />
                            <p className="text-xs text-muted-foreground mt-2">This email address will receive critical system alerts.</p>
                        </CardContent>
                         <CardFooter>
                           <Button onClick={handleSaveSettings} className="w-full">
                               <Save className="mr-2 h-4 w-4"/>
                               Save All Settings
                           </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}
