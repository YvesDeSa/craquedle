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
    <div className="flex flex-col items-center justify-center my-auto px-4 py-2 z-20 w-full max-w-xl">
      {/* Topo: Subtítulo e Logo Gigante CRAQUEDLE */}
      <div className="text-center mb-4 select-none">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-[#04160E] border border-[#FFDF00] text-[#00DF81] font-arcade text-[10px] sm:text-xs tracking-widest uppercase mb-2 shadow-arcade-sm">
          <Sparkles size={12} className="text-[#FFDF00] animate-spin" />
          ❖ EDIÇÃO BRASILEIRÃO SÉRIE A ❖
        </div>

        <h1 className="font-display font-black italic tracking-tighter text-4xl sm:text-6xl leading-none">
          <span className="text-white drop-shadow-[4px_4px_0_#000000] text-stroke-black">
            CRAQUE
          </span>
          <span className="text-[#FFDF00] drop-shadow-[4px_4px_0_#000000] text-stroke-black">
            DLE
          </span>
        </h1>
        <div className="h-1 w-24 bg-[#00DF81] mx-auto mt-1 border border-black shadow-sm" />
        <p className="font-display font-bold text-gray-300 text-xs sm:text-sm tracking-wide mt-1.5 drop-shadow">
          O FLIPERAMA DIÁRIO DO FUTEBOL BRASILEIRO
        </p>
      </div>

      {/* Painel Arcade Central */}
      <div className="relative w-full bg-[#061A12]/95 border-4 border-[#FFDF00] p-4 sm:p-5 shadow-arcade-lg">
        {/* Cantoneiras Pixel Verde Neon e Branco */}
        <div className="absolute top-1 left-1 w-3 h-3 bg-[#00DF81]" />
        <div className="absolute top-1 right-1 w-3 h-3 bg-[#FFFFFF]" />
        <div className="absolute bottom-1 left-1 w-3 h-3 bg-[#FFFFFF]" />
        <div className="absolute bottom-1 right-1 w-3 h-3 bg-[#00DF81]" />

        {/* Título da Seção */}
        <div className="text-center mb-3">
          <span className="font-arcade text-[11px] text-[#FFDF00] tracking-widest">
            ❖ MODOS DE JOGO ❖
          </span>
        </div>

        {/* Botões do Menu Arcade */}
        <div className="space-y-2.5">
          {/* MODO CLÁSSICO */}
          <button
            onClick={onStartClassic}
            className="w-full group flex items-center justify-between p-3 bg-[#04160E] border-2 border-[#FFDF00] text-[#FFDF00] hover:bg-[#FFDF00] hover:text-black hover:border-black transition-all shadow-arcade active:translate-y-0.5 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="text-base group-hover:translate-x-1 transition-transform text-[#00DF81] group-hover:text-black">
                ▶
              </span>
              <div className="text-left">
                <div className="font-arcade text-xs sm:text-sm font-bold tracking-wider text-white group-hover:text-black">
                  MODO CLÁSSICO
                </div>
                <div className="font-sans text-[11px] text-gray-300 group-hover:text-black font-normal">
                  Adivinhe o craque do dia com pistas de atributos
                </div>
              </div>
            </div>
            <Play
              size={18}
              className="text-[#00DF81] group-hover:text-black fill-current"
            />
          </button>

          {/* GRID DO BRASILEIRÃO */}
          <button
            onClick={onStartGrid}
            className="w-full group flex items-center justify-between p-3 bg-[#04160E] border-2 border-[#FFDF00] text-[#FFDF00] hover:bg-[#FFDF00] hover:text-black hover:border-black transition-all shadow-arcade active:translate-y-0.5 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="text-base group-hover:translate-x-1 transition-transform text-[#00DF81] group-hover:text-black">
                ▶
              </span>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span className="font-arcade text-xs sm:text-sm font-bold tracking-wider text-white group-hover:text-black">
                    GRID DO BRASILEIRÃO
                  </span>
                  <span className="font-arcade text-[8px] px-1.5 py-0.5 bg-[#00DF81] text-black font-bold border border-black">
                    3x3
                  </span>
                </div>
                <div className="font-sans text-[11px] text-gray-300 group-hover:text-black font-normal">
                  Cruze clubes e atributos no Grid 3x3 estilo Futbol11
                </div>
              </div>
            </div>
            <Grid3X3
              size={18}
              className="text-[#00DF81] group-hover:text-black"
            />
          </button>

          {/* QUEM É O ESCUDO? (Em breve) */}
          <div className="w-full flex items-center justify-between p-2.5 bg-[#04160E]/60 border-2 border-dashed border-[#FFDF00]/30 text-gray-400 cursor-not-allowed">
            <div className="flex items-center gap-3">
              <Shield size={16} className="text-gray-400" />
              <div className="text-left">
                <div className="font-arcade text-[11px] tracking-wider text-gray-400">
                  QUEM É O ESCUDO?
                </div>
                <div className="font-sans text-[10px] text-gray-400">
                  Adivinhe o clube pelo brasão estilizado
                </div>
              </div>
            </div>
            <span className="font-arcade text-[8px] px-1.5 py-0.5 bg-black text-gray-400 border border-gray-700">
              EM BREVE
            </span>
          </div>

          {/* FOTO PIXELADA (Em breve) */}
          <div className="w-full flex items-center justify-between p-2.5 bg-[#04160E]/60 border-2 border-dashed border-[#FFDF00]/30 text-gray-400 cursor-not-allowed">
            <div className="flex items-center gap-3">
              <Eye size={16} className="text-gray-400" />
              <div className="text-left">
                <div className="font-arcade text-[11px] tracking-wider text-gray-400">
                  FOTO PIXELADA
                </div>
                <div className="font-sans text-[10px] text-gray-400">
                  Identifique o atleta com blur progressivo
                </div>
              </div>
            </div>
            <span className="font-arcade text-[8px] px-1.5 py-0.5 bg-black text-gray-400 border border-gray-700">
              EM BREVE
            </span>
          </div>
        </div>

        {/* Seção Inferior: SEU STATUS */}
        <div className="mt-4 pt-3 border-t-2 border-[#FFDF00]/40">
          <div className="text-center mb-2">
            <span className="font-arcade text-[9px] text-[#00DF81] tracking-widest">
              ❖ SEU STATUS ❖
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            {/* Slot 1: Streak */}
            <div className="bg-[#04160E] border-2 border-black p-2 shadow-arcade-sm">
              <div className="flex items-center justify-center gap-1 text-orange-400 font-arcade text-[8px] mb-0.5">
                <Flame size={11} /> STREAK
              </div>
              <div className="font-display font-black text-lg sm:text-xl text-[#FFDF00]">
                {stats.currentStreak}
              </div>
            </div>

            {/* Slot 2: Vitórias */}
            <div className="bg-[#04160E] border-2 border-black p-2 shadow-arcade-sm">
              <div className="flex items-center justify-center gap-1 text-[#00DF81] font-arcade text-[8px] mb-0.5">
                <Trophy size={11} /> VITÓRIAS
              </div>
              <div className="font-display font-black text-lg sm:text-xl text-white">
                {stats.gamesWon}
              </div>
            </div>

            {/* Slot 3: Jogos */}
            <div className="bg-[#04160E] border-2 border-black p-2 shadow-arcade-sm">
              <div className="flex items-center justify-center gap-1 text-[#FFDF00] font-arcade text-[8px] mb-0.5">
                <Target size={11} /> JOGOS
              </div>
              <div className="font-display font-black text-lg sm:text-xl text-white">
                {stats.gamesPlayed}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
