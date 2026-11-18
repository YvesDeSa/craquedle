export type Position = 'Goleiro' | 'Defensor' | 'Meia' | 'Atacante';

export type DominantFoot = 'Destro' | 'Canhoto' | 'Ambidestro';

export interface PlayerTrophies {
  brasileirao: boolean;
  copaDoBrasil: boolean;
  libertadores: boolean;
  sulamericana: boolean;
}

export interface CareerStep {
  club: string;
  logo?: string;
  type?: 'def' | 'emp'; // 'def' = Definitivo, 'emp' = Empréstimo
  isLoan?: boolean;
}

export interface Player {
  id: number;
  name: string;
  aliases?: string[]; // Apelidos e nomes alternativos populares (ex: ["Cebolinha", "Everton"])
  photo: string;
  team: string;
  teamLogo?: string;
  careerTeams?: string[]; // Clubes por onde o jogador já passou (nomes limpos)
  careerHistory?: CareerStep[]; // Trajetória profissional completa sem categorias de base
  age: number;
  altura: string; // Ex: "1.85 m"
  pe_dominante: DominantFoot; // 'Destro' | 'Canhoto' | 'Ambidestro'
  position: Position;
  nationality: string;
  trophies: PlayerTrophies;
  marketValue?: number; // Valor de mercado atual em euros (€)
  highestMarketValue?: number; // Pico histórico de valor de mercado (€)
}

export type MatchStatus = 'CORRECT' | 'PARTIAL' | 'INCORRECT';
export type Direction = 'HIGHER' | 'LOWER' | 'EQUAL';

export interface AttributeComparison<T> {
  value: T;
  status: MatchStatus;
  direction?: Direction;
}

export interface GuessResult {
  player: Player;
  teamMatch: MatchStatus;
  ageMatch: AttributeComparison<number>;
  alturaMatch: AttributeComparison<string>;
  positionMatch: MatchStatus;
  peMatch: MatchStatus; // Coluna própria para Pé Dominante ('Destro' | 'Canhoto' | 'Ambidestro')
  nationalityMatch: MatchStatus;
  trophiesMatch: AttributeComparison<PlayerTrophies>;
  isCorrect: boolean;
}

export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  lastPlayedDate?: string;
  lastWonDate?: string;
  guessesDistribution?: Record<number, number>;
}
