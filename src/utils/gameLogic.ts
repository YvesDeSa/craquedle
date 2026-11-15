import type { Player, GuessResult, MatchStatus, Direction, GameStats } from '../types/player';
import playersData from '../data/players.json';

const STORAGE_KEYS = {
  GUESSES: 'brasileiraodle_guesses_',
  WON: 'brasileiraodle_won_',
  STATS: 'brasileiraodle_stats',
};

// Obter a data atual no Fuso Horário de Brasília (UTC-3)
export function getBrasiliaDateString(): string {
  const now = new Date();
  // Formatar em UTC-3
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  };
  const formatter = new Intl.DateTimeFormat('pt-BR', options);
  const parts = formatter.formatToParts(now);
  
  const day = parts.find(p => p.type === 'day')?.value || '01';
  const month = parts.find(p => p.type === 'month')?.value || '01';
  const year = parts.find(p => p.type === 'year')?.value || '2026';

  return `${year}-${month}-${day}`;
}

// Obter número do dia (dias desde a data de lançamento fictícia ou base)
export function getDayNumber(): number {
  const baseDate = new Date('2026-01-01T00:00:00-03:00').getTime();
  const todayDate = new Date(`${getBrasiliaDateString()}T00:00:00-03:00`).getTime();
  const diffDays = Math.floor((todayDate - baseDate) / (1000 * 60 * 60 * 24));
  return Math.max(1, diffDays + 1);
}

// Hash determinístico simples
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

// Sorteio determinístico diário
export function getDailySecretPlayer(players: Player[] = playersData as Player[]): Player {
  const dateStr = getBrasiliaDateString();
  const seed = simpleHash(dateStr);
  const index = seed % players.length;
  return players[index];
}

// Normalizador de texto para pesquisa (sem acento, lowercase)
export function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

// Comparação do jogador chutado com o secreto
export function compareGuess(guessed: Player, secret: Player): GuessResult {
  // 1. Time
  const teamMatch: MatchStatus = guessed.team.toLowerCase() === secret.team.toLowerCase() ? 'CORRECT' : 'INCORRECT';

  // 2. Idade
  const ageDiff = Math.abs(guessed.age - secret.age);
  let ageStatus: MatchStatus = 'INCORRECT';
  if (guessed.age === secret.age) {
    ageStatus = 'CORRECT';
  } else if (ageDiff <= 2) {
    ageStatus = 'PARTIAL';
  }

  let ageDirection: Direction = 'EQUAL';
  if (secret.age > guessed.age) {
    ageDirection = 'HIGHER'; // Segredo é mais velho (↑)
  } else if (secret.age < guessed.age) {
    ageDirection = 'LOWER'; // Segredo é mais novo (↓)
  }

  // 3. Posição
  const positionMatch: MatchStatus = guessed.position === secret.position ? 'CORRECT' : 'INCORRECT';

  // 4. Nacionalidade
  const nationalityMatch: MatchStatus =
    normalizeText(guessed.nationality) === normalizeText(secret.nationality) ? 'CORRECT' : 'INCORRECT';

  // 5. Títulos (Brasileirão, Copa do Brasil, Libertadores)
  const gTrophies = guessed.trophies;
  const sTrophies = secret.trophies;

  const isExactTrophies =
    gTrophies.brasileirao === sTrophies.brasileirao &&
    gTrophies.copaDoBrasil === sTrophies.copaDoBrasil &&
    gTrophies.libertadores === sTrophies.libertadores;

  // Verifica se há pelo menos 1 título em comum positivo
  const hasCommonPositive =
    (gTrophies.brasileirao && sTrophies.brasileirao) ||
    (gTrophies.copaDoBrasil && sTrophies.copaDoBrasil) ||
    (gTrophies.libertadores && sTrophies.libertadores);

  let trophiesStatus: MatchStatus = 'INCORRECT';
  if (isExactTrophies) {
    trophiesStatus = 'CORRECT';
  } else if (hasCommonPositive) {
    trophiesStatus = 'PARTIAL';
  }

  const isCorrect = guessed.id === secret.id;

  return {
    player: guessed,
    teamMatch,
    ageMatch: {
      value: guessed.age,
      status: ageStatus,
      direction: ageDirection,
    },
    positionMatch,
    nationalityMatch,
    trophiesMatch: {
      value: guessed.trophies,
      status: trophiesStatus,
    },
    isCorrect,
  };
}

// Formatação do resumo de troféus para o card
export function formatTrophiesSummary(trophies: Player['trophies']): string {
  const parts: string[] = [];
  if (trophies.brasileirao) parts.push('BR');
  if (trophies.copaDoBrasil) parts.push('CdB');
  if (trophies.libertadores) parts.push('LIB');
  return parts.length > 0 ? parts.join(', ') : 'Nenhum';
}

// Gerador de resultado compartilhável em emojis
export function generateShareText(guesses: GuessResult[], isWon: boolean): string {
  const dayNumber = getDayNumber();
  const count = guesses.length;
  let text = `⚽ BRASILEIRÃODLE #${dayNumber} ${isWon ? `(${count}/∞)` : '❌'}\n\n`;

  guesses.forEach((g) => {
    // Time
    const teamEmoji = g.teamMatch === 'CORRECT' ? '🟩' : '🟥';
    
    // Idade
    let ageEmoji = '🟥';
    if (g.ageMatch.status === 'CORRECT') {
      ageEmoji = '🟩';
    } else if (g.ageMatch.status === 'PARTIAL') {
      ageEmoji = '🟨';
    }
    const arrowEmoji = g.ageMatch.direction === 'HIGHER' ? '⬆️' : g.ageMatch.direction === 'LOWER' ? '⬇️' : '';

    // Posição
    const posEmoji = g.positionMatch === 'CORRECT' ? '🟩' : '🟥';

    // País
    const natEmoji = g.nationalityMatch === 'CORRECT' ? '🟩' : '🟥';

    // Títulos
    let tropEmoji = '🟥';
    if (g.trophiesMatch.status === 'CORRECT') {
      tropEmoji = '🟩';
    } else if (g.trophiesMatch.status === 'PARTIAL') {
      tropEmoji = '🟨';
    }

    text += `${teamEmoji}${ageEmoji}${arrowEmoji}${posEmoji}${natEmoji}${tropEmoji}\n`;
  });

  text += `\nJogue em: https://brasileiraodle.vercel.app`;
  return text;
}

// Gerenciamento de Estatísticas e Progresso Diário
export function loadDailyGuesses(): GuessResult[] {
  try {
    const dateStr = getBrasiliaDateString();
    const data = localStorage.getItem(STORAGE_KEYS.GUESSES + dateStr);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveDailyGuesses(guesses: GuessResult[]): void {
  try {
    const dateStr = getBrasiliaDateString();
    localStorage.setItem(STORAGE_KEYS.GUESSES + dateStr, JSON.stringify(guesses));
  } catch (e) {
    console.error('Erro ao salvar palpites', e);
  }
}

export function loadDailyWon(): boolean {
  try {
    const dateStr = getBrasiliaDateString();
    return localStorage.getItem(STORAGE_KEYS.WON + dateStr) === 'true';
  } catch {
    return false;
  }
}

export function saveDailyWon(won: boolean): void {
  try {
    const dateStr = getBrasiliaDateString();
    localStorage.setItem(STORAGE_KEYS.WON + dateStr, won ? 'true' : 'false');
  } catch (e) {
    console.error('Erro ao salvar status de vitória', e);
  }
}

export function loadGameStats(): GameStats {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.STATS);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Erro ao carregar estatísticas', e);
  }
  return {
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
  };
}

export function updateGameStatsOnWin(totalGuesses: number): GameStats {
  const stats = loadGameStats();
  const dateStr = getBrasiliaDateString();

  if (stats.lastWonDate === dateStr) {
    return stats; // Já pontuou hoje
  }

  const prevWonDate = stats.lastWonDate;
  let newStreak = stats.currentStreak + 1;

  // Se perdeu mais de 1 dia, reseta a streak para 1
  if (prevWonDate) {
    const prevTime = new Date(`${prevWonDate}T00:00:00-03:00`).getTime();
    const currTime = new Date(`${dateStr}T00:00:00-03:00`).getTime();
    const diffDays = Math.round((currTime - prevTime) / (1000 * 60 * 60 * 24));
    if (diffDays > 1) {
      newStreak = 1;
    }
  }

  const maxStreak = Math.max(stats.maxStreak, newStreak);
  const gamesPlayed = stats.gamesPlayed + 1;
  const gamesWon = stats.gamesWon + 1;

  const distribution = stats.guessesDistribution || {};
  distribution[totalGuesses] = (distribution[totalGuesses] || 0) + 1;

  const updated: GameStats = {
    gamesPlayed,
    gamesWon,
    currentStreak: newStreak,
    maxStreak,
    lastPlayedDate: dateStr,
    lastWonDate: dateStr,
    guessesDistribution: distribution,
  };

  try {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(updated));
  } catch (e) {
    console.error('Erro ao salvar estatísticas', e);
  }

  return updated;
}

// Tempo restante até a próxima meia-noite em Brasília
export function getTimeUntilMidnightBrasilia(): { hours: number; minutes: number; seconds: number } {
  const now = new Date();
  
  // Obter hora atual em Brasília
  const brasiliaFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Sao_Paulo',
    hour12: false,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  });
  
  const bParts = brasiliaFormatter.formatToParts(now);
  const getPart = (type: string) => parseInt(bParts.find(p => p.type === type)?.value || '0', 10);
  
  const bHour = getPart('hour');
  const bMin = getPart('minute');
  const bSec = getPart('second');

  const secondsPassedToday = bHour * 3600 + bMin * 60 + bSec;
  const secondsLeft = 86400 - secondsPassedToday;

  const hours = Math.floor(secondsLeft / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const seconds = secondsLeft % 60;

  return { hours, minutes, seconds };
}
