import React, { useState, useEffect } from 'react';
import { Plus, Code2, Layout, ShoppingCart, Code, Menu, X, Settings, MessageSquarePlus, Download, Upload, Trash2 } from 'lucide-react';
import { CodeSnippet, Category, Banner as BannerType } from './types';
import { SnippetCard } from './components/SnippetCard';
import { SnippetForm } from './components/SnippetForm';
import { CategoryManager } from './components/CategoryManager';
import { BannerManager } from './components/BannerManager';
import { Banner } from './components/Banner';
import { DataManager } from './components/DataManager';

const defaultCategories: Category[] = [
  { id: '1', name: 'General', icon: 'Code' },
  { id: '2', name: 'Hero Sections', icon: 'Layout' },
  { id: '3', name: 'Checkout', icon: 'ShoppingCart' },
];

const defaultBanners: BannerType[] = [
  {
    id: '1',
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
    isActive: true,
  },
];

const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const saveToStorage = <T,>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export default function App() {
  const [snippets, setSnippets] = useState<CodeSnippet[]>(() => 
    loadFromStorage('snippets', [])
  );
  const [categories, setCategories] = useState<Category[]>(() =>
    loadFromStorage('categories', defaultCategories)
  );
  const [banners, setBanners] = useState<BannerType[]>(() =>
    loadFromStorage('banners', defaultBanners)
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSnippet, setEditingSnippet] = useState<CodeSnippet | undefined>();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
  const [isBannerManagerOpen, setIsBannerManagerOpen] = useState(false);
  const [isDataManagerOpen, setIsDataManagerOpen] = useState(false);

  // Save to localStorage whenever data changes
  useEffect(() => {
    saveToStorage('snippets', snippets);
  }, [snippets]);

  useEffect(() => {
    saveToStorage('categories', categories);
  }, [categories]);

  useEffect(() => {
    saveToStorage('banners', banners);
  }, [banners]);

  const handleSubmit = (snippetData: Partial<CodeSnippet>) => {
    if (editingSnippet) {
      setSnippets(snippets.map(s => 
        s.id === editingSnippet.id 
          ? { ...editingSnippet, ...snippetData, updatedAt: new Date() }
          : s
      ));
    } else {
      const newSnippet: CodeSnippet = {
        id: crypto.randomUUID(),
        ...snippetData as Omit<CodeSnippet, 'id' | 'createdAt' | 'updatedAt'>,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setSnippets([...snippets, newSnippet]);
    }
    setIsFormOpen(false);
    setEditingSnippet(undefined);
  };

  const handleEdit = (id: string) => {
    const snippet = snippets.find(s => s.id === id);
    if (snippet) {
      setEditingSnippet(snippet);
      setIsFormOpen(true);
    }
  };

  const handleDelete = (id: string) => {
    setSnippets(snippets.filter(s => s.id !== id));
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setIsMenuOpen(false);
  };

  const handleSaveCategories = (newCategories: Category[]) => {
    setCategories(newCategories);
    const validCategories = newCategories.map(c => c.name);
    setSnippets(snippets.map(snippet => ({
      ...snippet,
      category: validCategories.includes(snippet.category) ? snippet.category : 'General',
    })));
  };

  const handleDataImport = (data: { snippets: CodeSnippet[], categories: Category[], banners: BannerType[] }) => {
    setSnippets(data.snippets);
    setCategories(data.categories);
    setBanners(data.banners);
  };

  const handleDataReset = () => {
    setSnippets([]);
    setCategories(defaultCategories);
    setBanners(defaultBanners);
    localStorage.clear();
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Layout':
        return <Layout className="w-5 h-5" />;
      case 'ShoppingCart':
        return <ShoppingCart className="w-5 h-5" />;
      case 'Code':
      default:
        return <Code className="w-5 h-5" />;
    }
  };

  const filteredSnippets = selectedCategory === 'all' 
    ? snippets 
    : snippets.filter(s => s.category === selectedCategory);

  const activeBanners = banners.filter(banner => banner.isActive);

  return (
    <div className="min-h-screen bg-gray-950">
      <header className="fixed top-0 left-0 right-0 bg-gray-900 shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Code2 className="w-8 h-8 text-blue-500" />
              <h1 className="ml-3 text-2xl font-bold text-white">Biblioteca de Códigos</h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsDataManagerOpen(true)}
                className="p-2 text-gray-300 hover:text-white transition-colors"
                title="Importar/Exportar Dados"
              >
                <Download className="w-6 h-6" />
              </button>
              <button
                onClick={() => setIsBannerManagerOpen(true)}
                className="p-2 text-gray-300 hover:text-white transition-colors"
                title="Gerenciar Banners"
              >
                <MessageSquarePlus className="w-6 h-6" />
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-300 hover:text-white transition-colors relative z-50"
                aria-label="Menu"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Sliding Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-gray-900 shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="pt-24 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-white">Categorias</h2>
            <button
              onClick={() => setIsCategoryManagerOpen(true)}
              className="p-2 text-gray-300 hover:text-white transition-colors"
              title="Gerenciar Categorias"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
          <nav className="space-y-2">
            <button
              onClick={() => handleCategorySelect('all')}
              className={`w-full px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <Code2 className="w-5 h-5" />
              <span>Todos</span>
            </button>
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category.name)}
                className={`w-full px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                  selectedCategory === category.name
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {getIconComponent(category.icon)}
                <span>{category.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Content with padding for fixed header */}
      <div className="pt-20">
        {/* Banners */}
        {activeBanners.map(banner => (
          <Banner key={banner.id} banner={banner} />
        ))}

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {filteredSnippets.length === 0 ? (
            <div className="text-center py-12">
              <Code2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h2 className="text-xl font-medium text-gray-400">
                {selectedCategory === 'all' 
                  ? 'Nenhum código salvo ainda'
                  : `Nenhum código na categoria ${selectedCategory}`}
              </h2>
              <p className="text-gray-500 mt-2">
                {selectedCategory === 'all'
                  ? 'Adicione seu primeiro código para começar'
                  : 'Adicione um código nesta categoria'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSnippets.map(snippet => (
                <SnippetCard
                  key={snippet.id}
                  snippet={snippet}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setIsFormOpen(true)}
        className="fixed right-6 bottom-6 w-14 h-14 bg-blue-600 rounded-full shadow-lg flex items-center justify-center text-white hover:bg-blue-700 hover:scale-110 transition-all duration-200 z-20 group"
        aria-label="Adicionar Código"
      >
        <Plus className="w-6 h-6" />
        <span className="absolute right-16 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          Adicionar Código
        </span>
      </button>

      {isFormOpen && (
        <SnippetForm
          snippet={editingSnippet}
          categories={categories}
          onSubmit={handleSubmit}
          onClose={() => {
            setIsFormOpen(false);
            setEditingSnippet(undefined);
          }}
        />
      )}

      {isCategoryManagerOpen && (
        <CategoryManager
          categories={categories}
          onSave={handleSaveCategories}
          onClose={() => setIsCategoryManagerOpen(false)}
        />
      )}

      {isBannerManagerOpen && (
        <BannerManager
          banners={banners}
          onSave={setBanners}
          onClose={() => setIsBannerManagerOpen(false)}
        />
      )}

      {isDataManagerOpen && (
        <DataManager
          snippets={snippets}
          categories={categories}
          banners={banners}
          onImport={handleDataImport}
          onReset={handleDataReset}
          onClose={() => setIsDataManagerOpen(false)}
        />
      )}
    </div>
  );
}