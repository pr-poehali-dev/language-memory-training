import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { UserStats, Word } from '@/types/vocabulary';

interface UserProfileProps {
  words: Word[];
  userStats: UserStats;
  saveStats: (stats: UserStats) => void;
  onBack: () => void;
}

export const UserProfile = ({ words, userStats, saveStats }: UserProfileProps) => {
  const [userName, setUserName] = useState(localStorage.getItem('userName') || 'Изучающий английский');
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(userName);

  const learnedWords = words.filter(w => w.isLearned);
  const totalCorrect = words.reduce((sum, w) => sum + w.correctAnswers, 0);
  const totalIncorrect = words.reduce((sum, w) => sum + w.incorrectAnswers, 0);
  const totalAttempts = totalCorrect + totalIncorrect;
  const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

  const handleSaveName = () => {
    if (tempName.trim()) {
      setUserName(tempName.trim());
      localStorage.setItem('userName', tempName.trim());
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setTempName(userName);
    setIsEditing(false);
  };

  const resetProgress = () => {
    if (confirm('Вы уверены, что хотите сбросить весь прогресс? Это действие нельзя отменить.')) {
      localStorage.removeItem('vocabulary-words');
      localStorage.removeItem('vocabulary-stats');
      window.location.reload();
    }
  };

  const getAllAchievements = () => {
    return [
      // Learning Milestones
      { 
        icon: '🌟', 
        title: 'Первое слово', 
        description: 'Выучил первое слово',
        isUnlocked: learnedWords.length >= 1,
        category: 'Изучение'
      },
      { 
        icon: '📚', 
        title: 'Книголюб', 
        description: 'Выучил 5 слов',
        isUnlocked: learnedWords.length >= 5,
        category: 'Изучение'
      },
      { 
        icon: '🏆', 
        title: 'Десятка', 
        description: 'Выучил 10 слов',
        isUnlocked: learnedWords.length >= 10,
        category: 'Изучение'
      },
      { 
        icon: '🎖️', 
        title: 'Четверть сотни', 
        description: 'Выучил 25 слов',
        isUnlocked: learnedWords.length >= 25,
        category: 'Изучение'
      },
      { 
        icon: '🎯', 
        title: 'Полсотни', 
        description: 'Выучил 50 слов',
        isUnlocked: learnedWords.length >= 50,
        category: 'Изучение'
      },
      { 
        icon: '🏅', 
        title: 'Три четверти', 
        description: 'Выучил 75 слов',
        isUnlocked: learnedWords.length >= 75,
        category: 'Изучение'
      },
      { 
        icon: '🥇', 
        title: 'Сотня', 
        description: 'Выучил 100 слов',
        isUnlocked: learnedWords.length >= 100,
        category: 'Изучение'
      },
      { 
        icon: '💎', 
        title: 'Двести', 
        description: 'Выучил 200 слов',
        isUnlocked: learnedWords.length >= 200,
        category: 'Изучение'
      },
      { 
        icon: '👑', 
        title: 'Полтысячи', 
        description: 'Выучил 500 слов',
        isUnlocked: learnedWords.length >= 500,
        category: 'Изучение'
      },
      { 
        icon: '🌟', 
        title: 'Тысяча', 
        description: 'Выучил 1000 слов',
        isUnlocked: learnedWords.length >= 1000,
        category: 'Изучение'
      },

      // Accuracy Achievements
      { 
        icon: '🎯', 
        title: 'Новичок', 
        description: 'Точность 50%+ (20+ ответов)',
        isUnlocked: accuracy >= 50 && totalAttempts >= 20,
        category: 'Точность'
      },
      { 
        icon: '🏹', 
        title: 'Снайпер', 
        description: 'Точность 80%+ (50+ ответов)',
        isUnlocked: accuracy >= 80 && totalAttempts >= 50,
        category: 'Точность'
      },
      { 
        icon: '🎪', 
        title: 'Мастер', 
        description: 'Точность 90%+ (100+ ответов)',
        isUnlocked: accuracy >= 90 && totalAttempts >= 100,
        category: 'Точность'
      },
      { 
        icon: '🚀', 
        title: 'Гений', 
        description: 'Точность 95%+ (200+ ответов)',
        isUnlocked: accuracy >= 95 && totalAttempts >= 200,
        category: 'Точность'
      },

      // Streak Achievements
      { 
        icon: '🔥', 
        title: 'Три дня', 
        description: '3 дня изучения подряд',
        isUnlocked: userStats.streakDays >= 3,
        category: 'Серии'
      },
      { 
        icon: '💪', 
        title: 'Неделя подряд', 
        description: '7 дней изучения подряд',
        isUnlocked: userStats.streakDays >= 7,
        category: 'Серии'
      },
      { 
        icon: '⚡', 
        title: 'Две недели', 
        description: '14 дней изучения подряд',
        isUnlocked: userStats.streakDays >= 14,
        category: 'Серии'
      },
      { 
        icon: '🏋️', 
        title: 'Месяц подряд', 
        description: '30 дней изучения подряд',
        isUnlocked: userStats.streakDays >= 30,
        category: 'Серии'
      },
      { 
        icon: '🥋', 
        title: 'Два месяца', 
        description: '60 дней изучения подряд',
        isUnlocked: userStats.streakDays >= 60,
        category: 'Серии'
      },
      { 
        icon: '🦾', 
        title: 'Сто дней', 
        description: '100 дней изучения подряд',
        isUnlocked: userStats.streakDays >= 100,
        category: 'Серии'
      },

      // Special Achievements
      { 
        icon: '🏃', 
        title: 'Спринтер', 
        description: 'Ответил правильно на 10 вопросов подряд',
        isUnlocked: false, // TODO: implement streak tracking
        category: 'Особые'
      },
      { 
        icon: '🧠', 
        title: 'Полиглот', 
        description: 'Добавил 50+ собственных слов',
        isUnlocked: words.length >= 50,
        category: 'Особые'
      },
      { 
        icon: '⏱️', 
        title: 'Скоростной', 
        description: 'Отвечал быстро на 50+ вопросов',
        isUnlocked: false, // TODO: implement time tracking
        category: 'Особые'
      },
      { 
        icon: '📊', 
        title: 'Аналитик', 
        description: 'Просмотрел профиль 10+ раз',
        isUnlocked: false, // TODO: implement view tracking
        category: 'Особые'
      },
      { 
        icon: '🎓', 
        title: 'Учитель', 
        description: 'Создал 100+ собственных слов',
        isUnlocked: words.length >= 100,
        category: 'Особые'
      },
      { 
        icon: '🌍', 
        title: 'Путешественник', 
        description: 'Выучил слова из разных тем',
        isUnlocked: false, // TODO: implement category tracking
        category: 'Особые'
      }
    ];
  };

  const getAchievements = () => {
    return getAllAchievements().filter(achievement => achievement.isUnlocked);
  };

  const achievements = getAchievements();
  const allAchievements = getAllAchievements();
  const unlockedCount = achievements.length;
  const totalCount = allAchievements.length;

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-center mb-2">👤 Мой профиль</h2>
        <p className="text-center text-gray-600">
          Персональная информация и настройки
        </p>
      </div>

      {/* Profile Info */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Icon name="User" size={24} className="mr-2" />
            Информация о пользователе
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div>
                {isEditing ? (
                  <div className="flex items-center space-x-2">
                    <Input
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      className="w-48"
                      onKeyPress={(e) => e.key === 'Enter' && handleSaveName()}
                    />
                    <Button size="sm" onClick={handleSaveName}>
                      <Icon name="Check" size={16} />
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                      <Icon name="X" size={16} />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <h3 className="text-xl font-semibold">{userName}</h3>
                    <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                      <Icon name="Edit" size={16} />
                    </Button>
                  </div>
                )}
                <p className="text-gray-600">Активный изучающий</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{words.length}</p>
              <p className="text-sm text-gray-600">Всего слов</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{learnedWords.length}</p>
              <p className="text-sm text-gray-600">Изучено</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{accuracy}%</p>
              <p className="text-sm text-gray-600">Точность</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{userStats.streakDays}</p>
              <p className="text-sm text-gray-600">Дней подряд</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Icon name="Award" size={24} className="mr-2" />
              Достижения ({unlockedCount}/{totalCount})
            </div>
            <Badge variant="outline" className="text-sm">
              {Math.round((unlockedCount / totalCount) * 100)}% разблокировано
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Achievement Categories */}
            {['Изучение', 'Точность', 'Серии', 'Особые'].map(category => {
              const categoryAchievements = allAchievements.filter(a => a.category === category);
              const unlockedInCategory = categoryAchievements.filter(a => a.isUnlocked).length;
              
              return (
                <div key={category}>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-lg">{category}</h4>
                    <Badge variant="secondary">
                      {unlockedInCategory}/{categoryAchievements.length}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {categoryAchievements.map((achievement, index) => (
                      <div 
                        key={`${category}-${index}`} 
                        className={`flex items-center space-x-3 p-3 rounded-lg border transition-all ${
                          achievement.isUnlocked 
                            ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 shadow-sm' 
                            : 'bg-gray-50 border-gray-200 grayscale opacity-60'
                        }`}
                      >
                        <div className={`text-2xl ${achievement.isUnlocked ? '' : 'filter grayscale'}`}>
                          {achievement.icon}
                        </div>
                        <div className="flex-1">
                          <h5 className={`font-medium text-sm ${achievement.isUnlocked ? 'text-gray-900' : 'text-gray-500'}`}>
                            {achievement.title}
                          </h5>
                          <p className={`text-xs ${achievement.isUnlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                            {achievement.description}
                          </p>
                        </div>
                        {achievement.isUnlocked && (
                          <Icon name="Check" size={16} className="text-green-500" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Icon name="Settings" size={24} className="mr-2" />
            Настройки
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium">Уведомления</h4>
                <p className="text-sm text-gray-600">Напоминания о тренировках</p>
              </div>
              <Badge variant="outline">Скоро</Badge>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium">Темная тема</h4>
                <p className="text-sm text-gray-600">Переключить на темную тему</p>
              </div>
              <Badge variant="outline">Скоро</Badge>
            </div>

            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
              <div>
                <h4 className="font-medium text-red-700">Сбросить прогресс</h4>
                <p className="text-sm text-red-600">Удалить все слова и статистику</p>
              </div>
              <Button 
                variant="outline" 
                onClick={resetProgress}
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                Сбросить
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};