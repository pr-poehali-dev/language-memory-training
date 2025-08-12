import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { Word, GameSession } from '@/types/vocabulary';

interface GameTrainingProps {
  words: Word[];
  markWordAsLearned: (id: string) => void;
  updateWordPerformance: (id: string, isCorrect: boolean) => void;
  getRandomWords: (excludeIds: string[], count: number) => Word[];
  getNextWordToLearn: () => Word | null;
  getWordForReview: () => Word | null;
  currentSession: GameSession | null;
  setCurrentSession: (session: GameSession | null) => void;
  onBack: () => void;
}

type GameState = 'idle' | 'learning' | 'practicing' | 'completed';

export const GameTraining = ({
  words,
  markWordAsLearned,
  updateWordPerformance,
  getRandomWords,
  getNextWordToLearn,
  getWordForReview,
  currentSession,
  setCurrentSession
}: GameTrainingProps) => {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    correct: 0,
    incorrect: 0,
    wordsLearned: 0
  });

  const learnedWords = words.filter(w => w.isLearned);
  const unlearnedWords = words.filter(w => !w.isLearned);

  const startSession = () => {
    const session: GameSession = {
      id: Date.now().toString(),
      startTime: new Date(),
      endTime: null,
      totalWords: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
      wordsLearned: []
    };
    setCurrentSession(session);
    setSessionStats({ correct: 0, incorrect: 0, wordsLearned: 0 });
    nextWord();
  };

  const endSession = () => {
    if (currentSession) {
      const updatedSession: GameSession = {
        ...currentSession,
        endTime: new Date(),
        correctAnswers: sessionStats.correct,
        incorrectAnswers: sessionStats.incorrect
      };
      setCurrentSession(updatedSession);
    }
    setGameState('idle');
    setCurrentWord(null);
    setOptions([]);
    setSelectedAnswer('');
    setShowResult(false);
  };

  const nextWord = () => {
    setSelectedAnswer('');
    setShowResult(false);
    
    // First, try to get a word to learn (unlearned word)
    const wordToLearn = getNextWordToLearn();
    
    if (wordToLearn) {
      // Learning mode: show word for memorization
      setGameState('learning');
      setCurrentWord(wordToLearn);
      setOptions([]);
    } else {
      // Practice mode: get a word for review
      const wordToReview = getWordForReview();
      
      if (wordToReview && learnedWords.length >= 4) {
        setGameState('practicing');
        setCurrentWord(wordToReview);
        generateOptions(wordToReview);
      } else {
        // No more words to practice
        setGameState('completed');
      }
    }
  };

  const generateOptions = (correctWord: Word) => {
    const otherWords = getRandomWords([correctWord.id], 3);
    
    if (otherWords.length < 3) {
      // Not enough words for options, end session
      setGameState('completed');
      return;
    }

    const allOptions = [correctWord.russian, ...otherWords.map(w => w.russian)];
    const shuffledOptions = allOptions.sort(() => Math.random() - 0.5);
    setOptions(shuffledOptions);
  };

  const handleMemorized = () => {
    if (currentWord) {
      markWordAsLearned(currentWord.id);
      setSessionStats(prev => ({ ...prev, wordsLearned: prev.wordsLearned + 1 }));
      nextWord();
    }
  };

  const handleAnswerSelect = (answer: string) => {
    if (showResult || !currentWord) return;
    
    setSelectedAnswer(answer);
    const correct = answer === currentWord.russian;
    setIsCorrect(correct);
    setShowResult(true);
    
    // Update word performance
    updateWordPerformance(currentWord.id, correct);
    
    // Update session stats
    setSessionStats(prev => ({
      ...prev,
      correct: correct ? prev.correct + 1 : prev.correct,
      incorrect: correct ? prev.incorrect : prev.incorrect + 1
    }));
  };

  const handleContinue = () => {
    nextWord();
  };

  if (gameState === 'idle') {
    return (
      <div className="p-8 text-center">
        <div className="mb-8">
          <div className="text-6xl mb-4">🎯</div>
          <h2 className="text-3xl font-bold mb-4">Игровая тренировка</h2>
          <p className="text-gray-600 mb-6">
            Изучай новые слова и повторяй уже изученные в игровом формате
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-2">📝</div>
              <h3 className="font-semibold mb-2">Новых слов</h3>
              <p className="text-2xl font-bold text-red-500">{unlearnedWords.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-2">✅</div>
              <h3 className="font-semibold mb-2">Изученных слов</h3>
              <p className="text-2xl font-bold text-green-500">{learnedWords.length}</p>
            </CardContent>
          </Card>
        </div>

        <Button
          onClick={startSession}
          size="lg"
          className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 text-xl"
        >
          <Icon name="Play" size={24} className="mr-3" />
          Начать тренировку
        </Button>
      </div>
    );
  }

  if (gameState === 'completed') {
    return (
      <div className="p-8 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-3xl font-bold mb-4">Тренировка завершена!</h2>
        <div className="max-w-md mx-auto mb-8">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-500">{sessionStats.correct}</p>
              <p className="text-sm text-gray-600">Правильно</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-500">{sessionStats.incorrect}</p>
              <p className="text-sm text-gray-600">Неправильно</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-500">{sessionStats.wordsLearned}</p>
              <p className="text-sm text-gray-600">Изучено</p>
            </div>
          </div>
        </div>
        <Button onClick={endSession} size="lg">
          Завершить
        </Button>
      </div>
    );
  }

  if (gameState === 'learning' && currentWord) {
    return (
      <div className="p-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Запоминание нового слова</h3>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={endSession}
                className="text-red-600 hover:text-red-700"
              >
                <Icon name="X" size={16} className="mr-2" />
                Завершить
              </Button>
            </div>
            <Progress value={75} className="mb-2" />
            <p className="text-sm text-gray-600">Новых слов: {unlearnedWords.length}</p>
          </div>

          <Card className="mb-6">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl">🧠 Новое слово</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="mb-8">
                <p className="text-5xl font-bold text-blue-600 mb-4">
                  {currentWord.english}
                </p>
                <p className="text-2xl text-gray-700 mb-2">
                  {currentWord.russian}
                </p>
              </div>

              <Button
                onClick={handleMemorized}
                size="lg"
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-4"
              >
                <Icon name="Brain" size={24} className="mr-3" />
                Запомнил!
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (gameState === 'practicing' && currentWord) {
    return (
      <div className="p-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Практика</h3>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={endSession}
                className="text-red-600 hover:text-red-700"
              >
                <Icon name="X" size={16} className="mr-2" />
                Завершить
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <p>Правильно: {sessionStats.correct}</p>
              <p>Неправильно: {sessionStats.incorrect}</p>
            </div>
          </div>

          <Card className="mb-6">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl">🎯 Выбери правильный перевод</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="mb-8">
                <p className="text-5xl font-bold text-blue-600 mb-8">
                  {currentWord.english}
                </p>
              </div>

              {!showResult ? (
                <div className="grid grid-cols-1 gap-4 max-w-md mx-auto">
                  {options.map((option, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="lg"
                      onClick={() => handleAnswerSelect(option)}
                      className="p-4 text-lg hover:bg-blue-50"
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              ) : (
                <div className="max-w-md mx-auto">
                  <div className={`p-6 rounded-lg mb-6 ${
                    isCorrect ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500'
                  } border-2`}>
                    <div className="text-4xl mb-3">
                      {isCorrect ? '✅' : '❌'}
                    </div>
                    <p className="text-xl font-semibold mb-2">
                      {isCorrect ? 'Правильно!' : 'Неправильно'}
                    </p>
                    <p className="text-gray-700">
                      Правильный ответ: <strong>{currentWord.russian}</strong>
                    </p>
                  </div>

                  <Button
                    onClick={handleContinue}
                    size="lg"
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    <Icon name="ArrowRight" size={20} className="mr-2" />
                    Продолжить
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return null;
};