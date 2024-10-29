import React, { useState, useEffect } from 'react';
import { X, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { CodeSnippet, Category } from '../types';
import { ImageUpload } from './ImageUpload';

interface SnippetFormProps {
  snippet?: CodeSnippet;
  categories: Category[];
  onSubmit: (snippet: Partial<CodeSnippet>) => void;
  onClose: () => void;
}

const steps = [
  { id: 1, title: 'Imagem de Capa' },
  { id: 2, title: 'Informações' },
];

const languages = ['HTML', 'CSS'];

export function SnippetForm({ snippet, categories, onSubmit, onClose }: SnippetFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    code: '',
    language: '',
    coverImage: '',
    category: categories[0]?.name || 'General',
  });

  useEffect(() => {
    if (snippet) {
      setFormData({
        title: snippet.title,
        description: snippet.description,
        code: snippet.code,
        language: snippet.language,
        coverImage: snippet.coverImage,
        category: snippet.category,
      });
    }
  }, [snippet]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return true; // Optional step
      case 2:
        return (
          formData.title.trim() !== '' &&
          formData.description.trim() !== '' &&
          formData.code.trim() !== '' &&
          formData.language.trim() !== ''
        );
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <ImageUpload
              value={formData.coverImage}
              onChange={(value) => setFormData({ ...formData, coverImage: value })}
            />
            <p className="mt-2 text-sm text-gray-400">
              Dica: Use uma imagem que represente bem o seu código. Deixe em branco para usar a imagem padrão.
            </p>
          </div>
        );
      case 2:
        return (
          <>
            <div className="mb-6">
              <label className="block text-gray-300 mb-2">Título</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-gray-800 text-white rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                required
                placeholder="Digite o título do código"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-300 mb-2">Descrição</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-gray-800 text-white rounded-lg p-3 h-32 focus:ring-2 focus:ring-blue-500"
                placeholder="Descreva brevemente o código"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-300 mb-2">Categoria</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-gray-800 text-white rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                required
              >
                {categories.map(category => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-6">
              <label className="block mb-2" style={{ color: '#29BA33' }}>Código</label>
              <textarea
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full bg-gray-800 text-white rounded-lg p-3 h-64 font-mono focus:ring-2 focus:ring-blue-500"
                required
                placeholder="Cole seu código aqui"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Linguagem</label>
              <div className="space-y-2">
                {languages.map((lang) => (
                  <label key={lang} className="flex items-center gap-2 text-gray-300 cursor-pointer">
                    <input
                      type="radio"
                      name="language"
                      value={lang}
                      checked={formData.language === lang}
                      onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                      className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 focus:ring-blue-500 focus:ring-2"
                    />
                    {lang}
                  </label>
                ))}
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50 backdrop-blur-[15px]">
      <div className="absolute inset-0 bg-[#111827] opacity-30" />
      <div className="bg-gray-900 rounded-lg w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto z-10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
          title="Fechar"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-white mb-6">
          {snippet ? 'Editar Código' : 'Adicionar Novo Código'}
        </h2>

        {/* Progress Steps */}
        <div className="flex justify-between mb-8 relative">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center w-1/2 relative z-10">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= step.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-400'
                }`}
              >
                {currentStep > step.id ? (
                  <Check className="w-5 h-5" />
                ) : (
                  step.id
                )}
              </div>
              <div className="text-sm mt-2 text-center">
                <span
                  className={
                    currentStep >= step.id ? 'text-blue-500' : 'text-gray-500'
                  }
                >
                  {step.title}
                </span>
              </div>
            </div>
          ))}
          {/* Progress Bar */}
          <div className="absolute top-4 left-0 h-0.5 bg-gray-700 w-full -z-10">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {renderStepContent()}

          <div className="flex justify-between mt-8">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Anterior
              </button>
            )}
            <div className="ml-auto flex gap-3">
              {currentStep < steps.length ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={!isStepValid()}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Próximo
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Check className="w-5 h-5 mr-2" />
                  Finalizar
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}