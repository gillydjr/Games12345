import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Minus, 
  Square, 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  LayoutGrid, 
  ShieldAlert, 
  Gamepad2, 
  Search,
  Clock,
  Sparkles
} from 'lucide-react';
import { GameItem, OSWindow } from '../types';
import { resolveUrl } from '../utils/url';

interface OSDesktopProps {
  games: GameItem[];
  onExitOS: () => void;
  onPanicCloak: () => void;
  openGameId?: string | null;
}

export const OSDesktop: React.FC<OSDesktopProps> = ({
  games,
  onExitOS,
  onPanicCloak,
  openGameId
}) => {
  const [windows, setWindows] = useState<OSWindow[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [topZ, setTopZ] = useState(10);
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [osSearch, setOsSearch] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  // Clock in system tray
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // If a game was passed to open on launch
  useEffect(() => {
    if (openGameId) {
      const g = games.find(item => item.id === openGameId);
      if (g) openGameWindow(g);
    } else if (windows.length === 0 && games.length > 0) {
      // Open default game (e.g. 2048) on first launch of OS
      openGameWindow(games[0]);
    }
  }, [openGameId]);

  const openGameWindow = (game: GameItem) => {
    const existing = windows.find(w => w.gameId === game.id);
    if (existing) {
      // Unminimize and focus
      setWindows(prev => prev.map(w => w.id === existing.id ? { ...w, minimized: false, zIndex: topZ + 1 } : w));
      setActiveWindowId(existing.id);
      setTopZ(z => z + 1);
      return;
    }

    const nextZ = topZ + 1;
    setTopZ(nextZ);

    // Stagger window positions
    const offset = (windows.length % 5) * 28;
    const newWin: OSWindow = {
      id: 'win_' + game.id + '_' + Date.now(),
      gameId: game.id,
      title: game.title,
      x: Math.max(20, Math.min(window.innerWidth - 680, 80 + offset)),
      y: Math.max(30, Math.min(window.innerHeight - 560, 50 + offset)),
      width: Math.min(720, window.innerWidth - 40),
      height: Math.min(520, window.innerHeight - 120),
      minimized: false,
      maximized: false,
      zIndex: nextZ
    };

    setWindows(prev => [...prev, newWin]);
    setActiveWindowId(newWin.id);
    setStartMenuOpen(false);
  };

  const closeWindow = (id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    if (activeWindowId === id) setActiveWindowId(null);
  };

  const toggleMinimize = (id: string) => {
    setWindows(prev => prev.map(w => {
      if (w.id === id) {
        const nextMin = !w.minimized;
        if (!nextMin) {
          setActiveWindowId(id);
          setTopZ(z => z + 1);
          return { ...w, minimized: false, zIndex: topZ + 1 };
        }
        return { ...w, minimized: true };
      }
      return w;
    }));
  };

  const toggleMaximize = (id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, maximized: !w.maximized } : w));
  };

  const focusWindow = (id: string) => {
    setActiveWindowId(id);
    setTopZ(z => {
      const nextZ = z + 1;
      setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: nextZ } : w));
      return nextZ;
    });
  };

  // Dragging logic
  const dragRef = useRef<{ winId: string; startX: number; startY: number; initX: number; initY: number } | null>(null);

  const onHeaderMouseDown = (e: React.MouseEvent, win: OSWindow) => {
    if (win.maximized) return;
    focusWindow(win.id);
    dragRef.current = {
      winId: win.id,
      startX: e.clientX,
      startY: e.clientY,
      initX: win.x,
      initY: win.y
    };

    const onMouseMove = (moveEvent: MouseEvent) => {
      if (!dragRef.current) return;
      const dx = moveEvent.clientX - dragRef.current.startX;
      const dy = moveEvent.clientY - dragRef.current.startY;
      setWindows(prev => prev.map(w => {
        if (w.id === dragRef.current?.winId) {
          return {
            ...w,
            x: Math.max(0, Math.min(window.innerWidth - 100, dragRef.current.initX + dx)),
            y: Math.max(0, Math.min(window.innerHeight - 80, dragRef.current.initY + dy))
          };
        }
        return w;
      }));
    };

    const onMouseUp = () => {
      dragRef.current = null;
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const filteredGames = games.filter(g => 
    g.title.toLowerCase().includes(osSearch.toLowerCase()) || 
    g.category.toLowerCase().includes(osSearch.toLowerCase())
  );

  return (
    <div className="relative w-screen h-screen bg-slate-950 overflow-hidden flex flex-col select-none font-sans">
      
      {/* OS Wallpaper with subtle grid */}
      <div 
        className="absolute inset-0 z-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(37, 99, 235, 0.18) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
            linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 100% 100%, 32px 32px, 32px 32px'
        }}
      />

      {/* Desktop Workspace: Icons */}
      <div className="relative flex-1 p-4 sm:p-6 overflow-auto z-10 grid grid-flow-col auto-cols-[100px] grid-rows-[repeat(auto-fill,105px)] gap-3">
        {games.map(game => (
          <div
            key={game.id}
            onDoubleClick={() => openGameWindow(game)}
            onClick={() => focusWindow(game.id)}
            className="w-24 h-24 p-2 rounded-xl flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-800/60 active:bg-blue-600/30 transition-all border border-transparent hover:border-slate-700/50 group"
          >
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-extrabold text-lg shadow-md mb-1.5 transition-transform group-hover:scale-105"
              style={{ backgroundColor: game.color || '#3b82f6' }}
            >
              {game.title.charAt(0)}
            </div>
            <span className="text-[11px] font-medium text-slate-200 line-clamp-1 group-hover:text-blue-300 drop-shadow-md">
              {game.title}
            </span>
          </div>
        ))}
      </div>

      {/* Floating OS Windows */}
      {windows.map(win => {
        const game = games.find(g => g.id === win.gameId);
        if (!game || win.minimized) return null;

        const isMax = win.maximized;
        const winStyle: React.CSSProperties = isMax ? {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: '44px',
          width: '100%',
          height: 'calc(100vh - 44px)',
          zIndex: win.zIndex,
          borderRadius: 0
        } : {
          position: 'absolute',
          top: win.y,
          left: win.x,
          width: win.width,
          height: win.height,
          zIndex: win.zIndex
        };

        return (
          <div
            key={win.id}
            style={winStyle}
            onClick={() => focusWindow(win.id)}
            className={`bg-slate-900 border border-slate-700/90 shadow-2xl flex flex-col overflow-hidden transition-shadow ${
              isMax ? '' : 'rounded-xl'
            } ${activeWindowId === win.id ? 'ring-2 ring-blue-500/50 shadow-blue-500/10' : 'opacity-95'}`}
          >
            {/* Window Header Bar */}
            <div
              onMouseDown={(e) => onHeaderMouseDown(e, win)}
              className="h-10 px-3 bg-slate-850 bg-slate-900 border-b border-slate-800 flex items-center justify-between cursor-grab active:cursor-grabbing select-none"
            >
              <div className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] text-white font-bold"
                  style={{ backgroundColor: game.color || '#3b82f6' }}
                >
                  {game.title.charAt(0)}
                </div>
                <span className="text-xs font-semibold text-slate-200">{win.title}</span>
              </div>

              <div className="flex items-center gap-1">
                {/* Minimize button */}
                <button
                  onClick={(e) => { e.stopPropagation(); toggleMinimize(win.id); }}
                  className="w-7 h-7 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 flex items-center justify-center transition-colors"
                  title="Minimize"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>

                {/* Maximize button */}
                <button
                  onClick={(e) => { e.stopPropagation(); toggleMaximize(win.id); }}
                  className="w-7 h-7 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 flex items-center justify-center transition-colors"
                  title={isMax ? 'Restore' : 'Maximize'}
                >
                  {isMax ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>

                {/* Close button */}
                <button
                  onClick={(e) => { e.stopPropagation(); closeWindow(win.id); }}
                  className="w-7 h-7 rounded hover:bg-red-600 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                  title="Close"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Window Iframe Content */}
            <div className="relative flex-1 w-full h-full bg-slate-950 overflow-hidden">
              <iframe
                src={resolveUrl(game.url)}
                title={game.title}
                className="w-full h-full border-0"
                allow="fullscreen; autoplay; gamepad"
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals allow-downloads"
              />
            </div>
          </div>
        );
      })}

      {/* Start Menu Popup */}
      {startMenuOpen && (
        <div 
          className="absolute bottom-12 left-2 w-80 max-h-[460px] bg-slate-900/95 backdrop-blur-lg border border-slate-700/80 rounded-2xl shadow-2xl p-3 z-50 flex flex-col gap-2 animate-in slide-in-from-bottom-3"
        >
          {/* Start Menu Header */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
                <Gamepad2 className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-slate-100">GameOS Apps</span>
            </div>
            <button
              onClick={onExitOS}
              className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              <LayoutGrid className="w-3 h-3" /> Grid View
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={osSearch}
              onChange={(e) => setOsSearch(e.target.value)}
              placeholder="Search games in GameOS..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Games list in Start Menu */}
          <div className="flex-1 overflow-y-auto max-h-64 space-y-1 pr-1">
            {filteredGames.map(game => (
              <button
                key={game.id}
                onClick={() => openGameWindow(game)}
                className="w-full px-2.5 py-2 rounded-lg hover:bg-slate-800 flex items-center justify-between text-left transition-colors group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div 
                    className="w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-bold text-white shrink-0"
                    style={{ backgroundColor: game.color || '#3b82f6' }}
                  >
                    {game.title.charAt(0)}
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-semibold text-slate-200 group-hover:text-blue-300 truncate">
                      {game.title}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">{game.category}</div>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-slate-500 group-hover:text-blue-400">Launch</span>
              </button>
            ))}
          </div>

          {/* Panic Cloak button in Start Menu */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={onPanicCloak}
              className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 py-1 px-2 rounded-lg hover:bg-red-950/40"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Panic Cloak</span>
            </button>
            <span className="text-[10px] text-slate-500">Press Esc anytime</span>
          </div>
        </div>
      )}

      {/* OS Taskbar */}
      <div className="h-11 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-2 sm:px-4 flex items-center justify-between z-40">
        
        {/* Left: Start Menu Button + Open Windows */}
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={() => setStartMenuOpen(!startMenuOpen)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              startMenuOpen 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-slate-800 hover:bg-slate-750 text-slate-200 hover:bg-slate-700'
            }`}
          >
            <Gamepad2 className="w-4 h-4 text-blue-400" />
            <span>Start</span>
          </button>

          <div className="h-4 w-[1px] bg-slate-800 mx-1 hidden sm:block" />

          {/* Taskbar Window buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {windows.map(win => {
              const game = games.find(g => g.id === win.gameId);
              const isActive = activeWindowId === win.id && !win.minimized;
              return (
                <button
                  key={win.id}
                  onClick={() => {
                    if (win.minimized) toggleMinimize(win.id);
                    else if (activeWindowId === win.id) toggleMinimize(win.id);
                    else focusWindow(win.id);
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all max-w-[140px] truncate ${
                    isActive 
                      ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40' 
                      : 'bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/50'
                  }`}
                  title={win.title}
                >
                  <div 
                    className="w-2.5 h-2.5 rounded-full shrink-0" 
                    style={{ backgroundColor: game?.color || '#3b82f6' }}
                  />
                  <span className="truncate">{win.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Clock & Exit OS mode */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onPanicCloak}
            className="p-1.5 rounded-md hover:bg-red-950/40 text-slate-400 hover:text-red-400 transition-colors"
            title="Panic / Stealth Disguise"
          >
            <ShieldAlert className="w-4 h-4" />
          </button>

          <button
            onClick={onExitOS}
            className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md text-xs font-semibold border border-slate-700 transition-all"
            title="Return to Grid Portal view"
          >
            <LayoutGrid className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Grid View</span>
          </button>

          <div className="flex items-center gap-1 px-2 py-1 bg-slate-800/50 rounded-md text-slate-300 text-xs font-mono">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>{currentTime}</span>
          </div>
        </div>

      </div>

    </div>
  );
};
