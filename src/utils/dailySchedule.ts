import type { Player, GuessResult } from '../types/player';
import dailyGridsData from '../data/dailyGrids.json';
import { getClubLogoUrl } from './clubLogos';

export interface DailyGridMatrix {
  cols: { id: string; label: string; logo: string }[];
  rows: { id: string; label: string; logo: string }[];
}

export type CareerDifficulty = 'Fácil' | 'Médio' | 'Difícil' | 'Extremo';

export interface DailyChallenges {
  date: string;
  dayNumber: number;
  classicPlayer: Player;
  gridMatrix: DailyGridMatrix;
  careerPlayers: Player[]; // 4 jogadores em sequência para "Quem é esse Jogador?" (Fácil, Médio, Difícil, Extremo)
  careerDifficulties: CareerDifficulty[]; // Classificação de dificuldade dos 4 desafios
  blurPlayer: Player; // Jogador do 4º jogo "Craque em Foco" (foto embaçada), mesmas regras do Clássico
}

export type BlurMode = 'normal' | 'hard';

export interface BlurProgress {
  guessIds: number[];
  isWon: boolean;
  mode: BlurMode;
}

export interface DayProgressSummary {
  date: string;
  classicCompleted: boolean;
  classicAttempts: number;
  gridCompletedCount: number; // 0 a 9
  gridIsComplete: boolean;
  careerCompletedCount: number; // 0 a 4
  careerIsComplete: boolean;
}

// Chave base de armazenamento
export const STORAGE_PREFIX = 'craquedle_state_v32';

// Hash determinístico simples para gerar seeds estáveis por data
export function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

// Data atual no fuso de Brasília (UTC-3)
export function getBrasiliaDateString(d?: Date): string {
  const now = d || new Date();
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

// Retorna lista com os últimos N dias para o Modo Arquivo
export function getPastDates(count = 30): string[] {
  const dates: string[] = [];
  const todayStr = getBrasiliaDateString();
  const [year, month, day] = todayStr.split('-').map(Number);
  const base = new Date(year!, month! - 1, day!, 12, 0, 0);

  for (let i = 0; i < count; i++) {
    const target = new Date(base.getTime() - i * 24 * 60 * 60 * 1000);
    dates.push(getBrasiliaDateString(target));
  }
  return dates;
}

// Gera o número do dia civil a partir da data de lançamento
export function getDayNumberForDate(dateStr: string): number {
  const baseDate = new Date('2026-01-01T00:00:00-03:00').getTime();
  const targetDate = new Date(`${dateStr}T00:00:00-03:00`).getTime();
  const diffDays = Math.floor((targetDate - baseDate) / (1000 * 60 * 60 * 24));
  return Math.max(1, diffDays + 1);
}

/**
 * Filtro de relevância para o Modo Clássico:
 * Garante que o Jogador do Dia seja sempre um atleta reconhecido, titular ou de alta relevância
 * no futebol brasileiro/internacional, descartando reservas obscuros, terceiros goleiros ou atletas da base.
 */
export function isClassicEligible(p: Player): boolean {
  // Deve possuir foto oficial
  if (!p.photo) return false;

  const currentVal = p.marketValue || 0;
  const highestVal = p.highestMarketValue || 0;
  const hasTrophy = Boolean(
    p.trophies?.brasileirao ||
    p.trophies?.copaDoBrasil ||
    p.trophies?.libertadores ||
    p.trophies?.sulamericana
  );

  // Exclusões explícitas de baixa expressão/minutagem na Série A
  if (p.name === 'Guido Herrera') return false;

  // 1. Alto valor de mercado atual na Série A: >= €2.000.000 (titulares consolidados e estrelas)
  if (currentVal >= 2_000_000) return true;

  // 2. Campeões de grandes competições (Brasileirão, Copa do Brasil, Libertadores, Sul-Americana) com relevância esportiva
  if (hasTrophy && (highestVal >= 1_500_000 || currentVal >= 400_000)) return true;

  // 3. Craques consagrados / veteranos de alto escalão (Pico histórico >= €7.000.000 e valor atual >= €300.000)
  // Ex: Thiago Silva, Marcelo, David Luiz, Coutinho, Ganso, Everson, Lucas Moura, etc.
  if (highestVal >= 7_000_000 && currentVal >= 300_000) return true;

  // 4. Superestrelas com pico altíssimo (>= €15.000.000) independente do valor presente (ex: Neymar Jr)
  if (highestVal >= 15_000_000) return true;

  return false;
}

/**
 * Classificação em 4 Níveis (Tiers) para o mini-game "Quem é esse Jogador?":
 * - Fácil: Superestrelas, atletas de altíssimo valor de mercado e passagens icônicas por gigantes europeus/Seleção.
 * - Médio: Titulares consolidados da Série A ou atletas com passagens por 3 a 4 clubes tradicionais do Brasil.
 * - Difícil: "Jornadeiros" do futebol, jogadores com histórico longo de empréstimos internacionais ou múltiplos clubes.
 * - Extremo: Atletas menos badalados com passagens ramificadas por clubes de menor expressão.
 */
export function getCareerDifficulty(p: Player): CareerDifficulty {
  const clubsCount = Math.max(p.careerTeams?.length || 0, p.careerHistory?.length || 0);
  const currentVal = p.marketValue || 0;
  const highestVal = p.highestMarketValue || 0;
  const hasTrophy = Boolean(
    p.trophies?.brasileirao ||
    p.trophies?.copaDoBrasil ||
    p.trophies?.libertadores ||
    p.trophies?.sulamericana
  );

  // 1. Fácil: Superestrelas / altíssimo valor ou ícones com passagens icônicas
  if (
    highestVal >= 15_000_000 ||
    currentVal >= 7_000_000 ||
    (hasTrophy && highestVal >= 10_000_000 && currentVal >= 2_000_000)
  ) {
    return 'Fácil';
  }

  // 2. Médio: Titulares consolidados da Série A ou campeões com 3-5 clubes tradicionais
  if (
    currentVal >= 2_000_000 ||
    (hasTrophy && highestVal >= 2_000_000) ||
    (highestVal >= 5_000_000 && clubsCount <= 5)
  ) {
    return 'Médio';
  }

  // 3. Difícil: Jornadeiros (>= 6 clubes ou muitos empréstimos)
  if (clubsCount >= 6 || (highestVal >= 1_500_000 && clubsCount >= 4)) {
    return 'Difícil';
  }

  // 4. Extremo: Menos badalados com passagens ramificadas
  return 'Extremo';
}

/**
 * Gerador Determinístico Diário:
 * Seleciona 1 Jogador Clássico (apenas estrelas/titulares consolidados), 1 Grid 3x3 garantido e 4 Atletas para Carreira.
 * Regras anti-repetição e qualificação garantidas:
 * 1. O Jogador Clássico NÃO repete nos 4 de Carreira.
 * 2. Os 4 de Carreira possuem obrigatoriamente no MÍNIMO 3 clubes e idade mínima de 24 anos (sem novatos).
 * 3. Os 4 de Carreira seguem uma progressão de 4 níveis com apenas um médio: Fácil -> Médio -> Difícil -> Extremo.
 * 4. A Matriz do Grid 3x3 é garantidamente solucionável em todas as 9 células.
 */
export function getDailyChallenges(dateStr: string, allPlayers: Player[]): DailyChallenges {
  const dayNum = getDayNumberForDate(dateStr);
  const seed = simpleHash(dateStr);

  // 1. Jogadores com foto oficial válida
  const playersWithPhoto = allPlayers.filter((p) => Boolean(p.photo));
  const pool = playersWithPhoto.length > 0 ? playersWithPhoto : allPlayers;

  // 2. Pool de Craques Relevantes exclusivo para o Modo Clássico
  const classicEligiblePool = pool.filter(isClassicEligible);
  const classicPool = classicEligiblePool.length > 0 ? classicEligiblePool : pool;

  // 3. Jogador Secreto do Modo Clássico (selecionado do pool filtrado de craques)
  const classicIdx = (seed + dayNum * 13) % classicPool.length;
  const classicPlayer = classicPool[classicIdx]!;

  // 4. Pool de atletas para o mini-game "Quem é esse Jogador?" (Regras estritas: MÍNIMO 3 clubes E idade >= 24 anos)
  const careerEligiblePool = pool.filter(
    (p) =>
      p.id !== classicPlayer.id &&
      p.age >= 24 &&
      Math.max(p.careerTeams?.length || 0, p.careerHistory?.length || 0) >= 3
  );

  const poolsByTier: Record<CareerDifficulty, Player[]> = {
    'Fácil': careerEligiblePool.filter((p) => getCareerDifficulty(p) === 'Fácil'),
    'Médio': careerEligiblePool.filter((p) => getCareerDifficulty(p) === 'Médio'),
    'Difícil': careerEligiblePool.filter((p) => getCareerDifficulty(p) === 'Difícil'),
    'Extremo': careerEligiblePool.filter((p) => getCareerDifficulty(p) === 'Extremo'),
  };

  // Grade balanceada de 4 desafios diários com apenas um Médio: Fácil -> Médio -> Difícil -> Extremo
  const tierPlan: CareerDifficulty[] = ['Fácil', 'Médio', 'Difícil', 'Extremo'];
  const careerPlayers: Player[] = [];
  const careerDifficulties: CareerDifficulty[] = [];
  const usedCareerIds = new Set<number>([classicPlayer.id]);

  tierPlan.forEach((tier, slotIdx) => {
    const tierPool = poolsByTier[tier].length > 0 ? poolsByTier[tier] : careerEligiblePool;
    let offset = 0;
    let chosen: Player | null = null;

    while (offset < tierPool.length) {
      const idx = (seed * (slotIdx + 3) + dayNum * 17 + offset * 7) % tierPool.length;
      const candidate = tierPool[idx]!;
      if (!usedCareerIds.has(candidate.id)) {
        chosen = candidate;
        break;
      }
      offset++;
    }

    if (!chosen) {
      // Fallback seguro caso todos do tier tenham sido usados
      chosen = careerEligiblePool.find((p) => !usedCareerIds.has(p.id)) || tierPool[0]!;
    }

    usedCareerIds.add(chosen.id);
    careerPlayers.push(chosen);
    careerDifficulties.push(tier);
  });

  // 3.1 Jogador do 4º jogo "Craque em Foco" (foto embaçada):
  // mesmas regras de relevância do Clássico, sem repetir o Clássico nem os 4 de Carreira do dia.
  const blurCandidates = classicPool.filter((p) => !usedCareerIds.has(p.id));
  const blurPool = blurCandidates.length > 0 ? blurCandidates : classicPool;
  const blurPlayer = blurPool[(seed * 7 + dayNum * 29 + 11) % blurPool.length]!;

  // 4. Matriz do Grid 3x3 garantida
  const gridsList = dailyGridsData as { cols: string[]; rows: string[] }[];
  const gridIndex = (seed + dayNum * 5) % gridsList.length;
  const selectedGrid = gridsList[gridIndex]!;

  const gridMatrix: DailyGridMatrix = {
    cols: selectedGrid.cols.map((colName) => ({
      id: colName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      label: colName,
      logo: getClubLogoUrl(colName),
    })),
    rows: selectedGrid.rows.map((rowName) => ({
      id: rowName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      label: rowName,
      logo: getClubLogoUrl(rowName),
    })),
  };

  return {
    date: dateStr,
    dayNumber: dayNum,
    classicPlayer,
    gridMatrix,
    careerPlayers,
    careerDifficulties,
    blurPlayer,
  };
}

// ==========================================
// PERSISTÊNCIA SEPARADA POR DATA (localStorage)
// ==========================================

export function loadDateClassicProgress(dateStr: string): {
  guesses: GuessResult[];
  isWon: boolean;
} {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}_progress_${dateStr}_classic`);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return { guesses: [], isWon: false };
}

export function saveDateClassicProgress(
  dateStr: string,
  data: { guesses: GuessResult[]; isWon: boolean }
) {
  try {
    localStorage.setItem(
      `${STORAGE_PREFIX}_progress_${dateStr}_classic`,
      JSON.stringify(data)
    );
  } catch (e) {}
}

export function loadDateGridProgress(dateStr: string): (Player | null)[][] {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}_progress_${dateStr}_grid`);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];
}

export function saveDateGridProgress(dateStr: string, gridState: (Player | null)[][]) {
  try {
    localStorage.setItem(
      `${STORAGE_PREFIX}_progress_${dateStr}_grid`,
      JSON.stringify(gridState)
    );
  } catch (e) {}
}

export function loadDateCareerProgress(dateStr: string): {
  currentIndex: number;
  completedPlayerIds: number[];
  isAllCompleted: boolean;
} {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}_progress_${dateStr}_career`);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return { currentIndex: 0, completedPlayerIds: [], isAllCompleted: false };
}

export function saveDateCareerProgress(
  dateStr: string,
  data: { currentIndex: number; completedPlayerIds: number[]; isAllCompleted: boolean }
) {
  try {
    localStorage.setItem(
      `${STORAGE_PREFIX}_progress_${dateStr}_career`,
      JSON.stringify(data)
    );
  } catch (e) {}
}

export function loadDateBlurProgress(dateStr: string): BlurProgress {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}_progress_${dateStr}_blur`);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<BlurProgress>;
      return {
        guessIds: Array.isArray(parsed.guessIds) ? parsed.guessIds : [],
        isWon: Boolean(parsed.isWon),
        mode: parsed.mode === 'hard' ? 'hard' : 'normal',
      };
    }
  } catch (e) {}
  return { guessIds: [], isWon: false, mode: 'normal' };
}

export function saveDateBlurProgress(dateStr: string, data: BlurProgress) {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}_progress_${dateStr}_blur`, JSON.stringify(data));
  } catch (e) {}
}

// Resumo do dia (progresso de cada modo)
export function getDayProgressSummary(dateStr: string): DayProgressSummary {
  const classic = loadDateClassicProgress(dateStr);
  const grid = loadDateGridProgress(dateStr);
  const career = loadDateCareerProgress(dateStr);

  const gridFilled = grid.flat().filter(Boolean).length;

  return {
    date: dateStr,
    classicCompleted: classic.isWon,
    classicAttempts: classic.guesses.length,
    gridCompletedCount: gridFilled,
    gridIsComplete: gridFilled === 9,
    careerCompletedCount: career.completedPlayerIds.length,
    careerIsComplete: career.isAllCompleted || career.completedPlayerIds.length >= 4,
  };
}
