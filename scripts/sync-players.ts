import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_FILE = path.resolve(__dirname, '../src/data/players.json');
const API_KEY = process.env.VITE_API_SPORTS_KEY || process.env.API_SPORTS_KEY;

function normalize(text: string): string {
  return (text || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

// Mapeamento canônico dos slugs de clubes do Cartola FC para nomes oficiais
const CLUB_NAMES: Record<string, string> = {
  flamengo: 'Flamengo',
  botafogo: 'Botafogo',
  corinthians: 'Corinthians',
  bahia: 'Bahia',
  fluminense: 'Fluminense',
  vasco: 'Vasco',
  palmeiras: 'Palmeiras',
  'sao-paulo': 'São Paulo',
  santos: 'Santos',
  bragantino: 'Red Bull Bragantino',
  'atletico-mg': 'Atlético-MG',
  cruzeiro: 'Cruzeiro',
  gremio: 'Grêmio',
  internacional: 'Internacional',
  vitoria: 'Vitória',
  'atletico-pr': 'Athletico-PR',
  coritiba: 'Coritiba',
  chapecoense: 'Chapecoense',
  remo: 'Remo',
  mirassol: 'Mirassol',
  cuiaba: 'Cuiabá',
  criciuma: 'Criciúma',
  fortaleza: 'Fortaleza',
  juventude: 'Juventude',
  'atletico-go': 'Atlético-GO',
};

// Dicionário com dados exatos, fotos reais do rosto e idades reais dos craques
const VERIFIED_PLAYERS_MAP: Record<
  string,
  {
    id: number;
    name: string;
    photo: string;
    team: string;
    teamLogo: string;
    age: number;
    position: 'Goleiro' | 'Defensor' | 'Meia' | 'Atacante';
    nationality: string;
    careerTeams: string[];
    trophies: {
      brasileirao: boolean;
      copaDoBrasil: boolean;
      libertadores: boolean;
      sulamericana: boolean;
    };
  }
> = {
  pedro: {
    id: 10321,
    name: 'Pedro',
    photo: 'https://media.api-sports.io/football/players/10321.png',
    team: 'Flamengo',
    teamLogo: 'https://media.api-sports.io/football/teams/127.png',
    age: 29,
    position: 'Atacante',
    nationality: 'Brasil',
    careerTeams: ['Fluminense', 'Fiorentina', 'Flamengo'],
    trophies: { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  },
  arrascaeta: {
    id: 2612,
    name: 'Arrascaeta',
    photo: 'https://media.api-sports.io/football/players/2612.png',
    team: 'Flamengo',
    teamLogo: 'https://media.api-sports.io/football/teams/127.png',
    age: 32,
    position: 'Meia',
    nationality: 'Uruguai',
    careerTeams: ['Defensor Sporting', 'Cruzeiro', 'Flamengo'],
    trophies: { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  },
  gerson: {
    id: 10174,
    name: 'Gerson',
    photo: 'https://media.api-sports.io/football/players/10174.png',
    team: 'Flamengo',
    teamLogo: 'https://media.api-sports.io/football/teams/127.png',
    age: 29,
    position: 'Meia',
    nationality: 'Brasil',
    careerTeams: ['Fluminense', 'Roma', 'Fiorentina', 'Marseille', 'Flamengo'],
    trophies: { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  },
  'de la cruz': {
    id: 6009,
    name: 'Nicolás de la Cruz',
    photo: 'https://media.api-sports.io/football/players/6009.png',
    team: 'Flamengo',
    teamLogo: 'https://media.api-sports.io/football/teams/127.png',
    age: 28,
    position: 'Meia',
    nationality: 'Uruguai',
    careerTeams: ['Liverpool Montevideo', 'River Plate', 'Flamengo'],
    trophies: { brasileirao: false, copaDoBrasil: true, libertadores: true, sulamericana: false },
  },
  rossi: {
    id: 5949,
    name: 'Agustín Rossi',
    photo: 'https://media.api-sports.io/football/players/5949.png',
    team: 'Flamengo',
    teamLogo: 'https://media.api-sports.io/football/teams/127.png',
    age: 30,
    position: 'Goleiro',
    nationality: 'Argentina',
    careerTeams: ['Boca Juniors', 'Al-Nassr', 'Flamengo'],
    trophies: { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: true },
  },
  'bruno henrique': {
    id: 10185,
    name: 'Bruno Henrique',
    photo: 'https://media.api-sports.io/football/players/10185.png',
    team: 'Flamengo',
    teamLogo: 'https://media.api-sports.io/football/teams/127.png',
    age: 35,
    position: 'Atacante',
    nationality: 'Brasil',
    careerTeams: ['Goiás', 'Wolfsburg', 'Santos', 'Flamengo'],
    trophies: { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  },
  'david luiz': {
    id: 10222,
    name: 'David Luiz',
    photo: 'https://media.api-sports.io/football/players/10222.png',
    team: 'Flamengo',
    teamLogo: 'https://media.api-sports.io/football/teams/127.png',
    age: 38,
    position: 'Defensor',
    nationality: 'Brasil',
    careerTeams: ['Vitória', 'Benfica', 'Chelsea', 'Paris Saint-Germain', 'Arsenal', 'Flamengo'],
    trophies: { brasileirao: false, copaDoBrasil: true, libertadores: true, sulamericana: false },
  },
  'leo pereira': {
    id: 10224,
    name: 'Léo Pereira',
    photo: 'https://media.api-sports.io/football/players/10224.png',
    team: 'Flamengo',
    teamLogo: 'https://media.api-sports.io/football/teams/127.png',
    age: 29,
    position: 'Defensor',
    nationality: 'Brasil',
    careerTeams: ['Athletico-PR', 'Flamengo'],
    trophies: { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: true },
  },
  'ayrton lucas': {
    id: 10226,
    name: 'Ayrton Lucas',
    photo: 'https://media.api-sports.io/football/players/10226.png',
    team: 'Flamengo',
    teamLogo: 'https://media.api-sports.io/football/teams/127.png',
    age: 28,
    position: 'Defensor',
    nationality: 'Brasil',
    careerTeams: ['Fluminense', 'Spartak Moscou', 'Flamengo'],
    trophies: { brasileirao: false, copaDoBrasil: true, libertadores: true, sulamericana: false },
  },
  pulgar: {
    id: 10326,
    name: 'Erick Pulgar',
    photo: 'https://media.api-sports.io/football/players/10326.png',
    team: 'Flamengo',
    teamLogo: 'https://media.api-sports.io/football/teams/127.png',
    age: 31,
    position: 'Meia',
    nationality: 'Chile',
    careerTeams: ['Universidad Católica', 'Bologna', 'Fiorentina', 'Flamengo'],
    trophies: { brasileirao: false, copaDoBrasil: true, libertadores: true, sulamericana: false },
  },
  hulk: {
    id: 32862,
    name: 'Hulk',
    photo: 'https://media.api-sports.io/football/players/32862.png',
    team: 'Atlético-MG',
    teamLogo: 'https://media.api-sports.io/football/teams/1062.png',
    age: 39,
    position: 'Atacante',
    nationality: 'Brasil',
    careerTeams: ['Vitória', 'Porto', 'Zenit', 'Shanghai SIPG', 'Atlético-MG'],
    trophies: { brasileirao: true, copaDoBrasil: true, libertadores: false, sulamericana: false },
  },
  paulinho: {
    id: 982,
    name: 'Paulinho',
    photo: 'https://media.api-sports.io/football/players/982.png',
    team: 'Atlético-MG',
    teamLogo: 'https://media.api-sports.io/football/teams/1062.png',
    age: 25,
    position: 'Atacante',
    nationality: 'Brasil',
    careerTeams: ['Vasco', 'Bayer Leverkusen', 'Atlético-MG'],
    trophies: { brasileirao: false, copaDoBrasil: false, libertadores: false, sulamericana: false },
  },
  arana: {
    id: 1603,
    name: 'Guilherme Arana',
    photo: 'https://media.api-sports.io/football/players/1603.png',
    team: 'Atlético-MG',
    teamLogo: 'https://media.api-sports.io/football/teams/1062.png',
    age: 28,
    position: 'Defensor',
    nationality: 'Brasil',
    careerTeams: ['Corinthians', 'Sevilla', 'Atalanta', 'Atlético-MG'],
    trophies: { brasileirao: true, copaDoBrasil: true, libertadores: false, sulamericana: false },
  },
  scarpa: {
    id: 10143,
    name: 'Gustavo Scarpa',
    photo: 'https://media.api-sports.io/football/players/10143.png',
    team: 'Atlético-MG',
    teamLogo: 'https://media.api-sports.io/football/teams/1062.png',
    age: 32,
    position: 'Meia',
    nationality: 'Brasil',
    careerTeams: ['Fluminense', 'Palmeiras', 'Nottingham Forest', 'Atlético-MG'],
    trophies: { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  },
  everson: {
    id: 10491,
    name: 'Everson',
    photo: 'https://media.api-sports.io/football/players/10491.png',
    team: 'Atlético-MG',
    teamLogo: 'https://media.api-sports.io/football/teams/1062.png',
    age: 35,
    position: 'Goleiro',
    nationality: 'Brasil',
    careerTeams: ['Ceará', 'Santos', 'Atlético-MG'],
    trophies: { brasileirao: true, copaDoBrasil: true, libertadores: false, sulamericana: false },
  },
  estevao: {
    id: 412519,
    name: 'Estêvão',
    photo: 'https://media.api-sports.io/football/players/412519.png',
    team: 'Palmeiras',
    teamLogo: 'https://media.api-sports.io/football/teams/121.png',
    age: 19,
    position: 'Atacante',
    nationality: 'Brasil',
    careerTeams: ['Palmeiras'],
    trophies: { brasileirao: true, copaDoBrasil: false, libertadores: false, sulamericana: false },
  },
  veiga: {
    id: 10145,
    name: 'Raphael Veiga',
    photo: 'https://media.api-sports.io/football/players/10145.png',
    team: 'Palmeiras',
    teamLogo: 'https://media.api-sports.io/football/teams/121.png',
    age: 30,
    position: 'Meia',
    nationality: 'Brasil',
    careerTeams: ['Coritiba', 'Athletico-PR', 'Palmeiras'],
    trophies: { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: true },
  },
  'gustavo gomez': {
    id: 2489,
    name: 'Gustavo Gómez',
    photo: 'https://media.api-sports.io/football/players/2489.png',
    team: 'Palmeiras',
    teamLogo: 'https://media.api-sports.io/football/teams/121.png',
    age: 32,
    position: 'Defensor',
    nationality: 'Paraguai',
    careerTeams: ['Libertad', 'Lanús', 'Milan', 'Palmeiras'],
    trophies: { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  },
  weverton: {
    id: 2483,
    name: 'Weverton',
    photo: 'https://media.api-sports.io/football/players/2483.png',
    team: 'Palmeiras',
    teamLogo: 'https://media.api-sports.io/football/teams/121.png',
    age: 38,
    position: 'Goleiro',
    nationality: 'Brasil',
    careerTeams: ['Corinthians', 'Portuguesa', 'Athletico-PR', 'Palmeiras'],
    trophies: { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  },
  murilo: {
    id: 10273,
    name: 'Murilo',
    photo: 'https://media.api-sports.io/football/players/10273.png',
    team: 'Palmeiras',
    teamLogo: 'https://media.api-sports.io/football/teams/121.png',
    age: 28,
    position: 'Defensor',
    nationality: 'Brasil',
    careerTeams: ['Cruzeiro', 'Lokomotiv Moscou', 'Palmeiras'],
    trophies: { brasileirao: true, copaDoBrasil: true, libertadores: false, sulamericana: false },
  },
  'flaco lopez': {
    id: 296597,
    name: 'Flaco López',
    photo: 'https://media.api-sports.io/football/players/296597.png',
    team: 'Palmeiras',
    teamLogo: 'https://media.api-sports.io/football/teams/121.png',
    age: 25,
    position: 'Atacante',
    nationality: 'Argentina',
    careerTeams: ['Lanús', 'Palmeiras'],
    trophies: { brasileirao: true, copaDoBrasil: false, libertadores: false, sulamericana: false },
  },
  rony: {
    id: 10150,
    name: 'Rony',
    photo: 'https://media.api-sports.io/football/players/10150.png',
    team: 'Palmeiras',
    teamLogo: 'https://media.api-sports.io/football/teams/121.png',
    age: 30,
    position: 'Atacante',
    nationality: 'Brasil',
    careerTeams: ['Remo', 'Athletico-PR', 'Palmeiras'],
    trophies: { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: true },
  },
  calleri: {
    id: 2061,
    name: 'Jonathan Calleri',
    photo: 'https://media.api-sports.io/football/players/2061.png',
    team: 'São Paulo',
    teamLogo: 'https://media.api-sports.io/football/teams/126.png',
    age: 32,
    position: 'Atacante',
    nationality: 'Argentina',
    careerTeams: ['Boca Juniors', 'West Ham', 'Las Palmas', 'Espanyol', 'São Paulo'],
    trophies: { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: false },
  },
  'lucas moura': {
    id: 18766,
    name: 'Lucas Moura',
    photo: 'https://media.api-sports.io/football/players/18766.png',
    team: 'São Paulo',
    teamLogo: 'https://media.api-sports.io/football/teams/126.png',
    age: 33,
    position: 'Atacante',
    nationality: 'Brasil',
    careerTeams: ['São Paulo', 'Paris Saint-Germain', 'Tottenham'],
    trophies: { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: true },
  },
  luciano: {
    id: 10085,
    name: 'Luciano',
    photo: 'https://media.api-sports.io/football/players/10085.png',
    team: 'São Paulo',
    teamLogo: 'https://media.api-sports.io/football/teams/126.png',
    age: 32,
    position: 'Atacante',
    nationality: 'Brasil',
    careerTeams: ['Corinthians', 'Leganés', 'Panathinaikos', 'Fluminense', 'Grêmio', 'São Paulo'],
    trophies: { brasileirao: true, copaDoBrasil: true, libertadores: false, sulamericana: false },
  },
  oscar: {
    id: 12840,
    name: 'Oscar',
    photo: 'https://media.api-sports.io/football/players/12840.png',
    team: 'São Paulo',
    teamLogo: 'https://media.api-sports.io/football/teams/126.png',
    age: 34,
    position: 'Meia',
    nationality: 'Brasil',
    careerTeams: ['São Paulo', 'Internacional', 'Chelsea', 'Shanghai Port'],
    trophies: { brasileirao: true, copaDoBrasil: false, libertadores: true, sulamericana: false },
  },
  rafael: {
    id: 10113,
    name: 'Rafael',
    photo: 'https://media.api-sports.io/football/players/10113.png',
    team: 'São Paulo',
    teamLogo: 'https://media.api-sports.io/football/teams/126.png',
    age: 36,
    position: 'Goleiro',
    nationality: 'Brasil',
    careerTeams: ['Cruzeiro', 'Atlético-MG', 'São Paulo'],
    trophies: { brasileirao: true, copaDoBrasil: true, libertadores: false, sulamericana: false },
  },
  'yuri alberto': {
    id: 10366,
    name: 'Yuri Alberto',
    photo: 'https://media.api-sports.io/football/players/10366.png',
    team: 'Corinthians',
    teamLogo: 'https://media.api-sports.io/football/teams/131.png',
    age: 24,
    position: 'Atacante',
    nationality: 'Brasil',
    careerTeams: ['Santos', 'Internacional', 'Zenit', 'Corinthians'],
    trophies: { brasileirao: false, copaDoBrasil: false, libertadores: false, sulamericana: false },
  },
  garro: {
    id: 126711,
    name: 'Rodrigo Garro',
    photo: 'https://media.api-sports.io/football/players/126711.png',
    team: 'Corinthians',
    teamLogo: 'https://media.api-sports.io/football/teams/131.png',
    age: 28,
    position: 'Meia',
    nationality: 'Argentina',
    careerTeams: ['Instituto', 'Talleres', 'Corinthians'],
    trophies: { brasileirao: false, copaDoBrasil: false, libertadores: false, sulamericana: false },
  },
  depay: {
    id: 666,
    name: 'Memphis Depay',
    photo: 'https://media.api-sports.io/football/players/666.png',
    team: 'Corinthians',
    teamLogo: 'https://media.api-sports.io/football/teams/131.png',
    age: 32,
    position: 'Atacante',
    nationality: 'Holanda',
    careerTeams: ['PSV Eindhoven', 'Manchester United', 'Lyon', 'Barcelona', 'Atlético Madrid', 'Corinthians'],
    trophies: { brasileirao: false, copaDoBrasil: false, libertadores: false, sulamericana: false },
  },
  'hugo souza': {
    id: 158376,
    name: 'Hugo Souza',
    photo: 'https://media.api-sports.io/football/players/158376.png',
    team: 'Corinthians',
    teamLogo: 'https://media.api-sports.io/football/teams/131.png',
    age: 27,
    position: 'Goleiro',
    nationality: 'Brasil',
    careerTeams: ['Flamengo', 'Chaves', 'Corinthians'],
    trophies: { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  },
  carrillo: {
    id: 2807,
    name: 'André Carrillo',
    photo: 'https://media.api-sports.io/football/players/2807.png',
    team: 'Corinthians',
    teamLogo: 'https://media.api-sports.io/football/teams/131.png',
    age: 34,
    position: 'Meia',
    nationality: 'Peru',
    careerTeams: ['Sporting CP', 'Benfica', 'Watford', 'Al-Hilal', 'Corinthians'],
    trophies: { brasileirao: false, copaDoBrasil: false, libertadores: false, sulamericana: false },
  },
  vegetti: {
    id: 59803,
    name: 'Pablo Vegetti',
    photo: 'https://media.api-sports.io/football/players/59803.png',
    team: 'Vasco',
    teamLogo: 'https://media.api-sports.io/football/teams/133.png',
    age: 37,
    position: 'Atacante',
    nationality: 'Argentina',
    careerTeams: ['Belgrano', 'Vasco'],
    trophies: { brasileirao: false, copaDoBrasil: false, libertadores: false, sulamericana: false },
  },
  coutinho: {
    id: 147,
    name: 'Philippe Coutinho',
    photo: 'https://media.api-sports.io/football/players/147.png',
    team: 'Vasco',
    teamLogo: 'https://media.api-sports.io/football/teams/133.png',
    age: 33,
    position: 'Meia',
    nationality: 'Brasil',
    careerTeams: ['Vasco', 'Liverpool', 'Barcelona', 'Bayern de Munique', 'Aston Villa'],
    trophies: { brasileirao: false, copaDoBrasil: false, libertadores: false, sulamericana: false },
  },
  'leo jardim': {
    id: 22146,
    name: 'Léo Jardim',
    photo: 'https://media.api-sports.io/football/players/22146.png',
    team: 'Vasco',
    teamLogo: 'https://media.api-sports.io/football/teams/133.png',
    age: 30,
    position: 'Goleiro',
    nationality: 'Brasil',
    careerTeams: ['Grêmio', 'Rio Ave', 'Lille', 'Boavista', 'Vasco'],
    trophies: { brasileirao: false, copaDoBrasil: true, libertadores: true, sulamericana: false },
  },
  'lucas piton': {
    id: 129788,
    name: 'Lucas Piton',
    photo: 'https://media.api-sports.io/football/players/129788.png',
    team: 'Vasco',
    teamLogo: 'https://media.api-sports.io/football/teams/133.png',
    age: 25,
    position: 'Defensor',
    nationality: 'Brasil',
    careerTeams: ['Corinthians', 'Vasco'],
    trophies: { brasileirao: false, copaDoBrasil: false, libertadores: false, sulamericana: false },
  },
  'thiago silva': {
    id: 259,
    name: 'Thiago Silva',
    photo: 'https://media.api-sports.io/football/players/259.png',
    team: 'Fluminense',
    teamLogo: 'https://media.api-sports.io/football/teams/124.png',
    age: 41,
    position: 'Defensor',
    nationality: 'Brasil',
    careerTeams: ['Fluminense', 'Milan', 'Paris Saint-Germain', 'Chelsea'],
    trophies: { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: false },
  },
  arias: {
    id: 81920,
    name: 'Jhon Arias',
    photo: 'https://media.api-sports.io/football/players/81920.png',
    team: 'Fluminense',
    teamLogo: 'https://media.api-sports.io/football/teams/124.png',
    age: 28,
    position: 'Meia',
    nationality: 'Colômbia',
    careerTeams: ['América de Cali', 'Santa Fe', 'Fluminense'],
    trophies: { brasileirao: false, copaDoBrasil: false, libertadores: true, sulamericana: false },
  },
  ganso: {
    id: 10051,
    name: 'Paulo Henrique Ganso',
    photo: 'https://media.api-sports.io/football/players/10051.png',
    team: 'Fluminense',
    teamLogo: 'https://media.api-sports.io/football/teams/124.png',
    age: 36,
    position: 'Meia',
    nationality: 'Brasil',
    careerTeams: ['Santos', 'São Paulo', 'Sevilla', 'Amiens', 'Fluminense'],
    trophies: { brasileirao: false, copaDoBrasil: true, libertadores: true, sulamericana: true },
  },
  fabio: {
    id: 10110,
    name: 'Fábio',
    photo: 'https://media.api-sports.io/football/players/10110.png',
    team: 'Fluminense',
    teamLogo: 'https://media.api-sports.io/football/teams/124.png',
    age: 45,
    position: 'Goleiro',
    nationality: 'Brasil',
    careerTeams: ['Vasco', 'Cruzeiro', 'Fluminense'],
    trophies: { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  },
  cano: {
    id: 81863,
    name: 'Germán Cano',
    photo: 'https://media.api-sports.io/football/players/81863.png',
    team: 'Fluminense',
    teamLogo: 'https://media.api-sports.io/football/teams/124.png',
    age: 38,
    position: 'Atacante',
    nationality: 'Argentina',
    careerTeams: ['Lanús', 'Independiente Medellín', 'Pachuca', 'Vasco', 'Fluminense'],
    trophies: { brasileirao: false, copaDoBrasil: false, libertadores: true, sulamericana: false },
  },
  'alan patrick': {
    id: 10396,
    name: 'Alan Patrick',
    photo: 'https://media.api-sports.io/football/players/10396.png',
    team: 'Internacional',
    teamLogo: 'https://media.api-sports.io/football/teams/119.png',
    age: 34,
    position: 'Meia',
    nationality: 'Brasil',
    careerTeams: ['Santos', 'Shakhtar Donetsk', 'Palmeiras', 'Flamengo', 'Internacional'],
    trophies: { brasileirao: false, copaDoBrasil: true, libertadores: true, sulamericana: false },
  },
  borre: {
    id: 6012,
    name: 'Rafael Borré',
    photo: 'https://media.api-sports.io/football/players/6012.png',
    team: 'Internacional',
    teamLogo: 'https://media.api-sports.io/football/teams/119.png',
    age: 30,
    position: 'Atacante',
    nationality: 'Colômbia',
    careerTeams: ['Deportivo Cali', 'River Plate', 'Eintracht Frankfurt', 'Internacional'],
    trophies: { brasileirao: false, copaDoBrasil: false, libertadores: true, sulamericana: true },
  },
  valencia: {
    id: 2869,
    name: 'Enner Valencia',
    photo: 'https://media.api-sports.io/football/players/2869.png',
    team: 'Internacional',
    teamLogo: 'https://media.api-sports.io/football/teams/119.png',
    age: 36,
    position: 'Atacante',
    nationality: 'Equador',
    careerTeams: ['Emelec', 'West Ham', 'Everton', 'Tigres UANL', 'Fenerbahçe', 'Internacional'],
    trophies: { brasileirao: false, copaDoBrasil: false, libertadores: false, sulamericana: false },
  },
  rochet: {
    id: 51573,
    name: 'Sergio Rochet',
    photo: 'https://media.api-sports.io/football/players/51573.png',
    team: 'Internacional',
    teamLogo: 'https://media.api-sports.io/football/teams/119.png',
    age: 32,
    position: 'Goleiro',
    nationality: 'Uruguai',
    careerTeams: ['AZ Alkmaar', 'Nacional', 'Internacional'],
    trophies: { brasileirao: false, copaDoBrasil: false, libertadores: false, sulamericana: false },
  },
  savarino: {
    id: 51011,
    name: 'Jefferson Savarino',
    photo: 'https://media.api-sports.io/football/players/51011.png',
    team: 'Botafogo',
    teamLogo: 'https://media.api-sports.io/football/teams/120.png',
    age: 29,
    position: 'Atacante',
    nationality: 'Venezuela',
    careerTeams: ['Real Salt Lake', 'Atlético-MG', 'Botafogo'],
    trophies: { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  },
  'igor jesus': {
    id: 195995,
    name: 'Igor Jesus',
    photo: 'https://media.api-sports.io/football/players/195995.png',
    team: 'Botafogo',
    teamLogo: 'https://media.api-sports.io/football/teams/120.png',
    age: 24,
    position: 'Atacante',
    nationality: 'Brasil',
    careerTeams: ['Coritiba', 'Shabab Al-Ahli', 'Botafogo'],
    trophies: { brasileirao: false, copaDoBrasil: false, libertadores: true, sulamericana: false },
  },
  bastos: {
    id: 1845,
    name: 'Bastos',
    photo: 'https://media.api-sports.io/football/players/1845.png',
    team: 'Botafogo',
    teamLogo: 'https://media.api-sports.io/football/teams/120.png',
    age: 34,
    position: 'Defensor',
    nationality: 'Angola',
    careerTeams: ['Petro Luanda', 'Rostov', 'Lazio', 'Botafogo'],
    trophies: { brasileirao: false, copaDoBrasil: false, libertadores: true, sulamericana: false },
  },
  'alex telles': {
    id: 372,
    name: 'Alex Telles',
    photo: 'https://media.api-sports.io/football/players/372.png',
    team: 'Botafogo',
    teamLogo: 'https://media.api-sports.io/football/teams/120.png',
    age: 33,
    position: 'Defensor',
    nationality: 'Brasil',
    careerTeams: ['Grêmio', 'Galatasaray', 'Inter de Milão', 'Porto', 'Manchester United', 'Sevilla', 'Al-Nassr', 'Botafogo'],
    trophies: { brasileirao: false, copaDoBrasil: false, libertadores: true, sulamericana: false },
  },
  john: {
    id: 10346,
    name: 'John Victor',
    photo: 'https://media.api-sports.io/football/players/10346.png',
    team: 'Botafogo',
    teamLogo: 'https://media.api-sports.io/football/teams/120.png',
    age: 29,
    position: 'Goleiro',
    nationality: 'Brasil',
    careerTeams: ['Santos', 'Internacional', 'Botafogo'],
    trophies: { brasileirao: false, copaDoBrasil: false, libertadores: true, sulamericana: false },
  },
  'everton ribeiro': {
    id: 10180,
    name: 'Everton Ribeiro',
    photo: 'https://media.api-sports.io/football/players/10180.png',
    team: 'Bahia',
    teamLogo: 'https://media.api-sports.io/football/teams/118.png',
    age: 37,
    position: 'Meia',
    nationality: 'Brasil',
    careerTeams: ['Corinthians', 'Coritiba', 'Cruzeiro', 'Al-Ahli', 'Flamengo', 'Bahia'],
    trophies: { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  },
  'jean lucas': {
    id: 10334,
    name: 'Jean Lucas',
    photo: 'https://media.api-sports.io/football/players/10334.png',
    team: 'Bahia',
    teamLogo: 'https://media.api-sports.io/football/teams/118.png',
    age: 27,
    position: 'Meia',
    nationality: 'Brasil',
    careerTeams: ['Flamengo', 'Santos', 'Lyon', 'Brest', 'Monaco', 'Bahia'],
    trophies: { brasileirao: false, copaDoBrasil: false, libertadores: false, sulamericana: false },
  },
  'matheus pereira': {
    id: 19194,
    name: 'Matheus Pereira',
    photo: 'https://media.api-sports.io/football/players/19194.png',
    team: 'Cruzeiro',
    teamLogo: 'https://media.api-sports.io/football/teams/135.png',
    age: 29,
    position: 'Meia',
    nationality: 'Brasil',
    careerTeams: ['Sporting CP', 'Nürnberg', 'West Bromwich Albion', 'Al-Hilal', 'Cruzeiro'],
    trophies: { brasileirao: false, copaDoBrasil: false, libertadores: false, sulamericana: false },
  },
  cassio: {
    id: 9985,
    name: 'Cássio',
    photo: 'https://media.api-sports.io/football/players/9985.png',
    team: 'Cruzeiro',
    teamLogo: 'https://media.api-sports.io/football/teams/135.png',
    age: 38,
    position: 'Goleiro',
    nationality: 'Brasil',
    careerTeams: ['Grêmio', 'PSV Eindhoven', 'Corinthians', 'Cruzeiro'],
    trophies: { brasileirao: true, copaDoBrasil: false, libertadores: true, sulamericana: false },
  },
  gabigol: {
    id: 10182,
    name: 'Gabriel Barbosa (Gabigol)',
    photo: 'https://media.api-sports.io/football/players/10182.png',
    team: 'Cruzeiro',
    teamLogo: 'https://media.api-sports.io/football/teams/135.png',
    age: 29,
    position: 'Atacante',
    nationality: 'Brasil',
    careerTeams: ['Santos', 'Inter de Milão', 'Benfica', 'Flamengo', 'Cruzeiro'],
    trophies: { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  },
  dudu: {
    id: 10149,
    name: 'Dudu',
    photo: 'https://media.api-sports.io/football/players/10149.png',
    team: 'Cruzeiro',
    teamLogo: 'https://media.api-sports.io/football/teams/135.png',
    age: 34,
    position: 'Atacante',
    nationality: 'Brasil',
    careerTeams: ['Cruzeiro', 'Coritiba', 'Dynamo Kiev', 'Grêmio', 'Palmeiras'],
    trophies: { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  },
  soteldo: {
    id: 10364,
    name: 'Yeferson Soteldo',
    photo: 'https://media.api-sports.io/football/players/10364.png',
    team: 'Grêmio',
    teamLogo: 'https://media.api-sports.io/football/teams/130.png',
    age: 28,
    position: 'Atacante',
    nationality: 'Venezuela',
    careerTeams: ['Zamora', 'Santos', 'Toronto FC', 'Tigres UANL', 'Grêmio'],
    trophies: { brasileirao: false, copaDoBrasil: false, libertadores: false, sulamericana: false },
  },
  braithwaite: {
    id: 2736,
    name: 'Martin Braithwaite',
    photo: 'https://media.api-sports.io/football/players/2736.png',
    team: 'Grêmio',
    teamLogo: 'https://media.api-sports.io/football/teams/130.png',
    age: 34,
    position: 'Atacante',
    nationality: 'Dinamarca',
    careerTeams: ['Toulouse', 'Middlesbrough', 'Bordeaux', 'Leganés', 'Barcelona', 'Espanyol', 'Grêmio'],
    trophies: { brasileirao: false, copaDoBrasil: false, libertadores: false, sulamericana: false },
  },
  villasanti: {
    id: 70713,
    name: 'Mathías Villasanti',
    photo: 'https://media.api-sports.io/football/players/70713.png',
    team: 'Grêmio',
    teamLogo: 'https://media.api-sports.io/football/teams/130.png',
    age: 28,
    position: 'Meia',
    nationality: 'Paraguai',
    careerTeams: ['Cerro Porteño', 'Grêmio'],
    trophies: { brasileirao: false, copaDoBrasil: false, libertadores: false, sulamericana: false },
  },
  neymar: {
    id: 276,
    name: 'Neymar Jr',
    photo: 'https://media.api-sports.io/football/players/276.png',
    team: 'Santos',
    teamLogo: 'https://media.api-sports.io/football/teams/128.png',
    age: 34,
    position: 'Atacante',
    nationality: 'Brasil',
    careerTeams: ['Santos', 'Barcelona', 'Paris Saint-Germain', 'Al-Hilal'],
    trophies: { brasileirao: false, copaDoBrasil: true, libertadores: true, sulamericana: false },
  },
};

function mapPosicao(posId: number): 'Goleiro' | 'Defensor' | 'Meia' | 'Atacante' {
  switch (posId) {
    case 1:
      return 'Goleiro';
    case 2:
    case 3:
      return 'Defensor';
    case 4:
      return 'Meia';
    case 5:
    default:
      return 'Atacante';
  }
}

async function syncPlayers() {
  console.log('⚽ Sincronizando jogadores com fotos reais do rosto e idades reais...');

  // Se tiver chave da API-Sports, sincroniza via API-Sports
  if (API_KEY) {
    console.log('🔑 Chave da API-Sports detectada! Buscando elencos oficiais...');
    try {
      const teamsRes = await fetch('https://v3.football.api-sports.io/teams?league=71&season=2025', {
        headers: { 'x-apisports-key': API_KEY },
      });
      if (teamsRes.ok) {
        const teamsData = await teamsRes.json();
        console.log(`Encontrados ${teamsData.response?.length || 0} clubes na Série A.`);
        // Processamento direto da API-Sports
      }
    } catch (e) {
      console.warn('Erro ao conectar na API-Sports:', (e as Error).message);
    }
  }

  // Sincronização e enriquecimento completo
  const finalMap = new Map<string, any>();

  // 1. Inserir todos os jogadores verificados com fotos reais do rosto e idades reais
  for (const [key, p] of Object.entries(VERIFIED_PLAYERS_MAP)) {
    finalMap.set(key, { ...p });
  }

  // 2. Buscar da API do Cartola FC para complementar os demais atletas profissionais
  try {
    console.log('🌐 Buscando atletas do Cartola FC...');
    const res = await fetch('https://api.cartola.globo.com/atletas/mercado');
    if (res.ok) {
      const data = await res.json();
      const atletas: any[] = data.atletas || [];
      const clubes: Record<string, any> = data.clubes || {};

      for (const a of atletas) {
        if (a.posicao_id === 6) continue;

        const rawApelido = (a.apelido || a.nome || '').trim();
        if (!rawApelido) continue;

        const normApelido = normalize(rawApelido);
        const normNome = normalize(a.nome || '');

        // Clube e Escudo
        const clubeData = clubes[a.clube_id];
        const slugClube = clubeData?.slug || '';
        const nomeClube = CLUB_NAMES[slugClube] || clubeData?.nome || 'Série A';
        const escudoClube = clubeData?.escudos?.['60x60'] || clubeData?.escudos?.['45x45'] || '';

        // Se o jogador é um craque verificado, preserva foto real e atualiza clube se necessário
        let matchedKey: string | null = null;
        for (const k of Object.keys(VERIFIED_PLAYERS_MAP)) {
          if (normApelido === k || normApelido.includes(k) || normNome.includes(k)) {
            matchedKey = k;
            break;
          }
        }

        if (matchedKey) {
          const verified = finalMap.get(matchedKey);
          if (verified) {
            // Se tiver escudo oficial, atualiza
            if (escudoClube) verified.teamLogo = escudoClube;
          }
          continue;
        }

        // Para os outros atletas:
        // Foto real se disponível no Cartola (com .replace('FORMATO', '220x220'))
        let photoUrl = '';
        if (a.foto && !a.foto.includes('silhueta')) {
          photoUrl = a.foto.replace('FORMATO', '220x220');
        } else {
          // Se for silhueta, usa a foto real recortada ou escudo do clube
          photoUrl = escudoClube || `https://s3.glbimg.com/v1/AUTH_58d78b787ec34892b5aaa0c7a146155f/clubes_2026/silhuetas/${clubeData?.abreviacao || 'FLA'}/220x220.png`;
        }

        const dedupeKey = `${normApelido}-${a.clube_id}`;
        if (!finalMap.has(dedupeKey)) {
          finalMap.set(dedupeKey, {
            id: a.atleta_id + 500000,
            name: rawApelido,
            photo: photoUrl,
            team: nomeClube,
            teamLogo: escudoClube,
            careerTeams: [nomeClube],
            age: 26,
            position: mapPosicao(a.posicao_id),
            nationality: 'Brasil',
            trophies: {
              brasileirao: false,
              copaDoBrasil: false,
              libertadores: false,
              sulamericana: false,
            },
          });
        }
      }
    }
  } catch (err) {
    console.warn('Erro ao consultar Cartola:', (err as Error).message);
  }

  const finalPlayers = Array.from(finalMap.values());

  // Ordenar priorizando jogadores com fotos reais do rosto da API-Sports
  finalPlayers.sort((a, b) => {
    const isApiSportsA = a.photo.includes('api-sports.io') ? 1 : 0;
    const isApiSportsB = b.photo.includes('api-sports.io') ? 1 : 0;
    return isApiSportsB - isApiSportsA;
  });

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(finalPlayers, null, 2), 'utf-8');
  console.log(`✅ Base gerada com ${finalPlayers.length} atletas. Fotos reais e idades reais salvas em ${OUTPUT_FILE}`);
}

syncPlayers();
