
"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Send, User } from "lucide-react";
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
    sender: 'ai' | 'user';
    text: string;
}

export function AiAssistantClient() {
    const [messages, setMessages] = useState<Message[]>([
        {
            sender: 'ai',
            text: "Hello! I'm your AI coding partner. How can I help you with your app today? You can ask me to add new features, fix bugs, or make changes to the UI. For example, try asking: \"Change the primary color to blue.\""
        }
    ]);
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        // Add user message
        const userMessage: Message = { sender: 'user', text: inputValue };
        
        // Add a simulated AI response
        const aiResponse: Message = { sender: 'ai', text: `I have received your request to: "${inputValue}". In a real environment, I would now analyze your code and generate the necessary changes. For this demonstration, I will show a mock response. The conversational panel on the side is where real changes are processed.` };

        setMessages(prev => [...prev, userMessage, aiResponse]);
        setInputValue('');
    };

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
                    <div className="space-y-6">
                        {messages.map((message, index) => (
                             <div key={index} className={`flex items-start gap-4 ${message.sender === 'user' ? 'justify-end' : ''}`}>
                                {message.sender === 'ai' && (
                                    <Avatar className="w-8 h-8 border">
                                        <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
                                    </Avatar>
                                )}
                                <div className={`p-3 rounded-lg max-w-lg ${message.sender === 'ai' ? 'bg-muted' : 'bg-primary text-primary-foreground'}`}>
                                    <p className="font-bold">{message.sender === 'ai' ? 'App Prototyper' : 'You'}</p>
                                    <p className="text-sm">{message.text}</p>
                                </div>
                                 {message.sender === 'user' && (
                                    <Avatar className="w-8 h-8 border">
                                        <AvatarFallback><User/></AvatarFallback>
                                    </Avatar>
                                )}
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
            <div className="p-4 border-t bg-background rounded-b-lg">
                <form onSubmit={handleSubmit} className="flex items-center gap-2">
                    <Input
                        placeholder="Describe the changes you want to make..."
                        className="flex-grow"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                    <Button type="submit">
                        <Send className="mr-2 h-4 w-4" />
                        Send
                    </Button>
                </form>
                 <p className="text-xs text-muted-foreground mt-2 text-center">Chat functionality is for demonstration purposes. Please use the conversational panel to interact.</p>
            </div>
        </Card>
    );
}
