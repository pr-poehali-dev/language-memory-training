import { useState } from 'react';
import { useVocabulary } from '@/hooks/useVocabulary';
import { MainMenu } from './MainMenu';
import { VocabularyManager } from './VocabularyManager';
import { DropsTraining } from './DropsTraining';
import { UserProfile } from './UserProfile';
import { Statistics } from './Statistics';
import Icon from '@/components/ui/icon';

type AppScreen = 'menu' | 'vocabulary' | 'training' | 'profile' | 'stats';

export const VocabularyApp = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('menu');
  const vocabularyHook = useVocabulary();

  const renderScreen = () => {
    switch (currentScreen) {
      case 'vocabulary':
        return <VocabularyManager {...vocabularyHook} onBack={() => setCurrentScreen('menu')} />;
      case 'training':
        return <DropsTraining {...vocabularyHook} onBack={() => setCurrentScreen('menu')} />;
      case 'profile':
        return <UserProfile {...vocabularyHook} onBack={() => setCurrentScreen('menu')} />;
      case 'stats':
        return <Statistics {...vocabularyHook} onBack={() => setCurrentScreen('menu')} />;
      default:
        return <MainMenu onNavigate={setCurrentScreen} wordsCount={vocabularyHook.words.length} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden min-h-[600px]">
          {currentScreen !== 'menu' && (
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4">
              <button
                onClick={() => setCurrentScreen('menu')}
                className="flex items-center space-x-2 hover:bg-white/20 rounded-lg px-3 py-2 transition-colors"
              >
                <Icon name="ArrowLeft" size={20} />
                <span>Назад</span>
              </button>
            </div>
          )}
          {renderScreen()}
        </div>
      </div>
    </div>
  );
};