import React, { useEffect, useMemo, useState } from 'react';
import confetti from 'canvas-confetti';
import { Check, Clock, EyeOff, Flame, Share2, Sparkles } from 'lucide-react';
import type { Player } from '../types/player';
import {
  loadDateBlurProgress,
  saveDateBlurProgress,
  type BlurMode,
} from '../utils/dailySchedule';
import {
  getTimeUntilMidnightBrasilia,
  recordGamePlayed,
  updateGameStatsOnWin,
} from '../utils/gameLogic';
import { PlayerSearch } from './PlayerSearch';
import { PlayerAvatar } from './PlayerAvatar';

interface BlurGameProps {
  players: Player[];
  secretPlayer: Player;
  activeDate: string;
  dayNumber: number;
}

// Desfoque inicial (px) e passo de nitidez por tentativa errada no modo Normal
const START_BLUR = 22;
const BLUR_STEP = 2;
const MIN_BLUR = 2; // Nunca fica 100% nítida antes de acertar/revelar

export const computeBlur = (mode: BlurMode, attempts: number, revealed: boolean): number => {
  if (revealed) return 0;
  if (mode === 'hard') return START_BLUR;
  return Math.max(MIN_BLUR, START_BLUR - attempts * BLUR_STEP);
};

const pad2 = (n: number) => n.toString().padStart(2, '0');

export const BlurGame: React.FC<BlurGameProps> = ({
  players,
  secretPlayer,
  activeDate,
  dayNumber,
}) => {
  const [progress, setProgress] = useState(() => loadDateBlurProgress(activeDate));
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(getTimeUntilMidnightBrasilia());
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    setProgress(loadDateBlurProgress(activeDate));
  }, [activeDate]);

  useEffect(() => {
    setImgFailed(false);
  }, [secretPlayer.id]);

  useEffect(() => {
    if (!progress.isWon) return;
    const t = setInterval(() => setTimeLeft(getTimeUntilMidnightBrasilia()), 1000);
    return () => clearInterval(t);
  }, [progress.isWon]);

  const { guessIds, isWon, mode } = progress;
  const attempts = guessIds.length;
  const blur = computeBlur(mode, attempts, isWon);
  const clarity = mode === 'hard' ? 0 : Math.round(((START_BLUR - blur) / START_BLUR) * 100);

  const guessedPlayers = useMemo(
    () =>
      guessIds
        .map((id) => players.find((p) => p.id === id))
        .filter((p): p is Player => Boolean(p)),
    [guessIds, players]
  );

  const persist = (next: typeof progress) => {
    setProgress(next);
    saveDateBlurProgress(activeDate, next);
  };

  const handleSelectPlayer = (player: Player) => {
    if (isWon || guessIds.includes(player.id)) return;

    recordGamePlayed();

    const correct = player.id === secretPlayer.id;
    persist({ guessIds: [...guessIds, player.id], isWon: correct, mode });

    if (correct) {
      updateGameStatsOnWin(guessIds.length + 1);
      confetti({
        particleCount: 140,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#FFDF00', '#00DF81', '#FFFFFF'],
      });
    }
  };

  const handleChangeMode = (next: BlurMode) => {
    if (attempts > 0 || isWon || next === mode) return; // Modo travado após o 1º chute
    persist({ guessIds, isWon, mode: next });
  };

  const handleCopy = () => {
    const squares = '🟥'.repeat(Math.max(0, attempts - 1)) + '🟩';
    const text = [
      `CRAQUEDLE 🔍 CRAQUE EM FOCO #${dayNumber}`,
      mode === 'hard' ? '🔥 Modo HARD' : '🌫️ Modo NORMAL',
      `Acertei em ${attempts} ${attempts === 1 ? 'tentativa' : 'tentativas'}!`,
      squares,
    ].join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const modeLocked = attempts > 0 || isWon;

  return (
    <div className="w-full max-w-3xl px-2 py-1 my-auto flex flex-col animate-fadeIn">
      <div className="relative w-full bg-[#061A12]/95 border-4 border-[#FFDF00] p-3 sm:p-4 shadow-arcade-lg flex flex-col">
        {/* Cantoneiras Pixel */}
        <div className="absolute top-1 left-1 w-3 h-3 bg-[#00DF81]" />
        <div className="absolute top-1 right-1 w-3 h-3 bg-[#FFFFFF]" />
        <div className="absolute bottom-1 left-1 w-3 h-3 bg-[#FFFFFF]" />
        <div className="absolute bottom-1 right-1 w-3 h-3 bg-[#00DF81]" />

        {/* Título */}
        <div className="text-center mb-2 select-none">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-[#04160E] border border-[#FFDF00] text-[#00DF81] font-arcade text-[10px] tracking-widest uppercase mb-1 shadow-arcade-sm">
            <Sparkles size={11} className="text-[#FFDF00]" />
            ❖ DIA #{dayNumber} • {activeDate} ❖
          </div>
          <h2 className="font-display font-black text-xl sm:text-3xl text-white italic tracking-tighter uppercase drop-shadow-[2px_2px_0_#000]">
            CRAQUE EM <span className="text-[#FFDF00]">FOCO</span>
          </h2>
          <p className="text-[10px] sm:text-[11px] text-gray-300 font-sans mt-0.5">
            Descubra quem é o craque pela foto embaçada!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4">
          {/* Foto embaçada (proporção natural 3:4, sem sobras) */}
          <div className="flex-shrink-0 flex flex-col items-center gap-1.5">
            <div
              className="relative aspect-[3/4] h-[min(40vh,19rem)] overflow-hidden bg-[#062c1a] border-4 border-[#FFDF00] shadow-arcade-gold"
              aria-label={isWon ? secretPlayer.name : 'Foto embaçada do craque misterioso'}
            >
              {imgFailed || !secretPlayer.photo ? (
                <PlayerAvatar
                  id={secretPlayer.id}
                  photo={secretPlayer.photo}
                  name={isWon ? secretPlayer.name : '?'}
                  className="w-full h-full border-0"
                />
              ) : (
                <img
                  src={secretPlayer.photo}
                  alt=""
                  referrerPolicy="no-referrer"
                  draggable={false}
                  onError={() => setImgFailed(true)}
                  className="w-full h-full object-cover select-none transition-[filter,transform] duration-700 ease-out"
                  style={{
                    filter: `blur(${blur}px)`,
                    transform: blur > 0 ? 'scale(1.2)' : 'scale(1)',
                  }}
                />
              )}
              {!isWon && (
                <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-black/70 border border-[#FFDF00] text-[#FFDF00] font-arcade text-[8px] flex items-center gap-1">
                  <EyeOff size={9} /> {mode === 'hard' ? 'HARD' : 'NORMAL'}
                </div>
              )}
            </div>

            {/* Barra de nitidez */}
            <div className="w-full">
              <div className="flex items-center justify-between font-arcade text-[8px] text-gray-400 mb-0.5">
                <span>NITIDEZ</span>
                <span className={mode === 'hard' && !isWon ? 'text-[#EF4444]' : 'text-[#00DF81]'}>
                  {isWon ? '100%' : mode === 'hard' ? 'TRAVADA' : `${clarity}%`}
                </span>
              </div>
              <div className="h-2 bg-black border border-[#FFDF00]/60">
                <div
                  className="h-full bg-[#00DF81] transition-all duration-500"
                  style={{ width: `${isWon ? 100 : clarity}%` }}
                />
              </div>
            </div>
          </div>

          {/* Coluna de controles */}
          <div className="flex-1 w-full min-w-0 flex flex-col gap-2">
            {/* Seletor de modo */}
            <div className="grid grid-cols-2 gap-1.5 select-none">
              <button
                onClick={() => handleChangeMode('normal')}
                disabled={modeLocked && mode !== 'normal'}
                className={`p-1.5 border-2 text-left transition-all ${
                  mode === 'normal'
                    ? 'bg-[#00DF81] text-black border-[#FFDF00] shadow-arcade-sm'
                    : 'bg-[#04160E] text-gray-300 border-black/70 hover:border-[#00DF81]'
                } ${modeLocked && mode !== 'normal' ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                title="A foto fica mais nítida a cada tentativa"
              >
                <div className="font-arcade text-[10px] font-bold flex items-center gap-1">
                  <EyeOff size={11} /> NORMAL
                </div>
                <div className="font-sans text-[10px] leading-tight">Foto clareia a cada chute</div>
              </button>
              <button
                onClick={() => handleChangeMode('hard')}
                disabled={modeLocked && mode !== 'hard'}
                className={`p-1.5 border-2 text-left transition-all ${
                  mode === 'hard'
                    ? 'bg-[#EF4444] text-white border-[#FFDF00] shadow-arcade-sm'
                    : 'bg-[#04160E] text-gray-300 border-black/70 hover:border-[#EF4444]'
                } ${modeLocked && mode !== 'hard' ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                title="A foto permanece igualmente embaçada"
              >
                <div className="font-arcade text-[10px] font-bold flex items-center gap-1">
                  <Flame size={11} /> HARD
                </div>
                <div className="font-sans text-[10px] leading-tight">Foto sempre embaçada</div>
              </button>
            </div>
            {!modeLocked && (
              <p className="font-arcade text-[8px] text-gray-400 -mt-1">
                O modo fica travado após o primeiro chute.
              </p>
            )}

            {isWon ? (
              <div className="p-2.5 bg-[#0A2619] border-2 border-[#00DF81] shadow-arcade animate-fadeIn min-w-0">
                <span className="text-[9px] font-arcade text-[#00DF81] uppercase tracking-wider block">
                  ★ VOCÊ ACERTOU EM {attempts} {attempts === 1 ? 'TENTATIVA' : 'TENTATIVAS'}! ★
                </span>
                <h3 className="font-display font-black text-xl text-white truncate">
                  {secretPlayer.name}
                </h3>
                <p className="text-[11px] text-gray-300 font-sans truncate">
                  <strong className="text-[#FFDF00]">{secretPlayer.team}</strong> • {secretPlayer.position}
                </p>

                <div className="mt-2 flex items-center justify-between gap-2 bg-[#04160E] border border-[#FFDF00]/40 px-2 py-1">
                  <span className="flex items-center gap-1 text-[10px] font-display text-gray-300">
                    <Clock size={12} className="text-[#FFDF00]" /> PRÓXIMO CRAQUE EM
                  </span>
                  <span className="font-arcade text-sm text-[#00DF81] tracking-widest">
                    {pad2(timeLeft.hours)}:{pad2(timeLeft.minutes)}:{pad2(timeLeft.seconds)}
                  </span>
                </div>

                <button
                  onClick={handleCopy}
                  className="mt-2 w-full py-2 px-3 bg-[#FFDF00] hover:bg-[#e6c900] text-black font-display text-xs tracking-wider uppercase border-2 border-black shadow-arcade-sm active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer font-black"
                >
                  {copied ? (
                    <>
                      <Check size={14} strokeWidth={3} /> COPIADO!
                    </>
                  ) : (
                    <>
                      <Share2 size={14} strokeWidth={2.5} /> ▶ COPIAR RESULTADO
                    </>
                  )}
                </button>
              </div>
            ) : (
              <PlayerSearch
                players={players}
                alreadyGuessedIds={guessIds}
                onSelectPlayer={handleSelectPlayer}
              />
            )}

            {/* Tentativas */}
            {guessedPlayers.length > 0 && (
              <div className="min-w-0">
                <div className="font-arcade text-[9px] text-gray-400 mb-1">
                  TENTATIVAS: {attempts}
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-[5.5rem] overflow-y-auto pr-1">
                  {[...guessedPlayers].reverse().map((g) => {
                    const ok = g.id === secretPlayer.id;
                    return (
                      <span
                        key={g.id}
                        className={`px-2 py-0.5 border font-display font-bold text-[10px] ${
                          ok
                            ? 'bg-[#22C55E]/20 border-[#22C55E] text-[#22C55E]'
                            : 'bg-[#EF4444]/20 border-[#EF4444] text-[#EF4444]'
                        }`}
                      >
                        {ok ? '✓' : '✕'} {g.name}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
