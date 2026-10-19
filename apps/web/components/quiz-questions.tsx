"use client";

import { useState } from "react";
import { CheckIcon, XIcon } from "lucide-react";
import type { Quiz } from "@/lib/api";
import { cn } from "@/lib/utils";

/** Multiple-choice questions with instant feedback and a final score. Remount (change `key`) to reset. */
export function QuizQuestions({ questions, action }: { questions: Quiz["questions"]; action?: React.ReactNode }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const score = questions.filter((q, i) => answers[i] === q.answer).length;
  const finished = Object.keys(answers).length === questions.length;

  return (
    <>
      {questions.map((q, i) => (
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
            Score: {score}/{questions.length}
          </span>
          {action}
        </div>
      )}
    </>
  );
}
