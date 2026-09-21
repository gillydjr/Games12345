import React, { useState } from 'react';
import { X, Copy, Check, Download, Upload, FileCode, ExternalLink } from 'lucide-react';
import { GameItem } from '../types';

interface JsonViewerModalProps {
  games: GameItem[];
  onClose: () => void;
  onImportGames: (imported: GameItem[]) => void;
}

export const JsonViewerModal: React.FC<JsonViewerModalProps> = ({
  games,
  onClose,
  onImportGames
}) => {
  const [copied, setCopied] = useState(false);
  const [importError, setImportError] = useState('');

  const jsonString = JSON.stringify(games, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'games.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].iframe) {
          onImportGames(parsed);
          setImportError('');
          onClose();
        } else {
          setImportError('Invalid JSON structure: Must be an array of games with iframe properties.');
        }
      } catch (err) {
        setImportError('Failed to parse JSON file. Ensure it is valid JSON syntax.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center font-bold">
              <FileCode className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">games.json Database</h2>
              <p className="text-xs text-slate-400">Stores each game with its iframe definition and metadata</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Toolbar */}
        <div className="px-5 py-2.5 bg-slate-850 bg-slate-900/60 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="text-slate-400 font-mono">
            {games.length} games configured
          </span>

          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg cursor-pointer transition-colors border border-slate-700">
              <Upload className="w-3.5 h-3.5" />
              <span>Import JSON</span>
              <input 
                type="file" 
                accept=".json" 
                onChange={handleFileUpload} 
                className="hidden" 
              />
            </label>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download JSON</span>
            </button>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors shadow-sm font-semibold"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
            </button>
          </div>
        </div>

        {importError && (
          <div className="mx-5 my-2 p-2.5 rounded-lg bg-red-950/50 border border-red-800 text-red-300 text-xs">
            {importError}
          </div>
        )}

        {/* Code Content */}
        <div className="flex-1 overflow-auto p-4 bg-slate-950 font-mono text-xs text-blue-300 selection:bg-blue-900 selection:text-white leading-relaxed">
          <pre>{jsonString}</pre>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-900/90 text-slate-400 text-xs flex justify-between items-center">
          <span>Accessible live at <code className="text-blue-400 bg-slate-800 px-1 py-0.5 rounded">/games.json</code></span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors font-medium"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
