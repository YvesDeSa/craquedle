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
        const matchesName = normName.includes(normSearch) || normSearch.includes(normName);
        const matchesTeam = normTeam.includes(normSearch);
        const matchesAlias = p.aliases?.some((a) => {
          const normA = normalizeText(a);
          return normA.includes(normSearch) || normSearch.includes(normA);
        });
        return matchesName || matchesTeam || matchesAlias;
      })
    : [];

  useEffect(() => {
    setSelectedIndex(filteredPlayers.length > 0 ? 0 : -1);
  }, [searchTerm, filteredPlayers.length]);

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

  useEffect(() => {
    if (listRef.current && selectedIndex >= 0) {
      const activeEl = listRef.current.children[selectedIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  return (
    <div ref={containerRef} className="relative w-full max-w-xl mx-auto my-2">
      {/* Input de Busca estilo Brasil Arcade */}
      <div className="relative flex items-center">
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          disabled={disabled}
          placeholder={
            disabled
              ? 'PARABÉNS! VOCÊ JÁ DESCOBRIU O CRAQUE DE HOJE!'
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
          className={`w-full bg-[#04160E] text-white border-2 border-[#FFDF00] focus:border-[#00DF81] focus:ring-0 px-3.5 py-2.5 pl-10 font-display text-sm tracking-wide uppercase placeholder:text-gray-400 placeholder:normal-case transition-all shadow-arcade outline-none ${
            disabled ? 'opacity-60 cursor-not-allowed border-green-500 text-green-400' : ''
          }`}
        />

        <div className="absolute left-3 text-[#FFDF00] pointer-events-none">
          <Search size={18} strokeWidth={2.5} />
        </div>

        {searchTerm.length > 0 && !disabled && (
          <button
            onClick={() => {
              setSearchTerm('');
              setIsOpen(false);
            }}
            className="absolute right-3 text-[10px] font-arcade text-gray-300 hover:text-[#FFDF00] px-1.5 py-0.5 bg-black/60 border border-black cursor-pointer"
          >
            ESC
          </button>
        )}
      </div>

      {/* Dropdown Limpo estilo Narutodle (sem revelar idade e posição) */}
      {isOpen && !disabled && (
        <div className="absolute left-0 right-0 mt-1.5 z-50 bg-[#061A12] border-2 border-[#FFDF00] shadow-arcade-lg max-h-64 overflow-y-auto divide-y divide-[#0A2E1C]">
          {filteredPlayers.length > 0 ? (
            <ul ref={listRef} className="divide-y divide-[#0A2E1C]">
              {filteredPlayers.map((player, idx) => {
                const isSelected = idx === selectedIndex;

                return (
                  <li
                    key={player.id}
                    onClick={() => handleSelect(player)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`flex items-center px-3 py-2 cursor-pointer transition-colors min-h-[52px] ${
                      isSelected
                        ? 'bg-[#FFDF00] text-black font-semibold'
                        : 'text-white hover:bg-[#0A2619]'
                    }`}
                  >
                    {/* Apenas Foto + Nome (sem nacionalidade nem time para dificultar) */}
                    <div className="flex items-center gap-3 min-w-0 w-full">
                      <div className="h-11 w-8.5 min-w-[34px] max-w-[34px] flex-shrink-0 aspect-[3/4] overflow-hidden bg-[#062c1a] border border-[#FFDF00] flex items-center justify-center shadow-sm">
                        <PlayerAvatar id={player.id} photo={player.photo} name={player.name} className="w-full h-full border-0" />
                      </div>
                      <span className="font-display font-black text-base leading-tight truncate">
                        {player.name}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : searchTerm.trim().length > 0 ? (
            <div className="p-3 text-center text-xs font-display text-gray-300">
              NENHUM JOGADOR ENCONTRADO
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};
