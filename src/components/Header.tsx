import React from 'react';
import { ArrowLeft, HelpCircle, BarChart2, Flame } from 'lucide-react';

interface HeaderProps {
  currentScreen: 'menu' | 'classic' | 'grid';
  onNavigate: (screen: 'menu' | 'classic' | 'grid') => void;
  onOpenHowToPlay: () => void;
  onOpenStats: () => void;
  streak: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  onOpenHowToPlay,
  onOpenStats,
  streak,
}) => {
  return (
    <header className="w-full max-w-4xl mx-auto px-4 h-12 flex items-center justify-between z-30 select-none">
      <div className="flex items-center gap-2.5">
        {currentScreen !== 'menu' && (
          <button
            onClick={() => onNavigate('menu')}
            className="flex items-center justify-center w-8 h-8 bg-[#04160E] border-2 border-[#FFDF00] text-[#FFDF00] hover:bg-[#FFDF00] hover:text-black transition-all shadow-arcade-sm active:translate-y-0.5 cursor-pointer"
            title="Voltar ao Menu Principal"
          >
            <ArrowLeft size={16} strokeWidth={3} />
          </button>
        )}

        {/* Mostra logo compacto no topo APENAS quando não estiver no menu principal */}
        {currentScreen !== 'menu' && (
          <div
            onClick={() => onNavigate('menu')}
            className="cursor-pointer group flex items-center gap-1.5"
          >
            <h1 className="font-display font-black italic tracking-tighter text-xl sm:text-2xl leading-none flex items-center">
              <span className="text-white drop-shadow-[2px_2px_0_#000]">CRAQUE</span>
              <span className="text-[#FFDF00] drop-shadow-[2px_2px_0_#000]">DLE</span>
            </h1>
            <span className="font-arcade text-[8px] text-[#00DF81] tracking-widest hidden sm:inline px-1 bg-black/40 border border-[#00DF81]/50">
              SÉRIE A
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Streak Counter */}
        <div
          className="flex items-center gap-1 px-2.5 py-1 bg-[#04160E] border-2 border-[#FFDF00] text-orange-400 font-arcade text-[10px] shadow-arcade-sm"
          title={`Sequência Atual: ${streak} dias`}
        >
          <Flame size={14} className="text-orange-500 fill-orange-500 animate-pulse" />
          <span className="font-bold text-[#FFDF00]">{streak}</span>
        </div>

        {/* Stats Button */}
        <button
          onClick={onOpenStats}
          className="flex items-center justify-center w-8 h-8 bg-[#04160E] border-2 border-[#FFDF00] text-[#FFDF00] hover:bg-[#FFDF00] hover:text-black transition-all shadow-arcade-sm cursor-pointer"
          title="Ver Estatísticas"
        >
          <BarChart2 size={15} strokeWidth={2.5} />
        </button>

        {/* How to play Button */}
        <button
          onClick={onOpenHowToPlay}
          className="flex items-center justify-center w-8 h-8 bg-[#04160E] border-2 border-[#FFDF00] text-[#FFDF00] hover:bg-[#FFDF00] hover:text-black transition-all shadow-arcade-sm cursor-pointer"
          title="Como Jogar?"
        >
          <HelpCircle size={15} strokeWidth={2.5} />
        </button>
      </div>
    </header>
  );
};
