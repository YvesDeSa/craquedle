import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import type { GuessResult, MatchStatus } from '../types/player';
import { formatTrophiesSummary } from '../utils/gameLogic';
import { PlayerAvatar } from './PlayerAvatar';

interface GuessTableProps {
  guesses: GuessResult[];
}

function getBgColor(status: MatchStatus): string {
  switch (status) {
    case 'CORRECT':
      return 'bg-[#22C55E] text-white';
    case 'PARTIAL':
      return 'bg-[#EAB308] text-black font-semibold';
    case 'INCORRECT':
    default:
      return 'bg-[#EF4444] text-white';
  }
}

export const GuessTable: React.FC<GuessTableProps> = ({ guesses }) => {
  if (guesses.length === 0) {
    return (
      <div className="w-full text-center py-10 px-4 border-2 border-dashed border-[#6D28D9]/40 rounded my-4">
        <p className="font-arcade text-xs sm:text-sm text-[#38BDF8] tracking-widest animate-pulse">
          ▼ FAÇA SEU PRIMEIRO CHUTE ACIMA ▼
        </p>
        <p className="text-xs text-gray-400 font-sans mt-2">
          Dica: Comece por um jogador experiente para calibrar o time, idade e posição!
        </p>
      </div>
    );
  }

  // Mostra os palpites mais recentes no topo
  const reversedGuesses = [...guesses].reverse();

  return (
    <div className="w-full overflow-x-auto pb-4 my-4">
      <div className="min-w-[640px] flex flex-col gap-3">
        {/* Cabeçalho da Tabela */}
        <div className="grid grid-cols-6 gap-2 text-center font-arcade text-[10px] sm:text-xs text-[#B8FF01] tracking-wider py-1.5 border-b-2 border-[#6D28D9]">
          <div>JOGADOR</div>
          <div>TIME</div>
          <div>IDADE</div>
          <div>POSIÇÃO</div>
          <div>PAÍS</div>
          <div>TÍTULOS</div>
        </div>

        {/* Linhas de Palpites */}
        {reversedGuesses.map((guess, rowIdx) => {
          const isLatest = rowIdx === 0;

          return (
            <div
              key={`${guess.player.id}-${guesses.length - rowIdx}`}
              className="grid grid-cols-6 gap-2"
            >
              {/* 1. Jogador (Foto + Nome) */}
              <div
                style={{ animationDelay: isLatest ? '0ms' : '0ms' }}
                className={`relative flex flex-col items-center justify-center p-2 bg-[#12163A] border-2 border-black shadow-arcade-sm h-24 ${
                  isLatest ? 'animate-flip' : ''
                }`}
              >
                <PlayerAvatar
                  photo={guess.player.photo}
                  name={guess.player.name}
                  className="w-12 h-12 object-cover border border-black shadow"
                />
                <span className="font-display font-bold text-xs text-center text-white truncate w-full mt-1">
                  {guess.player.name}
                </span>
              </div>

              {/* 2. Time */}
              <div
                style={{ animationDelay: isLatest ? '150ms' : '0ms' }}
                className={`relative flex flex-col items-center justify-center p-2 border-2 border-black shadow-arcade-sm h-24 ${getBgColor(
                  guess.teamMatch
                )} ${isLatest ? 'animate-flip' : ''}`}
              >
                {guess.player.teamLogo && (
                  <img
                    src={guess.player.teamLogo}
                    alt={guess.player.team}
                    className="w-8 h-8 object-contain mb-1 drop-shadow"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                )}
                <span className="font-display font-extrabold text-xs sm:text-sm text-center line-clamp-2 px-1">
                  {guess.player.team}
                </span>
              </div>

              {/* 3. Idade (com Seta Arcade) */}
              <div
                style={{ animationDelay: isLatest ? '300ms' : '0ms' }}
                className={`relative flex flex-col items-center justify-center p-2 border-2 border-black shadow-arcade-sm h-24 overflow-hidden ${getBgColor(
                  guess.ageMatch.status
                )} ${isLatest ? 'animate-flip' : ''}`}
              >
                {/* Seta de fundo grande indicando se o segredo é mais velho ou mais novo */}
                {guess.ageMatch.direction === 'HIGHER' && (
                  <ArrowUp
                    size={48}
                    strokeWidth={3}
                    className="absolute opacity-20 pointer-events-none"
                  />
                )}
                {guess.ageMatch.direction === 'LOWER' && (
                  <ArrowDown
                    size={48}
                    strokeWidth={3}
                    className="absolute opacity-20 pointer-events-none"
                  />
                )}

                <span className="font-display font-black text-2xl sm:text-3xl z-10 leading-none">
                  {guess.player.age}
                </span>
                
                {guess.ageMatch.direction !== 'EQUAL' && (
                  <span className="text-[10px] font-arcade font-bold z-10 flex items-center mt-1">
                    {guess.ageMatch.direction === 'HIGHER' ? 'MAIOR ↑' : 'MENOR ↓'}
                  </span>
                )}
              </div>

              {/* 4. Posição */}
              <div
                style={{ animationDelay: isLatest ? '450ms' : '0ms' }}
                className={`flex items-center justify-center p-2 border-2 border-black shadow-arcade-sm h-24 text-center ${getBgColor(
                  guess.positionMatch
                )} ${isLatest ? 'animate-flip' : ''}`}
              >
                <span className="font-display font-bold text-xs sm:text-sm px-1">
                  {guess.player.position}
                </span>
              </div>

              {/* 5. Nacionalidade */}
              <div
                style={{ animationDelay: isLatest ? '600ms' : '0ms' }}
                className={`flex items-center justify-center p-2 border-2 border-black shadow-arcade-sm h-24 text-center ${getBgColor(
                  guess.nationalityMatch
                )} ${isLatest ? 'animate-flip' : ''}`}
              >
                <span className="font-display font-bold text-xs sm:text-sm px-1">
                  {guess.player.nationality}
                </span>
              </div>

              {/* 6. Títulos */}
              <div
                style={{ animationDelay: isLatest ? '750ms' : '0ms' }}
                className={`flex flex-col items-center justify-center p-2 border-2 border-black shadow-arcade-sm h-24 text-center ${getBgColor(
                  guess.trophiesMatch.status
                )} ${isLatest ? 'animate-flip' : ''}`}
              >
                <span className="font-display font-bold text-xs leading-tight">
                  {formatTrophiesSummary(guess.player.trophies)}
                </span>
                <span className="text-[9px] font-arcade mt-1 opacity-75">
                  BR • CdB • LIB
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
