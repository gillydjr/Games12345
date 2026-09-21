import React, { useState, useEffect, useMemo } from 'react';
import { GameItem, ViewMode } from './types';
import { defaultGames } from './data/games';
import { Navbar } from './components/Navbar';
import { GameCard } from './components/GameCard';
import { GamePlayerModal } from './components/GamePlayerModal';
import { OSDesktop } from './components/OSDesktop';
import { JsonViewerModal } from './components/JsonViewerModal';
import { AddGameModal } from './components/AddGameModal';
import { PanicCloakModal } from './components/PanicCloakModal';
import { resolveUrl } from './utils/url';
import { 
  Gamepad2, 
  Sparkles, 
  Flame, 
  ShieldCheck, 
  FileCode, 
  Plus, 
  Laptop, 
  Code,
  SearchX
} from 'lucide-react';

export default function App() {
  const [games, setGames] = useState<GameItem[]>(defaultGames);
  const [viewMode, setViewMode] = useState<ViewMode>('portal');
  const [selectedGame, setSelectedGame] = useState<GameItem | null>(null);
  const [osLaunchGameId, setOsLaunchGameId] = useState<string | null>(null);
  
  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  
  // Modals
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPanicCloak, setShowPanicCloak] = useState(false);

  // Favorites in localStorage
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('unblocked_favs');
      return saved ? JSON.parse(saved) : ['2048', 'tetris', 'snake'];
    } catch {
      return ['2048', 'tetris', 'snake'];
    }
  });

  // Load games from games.json on mount, then merge any locally added custom games
  useEffect(() => {
    const targetUrl = resolveUrl('games.json');
    fetch(targetUrl)
      .catch(() => fetch('./games.json'))
      .then(res => res.json())
      .then((data: GameItem[]) => {
        if (Array.isArray(data) && data.length > 0) {
          try {
            const localCustom = localStorage.getItem('unblocked_custom_games');
            const customList: GameItem[] = localCustom ? JSON.parse(localCustom) : [];
            setGames([...data, ...customList]);
          } catch {
            setGames(data);
          }
        }
      })
      .catch(err => {
        console.warn('Using bundled games data:', err);
      });
  }, []);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id];
      localStorage.setItem('unblocked_favs', JSON.stringify(next));
      return next;
    });
  };

  const handleAddGame = (newGame: GameItem) => {
    setGames(prev => {
      const next = [newGame, ...prev];
      try {
        const localCustom = localStorage.getItem('unblocked_custom_games');
        const customList: GameItem[] = localCustom ? JSON.parse(localCustom) : [];
        localStorage.setItem('unblocked_custom_games', JSON.stringify([newGame, ...customList]));
      } catch (e) {
        console.error("Failed to save custom game", e);
      }
      return next;
    });
    setSelectedGame(newGame);
  };

  const handleImportGames = (imported: GameItem[]) => {
    setGames(imported);
    try {
      localStorage.setItem('unblocked_custom_games', JSON.stringify(imported.filter(g => g.custom)));
    } catch (e) {
      console.error("Failed to save imported custom games", e);
    }
  };

  const categories = useMemo(() => {
    const set = new Set<string>();
    games.forEach(g => { if (g.category) set.add(g.category); });
    return ['All', ...Array.from(set)];
  }, [games]);

  const filteredGames = useMemo(() => {
    return games.filter(g => {
      // Category filter
      if (selectedCategory !== 'All' && g.category !== selectedCategory) return false;
      // Favorites filter
      if (showOnlyFavorites && !favorites.includes(g.id)) return false;
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = g.title.toLowerCase().includes(q);
        const matchCat = g.category.toLowerCase().includes(q);
        const matchDesc = g.description.toLowerCase().includes(q);
        const matchCtrl = g.controls?.toLowerCase().includes(q);
        if (!matchTitle && !matchCat && !matchDesc && !matchCtrl) return false;
      }
      return true;
    });
  }, [games, selectedCategory, showOnlyFavorites, favorites, searchQuery]);

  const featuredGame = useMemo(() => {
    return games.find(g => g.badge === 'HOT' || g.id === '2048') || games[0];
  }, [games]);

  // Keyboard shortcut: Panic Cloak on `]`
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ']' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        setShowPanicCloak(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      
      {/* Panic Stealth Cloak if active */}
      {showPanicCloak && (
        <PanicCloakModal onExit={() => setShowPanicCloak(false)} />
      )}

      {/* Main Top Navigation */}
      <Navbar
        viewMode={viewMode}
        setViewMode={setViewMode}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
        favoritesCount={favorites.length}
        showOnlyFavorites={showOnlyFavorites}
        setShowOnlyFavorites={setShowOnlyFavorites}
        onOpenJsonModal={() => setShowJsonModal(true)}
        onOpenAddModal={() => setShowAddModal(true)}
        onPanicCloak={() => setShowPanicCloak(true)}
      />

      {/* View Mode Router */}
      {viewMode === 'os' ? (
        <OSDesktop
          games={games}
          onExitOS={() => setViewMode('portal')}
          onPanicCloak={() => setShowPanicCloak(true)}
          openGameId={osLaunchGameId}
        />
      ) : (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
          
          {/* Categories Pill Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map(cat => {
              const count = cat === 'All' 
                ? games.length 
                : games.filter(g => g.category === cat).length;

              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    selectedCategory === cat ? 'bg-blue-700 text-white' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Featured Quickplay Spotlight (shown when no search filter active) */}
          {!searchQuery && selectedCategory === 'All' && !showOnlyFavorites && featuredGame && (
            <div className="relative rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 border border-slate-800 p-6 sm:p-8 overflow-hidden shadow-2xl">
              <div 
                className="absolute right-0 top-0 bottom-0 w-1/2 opacity-15 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at right, ${featuredGame.color || '#3b82f6'}, transparent 70%)`
                }}
              />

              <div className="relative z-10 max-w-2xl space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                    <Flame className="w-3 h-3 fill-current" /> Spotlight Game
                  </span>
                  <span className="text-xs text-slate-400">• Ready to play in iframe</span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {featuredGame.title}
                </h1>

                <p className="text-sm text-slate-300 leading-relaxed">
                  {featuredGame.description}
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setSelectedGame(featuredGame)}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2 hover:scale-105"
                  >
                    <Gamepad2 className="w-4 h-4" /> Play Now
                  </button>

                  <button
                    onClick={() => {
                      setOsLaunchGameId(featuredGame.id);
                      setViewMode('os');
                    }}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-semibold border border-slate-700 transition-all flex items-center gap-2"
                  >
                    <Laptop className="w-4 h-4 text-blue-400" /> Launch in GameOS
                  </button>

                  <button
                    onClick={() => setShowJsonModal(true)}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium border border-slate-700 transition-all flex items-center gap-1.5"
                  >
                    <FileCode className="w-4 h-4 text-slate-400" /> View JSON
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Games Grid Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-100">
                {showOnlyFavorites ? 'Favorite Games' : selectedCategory === 'All' ? 'All Unblocked Games' : `${selectedCategory} Games`}
              </h2>
              <span className="text-xs text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md font-mono">
                {filteredGames.length}
              </span>
            </div>

            <span className="text-xs text-slate-500 hidden sm:inline">
              Stored as iframes in <code className="text-blue-400">games.json</code>
            </span>
          </div>

          {/* Games Grid */}
          {filteredGames.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {filteredGames.map(game => (
                <GameCard
                  key={game.id}
                  game={game}
                  isFavorite={favorites.includes(game.id)}
                  onToggleFavorite={toggleFavorite}
                  onSelectGame={(g) => setSelectedGame(g)}
                  onOpenInOS={(g) => {
                    setOsLaunchGameId(g.id);
                    setViewMode('os');
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center border border-dashed border-slate-800 rounded-2xl p-8 max-w-md mx-auto">
              <SearchX className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-200 mb-1">No games found</h3>
              <p className="text-xs text-slate-400 mb-4">
                {showOnlyFavorites 
                  ? "You haven't marked any games as favorites yet." 
                  : `No games match "${searchQuery}".`}
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setShowOnlyFavorites(false);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition-all"
              >
                Reset Filters
              </button>
            </div>
          )}

        </main>
      )}

      {/* Footer */}
      {viewMode === 'portal' && (
        <footer className="border-t border-slate-800/80 bg-slate-900/60 mt-12 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Gamepad2 className="w-4 h-4 text-blue-400" />
              <span>Unblocked Games Portal • JSON Iframe Architecture</span>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowJsonModal(true)}
                className="hover:text-blue-400 transition-colors flex items-center gap-1 font-mono"
              >
                <Code className="w-3.5 h-3.5" /> /games.json
              </button>
              <span>•</span>
              <button
                onClick={() => setViewMode(viewMode === 'portal' ? 'os' : 'portal')}
                className="hover:text-blue-400 transition-colors"
              >
                Switch to {viewMode === 'portal' ? 'Desktop OS Mode' : 'Grid Portal'}
              </button>
              <span>•</span>
              <span className="text-slate-500">Press ']' for Stealth Cloak</span>
            </div>
          </div>
        </footer>
      )}

      {/* Modals */}
      <GamePlayerModal
        game={selectedGame}
        onClose={() => setSelectedGame(null)}
        isFavorite={selectedGame ? favorites.includes(selectedGame.id) : false}
        onToggleFavorite={toggleFavorite}
        onViewJson={() => setShowJsonModal(true)}
      />

      {showJsonModal && (
        <JsonViewerModal
          games={games}
          onClose={() => setShowJsonModal(false)}
          onImportGames={handleImportGames}
        />
      )}

      {showAddModal && (
        <AddGameModal
          onClose={() => setShowAddModal(false)}
          onAddGame={handleAddGame}
        />
      )}

    </div>
  );
}
