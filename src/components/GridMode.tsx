import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, CheckCircle, Search, X, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Player } from '../types/player';
import { normalizeText, recordGamePlayed, updateGameStatsOnWin } from '../utils/gameLogic';
import { PlayerAvatar } from './PlayerAvatar';
import { getClubLogoUrl } from '../utils/clubLogos';
import type { DailyGridMatrix } from '../utils/dailySchedule';
import { loadDateGridProgress, saveDateGridProgress } from '../utils/dailySchedule';

interface GridModeProps {
  players: Player[];
  gridMatrix: DailyGridMatrix;
  activeDate: string;
  onBack?: () => void;
}

/**
 * Função de validação: verifica se o atleta jogou pelo clube especificado,
 * seja como clube atual (team) ou em qualquer passagem de sua carreira profissional (careerTeams ou careerHistory).
 */
const playedForClub = (clubName: string, p: Player): boolean => {
  const normTarget = normalizeText(clubName);

  if (p.team && normalizeText(p.team) === normTarget) return true;

  if (Array.isArray(p.careerTeams)) {
    if (p.careerTeams.some((c) => normalizeText(c) === normTarget || normalizeText(c).includes(normTarget))) {
      return true;
    }
  }

  if (Array.isArray(p.careerHistory)) {
    if (p.careerHistory.some((s) => normalizeText(s.club) === normTarget || normalizeText(s.club).includes(normTarget))) {
      return true;
    }
  }

  return false;
};

interface PendingPlacement {
  player: Player;
  validSlots: { row: number; col: number }[];
}

export const GridMode: React.FC<GridModeProps> = ({
  players,
  gridMatrix,
  activeDate,
  onBack,
}) => {
  const cols = gridMatrix.cols;
  const rows = gridMatrix.rows;

  // Estado do tabuleiro carregado especificamente para a data ativa
  const [gridState, setGridState] = useState<(Player | null)[][]>(() =>
    loadDateGridProgress(activeDate)
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Estado de seleção quando o jogador é elegível para múltiplos quadrados livres
  const [pendingPlacement, setPendingPlacement] = useState<PendingPlacement | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Recarrega o estado quando a data ativa mudar
  useEffect(() => {
    setGridState(loadDateGridProgress(activeDate));
    setSearchTerm('');
    setIsDropdownOpen(false);
    setErrorMessage(null);
    setSuccessMessage(null);
    setPendingPlacement(null);
  }, [activeDate]);

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const usedPlayerIds = gridState.flat().filter(Boolean).map((p) => p!.id);
  const totalFilled = gridState.flat().filter(Boolean).length;
  const isComplete = totalFilled === 9;

  // Filtragem de atletas disponíveis
  const availablePlayers = players.filter((p) => !usedPlayerIds.includes(p.id));

  const filteredCandidates =
    searchTerm.trim().length > 0
      ? availablePlayers
          .filter((p) => {
            const norm = normalizeText(searchTerm);
            const normName = normalizeText(p.name);
            const matchesName = normName.includes(norm) || norm.includes(normName);
            const matchesAlias = p.aliases?.some((a) => {
              const normA = normalizeText(a);
              return normA.includes(norm) || norm.includes(normA);
            });
            return matchesName || matchesAlias;
          })
          .slice(0, 7)
      : [];

  useEffect(() => {
    setSelectedIndex(filteredCandidates.length > 0 ? 0 : -1);
  }, [searchTerm, filteredCandidates.length]);

  const placePlayerInSlot = (player: Player, row: number, col: number) => {
    recordGamePlayed();

    const nextGrid = gridState.map((r, rIdx) =>
      r.map((cell, cIdx) => (rIdx === row && cIdx === col ? player : cell))
    );
    setGridState(nextGrid);
    saveDateGridProgress(activeDate, nextGrid);
    setPendingPlacement(null);
    setSearchTerm('');
    setIsDropdownOpen(false);
    setErrorMessage(null);

    const filledCount = nextGrid.flat().filter(Boolean).length;
    if (filledCount === 9) {
      updateGameStatsOnWin(1);
      confetti({
        particleCount: 160,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#FFDF00', '#00DF81', '#FFFFFF'],
      });
    }
  };

  const handleSelectCandidate = (player: Player) => {
    // Encontra todos os quadrados livres em que o atleta é válido
    const matchingSlots: { row: number; col: number }[] = [];

    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (gridState[r][c] === null) {
          const rowClub = rows[r]!.label;
          const colClub = cols[c]!.label;
          if (playedForClub(rowClub, player) && playedForClub(colClub, player)) {
            matchingSlots.push({ row: r, col: c });
          }
        }
      }
    }

    if (matchingSlots.length === 0) {
      setErrorMessage(`Incorreto! ${player.name} não jogou em nenhuma das combinações livres do tabuleiro.`);
      setSuccessMessage(null);
      setSearchTerm('');
      setIsDropdownOpen(false);
      setPendingPlacement(null);
      return;
    }

    if (matchingSlots.length === 1) {
      // Exatamente 1 lugar válido: posiciona diretamente
      const slot = matchingSlots[0];
      placePlayerInSlot(player, slot.row, slot.col);
      setSuccessMessage(`★ ${player.name} posicionado em ${cols[slot.col].label} ✕ ${rows[slot.row].label}!`);
      return;
    }

    // Mais de 1 lugar válido: destaca os cards para o usuário escolher clicando!
    setPendingPlacement({ player, validSlots: matchingSlots });
    setErrorMessage(null);
    setSuccessMessage(`★ ${player.name} jogou em ${matchingSlots.length} cruzamentos! Clique no quadrado destacado onde deseja colocá-lo:`);
    setSearchTerm('');
    setIsDropdownOpen(false);
  };

  const handleCellClick = (rIdx: number, cIdx: number) => {
    // Se a célula já está preenchida, não faz nada
    if (gridState[rIdx][cIdx] !== null) return;

    // Se há jogador aguardando escolha de card
    if (pendingPlacement) {
      const isMatch = pendingPlacement.validSlots.some(
        (s) => s.row === rIdx && s.col === cIdx
      );
      if (isMatch) {
        placePlayerInSlot(pendingPlacement.player, rIdx, cIdx);
        setSuccessMessage(`★ ${pendingPlacement.player.name} posicionado em ${cols[cIdx].label} ✕ ${rows[rIdx].label}!`);
      } else {
        setErrorMessage(`${pendingPlacement.player.name} não jogou em ${cols[cIdx].label} ✕ ${rows[rIdx].label}. Escolha um dos quadrados destacados!`);
      }
      return;
    }

    // Se não há jogador selecionado, foca o campo de busca
    searchInputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isComplete || filteredCandidates.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIsDropdownOpen(true);
      setSelectedIndex((prev) => (prev < filteredCandidates.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setIsDropdownOpen(true);
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredCandidates.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (isDropdownOpen && selectedIndex >= 0 && selectedIndex < filteredCandidates.length) {
        handleSelectCandidate(filteredCandidates[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsDropdownOpen(false);
      setPendingPlacement(null);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-2 sm:px-4 py-1 flex flex-col items-center my-auto max-h-[calc(100vh-76px)] overflow-hidden">
      {/* Barra de Título Compacta com Botão Voltar */}
      <div className="flex items-center justify-between w-full mb-1">
        {onBack ? (
          <button
            onClick={onBack}
            className="flex items-center gap-1 px-2 py-1 bg-[#04160E] border border-[#FFDF00] text-[#FFDF00] hover:bg-[#FFDF00] hover:text-black font-arcade text-[10px] transition-all cursor-pointer"
          >
            <ArrowLeft size={12} /> MENU
          </button>
        ) : <div />}

        <div className="text-center">
          <span className="font-arcade text-[10px] text-[#00DF81] tracking-widest uppercase">
            ❖ GRID DO BRASILEIRÃO ❖
          </span>
        </div>

        <div className="font-arcade text-[10px] text-gray-400">
          DATA: <span className="text-[#FFDF00]">{activeDate}</span>
        </div>
      </div>

      {/* Placar de Progresso */}
      <div className="flex items-center justify-between w-full bg-[#04160E] border-2 border-[#FFDF00] px-3 py-1 mb-1 shadow-arcade-sm">
        <div className="font-display font-black text-xs text-[#00DF81]">
          ACERTOS: <span className="text-[#FFDF00] text-sm">{totalFilled}/9</span>
        </div>
        {isComplete ? (
          <div className="font-display font-black text-xs text-[#22C55E] flex items-center gap-1">
            <CheckCircle size={15} /> TABULEIRO COMPLETO!
          </div>
        ) : pendingPlacement ? (
          <div className="font-display font-black text-[11px] text-[#FFDF00] animate-pulse flex items-center gap-1">
            CLIQUE NO QUADRADO DESEJADO
          </div>
        ) : (
          <div className="font-display text-[10px] sm:text-[11px] text-gray-300 uppercase">
            Busque o jogador direto no campo abaixo
          </div>
        )}
      </div>

      {/* Banner de Escolha de Posição (quando jogador é válido em > 1 quadrado) */}
      {pendingPlacement ? (
        <div className="w-full mb-1.5 p-1.5 sm:p-2 bg-[#FFDF00]/20 border-2 border-[#FFDF00] flex items-center justify-between shadow-arcade animate-fadeIn">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-9 aspect-[3/4] overflow-hidden bg-[#062c1a] border border-[#FFDF00] flex-shrink-0">
              <PlayerAvatar
                id={pendingPlacement.player.id}
                photo={pendingPlacement.player.photo}
                name={pendingPlacement.player.name}
                className="w-full h-full border-0"
              />
            </div>
            <div className="min-w-0">
              <div className="font-display font-black text-xs text-[#FFDF00] truncate">
                {pendingPlacement.player.name}
              </div>
              <div className="font-arcade text-[9px] text-white">
                Válido em {pendingPlacement.validSlots.length} quadrados! Clique no que preferir:
              </div>
            </div>
          </div>
          <button
            onClick={() => setPendingPlacement(null)}
            className="flex items-center gap-1 px-2 py-1 bg-black/80 hover:bg-black text-white hover:text-[#EF4444] border border-white/40 text-[9px] font-arcade cursor-pointer"
          >
            <X size={12} /> CANCELAR
          </button>
        </div>
      ) : (
        /* Campo de Busca Global Direto no Tabuleiro */
        <div ref={containerRef} className="relative w-full mb-1.5 z-40">
          <div className="relative flex items-center">
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              disabled={isComplete}
              placeholder={
                isComplete
                  ? 'PARABÉNS! VOCÊ COMPLETOU TODO O GRID!'
                  : 'DIGITE O NOME DO JOGADOR (SEM ESCOLHER QUADRADO ANTES)...'
              }
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsDropdownOpen(true);
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              onFocus={() => {
                if (searchTerm.trim().length > 0) setIsDropdownOpen(true);
              }}
              onKeyDown={handleKeyDown}
              className={`w-full bg-[#04160E] text-white border-2 border-[#FFDF00] focus:border-[#00DF81] focus:ring-0 px-3 py-1.5 pl-8 font-display text-xs tracking-wide uppercase placeholder:text-gray-400 placeholder:normal-case transition-all shadow-arcade outline-none ${
                isComplete ? 'opacity-60 cursor-not-allowed border-green-500 text-green-400' : ''
              }`}
            />
            <div className="absolute left-2.5 text-[#FFDF00] pointer-events-none">
              <Search size={14} strokeWidth={2.5} />
            </div>

            {searchTerm.length > 0 && !isComplete && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setIsDropdownOpen(false);
                }}
                className="absolute right-2 text-[9px] font-arcade text-gray-300 hover:text-[#FFDF00] px-1 py-0.5 bg-black/60 border border-black cursor-pointer"
              >
                ESC
              </button>
            )}
          </div>

          {/* Mensagens de Feedback Rápido */}
          {errorMessage && (
            <div className="mt-1 p-1 bg-[#EF4444]/20 border border-[#EF4444] text-[#EF4444] text-[10px] font-sans text-center flex items-center justify-center gap-1 animate-fadeIn">
              <AlertCircle size={12} /> {errorMessage}
            </div>
          )}
          {successMessage && !pendingPlacement && (
            <div className="mt-1 p-1 bg-[#22C55E]/20 border border-[#22C55E] text-[#22C55E] text-[10px] font-sans text-center flex items-center justify-center gap-1 animate-fadeIn">
              <CheckCircle size={12} /> {successMessage}
            </div>
          )}

          {/* Dropdown de Sugestões: Apenas Foto + Nome (sem time nem nacionalidade para dificultar) */}
          {isDropdownOpen && !isComplete && filteredCandidates.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-[#061A12] border-2 border-[#FFDF00] shadow-arcade-lg max-h-52 overflow-y-auto z-50 divide-y divide-[#0A2E1C]">
              <ul ref={listRef} className="divide-y divide-[#0A2E1C]">
                {filteredCandidates.map((cand, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <li
                      key={cand.id}
                      onClick={() => handleSelectCandidate(cand)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex items-center justify-between px-3 py-1.5 cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-[#FFDF00] text-black font-semibold'
                          : 'text-white hover:bg-[#0A2619]'
                      }`}
                    >
                      {/* Apenas Foto e Nome */}
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="h-9 w-7 min-w-[28px] max-w-[28px] flex-shrink-0 aspect-[3/4] overflow-hidden bg-[#062c1a] border border-[#FFDF00] flex items-center justify-center shadow-sm">
                          <PlayerAvatar
                            id={cand.id}
                            photo={cand.photo}
                            name={cand.name}
                            className="w-full h-full border-0"
                          />
                        </div>
                        <span className="font-display font-black text-xs leading-tight truncate">
                          {cand.name}
                        </span>
                      </div>

                      <span
                        className={`font-arcade text-[9px] ${
                          isSelected ? 'text-black' : 'text-[#00DF81]'
                        }`}
                      >
                        CHUTAR ➔
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {isDropdownOpen && searchTerm.trim().length > 0 && filteredCandidates.length === 0 && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-[#061A12] border-2 border-[#FFDF00] p-2 text-center text-[10px] font-sans text-gray-400 z-50">
              Nenhum jogador encontrado com "{searchTerm}".
            </div>
          )}
        </div>
      )}

      {/* Tabuleiro Grid 3x3 */}
      <div className="relative w-full bg-[#061A12] border-4 border-[#FFDF00] p-2 sm:p-2.5 shadow-arcade-lg">
        {/* Cantoneiras Pixel */}
        <div className="absolute top-1 left-1 w-3 h-3 bg-[#00DF81]" />
        <div className="absolute top-1 right-1 w-3 h-3 bg-[#FFFFFF]" />
        <div className="absolute bottom-1 left-1 w-3 h-3 bg-[#FFFFFF]" />
        <div className="absolute bottom-1 right-1 w-3 h-3 bg-[#00DF81]" />

        <div className="grid grid-cols-4 gap-1 sm:gap-1.5">
          {/* Célula Vazia Topo Esquerdo */}
          <div className="flex items-center justify-center p-1 bg-[#04160E] border-2 border-black text-[#FFDF00] font-arcade text-[9px] text-center">
            CLUBES
          </div>

          {/* Cabeçalhos das 3 Colunas */}
          {cols.map((col) => {
            const logoUrl = getClubLogoUrl(col.label) || col.logo;
            return (
              <div
                key={col.id}
                className="flex flex-col items-center justify-center p-1 bg-[#0A2619] border-2 border-black shadow-arcade-sm text-center min-h-[52px] sm:min-h-[60px]"
              >
                {logoUrl && (
                  <img
                    src={logoUrl}
                    alt={col.label}
                    referrerPolicy="no-referrer"
                    className="w-6 h-6 sm:w-7 sm:h-7 object-contain mb-0.5 drop-shadow"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                )}
                <span className="font-display font-black text-[11px] sm:text-xs text-white truncate max-w-full">
                  {col.label}
                </span>
              </div>
            );
          })}

          {/* Linhas e Células */}
          {rows.map((row, rIdx) => {
            const rowLogoUrl = getClubLogoUrl(row.label) || row.logo;
            return (
              <React.Fragment key={row.id}>
                {/* Cabeçalho da Linha */}
                <div className="flex flex-col items-center justify-center p-1 bg-[#0A2619] border-2 border-black shadow-arcade-sm text-center min-h-[70px] sm:min-h-[85px]">
                  {rowLogoUrl && (
                    <img
                      src={rowLogoUrl}
                      alt={row.label}
                      referrerPolicy="no-referrer"
                      className="w-6 h-6 sm:w-7 sm:h-7 object-contain mb-0.5 drop-shadow"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  )}
                  <span className="font-display font-black text-[11px] sm:text-xs text-[#FFDF00] truncate max-w-full">
                    {row.label}
                  </span>
                </div>

                {/* 3 Células da Linha */}
                {cols.map((_, cIdx) => {
                  const player = gridState[rIdx] ? gridState[rIdx][cIdx] : null;

                  // Verifica se esta célula é uma das opções válidas para o jogador pendente
                  const isHighlightedOption =
                    pendingPlacement !== null &&
                    player === null &&
                    pendingPlacement.validSlots.some(
                      (s) => s.row === rIdx && s.col === cIdx
                    );

                  const isNonOptionDuringChoice =
                    pendingPlacement !== null && player === null && !isHighlightedOption;

                  return (
                    <button
                      key={`${rIdx}-${cIdx}`}
                      onClick={() => handleCellClick(rIdx, cIdx)}
                      disabled={player !== null || isNonOptionDuringChoice}
                      className={`relative flex flex-col items-center justify-center p-1 border-2 transition-all min-h-[70px] sm:min-h-[85px] ${
                        player
                          ? 'bg-[#22C55E]/90 border-black cursor-default'
                          : isHighlightedOption
                          ? 'bg-[#FFDF00]/25 border-[#FFDF00] shadow-[0_0_14px_rgba(255,223,0,0.6)] animate-pulse ring-2 ring-[#FFDF00] cursor-pointer hover:bg-[#FFDF00]/40 active:scale-95'
                          : isNonOptionDuringChoice
                          ? 'bg-[#04160E]/50 border-black/40 opacity-40 cursor-not-allowed'
                          : 'bg-[#04160E] border-black hover:bg-[#0A2619] hover:border-[#FFDF00] cursor-pointer active:translate-y-0.5'
                      }`}
                    >
                      {player ? (
                        <>
                          <div className="w-8 h-11 sm:w-10 sm:h-14 flex-shrink-0 aspect-[3/4] overflow-hidden bg-[#062c1a] border border-black shadow flex items-center justify-center mb-0.5">
                            <PlayerAvatar
                              id={player.id}
                              photo={player.photo}
                              name={player.name}
                              className="w-full h-full border-0"
                            />
                          </div>
                          <span className="font-display font-bold text-[9px] sm:text-[10px] text-black text-center truncate w-full px-0.5 leading-tight">
                            {player.name}
                          </span>
                        </>
                      ) : isHighlightedOption ? (
                        <div className="flex flex-col items-center justify-center gap-1">
                          <span className="font-arcade text-[9px] sm:text-[10px] text-black bg-[#FFDF00] px-1 py-0.5 font-bold shadow animate-bounce">
                            ESCOLHA
                          </span>
                          <span className="font-arcade text-[10px] sm:text-xs text-[#FFDF00]">
                            CLIQUE ➔
                          </span>
                        </div>
                      ) : (
                        <span className="font-arcade text-lg sm:text-2xl text-[#00DF81]/60 group-hover:text-[#FFDF00]">
                          ?
                        </span>
                      )}
                    </button>
                  );
                })}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
