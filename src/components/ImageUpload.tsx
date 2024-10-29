import React, { useState, useCallback, useRef } from 'react';
import { Link, Upload, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        onChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [onChange]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        onChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [onChange]);

  const handlePaste = useCallback((e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            const reader = new FileReader();
            reader.onload = () => {
              onChange(reader.result as string);
            };
            reader.readAsDataURL(file);
          }
        }
      }
    }
  }, [onChange]);

  React.useEffect(() => {
    document.addEventListener('paste', handlePaste);
    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, [handlePaste]);

  return (
    <div className="space-y-4">
      {/* URL Input */}
      <div>
        <label className="flex items-center gap-2 text-gray-300 mb-2">
          <Link className="w-4 h-4" />
          URL da Imagem
        </label>
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-gray-800 text-white rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
          placeholder="https://exemplo.com/imagem.jpg"
        />
      </div>

      {/* Upload Area */}
      <div>
        <label className="flex items-center gap-2 text-gray-300 mb-2">
          <Upload className="w-4 h-4" />
          Upload ou Cole uma Imagem
        </label>
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 transition-colors text-center ${
            dragActive
              ? 'border-blue-500 bg-blue-500/10'
              : 'border-gray-700 hover:border-gray-600'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
          />
          
          <div className="flex flex-col items-center gap-2">
            <ImageIcon className="w-8 h-8 text-gray-400" />
            <div className="text-sm text-gray-400">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="text-blue-500 hover:text-blue-400"
              >
                Clique para fazer upload
              </button>
              {" ou arraste e solte"}
            </div>
            <p className="text-xs text-gray-500">
              Você também pode colar uma imagem usando Ctrl+V
            </p>
          </div>
        </div>
      </div>

      {/* Preview */}
      {value && (
        <div className="mt-4">
          <p className="text-gray-300 mb-2">Pré-visualização:</p>
          <div className="relative w-full h-48 rounded-lg overflow-hidden">
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c';
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}