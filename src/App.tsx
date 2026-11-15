import React, { useState, useEffect } from 'react';
import playersData from './data/players.json';
import type { Player, GuessResult, GameStats } from './types/player';
import {
  getDailySecretPlayer,
  compareGuess,
  loadDailyGuesses,
  saveDailyGuesses,
  loadDailyWon,
  saveDailyWon,
  loadGameStats,
  updateGameStatsOnWin,
} from './utils/gameLogic';
import { Header } from './components/Header';
import { MainMenu } from './components/MainMenu';
import { PlayerSearch } from './components/PlayerSearch';
import { GuessTable } from './components/GuessTable';
import { Legend } from './components/Legend';
import { WinModal } from './components/WinModal';
import { StatsModal } from './components/StatsModal';
import { HowToPlayModal } from './components/HowToPlayModal';
import { GridMode } from './components/GridMode';

export const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<'menu' | 'classic' | 'grid'>('menu');
  const [secretPlayer, setSecretPlayer] = useState<Player>(() => getDailySecretPlayer());
  const [guesses, setGuesses] = useState<GuessResult[]>(() => loadDailyGuesses());
  const [isWon, setIsWon] = useState<boolean>(() => loadDailyWon());
  const [stats, setStats] = useState<GameStats>(() => loadGameStats());

  const [isWinModalOpen, setIsWinModalOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);

  // Recalcular jogador secreto e sincronizar ao montar
  useEffect(() => {
    const dailySecret = getDailySecretPlayer(playersData as Player[]);
    setSecretPlayer(dailySecret);
  }, []);

  const handleSelectPlayer = (player: Player) => {
    if (isWon) return;

    const result = compareGuess(player, secretPlayer);
    const updatedGuesses = [...guesses, result];
    setGuesses(updatedGuesses);
    saveDailyGuesses(updatedGuesses);

    if (result.isCorrect) {
      setIsWon(true);
      saveDailyWon(true);
      const updatedStats = updateGameStatsOnWin(updatedGuesses.length);
      setStats(updatedStats);
      setIsWinModalOpen(true);
    }
  };

  const alreadyGuessedIds = guesses.map((g) => g.player.id);

  return (
    <div className="relative min-h-screen text-white font-sans-body selection:bg-[#B8FF01] selection:text-black">
      {/* Imagem de Fundo Fixa do Pebolim + Vinheta Escura */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-fixed pointer-events-none"
        style={{
          backgroundImage: `url('https://nelsonbalaban.com/wp-content/uploads/2020/04/nike-pebolim.jpg')`,
        }}
      />
      <div className="fixed inset-0 z-0 bg-[#08091A]/80 backdrop-brightness-75 pointer-events-none" />

      {/* Camada CRT Scanlines */}
      <div className="crt-overlay fixed inset-0 z-10 pointer-events-none" />

      {/* Conteúdo Principal */}
      <div className="relative z-20 flex flex-col min-h-screen">
        {/* Header Superior */}
        <Header
          currentScreen={currentScreen}
          onNavigate={(screen) => setCurrentScreen(screen)}
          onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
          onOpenStats={() => setIsStatsModalOpen(true)}
          streak={stats.currentStreak}
        />

        {/* Telas de Navegação */}
        <main className="flex-1 flex flex-col items-center justify-start pb-12">
          {currentScreen === 'menu' && (
            <MainMenu
              onStartClassic={() => setCurrentScreen('classic')}
              onStartGrid={() => setCurrentScreen('grid')}
              stats={stats}
            />
          )}

          {currentScreen === 'classic' && (
            <div className="w-full max-w-4xl px-4 py-4 animate-fadeIn">
              {/* Painel Central Arcade do Modo Clássico */}
              <div className="relative w-full bg-[#0A0B1E]/95 border-4 border-[#6D28D9] p-4 sm:p-6 shadow-arcade-lg">
                {/* Cantoneiras Pixel Verde Limão */}
                <div className="absolute top-1.5 left-1.5 w-3.5 h-3.5 bg-[#B8FF01]" />
                <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-[#B8FF01]" />
                <div className="absolute bottom-1.5 left-1.5 w-3.5 h-3.5 bg-[#B8FF01]" />
                <div className="absolute bottom-1.5 right-1.5 w-3.5 h-3.5 bg-[#B8FF01]" />

                {/* Título do Painel */}
                <div className="text-center mb-2">
                  <span className="font-arcade text-xs sm:text-sm text-[#B8FF01] tracking-widest">
                    ❖ ADIVINHE O CRAQUE DE HOJE! ❖
                  </span>
                  <p className="font-sans text-xs text-gray-300 mt-1">
                    Um jogador diferente do Brasileirão Série A a cada dia
                  </p>
                </div>

                {/* Input de Busca com Autocomplete e Foto */}
                <PlayerSearch
                  players={playersData as Player[]}
                  alreadyGuessedIds={alreadyGuessedIds}
                  onSelectPlayer={handleSelectPlayer}
                  disabled={isWon}
                />

                {/* Se já acertou, banner de atalho para reabrir o modal */}
                {isWon && (
                  <div className="my-3 text-center">
                    <button
                      onClick={() => setIsWinModalOpen(true)}
                      className="px-4 py-2 bg-[#22C55E] hover:bg-[#1fa951] text-black font-arcade text-xs border-2 border-black shadow-arcade-sm cursor-pointer font-bold inline-flex items-center gap-2"
                    >
                      ★ VER RESULTADO & COMPARTILHAR ★
                    </button>
                  </div>
                )}

                {/* Tabela de Chutes com Animação Flip */}
                <GuessTable guesses={guesses} />

                {/* Legenda de Cores */}
                <Legend />
              </div>
            </div>
          )}

          {currentScreen === 'grid' && (
            <GridMode
              players={playersData as Player[]}
              onBack={() => setCurrentScreen('menu')}
            />
          )}
        </main>

        {/* Rodapé Retrô */}
        <footer className="w-full text-center py-4 border-t border-[#6D28D9]/40 bg-[#08091A]/80 text-[11px] font-arcade text-gray-400">
          BRASILEIRÃODLE © 2026 ❖ FEITO COM PAIXÃO PELO FUTEBOL BRASILEIRO
        </footer>
      </div>

      {/* Modais */}
      <WinModal
        isOpen={isWinModalOpen}
        onClose={() => setIsWinModalOpen(false)}
        secretPlayer={secretPlayer}
        guesses={guesses}
      />

      <StatsModal
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
        stats={stats}
      />

      <HowToPlayModal
        isOpen={isHowToPlayOpen}
        onClose={() => setIsHowToPlayOpen(false)}
      />
    </div>
  );
};

export default App;
