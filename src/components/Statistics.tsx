import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Word, UserStats } from '@/types/vocabulary';

interface StatisticsProps {
  words: Word[];
  userStats: UserStats;
  onBack: () => void;
}

export const Statistics = ({ words, userStats }: StatisticsProps) => {
  const learnedWords = words.filter(w => w.isLearned);
  const totalCorrectAnswers = words.reduce((sum, w) => sum + w.correctAnswers, 0);
  const totalIncorrectAnswers = words.reduce((sum, w) => sum + w.incorrectAnswers, 0);
  const totalAnswers = totalCorrectAnswers + totalIncorrectAnswers;
  const accuracy = totalAnswers > 0 ? Math.round((totalCorrectAnswers / totalAnswers) * 100) : 0;
  
  const getPerformanceColor = (correct: number, incorrect: number) => {
    const total = correct + incorrect;
    if (total === 0) return 'gray';
    const acc = correct / total;
    if (acc >= 0.8) return 'green';
    if (acc >= 0.6) return 'yellow';
    return 'red';
  };

  const getDifficultyLevel = (difficulty: number) => {
    if (difficulty <= 0.3) return { text: 'Легко', color: 'green' };
    if (difficulty <= 0.6) return { text: 'Средне', color: 'yellow' };
    return { text: 'Сложно', color: 'red' };
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-center mb-2">📊 Статистика</h2>
        <p className="text-center text-gray-600">
          Твой прогресс в изучении английских слов
        </p>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl mb-2">📚</div>
            <h3 className="font-semibold mb-1">Всего слов</h3>
            <p className="text-2xl font-bold text-blue-600">{words.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl mb-2">✅</div>
            <h3 className="font-semibold mb-1">Изучено</h3>
            <p className="text-2xl font-bold text-green-600">{learnedWords.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl mb-2">🎯</div>
            <h3 className="font-semibold mb-1">Точность</h3>
            <p className="text-2xl font-bold text-purple-600">{accuracy}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl mb-2">🔥</div>
            <h3 className="font-semibold mb-1">Серия</h3>
            <p className="text-2xl font-bold text-orange-600">{userStats.streakDays}</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Icon name="TrendingUp" size={24} className="mr-2" />
            Общий прогресс
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span>Изучено слов</span>
                <span>{learnedWords.length}/{words.length}</span>
              </div>
              <Progress 
                value={words.length > 0 ? (learnedWords.length / words.length) * 100 : 0} 
                className="h-3"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Words Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Icon name="Target" size={24} className="mr-2" />
            Производительность по словам
          </CardTitle>
        </CardHeader>
        <CardContent>
          {words.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">📝</div>
              <p className="text-gray-500">Нет слов для анализа</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {words.map((word) => {
                const performanceColor = getPerformanceColor(word.correctAnswers, word.incorrectAnswers);
                const difficultyInfo = getDifficultyLevel(word.difficulty);
                const totalAttempts = word.correctAnswers + word.incorrectAnswers;
                const wordAccuracy = totalAttempts > 0 ? Math.round((word.correctAnswers / totalAttempts) * 100) : 0;

                return (
                  <div key={word.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4 flex-1">
                      <div>
                        <span className="font-semibold">{word.english}</span>
                        <span className="mx-2 text-gray-400">→</span>
                        <span className="text-gray-700">{word.russian}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        {totalAttempts > 0 && (
                          <div className="text-sm text-gray-600">
                            {word.correctAnswers}/{totalAttempts} ({wordAccuracy}%)
                          </div>
                        )}
                      </div>
                      
                      <div className="flex space-x-2">
                        <Badge 
                          variant={word.isLearned ? "default" : "destructive"}
                          className={word.isLearned ? "bg-green-500" : "bg-red-500"}
                        >
                          {word.isLearned ? "Изучено" : "Новое"}
                        </Badge>
                        
                        {word.isLearned && (
                          <Badge 
                            variant="outline"
                            className={`border-${difficultyInfo.color}-500 text-${difficultyInfo.color}-700`}
                          >
                            {difficultyInfo.text}
                          </Badge>
                        )}
                        
                        {totalAttempts > 0 && (
                          <Badge 
                            variant="outline"
                            className={`border-${performanceColor}-500 text-${performanceColor}-700`}
                          >
                            {wordAccuracy}%
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};