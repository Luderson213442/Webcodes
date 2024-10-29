import React, { useState } from 'react';
import { X, Plus, Link as LinkIcon, ExternalLink } from 'lucide-react';
import { Banner } from '../types';
import { ImageUpload } from './ImageUpload';

interface BannerManagerProps {
  banners: Banner[];
  onSave: (banners: Banner[]) => void;
  onClose: () => void;
}

export function BannerManager({ banners, onSave, onClose }: BannerManagerProps) {
  const [editedBanners, setEditedBanners] = useState<Banner[]>(banners);
  const [newBanner, setNewBanner] = useState<Omit<Banner, 'id'>>({
    imageUrl: '',
    link: '',
    isActive: true,
  });

  const handleAddBanner = () => {
    if (!newBanner.imageUrl.trim()) return;

    setEditedBanners([
      ...editedBanners,
      {
        id: crypto.randomUUID(),
        ...newBanner,
      },
    ]);
    setNewBanner({
      imageUrl: '',
      link: '',
      isActive: true,
    });
  };

  const handleDeleteBanner = (id: string) => {
    setEditedBanners(editedBanners.filter(banner => banner.id !== id));
  };

  const handleUpdateBanner = (id: string, field: keyof Banner, value: any) => {
    setEditedBanners(
      editedBanners.map(banner =>
        banner.id === id ? { ...banner, [field]: value } : banner
      )
    );
  };

  const handleSave = () => {
    onSave(editedBanners);
    onClose();
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

        <h2 className="text-2xl font-bold text-white mb-6">Gerenciar Banners</h2>

        {/* Add New Banner */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Adicionar Novo Banner</h3>
          <div className="space-y-4">
            <ImageUpload
              value={newBanner.imageUrl}
              onChange={(value) => setNewBanner({ ...newBanner, imageUrl: value })}
            />
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="flex items-center gap-2 text-gray-300 mb-2">
                  <LinkIcon className="w-4 h-4" />
                  Link (opcional)
                </label>
                <input
                  type="url"
                  value={newBanner.link || ''}
                  onChange={(e) => setNewBanner({ ...newBanner, link: e.target.value })}
                  placeholder="https://exemplo.com"
                  className="w-full bg-gray-800 text-white rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={handleAddBanner}
                disabled={!newBanner.imageUrl}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 h-[52px] self-end disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-5 h-5" />
                Adicionar
              </button>
            </div>
          </div>
        </div>

        {/* Banner List */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-white mb-4">Banners Existentes</h3>
          {editedBanners.length === 0 ? (
            <p className="text-gray-400">Nenhum banner criado</p>
          ) : (
            editedBanners.map(banner => (
              <div
                key={banner.id}
                className="bg-gray-800 rounded-lg overflow-hidden"
              >
                <div className="relative h-48">
                  <img
                    src={banner.imageUrl}
                    alt="Banner Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => handleDeleteBanner(banner.id)}
                    className="absolute top-2 right-2 p-2 bg-red-600 rounded-full hover:bg-red-700 transition-colors"
                    title="Excluir banner"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <label className="flex items-center gap-2 text-gray-300 mb-2">
                      <LinkIcon className="w-4 h-4" />
                      Link
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={banner.link || ''}
                        onChange={(e) => handleUpdateBanner(banner.id, 'link', e.target.value)}
                        placeholder="https://exemplo.com"
                        className="flex-1 bg-gray-700 text-white rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                      />
                      {banner.link && (
                        <a
                          href={banner.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-gray-700 text-blue-400 rounded-lg hover:bg-gray-600 transition-colors"
                          title="Abrir link"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>
                  <label className="flex items-center gap-2 text-sm text-gray-300">
                    <input
                      type="checkbox"
                      checked={banner.isActive}
                      onChange={(e) => handleUpdateBanner(banner.id, 'isActive', e.target.checked)}
                      className="rounded bg-gray-700 border-gray-600 text-blue-600 focus:ring-blue-500"
                    />
                    Ativo
                  </label>
                </div>
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
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
}