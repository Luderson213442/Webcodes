import React, { useState } from 'react';
import { X, Plus, Pencil, Trash2, Check, AlertCircle } from 'lucide-react';
import { Category } from '../types';

interface CategoryManagerProps {
  categories: Category[];
  onSave: (categories: Category[]) => void;
  onClose: () => void;
}

const availableIcons = [
  'Code',
  'Layout',
  'ShoppingCart',
  'FileCode',
  'Database',
  'Globe',
  'Package',
  'Settings',
  'Terminal',
  'Folder',
];

export function CategoryManager({ categories, onSave, onClose }: CategoryManagerProps) {
  const [editedCategories, setEditedCategories] = useState<Category[]>(categories);
  const [newCategory, setNewCategory] = useState({ name: '', icon: 'Code' });
  const [error, setError] = useState('');

  const handleAddCategory = () => {
    if (!newCategory.name.trim()) {
      setError('O nome da categoria é obrigatório');
      return;
    }

    if (editedCategories.some(cat => cat.name.toLowerCase() === newCategory.name.toLowerCase())) {
      setError('Já existe uma categoria com este nome');
      return;
    }

    setEditedCategories([
      ...editedCategories,
      {
        id: crypto.randomUUID(),
        name: newCategory.name.trim(),
        icon: newCategory.icon,
      },
    ]);
    setNewCategory({ name: '', icon: 'Code' });
    setError('');
  };

  const handleDeleteCategory = (id: string) => {
    setEditedCategories(editedCategories.filter(cat => cat.id !== id));
  };

  const handleUpdateCategory = (id: string, field: keyof Category, value: string) => {
    setEditedCategories(
      editedCategories.map(cat =>
        cat.id === id ? { ...cat, [field]: value } : cat
      )
    );
  };

  const handleSave = () => {
    onSave(editedCategories);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50 backdrop-blur-[15px]">
      <div className="absolute inset-0 bg-[#111827] opacity-30" />
      <div className="bg-gray-900 rounded-lg w-full max-w-2xl p-6 relative z-10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
          title="Fechar"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-white mb-6">Gerenciar Categorias</h2>

        {/* Add New Category */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Adicionar Nova Categoria</h3>
          <div className="flex gap-4">
            <input
              type="text"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              placeholder="Nome da categoria"
              className="flex-1 bg-gray-800 text-white rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={newCategory.icon}
              onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
              className="bg-gray-800 text-white rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
            >
              {availableIcons.map(icon => (
                <option key={icon} value={icon}>{icon}</option>
              ))}
            </select>
            <button
              onClick={handleAddCategory}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          {error && (
            <div className="mt-2 text-red-500 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Category List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white mb-4">Categorias Existentes</h3>
          {editedCategories.length === 0 ? (
            <p className="text-gray-400">Nenhuma categoria criada</p>
          ) : (
            editedCategories.map(category => (
              <div
                key={category.id}
                className="flex items-center gap-4 bg-gray-800 p-4 rounded-lg"
              >
                <input
                  type="text"
                  value={category.name}
                  onChange={(e) => handleUpdateCategory(category.id, 'name', e.target.value)}
                  className="flex-1 bg-gray-700 text-white rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={category.icon}
                  onChange={(e) => handleUpdateCategory(category.id, 'icon', e.target.value)}
                  className="bg-gray-700 text-white rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                >
                  {availableIcons.map(icon => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
                <button
                  onClick={() => handleDeleteCategory(category.id)}
                  className="p-2 text-red-400 hover:text-red-300 transition-colors"
                  title="Excluir categoria"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Check className="w-5 h-5" />
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
}