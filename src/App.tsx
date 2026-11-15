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
    <div className="relative h-screen overflow-hidden flex flex-col justify-between text-white font-sans-body selection:bg-[#FFDF00] selection:text-black">
      {/* Imagem de Fundo Fixa do Pebolim + Vinheta Escura Verde Floresta */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-fixed pointer-events-none"
        style={{
          backgroundImage: `url('https://nelsonbalaban.com/wp-content/uploads/2020/04/nike-pebolim.jpg')`,
        }}
      />
      <div className="fixed inset-0 z-0 bg-[#061A12]/88 backdrop-brightness-75 pointer-events-none" />

      {/* Camada CRT Scanlines */}
      <div className="crt-overlay fixed inset-0 z-10 pointer-events-none" />

      {/* Conteúdo Principal com Layout Zero Scroll */}
      <div className="relative z-20 flex flex-col h-full justify-between">
        {/* Header Superior Compacto (h-12) */}
        <Header
          currentScreen={currentScreen}
          onNavigate={(screen) => setCurrentScreen(screen)}
          onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
          onOpenStats={() => setIsStatsModalOpen(true)}
          streak={stats.currentStreak}
        />

        {/* Telas de Navegação (Zero Scroll na Janela) */}
        <main className="flex-1 flex flex-col items-center justify-center overflow-hidden px-2 sm:px-4 py-1">
          {currentScreen === 'menu' && (
            <MainMenu
              onStartClassic={() => setCurrentScreen('classic')}
              onStartGrid={() => setCurrentScreen('grid')}
              stats={stats}
            />
          )}

          {currentScreen === 'classic' && (
            <div className="w-full max-w-4xl px-2 py-1 my-auto flex flex-col max-h-[calc(100vh-76px)] overflow-hidden animate-fadeIn">
              {/* Painel Central Arcade do Modo Clássico */}
              <div className="relative w-full bg-[#061A12]/95 border-4 border-[#FFDF00] p-3 sm:p-4 shadow-arcade-lg flex flex-col overflow-hidden">
                {/* Cantoneiras Pixel Verde Neon e Branco */}
                <div className="absolute top-1 left-1 w-3 h-3 bg-[#00DF81]" />
                <div className="absolute top-1 right-1 w-3 h-3 bg-[#FFFFFF]" />
                <div className="absolute bottom-1 left-1 w-3 h-3 bg-[#FFFFFF]" />
                <div className="absolute bottom-1 right-1 w-3 h-3 bg-[#00DF81]" />

                {/* Título do Painel */}
                <div className="text-center mb-1 select-none">
                  <span className="font-arcade text-[10px] sm:text-xs text-[#00DF81] tracking-widest uppercase">
                    ❖ ADIVINHE O CRAQUE DE HOJE! ❖
                  </span>
                </div>

                {/* Input de Busca com Autocomplete e Foto */}
                <PlayerSearch
                  players={playersData as Player[]}
                  alreadyGuessedIds={alreadyGuessedIds}
                  onSelectPlayer={handleSelectPlayer}
                  disabled={isWon}
                />

                {/* Se já acertou, banner de atalho */}
                {isWon && (
                  <div className="my-1 text-center">
                    <button
                      onClick={() => setIsWinModalOpen(true)}
                      className="px-3 py-1 bg-[#22C55E] hover:bg-[#1fa951] text-black font-display font-black text-xs border-2 border-black shadow-arcade-sm cursor-pointer inline-flex items-center gap-1.5"
                    >
                      ★ VER RESULTADO & COMPARTILHAR ★
                    </button>
                  </div>
                )}

                {/* Tabela de Chutes com Scroll Interno (Zero Scroll na Janela) */}
                <GuessTable guesses={guesses} />

                {/* Legenda de Cores em 1 Linha Compacta */}
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

        {/* Rodapé Retrô Compacto */}
        <footer className="w-full text-center py-1 border-t border-[#FFDF00]/30 bg-[#04160E]/90 text-[10px] font-display text-gray-300 select-none">
          CRAQUEDLE © 2026 ❖ EDIÇÃO BRASILEIRÃO SÉRIE A ❖ FEITO COM PAIXÃO PELO FUTEBOL
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
