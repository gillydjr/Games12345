import React from 'react';
import { 
  Gamepad2, 
  Monitor, 
  LayoutGrid, 
  FileCode, 
  PlusCircle, 
  ShieldAlert, 
  Search, 
  Heart,
  ExternalLink
} from 'lucide-react';
import { ViewMode } from '../types';

interface NavbarProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  categories: string[];
  favoritesCount: number;
  showOnlyFavorites: boolean;
  setShowOnlyFavorites: (fav: boolean) => void;
  onOpenJsonModal: () => void;
  onOpenAddModal: () => void;
  onPanicCloak: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  viewMode,
  setViewMode,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories,
  favoritesCount,
  showOnlyFavorites,
  setShowOnlyFavorites,
  onOpenJsonModal,
  onOpenAddModal,
  onPanicCloak
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-bold">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-slate-100 tracking-tight">Unblocked<span className="text-blue-400">Games</span></span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  JSON Powered
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Playable iframe arcade</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search games by title, tag, or controls..."
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Actions & View Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Favorites filter toggle */}
            <button
              onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                showOnlyFavorites 
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm' 
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
              }`}
              title="Filter by Favorites"
            >
              <Heart className={`w-3.5 h-3.5 ${showOnlyFavorites ? 'fill-rose-400 text-rose-400' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">Favorites</span>
              {favoritesCount > 0 && (
                <span className="bg-rose-500 text-white rounded-full px-1.5 py-0.2 text-[10px] font-bold">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* View Mode Switch (Grid Portal vs OS Desktop) */}
            <div className="bg-slate-800 p-0.5 rounded-lg border border-slate-700 flex items-center">
              <button
                onClick={() => setViewMode('portal')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                  viewMode === 'portal'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Grid Catalog View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Grid</span>
              </button>
              <button
                onClick={() => setViewMode('os')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                  viewMode === 'os'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Desktop OS Mode"
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">OS Mode</span>
              </button>
            </div>

            {/* Add Game Button */}
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
              title="Add a custom game with iframe"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add Game</span>
            </button>

            {/* View JSON Modal Button */}
            <button
              onClick={onOpenJsonModal}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700 transition-all"
              title="View & Export games.json"
            >
              <FileCode className="w-4 h-4" />
            </button>

            {/* Panic / Cloak Button */}
            <button
              onClick={onPanicCloak}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-red-950/60 hover:text-red-300 text-slate-400 rounded-lg border border-slate-700 transition-all text-xs font-medium group"
              title="Panic / Stealth Cloak (Disguise as Google Docs)"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-400 transition-colors" />
              <span className="hidden md:inline">Cloak</span>
            </button>

          </div>
        </div>

        {/* Mobile search bar */}
        <div className="pb-3 md:hidden">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search unblocked games..."
              className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
        </div>

      </div>
    </header>
  );
};
