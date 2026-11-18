import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Share2, Check, Clock, X } from 'lucide-react';
import type { Player, GuessResult } from '../types/player';
import { generateShareText, getTimeUntilMidnightBrasilia } from '../utils/gameLogic';
import { getCountryFlagUrl } from '../utils/flags';
import { getClubLogoUrl } from '../utils/clubLogos';
import { TournamentPatchGrid } from './TournamentPatch';
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

  // Extrai o histórico profissional do atleta priorizando escudos
  const careerSteps = useMemo(() => {
    if (secretPlayer.careerHistory && secretPlayer.careerHistory.length > 0) {
      return secretPlayer.careerHistory.map((s) => ({
        club: s.club,
        logo: s.logo || getClubLogoUrl(s.club),
      }));
    }
    if (secretPlayer.careerTeams && secretPlayer.careerTeams.length > 0) {
      return secretPlayer.careerTeams.map((c) => ({
        club: c,
        logo: getClubLogoUrl(c),
      }));
    }
    return [];
  }, [secretPlayer]);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      {/* Moldura Brasil Arcade com contenção total de layout (Zero Scroll) */}
      <div className="relative w-full max-w-md bg-[#061A12] border-4 border-[#FFDF00] p-4 sm:p-5 shadow-arcade-lg text-white max-h-[92vh] overflow-y-auto flex flex-col justify-between">
        {/* Cantoneiras Pixel */}
        <div className="absolute top-1 left-1 w-3 h-3 bg-[#00DF81]" />
        <div className="absolute top-1 right-1 w-3 h-3 bg-[#FFFFFF]" />
        <div className="absolute bottom-1 left-1 w-3 h-3 bg-[#FFFFFF]" />
        <div className="absolute bottom-1 right-1 w-3 h-3 bg-[#00DF81]" />

        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-2.5 right-2.5 text-gray-400 hover:text-[#FFDF00] p-1 hover:bg-[#0A2619] border border-transparent hover:border-black transition-all cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Header do Card */}
        <div className="text-center mb-2.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#04160E] border border-[#FFDF00] text-[#00DF81] font-arcade text-[10px] tracking-wider mb-1">
            <Trophy size={13} className="text-[#FFDF00] animate-bounce" /> HIGH SCORE • CRAQUE DESCOBERTO!
          </div>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-[#FFDF00] italic tracking-tight drop-shadow-[2px_2px_0_#000]">
            VITÓRIA!
          </h2>
          <p className="font-display text-xs text-gray-300">
            Você acertou o craque em <span className="text-[#00DF81] font-black">{guesses.length}</span> {guesses.length === 1 ? 'tentativa' : 'tentativas'}!
          </p>
        </div>

        {/* Card do Jogador Secreto com layout totalmente contido */}
        <div className="bg-[#04160E] border-2 border-black p-3 mb-3 shadow-arcade-sm overflow-hidden w-full min-w-0">
          {/* Linha Superior: Foto + Dados Principais */}
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-16 h-21 sm:w-18 sm:h-24 flex-shrink-0 aspect-[3/4] overflow-hidden bg-[#062c1a] border-2 border-[#FFDF00] shadow-arcade-gold flex items-center justify-center">
              <PlayerAvatar
                id={secretPlayer.id}
                photo={secretPlayer.photo}
                name={secretPlayer.name}
                className="w-full h-full border-0"
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="font-display font-black text-lg sm:text-xl text-white truncate">
                {secretPlayer.name}
              </div>

              <div className="flex items-center gap-1.5 mt-0.5 truncate">
                {secretPlayer.teamLogo && (
                  <img
                    src={secretPlayer.teamLogo}
                    alt={secretPlayer.team}
                    referrerPolicy="no-referrer"
                    className="w-4 h-4 object-contain flex-shrink-0"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                )}
                <span className="font-display font-extrabold text-xs text-[#00DF81] truncate">
                  {secretPlayer.team}
                </span>
              </div>

              <div className="text-[11px] text-gray-300 font-sans mt-0.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 leading-tight">
                <img
                  src={flagUrl}
                  alt={secretPlayer.nationality}
                  referrerPolicy="no-referrer"
                  className="w-3.5 h-2.5 object-cover border border-black/40 flex-shrink-0"
                />
                <span>{secretPlayer.nationality}</span>
                <span>•</span>
                <span>{secretPlayer.position}</span>
                <span>•</span>
                <span>{secretPlayer.age} anos</span>
                {secretPlayer.altura && (
                  <>
                    <span>•</span>
                    <span>{secretPlayer.altura}</span>
                  </>
                )}
                {secretPlayer.pe_dominante && (
                  <>
                    <span>•</span>
                    <span>Pé {secretPlayer.pe_dominante}</span>
                  </>
                )}
              </div>

              <div className="mt-1.5 flex items-center">
                <TournamentPatchGrid trophies={secretPlayer.trophies} />
              </div>
            </div>
          </div>

          {/* Carreira com Escudos Oficiais (no lugar de apenas nomes em texto) */}
          {careerSteps.length > 0 && (
            <div className="mt-2.5 pt-2 border-t border-black/60 w-full min-w-0">
              <div className="text-[9px] font-arcade text-gray-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>HISTÓRICO PROFISSIONAL ({careerSteps.length} CLUBES):</span>
                <span className="text-[8px] text-[#00DF81]">DO 1º AO ÚLTIMO ➔</span>
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto py-1 px-1 bg-[#020B07] border border-black max-w-full scrollbar-thin">
                {careerSteps.map((step, idx) => {
                  const isLast = idx === careerSteps.length - 1;
                  const logo = step.logo;

                  return (
                    <React.Fragment key={idx}>
                      <div
                        className="flex-shrink-0 flex flex-col items-center justify-center p-1 bg-[#061A12] border border-[#00DF81]/30 hover:border-[#FFDF00] transition-colors rounded-xs group relative min-w-[38px] max-w-[48px]"
                        title={step.club}
                      >
                        {logo ? (
                          <img
                            src={logo}
                            alt={step.club}
                            referrerPolicy="no-referrer"
                            className="w-5 h-5 sm:w-6 sm:h-6 object-contain drop-shadow"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <span className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center font-arcade text-[8px] text-[#FFDF00] bg-black/60 border border-[#FFDF00]/40">
                            {step.club.slice(0, 2).toUpperCase()}
                          </span>
                        )}
                        <span className="font-arcade text-[7px] text-gray-300 max-w-[44px] truncate mt-0.5 group-hover:text-[#FFDF00] text-center">
                          {step.club}
                        </span>
                      </div>

                      {!isLast && (
                        <span className="text-[#FFDF00] font-arcade text-[8px] select-none opacity-70 flex-shrink-0">
                          ➔
                        </span>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Temporizador Próximo Jogador */}
        <div className="bg-[#04160E] border border-[#FFDF00]/40 p-2 text-center mb-3">
          <div className="flex items-center justify-center gap-1.5 text-gray-300 text-xs font-display">
            <Clock size={13} className="text-[#FFDF00]" /> PRÓXIMO CRAQUE EM:
          </div>
          <div className="font-arcade text-sm sm:text-base text-[#00DF81] tracking-widest mt-0.5">
            {format2Digits(timeLeft.hours)}:{format2Digits(timeLeft.minutes)}:{format2Digits(timeLeft.seconds)}
          </div>
        </div>

        {/* Botão Copiar Resultado */}
        <button
          onClick={handleCopy}
          className="w-full py-2.5 px-4 bg-[#FFDF00] hover:bg-[#e6c900] text-black font-display text-xs sm:text-sm tracking-wider uppercase border-2 border-black shadow-arcade active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer font-black"
        >
          {copied ? (
            <>
              <Check size={16} strokeWidth={3} /> COPIADO COM SUCESSO!
            </>
          ) : (
            <>
              <Share2 size={16} strokeWidth={2.5} /> ▶ COPIAR RESULTADO
            </>
          )}
        </button>
      </div>
    </div>
  );
};
