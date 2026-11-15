export type Position = 'Goleiro' | 'Defensor' | 'Meia' | 'Atacante';

export interface PlayerTrophies {
  brasileirao: boolean;
  copaDoBrasil: boolean;
  libertadores: boolean;
  sulamericana: boolean;
}

export interface Player {
  id: number;
  name: string;
  photo: string;
  team: string;
  teamLogo?: string;
  careerTeams?: string[]; // Clubes por onde o jogador já passou
  age: number;
  position: Position;
  nationality: string;
  trophies: PlayerTrophies;
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
  positionMatch: MatchStatus;
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
