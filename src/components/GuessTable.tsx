import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import type { GuessResult, MatchStatus } from '../types/player';
import { getCountryFlagUrl } from '../utils/flags';
import { TournamentPatchGrid } from './TournamentPatch';

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
      <div className="w-full text-center py-6 px-4 border-2 border-dashed border-[#FFDF00]/30 rounded my-2">
        <p className="font-display font-bold text-xs sm:text-sm text-[#FFDF00] tracking-wider animate-pulse uppercase">
          ▼ FAÇA SEU PRIMEIRO CHUTE NO CAMPO ACIMA ▼
        </p>
        <p className="text-[11px] text-gray-300 font-sans mt-1">
          Dica: Comece por um atleta experiente para calibrar clube, idade e posição!
        </p>
      </div>
    );
  }

  // Mais recentes no topo
  const reversedGuesses = [...guesses].reverse();

  return (
    <div className="w-full my-2">
      <div className="min-w-[620px]">
        {/* Cabeçalho da Tabela com Fonte Chakra Petch (suporta acentos perfeitamente) */}
        <div className="grid grid-cols-6 gap-1.5 text-center font-display font-black text-xs text-[#FFDF00] tracking-wider py-1 border-b-2 border-[#FFDF00]/60 uppercase">
          <div>JOGADOR</div>
          <div>TIME</div>
          <div>IDADE</div>
          <div>POSIÇÃO</div>
          <div>PAÍS</div>
          <div>TÍTULOS</div>
        </div>

        {/* Linhas de Palpites com Scroll Interno para Zero Scroll na Janela */}
        <div className="max-h-[36vh] sm:max-h-[40vh] overflow-y-auto pr-1 space-y-1.5 mt-1.5">
          {reversedGuesses.map((guess, rowIdx) => {
            const isLatest = rowIdx === 0;
            const flagUrl = getCountryFlagUrl(guess.player.nationality);

            return (
              <div
                key={`${guess.player.id}-${guesses.length - rowIdx}`}
                className="grid grid-cols-6 gap-1.5"
              >
                {/* 1. Jogador (Foto 100% Full-Bleed + Nome apenas no Hover estilo Narutodle) */}
                <div
                  style={{ animationDelay: isLatest ? '0ms' : '0ms' }}
                  className={`group relative overflow-hidden bg-[#04160E] border-2 border-black shadow-arcade-sm h-16 sm:h-20 ${
                    isLatest ? 'animate-flip' : ''
                  }`}
                >
                  <img
                    src={guess.player.photo}
                    alt={guess.player.name}
                    className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      if (guess.player.teamLogo) {
                        (e.target as HTMLImageElement).src = guess.player.teamLogo;
                        (e.target as HTMLImageElement).className = "w-full h-full object-contain p-2";
                      }
                    }}
                  />

                  {/* Overlay escuro com nome do atleta apenas no Hover */}
                  <div className="absolute inset-0 bg-black/85 flex items-center justify-center p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
                    <span className="font-display font-black text-xs sm:text-sm text-[#FFDF00] text-center leading-tight drop-shadow px-1">
                      {guess.player.name}
                    </span>
                  </div>
                </div>

                {/* 2. Time */}
                <div
                  style={{ animationDelay: isLatest ? '150ms' : '0ms' }}
                  className={`relative flex flex-col items-center justify-center p-1 border-2 border-black shadow-arcade-sm h-16 sm:h-20 ${getBgColor(
                    guess.teamMatch
                  )} ${isLatest ? 'animate-flip' : ''}`}
                >
                  {guess.player.teamLogo && (
                    <img
                      src={guess.player.teamLogo}
                      alt={guess.player.team}
                      className="w-6 h-6 sm:w-7 sm:h-7 object-contain mb-0.5 drop-shadow"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  )}
                  <span className="font-display font-extrabold text-[11px] sm:text-xs text-center line-clamp-1 px-1">
                    {guess.player.team}
                  </span>
                </div>

                {/* 3. Idade (com Seta Arcade) */}
                <div
                  style={{ animationDelay: isLatest ? '300ms' : '0ms' }}
                  className={`relative flex flex-col items-center justify-center p-1 border-2 border-black shadow-arcade-sm h-16 sm:h-20 overflow-hidden ${getBgColor(
                    guess.ageMatch.status
                  )} ${isLatest ? 'animate-flip' : ''}`}
                >
                  {guess.ageMatch.direction === 'HIGHER' && (
                    <ArrowUp
                      size={36}
                      strokeWidth={3}
                      className="absolute opacity-20 pointer-events-none"
                    />
                  )}
                  {guess.ageMatch.direction === 'LOWER' && (
                    <ArrowDown
                      size={36}
                      strokeWidth={3}
                      className="absolute opacity-20 pointer-events-none"
                    />
                  )}

                  <span className="font-display font-black text-xl sm:text-2xl z-10 leading-none">
                    {guess.player.age}
                  </span>

                  {guess.ageMatch.direction !== 'EQUAL' && (
                    <span className="text-[9px] font-display font-extrabold z-10 flex items-center mt-0.5">
                      {guess.ageMatch.direction === 'HIGHER' ? 'MAIOR ↑' : 'MENOR ↓'}
                    </span>
                  )}
                </div>

                {/* 4. Posição */}
                <div
                  style={{ animationDelay: isLatest ? '450ms' : '0ms' }}
                  className={`flex items-center justify-center p-1 border-2 border-black shadow-arcade-sm h-16 sm:h-20 text-center ${getBgColor(
                    guess.positionMatch
                  )} ${isLatest ? 'animate-flip' : ''}`}
                >
                  <span className="font-display font-extrabold text-[11px] sm:text-xs px-1">
                    {guess.player.position}
                  </span>
                </div>

                {/* 5. Nacionalidade (Bandeira + País) */}
                <div
                  style={{ animationDelay: isLatest ? '600ms' : '0ms' }}
                  className={`flex flex-col items-center justify-center p-1 border-2 border-black shadow-arcade-sm h-16 sm:h-20 text-center ${getBgColor(
                    guess.nationalityMatch
                  )} ${isLatest ? 'animate-flip' : ''}`}
                >
                  <img
                    src={flagUrl}
                    alt={guess.player.nationality}
                    className="w-6 sm:w-8 h-4 sm:h-5 object-cover border border-black/50 shadow-sm mb-0.5"
                  />
                  <span className="font-display font-bold text-[10px] sm:text-[11px] truncate w-full px-1">
                    {guess.player.nationality}
                  </span>
                </div>

                {/* 6. Títulos (Patches Oficiais de Camisa Sem Ano no Grid 2x2) */}
                <div
                  style={{ animationDelay: isLatest ? '750ms' : '0ms' }}
                  className={`flex items-center justify-center p-1 border-2 border-black shadow-arcade-sm h-16 sm:h-20 text-center ${getBgColor(
                    guess.trophiesMatch.status
                  )} ${isLatest ? 'animate-flip' : ''}`}
                >
                  <TournamentPatchGrid trophies={guess.player.trophies} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
