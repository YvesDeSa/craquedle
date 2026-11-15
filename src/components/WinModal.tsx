import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Share2, Check, Clock, X } from 'lucide-react';
import type { Player, GuessResult } from '../types/player';
import { generateShareText, getTimeUntilMidnightBrasilia, formatTrophiesSummary } from '../utils/gameLogic';
import { PlayerAvatar } from './PlayerAvatar';

interface WinModalProps {
  isOpen: boolean;
  onClose: () => void;
  secretPlayer: Player;
  guesses: GuessResult[];
}

export const WinModal: React.FC<WinModalProps> = ({
  isOpen,
  onClose,
  secretPlayer,
  guesses,
}) => {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(getTimeUntilMidnightBrasilia());

  useEffect(() => {
    if (isOpen) {
      // Explodir confetes estilo arcade
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#B8FF01', '#22C55E', '#38BDF8', '#6D28D9'],
      });
    }
  }, [isOpen]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeUntilMidnightBrasilia());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!isOpen) return null;

  const handleCopy = () => {
    const shareText = generateShareText(guesses, true);
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const format2Digits = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      {/* Moldura Arcade Central */}
      <div className="relative w-full max-w-md bg-[#0A0B1E] border-4 border-[#6D28D9] p-6 shadow-arcade-lg text-white">
        {/* Cantoneiras Pixel Art Verde Limão */}
        <div className="absolute top-1 left-1 w-3 h-3 bg-[#B8FF01]" />
        <div className="absolute top-1 right-1 w-3 h-3 bg-[#B8FF01]" />
        <div className="absolute bottom-1 left-1 w-3 h-3 bg-[#B8FF01]" />
        <div className="absolute bottom-1 right-1 w-3 h-3 bg-[#B8FF01]" />

        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white p-1 hover:bg-[#15193B] border border-transparent hover:border-black transition-all cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Header do Card */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#15193B] border border-[#B8FF01] text-[#B8FF01] font-arcade text-[10px] tracking-wider mb-2">
            <Trophy size={14} className="animate-bounce" /> HIGH SCORE • CRAQUE DESCOBERTO!
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-[#B8FF01] italic tracking-tight drop-shadow-[2px_2px_0_#000]">
            VITÓRIA!
          </h2>
          <p className="font-arcade text-xs text-gray-300 mt-1">
            Você acertou em <span className="text-[#38BDF8]">{guesses.length}</span> {guesses.length === 1 ? 'tentativa' : 'tentativas'}!
          </p>
        </div>

        {/* Card do Jogador Secreto */}
        <div className="bg-[#08091A] border-2 border-black p-4 mb-5 flex items-center gap-4 shadow-arcade-sm">
          <PlayerAvatar
            photo={secretPlayer.photo}
            name={secretPlayer.name}
            className="w-20 h-20 border-2 border-[#B8FF01] shadow-arcade-lime"
          />
          <div className="flex-1">
            <div className="font-display font-black text-xl text-white">
              {secretPlayer.name}
            </div>
            <div className="flex items-center gap-2 mt-1">
              {secretPlayer.teamLogo && (
                <img
                  src={secretPlayer.teamLogo}
                  alt={secretPlayer.team}
                  className="w-5 h-5 object-contain"
                />
              )}
              <span className="font-arcade text-xs text-[#38BDF8]">
                {secretPlayer.team}
              </span>
            </div>
            <div className="text-xs text-gray-300 font-sans mt-1">
              {secretPlayer.position} • {secretPlayer.age} anos • {secretPlayer.nationality}
            </div>
            <div className="text-[11px] text-[#B8FF01] font-arcade mt-1">
              🏆 {formatTrophiesSummary(secretPlayer.trophies)}
            </div>
          </div>
        </div>

        {/* Temporizador Próximo Jogador */}
        <div className="bg-[#12163A] border border-[#6D28D9] p-3 text-center mb-5">
          <div className="flex items-center justify-center gap-1.5 text-gray-400 text-xs font-arcade">
            <Clock size={14} className="text-[#38BDF8]" /> PRÓXIMO CRAQUE EM:
          </div>
          <div className="font-arcade text-lg sm:text-xl text-[#B8FF01] tracking-widest mt-1">
            {format2Digits(timeLeft.hours)}:{format2Digits(timeLeft.minutes)}:{format2Digits(timeLeft.seconds)}
          </div>
        </div>

        {/* Botão Copiar Resultado */}
        <button
          onClick={handleCopy}
          className="w-full py-3.5 px-4 bg-[#B8FF01] hover:bg-[#a6e600] text-black font-arcade text-xs sm:text-sm tracking-wider uppercase border-2 border-black shadow-arcade active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer font-bold"
        >
          {copied ? (
            <>
              <Check size={18} strokeWidth={3} /> COPIADO COM SUCESSO!
            </>
          ) : (
            <>
              <Share2 size={18} strokeWidth={2.5} /> ▶ COPIAR RESULTADO
            </>
          )}
        </button>
      </div>
    </div>
  );
};
