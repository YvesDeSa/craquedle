import type { Player, GuessResult, MatchStatus, Direction, GameStats } from '../types/player';
import playersData from '../data/players.json';

const STORAGE_KEYS = {
  GUESSES: 'craquedle_state_v32_guesses_',
  WON: 'craquedle_state_v32_won_',
  STATS: 'craquedle_state_v32_stats',
};

// Obter a data atual no Fuso Horário de Brasília (UTC-3)
export function getBrasiliaDateString(): string {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  };
  const formatter = new Intl.DateTimeFormat('pt-BR', options);
  const parts = formatter.formatToParts(now);

  const day = parts.find((p) => p.type === 'day')?.value || '01';
  const month = parts.find((p) => p.type === 'month')?.value || '01';
  const year = parts.find((p) => p.type === 'year')?.value || '2026';

  return `${year}-${month}-${day}`;
}

// Obter número do dia (dias desde a data de lançamento base)
export function getDayNumber(): number {
  const baseDate = new Date('2026-01-01T00:00:00-03:00').getTime();
  const todayDate = new Date(`${getBrasiliaDateString()}T00:00:00-03:00`).getTime();
  const diffDays = Math.floor((todayDate - baseDate) / (1000 * 60 * 60 * 24));
  return Math.max(1, diffDays + 1);
}

// Tempo até a meia-noite no fuso de Brasília
export function getTimeUntilMidnightBrasilia(): { hours: number; minutes: number; seconds: number } {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const brasiliaTime = new Date(utc - 3 * 3600000);

  const midnight = new Date(brasiliaTime);
  midnight.setHours(24, 0, 0, 0);

  const diff = midnight.getTime() - brasiliaTime.getTime();
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  return { hours, minutes, seconds };
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

// Helper para converter altura string ("1.85 m" ou "1,85m") em número float em metros
export function parseHeightMeters(h: string | undefined): number {
  if (!h) return 0;
  const numStr = h.replace(',', '.').replace(/[^\d.]/g, '');
  const val = parseFloat(numStr);
  if (isNaN(val)) return 0;
  // Se vier em cm (ex: 185) converte para metros (1.85)
  if (val > 3) return val / 100;
  return val;
}

// Comparação estrita do jogador chutado com o secreto
export function compareGuess(guessed: Player, secret: Player): GuessResult {
  // 1. Time
  const teamMatch: MatchStatus =
    guessed.team.toLowerCase() === secret.team.toLowerCase() ? 'CORRECT' : 'INCORRECT';

  // 2. Idade - Estritamente Binária (sem amarelo de proximidade)
  const ageMatchStatus: MatchStatus = guessed.age === secret.age ? 'CORRECT' : 'INCORRECT';
  let ageDirection: Direction = 'EQUAL';
  if (secret.age > guessed.age) {
    ageDirection = 'HIGHER'; // Segredo é mais velho (↑)
  } else if (secret.age < guessed.age) {
    ageDirection = 'LOWER'; // Segredo é mais novo (↓)
  }

  // 3. Altura - Estritamente Binária (sem amarelo de proximidade)
  const gHeight = parseHeightMeters(guessed.altura);
  const sHeight = parseHeightMeters(secret.altura);
  const isHeightEqual = Math.abs(gHeight - sHeight) < 0.005;
  const alturaMatchStatus: MatchStatus = isHeightEqual ? 'CORRECT' : 'INCORRECT';
  let alturaDirection: Direction = 'EQUAL';
  if (sHeight > gHeight + 0.005) {
    alturaDirection = 'HIGHER'; // Segredo é mais alto (↑)
  } else if (sHeight < gHeight - 0.005) {
    alturaDirection = 'LOWER'; // Segredo é mais baixo (↓)
  }

  // 4. Posição
  const positionMatch: MatchStatus =
    guessed.position === secret.position ? 'CORRECT' : 'INCORRECT';

  // 5. Pé Dominante (Coluna própria: Destro, Canhoto ou Ambidestro)
  const peMatch: MatchStatus =
    guessed.pe_dominante &&
    secret.pe_dominante &&
    guessed.pe_dominante.toLowerCase() === secret.pe_dominante.toLowerCase()
      ? 'CORRECT'
      : 'INCORRECT';

  // 6. Nacionalidade
  const nationalityMatch: MatchStatus =
    normalizeText(guessed.nationality) === normalizeText(secret.nationality)
      ? 'CORRECT'
      : 'INCORRECT';

  // 6. Títulos (Brasileirão, Copa do Brasil, Libertadores, Sul-Americana) - Mantém PARTIAL (amarelo)
  const gTrophies = guessed.trophies;
  const sTrophies = secret.trophies;

  const isExactTrophies =
    gTrophies.brasileirao === sTrophies.brasileirao &&
    gTrophies.copaDoBrasil === sTrophies.copaDoBrasil &&
    gTrophies.libertadores === sTrophies.libertadores &&
    gTrophies.sulamericana === sTrophies.sulamericana;

  const hasCommonPositive =
    (gTrophies.brasileirao && sTrophies.brasileirao) ||
    (gTrophies.copaDoBrasil && sTrophies.copaDoBrasil) ||
    (gTrophies.libertadores && sTrophies.libertadores) ||
    (gTrophies.sulamericana && sTrophies.sulamericana);

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
      status: ageMatchStatus,
      direction: ageDirection,
    },
    alturaMatch: {
      value: guessed.altura,
      status: alturaMatchStatus,
      direction: alturaDirection,
    },
    positionMatch,
    peMatch,
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
  if (trophies.sulamericana) parts.push('SULA');
  return parts.length > 0 ? parts.join(', ') : 'Nenhum';
}

// Gerador de resultado compartilhável em emojis
export function generateShareText(guesses: GuessResult[], isWon: boolean): string {
  const dayNumber = getDayNumber();
  const count = guesses.length;
  let text = `⚽ CRAQUEDLE #${dayNumber} ${isWon ? `(${count}/∞)` : '❌'}\n\n`;

  guesses.forEach((g) => {
    const teamEmoji = g.teamMatch === 'CORRECT' ? '🟩' : '🟥';
    const ageEmoji = g.ageMatch.status === 'CORRECT' ? '🟩' : '🟥';
    const alturaEmoji = g.alturaMatch.status === 'CORRECT' ? '🟩' : '🟥';
    const posEmoji = g.positionMatch === 'CORRECT' ? '🟩' : '🟥';
    const natEmoji = g.nationalityMatch === 'CORRECT' ? '🟩' : '🟥';
    let trofEmoji = '🟥';
    if (g.trophiesMatch.status === 'CORRECT') trofEmoji = '🟩';
    else if (g.trophiesMatch.status === 'PARTIAL') trofEmoji = '🟨';

    text += `${teamEmoji}${ageEmoji}${alturaEmoji}${posEmoji}${natEmoji}${trofEmoji}\n`;
  });

  text += `\njogue em: craquedle.app`;
  return text;
}

// Persistência Diária no LocalStorage
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
    console.error('Erro ao salvar palpites:', e);
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
    console.error('Erro ao salvar vitória:', e);
  }
}

// Estatísticas Globais do Jogador
export function loadGameStats(): GameStats {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.STATS);
    if (data) {
      const parsed = JSON.parse(data);
      // Se já tem dados válidos gravados, retorna diretamente
      if (parsed.gamesPlayed > 0 || parsed.gamesWon > 0) {
        return parsed;
      }
    }

    // Auto-recuperação de estatísticas a partir do progresso salvo no localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      const playedDates = new Set<string>();
      const wonDates = new Set<string>();

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key) continue;

        if (key.includes('craquedle_') && key.includes('_progress_')) {
          try {
            const raw = localStorage.getItem(key);
            if (!raw) continue;
            const parsed = JSON.parse(raw);
            const dateMatch = key.match(/\d{4}-\d{2}-\d{2}/);
            const date = dateMatch ? dateMatch[0] : '';

            if (key.includes('_classic')) {
              if (parsed.guesses && parsed.guesses.length > 0) {
                if (date) playedDates.add(date);
                if (parsed.isWon && date) wonDates.add(date);
              }
            } else if (key.includes('_grid')) {
              const filled = Array.isArray(parsed) ? parsed.flat().filter(Boolean).length : 0;
              if (filled > 0 && date) playedDates.add(date);
              if (filled === 9 && date) wonDates.add(date);
            } else if (key.includes('_career')) {
              const count = parsed.completedPlayerIds ? parsed.completedPlayerIds.length : 0;
              if (count > 0 && date) playedDates.add(date);
              if (parsed.isAllCompleted && date) wonDates.add(date);
            } else if (key.includes('_blur')) {
              const count = parsed.guessIds ? parsed.guessIds.length : 0;
              if (count > 0 && date) playedDates.add(date);
              if (parsed.isWon && date) wonDates.add(date);
            }
          } catch {}
        }
      }

      if (playedDates.size > 0 || wonDates.size > 0) {
        const sortedWon = Array.from(wonDates).sort();
        const lastWon = sortedWon[sortedWon.length - 1];
        const recoveredStats: GameStats = {
          gamesPlayed: Math.max(playedDates.size, wonDates.size),
          gamesWon: wonDates.size,
          currentStreak: wonDates.size > 0 ? 1 : 0,
          maxStreak: wonDates.size > 0 ? 1 : 0,
          lastPlayedDate: Array.from(playedDates).sort().pop(),
          lastWonDate: lastWon,
          guessesDistribution: {},
        };
        localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(recoveredStats));
        return recoveredStats;
      }
    }

    return {
      gamesPlayed: 0,
      gamesWon: 0,
      currentStreak: 0,
      maxStreak: 0,
      guessesDistribution: {},
    };
  } catch {
    return {
      gamesPlayed: 0,
      gamesWon: 0,
      currentStreak: 0,
      maxStreak: 0,
      guessesDistribution: {},
    };
  }
}

export function recordGamePlayed(): GameStats {
  const current = loadGameStats();
  const todayStr = getBrasiliaDateString();

  if (current.lastPlayedDate === todayStr) {
    return current;
  }

  const updated: GameStats = {
    ...current,
    gamesPlayed: current.gamesPlayed + 1,
    lastPlayedDate: todayStr,
  };

  try {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(updated));
  } catch (e) {
    console.error('Erro ao salvar estatísticas:', e);
  }

  return updated;
}

export function updateGameStatsOnWin(guessCount: number): GameStats {
  const current = loadGameStats();
  const todayStr = getBrasiliaDateString();

  if (current.lastWonDate === todayStr) {
    return current;
  }

  let currentStreak = 1;
  if (current.lastWonDate) {
    const prevDate = new Date(`${current.lastWonDate}T12:00:00Z`).getTime();
    const currDate = new Date(`${todayStr}T12:00:00Z`).getTime();
    const diffDays = Math.round((currDate - prevDate) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      currentStreak = (current.currentStreak || 0) + 1;
    } else if (diffDays === 0) {
      currentStreak = Math.max(1, current.currentStreak || 1);
    } else {
      currentStreak = 1;
    }
  }

  const maxStreak = Math.max(currentStreak, current.maxStreak || 0);
  const guessesDistribution = current.guessesDistribution || {};
  if (guessCount > 0) {
    guessesDistribution[guessCount] = (guessesDistribution[guessCount] || 0) + 1;
  }

  const gamesPlayed = current.lastPlayedDate === todayStr ? current.gamesPlayed : current.gamesPlayed + 1;

  const updated: GameStats = {
    gamesPlayed,
    gamesWon: current.gamesWon + 1,
    currentStreak,
    maxStreak,
    lastPlayedDate: todayStr,
    lastWonDate: todayStr,
    guessesDistribution,
  };

  try {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(updated));
  } catch (e) {
    console.error('Erro ao salvar estatísticas:', e);
  }

  return updated;
}
