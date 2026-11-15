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
      <div className="relative w-full max-w-md bg-[#0A0B1E] border-4 border-[#6D28D9] p-6 shadow-arcade-lg text-white">
        {/* Cantoneiras Pixel */}
        <div className="absolute top-1 left-1 w-3 h-3 bg-[#B8FF01]" />
        <div className="absolute top-1 right-1 w-3 h-3 bg-[#B8FF01]" />
        <div className="absolute bottom-1 left-1 w-3 h-3 bg-[#B8FF01]" />
        <div className="absolute bottom-1 right-1 w-3 h-3 bg-[#B8FF01]" />

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white p-1 hover:bg-[#15193B] border border-transparent hover:border-black transition-all cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-6">
          <span className="font-arcade text-[10px] text-[#B8FF01] tracking-widest">
            ❖ REGISTRO DO FLIPERAMA ❖
          </span>
          <h2 className="font-display font-black text-2xl sm:text-3xl italic tracking-tight text-white mt-1">
            ESTATÍSTICAS
          </h2>
        </div>

        {/* 4 Blocos de Métricas */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-[#08091A] border-2 border-black p-3 text-center shadow-arcade-sm">
            <div className="flex items-center justify-center gap-1 text-[#38BDF8] text-xs font-arcade mb-1">
              <Target size={14} /> JOGADOS
            </div>
            <div className="font-display font-black text-3xl text-white">
              {stats.gamesPlayed}
            </div>
          </div>

          <div className="bg-[#08091A] border-2 border-black p-3 text-center shadow-arcade-sm">
            <div className="flex items-center justify-center gap-1 text-[#22C55E] text-xs font-arcade mb-1">
              <Trophy size={14} /> VITÓRIAS
            </div>
            <div className="font-display font-black text-3xl text-white">
              {stats.gamesWon} ({winRate}%)
            </div>
          </div>

          <div className="bg-[#08091A] border-2 border-black p-3 text-center shadow-arcade-sm">
            <div className="flex items-center justify-center gap-1 text-orange-400 text-xs font-arcade mb-1">
              <Flame size={14} /> STREAK ATUAL
            </div>
            <div className="font-display font-black text-3xl text-[#B8FF01]">
              {stats.currentStreak}
            </div>
          </div>

          <div className="bg-[#08091A] border-2 border-black p-3 text-center shadow-arcade-sm">
            <div className="flex items-center justify-center gap-1 text-yellow-400 text-xs font-arcade mb-1">
              <Award size={14} /> MELHOR STREAK
            </div>
            <div className="font-display font-black text-3xl text-yellow-400">
              {stats.maxStreak}
            </div>
          </div>
        </div>

        {/* Distribuição de Tentativas */}
        {stats.guessesDistribution && Object.keys(stats.guessesDistribution).length > 0 && (
          <div className="bg-[#08091A] border border-[#6D28D9] p-3 mb-5">
            <div className="font-arcade text-[10px] text-gray-400 mb-2">
              DISTRIBUIÇÃO DE PALPITES:
            </div>
            <div className="space-y-1">
              {Object.entries(stats.guessesDistribution).map(([tries, count]) => (
                <div key={tries} className="flex items-center gap-2 text-xs font-arcade">
                  <span className="w-4 text-right text-gray-400">{tries}</span>
                  <div className="flex-1 bg-[#12163A] h-4 border border-black overflow-hidden flex items-center">
                    <div
                      style={{
                        width: `${Math.max(15, (count / (stats.gamesWon || 1)) * 100)}%`,
                      }}
                      className="bg-[#B8FF01] h-full text-black font-bold text-[9px] flex items-center justify-end px-1"
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
          className="w-full py-2.5 bg-[#15193B] hover:bg-[#B8FF01] text-[#38BDF8] hover:text-black font-arcade text-xs border-2 border-black shadow-arcade-sm transition-all cursor-pointer font-bold"
        >
          FECHAR
        </button>
      </div>
    </div>
  );
};
