import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  ExternalLink, 
  Heart, 
  Info, 
  FileCode,
  ShieldCheck,
  Gamepad2
} from 'lucide-react';
import { GameItem } from '../types';

interface GamePlayerModalProps {
  game: GameItem | null;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onViewJson: () => void;
}

export const GamePlayerModal: React.FC<GamePlayerModalProps> = ({
  game,
  onClose,
  isFavorite,
  onToggleFavorite,
  onViewJson
}) => {
  const [isTheater, setIsTheater] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut: Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!game) return null;

  // Extract src from iframe string or fallback to game.url
  const extractSrc = (iframeStr: string): string => {
    const match = iframeStr.match(/src=["']([^"']+)["']/i);
    return match ? match[1] : (game.url || '');
  };

  const iframeSrc = extractSrc(game.iframe);

  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error("Fullscreen error:", err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const handleOpenAboutBlank = () => {
    try {
      const newWin = window.open('about:blank', '_blank');
      if (newWin) {
        newWin.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>${game.title} - Unblocked</title>
              <style>
                body, html { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background: #000; }
                iframe { width: 100%; height: 100%; border: none; }
              </style>
            </head>
            <body>
              <iframe src="${window.location.origin + iframeSrc}" allow="fullscreen; autoplay"></iframe>
            </body>
          </html>
        `);
        newWin.document.close();
      } else {
        window.open(iframeSrc, '_blank');
      }
    } catch (e) {
      window.open(iframeSrc, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      
      <div 
        ref={containerRef}
        className={`relative bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
          isTheater 
            ? 'w-full h-full max-w-none max-h-none rounded-none' 
            : 'w-full max-w-5xl h-[88vh]'
        }`}
      >
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900/95 border-b border-slate-800 gap-3 z-10">
          
          <div className="flex items-center gap-3 min-w-0">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white shadow-md text-sm shrink-0"
              style={{ backgroundColor: game.color || '#3b82f6' }}
            >
              {game.title.charAt(0)}
            </div>
            <div className="truncate">
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-slate-100 truncate">{game.title}</h2>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700/60 hidden sm:inline">
                  {game.category}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate hidden sm:block">
                Controls: {game.controls}
              </p>
            </div>
          </div>

          {/* Player controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            
            {/* Info toggle */}
            <button
              onClick={() => setShowInfo(!showInfo)}
              className={`p-2 rounded-lg text-xs font-medium transition-colors ${
                showInfo ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
              title="Game Info & Controls"
            >
              <Info className="w-4 h-4" />
            </button>

            {/* Favorite toggle */}
            <button
              onClick={() => onToggleFavorite(game.id)}
              className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>

            {/* Reload iframe */}
            <button
              onClick={() => setReloadKey(k => k + 1)}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              title="Restart Game"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Theater Mode toggle */}
            <button
              onClick={() => setIsTheater(!isTheater)}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors hidden sm:block"
              title={isTheater ? 'Exit Theater Mode' : 'Theater Mode'}
            >
              {isTheater ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Fullscreen API */}
            <button
              onClick={handleToggleFullscreen}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              title="Fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            {/* Open about:blank unblocked tab */}
            <button
              onClick={handleOpenAboutBlank}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors hidden sm:block"
              title="Open Cloaked in New Tab"
            >
              <ExternalLink className="w-4 h-4" />
            </button>

            {/* View JSON for this game */}
            <button
              onClick={onViewJson}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors hidden md:block"
              title="Inspect JSON Iframe Definition"
            >
              <FileCode className="w-4 h-4" />
            </button>

            <div className="h-4 w-[1px] bg-slate-800 mx-1" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 hover:bg-red-950/60 hover:text-red-400 text-slate-300 transition-colors"
              title="Close (Esc)"
            >
              <X className="w-4 h-4" />
            </button>

          </div>
        </div>

        {/* Informational drawer if toggled */}
        {showInfo && (
          <div className="bg-slate-900/95 border-b border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs z-10 animate-in slide-in-from-top-2">
            <div className="flex items-center gap-4 text-slate-300">
              <span className="flex items-center gap-1.5 text-blue-400 font-semibold">
                <Gamepad2 className="w-4 h-4" /> Controls:
              </span>
              <span>{game.controls}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Embedded via JSON Iframe definition</span>
            </div>
          </div>
        )}

        {/* Iframe Stage */}
        <div className="relative flex-1 w-full h-full bg-slate-950 overflow-hidden flex items-center justify-center">
          <iframe
            key={reloadKey}
            src={iframeSrc}
            title={game.title}
            className="w-full h-full border-0"
            allow="fullscreen; autoplay; gamepad; focus-without-user-activation"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals allow-downloads"
          />
        </div>

      </div>

    </div>
  );
};
