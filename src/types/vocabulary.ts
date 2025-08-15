export interface Word {
  id: string;
  english: string;
  russian: string;
  isLearned: boolean;
  correctAnswers: number;
  incorrectAnswers: number;
  lastReviewed: Date | null;
  difficulty: number; // 0-1, higher = more difficult
  nextReview: Date | null;
}

export interface GameSession {
  id: string;
  startTime: Date;
  endTime: Date | null;
  totalWords: number;
  correctAnswers: number;
  incorrectAnswers: number;
  wordsLearned: string[];
}

export interface UserStats {
  totalWordsLearned: number;
  totalSessions: number;
  averageAccuracy: number;
  streakDays: number;
  lastSessionDate: Date | null;
  totalTimeSpent: number; // in minutes
}

export type GameMode = 'learn' | 'practice';
export type GameState = 'idle' | 'learning' | 'practicing' | 'completed';
export type TrainingMode = 'translation' | 'pronunciation' | 'russian';