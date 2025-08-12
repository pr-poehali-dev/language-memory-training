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

  const getAchievements = () => {
    const achievements = [];

    if (learnedWords.length >= 1) {
      achievements.push({ icon: '🌟', title: 'Первое слово', description: 'Выучил первое слово' });
    }
    if (learnedWords.length >= 10) {
      achievements.push({ icon: '🏆', title: 'Десятка', description: 'Выучил 10 слов' });
    }
    if (learnedWords.length >= 50) {
      achievements.push({ icon: '🎖️', title: 'Полсотни', description: 'Выучил 50 слов' });
    }
    if (learnedWords.length >= 100) {
      achievements.push({ icon: '🥇', title: 'Сотня', description: 'Выучил 100 слов' });
    }
    if (accuracy >= 80 && totalAttempts >= 20) {
      achievements.push({ icon: '🎯', title: 'Снайпер', description: 'Точность 80%+' });
    }
    if (userStats.streakDays >= 7) {
      achievements.push({ icon: '🔥', title: 'Неделя подряд', description: '7 дней изучения подряд' });
    }
    if (userStats.streakDays >= 30) {
      achievements.push({ icon: '💪', title: 'Месяц подряд', description: '30 дней изучения подряд' });
    }

    return achievements;
  };

  const achievements = getAchievements();

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
          <CardTitle className="flex items-center">
            <Icon name="Award" size={24} className="mr-2" />
            Достижения ({achievements.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {achievements.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🏅</div>
              <p className="text-gray-500">
                Пока нет достижений. Начни изучать слова!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border">
                  <div className="text-3xl">{achievement.icon}</div>
                  <div>
                    <h4 className="font-semibold">{achievement.title}</h4>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
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