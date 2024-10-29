import React, { useRef, useState } from 'react';
import { X, Download, Upload, Trash2, AlertCircle, Check } from 'lucide-react';
import { CodeSnippet, Category, Banner } from '../types';

interface DataManagerProps {
  snippets: CodeSnippet[];
  categories: Category[];
  banners: Banner[];
  onImport: (data: { snippets: CodeSnippet[], categories: Category[], banners: Banner[] }) => void;
  onReset: () => void;
  onClose: () => void;
}

export function DataManager({ snippets, categories, banners, onImport, onReset, onClose }: DataManagerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedSnippets, setSelectedSnippets] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isConfirmingReset, setIsConfirmingReset] = useState(false);

  const handleExportAll = () => {
    const data = {
      snippets,
      categories,
      banners,
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code-library-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setSuccess('Dados exportados com sucesso!');
  };

  const handleExportSelected = () => {
    if (selectedSnippets.size === 0) {
      setError('Selecione pelo menos um código para exportar');
      return;
    }

    const selectedData = {
      snippets: snippets.filter(s => selectedSnippets.has(s.id)),
      categories,
      banners,
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(selectedData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code-library-export-selected-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setSuccess('Códigos selecionados exportados com sucesso!');
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (!data.snippets || !Array.isArray(data.snippets)) {
          throw new Error('Formato de arquivo inválido');
        }
        onImport(data);
        setSuccess('Dados importados com sucesso!');
        setError('');
      } catch (err) {
        setError('Erro ao importar arquivo. Certifique-se de que é um arquivo JSON válido.');
        setSuccess('');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleReset = () => {
    if (!isConfirmingReset) {
      setIsConfirmingReset(true);
      return;
    }
    onReset();
    setSuccess('Dados resetados com sucesso!');
    setIsConfirmingReset(false);
  };

  const toggleSnippetSelection = (id: string) => {
    const newSelection = new Set(selectedSnippets);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedSnippets(newSelection);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50 backdrop-blur-[15px]">
      <div className="absolute inset-0 bg-[#111827] opacity-30" />
      <div className="bg-gray-900 rounded-lg w-full max-w-3xl p-6 relative z-10 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
          title="Fechar"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-white mb-6">Gerenciar Dados</h2>

        {/* Messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-lg flex items-center gap-2 text-red-300">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-900/50 border border-green-500 rounded-lg flex items-center gap-2 text-green-300">
            <Check className="w-5 h-5 flex-shrink-0" />
            <p>{success}</p>
          </div>
        )}

        {/* Import/Export Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <button
            onClick={handleExportAll}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-5 h-5" />
            Exportar Todos
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Upload className="w-5 h-5" />
            Importar Dados
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </div>

        {/* Snippet Selection */}
        {snippets.length > 0 && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Selecionar Códigos para Exportar</h3>
              <button
                onClick={handleExportSelected}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                disabled={selectedSnippets.size === 0}
              >
                <Download className="w-4 h-4" />
                Exportar Selecionados
              </button>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
              {snippets.map(snippet => (
                <label
                  key={snippet.id}
                  className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedSnippets.has(snippet.id)}
                    onChange={() => toggleSnippetSelection(snippet.id)}
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-white">{snippet.title}</h4>
                    <p className="text-sm text-gray-400">{snippet.description}</p>
                  </div>
                  <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-sm">
                    {snippet.category}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Reset Data */}
        <div className="border-t border-gray-800 pt-6">
          <h3 className="text-lg font-semibold text-white mb-4">Resetar Dados</h3>
          <div className="flex items-center gap-4">
            <button
              onClick={handleReset}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                isConfirmingReset
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
              }`}
            >
              <Trash2 className="w-5 h-5" />
              {isConfirmingReset ? 'Confirmar Reset' : 'Resetar Todos os Dados'}
            </button>
            {isConfirmingReset && (
              <button
                onClick={() => setIsConfirmingReset(false)}
                className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
            )}
          </div>
          <p className="mt-2 text-sm text-gray-400">
            Esta ação irá remover todos os dados salvos e não pode ser desfeita.
          </p>
        </div>
      </div>
    </div>
  );
}