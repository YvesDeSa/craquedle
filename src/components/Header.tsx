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
    <header className="w-full max-w-4xl mx-auto px-4 py-3 flex items-center justify-between z-20">
      <div className="flex items-center gap-3">
        {currentScreen !== 'menu' && (
          <button
            onClick={() => onNavigate('menu')}
            className="flex items-center justify-center w-10 h-10 bg-[#08091A] border-2 border-[#6D28D9] text-[#38BDF8] hover:bg-[#B8FF01] hover:text-black hover:border-black transition-all shadow-arcade-sm active:translate-y-0.5 cursor-pointer"
            title="Voltar ao Menu Principal"
          >
            <ArrowLeft size={20} strokeWidth={3} />
          </button>
        )}

        <div
          onClick={() => onNavigate('menu')}
          className="cursor-pointer group select-none flex flex-col"
        >
          <span className="font-arcade text-[9px] text-[#B8FF01] tracking-widest hidden sm:block">
            ❖ EDIÇÃO SÉRIE A ❖
          </span>
          <h1 className="font-display font-black italic tracking-tighter text-2xl sm:text-3xl leading-none flex items-center">
            <span className="text-white drop-shadow-[2px_2px_0_#000]">BRASILEIR</span>
            <span className="text-[#B8FF01] drop-shadow-[2px_2px_0_#000]">ÃODLE</span>
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Streak Counter */}
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#08091A] border-2 border-[#6D28D9] text-orange-400 font-arcade text-xs shadow-arcade-sm"
          title={`Sequência Atual: ${streak} dias`}
        >
          <Flame size={16} className="text-orange-500 fill-orange-500 animate-pulse" />
          <span className="font-bold text-[#B8FF01]">{streak}</span>
        </div>

        {/* Stats Button */}
        <button
          onClick={onOpenStats}
          className="flex items-center justify-center w-10 h-10 bg-[#08091A] border-2 border-[#6D28D9] text-[#38BDF8] hover:bg-[#B8FF01] hover:text-black hover:border-black transition-all shadow-arcade-sm cursor-pointer"
          title="Ver Estatísticas"
        >
          <BarChart2 size={18} strokeWidth={2.5} />
        </button>

        {/* How to play Button */}
        <button
          onClick={onOpenHowToPlay}
          className="flex items-center justify-center w-10 h-10 bg-[#08091A] border-2 border-[#6D28D9] text-[#38BDF8] hover:bg-[#B8FF01] hover:text-black hover:border-black transition-all shadow-arcade-sm cursor-pointer"
          title="Como Jogar?"
        >
          <HelpCircle size={18} strokeWidth={2.5} />
        </button>
      </div>
    </header>
  );
};
