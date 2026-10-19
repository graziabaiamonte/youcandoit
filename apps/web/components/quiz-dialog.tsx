"use client";

import { useState } from "react";
import { CheckIcon, ListChecksIcon, Loader2Icon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { api, type Quiz } from "@/lib/api";
import { cn } from "@/lib/utils";

/** Retrieval practice: an AI-generated multiple-choice quiz with instant feedback. */
export function QuizDialog({ sessionId }: { sessionId: string }) {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generate() {
    setLoading(true);
    setError("");
    setAnswers({});
    try {
      setQuiz(await api<Quiz>(`/ai/quiz/${sessionId}`, { method: "POST" }));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  const score = quiz?.questions.filter((q, i) => answers[i] === q.answer).length ?? 0;
  const finished = quiz && Object.keys(answers).length === quiz.questions.length;

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
        {quiz?.questions.map((q, i) => (
          <fieldset key={i} className="space-y-2">
            <legend className="font-medium">
              {i + 1}. {q.question}
            </legend>
            {q.options.map((opt, j) => {
              const picked = answers[i] === j;
              const answered = i in answers;
              return (
                <button
                  key={j}
                  type="button"
                  disabled={answered}
                  onClick={() => setAnswers((a) => ({ ...a, [i]: j }))}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg border p-2.5 text-left text-sm",
                    answered && j === q.answer && "border-success bg-success/10",
                    answered && picked && j !== q.answer && "border-destructive bg-destructive/10",
                    !answered && "hover:border-primary/50",
                  )}
                >
                  {answered && j === q.answer && <CheckIcon className="size-4 text-success" aria-label="Correct" />}
                  {answered && picked && j !== q.answer && <XIcon className="size-4 text-destructive" aria-label="Wrong" />}
                  {opt}
                </button>
              );
            })}
            {i in answers && <p className="text-sm text-muted-foreground">{q.explanation}</p>}
          </fieldset>
        ))}
        {finished && (
          <div className="flex items-center justify-between rounded-lg bg-accent p-3">
            <span className="font-semibold">
              Score: {score}/{quiz.questions.length}
            </span>
            <Button size="sm" variant="outline" onClick={generate}>
              New quiz
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
