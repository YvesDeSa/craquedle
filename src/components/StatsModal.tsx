import React from 'react';
import { X, Award, Flame, Target, Trophy } from 'lucide-react';
import type { GameStats } from '../types/player';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: GameStats;
}

export const StatsModal: React.FC<StatsModalProps> = ({
  isOpen,
  onClose,
  stats,
}) => {
  if (!isOpen) return null;

  const winRate =
    stats.gamesPlayed > 0
      ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100)
      : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-[#061A12] border-4 border-[#FFDF00] p-5 shadow-arcade-lg text-white">
        {/* Cantoneiras Pixel */}
        <div className="absolute top-1 left-1 w-3 h-3 bg-[#00DF81]" />
        <div className="absolute top-1 right-1 w-3 h-3 bg-[#FFFFFF]" />
        <div className="absolute bottom-1 left-1 w-3 h-3 bg-[#FFFFFF]" />
        <div className="absolute bottom-1 right-1 w-3 h-3 bg-[#00DF81]" />

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white p-1 hover:bg-[#0A2619] border border-transparent hover:border-black transition-all cursor-pointer"
        >
          <X size={18} />
        </button>

        <div className="text-center mb-4">
          <span className="font-arcade text-[10px] text-[#00DF81] tracking-widest">
            ❖ REGISTRO DO FLIPERAMA ❖
          </span>
          <h2 className="font-display font-black text-2xl italic tracking-tight text-white mt-0.5">
            ESTATÍSTICAS DO CRAQUE
          </h2>
        </div>

        {/* 4 Blocos de Métricas */}
        <div className="grid grid-cols-2 gap-2.5 mb-4">
          <div className="bg-[#04160E] border-2 border-black p-2.5 text-center shadow-arcade-sm">
            <div className="flex items-center justify-center gap-1 text-[#FFDF00] text-xs font-display font-bold mb-0.5">
              <Target size={13} /> JOGADOS
            </div>
            <div className="font-display font-black text-2xl text-white">
              {stats.gamesPlayed}
            </div>
          </div>

          <div className="bg-[#04160E] border-2 border-black p-2.5 text-center shadow-arcade-sm">
            <div className="flex items-center justify-center gap-1 text-[#00DF81] text-xs font-display font-bold mb-0.5">
              <Trophy size={13} /> VITÓRIAS
            </div>
            <div className="font-display font-black text-2xl text-white">
              {stats.gamesWon} ({winRate}%)
            </div>
          </div>

          <div className="bg-[#04160E] border-2 border-black p-2.5 text-center shadow-arcade-sm">
            <div className="flex items-center justify-center gap-1 text-orange-400 text-xs font-display font-bold mb-0.5">
              <Flame size={13} /> STREAK ATUAL
            </div>
            <div className="font-display font-black text-2xl text-[#FFDF00]">
              {stats.currentStreak}
            </div>
          </div>

          <div className="bg-[#04160E] border-2 border-black p-2.5 text-center shadow-arcade-sm">
            <div className="flex items-center justify-center gap-1 text-yellow-300 text-xs font-display font-bold mb-0.5">
              <Award size={13} /> MELHOR STREAK
            </div>
            <div className="font-display font-black text-2xl text-yellow-300">
              {stats.maxStreak}
            </div>
          </div>
        </div>

        {/* Distribuição de Tentativas */}
        {stats.guessesDistribution && Object.keys(stats.guessesDistribution).length > 0 && (
          <div className="bg-[#04160E] border border-[#FFDF00]/40 p-2.5 mb-4">
            <div className="font-display font-bold text-[11px] text-gray-300 mb-1.5 uppercase">
              DISTRIBUIÇÃO DE PALPITES:
            </div>
            <div className="space-y-1">
              {Object.entries(stats.guessesDistribution).map(([tries, count]) => (
                <div key={tries} className="flex items-center gap-2 text-xs font-display">
                  <span className="w-3 text-right text-gray-400">{tries}</span>
                  <div className="flex-1 bg-[#0A2619] h-3.5 border border-black overflow-hidden flex items-center">
                    <div
                      style={{
                        width: `${Math.max(15, (count / (stats.gamesWon || 1)) * 100)}%`,
                      }}
                      className="bg-[#00DF81] h-full text-black font-black text-[9px] flex items-center justify-end px-1"
                    >
                      {count}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-2 bg-[#04160E] hover:bg-[#FFDF00] text-[#FFDF00] hover:text-black font-display font-black text-xs border-2 border-black shadow-arcade-sm transition-all cursor-pointer"
        >
          FECHAR
        </button>
      </div>
    </div>
  );
};
