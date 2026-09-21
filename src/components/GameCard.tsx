import React from 'react';
import { Play, Heart, Star, Flame, Eye, MonitorPlay } from 'lucide-react';
import { GameItem } from '../types';

interface GameCardProps {
  game: GameItem;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onSelectGame: (game: GameItem) => void;
  onOpenInOS?: (game: GameItem) => void;
}

export const GameCard: React.FC<GameCardProps> = ({
  game,
  isFavorite,
  onToggleFavorite,
  onSelectGame,
  onOpenInOS
}) => {
  return (
    <div className="group relative bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 flex flex-col justify-between overflow-hidden">
      
      {/* Decorative top accent line */}
      <div 
        className="absolute top-0 left-0 right-0 h-1 transition-all duration-300 group-hover:h-1.5"
        style={{ backgroundColor: game.color || '#3b82f6' }}
      />

      <div>
        {/* Top bar: Badge & Favorite Button */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700/60">
              {game.category}
            </span>
            {game.badge && (
              <span 
                className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full text-slate-950 flex items-center gap-0.5 shadow-sm"
                style={{ backgroundColor: game.color || '#f59e0b' }}
              >
                <Flame className="w-2.5 h-2.5 fill-current" />
                {game.badge}
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(game.id);
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
        </div>

        {/* Thumbnail preview banner */}
        <div 
          onClick={() => onSelectGame(game)}
          className="relative w-full aspect-video rounded-xl bg-slate-950 border border-slate-800/80 mb-3 overflow-hidden flex items-center justify-center cursor-pointer group-hover:border-slate-700 transition-all"
        >
          {/* Visual gradient backdrop */}
          <div 
            className="absolute inset-0 opacity-20 group-hover:opacity-35 transition-opacity"
            style={{ 
              background: `radial-gradient(circle at center, ${game.color || '#3b82f6'}, transparent 70%)` 
            }}
          />

          {/* Icon / Game Graphic Display */}
          <div className="flex flex-col items-center gap-1 z-10">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl text-white shadow-lg transition-transform group-hover:scale-110"
              style={{ backgroundColor: game.color || '#3b82f6' }}
            >
              {game.title.charAt(0)}
            </div>
            <span className="text-[11px] font-medium text-slate-400">HTML5 Iframe</span>
          </div>

          {/* Hover Play Overlay */}
          <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 backdrop-blur-[2px] transition-all flex items-center justify-center gap-3">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onSelectGame(game);
              }}
              className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all hover:scale-105"
              title="Play Now"
            >
              <Play className="w-5 h-5 fill-current ml-0.5" />
            </button>
            {onOpenInOS && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenInOS(game);
                }}
                className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all hover:scale-105 border border-slate-700"
                title="Launch in Desktop OS Mode"
              >
                <MonitorPlay className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Title & Description */}
        <h3 
          onClick={() => onSelectGame(game)}
          className="font-bold text-base text-slate-100 group-hover:text-blue-400 transition-colors cursor-pointer mb-1"
        >
          {game.title}
        </h3>
        <p className="text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed">
          {game.description}
        </p>
      </div>

      <div>
        {/* Footer: Rating, Plays, and Quick Play button */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-amber-400 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{game.rating}</span>
            </div>
            <div className="flex items-center gap-1 text-slate-500">
              <Eye className="w-3.5 h-3.5" />
              <span>{game.plays}</span>
            </div>
          </div>

          <button
            onClick={() => onSelectGame(game)}
            className="flex items-center gap-1 font-semibold text-blue-400 hover:text-blue-300 transition-colors"
          >
            Play <Play className="w-3 h-3 fill-current ml-0.5" />
          </button>
        </div>
      </div>

    </div>
  );
};
