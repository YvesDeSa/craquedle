import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_FILE = path.resolve(__dirname, '../src/data/players.json');

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

// Dicionário de Nacionalidades dos Gringos da Série A
const FOREIGN_NATIONALITIES: Record<string, string> = {
  // Uruguai
  arrascaeta: 'Uruguai',
  'de la cruz': 'Uruguai',
  'nicolas de la cruz': 'Uruguai',
  rochet: 'Uruguai',
  'sergio rochet': 'Uruguai',
  varela: 'Uruguai',
  'guillermo varela': 'Uruguai',
  piquerez: 'Uruguai',
  'joaquin piquerez': 'Uruguai',
  cannobio: 'Uruguai',
  mastriani: 'Uruguai',
  'puma rodriguez': 'Uruguai',
  milans: 'Uruguai',
  terans: 'Uruguai',

  // Argentina
  calleri: 'Argentina',
  'jonathan calleri': 'Argentina',
  vegetti: 'Argentina',
  'pablo vegetti': 'Argentina',
  cano: 'Argentina',
  'german cano': 'Argentina',
  'flaco lopez': 'Argentina',
  'jose lopez': 'Argentina',
  garro: 'Argentina',
  'rodrigo garro': 'Argentina',
  rossi: 'Argentina',
  'agustin rossi': 'Argentina',
  bernabei: 'Argentina',
  kannemann: 'Argentina',
  'walter kannemann': 'Argentina',
  lucero: 'Argentina',
  'juan martin lucero': 'Argentina',
  'anibal moreno': 'Argentina',
  giay: 'Argentina',
  bustos: 'Argentina',
  barboza: 'Argentina',
  gattoni: 'Argentina',
  palacios: 'Argentina',
  villalba: 'Argentina',
  alario: 'Argentina',
  cristaldo: 'Argentina',
  pavon: 'Argentina',
  britez: 'Argentina',
  battaglia: 'Argentina',
  saravia: 'Argentina',
  zaracho: 'Argentina',
  fausto: 'Argentina',
  vera: 'Argentina',
  marchesin: 'Argentina',

  // Colômbia
  arias: 'Colômbia',
  'jhon arias': 'Colômbia',
  borre: 'Colômbia',
  'rafael borre': 'Colômbia',
  'richard rios': 'Colômbia',
  rios: 'Colômbia',
  'james rodriguez': 'Colômbia',
  cantillo: 'Colômbia',
  campaz: 'Colômbia',
  monsalve: 'Colômbia',

  // Paraguai
  'gustavo gomez': 'Paraguai',
  gomez: 'Paraguai',
  villasanti: 'Paraguai',
  'mathias villasanti': 'Paraguai',
  romero: 'Paraguai',
  'angel romero': 'Paraguai',
  'matias rojas': 'Paraguai',
  balbuena: 'Paraguai',
  bobadilla: 'Paraguai',
  galarza: 'Paraguai',
  'junior alonso': 'Paraguai',

  // Venezuela
  soteldo: 'Venezuela',
  'yeferson soteldo': 'Venezuela',
  savarino: 'Venezuela',
  'jefferson savarino': 'Venezuela',
  ferraresi: 'Venezuela',
  'nahuel ferraresi': 'Venezuela',

  // Holanda
  depay: 'Holanda',
  'memphis depay': 'Holanda',

  // Dinamarca
  braithwaite: 'Dinamarca',
  'martin braithwaite': 'Dinamarca',

  // Peru
  carrillo: 'Peru',
  'andre carrillo': 'Peru',
  guerrero: 'Peru',
  trauco: 'Peru',
  cueva: 'Peru',

  // Equador
  valencia: 'Equador',
  'enner valencia': 'Equador',
  arboleda: 'Equador',
  'robert arboleda': 'Equador',
  'felix torres': 'Equador',
  'alan franco': 'Equador',

  // Angola
  bastos: 'Angola',

  // Chile
  pulgar: 'Chile',
  'erick pulgar': 'Chile',
  vargas: 'Chile',
  'eduardo vargas': 'Chile',
  kuscevic: 'Chile',
  medel: 'Chile',

  // França
  payet: 'França',
  'dimitri payet': 'França',

  // RD Congo
  bolasie: 'República Democrática do Congo',
  'yannick bolasie': 'República Democrática do Congo',
};

// Dicionário de Títulos dos Principais Craques (Brasileirão, Copa do Brasil, Libertadores, Sul-Americana)
const STAR_TROPHIES: Record<string, { brasileirao: boolean; copaDoBrasil: boolean; libertadores: boolean; sulamericana: boolean }> = {
  pedro: { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  arrascaeta: { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  gerson: { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'de la cruz': { brasileirao: false, copaDoBrasil: true, libertadores: true, sulamericana: false },
  rossi: { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: true }, // Lanús/Defensa
  hulk: { brasileirao: true, copaDoBrasil: true, libertadores: false, sulamericana: false },
  paulinho: { brasileirao: false, copaDoBrasil: false, libertadores: false, sulamericana: false },
  arana: { brasileirao: true, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'guilherme arana': { brasileirao: true, copaDoBrasil: true, libertadores: false, sulamericana: false },
  scarpa: { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'gustavo scarpa': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  everson: { brasileirao: true, copaDoBrasil: true, libertadores: false, sulamericana: false },
  estevao: { brasileirao: true, copaDoBrasil: false, libertadores: false, sulamericana: false },
  veiga: { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: true }, // Athletico-PR 2018
  'raphael veiga': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: true }, // Athletico-PR 2018
  'gustavo gomez': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  weverton: { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  murilo: { brasileirao: true, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'flaco lopez': { brasileirao: true, copaDoBrasil: false, libertadores: false, sulamericana: false },
  calleri: { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'lucas moura': { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: true }, // São Paulo 2012
  luciano: { brasileirao: true, copaDoBrasil: true, libertadores: false, sulamericana: false },
  oscar: { brasileirao: true, copaDoBrasil: false, libertadores: true, sulamericana: false },
  rafael: { brasileirao: true, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'yuri alberto': { brasileirao: false, copaDoBrasil: false, libertadores: false, sulamericana: false },
  garro: { brasileirao: false, copaDoBrasil: false, libertadores: false, sulamericana: false },
  'rodrigo garro': { brasileirao: false, copaDoBrasil: false, libertadores: false, sulamericana: false },
  depay: { brasileirao: false, copaDoBrasil: false, libertadores: false, sulamericana: false },
  'memphis depay': { brasileirao: false, copaDoBrasil: false, libertadores: false, sulamericana: false },
  'hugo souza': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  carrillo: { brasileirao: false, copaDoBrasil: false, libertadores: false, sulamericana: false },
  vegetti: { brasileirao: false, copaDoBrasil: false, libertadores: false, sulamericana: false },
  'pablo vegetti': { brasileirao: false, copaDoBrasil: false, libertadores: false, sulamericana: false },
  coutinho: { brasileirao: false, copaDoBrasil: false, libertadores: false, sulamericana: false },
  'philippe coutinho': { brasileirao: false, copaDoBrasil: false, libertadores: false, sulamericana: false },
  'leo jardim': { brasileirao: false, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'lucas piton': { brasileirao: false, copaDoBrasil: false, libertadores: false, sulamericana: false },
  'thiago silva': { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: false },
  arias: { brasileirao: false, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'jhon arias': { brasileirao: false, copaDoBrasil: false, libertadores: true, sulamericana: false },
  ganso: { brasileirao: false, copaDoBrasil: true, libertadores: true, sulamericana: true }, // São Paulo 2012
  fabio: { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  cano: { brasileirao: false, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'german cano': { brasileirao: false, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'alan patrick': { brasileirao: false, copaDoBrasil: true, libertadores: true, sulamericana: false },
  borre: { brasileirao: false, copaDoBrasil: false, libertadores: true, sulamericana: true }, // River Plate 2014
  'rafael borre': { brasileirao: false, copaDoBrasil: false, libertadores: true, sulamericana: true },
  valencia: { brasileirao: false, copaDoBrasil: false, libertadores: false, sulamericana: false },
  'enner valencia': { brasileirao: false, copaDoBrasil: false, libertadores: false, sulamericana: false },
  rochet: { brasileirao: false, copaDoBrasil: false, libertadores: false, sulamericana: false },
  savarino: { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'igor jesus': { brasileirao: false, copaDoBrasil: false, libertadores: true, sulamericana: false },
  bastos: { brasileirao: false, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'alex telles': { brasileirao: false, copaDoBrasil: false, libertadores: true, sulamericana: false },
  john: { brasileirao: false, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'everton ribeiro': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'jean lucas': { brasileirao: false, copaDoBrasil: false, libertadores: false, sulamericana: false },
  juba: { brasileirao: false, copaDoBrasil: false, libertadores: false, sulamericana: false },
  'luciano juba': { brasileirao: false, copaDoBrasil: false, libertadores: false, sulamericana: false },
  'matheus pereira': { brasileirao: false, copaDoBrasil: false, libertadores: false, sulamericana: false },
  cassio: { brasileirao: true, copaDoBrasil: false, libertadores: true, sulamericana: false },
  gabigol: { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'gabriel barbosa': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  dudu: { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'kaio jorge': { brasileirao: false, copaDoBrasil: false, libertadores: false, sulamericana: false },
  soteldo: { brasileirao: false, copaDoBrasil: false, libertadores: false, sulamericana: false },
  braithwaite: { brasileirao: false, copaDoBrasil: false, libertadores: false, sulamericana: false },
  villasanti: { brasileirao: false, copaDoBrasil: false, libertadores: false, sulamericana: false },
  neymar: { brasileirao: false, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'bruno henrique': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'david luiz': { brasileirao: false, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'leo pereira': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'ayrton lucas': { brasileirao: false, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'felipe melo': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  marcelo: { brasileirao: false, copaDoBrasil: false, libertadores: true, sulamericana: false },
  keno: { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'tche tche': { brasileirao: true, copaDoBrasil: false, libertadores: true, sulamericana: false },
  kannemann: { brasileirao: false, copaDoBrasil: true, libertadores: true, sulamericana: false },
  geromel: { brasileirao: false, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'marcos rocha': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  mayke: { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'ze rafael': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  rony: { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: true }, // Athletico-PR 2018
  fagner: { brasileirao: true, copaDoBrasil: false, libertadores: false, sulamericana: false },
  romero: { brasileirao: true, copaDoBrasil: false, libertadores: false, sulamericana: false },
  'tiquinho soares': { brasileirao: false, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'junior santos': { brasileirao: false, copaDoBrasil: false, libertadores: true, sulamericana: false },
  marlon: { brasileirao: false, copaDoBrasil: false, libertadores: true, sulamericana: false },
  gregore: { brasileirao: false, copaDoBrasil: false, libertadores: true, sulamericana: false },
  nikao: { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: true }, // Athletico-PR 2018, 2021
  terans: { brasileirao: false, copaDoBrasil: false, libertadores: false, sulamericana: true }, // Athletico-PR 2021
  pablo: { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: true }, // Athletico-PR 2018
  'thiago heleno': { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: true }, // Athletico-PR 2018, 2021
  santos: { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: true }, // Athletico-PR 2018, 2021 + Flamengo 2022
  cirino: { brasileirao: true, copaDoBrasil: true, libertadores: false, sulamericana: true },
  bernabei: { brasileirao: false, copaDoBrasil: false, libertadores: false, sulamericana: true }, // Lanús 2013
};

// Histórico de Carreira dos Principais Atletas (para o Grid 3x3)
const CAREER_TEAMS_MAP: Record<string, string[]> = {
  pedro: ['Fluminense', 'Fiorentina', 'Flamengo'],
  arrascaeta: ['Defensor Sporting', 'Cruzeiro', 'Flamengo'],
  gerson: ['Fluminense', 'Roma', 'Fiorentina', 'Marseille', 'Flamengo'],
  'de la cruz': ['Liverpool Montevideo', 'River Plate', 'Flamengo'],
  rossi: ['Boca Juniors', 'Al-Nassr', 'Flamengo'],
  hulk: ['Vitória', 'Porto', 'Zenit', 'Shanghai SIPG', 'Atlético-MG'],
  paulinho: ['Vasco', 'Bayer Leverkusen', 'Atlético-MG'],
  arana: ['Corinthians', 'Sevilla', 'Atalanta', 'Atlético-MG'],
  scarpa: ['Fluminense', 'Palmeiras', 'Nottingham Forest', 'Atlético-MG'],
  veiga: ['Coritiba', 'Athletico-PR', 'Palmeiras'],
  gomez: ['Libertad', 'Milan', 'Palmeiras'],
  weverton: ['Corinthians', 'Athletico-PR', 'Palmeiras', 'Grêmio'],
  calleri: ['Boca Juniors', 'West Ham', 'São Paulo'],
  'lucas moura': ['São Paulo', 'Paris Saint-Germain', 'Tottenham'],
  luciano: ['Corinthians', 'Fluminense', 'Grêmio', 'São Paulo'],
  depay: ['PSV Eindhoven', 'Manchester United', 'Barcelona', 'Atlético Madrid', 'Corinthians'],
  'hugo souza': ['Flamengo', 'Chaves', 'Corinthians'],
  vegetti: ['Belgrano', 'Vasco'],
  coutinho: ['Vasco', 'Liverpool', 'Barcelona', 'Bayern de Munique', 'Aston Villa'],
  'thiago silva': ['Fluminense', 'Milan', 'Paris Saint-Germain', 'Chelsea'],
  ganso: ['Santos', 'São Paulo', 'Sevilla', 'Fluminense'],
  fabio: ['Vasco', 'Cruzeiro', 'Fluminense'],
  arias: ['Santa Fe', 'Fluminense'],
  cano: ['Vasco', 'Fluminense'],
  'alan patrick': ['Santos', 'Shakhtar Donetsk', 'Palmeiras', 'Flamengo', 'Internacional'],
  savarino: ['Atlético-MG', 'Botafogo'],
  'everton ribeiro': ['Corinthians', 'Cruzeiro', 'Flamengo', 'Bahia'],
  cassio: ['Grêmio', 'PSV Eindhoven', 'Corinthians', 'Cruzeiro'],
  gabigol: ['Santos', 'Inter de Milão', 'Benfica', 'Flamengo', 'Cruzeiro'],
  dudu: ['Cruzeiro', 'Grêmio', 'Palmeiras'],
  soteldo: ['Santos', 'Grêmio'],
  braithwaite: ['Barcelona', 'Espanyol', 'Grêmio'],
  neymar: ['Santos', 'Barcelona', 'Paris Saint-Germain', 'Al-Hilal'],
};

// Nomes de exibição customizados para garantir identificação imediata
const DISPLAY_NAMES: Record<string, string> = {
  pedro: 'Pedro',
  'pedro guilherme abreu dos santos': 'Pedro',
  'giorgian daniel de arrascaeta benedetti': 'Arrascaeta',
  arrascaeta: 'Arrascaeta',
  'gabriel barbosa almeida': 'Gabigol',
  'givanildo vieira de souza': 'Hulk',
  'memphis depay': 'Memphis Depay',
  'pablo ezequiel vegetti pfaffen': 'Pablo Vegetti',
  'philippe coutinho correia': 'Philippe Coutinho',
  'thiago emiliano da silva': 'Thiago Silva',
  'paulo henrique chagas de lima': 'Ganso',
  'hugo de souza nogueira': 'Hugo Souza',
  'lucas rodrigues moura da silva': 'Lucas Moura',
  'jonathan calleri': 'Jonathan Calleri',
  'raphael cavalcante veiga': 'Raphael Veiga',
  'gustavo raul gomez portillo': 'Gustavo Gómez',
  'weverton pereira da silva': 'Weverton',
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
  console.log('⚽ Sincronizando Cartola FC com correção de fotos e sobreposição total...');

  try {
    const res = await fetch('https://api.cartola.globo.com/atletas/mercado');
    if (!res.ok) {
      throw new Error(`Erro ao consultar Cartola FC (${res.status}): ${res.statusText}`);
    }

    const data = await res.json();
    const atletas: any[] = data.atletas || [];
    const clubes: Record<string, any> = data.clubes || {};

    console.log(`📦 Retornados ${atletas.length} atletas do Cartola FC.`);

    const playersResult: any[] = [];
    const seenNames = new Set<string>();

    // Ordena atletas priorizando os mais relevantes/conhecidos (maior preço/jogos)
    atletas.sort((a, b) => {
      const scoreA = (a.preco_num || 0) * 2 + (a.jogos_num || 0);
      const scoreB = (b.preco_num || 0) * 2 + (b.jogos_num || 0);
      return scoreB - scoreA;
    });

    for (const atleta of atletas) {
      if (atleta.posicao_id === 6) continue; // Ignora comissão técnica

      const rawApelido = (atleta.apelido || atleta.nome || '').trim();
      if (!rawApelido) continue;

      const normApelido = normalize(rawApelido);
      const normNome = normalize(atleta.nome || '');

      const dedupeKey = `${normApelido}-${atleta.clube_id}`;
      if (seenNames.has(dedupeKey)) continue;
      seenNames.add(dedupeKey);

      // Clube e Escudo
      const clubeData = clubes[atleta.clube_id];
      const slugClube = clubeData?.slug || '';
      const nomeClube = CLUB_NAMES[slugClube] || clubeData?.nome || 'Série A';
      const escudoClube = clubeData?.escudos?.['60x60'] || clubeData?.escudos?.['45x45'] || '';

      // 1. Substituir FORMATO por 220x220 para garantir 100% de fotos válidas
      const photoUrl = atleta.foto
        ? atleta.foto.replace('FORMATO', '220x220')
        : (escudoClube || 'https://via.placeholder.com/220');

      // Nome de exibição inteligente
      let displayName = rawApelido;
      if (DISPLAY_NAMES[normApelido]) {
        displayName = DISPLAY_NAMES[normApelido];
      } else if (DISPLAY_NAMES[normNome]) {
        displayName = DISPLAY_NAMES[normNome];
      }

      // 2. Nacionalidade
      let nationality = 'Brasil';
      for (const [key, nat] of Object.entries(FOREIGN_NATIONALITIES)) {
        if (normApelido === key || normApelido.includes(key) || normNome.includes(key)) {
          nationality = nat;
          break;
        }
      }

      // 3. Títulos (Brasileirão, Copa do Brasil, Libertadores, Sul-Americana)
      let trophies = {
        brasileirao: false,
        copaDoBrasil: false,
        libertadores: false,
        sulamericana: false,
      };

      for (const [key, tMap] of Object.entries(STAR_TROPHIES)) {
        if (normApelido === key || normApelido.includes(key) || normNome.includes(key)) {
          trophies = { ...tMap };
          break;
        }
      }

      // 4. Histórico de clubes (careerTeams)
      let careerTeams = [nomeClube];
      for (const [key, teams] of Object.entries(CAREER_TEAMS_MAP)) {
        if (normApelido === key || normApelido.includes(key) || normNome.includes(key)) {
          careerTeams = Array.from(new Set([...teams, nomeClube]));
          break;
        }
      }

      // Estimativa realista de idade baseada em dados de jogo ou veterano
      let age = 26;
      if (atleta.preco_num > 10 || atleta.jogos_num > 20) age = 29;
      else if (atleta.jogos_num < 5 && atleta.preco_num < 3) age = 22;

      playersResult.push({
        id: atleta.atleta_id,
        name: displayName,
        photo: photoUrl,
        team: nomeClube,
        teamLogo: escudoClube,
        careerTeams,
        age,
        position: mapPosicao(atleta.posicao_id),
        nationality,
        trophies,
      });
    }

    // Garante presença do Vegetti caso ausente no snapshot da API
    const hasVegetti = playersResult.some(p => normalize(p.name).includes('vegetti'));
    if (!hasVegetti) {
      const vascoBadge = 'https://s3.glbimg.com/v1/AUTH_58d78b787ec34892b5aaa0c7a146155f/clubes_2026/escudos/VAS/60x60.png';
      playersResult.unshift({
        id: 999901,
        name: 'Pablo Vegetti',
        photo: 'https://s3.glbimg.com/v1/AUTH_58d78b787ec34892b5aaa0c7a146155f/clubes_2026/silhuetas/VAS/220x220.png',
        team: 'Vasco',
        teamLogo: vascoBadge,
        careerTeams: ['Belgrano', 'Vasco'],
        age: 36,
        position: 'Atacante',
        nationality: 'Argentina',
        trophies: { brasileirao: false, copaDoBrasil: false, libertadores: false, sulamericana: false },
      });
    }

    console.log(`✅ Base gerada com ${playersResult.length} atletas da Série A.`);
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(playersResult, null, 2), 'utf-8');
    console.log(`💾 Arquivo salvo com sucesso em: ${OUTPUT_FILE}`);
  } catch (err) {
    console.error('❌ Falha na sincronização:', err);
  }
}

syncPlayers();
