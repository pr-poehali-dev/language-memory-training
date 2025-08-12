import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Word } from '@/types/vocabulary';

interface VocabularyManagerProps {
  words: Word[];
  addWord: (english: string, russian: string) => void;
  editWord: (id: string, english: string, russian: string) => void;
  deleteWord: (id: string) => void;
  onBack: () => void;
}

export const VocabularyManager = ({ 
  words, 
  addWord, 
  editWord, 
  deleteWord 
}: VocabularyManagerProps) => {
  const [newEnglish, setNewEnglish] = useState('');
  const [newRussian, setNewRussian] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editEnglish, setEditEnglish] = useState('');
  const [editRussian, setEditRussian] = useState('');

  const handleAddWord = () => {
    if (newEnglish.trim() && newRussian.trim()) {
      addWord(newEnglish.trim(), newRussian.trim());
      setNewEnglish('');
      setNewRussian('');
    }
  };

  const handleEditStart = (word: Word) => {
    setEditingId(word.id);
    setEditEnglish(word.english);
    setEditRussian(word.russian);
  };

  const handleEditSave = () => {
    if (editingId && editEnglish.trim() && editRussian.trim()) {
      editWord(editingId, editEnglish.trim(), editRussian.trim());
      setEditingId(null);
      setEditEnglish('');
      setEditRussian('');
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditEnglish('');
    setEditRussian('');
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-center mb-2">📚 Словарь</h2>
        <p className="text-center text-gray-600">
          Управляй своими словами для изучения
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Icon name="Plus" size={24} className="mr-2" />
            Добавить новое слово
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Английское слово"
              value={newEnglish}
              onChange={(e) => setNewEnglish(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddWord()}
            />
            <Input
              placeholder="Русский перевод"
              value={newRussian}
              onChange={(e) => setNewRussian(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddWord()}
            />
            <Button 
              onClick={handleAddWord}
              className="bg-green-500 hover:bg-green-600"
              disabled={!newEnglish.trim() || !newRussian.trim()}
            >
              <Icon name="Plus" size={16} className="mr-2" />
              Добавить
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">
          Мои слова ({words.length})
        </h3>
        
        {words.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-4xl mb-4">📝</div>
              <p className="text-gray-500">
                Пока нет слов. Добавь первое слово выше!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {words.map((word) => (
              <Card key={word.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  {editingId === word.id ? (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                      <Input
                        value={editEnglish}
                        onChange={(e) => setEditEnglish(e.target.value)}
                        placeholder="Английское слово"
                      />
                      <Input
                        value={editRussian}
                        onChange={(e) => setEditRussian(e.target.value)}
                        placeholder="Русский перевод"
                      />
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={handleEditSave}
                          className="bg-green-500 hover:bg-green-600"
                        >
                          <Icon name="Check" size={16} />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleEditCancel}
                        >
                          <Icon name="X" size={16} />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="flex-1">
                          <span className="font-semibold text-lg">{word.english}</span>
                          <span className="mx-3 text-gray-400">→</span>
                          <span className="text-gray-700">{word.russian}</span>
                        </div>
                        <div className="flex space-x-2">
                          <Badge 
                            variant={word.isLearned ? "default" : "destructive"}
                            className={word.isLearned ? "bg-green-500" : "bg-red-500"}
                          >
                            {word.isLearned ? "Изучено" : "Новое"}
                          </Badge>
                          {word.isLearned && (
                            <Badge variant="outline">
                              {word.correctAnswers}/{word.correctAnswers + word.incorrectAnswers}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditStart(word)}
                        >
                          <Icon name="Edit" size={16} />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteWord(word.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Icon name="Trash2" size={16} />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};