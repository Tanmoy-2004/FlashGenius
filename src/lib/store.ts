import { create } from "zustand";
import type { GeneratedContent } from "./types";

type State = {
  content: GeneratedContent | null;
  notes: string;
  setNotes: (n: string) => void;
  setContent: (c: GeneratedContent | null) => void;
};

export const useAppStore = create<State>((set) => ({
  content: null,
  notes: "",
  setNotes: (notes) => set({ notes }),
  setContent: (content) => set({ content }),
}));
