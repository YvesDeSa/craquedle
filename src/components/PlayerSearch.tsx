import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import type { Player } from '../types/player';
import { normalizeText } from '../utils/gameLogic';
import { PlayerAvatar } from './PlayerAvatar';

interface PlayerSearchProps {
  players: Player[];
  alreadyGuessedIds: number[];
  onSelectPlayer: (player: Player) => void;
  disabled?: boolean;
}

export const PlayerSearch: React.FC<PlayerSearchProps> = ({
  players,
  alreadyGuessedIds,
  onSelectPlayer,
  disabled = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Filtragem dos jogadores disponíveis que ainda não foram chutados
  const availablePlayers = players.filter((p) => !alreadyGuessedIds.includes(p.id));

  const filteredPlayers = searchTerm.trim().length > 0
    ? availablePlayers.filter((p) => {
        const normSearch = normalizeText(searchTerm);
        const normName = normalizeText(p.name);
        const normTeam = normalizeText(p.team);
        return normName.includes(normSearch) || normTeam.includes(normSearch);
      })
    : [];

  useEffect(() => {
    // Resetar índice selecionado ao mudar termo de busca
    setSelectedIndex(filteredPlayers.length > 0 ? 0 : -1);
  }, [searchTerm, filteredPlayers.length]);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (player: Player) => {
    onSelectPlayer(player);
    setSearchTerm('');
    setIsOpen(false);
    setSelectedIndex(-1);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled || filteredPlayers.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIsOpen(true);
      setSelectedIndex((prev) => (prev < filteredPlayers.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setIsOpen(true);
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredPlayers.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (isOpen && selectedIndex >= 0 && selectedIndex < filteredPlayers.length) {
        handleSelect(filteredPlayers[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  // Rolar para o item selecionado pelo teclado
  useEffect(() => {
    if (listRef.current && selectedIndex >= 0) {
      const activeEl = listRef.current.children[selectedIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  return (
    <div ref={containerRef} className="relative w-full max-w-xl mx-auto my-4">
      {/* Input de Busca estilo Arcade */}
      <div className="relative flex items-center">
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          disabled={disabled}
          placeholder={
            disabled
              ? 'PARABÉNS! VOCÊ JÁ ACERTOU O CRAQUE DE HOJE!'
              : 'DIGITE O NOME DO JOGADOR...'
          }
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            if (searchTerm.trim().length > 0) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          className={`w-full bg-[#08091A] text-white border-2 border-[#6D28D9] focus:border-[#B8FF01] focus:ring-0 px-4 py-3.5 pl-11 font-display text-base tracking-wide uppercase placeholder:text-gray-500 placeholder:normal-case transition-all shadow-arcade outline-none ${
            disabled ? 'opacity-60 cursor-not-allowed border-green-500 text-green-400' : ''
          }`}
        />

        <div className="absolute left-3.5 text-[#38BDF8] pointer-events-none">
          <Search size={20} strokeWidth={2.5} />
        </div>

        {searchTerm.length > 0 && !disabled && (
          <button
            onClick={() => {
              setSearchTerm('');
              setIsOpen(false);
            }}
            className="absolute right-3.5 text-xs font-arcade text-gray-400 hover:text-[#B8FF01] px-2 py-1 bg-[#12163A] border border-black cursor-pointer"
          >
            ESC
          </button>
        )}
      </div>

      {/* Dropdown com Foto e Nome */}
      {isOpen && !disabled && (
        <div className="absolute left-0 right-0 mt-2 z-50 bg-[#08091A] border-2 border-[#6D28D9] shadow-arcade-lg max-h-72 overflow-y-auto">
          {filteredPlayers.length > 0 ? (
            <ul ref={listRef} className="divide-y divide-[#1D2152]">
              {filteredPlayers.map((player, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <li
                    key={player.id}
                    onClick={() => handleSelect(player)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`flex items-center justify-between px-3.5 py-2.5 cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-[#B8FF01] text-black font-semibold'
                        : 'text-white hover:bg-[#12163A]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <PlayerAvatar
                        photo={player.photo}
                        name={player.name}
                        className="w-10 h-10 rounded-none shadow-sm"
                      />
                      <div>
                        <div className="font-display font-bold text-base leading-tight">
                          {player.name}
                        </div>
                        <div
                          className={`text-xs ${
                            isSelected ? 'text-black/80' : 'text-gray-400'
                          }`}
                        >
                          {player.position} • {player.nationality}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {player.teamLogo && (
                        <img
                          src={player.teamLogo}
                          alt={player.team}
                          className="w-6 h-6 object-contain"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      )}
                      <span
                        className={`text-xs font-arcade px-2 py-0.5 border ${
                          isSelected
                            ? 'bg-black text-[#B8FF01] border-black'
                            : 'bg-[#15193B] text-[#38BDF8] border-[#6D28D9]'
                        }`}
                      >
                        {player.team}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : searchTerm.trim().length > 0 ? (
            <div className="p-4 text-center text-sm font-arcade text-gray-400">
              NENHUM JOGADOR ENCONTRADO
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};
