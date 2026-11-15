import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Share2, Check, Clock, X } from 'lucide-react';
import type { Player, GuessResult } from '../types/player';
import { generateShareText, getTimeUntilMidnightBrasilia } from '../utils/gameLogic';
import { getCountryFlagUrl } from '../utils/flags';
import { TrophyGroup } from './TrophyBadge';
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
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FFDF00', '#00DF81', '#FFFFFF', '#22C55E'],
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
  const flagUrl = getCountryFlagUrl(secretPlayer.nationality);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      {/* Moldura Brasil Arcade */}
      <div className="relative w-full max-w-md bg-[#061A12] border-4 border-[#FFDF00] p-5 shadow-arcade-lg text-white">
        {/* Cantoneiras Pixel */}
        <div className="absolute top-1 left-1 w-3 h-3 bg-[#00DF81]" />
        <div className="absolute top-1 right-1 w-3 h-3 bg-[#FFFFFF]" />
        <div className="absolute bottom-1 left-1 w-3 h-3 bg-[#FFFFFF]" />
        <div className="absolute bottom-1 right-1 w-3 h-3 bg-[#00DF81]" />

        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white p-1 hover:bg-[#0A2619] border border-transparent hover:border-black transition-all cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Header do Card */}
        <div className="text-center mb-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#04160E] border border-[#FFDF00] text-[#00DF81] font-arcade text-[10px] tracking-wider mb-1">
            <Trophy size={13} className="text-[#FFDF00] animate-bounce" /> HIGH SCORE • CRAQUE DESCOBERTO!
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-[#FFDF00] italic tracking-tight drop-shadow-[2px_2px_0_#000]">
            VITÓRIA!
          </h2>
          <p className="font-display text-xs text-gray-300">
            Você acertou o craque em <span className="text-[#00DF81] font-black">{guesses.length}</span> {guesses.length === 1 ? 'tentativa' : 'tentativas'}!
          </p>
        </div>

        {/* Card do Jogador Secreto */}
        <div className="bg-[#04160E] border-2 border-black p-3.5 mb-4 flex items-center gap-3.5 shadow-arcade-sm">
          <PlayerAvatar
            photo={secretPlayer.photo}
            name={secretPlayer.name}
            className="w-18 h-18 border-2 border-[#FFDF00] shadow-arcade-gold"
          />
          <div className="flex-1">
            <div className="font-display font-black text-xl text-white">
              {secretPlayer.name}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              {secretPlayer.teamLogo && (
                <img
                  src={secretPlayer.teamLogo}
                  alt={secretPlayer.team}
                  className="w-4 h-4 object-contain"
                />
              )}
              <span className="font-display font-extrabold text-xs text-[#00DF81]">
                {secretPlayer.team}
              </span>
            </div>
            <div className="text-xs text-gray-300 font-sans mt-0.5 flex items-center gap-1.5">
              <img src={flagUrl} alt={secretPlayer.nationality} className="w-4 h-3 object-cover border border-black/40" />
              <span>{secretPlayer.nationality}</span>
              <span>•</span>
              <span>{secretPlayer.position}</span>
              <span>•</span>
              <span>{secretPlayer.age} anos</span>
            </div>
            <div className="mt-1.5">
              <TrophyGroup trophies={secretPlayer.trophies} size="sm" />
            </div>
          </div>
        </div>

        {/* Temporizador Próximo Jogador */}
        <div className="bg-[#04160E] border border-[#FFDF00]/40 p-2.5 text-center mb-4">
          <div className="flex items-center justify-center gap-1.5 text-gray-300 text-xs font-display">
            <Clock size={13} className="text-[#FFDF00]" /> PRÓXIMO CRAQUE EM:
          </div>
          <div className="font-arcade text-base sm:text-lg text-[#00DF81] tracking-widest mt-0.5">
            {format2Digits(timeLeft.hours)}:{format2Digits(timeLeft.minutes)}:{format2Digits(timeLeft.seconds)}
          </div>
        </div>

        {/* Botão Copiar Resultado */}
        <button
          onClick={handleCopy}
          className="w-full py-3 px-4 bg-[#FFDF00] hover:bg-[#e6c900] text-black font-display text-sm tracking-wider uppercase border-2 border-black shadow-arcade active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer font-black"
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
