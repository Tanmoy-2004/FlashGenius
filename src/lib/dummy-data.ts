import type { GeneratedContent } from "./types";

export const DUMMY_CONTENT: GeneratedContent = {
  flashcards: [
    { id: "fc1", question: "What is photosynthesis?", answer: "The process by which plants convert light energy into chemical energy stored in glucose." },
    { id: "fc2", question: "Where does photosynthesis occur?", answer: "Mainly in the chloroplasts of plant cells, specifically in the thylakoid membranes and stroma." },
    { id: "fc3", question: "What are the reactants of photosynthesis?", answer: "Carbon dioxide (CO₂), water (H₂O), and light energy." },
    { id: "fc4", question: "What are the products of photosynthesis?", answer: "Glucose (C₆H₁₂O₆) and oxygen (O₂)." },
    { id: "fc5", question: "What pigment absorbs light in photosynthesis?", answer: "Chlorophyll, primarily chlorophyll a and b, absorbs red and blue light." },
    { id: "fc6", question: "What are the two main stages of photosynthesis?", answer: "The light-dependent reactions and the Calvin cycle (light-independent reactions)." },
    { id: "fc7", question: "What happens in the light-dependent reactions?", answer: "Light energy splits water, releasing oxygen and producing ATP and NADPH." },
    { id: "fc8", question: "What happens in the Calvin cycle?", answer: "CO₂ is fixed into glucose using ATP and NADPH from the light reactions." },
    { id: "fc9", question: "Why is photosynthesis important?", answer: "It produces oxygen and is the primary source of energy for nearly all life on Earth." },
    { id: "fc10", question: "What is the overall equation for photosynthesis?", answer: "6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂" },
  ],
  quiz: [
    { id: "q1", difficulty: "easy", question: "Which organelle carries out photosynthesis?", options: { A: "Mitochondria", B: "Chloroplast", C: "Nucleus", D: "Ribosome" }, correctAnswer: "B" },
    { id: "q2", difficulty: "easy", question: "What gas is released during photosynthesis?", options: { A: "Carbon dioxide", B: "Nitrogen", C: "Oxygen", D: "Hydrogen" }, correctAnswer: "C" },
    { id: "q3", difficulty: "medium", question: "Which pigment is primarily responsible for absorbing light?", options: { A: "Carotene", B: "Xanthophyll", C: "Chlorophyll", D: "Melanin" }, correctAnswer: "C" },
    { id: "q4", difficulty: "medium", question: "The Calvin cycle occurs in which part of the chloroplast?", options: { A: "Thylakoid", B: "Stroma", C: "Granum", D: "Outer membrane" }, correctAnswer: "B" },
    { id: "q5", difficulty: "hard", question: "Which molecule provides the electrons for the light-dependent reactions?", options: { A: "Glucose", B: "Water", C: "ATP", D: "NADPH" }, correctAnswer: "B" },
  ],
  error: null,
};
