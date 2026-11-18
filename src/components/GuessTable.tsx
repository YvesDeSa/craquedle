import React, { useRef, useEffect } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import type { GuessResult, MatchStatus } from '../types/player';
import { getCountryFlagUrl } from '../utils/flags';
import { TournamentPatchGrid } from './TournamentPatch';
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
  const scrollRef = useRef<HTMLDivElement>(null);

  // Mantém o topo do scroll perfeitamente alinhado a cada novo palpite
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [guesses.length]);

  if (guesses.length === 0) {
    return (
      <div className="w-full text-center py-6 px-4 border-2 border-dashed border-[#FFDF00]/30 rounded my-2">
        <p className="font-display font-bold text-xs sm:text-sm text-[#FFDF00] tracking-wider animate-pulse uppercase">
          ▼ FAÇA SEU PRIMEIRO CHUTE NO CAMPO ACIMA ▼
        </p>
        <p className="text-[11px] text-gray-300 font-sans mt-1">
          Dica: Comece por um atleta experiente para calibrar clube, idade, altura e posição!
        </p>
      </div>
    );
  }

  // Mais recentes no topo
  const reversedGuesses = [...guesses].reverse();

  return (
    <div className="w-full my-2">
      <div className="min-w-[680px]">
        {/* Cabeçalho com 8 colunas: JOGADOR (proporção 3:4 portrait) + 7 colunas perfeitamente idênticas */}
        <div className="grid grid-cols-[48px_repeat(7,minmax(0,1fr))] sm:grid-cols-[60px_repeat(7,minmax(0,1fr))] gap-1 sm:gap-1.5 text-center font-display font-black text-[10px] sm:text-xs text-[#FFDF00] tracking-wider py-1 border-b-2 border-[#FFDF00]/60 uppercase">
          <div className="min-w-0 truncate">JOGADOR</div>
          <div className="min-w-0 truncate">TIME</div>
          <div className="min-w-0 truncate">IDADE</div>
          <div className="min-w-0 truncate">ALTURA</div>
          <div className="min-w-0 truncate">POSIÇÃO</div>
          <div className="min-w-0 truncate">PÉ</div>
          <div className="min-w-0 truncate">PAÍS</div>
          <div className="min-w-0 truncate">TÍTULOS</div>
        </div>

        {/* Linhas de Palpites com Scroll Interno para Zero Scroll na Janela */}
        <div
          ref={scrollRef}
          className="max-h-[46vh] sm:max-h-[50vh] overflow-y-auto pr-1 space-y-1.5 mt-1.5"
        >
          {reversedGuesses.map((guess, rowIdx) => {
            const isLatest = rowIdx === 0;
            const flagUrl = getCountryFlagUrl(guess.player.nationality);

            return (
              <div
                key={`${guess.player.id}-${guesses.length - rowIdx}`}
                className="grid grid-cols-[48px_repeat(7,minmax(0,1fr))] sm:grid-cols-[60px_repeat(7,minmax(0,1fr))] gap-1 sm:gap-1.5"
              >
                {/* 1. Jogador (Coluna com Largura Sob Medida 3:4 - Sem Cortes, Sem Zoom e Sem Faixas Laterais) */}
                <div
                  style={{ animationDelay: isLatest ? '0ms' : '0ms' }}
                  className={`group relative overflow-hidden bg-[#062c1a] border-2 border-black shadow-arcade-sm h-16 sm:h-20 w-full min-w-0 flex items-center justify-center ${
                    isLatest ? 'animate-flip' : ''
                  }`}
                >
                  <PlayerAvatar
                    id={guess.player.id}
                    photo={guess.player.photo}
                    name={guess.player.name}
                    className="w-full h-full border-0"
                  />

                  {/* Overlay escuro com nome do atleta apenas no Hover */}
                  <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
                    <span className="font-display font-black text-[10px] sm:text-xs text-[#FFDF00] text-center leading-tight drop-shadow px-0.5">
                      {guess.player.name}
                    </span>
                  </div>
                </div>

                {/* 2. Time */}
                <div
                  style={{ animationDelay: isLatest ? '100ms' : '0ms' }}
                  className={`relative flex flex-col items-center justify-center p-1 border-2 border-black shadow-arcade-sm h-16 sm:h-20 w-full min-w-0 overflow-hidden ${getBgColor(
                    guess.teamMatch
                  )} ${isLatest ? 'animate-flip' : ''}`}
                >
                  {guess.player.teamLogo && (
                    <img
                      src={guess.player.teamLogo}
                      alt={guess.player.team}
                      referrerPolicy="no-referrer"
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

                {/* 3. Idade (com Seta Arcade e Cor Estrita) */}
                <div
                  style={{ animationDelay: isLatest ? '200ms' : '0ms' }}
                  className={`relative flex flex-col items-center justify-center p-1 border-2 border-black shadow-arcade-sm h-16 sm:h-20 w-full min-w-0 overflow-hidden ${getBgColor(
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

                {/* 4. Altura (com Seta Arcade e Cor Estrita) */}
                <div
                  style={{ animationDelay: isLatest ? '300ms' : '0ms' }}
                  className={`relative flex flex-col items-center justify-center p-1 border-2 border-black shadow-arcade-sm h-16 sm:h-20 w-full min-w-0 overflow-hidden ${getBgColor(
                    guess.alturaMatch.status
                  )} ${isLatest ? 'animate-flip' : ''}`}
                >
                  {guess.alturaMatch.direction === 'HIGHER' && (
                    <ArrowUp
                      size={36}
                      strokeWidth={3}
                      className="absolute opacity-20 pointer-events-none"
                    />
                  )}
                  {guess.alturaMatch.direction === 'LOWER' && (
                    <ArrowDown
                      size={36}
                      strokeWidth={3}
                      className="absolute opacity-20 pointer-events-none"
                    />
                  )}

                  <span className="font-display font-black text-sm sm:text-base z-10 leading-none">
                    {guess.player.altura || '-'}
                  </span>

                  {guess.alturaMatch.direction !== 'EQUAL' && (
                    <span className="text-[9px] font-display font-extrabold z-10 flex items-center mt-0.5">
                      {guess.alturaMatch.direction === 'HIGHER' ? 'MAIOR ↑' : 'MENOR ↓'}
                    </span>
                  )}
                </div>

                {/* 5. Posição */}
                <div
                  style={{ animationDelay: isLatest ? '400ms' : '0ms' }}
                  className={`flex flex-col items-center justify-center p-1 border-2 border-black shadow-arcade-sm h-16 sm:h-20 w-full min-w-0 overflow-hidden text-center ${getBgColor(
                    guess.positionMatch
                  )} ${isLatest ? 'animate-flip' : ''}`}
                >
                  <span className="font-display font-extrabold text-[11px] sm:text-xs px-1">
                    {guess.player.position}
                  </span>
                </div>

                {/* 6. Pé Dominante (Coluna Própria) */}
                <div
                  style={{ animationDelay: isLatest ? '500ms' : '0ms' }}
                  className={`flex flex-col items-center justify-center p-1 border-2 border-black shadow-arcade-sm h-16 sm:h-20 w-full min-w-0 overflow-hidden text-center ${getBgColor(
                    guess.peMatch
                  )} ${isLatest ? 'animate-flip' : ''}`}
                >
                  <span className="font-display font-extrabold text-[11px] sm:text-xs px-1">
                    {guess.player.pe_dominante || '-'}
                  </span>
                </div>

                {/* 7. Nacionalidade (Bandeira + País) */}
                <div
                  style={{ animationDelay: isLatest ? '600ms' : '0ms' }}
                  className={`flex flex-col items-center justify-center p-1 border-2 border-black shadow-arcade-sm h-16 sm:h-20 w-full min-w-0 overflow-hidden text-center ${getBgColor(
                    guess.nationalityMatch
                  )} ${isLatest ? 'animate-flip' : ''}`}
                >
                  <img
                    src={flagUrl}
                    alt={guess.player.nationality}
                    referrerPolicy="no-referrer"
                    className="w-6 h-4 sm:w-7 sm:h-4.5 object-cover mb-1 border border-black/40 shadow-sm"
                  />
                  <span className="font-display font-extrabold text-[10px] sm:text-[11px] text-center line-clamp-1 px-1">
                    {guess.player.nationality}
                  </span>
                </div>

                {/* 8. Títulos (Logos Oficiais Transparentes 2x2 sem Ano) */}
                <div
                  style={{ animationDelay: isLatest ? '700ms' : '0ms' }}
                  className={`flex items-center justify-center p-1 border-2 border-black shadow-arcade-sm h-16 sm:h-20 w-full min-w-0 overflow-hidden ${getBgColor(
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
