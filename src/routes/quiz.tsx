import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Check, X } from "lucide-react";
import { useAppStore } from "@/lib/store";
import type { QuizQuestion } from "@/lib/types";

export const Route = createFileRoute("/quiz")({
  component: Quiz,
});

type Letter = "A" | "B" | "C" | "D";

const difficultyStyles: Record<string, string> = {
  easy: "bg-emerald-500/15 text-emerald-400",
  medium: "bg-amber-500/15 text-amber-400",
  hard: "bg-rose-500/15 text-rose-400",
};

function Quiz() {
  const navigate = useNavigate();
  const content = useAppStore((s) => s.content);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<Letter | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!content) navigate({ to: "/" });
  }, [content, navigate]);

  if (!content) return null;
  const quiz = content.quiz;
  const q: QuizQuestion = quiz[index];
  const progress = ((index + 1) / quiz.length) * 100;

  const pick = (letter: Letter) => {
    if (selected) return;
    setSelected(letter);
    if (letter === q.correctAnswer) setScore((s) => s + 1);
  };

  const next = () => {
    if (index < quiz.length - 1) {
      setIndex(index + 1);
      setSelected(null);
    } else {
      setDone(true);
    }
  };

  if (done) return <Results score={score} total={quiz.length} onRestart={() => { setIndex(0); setSelected(null); setScore(0); setDone(false); }} />;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-2xl flex-col px-5 py-6">
        <header className="mb-6 flex items-center justify-between">
          <Link to="/flashcards" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Cards
          </Link>
          <span className="text-sm font-medium tabular-nums">
            Question {index + 1} of {quiz.length}
          </span>
        </header>

        <div className="mb-8 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full bg-primary transition-[width] duration-300" style={{ width: `${progress}%` }} />
        </div>

        <div className="flex-1">
          <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium capitalize ${difficultyStyles[q.difficulty] ?? "bg-muted text-muted-foreground"}`}>
            {q.difficulty}
          </span>
          <h2 className="mt-4 text-xl font-semibold leading-snug sm:text-2xl">{q.question}</h2>

          <div className="mt-6 space-y-3">
            {(Object.keys(q.options) as Letter[]).map((letter) => {
              const isCorrect = letter === q.correctAnswer;
              const isSelected = letter === selected;
              const revealed = selected !== null;
              let cls = "border-border bg-card hover:bg-muted";
              if (revealed && isCorrect) cls = "border-emerald-500/60 bg-emerald-500/10";
              else if (revealed && isSelected && !isCorrect) cls = "border-rose-500/60 bg-rose-500/10";
              else if (revealed) cls = "border-border bg-card opacity-60";

              return (
                <button
                  key={letter}
                  onClick={() => pick(letter)}
                  disabled={revealed}
                  className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left text-sm font-medium transition-colors ${cls}`}
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-background text-xs font-semibold">
                    {letter}
                  </span>
                  <span className="flex-1">{q.options[letter]}</span>
                  {revealed && isCorrect && <Check className="h-5 w-5 text-emerald-400" />}
                  {revealed && isSelected && !isCorrect && <X className="h-5 w-5 text-rose-400" />}
                </button>
              );
            })}
          </div>

          {selected && (
            <div className="mt-6 rounded-xl border border-border bg-card p-4 text-sm">
              {selected === q.correctAnswer ? (
                <p className="font-medium text-emerald-400">Correct! 🎉</p>
              ) : (
                <p className="font-medium text-rose-400">
                  Not quite. The correct answer is <span className="font-semibold">{q.correctAnswer}</span>.
                </p>
              )}
            </div>
          )}
        </div>

        <button
          onClick={next}
          disabled={!selected}
          className="mt-8 w-full rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {index < quiz.length - 1 ? "Next question" : "See results"}
        </button>
      </div>
    </main>
  );
}

function Results({ score, total, onRestart }: { score: number; total: number; onRestart: () => void }) {
  const pct = Math.round((score / total) * 100);
  const message = pct === 100 ? "Perfect score!" : pct >= 80 ? "Great work!" : pct >= 50 ? "Nice effort — keep studying." : "Time to review those flashcards.";

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-5 py-10 text-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
          <span className="text-3xl font-bold text-primary">{pct}%</span>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">{message}</h1>
        <p className="mt-2 text-muted-foreground">
          You got <span className="font-semibold text-foreground">{score}</span> of {total} correct.
        </p>

        <div className="mt-8 flex w-full flex-col gap-3">
          <button onClick={onRestart} className="w-full rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground hover:opacity-90">
            Retake quiz
          </button>
          <Link to="/flashcards" className="w-full rounded-xl border border-border bg-card px-5 py-3 text-center text-sm font-medium hover:bg-muted">
            Review flashcards
          </Link>
          <Link to="/" className="w-full rounded-xl px-5 py-3 text-center text-sm font-medium text-muted-foreground hover:text-foreground">
            New notes
          </Link>
        </div>
      </div>
    </main>
  );
}
