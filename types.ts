export enum ContentMode {
  LITE = 'LITE', // For general public
  PRO = 'PRO'    // For medical students/professionals
}

export interface SectionData {
  id: string;
  title: string;
  liteDescription: string;
  proDescription: string;
  icon: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface QuizState {
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  score: number;
  loading: boolean;
  completed: boolean;
  error: string | null;
}
