"use client";

import { useState } from "react";
import { ListChecksIcon, Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { QuizQuestions } from "@/components/quiz-questions";
import { api, type Quiz } from "@/lib/api";

/** Retrieval practice: an AI-generated multiple-choice quiz with instant feedback. */
export function QuizDialog({ sessionId }: { sessionId: string }) {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generate() {
    setLoading(true);
    setError("");
    setAttempt((n) => n + 1); // remounts QuizQuestions, clearing answers
    try {
      setQuiz(await api<Quiz>(`/ai/quiz/${sessionId}`, { method: "POST" }));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog onOpenChange={(open) => open && !quiz && generate()}>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <ListChecksIcon aria-hidden /> Quiz me
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Check your understanding</DialogTitle>
          <DialogDescription>Recalling answers is what moves knowledge into long-term memory.</DialogDescription>
        </DialogHeader>
        {loading && (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2Icon className="size-4 animate-spin" aria-hidden /> Writing your quiz…
          </p>
        )}
        {error && <p className="text-sm text-destructive">{error}</p>}
        {quiz && (
          <QuizQuestions
            key={attempt}
            questions={quiz.questions}
            action={
              <Button size="sm" variant="outline" onClick={generate}>
                New quiz
              </Button>
            }
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
