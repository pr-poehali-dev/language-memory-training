import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Word } from '@/types/vocabulary';

interface DropsTrainingProps {
  words: Word[];
  markWordAsLearned: (id: string) => void;
  updateWordPerformance: (id: string, isCorrect: boolean) => void;
  getRandomWords: (excludeIds: string[], count: number) => Word[];
  onBack: () => void;
}

type TrainingMode = 'translation' | 'pronunciation';
type TrainingState = 'mode-select' | 'memorizing' | 'testing' | 'result';

export const DropsTraining = ({
  words,
  markWordAsLearned,
  updateWordPerformance,
  getRandomWords,
  onBack
}: DropsTrainingProps) => {
  const [trainingMode, setTrainingMode] = useState<TrainingMode>('translation');
  const [trainingState, setTrainingState] = useState<TrainingState>('mode-select');
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

  // Text-to-speech function
  const speakWord = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const getNextWord = (mode?: TrainingMode) => {
    const currentMode = mode || trainingMode;
    
    // First priority: unlearned words for memorization
    if (unlearnedWords.length > 0) {
      const randomUnlearned = unlearnedWords[Math.floor(Math.random() * unlearnedWords.length)];
      setCurrentWord(randomUnlearned);
      setTrainingState('memorizing');
      return;
    }

    // Second priority: learned words for testing (need at least 4 for options)
    if (learnedWords.length >= 4) {
      // Weighted selection based on difficulty
      const weightedWords = learnedWords.map(word => {
        const attempts = word.correctAnswers + word.incorrectAnswers;
        if (attempts === 0) return { word, weight: 1 };
        
        const accuracy = word.correctAnswers / attempts;
        // Words with lower accuracy appear more often
        const weight = Math.max(0.1, 1 - accuracy);
        return { word, weight };
      });

      const totalWeight = weightedWords.reduce((sum, item) => sum + item.weight, 0);
      let random = Math.random() * totalWeight;
      
      for (const item of weightedWords) {
        random -= item.weight;
        if (random <= 0) {
          setCurrentWord(item.word);
          generateTestOptions(item.word, currentMode);
          setTrainingState('testing');
          return;
        }
      }
    }

    // No words available
    onBack();
  };

  const generateTestOptions = (correctWord: Word, mode: TrainingMode) => {
    // Get only learned words for options (excluding current word)
    let availableWords = learnedWords.filter(w => w.id !== correctWord.id);
    
    if (availableWords.length < 3) {
      // Not enough learned words, fallback to any words
      const fallbackWords = words.filter(w => w.id !== correctWord.id);
      if (fallbackWords.length < 3) {
        onBack();
        return;
      }
      availableWords = [...availableWords, ...fallbackWords.slice(0, 3 - availableWords.length)];
    }

    // Shuffle and take 3 random words
    const shuffledWords = availableWords.sort(() => Math.random() - 0.5);
    const otherWords = shuffledWords.slice(0, 3);

    console.log('Training mode:', mode);
    console.log('Current word:', correctWord);

    if (mode === 'translation') {
      // Show English word, choose Russian translation
      const allOptions = [correctWord.russian, ...otherWords.map(w => w.russian)];
      const shuffledOptions = allOptions.sort(() => Math.random() - 0.5);
      console.log('Translation options (Russian):', shuffledOptions);
      setOptions(shuffledOptions);
    } else {
      // Pronunciation mode: show audio, choose English word  
      const allOptions = [correctWord.english, ...otherWords.map(w => w.english)];
      const shuffledOptions = allOptions.sort(() => Math.random() - 0.5);
      console.log('Pronunciation options (English):', shuffledOptions);
      setOptions(shuffledOptions);
    }
  };

  const handleStartTraining = (mode: TrainingMode) => {
    console.log('Starting training with mode:', mode);
    setTrainingMode(mode);
    setSessionStats({ correct: 0, incorrect: 0, wordsLearned: 0 });
    getNextWord(mode);
  };

  const handleMemorized = () => {
    if (currentWord) {
      markWordAsLearned(currentWord.id);
      setSessionStats(prev => ({ ...prev, wordsLearned: prev.wordsLearned + 1 }));
      getNextWord();
    }
  };

  const handleAnswerSelect = (answer: string) => {
    if (showResult || !currentWord) return;
    
    setSelectedAnswer(answer);
    
    const correctAnswer = trainingMode === 'translation' 
      ? currentWord.russian 
      : currentWord.english;
    
    const correct = answer === correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);
    
    updateWordPerformance(currentWord.id, correct);
    setSessionStats(prev => ({
      ...prev,
      correct: correct ? prev.correct + 1 : prev.correct,
      incorrect: correct ? prev.incorrect : prev.incorrect + 1
    }));
    
    setTrainingState('result');
  };

  const handleContinue = () => {
    setSelectedAnswer('');
    setShowResult(false);
    getNextWord();
  };

  const handlePlayAudio = () => {
    if (currentWord) {
      speakWord(currentWord.english);
    }
  };

  // Mode selection screen
  if (trainingState === 'mode-select') {
    return (
      <div className="p-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="text-6xl mb-4">🎯</div>
            <h2 className="text-3xl font-bold mb-4">Начать тренировку</h2>
            <p className="text-gray-600 mb-8">
              Выбери режим тренировки для изучения слов
            </p>
          </div>

          {words.length < 4 && (
            <div className="bg-orange-100 border border-orange-400 rounded-lg p-4 mb-6">
              <p className="text-orange-800">
                ⚠️ Для тренировки нужно минимум 4 слова в словаре
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-500"
              onClick={() => words.length >= 4 && handleStartTraining('translation')}
            >
              <CardHeader className="text-center pb-4">
                <div className="text-4xl mb-3">📖</div>
                <CardTitle className="text-xl">Перевод</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">
                  Видишь английское слово → выбираешь русский перевод
                </p>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-semibold text-blue-600">Apple</p>
                  <p className="text-sm text-gray-500 mt-1">→ Яблоко</p>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-purple-500"
              onClick={() => words.length >= 4 && handleStartTraining('pronunciation')}
            >
              <CardHeader className="text-center pb-4">
                <div className="text-4xl mb-3">🔊</div>
                <CardTitle className="text-xl">Произношение</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">
                  Слушаешь произношение → выбираешь правильное английское слово
                </p>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mb-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      speakWord('Apple');
                    }}
                  >
                    <Icon name="Volume2" size={16} className="mr-2" />
                    Послушать
                  </Button>
                  <p className="text-sm text-gray-500">→ Apple</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <span>Новых слов: {unlearnedWords.length}</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span>Изученных слов: {learnedWords.length}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Training screens
  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header with close button */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="text-2xl">
              {trainingMode === 'translation' ? '📖' : '🔊'}
            </div>
            <div>
              <h3 className="text-lg font-semibold">
                {trainingMode === 'translation' ? 'Перевод' : 'Произношение'}
              </h3>
              <div className="flex space-x-4 text-sm text-gray-600">
                <span>✅ {sessionStats.correct}</span>
                <span>❌ {sessionStats.incorrect}</span>
                <span>🧠 {sessionStats.wordsLearned}</span>
              </div>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onBack}
            className="text-red-600 hover:text-red-700"
          >
            <Icon name="X" size={16} className="mr-2" />
            Закрыть
          </Button>
        </div>

        {/* Memorization screen */}
        {trainingState === 'memorizing' && currentWord && (
          <Card className="mb-6">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl">🧠 Запомни новое слово</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="mb-8">
                <p className="text-5xl font-bold text-blue-600 mb-4">
                  {currentWord.english}
                </p>
                <p className="text-2xl text-gray-700 mb-4">
                  {currentWord.russian}
                </p>
                <Button
                  variant="outline"
                  onClick={handlePlayAudio}
                  className="mb-4"
                >
                  <Icon name="Volume2" size={20} className="mr-2" />
                  Произношение
                </Button>
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
        )}

        {/* Testing screen */}
        {trainingState === 'testing' && currentWord && (
          <Card className="mb-6">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl">
                {trainingMode === 'translation' ? '📖 Выбери перевод' : '🔊 Выбери правильное слово'}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="mb-8">
                {trainingMode === 'translation' ? (
                  <p className="text-5xl font-bold text-blue-600 mb-8">
                    {currentWord.english}
                  </p>
                ) : (
                  <div className="mb-8">
                    <Button
                      onClick={handlePlayAudio}
                      size="lg"
                      className="bg-purple-500 hover:bg-purple-600 text-white"
                    >
                      <Icon name="Volume2" size={32} className="mr-3" />
                      Нажми и слушай
                    </Button>
                    <p className="text-sm text-gray-500 mt-2">
                      Выбери правильное английское слово
                    </p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 max-w-md mx-auto">
                {options.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="lg"
                    onClick={() => handleAnswerSelect(option)}
                    className="p-4 text-lg hover:bg-blue-50"
                    title={`Mode: ${trainingMode}, Option: ${option}`}
                  >
                    {option}
                  </Button>
                ))}
              </div>
              <div className="mt-4 text-xs text-gray-400">
                Debug: Mode={trainingMode}, Options={JSON.stringify(options)}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Result screen */}
        {trainingState === 'result' && currentWord && showResult && (
          <Card className="mb-6">
            <CardContent className="p-8 text-center">
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
                  {trainingMode === 'translation' 
                    ? `${currentWord.english} → ${currentWord.russian}`
                    : `Правильный ответ: ${currentWord.english}`
                  }
                </p>
                {!isCorrect && (
                  <Button
                    variant="outline"
                    onClick={handlePlayAudio}
                    className="mt-3"
                  >
                    <Icon name="Volume2" size={16} className="mr-2" />
                    Послушать
                  </Button>
                )}
              </div>

              <Button
                onClick={handleContinue}
                size="lg"
                className="bg-blue-500 hover:bg-blue-600"
              >
                <Icon name="ArrowRight" size={20} className="mr-2" />
                Продолжить
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};