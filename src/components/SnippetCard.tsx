import React from 'react';
import { Copy, Pencil, Trash2, Check } from 'lucide-react';
import { CodeSnippet } from '../types';
import { useState } from 'react';

interface SnippetCardProps {
  snippet: CodeSnippet;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function SnippetCard({ snippet, onEdit, onDelete }: SnippetCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Hero Sections':
        return 'bg-purple-900 text-purple-300';
      case 'Checkout':
        return 'bg-green-900 text-green-300';
      default:
        return 'bg-blue-900 text-blue-300';
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg transition-all hover:shadow-2xl hover:scale-[1.02]">
      <div className="relative h-48 group">
        <img
          src={snippet.coverImage || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c'}
          alt={snippet.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            onClick={() => onEdit(snippet.id)}
            className="p-2 bg-blue-600 rounded-full hover:bg-blue-700 transition-colors"
            title="Editar"
          >
            <Pencil className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={() => onDelete(snippet.id)}
            className="p-2 bg-red-600 rounded-full hover:bg-red-700 transition-colors"
            title="Excluir"
          >
            <Trash2 className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">{snippet.title}</h3>
            <p className="text-gray-400 text-sm">{snippet.description}</p>
          </div>
          <button
            onClick={handleCopy}
            className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
            title={copied ? "Copiado!" : "Copiar código"}
          >
            {copied ? (
              <Check className="w-5 h-5 text-green-500" />
            ) : (
              <Copy className="w-5 h-5 text-blue-400" />
            )}
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className={`inline-block px-2 py-1 rounded text-sm ${getCategoryColor(snippet.category)}`}>
            {snippet.category}
          </span>
          <span className="inline-block px-2 py-1 bg-gray-800 text-gray-300 rounded text-sm">
            {snippet.language}
          </span>
        </div>
      </div>
    </div>
  );
}