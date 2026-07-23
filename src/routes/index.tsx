import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { DUMMY_CONTENT } from "@/lib/dummy-data";
import { generateContent } from "@/lib/generate.functions";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  const navigate = useNavigate();
  const { notes, setNotes, setContent } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const wordCount = notes.trim() ? notes.trim().split(/\s+/).length : 0;
  const canGenerate = wordCount >= 20 && wordCount <= 3000 && !loading;

  const handleGenerate = async () => {
    setError(null);
    setLoading(true);
    try {
      const result = await generateContent({ data: { notes } });
      if (result.error || result.flashcards.length === 0) {
        setError(result.error ?? "Couldn't generate content from those notes.");
        setLoading(false);
        return;
      }
      setContent(result);
      navigate({ to: "/flashcards" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setLoading(false);
    }
  };

  const handleDemo = () => {
    setContent(DUMMY_CONTENT);
    navigate({ to: "/flashcards" });
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-2xl flex-col px-5 py-10 sm:py-16">
        <header className="mb-10 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-lg font-semibold tracking-tight">FlashGenius</span>
        </header>

        <section className="flex-1">
          <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            Turn notes into flashcards.
          </h1>
          <p className="mt-3 text-base text-muted-foreground">
            Paste your study notes below. We'll generate 10 flashcards and a 5-question quiz you can use to study.
          </p>

          <div className="mt-8">
            <label htmlFor="notes" className="mb-2 block text-sm font-medium">
              Your notes
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Paste your notes here (20 – 3,000 words)…"
              className="min-h-[220px] w-full resize-y rounded-xl border border-border bg-card p-4 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              disabled={loading}
            />
            <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>{wordCount.toLocaleString()} / 3,000 words</span>
              {wordCount > 3000 && <span className="text-destructive">Too long</span>}
              {wordCount > 0 && wordCount < 20 && <span>Add a bit more…</span>}
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive-foreground">
              {error}
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={!canGenerate}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating…
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate flashcards
              </>
            )}
          </button>

          <button
            onClick={handleDemo}
            disabled={loading}
            className="mt-3 w-full rounded-xl border border-border bg-transparent px-5 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-card disabled:opacity-40"
          >
            Try with demo notes
          </button>
        </section>

        <footer className="mt-10 text-center text-xs text-muted-foreground">
          Built for studying. Powered by AI.
        </footer>
      </div>
    </main>
  );
}
