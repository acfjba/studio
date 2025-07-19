"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Send } from "lucide-react";
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';

export function AiAssistantClient() {
    return (
        <Card className="flex flex-col flex-grow">
            <CardHeader className="p-4 border-b">
                <CardTitle className="font-headline text-2xl flex items-center">
                    <Bot className="mr-3 h-7 w-7 text-primary" />
                    Gemini AI Assistant
                </CardTitle>
                <CardDescription className="font-body text-muted-foreground">
                    Ask for new features, bug fixes, or explanations to manage this application.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow p-4 overflow-y-auto">
                <ScrollArea className="h-full pr-4">
                    <div className="space-y-4">
                        <div className="flex items-start gap-4">
                            <Avatar className="w-8 h-8 border">
                                <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
                            </Avatar>
                            <div className="bg-muted p-3 rounded-lg max-w-lg">
                                <p className="font-bold">App Prototyper</p>
                                <p className="text-sm">
                                    Hello! I&apos;m your AI coding partner. How can I help you with your app today? You can ask me to add new features, fix bugs, or make changes to the UI. For example, try asking: &quot;Change the primary color to blue.&quot;
                                </p>
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </CardContent>
            <div className="p-4 border-t bg-background rounded-b-lg">
                <form className="flex items-center gap-2">
                    <Input
                        placeholder="Describe the changes you want to make..."
                        className="flex-grow"
                        disabled
                    />
                    <Button type="submit" disabled>
                        <Send className="mr-2 h-4 w-4" />
                        Send
                    </Button>
                </form>
                <p className="text-xs text-muted-foreground mt-2 text-center">Chat functionality is for demonstration purposes. Please use the conversational panel to interact.</p>
            </div>
        </Card>
    );
}
