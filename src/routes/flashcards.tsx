import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, RotateCw } from "lucide-react";
import { useAppStore } from "@/lib/store";

export const Route = createFileRoute("/flashcards")({
  component: Flashcards,
});

function Flashcards() {
  const navigate = useNavigate();
  const content = useAppStore((s) => s.content);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    if (!content) navigate({ to: "/" });
  }, [content, navigate]);

  if (!content) return null;

  const cards = content.flashcards;
  const card = cards[index];
  const progress = ((index + 1) / cards.length) * 100;

  const go = (dir: 1 | -1) => {
    const next = Math.min(Math.max(index + dir, 0), cards.length - 1);
    setIndex(next);
    setFlipped(false);
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-2xl flex-col px-5 py-6">
        <header className="mb-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <span className="text-sm font-medium tabular-nums">
            Card {index + 1} of {cards.length}
          </span>
        </header>

        <div className="mb-8 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-primary transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex flex-1 items-center justify-center">
          <button
            type="button"
            onClick={() => setFlipped((f) => !f)}
            className="group relative w-full [perspective:1200px]"
            aria-label="Flip card"
          >
            <div
              className={`relative min-h-[320px] w-full transition-transform duration-500 [transform-style:preserve-3d] ${
                flipped ? "[transform:rotateY(180deg)]" : ""
              }`}
            >
              <CardFace label="Question" text={card.question} />
              <CardFace label="Answer" text={card.answer} back />
            </div>
          </button>
        </div>

        <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <RotateCw className="h-3 w-3" /> Tap card to flip
        </p>

        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={() => go(-1)}
            disabled={index === 0}
            className="flex flex-1 items-center justify-center gap-1 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium transition-opacity disabled:opacity-30"
          >
            <ArrowLeft className="h-4 w-4" /> Prev
          </button>
          {index < cards.length - 1 ? (
            <button
              onClick={() => go(1)}
              className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
            >
              Next <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={() => navigate({ to: "/quiz" })}
              className="flex-1 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
            >
              Start quiz →
            </button>
          )}
        </div>
      </div>
    </main>
  );
}

function CardFace({ label, text, back = false }: { label: string; text: string; back?: boolean }) {
  return (
    <div
      className={`absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-6 text-center shadow-lg [backface-visibility:hidden] ${
        back ? "[transform:rotateY(180deg)]" : ""
      }`}
    >
      <span className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <p className="text-lg font-medium leading-relaxed text-foreground sm:text-xl">{text}</p>
    </div>
  );
}
