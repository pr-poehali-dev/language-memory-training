import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface MainMenuProps {
  onNavigate: (screen: 'menu' | 'vocabulary' | 'training' | 'profile' | 'stats') => void;
  wordsCount: number;
}

export const MainMenu = ({ onNavigate, wordsCount }: MainMenuProps) => {
  const canStartTraining = wordsCount >= 4;

  return (
    <div className="p-8 text-center">
      <div className="mb-8">
        <div className="text-6xl mb-4">🚀</div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Капли</h1>
        <p className="text-gray-600">
          Твой персональный тренажер для запоминания слов
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-semibold mb-2">Словарь</h3>
            <p className="text-gray-600 mb-4">
              Добавляй и редактируй свои слова
            </p>
            <p className="text-sm text-blue-600 mb-4">
              Слов в словаре: {wordsCount}
            </p>
            <Button
              onClick={() => onNavigate('vocabulary')}
              className="w-full bg-blue-500 hover:bg-blue-600"
            >
              <Icon name="BookOpen" size={20} className="mr-2" />
              Управлять словарем
            </Button>
          </CardContent>
        </Card>

        <Card className={`group transition-all duration-300 ${
          canStartTraining 
            ? 'hover:shadow-lg hover:scale-105 cursor-pointer' 
            : 'opacity-50 cursor-not-allowed'
        }`}>
          <CardContent className="p-6">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold mb-2">Тренировка</h3>
            <p className="text-gray-600 mb-4">
              Изучай новые слова и повторяй изученные
            </p>
            {!canStartTraining && (
              <p className="text-sm text-red-500 mb-4">
                Нужно минимум 4 слова для начала
              </p>
            )}
            <Button
              onClick={() => canStartTraining && onNavigate('training')}
              disabled={!canStartTraining}
              className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400"
            >
              <Icon name="Play" size={20} className="mr-2" />
              {canStartTraining ? 'Начать тренировку' : 'Недостаточно слов'}
            </Button>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2">Статистика</h3>
            <p className="text-gray-600 mb-4">
              Отслеживай свой прогресс и достижения
            </p>
            <Button
              onClick={() => onNavigate('stats')}
              className="w-full bg-purple-500 hover:bg-purple-600"
              variant="outline"
            >
              <Icon name="BarChart3" size={20} className="mr-2" />
              Посмотреть статистику
            </Button>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="text-4xl mb-4">👤</div>
            <h3 className="text-xl font-semibold mb-2">Профиль</h3>
            <p className="text-gray-600 mb-4">
              Настройки и персональная информация
            </p>
            <Button
              onClick={() => onNavigate('profile')}
              className="w-full bg-orange-500 hover:bg-orange-600"
              variant="outline"
            >
              <Icon name="User" size={20} className="mr-2" />
              Мой профиль
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};