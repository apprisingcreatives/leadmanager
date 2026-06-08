"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bot, Send, Sparkles } from "lucide-react";

export function SalesAssistant() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger className="w-full bg-primary/10 text-primary text-center py-2 rounded-md text-xs font-semibold cursor-pointer hover:bg-primary/20 transition-colors">
        Ask AI
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] flex flex-col h-full border-l">
        <SheetHeader className="border-b pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <SheetTitle className="font-heading text-xl">AI Sales Assistant</SheetTitle>
          </div>
          <SheetDescription>
            I can help you draft emails, analyze leads, or summarize documents.
          </SheetDescription>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          <div className="bg-muted p-3 rounded-lg max-w-[85%] rounded-tl-none">
            <p className="text-sm">Hi there! I'm your Apprising Creatives Sales Assistant. Want me to draft a pitch for our AI Automation or Cybersecurity services to one of your leads?</p>
          </div>
          <div className="bg-primary text-primary-foreground p-3 rounded-lg max-w-[85%] ml-auto rounded-tr-none">
            <p className="text-sm">Draft a short email to Oakridge Medical Clinic. Pitch our Cybersecurity-as-a-Service since they need HIPAA compliance help.</p>
          </div>
          <div className="bg-muted p-3 rounded-lg max-w-[85%] rounded-tl-none">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-3 h-3 text-primary" />
              <span className="text-xs font-semibold text-primary">Draft Generated</span>
            </div>
            <p className="text-sm whitespace-pre-line">
              {`Subject: Quick question about HIPAA compliance at Oakridge\n\nHi [Name],\n\nI noticed Oakridge Medical is expanding, which usually brings up new compliance challenges.\n\nAt Apprising Creatives, we provide 24/7 Cybersecurity-as-a-Service specifically tailored for healthcare providers to ensure HIPAA compliance without the cost of a full in-house IT team.\n\nAre you open to a quick 10-minute chat next week to see if we'd be a fit?\n\nBest,\nSales Team`}
            </p>
            <div className="flex gap-2 mt-3">
              <Button size="sm" variant="outline" className="h-7 text-xs">Copy</Button>
              <Button size="sm" className="h-7 text-xs">Send Email</Button>
            </div>
          </div>
        </div>

        <div className="border-t pt-4 mt-auto">
          <div className="relative">
            <Input placeholder="Type a message..." className="pr-10" />
            <Button size="icon" variant="ghost" className="absolute right-1 top-1 h-7 w-7">
              <Send className="w-4 h-4 text-primary" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
