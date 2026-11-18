import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Search, Sparkles, Lightbulb } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Player } from '../types/player';
import { normalizeText, recordGamePlayed, updateGameStatsOnWin } from '../utils/gameLogic';
import { getClubLogoUrl } from '../utils/clubLogos';
import { getCountryFlagUrl } from '../utils/flags';
import { PlayerAvatar } from './PlayerAvatar';
import type { CareerDifficulty } from '../utils/dailySchedule';
import { loadDateCareerProgress, saveDateCareerProgress, getCareerDifficulty } from '../utils/dailySchedule';

interface GuessThePlayerBannerProps {
  players: Player[];
  dailyPlayers: Player[]; // 4 jogadores da data
  careerDifficulties?: CareerDifficulty[]; // 4 níveis de dificuldade (Fácil, Médio, Difícil, Extremo)
  activeDate: string;
  onBack?: () => void;
}

const getDifficultyTheme = (diff: CareerDifficulty) => {
  switch (diff) {
    case 'Fácil':
      return {
        badgeBg: 'bg-[#22C55E]/20',
        badgeBorder: 'border-[#22C55E]',
        badgeText: 'text-[#22C55E]',
        desc: 'Superestrela mundial / grande ícone',
      };
    case 'Médio':
      return {
        badgeBg: 'bg-[#00DF81]/20',
        badgeBorder: 'border-[#00DF81]',
        badgeText: 'text-[#00DF81]',
        desc: 'Titular consolidado da Série A',
      };
    case 'Difícil':
      return {
        badgeBg: 'bg-[#EAB308]/20',
        badgeBorder: 'border-[#EAB308]',
        badgeText: 'text-[#EAB308]',
        desc: 'Jornadeiro de múltiplos clubes e empréstimos',
      };
    case 'Extremo':
    default:
      return {
        badgeBg: 'bg-[#EF4444]/20',
        badgeBorder: 'border-[#EF4444]',
        badgeText: 'text-[#EF4444]',
        desc: 'Carreira ramificada e desafiadora',
      };
  }
};

export const GuessThePlayerBanner: React.FC<GuessThePlayerBannerProps> = ({
  players,
  dailyPlayers,
  careerDifficulties,
  activeDate,
  onBack,
}) => {
  // Carrega progresso da data ativa
  const [savedProgress, setSavedProgress] = useState(() =>
    loadDateCareerProgress(activeDate)
  );

  const [currentIndex, setCurrentIndex] = useState(savedProgress.currentIndex || 0);
  const [completedIds, setCompletedIds] = useState<number[]>(savedProgress.completedPlayerIds || []);

  // Recarrega quando mudar a data
  useEffect(() => {
    const prog = loadDateCareerProgress(activeDate);
    setSavedProgress(prog);
    setCurrentIndex(prog.currentIndex || 0);
    setCompletedIds(prog.completedPlayerIds || []);
    setSearchTerm('');
    setGuesses([]);
    setGuessedPlayerIds([]);
    setIsRevealed(false);
    setHasWon(false);
    setFeedbackMessage(null);
  }, [activeDate]);

  const targetPlayer = dailyPlayers[currentIndex] || dailyPlayers[0] || players[0]!;
  const isAlreadySolved = completedIds.includes(targetPlayer.id);

  const currentDifficulty = careerDifficulties?.[currentIndex] || getCareerDifficulty(targetPlayer);
  const currentDifficultyTheme = getDifficultyTheme(currentDifficulty);
  const targetFlagUrl = getCountryFlagUrl(targetPlayer.nationality);

  const [searchTerm, setSearchTerm] = useState('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [guessedPlayerIds, setGuessedPlayerIds] = useState<number[]>([]);
  const [isRevealed, setIsRevealed] = useState(isAlreadySolved);
  const [hasWon, setHasWon] = useState(isAlreadySolved);
  const [feedbackMessage, setFeedbackMessage] = useState<{
    text: string;
    type: 'success' | 'error';
  } | null>(null);

  // Sincroniza estado de vitória ao mudar de jogador
  useEffect(() => {
    const solved = completedIds.includes(targetPlayer.id);
    setHasWon(solved);
    setIsRevealed(solved);
    setGuesses([]);
    setGuessedPlayerIds([]);
    setFeedbackMessage(null);
    setSearchTerm('');
  }, [currentIndex, targetPlayer.id, completedIds]);

  const careerSteps = targetPlayer.careerHistory || [];

  const handleSelectChallenge = (idx: number) => {
    setCurrentIndex(idx);
    saveDateCareerProgress(activeDate, {
      currentIndex: idx,
      completedPlayerIds: completedIds,
      isAllCompleted: completedIds.length >= dailyPlayers.length,
    });
  };

  const handleNextChallenge = () => {
    const nextIdx = (currentIndex + 1) % dailyPlayers.length;
    handleSelectChallenge(nextIdx);
  };

  const handleSelectCandidate = (candidate: Player) => {
    if (hasWon || isRevealed) return;

    recordGamePlayed();

    // Impede chutar o mesmo atleta mais de uma vez
    if (guessedPlayerIds.includes(candidate.id)) {
      setFeedbackMessage({
        text: `Você já chutou ${candidate.name}! Tente outro atleta.`,
        type: 'error',
      });
      setSearchTerm('');
      return;
    }

    const isMatch =
      candidate.id === targetPlayer.id ||
      normalizeText(candidate.name) === normalizeText(targetPlayer.name);

    if (isMatch) {
      const nextCompleted = Array.from(new Set([...completedIds, targetPlayer.id]));
      setCompletedIds(nextCompleted);
      setHasWon(true);
      setIsRevealed(true);

      const allDone = nextCompleted.length >= dailyPlayers.length;
      if (allDone) {
        updateGameStatsOnWin(1);
      }
      saveDateCareerProgress(activeDate, {
        currentIndex,
        completedPlayerIds: nextCompleted,
        isAllCompleted: allDone,
      });

      setFeedbackMessage({
        text: allDone
          ? `🏆 INCRÍVEL! Você acertou ${targetPlayer.name} e completou TODOS os 4 desafios de hoje!`
          : `GOLAÇO! Você acertou: é o ${targetPlayer.name}!`,
        type: 'success',
      });

      confetti({
        particleCount: 160,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#FFDF00', '#00DF81', '#FFFFFF'],
      });
    } else {
      setGuessedPlayerIds((prev) => [...prev, candidate.id]);
      setGuesses((prev) => [...prev, `${candidate.name} (${candidate.team})`]);
      setFeedbackMessage({
        text: `Incorreto! Não é o ${candidate.name} (${candidate.team}). Analise a sequência de clubes ou aguarde as dicas!`,
        type: 'error',
      });
    }
    setSearchTerm('');
  };

  const filteredCandidates = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const norm = normalizeText(searchTerm);
    return players
      .filter((p) => {
        // Remove das opções atletas já chutados neste desafio
        if (guessedPlayerIds.includes(p.id)) return false;
        const normName = normalizeText(p.name);
        const matchesName = normName.includes(norm) || norm.includes(normName);
        const matchesAlias = p.aliases?.some((a) => {
          const normA = normalizeText(a);
          return normA.includes(norm) || norm.includes(normA);
        });
        return matchesName || matchesAlias;
      })
      .slice(0, 6);
  }, [searchTerm, players, guessedPlayerIds]);

  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 py-1 flex flex-col items-center my-auto max-h-[calc(100vh-76px)] overflow-y-auto">
      {/* Moldura Arcade com Cantoneiras Pixel */}
      <div className="relative w-full bg-[#061A12] border-4 border-[#FFDF00] p-3 sm:p-4 shadow-arcade-lg flex flex-col items-center">
        <div className="absolute top-1 left-1 w-3 h-3 bg-[#00DF81]" />
        <div className="absolute top-1 right-1 w-3 h-3 bg-[#FFFFFF]" />
        <div className="absolute bottom-1 left-1 w-3 h-3 bg-[#FFFFFF]" />
        <div className="absolute bottom-1 right-1 w-3 h-3 bg-[#00DF81]" />

        {/* Topo: Navegação e Indicador de Dificuldades dos 4 Desafios */}
        <div className="w-full flex items-center justify-between mb-1.5">
          {onBack ? (
            <button
              onClick={onBack}
              className="flex items-center gap-1 px-2 py-1 bg-[#04160E] border border-[#FFDF00] text-[#FFDF00] hover:bg-[#FFDF00] hover:text-black font-arcade text-[10px] transition-all cursor-pointer"
            >
              <ArrowLeft size={12} /> MENU
            </button>
          ) : <div />}

          {/* Seletor Visual dos 4 Níveis de Desafio */}
          <div className="flex items-center gap-1 sm:gap-1.5 bg-[#04160E] border border-[#FFDF00]/60 px-2 py-1 shadow-inner">
            <span className="font-arcade text-[9px] text-gray-400 mr-1 hidden sm:inline">DESAFIO:</span>
            {dailyPlayers.map((dp, idx) => {
              const solved = completedIds.includes(dp.id);
              const isCurrent = idx === currentIndex;
              const diff = careerDifficulties?.[idx] || getCareerDifficulty(dp);
              const theme = getDifficultyTheme(diff);

              return (
                <button
                  key={dp.id || idx}
                  onClick={() => handleSelectChallenge(idx)}
                  className={`h-6 sm:h-7 px-1.5 sm:px-2 flex items-center justify-center gap-1 font-arcade text-[9px] sm:text-[10px] font-bold border transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-[#FFDF00] text-black border-white shadow-arcade-sm'
                      : solved
                      ? 'bg-[#22C55E]/20 text-[#22C55E] border-[#22C55E]'
                      : 'bg-black/50 text-gray-300 border-gray-700 hover:border-gray-400'
                  }`}
                  title={`Desafio ${idx + 1}: ${diff} (${theme.desc})${solved ? ' - Concluído' : ''}`}
                >
                  <span>{solved ? '✓' : idx + 1}</span>
                  <span className={`text-[8px] uppercase hidden xs:inline font-bold ${isCurrent ? 'text-black' : theme.badgeText}`}>
                    {diff.slice(0, 3)}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="font-arcade text-[10px] text-gray-400">
            DATA: <span className="text-[#FFDF00]">{activeDate}</span>
          </div>
        </div>

        {/* Título Principal com Nível de Dificuldade Ativo */}
        <div className="text-center mb-1.5 select-none">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-[#04160E] border border-[#FFDF00] text-[#00DF81] font-arcade text-[10px] tracking-widest uppercase mb-1 shadow-arcade-sm">
            <Sparkles size={11} className="text-[#FFDF00]" />
            ❖ DESAFIO {currentIndex + 1}/4 • DIFICULDADE:{' '}
            <span className={`font-black ${currentDifficultyTheme.badgeText}`}>
              {currentDifficulty.toUpperCase()}
            </span>{' '}
            ❖
          </div>

          <h2 className="font-display font-black text-xl sm:text-3xl text-white italic tracking-tighter uppercase drop-shadow-[2px_2px_0_#000]">
            QUEM É ESSE <span className="text-[#FFDF00]">JOGADOR?</span>
          </h2>
          <p className="text-[10px] sm:text-[11px] text-gray-300 font-sans mt-0.5">
            <span className={`inline-block px-1.5 py-0.2 mr-1.5 text-[9px] font-arcade border ${currentDifficultyTheme.badgeBg} ${currentDifficultyTheme.badgeBorder} ${currentDifficultyTheme.badgeText}`}>
              {currentDifficultyTheme.desc}
            </span>
            Adivinhe o craque pela ordem cronológica de transferências e empréstimos da carreira!
          </p>
        </div>

        {/* Linha do Tempo de Clubes (Mínimo 3 Clubes e Idade >= 24 Garantidos) */}
        <div className="w-full bg-[#04160E] border-2 border-black p-2 sm:p-2.5 my-1 shadow-inner">
          <div className="flex items-center justify-between text-[9px] font-arcade text-gray-400 mb-1.5 border-b border-white/10 pb-1">
            <span>HISTÓRICO PROFISSIONAL ({careerSteps.length} CLUBES)</span>
            <span className="text-[#00DF81]">DO 1º AO ÚLTIMO TIME ➔</span>
          </div>

          {/* Grid de Escudos Conectados por Setas */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
            {careerSteps.map((step, idx) => {
              const isLast = idx === careerSteps.length - 1;
              const logoUrl = (step.logo && !step.logo.includes('ui-avatars')) ? step.logo : getClubLogoUrl(step.club);

              return (
                <React.Fragment key={idx}>
                  <div
                    className="flex flex-col items-center justify-center p-1 sm:p-1.5 bg-[#061A12] border border-[#00DF81]/40 rounded-xs shadow-arcade-sm min-w-[50px] sm:min-w-[62px] max-w-[68px] sm:max-w-[80px] group transition-transform hover:scale-105"
                    title={step.club}
                  >
                    {/* Badge DEF / EMP */}
                    <span
                      className={`text-[8px] font-arcade px-1 rounded-xs mb-0.5 ${
                        step.isLoan || step.type === 'emp'
                          ? 'bg-[#EAB308] text-black font-bold'
                          : 'bg-[#00DF81] text-black font-bold'
                      }`}
                    >
                      {step.isLoan || step.type === 'emp' ? 'EMP' : 'DEF'}
                    </span>

                    {/* Escudo ou Fallback */}
                    <div className="w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center my-0.5">
                      {logoUrl ? (
                        <img
                          src={logoUrl}
                          alt={step.club}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-contain drop-shadow"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-black/60 border border-[#FFDF00]/40 text-[#FFDF00] font-arcade text-[9px] font-bold">
                          {step.club.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>

                    {/* Nome do Clube Truncado */}
                    <span className="font-display font-black text-[9px] sm:text-[10px] text-white truncate max-w-full text-center group-hover:text-[#FFDF00]">
                      {step.club}
                    </span>
                  </div>

                  {/* Seta conectora */}
                  {!isLast && (
                    <span className="text-[#FFDF00] font-arcade text-xs font-bold opacity-80 select-none">
                      ➔
                    </span>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Revelação / Sucesso do Jogador */}
        {isRevealed && (
          <div className="w-full my-1.5 p-2.5 bg-[#0A2619] border-2 border-[#00DF81] flex items-center justify-between shadow-arcade animate-fadeIn overflow-hidden min-w-0 gap-2">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
              <div className="w-11 h-15 sm:w-12 sm:h-16 aspect-[3/4] overflow-hidden bg-[#062c1a] border-2 border-black shadow flex-shrink-0">
                <PlayerAvatar
                  id={targetPlayer.id}
                  photo={targetPlayer.photo}
                  name={targetPlayer.name}
                  className="w-full h-full border-0"
                />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[9px] sm:text-[10px] font-arcade text-[#00DF81] uppercase tracking-wider block truncate">
                  {hasWon ? '★ VOCÊ ACERTOU! ★' : 'RESPOSTA REVELADA:'}
                </span>
                <h3 className="font-display font-black text-lg sm:text-xl text-white truncate">
                  {targetPlayer.name}
                </h3>
                <p className="text-[11px] sm:text-xs text-gray-300 font-sans truncate">
                  Clube Atual: <strong className="text-[#FFDF00]">{targetPlayer.team}</strong> • {targetPlayer.position}
                </p>
              </div>
            </div>

            <button
              onClick={handleNextChallenge}
              className="px-2.5 py-2 bg-[#FFDF00] hover:bg-[#e6c800] text-black font-display font-black text-xs border-2 border-black shadow-arcade-sm flex items-center gap-1 cursor-pointer active:translate-y-0.5 flex-shrink-0"
            >
              PRÓXIMO ➔
            </button>
          </div>
        )}

        {/* Feedback de erro */}
        {feedbackMessage && !isRevealed && (
          <div
            className={`w-full p-1.5 my-1 text-center font-display font-bold text-xs border animate-fadeIn ${
              feedbackMessage.type === 'success'
                ? 'bg-[#22C55E]/20 border-[#22C55E] text-[#22C55E]'
                : 'bg-[#EF4444]/20 border-[#EF4444] text-[#EF4444]'
            }`}
          >
            {feedbackMessage.text}
          </div>
        )}

        {/* Input de Busca do Craque (Apenas se não revelado) com Dropdown para CIMA sem cortes */}
        {!isRevealed && (
          <div className="relative w-full max-w-md my-1 z-30">
            <div className="relative flex items-center">
              <Search
                size={16}
                className="absolute left-3 text-[#FFDF00] pointer-events-none"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && filteredCandidates.length > 0) {
                    e.preventDefault();
                    handleSelectCandidate(filteredCandidates[0]);
                  }
                }}
                placeholder="DIGITE O NOME DO JOGADOR..."
                className="w-full pl-9 pr-4 py-2 bg-[#04160E] border-2 border-[#FFDF00] text-white font-display font-bold text-xs placeholder:text-gray-500 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-[#00DF81] shadow-arcade-sm tracking-wide"
              />
            </div>

            {/* Dropdown de Sugestões: Abre para CIMA (bottom-full) para nunca ser cortado pelo rodapé/borda */}
            {filteredCandidates.length > 0 && (
              <div className="absolute bottom-full left-0 right-0 mb-1.5 bg-[#061A12] border-2 border-[#FFDF00] shadow-arcade-lg z-50 max-h-52 overflow-y-auto">
                <div className="p-1 px-2 bg-[#04160E] border-b border-black text-[9px] font-arcade text-gray-400 flex items-center justify-between">
                  <span>SUGESTÕES ({filteredCandidates.length})</span>
                  <span className="text-[#00DF81]">CLIQUE PARA CHUTAR</span>
                </div>
                {filteredCandidates.map((cand) => (
                  <button
                    key={cand.id}
                    onClick={() => handleSelectCandidate(cand)}
                    className="w-full flex items-center justify-between p-2 hover:bg-[#FFDF00] hover:text-black border-b border-black/40 text-left cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-8 aspect-[3/4] overflow-hidden bg-[#062c1a] border border-black flex-shrink-0">
                        <PlayerAvatar
                          id={cand.id}
                          photo={cand.photo}
                          name={cand.name}
                          className="w-full h-full border-0"
                        />
                      </div>
                      <span className="font-display font-black text-xs sm:text-sm text-white group-hover:text-black">
                        {cand.name}
                      </span>
                    </div>
                    <span className="font-arcade text-[9px] text-[#00DF81] group-hover:text-black opacity-0 group-hover:opacity-100 transition-opacity">
                      CHUTAR ➔
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Sistema de Dicas (Hint System): 1ª Dica após 5 tentativas e 2ª Dica após 10 tentativas */}
        {!isRevealed && (
          <div className="w-full max-w-md my-1 bg-[#04160E] border border-[#FFDF00]/40 p-2 shadow-inner">
            <div className="flex items-center justify-between text-[9px] font-arcade mb-1">
              <span className="text-[#FFDF00] flex items-center gap-1 font-bold">
                <Lightbulb size={12} className="text-[#FFDF00]" /> SISTEMA DE DICAS:
              </span>
              <span className="text-gray-400">
                {guesses.length} {guesses.length === 1 ? 'tentativa' : 'tentativas'}
              </span>
            </div>

            <div className="space-y-1">
              {/* Dica 1: Liberada com 5 tentativas */}
              {guesses.length >= 5 ? (
                <div className="flex items-center gap-2 p-1.5 bg-[#00DF81]/15 border border-[#00DF81] text-white text-[11px] font-sans animate-fadeIn">
                  <span className="font-arcade text-[9px] bg-[#00DF81] text-black px-1.5 py-0.2 font-bold flex-shrink-0">
                    DICA 1
                  </span>
                  <div className="flex items-center gap-1.5 truncate">
                    <img
                      src={targetFlagUrl}
                      alt={targetPlayer.nationality}
                      referrerPolicy="no-referrer"
                      className="w-4 h-3 object-cover border border-black/40 flex-shrink-0"
                    />
                    <span>
                      País: <strong className="text-[#FFDF00]">{targetPlayer.nationality}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Posição: <strong className="text-[#00DF81]">{targetPlayer.position}</strong>
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between p-1 bg-black/40 border border-gray-800 text-[10px] text-gray-400 font-sans">
                  <span className="font-arcade text-[8px] text-gray-500">DICA 1 (País & Posição)</span>
                  <span className="text-gray-400 font-arcade text-[9px]">
                    Libera em {5 - guesses.length} {5 - guesses.length === 1 ? 'chute' : 'chutes'}
                  </span>
                </div>
              )}

              {/* Dica 2: Liberada com 10 tentativas */}
              {guesses.length >= 10 ? (
                <div className="flex items-center gap-2 p-1.5 bg-[#FFDF00]/15 border border-[#FFDF00] text-white text-[11px] font-sans animate-fadeIn">
                  <span className="font-arcade text-[9px] bg-[#FFDF00] text-black px-1.5 py-0.2 font-bold flex-shrink-0">
                    DICA 2
                  </span>
                  <div className="flex items-center gap-1.5 truncate">
                    <span>
                      Idade: <strong className="text-[#FFDF00]">{targetPlayer.age} anos</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Pé: <strong className="text-[#00DF81]">{targetPlayer.pe_dominante}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Inicial: <strong className="text-[#FFDF00]">"{targetPlayer.name[0]?.toUpperCase()}"</strong>
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between p-1 bg-black/40 border border-gray-800 text-[10px] text-gray-400 font-sans">
                  <span className="font-arcade text-[8px] text-gray-500">DICA 2 (Idade, Pé & Inicial)</span>
                  <span className="text-gray-400 font-arcade text-[9px]">
                    {guesses.length < 5
                      ? 'Requer 10 chutes'
                      : `Libera em ${10 - guesses.length} ${10 - guesses.length === 1 ? 'chute' : 'chutes'}`}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tentativas Anteriores */}
        {guesses.length > 0 && !isRevealed && (
          <div className="w-full mt-1 flex flex-wrap items-center gap-1.5 justify-center">
            <span className="text-[9px] font-arcade text-gray-400">TENTATIVAS:</span>
            {guesses.map((g, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 bg-[#EF4444]/20 border border-[#EF4444] text-[#EF4444] font-display font-bold text-[10px]"
              >
                ✕ {g}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
