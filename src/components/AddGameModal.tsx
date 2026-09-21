import React, { useState } from 'react';
import { X, Plus, Eye, Check, AlertCircle, Play } from 'lucide-react';
import { GameItem } from '../types';

interface AddGameModalProps {
  onClose: () => void;
  onAddGame: (newGame: GameItem) => void;
}

export const AddGameModal: React.FC<AddGameModalProps> = ({
  onClose,
  onAddGame
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Arcade');
  const [description, setDescription] = useState('');
  const [controls, setControls] = useState('');
  const [iframeInput, setIframeInput] = useState('');
  const [color, setColor] = useState('#3b82f6');
  const [previewActive, setPreviewActive] = useState(false);
  const [error, setError] = useState('');

  const colorOptions = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', 
    '#8b5cf6', '#ec4899', '#06b6d4', '#14b8a6'
  ];

  const categories = ['Arcade', 'Puzzle', 'Action', 'Sports', 'Retro', 'Strategy', 'Other'];

  const getCleanIframeData = () => {
    const trimmed = iframeInput.trim();
    if (!trimmed) return null;

    let src = '';
    let finalIframeTag = '';

    if (trimmed.startsWith('<iframe')) {
      const match = trimmed.match(/src=["']([^"']+)["']/i);
      if (match) {
        src = match[1];
      }
      finalIframeTag = trimmed;
    } else {
      // It's a plain URL
      src = trimmed;
      finalIframeTag = `<iframe src="${trimmed}" title="${title || 'Custom Game'}" width="100%" height="100%" frameborder="0" allowfullscreen allow="autoplay; fullscreen"></iframe>`;
    }

    return { src, iframe: finalIframeTag };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a game title.');
      return;
    }
    const cleanData = getCleanIframeData();
    if (!cleanData || !cleanData.src) {
      setError('Please provide a valid iframe code or web game URL.');
      return;
    }

    const newGame: GameItem = {
      id: 'custom_' + Date.now(),
      title: title.trim(),
      category,
      description: description.trim() || 'Custom user-added game.',
      controls: controls.trim() || 'Mouse and keyboard',
      rating: 5.0,
      plays: '1',
      badge: 'CUSTOM',
      color,
      iframe: cleanData.iframe,
      url: cleanData.src,
      custom: true
    };

    onAddGame(newGame);
    onClose();
  };

  const previewData = getCleanIframeData();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">Add Game with Iframe</h2>
              <p className="text-xs text-slate-400">Stores as an iframe inside the games library JSON</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          
          {error && (
            <div className="p-3 rounded-lg bg-red-950/40 border border-red-800/80 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Game Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Retro Space Blaster"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Iframe Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Iframe Code or URL *
              </label>
              <span className="text-[11px] text-slate-400">
                Paste &lt;iframe ...&gt; or direct https:// link
              </span>
            </div>
            <textarea
              required
              rows={3}
              value={iframeInput}
              onChange={(e) => {
                setIframeInput(e.target.value);
                setPreviewActive(false);
              }}
              placeholder='<iframe src="https://example.com/game" width="100%" height="100%"></iframe>'
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>

          {/* Live Preview Button and Box */}
          {iframeInput && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-300">Iframe Live Test</span>
                <button
                  type="button"
                  onClick={() => setPreviewActive(!previewActive)}
                  className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{previewActive ? 'Hide Preview' : 'Test Iframe Live'}</span>
                </button>
              </div>

              {previewActive && previewData && (
                <div className="w-full h-48 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden relative">
                  <iframe
                    src={previewData.src}
                    title="Live Preview"
                    className="w-full h-full border-0"
                    sandbox="allow-scripts allow-same-origin allow-popups"
                  />
                </div>
              )}
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description of the gameplay..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>

          {/* Controls Instructions */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Controls Instructions</label>
            <input
              type="text"
              value={controls}
              onChange={(e) => setControls(e.target.value)}
              placeholder="e.g. Arrow keys to steer, Space to boost"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>

          {/* Accent Color Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Accent Theme Color</label>
            <div className="flex items-center gap-2">
              {colorOptions.map(c => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setColor(c)}
                  style={{ backgroundColor: c }}
                  className={`w-7 h-7 rounded-full transition-transform flex items-center justify-center ${
                    color === c ? 'scale-125 ring-2 ring-white shadow-md' : 'opacity-80 hover:opacity-100'
                  }`}
                >
                  {color === c && <Check className="w-3.5 h-3.5 text-white" />}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold shadow-md transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add to Games Library</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
