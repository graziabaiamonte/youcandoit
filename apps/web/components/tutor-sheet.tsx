"use client";

import { GraduationCapIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Chat } from "@/components/chat";

export function TutorSheet({ sessionId, sessionTitle }: { sessionId: string; sessionTitle: string }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary">
          <GraduationCapIcon aria-hidden /> Ask the tutor
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>AI tutor</SheetTitle>
          <SheetDescription>
            Answers come from this session&apos;s sources and cite them. Session {sessionId}: {sessionTitle}
          </SheetDescription>
        </SheetHeader>
        <div className="min-h-0 flex-1 px-4 pb-4">
          <Chat
            endpoint="/ai/tutor"
            extraBody={{ session_id: sessionId }}
            placeholder="Ask anything about this topic…"
            suggestions={[
              "Explain this topic to me like I'm new to programming.",
              "Give me a real-world analogy and a small example.",
              "What are the most common mistakes beginners make here?",
            ]}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
