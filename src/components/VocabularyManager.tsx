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
  const [showExcelImport, setShowExcelImport] = useState(false);

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

  const handleExcelImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      
      // Parse CSV/Excel content
      const lines = content.split('\n').filter(line => line.trim());
      let importedCount = 0;
      
      lines.forEach((line, index) => {
        // Skip header row if exists
        if (index === 0 && (line.toLowerCase().includes('термин') || line.toLowerCase().includes('term') || line.toLowerCase().includes('english'))) {
          return;
        }
        
        const columns = line.split(/[,;\t]/).map(col => col.trim().replace(/"/g, ''));
        
        if (columns.length >= 2 && columns[0] && columns[1]) {
          // First column - term (English), Second column - definition (Russian)
          addWord(columns[0], columns[1]);
          importedCount++;
        }
      });
      
      alert(`Импортировано ${importedCount} слов из файла!`);
      setShowExcelImport(false);
    };
    
    reader.readAsText(file);
    event.target.value = ''; // Reset input
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
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Icon name="Plus" size={24} className="mr-2" />
              Добавить новое слово
            </div>
            <Button
              variant="outline"
              onClick={() => setShowExcelImport(!showExcelImport)}
              className="text-blue-600 border-blue-600 hover:bg-blue-50"
            >
              <Icon name="FileSpreadsheet" size={16} className="mr-2" />
              Импорт Excel
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {showExcelImport && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border-2 border-dashed border-blue-300">
              <h4 className="font-semibold text-blue-800 mb-2">📊 Загрузка из Excel/CSV</h4>
              <p className="text-sm text-blue-600 mb-4">
                Формат файла: первый столбец - термин (английский), второй столбец - определение (русский)
              </p>
              <input
                type="file"
                accept=".csv,.xlsx,.xls,.txt"
                onChange={handleExcelImport}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="text-xs text-gray-500 mt-2">
                Поддерживаются форматы: CSV, Excel (.xlsx, .xls), TXT
              </p>
            </div>
          )}
          
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
                        <div className={`w-4 h-4 rounded-full ${word.isLearned ? 'bg-green-500' : 'bg-red-500'}`}></div>
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