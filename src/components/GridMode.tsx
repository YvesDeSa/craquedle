import React, { useState } from 'react';
import { CheckCircle, Search, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Player } from '../types/player';
import { normalizeText } from '../utils/gameLogic';
import { getCountryFlagUrl } from '../utils/flags';
import { PlayerAvatar } from './PlayerAvatar';

interface GridCriterion {
  id: string;
  label: string;
  type: 'team' | 'trait';
  logo?: string;
  check: (player: Player) => boolean;
}

interface GridModeProps {
  players: Player[];
  onBack?: () => void;
}

export const GridMode: React.FC<GridModeProps> = ({ players }) => {
  const cols: GridCriterion[] = [
    {
      id: 'flamengo',
      label: 'Flamengo',
      type: 'team',
      logo: 'https://media.api-sports.io/football/teams/127.png',
      check: (p) =>
        p.team === 'Flamengo' ||
        (p.careerTeams && p.careerTeams.includes('Flamengo')) ||
        false,
    },
    {
      id: 'palmeiras',
      label: 'Palmeiras',
      type: 'team',
      logo: 'https://media.api-sports.io/football/teams/121.png',
      check: (p) =>
        p.team === 'Palmeiras' ||
        (p.careerTeams && p.careerTeams.includes('Palmeiras')) ||
        false,
    },
    {
      id: 'corinthians',
      label: 'Corinthians',
      type: 'team',
      logo: 'https://media.api-sports.io/football/teams/131.png',
      check: (p) =>
        p.team === 'Corinthians' ||
        (p.careerTeams && p.careerTeams.includes('Corinthians')) ||
        false,
    },
  ];

  const rows: GridCriterion[] = [
    {
      id: 'libertadores',
      label: 'Libertadores 🏆',
      type: 'trait',
      check: (p) => p.trophies.libertadores === true,
    },
    {
      id: 'atacante',
      label: 'Atacante ⚡',
      type: 'trait',
      check: (p) => p.position === 'Atacante',
    },
    {
      id: 'brasil',
      label: 'Brasil 🇧🇷',
      type: 'trait',
      check: (p) => p.nationality === 'Brasil',
    },
  ];

  const [gridState, setGridState] = useState<(Player | null)[][]>([
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ]);

  const [activeCell, setActiveCell] = useState<{ row: number; col: number } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const usedPlayerIds = gridState.flat().filter(Boolean).map((p) => p!.id);
  const totalFilled = gridState.flat().filter(Boolean).length;
  const isComplete = totalFilled === 9;

  const handleOpenCell = (row: number, col: number) => {
    if (gridState[row][col] !== null) return;
    setActiveCell({ row, col });
    setSearchTerm('');
    setErrorMessage(null);
  };

  const handleSelectPlayer = (player: Player) => {
    if (!activeCell) return;
    const { row, col } = activeCell;

    const rowCriterion = rows[row];
    const colCriterion = cols[col];

    const matchRow = rowCriterion.check(player);
    const matchCol = colCriterion.check(player);

    if (matchRow && matchCol) {
      const nextGrid = gridState.map((r, rIdx) =>
        r.map((cell, cIdx) => (rIdx === row && cIdx === col ? player : cell))
      );
      setGridState(nextGrid);
      setActiveCell(null);
      setSearchTerm('');
      setErrorMessage(null);

      if (nextGrid.flat().filter(Boolean).length === 9) {
        confetti({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.5 },
          colors: ['#FFDF00', '#00DF81', '#FFFFFF'],
        });
      }
    } else {
      setErrorMessage(
        `Incorreto! ${player.name} não cumpre ambos os critérios (${colCriterion.label} + ${rowCriterion.label}).`
      );
    }
  };

  const availablePlayers = players.filter((p) => !usedPlayerIds.includes(p.id));
  const filteredCandidates =
    searchTerm.trim().length > 0
      ? availablePlayers.filter((p) => {
          const norm = normalizeText(searchTerm);
          return (
            normalizeText(p.name).includes(norm) ||
            normalizeText(p.team).includes(norm)
          );
        })
      : [];

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-2 flex flex-col items-center my-auto">
      {/* Top Banner */}
      <div className="text-center mb-2">
        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#04160E] border border-[#FFDF00] text-[#00DF81] font-arcade text-[10px]">
          ❖ TABULEIRO 3x3 ❖
        </div>
        <h2 className="font-display font-black text-2xl sm:text-3xl text-white italic tracking-tight">
          GRID DO BRASILEIRÃO
        </h2>
        <p className="text-[11px] text-gray-300 font-sans">
          Cruze os clubes das colunas com os atributos das linhas!
        </p>
      </div>

      {/* Placar de Progresso */}
      <div className="flex items-center justify-between w-full bg-[#04160E] border-2 border-[#FFDF00] px-3 py-1.5 mb-2 shadow-arcade-sm">
        <div className="font-display font-black text-xs text-[#00DF81]">
          ACERTOS: <span className="text-[#FFDF00] text-sm">{totalFilled}/9</span>
        </div>
        {isComplete ? (
          <div className="font-display font-black text-xs text-[#22C55E] flex items-center gap-1">
            <CheckCircle size={15} /> TABULEIRO COMPLETO!
          </div>
        ) : (
          <div className="font-display text-[11px] text-gray-300 uppercase">
            Clique no quadrado para chutar
          </div>
        )}
      </div>

      {/* Tabuleiro Grid 3x3 */}
      <div className="relative w-full bg-[#061A12] border-4 border-[#FFDF00] p-3 sm:p-4 shadow-arcade-lg">
        {/* Cantoneiras Pixel */}
        <div className="absolute top-1 left-1 w-3 h-3 bg-[#00DF81]" />
        <div className="absolute top-1 right-1 w-3 h-3 bg-[#FFFFFF]" />
        <div className="absolute bottom-1 left-1 w-3 h-3 bg-[#FFFFFF]" />
        <div className="absolute bottom-1 right-1 w-3 h-3 bg-[#00DF81]" />

        <div className="grid grid-cols-4 gap-1.5">
          {/* Célula Vazia Topo Esquerdo */}
          <div className="flex items-center justify-center p-1 bg-[#04160E] border-2 border-black text-[#FFDF00] font-arcade text-[9px] text-center">
            GRID 3x3
          </div>

          {/* Cabeçalhos das Colunas */}
          {cols.map((col) => (
            <div
              key={col.id}
              className="flex flex-col items-center justify-center p-1 bg-[#0A2619] border-2 border-black shadow-arcade-sm text-center min-h-[55px]"
            >
              {col.logo && (
                <img
                  src={col.logo}
                  alt={col.label}
                  className="w-5 h-5 object-contain mb-0.5"
                />
              )}
              <span className="font-display font-black text-xs text-white">
                {col.label}
              </span>
            </div>
          ))}

          {/* Linhas e Células */}
          {rows.map((row, rIdx) => (
            <React.Fragment key={row.id}>
              {/* Cabeçalho da Linha */}
              <div className="flex flex-col items-center justify-center p-1 bg-[#0A2619] border-2 border-black shadow-arcade-sm text-center min-h-[70px]">
                <span className="font-display font-black text-xs text-[#FFDF00]">
                  {row.label}
                </span>
              </div>

              {/* 3 Células da Linha */}
              {cols.map((_, cIdx) => {
                const player = gridState[rIdx][cIdx];
                return (
                  <button
                    key={`${rIdx}-${cIdx}`}
                    onClick={() => handleOpenCell(rIdx, cIdx)}
                    disabled={player !== null}
                    className={`relative flex flex-col items-center justify-center p-1 border-2 border-black shadow-arcade-sm transition-all min-h-[70px] ${
                      player
                        ? 'bg-[#22C55E]/90 cursor-default'
                        : 'bg-[#04160E] hover:bg-[#0A2619] hover:border-[#FFDF00] cursor-pointer active:translate-y-0.5'
                    }`}
                  >
                    {player ? (
                      <>
                        <PlayerAvatar
                          photo={player.photo}
                          name={player.name}
                          className="w-8 h-8 border border-black shadow mb-0.5"
                        />
                        <span className="font-display font-bold text-[11px] text-black text-center truncate w-full px-0.5">
                          {player.name}
                        </span>
                      </>
                    ) : (
                      <span className="font-display font-bold text-xs text-[#00DF81] opacity-50 group-hover:opacity-100">
                        ?
                      </span>
                    )}
                  </button>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Modal de Escolha de Jogador para a Célula */}
      {activeCell && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[#061A12] border-4 border-[#FFDF00] p-5 shadow-arcade-lg text-white">
            <button
              onClick={() => setActiveCell(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white p-1"
            >
              <X size={18} />
            </button>

            <div className="text-center mb-3">
              <span className="font-arcade text-[10px] text-[#00DF81]">
                SELECIONE UM ATLETA
              </span>
              <h3 className="font-display font-black text-base text-white mt-0.5">
                {cols[activeCell.col].label} + {rows[activeCell.row].label}
              </h3>
            </div>

            {/* Input de Busca */}
            <div className="relative mb-2.5">
              <input
                type="text"
                autoFocus
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="DIGITE O NOME..."
                className="w-full bg-[#04160E] text-white border-2 border-[#FFDF00] focus:border-[#00DF81] px-3.5 py-2 pl-9 font-display text-xs uppercase outline-none shadow-arcade-sm"
              />
              <Search
                size={16}
                className="absolute left-2.5 top-2.5 text-[#FFDF00]"
              />
            </div>

            {/* Mensagem de Erro */}
            {errorMessage && (
              <div className="p-2 mb-2 bg-[#EF4444]/20 border border-[#EF4444] text-[#EF4444] text-xs font-display">
                {errorMessage}
              </div>
            )}

            {/* Lista suspensa de sugestões */}
            <div className="max-h-48 overflow-y-auto divide-y divide-[#0A2E1C] bg-[#04160E] border border-[#FFDF00]/50">
              {filteredCandidates.length > 0 ? (
                filteredCandidates.map((p) => {
                  const flagUrl = getCountryFlagUrl(p.nationality);
                  return (
                    <div
                      key={p.id}
                      onClick={() => handleSelectPlayer(p)}
                      className="flex items-center justify-between p-2 hover:bg-[#FFDF00] hover:text-black cursor-pointer transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        <PlayerAvatar photo={p.photo} name={p.name} className="w-7 h-7" />
                        <div>
                          <div className="font-display font-bold text-xs leading-tight">
                            {p.name}
                          </div>
                          <div className="text-[10px] text-gray-300 group-hover:text-black flex items-center gap-1">
                            <img src={flagUrl} alt={p.nationality} className="w-3.5 h-2.5 object-cover" />
                            <span>{p.team}</span>
                            <span>•</span>
                            <span>{p.position}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : searchTerm.trim().length > 0 ? (
                <div className="p-3 text-center text-xs font-display text-gray-300">
                  NENHUM JOGADOR ENCONTRADO
                </div>
              ) : (
                <div className="p-3 text-center text-xs text-gray-400 font-sans">
                  Digite o nome de um atleta que cumpra ambos os requisitos...
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
