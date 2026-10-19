"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Loader2Icon, SendIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { api, type Answer, type Turn } from "@/lib/api";

type Message = Turn & { citations?: Answer["citations"] };

/** RAG chat: sends the question + history to `endpoint` and shows cited answers. */
export function Chat({
  endpoint,
  extraBody = {},
  placeholder,
  suggestions = [],
}: {
  endpoint: string;
  extraBody?: Record<string, string>;
  placeholder: string;
  suggestions?: string[];
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function send(question: string) {
    if (!question.trim() || pending) return;
    const history: Turn[] = messages.map(({ role, content }) => ({ role, content }));
    setMessages((m) => [...m, { role: "user", content: question }]);
    setInput("");
    setPending(true);
    setError("");
    try {
      const res = await api<Answer>(endpoint, { method: "POST", body: { ...extraBody, question, history } });
      setMessages((m) => [...m, { role: "assistant", content: res.answer, citations: res.citations }]);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-1" aria-live="polite" data-testid="chat-log">
        {!messages.length && (
          <div className="space-y-2">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => send(s)}
                className="block w-full rounded-lg border bg-muted/40 p-3 text-left text-sm hover:border-primary/50"
              >
                {s}
              </button>
            ))}
          </div>
        )}
        {messages.map((m, i) =>
          m.role === "user" ? (
            <p key={i} className="ml-8 rounded-xl rounded-br-sm bg-primary p-3 text-sm text-primary-foreground">
              {m.content}
            </p>
          ) : (
            <div key={i} className="mr-4 space-y-2 rounded-xl rounded-bl-sm bg-muted p-3 text-sm" data-testid="chat-answer">
              <div className="prose-sm space-y-2 leading-relaxed [&_code]:rounded [&_code]:bg-background [&_code]:px-1 [&_li]:ml-4 [&_ol]:list-decimal [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-background [&_pre]:p-2 [&_ul]:list-disc">
                <ReactMarkdown>{m.content}</ReactMarkdown>
              </div>
              {!!m.citations?.length && (
                <ol className="space-y-1 border-t pt-2 text-xs" aria-label="Sources">
                  {m.citations.map((c) => (
                    <li key={c.n}>
                      <a href={c.url} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                        [{c.n}] {c.title}
                      </a>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          ),
        )}
        {pending && (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2Icon className="size-4 animate-spin" aria-hidden /> Thinking… local models can take a minute.
          </p>
        )}
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
      <form
        className="flex items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send(input);
            }
          }}
          placeholder={placeholder}
          aria-label="Your question"
          className="max-h-40 min-h-11 resize-none"
          maxLength={4000}
        />
        <Button type="submit" size="icon" disabled={pending || !input.trim()} aria-label="Send">
          <SendIcon aria-hidden />
        </Button>
      </form>
    </div>
  );
}
