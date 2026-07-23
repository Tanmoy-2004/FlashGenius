export type Flashcard = {
  id: string;
  question: string;
  answer: string;
};

export type QuizDifficulty = "easy" | "medium" | "hard";

export type QuizQuestion = {
  id: string;
  difficulty: QuizDifficulty;
  question: string;
  options: { A: string; B: string; C: string; D: string };
  correctAnswer: "A" | "B" | "C" | "D";
};

export type GeneratedContent = {
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
  error: string | null;
};
