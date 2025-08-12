import { useState, useEffect } from 'react';
import { Word, GameSession, UserStats } from '@/types/vocabulary';

export const useVocabulary = () => {
  const [words, setWords] = useState<Word[]>([]);
  const [currentSession, setCurrentSession] = useState<GameSession | null>(null);
  const [userStats, setUserStats] = useState<UserStats>({
    totalWordsLearned: 0,
    totalSessions: 0,
    averageAccuracy: 0,
    streakDays: 0,
    lastSessionDate: null,
    totalTimeSpent: 0,
  });

  useEffect(() => {
    const savedWords = localStorage.getItem('vocabulary-words');
    const savedStats = localStorage.getItem('vocabulary-stats');
    
    if (savedWords) {
      const parsedWords = JSON.parse(savedWords);
      parsedWords.forEach((word: any) => {
        if (word.lastReviewed) word.lastReviewed = new Date(word.lastReviewed);
        if (word.nextReview) word.nextReview = new Date(word.nextReview);
      });
      setWords(parsedWords);
    }
    
    if (savedStats) {
      const parsedStats = JSON.parse(savedStats);
      if (parsedStats.lastSessionDate) {
        parsedStats.lastSessionDate = new Date(parsedStats.lastSessionDate);
      }
      setUserStats(parsedStats);
    }
  }, []);

  const saveWords = (newWords: Word[]) => {
    localStorage.setItem('vocabulary-words', JSON.stringify(newWords));
    setWords(newWords);
  };

  const saveStats = (newStats: UserStats) => {
    localStorage.setItem('vocabulary-stats', JSON.stringify(newStats));
    setUserStats(newStats);
  };

  const addWord = (english: string, russian: string) => {
    const newWord: Word = {
      id: Date.now().toString(),
      english,
      russian,
      isLearned: false,
      correctAnswers: 0,
      incorrectAnswers: 0,
      lastReviewed: null,
      difficulty: 1,
      nextReview: null,
    };
    saveWords([...words, newWord]);
  };

  const editWord = (id: string, english: string, russian: string) => {
    const updatedWords = words.map(word => 
      word.id === id ? { ...word, english, russian } : word
    );
    saveWords(updatedWords);
  };

  const deleteWord = (id: string) => {
    const updatedWords = words.filter(word => word.id !== id);
    saveWords(updatedWords);
  };

  const markWordAsLearned = (id: string) => {
    const updatedWords = words.map(word => {
      if (word.id === id) {
        return {
          ...word,
          isLearned: true,
          lastReviewed: new Date(),
          nextReview: new Date(Date.now() + 24 * 60 * 60 * 1000), // Next day
        };
      }
      return word;
    });
    saveWords(updatedWords);
  };

  const updateWordPerformance = (id: string, isCorrect: boolean) => {
    const updatedWords = words.map(word => {
      if (word.id === id) {
        const newCorrect = isCorrect ? word.correctAnswers + 1 : word.correctAnswers;
        const newIncorrect = isCorrect ? word.incorrectAnswers : word.incorrectAnswers + 1;
        const totalAnswers = newCorrect + newIncorrect;
        const accuracy = totalAnswers > 0 ? newCorrect / totalAnswers : 0;
        
        // Adaptive algorithm: reduce difficulty if doing well
        const newDifficulty = isCorrect 
          ? Math.max(0.1, word.difficulty - 0.1) 
          : Math.min(1, word.difficulty + 0.2);
        
        // Calculate next review based on performance
        const baseInterval = 24 * 60 * 60 * 1000; // 1 day
        const multiplier = isCorrect ? Math.min(7, 1 + accuracy * 6) : 0.5;
        const nextReview = new Date(Date.now() + baseInterval * multiplier);

        return {
          ...word,
          correctAnswers: newCorrect,
          incorrectAnswers: newIncorrect,
          difficulty: newDifficulty,
          lastReviewed: new Date(),
          nextReview,
        };
      }
      return word;
    });
    saveWords(updatedWords);
  };

  const getRandomWords = (excludeIds: string[], count: number): Word[] => {
    const availableWords = words.filter(word => 
      word.isLearned && !excludeIds.includes(word.id)
    );
    
    const shuffled = [...availableWords].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  };

  const getNextWordToLearn = (): Word | null => {
    const unlearnedWords = words.filter(word => !word.isLearned);
    if (unlearnedWords.length === 0) return null;
    
    return unlearnedWords[Math.floor(Math.random() * unlearnedWords.length)];
  };

  const getWordForReview = (): Word | null => {
    const now = new Date();
    const wordsForReview = words.filter(word => 
      word.isLearned && 
      word.nextReview && 
      word.nextReview <= now
    );
    
    if (wordsForReview.length === 0) {
      // If no words are due, get a random learned word with higher difficulty preference
      const learnedWords = words.filter(word => word.isLearned);
      if (learnedWords.length === 0) return null;
      
      // Weight by difficulty (higher difficulty = more likely to be selected)
      const weightedWords = learnedWords.flatMap(word => 
        Array(Math.ceil(word.difficulty * 10)).fill(word)
      );
      
      return weightedWords[Math.floor(Math.random() * weightedWords.length)];
    }
    
    return wordsForReview[Math.floor(Math.random() * wordsForReview.length)];
  };

  return {
    words,
    userStats,
    currentSession,
    setCurrentSession,
    addWord,
    editWord,
    deleteWord,
    markWordAsLearned,
    updateWordPerformance,
    getRandomWords,
    getNextWordToLearn,
    getWordForReview,
    saveStats,
  };
};