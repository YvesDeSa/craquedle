import React, { useState } from 'react';
import { CheckCircle, Search, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Player } from '../types/player';
import { normalizeText } from '../utils/gameLogic';
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
  // Configuração das 3 colunas e 3 linhas do Grid diário
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
      label: 'Copa Libertadores 🏆',
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

  // Matriz 3x3 com id do jogador acertado em cada célula
  const [gridState, setGridState] = useState<(Player | null)[][]>([
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ]);

  const [activeCell, setActiveCell] = useState<{ row: number; col: number } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Lista de jogadores já utilizados no tabuleiro
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

      // Checa se completou o tabuleiro
      if (nextGrid.flat().filter(Boolean).length === 9) {
        confetti({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.5 },
          colors: ['#B8FF01', '#22C55E', '#38BDF8'],
        });
      }
    } else {
      setErrorMessage(
        `Incorreto! ${player.name} não cumpre ambos os critérios (${colCriterion.label} + ${rowCriterion.label}).`
      );
    }
  };

  // Filtragem de autocomplete para a célula ativa
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
    <div className="w-full max-w-4xl mx-auto px-4 py-4 flex flex-col items-center">
      {/* Top Banner */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#08091A] border border-[#6D28D9] text-[#B8FF01] font-arcade text-xs mb-2">
          ❖ TABULEIRO 3x3 ❖
        </div>
        <h2 className="font-display font-black text-3xl sm:text-4xl text-white italic tracking-tight">
          GRID DO BRASILEIRÃO
        </h2>
        <p className="text-xs sm:text-sm text-gray-300 font-sans mt-1">
          Cruze os clubes e atributos das colunas com as linhas para preencher as 9 casas!
        </p>
      </div>

      {/* Placar de Progresso */}
      <div className="flex items-center justify-between w-full max-w-2xl bg-[#08091A] border-2 border-[#6D28D9] p-3 mb-4 shadow-arcade-sm">
        <div className="font-arcade text-xs text-[#38BDF8]">
          ACERTOS: <span className="text-[#B8FF01] text-sm">{totalFilled}/9</span>
        </div>
        {isComplete ? (
          <div className="font-arcade text-xs text-[#22C55E] flex items-center gap-1">
            <CheckCircle size={16} /> TABULEIRO COMPLETO!
          </div>
        ) : (
          <div className="font-arcade text-[10px] text-gray-400">
            CLIQUE NUM QUADRADO PARA CHUTAR
          </div>
        )}
      </div>

      {/* Tabuleiro Grid 3x3 */}
      <div className="relative w-full max-w-2xl bg-[#0A0B1E] border-4 border-[#6D28D9] p-4 sm:p-6 shadow-arcade-lg">
        {/* Cantoneiras Pixel */}
        <div className="absolute top-1 left-1 w-3 h-3 bg-[#B8FF01]" />
        <div className="absolute top-1 right-1 w-3 h-3 bg-[#B8FF01]" />
        <div className="absolute bottom-1 left-1 w-3 h-3 bg-[#B8FF01]" />
        <div className="absolute bottom-1 right-1 w-3 h-3 bg-[#B8FF01]" />

        {/* Grade 4x4 (canto vazio + 3 cols; 3 linhas) */}
        <div className="grid grid-cols-4 gap-2">
          {/* Célula Vazia Topo Esquerdo */}
          <div className="flex items-center justify-center p-2 bg-[#08091A] border-2 border-black text-[#B8FF01] font-arcade text-[10px] text-center">
            GRID 3x3
          </div>

          {/* Cabeçalhos das Colunas */}
          {cols.map((col) => (
            <div
              key={col.id}
              className="flex flex-col items-center justify-center p-2 bg-[#12163A] border-2 border-black shadow-arcade-sm text-center min-h-[70px]"
            >
              {col.logo && (
                <img
                  src={col.logo}
                  alt={col.label}
                  className="w-7 h-7 object-contain mb-1"
                />
              )}
              <span className="font-display font-black text-xs sm:text-sm text-white">
                {col.label}
              </span>
            </div>
          ))}

          {/* Linhas e Células */}
          {rows.map((row, rIdx) => (
            <React.Fragment key={row.id}>
              {/* Cabeçalho da Linha */}
              <div className="flex flex-col items-center justify-center p-2 bg-[#12163A] border-2 border-black shadow-arcade-sm text-center min-h-[90px]">
                <span className="font-display font-black text-xs sm:text-sm text-[#B8FF01]">
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
                    className={`relative flex flex-col items-center justify-center p-2 border-2 border-black shadow-arcade-sm transition-all min-h-[90px] ${
                      player
                        ? 'bg-[#22C55E]/90 cursor-default'
                        : 'bg-[#08091A] hover:bg-[#15193B] hover:border-[#B8FF01] cursor-pointer active:translate-y-0.5'
                    }`}
                  >
                    {player ? (
                      <>
                        <PlayerAvatar
                          photo={player.photo}
                          name={player.name}
                          className="w-10 h-10 border border-black shadow mb-1"
                        />
                        <span className="font-display font-bold text-xs text-black text-center truncate w-full">
                          {player.name}
                        </span>
                      </>
                    ) : (
                      <span className="font-arcade text-xs text-[#38BDF8] opacity-50 group-hover:opacity-100">
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
          <div className="relative w-full max-w-md bg-[#0A0B1E] border-4 border-[#6D28D9] p-6 shadow-arcade-lg text-white">
            <button
              onClick={() => setActiveCell(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white p-1"
            >
              <X size={20} />
            </button>

            <div className="text-center mb-4">
              <span className="font-arcade text-[10px] text-[#B8FF01]">
                SELECIONE UM ATLETA
              </span>
              <h3 className="font-display font-black text-lg text-white mt-1">
                {cols[activeCell.col].label} + {rows[activeCell.row].label}
              </h3>
            </div>

            {/* Input de Busca */}
            <div className="relative mb-3">
              <input
                type="text"
                autoFocus
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="DIGITE O NOME..."
                className="w-full bg-[#08091A] text-white border-2 border-[#6D28D9] focus:border-[#B8FF01] px-4 py-3 pl-10 font-display uppercase outline-none shadow-arcade-sm"
              />
              <Search
                size={18}
                className="absolute left-3 top-3.5 text-[#38BDF8]"
              />
            </div>

            {/* Mensagem de Erro */}
            {errorMessage && (
              <div className="p-2 mb-3 bg-[#EF4444]/20 border border-[#EF4444] text-[#EF4444] text-xs font-display">
                {errorMessage}
              </div>
            )}

            {/* Lista suspensa de sugestões */}
            <div className="max-h-56 overflow-y-auto divide-y divide-[#1D2152] bg-[#08091A] border border-[#6D28D9]">
              {filteredCandidates.length > 0 ? (
                filteredCandidates.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => handleSelectPlayer(p)}
                    className="flex items-center justify-between p-2.5 hover:bg-[#B8FF01] hover:text-black cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <PlayerAvatar photo={p.photo} name={p.name} className="w-8 h-8" />
                      <div>
                        <div className="font-display font-bold text-sm leading-tight">
                          {p.name}
                        </div>
                        <div className="text-xs text-gray-400 group-hover:text-black/80">
                          {p.team} • {p.position}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : searchTerm.trim().length > 0 ? (
                <div className="p-4 text-center text-xs font-arcade text-gray-400">
                  NENHUM JOGADOR ENCONTRADO
                </div>
              ) : (
                <div className="p-4 text-center text-xs text-gray-400 font-sans">
                  Comece a digitar o nome de um jogador que passou por esse clube ou critério...
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
