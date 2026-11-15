import React from 'react';
import { Play, Grid3X3, Shield, Eye, Flame, Trophy, Target, Sparkles } from 'lucide-react';
import type { GameStats } from '../types/player';

interface MainMenuProps {
  onStartClassic: () => void;
  onStartGrid: () => void;
  stats: GameStats;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onStartClassic,
  onStartGrid,
  stats,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 py-8 z-20">
      {/* Topo: Subtítulo e Logo Gigante */}
      <div className="text-center mb-8 select-none">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#08091A] border border-[#6D28D9] text-[#B8FF01] font-arcade text-[10px] sm:text-xs tracking-widest uppercase mb-3 shadow-arcade-sm">
          <Sparkles size={14} className="text-[#B8FF01] animate-spin" />
          ❖ EDIÇÃO SÉRIE A ❖
        </div>

        <h1 className="font-display font-black italic tracking-tighter text-4xl sm:text-6xl md:text-7xl leading-none">
          <span className="text-white drop-shadow-[4px_4px_0_#000000] text-stroke-black">
            BRASILEIR
          </span>
          <span className="text-[#B8FF01] drop-shadow-[4px_4px_0_#000000] text-stroke-black">
            ÃODLE
          </span>
        </h1>
        <p className="font-display font-bold text-gray-300 text-sm sm:text-base tracking-wide mt-2 drop-shadow">
          O FLIPERAMA DIÁRIO DE FUTEBOL BRASILEIRO
        </p>
      </div>

      {/* Painel Arcade Central */}
      <div className="relative w-full max-w-xl bg-[#0A0B1E]/95 border-4 border-[#6D28D9] p-6 sm:p-8 shadow-arcade-lg">
        {/* Cantoneiras Pixel Verde Limão */}
        <div className="absolute top-1.5 left-1.5 w-3.5 h-3.5 bg-[#B8FF01]" />
        <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-[#B8FF01]" />
        <div className="absolute bottom-1.5 left-1.5 w-3.5 h-3.5 bg-[#B8FF01]" />
        <div className="absolute bottom-1.5 right-1.5 w-3.5 h-3.5 bg-[#B8FF01]" />

        {/* Título da Seção */}
        <div className="text-center mb-6">
          <span className="font-arcade text-xs text-[#B8FF01] tracking-widest">
            ❖ MODOS DE JOGO ❖
          </span>
        </div>

        {/* Botões do Menu Arcade */}
        <div className="space-y-3.5">
          {/* MODO CLÁSSICO */}
          <button
            onClick={onStartClassic}
            className="w-full group flex items-center justify-between p-4 bg-[#08091A] border-2 border-[#6D28D9] text-[#38BDF8] hover:bg-[#B8FF01] hover:text-black hover:border-black transition-all shadow-arcade active:translate-y-0.5 cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <span className="text-lg group-hover:translate-x-1 transition-transform">
                ▶
              </span>
              <div className="text-left">
                <div className="font-arcade text-sm sm:text-base font-bold tracking-wider">
                  MODO CLÁSSICO
                </div>
                <div className="font-sans text-xs text-gray-400 group-hover:text-black/80 font-normal mt-0.5">
                  Adivinhe o craque do dia com pistas de atributos
                </div>
              </div>
            </div>
            <Play
              size={22}
              className="text-[#38BDF8] group-hover:text-black fill-current"
            />
          </button>

          {/* GRID DO BRASILEIRÃO */}
          <button
            onClick={onStartGrid}
            className="w-full group flex items-center justify-between p-4 bg-[#08091A] border-2 border-[#6D28D9] text-[#38BDF8] hover:bg-[#B8FF01] hover:text-black hover:border-black transition-all shadow-arcade active:translate-y-0.5 cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <span className="text-lg group-hover:translate-x-1 transition-transform">
                ▶
              </span>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span className="font-arcade text-sm sm:text-base font-bold tracking-wider">
                    GRID DO BRASILEIRÃO
                  </span>
                  <span className="font-arcade text-[9px] px-2 py-0.5 bg-[#B8FF01] text-black font-bold border border-black">
                    3x3
                  </span>
                </div>
                <div className="font-sans text-xs text-gray-400 group-hover:text-black/80 font-normal mt-0.5">
                  Cruze clubes e atributos no Grid 3x3 estilo Futbol11
                </div>
              </div>
            </div>
            <Grid3X3
              size={22}
              className="text-[#38BDF8] group-hover:text-black"
            />
          </button>

          {/* QUEM É O ESCUDO? (Em breve) */}
          <div className="w-full flex items-center justify-between p-4 bg-[#08091A]/60 border-2 border-dashed border-[#6D28D9]/50 text-gray-500 cursor-not-allowed">
            <div className="flex items-center gap-3.5">
              <Shield size={20} className="text-gray-500" />
              <div className="text-left">
                <div className="font-arcade text-xs sm:text-sm tracking-wider">
                  QUEM É O ESCUDO?
                </div>
                <div className="font-sans text-[11px] text-gray-500 mt-0.5">
                  Adivinhe o clube pelo formato do brasão
                </div>
              </div>
            </div>
            <span className="font-arcade text-[9px] px-2 py-1 bg-[#15193B] text-gray-400 border border-black">
              EM BREVE
            </span>
          </div>

          {/* FOTO PIXELADA (Em breve) */}
          <div className="w-full flex items-center justify-between p-4 bg-[#08091A]/60 border-2 border-dashed border-[#6D28D9]/50 text-gray-500 cursor-not-allowed">
            <div className="flex items-center gap-3.5">
              <Eye size={20} className="text-gray-500" />
              <div className="text-left">
                <div className="font-arcade text-xs sm:text-sm tracking-wider">
                  FOTO PIXELADA
                </div>
                <div className="font-sans text-[11px] text-gray-500 mt-0.5">
                  Identifique o jogador que vai ficando mais nítido
                </div>
              </div>
            </div>
            <span className="font-arcade text-[9px] px-2 py-1 bg-[#15193B] text-gray-400 border border-black">
              EM BREVE
            </span>
          </div>
        </div>

        {/* Seção Inferior: SEU STATUS */}
        <div className="mt-8 pt-6 border-t-2 border-[#6D28D9]">
          <div className="text-center mb-3">
            <span className="font-arcade text-[10px] text-[#B8FF01] tracking-widest">
              ❖ SEU STATUS ❖
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
            {/* Slot 1: Streak */}
            <div className="bg-[#08091A] border-2 border-black p-2.5 shadow-arcade-sm">
              <div className="flex items-center justify-center gap-1 text-orange-400 font-arcade text-[9px] mb-1">
                <Flame size={12} /> STREAK
              </div>
              <div className="font-display font-black text-xl sm:text-2xl text-[#B8FF01]">
                {stats.currentStreak}
              </div>
            </div>

            {/* Slot 2: Vitórias */}
            <div className="bg-[#08091A] border-2 border-black p-2.5 shadow-arcade-sm">
              <div className="flex items-center justify-center gap-1 text-[#22C55E] font-arcade text-[9px] mb-1">
                <Trophy size={12} /> VITÓRIAS
              </div>
              <div className="font-display font-black text-xl sm:text-2xl text-white">
                {stats.gamesWon}
              </div>
            </div>

            {/* Slot 3: Jogos */}
            <div className="bg-[#08091A] border-2 border-black p-2.5 shadow-arcade-sm">
              <div className="flex items-center justify-center gap-1 text-[#38BDF8] font-arcade text-[9px] mb-1">
                <Target size={12} /> JOGOS
              </div>
              <div className="font-display font-black text-xl sm:text-2xl text-white">
                {stats.gamesPlayed}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
