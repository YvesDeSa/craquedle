const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const PLAYERS_FILE = path.resolve('src/data/players.json');
const TROPHIES_SEED_FILE = path.resolve('scripts/trophies-seed.json');

const players = JSON.parse(fs.readFileSync(PLAYERS_FILE, 'utf8'));
const trophiesSeed = fs.existsSync(TROPHIES_SEED_FILE)
  ? JSON.parse(fs.readFileSync(TROPHIES_SEED_FILE, 'utf8'))
  : [];

// Map existing seeds by normalized name or id
const seedMap = new Map();
if (Array.isArray(trophiesSeed)) {
  trophiesSeed.forEach(s => {
    if (s.name) seedMap.set(s.name.toLowerCase().trim(), s.trophies);
  });
}

function fetchJson(url) {
  try {
    const cmd = `curl.exe -s -H "Accept: application/json" -H "Accept-Language: pt-BR,pt;q=0.9" "${url}"`;
    const res = execSync(cmd, { timeout: 10000 }).toString('utf8');
    return JSON.parse(res);
  } catch (e) {
    return null;
  }
}

const CLUB_NAME_CANONICAL = {
  'cr flamengo': 'Flamengo',
  'flamengo': 'Flamengo',
  'se palmeiras': 'Palmeiras',
  'palmeiras': 'Palmeiras',
  'sc corinthians': 'Corinthians',
  'corinthians': 'Corinthians',
  'são paulo fc': 'São Paulo',
  'são paulo': 'São Paulo',
  'santos fc': 'Santos',
  'santos': 'Santos',
  'fluminense fc': 'Fluminense',
  'fluminense': 'Fluminense',
  'botafogo fr': 'Botafogo',
  'botafogo': 'Botafogo',
  'cr vasco da gama': 'Vasco',
  'vasco': 'Vasco',
  'atlético mineiro': 'Atlético-MG',
  'atlético-mg': 'Atlético-MG',
  'ec cruzeiro': 'Cruzeiro',
  'cruzeiro': 'Cruzeiro',
  'grêmio fbpa': 'Grêmio',
  'grêmio': 'Grêmio',
  'sc internacional': 'Internacional',
  'internacional': 'Internacional',
  'ec bahia': 'Bahia',
  'bahia': 'Bahia',
  'athletico paranaense': 'Athletico-PR',
  'athletico-pr': 'Athletico-PR',
  'red bull bragantino': 'Red Bull Bragantino',
  'rb bragantino': 'Red Bull Bragantino',
  'bragantino': 'Red Bull Bragantino',
  'coritiba fc': 'Coritiba',
  'coritiba': 'Coritiba',
  'chapecoense': 'Chapecoense',
  'ec vitória': 'Vitória',
  'vitória': 'Vitória',
  'mirassol fc': 'Mirassol',
  'mirassol': 'Mirassol',
  'clube do remo': 'Remo',
  'remo': 'Remo',
  'fortaleza ec': 'Fortaleza',
  'fortaleza': 'Fortaleza',
  'ceará sc': 'Ceará',
  'ceará': 'Ceará',
  'goiás ec': 'Goiás',
  'goiás': 'Goiás',
  'cuiabá ec': 'Cuiabá',
  'cuiabá': 'Cuiabá',
  'américa mineiro': 'América-MG',
  'américa-mg': 'América-MG',
  'sport recife': 'Sport',
  'sport': 'Sport',
  'ponte preta': 'Ponte Preta',
  'juventude': 'Juventude',
  'atlético-go': 'Atlético-GO',
  'criciúma': 'Criciúma',
  'avaí': 'Avaí',
  'figueirense': 'Figueirense',
  'operário-pr': 'Operário-PR',
  'vila nova': 'Vila Nova',
  'londrina': 'Londrina',
  'novorizontino': 'Novorizontino',
  'ituano': 'Ituano',
  'botafogo-sp': 'Botafogo-SP',
  'fc liverpool': 'Liverpool',
  'liverpool fc': 'Liverpool',
  'liverpool': 'Liverpool',
  'manchester united': 'Manchester United',
  'manchester united fc': 'Manchester United',
  'man utd': 'Manchester United',
  'manchester city': 'Manchester City',
  'chelsea fc': 'Chelsea',
  'arsenal fc': 'Arsenal',
  'tottenham hotspur': 'Tottenham',
  'real madrid': 'Real Madrid',
  'fc barcelona': 'Barcelona',
  'barcelona': 'Barcelona',
  'atlético de madrid': 'Atlético de Madrid',
  'juventus fc': 'Juventus',
  'juventus': 'Juventus',
  'ac milan': 'Milan',
  'milan': 'Milan',
  'inter de milão': 'Inter de Milão',
  'inter milan': 'Inter de Milão',
  'fc porto': 'Porto',
  'porto': 'Porto',
  'sl benfica': 'Benfica',
  'benfica': 'Benfica',
  'sporting cp': 'Sporting',
  'paris saint-germain': 'PSG',
  'psg': 'PSG',
  'fc bayern münchen': 'Bayern de Munique',
  'bayern de munique': 'Bayern de Munique',
  'eintracht frankfurt': 'Eintracht Frankfurt',
  'sg eintracht frankfurt': 'Eintracht Frankfurt',
  'frankfurt': 'Eintracht Frankfurt',
  'hertha bsc': 'Hertha Berlim',
  'hertha berlim': 'Hertha Berlim',
  'st.truiden': 'Sint-Truiden',
  'vv st.truiden': 'Sint-Truiden',
  'sint-truidense vv': 'Sint-Truiden',
  'apol. limassol': 'Apollon Limassol',
  'apollon limassol': 'Apollon Limassol',
  'sjk seinäjoki': 'SJK Seinäjoki',
  'zenit st. petersburg': 'Zenit',
  'zenit': 'Zenit',
  'al-hilal sfc': 'Al-Hilal',
  'al-nassr fc': 'Al-Nassr',
  'granada cf': 'Granada',
  'valencia cf': 'Valencia',
  'ss lazio': 'Lazio',
  'lazio': 'Lazio',
  'fulham fc': 'Fulham',
  'fulham': 'Fulham',
  'acf fiorentina': 'Fiorentina',
  'fiorentina': 'Fiorentina'
};

function normalizeName(raw) {
  if (!raw) return '';
  const lower = raw.trim().toLowerCase();
  if (CLUB_NAME_CANONICAL[lower]) return CLUB_NAME_CANONICAL[lower];
  return raw
    .replace(/\s+(FC|EC|SC|AC|CF|CA|SE|CR|CD|BSC|SFC|CP|SK)\b/gi, '')
    .replace(/^(FC|EC|SC|AC|CF|CA|SE|CR|CD|BSC|SFC|CP|SK)\s+/gi, '')
    .replace(/\s*(U[12]\d|S[12]\d|Juv\.?|Youth|Sub-?[12]\d|B|II)$/gi, '')
    .trim();
}

function isYouthOrReserve(name) {
  if (!name) return true;
  const lower = name.toLowerCase();
  if (/sem clube|without club|unknown|desconhecido/i.test(lower)) return true;
  if (/juv|youth|jgd|junioren|nachwuchs|academy|base|sub-?[12]\d|\bu[12]\d\b|\bs[12]\d\b/i.test(lower)) return true;
  if (/\s+b\b|\s+ii\b/i.test(lower)) return true;
  return false;
}

function getSeniorClub(name) {
  if (!name) return '';
  return normalizeName(name.replace(/\s*(U[12]\d|S[12]\d|Juv\.?|Youth|Sub-?[12]\d|B|II)$/gi, ''));
}

// Global club metadata cache
const globalClubCache = new Map();

function getClubsBatch(clubIds) {
  const missing = clubIds.filter(id => !globalClubCache.has(String(id)));
  if (missing.length > 0) {
    // Query in slices of 30
    for (let i = 0; i < missing.length; i += 30) {
      const slice = missing.slice(i, i + 30);
      const query = slice.map(c => `ids[]=${c}`).join('&');
      const res = fetchJson(`https://tmapi.transfermarkt.technology/clubs?${query}`);
      (res?.data || []).forEach(c => {
        globalClubCache.set(String(c.id), c);
      });
    }
  }
}

// Known trophies from sanitize-players.cjs
const KNOWN_TROPHIES = {
  'gabigol': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'gabriel barbosa': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'arrascaeta': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'giorgian de arrascaeta': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'bruno henrique': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'pedro': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'gerson': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'nicolás de la cruz': { brasileirao: false, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'agustín rossi': { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: true },
  'léo pereira': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: true },
  'léo ortiz': { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'ayrton lucas': { brasileirao: false, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'alex sandro': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'fabrício bruno': { brasileirao: false, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'allan': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'erick pulgar': { brasileirao: false, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'luiz araújo': { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'everton cebolinha': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'david luiz': { brasileirao: false, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'michael': { brasileirao: true, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'matheus cunha': { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'wesley': { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'guillermo varela': { brasileirao: false, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'weverton': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'gustavo gómez': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'murilo': { brasileirao: true, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'marcos rocha': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'mayke': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'joaquín piquerez': { brasileirao: true, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'piquerez': { brasileirao: true, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'zé rafael': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'gabriel menino': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'richard ríos': { brasileirao: true, copaDoBrasil: false, libertadores: false, sulamericana: false },
  'raphael veiga': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: true },
  'dudu': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'rony': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: true },
  'flaco lópez': { brasileirao: true, copaDoBrasil: false, libertadores: false, sulamericana: false },
  'josé manuel lópez': { brasileirao: true, copaDoBrasil: false, libertadores: false, sulamericana: false },
  'marcelo lomba': { brasileirao: true, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'felipe anderson': { brasileirao: false, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'everson': { brasileirao: true, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'junior alonso': { brasileirao: true, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'guilherme arana': { brasileirao: true, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'otávio': { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: true },
  'matías zaracho': { brasileirao: true, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'zaracho': { brasileirao: true, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'gustavo scarpa': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'bernard': { brasileirao: false, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'hulk': { brasileirao: true, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'deyverson': { brasileirao: true, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'igor rabello': { brasileirao: true, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'alan kardec': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'mariano': { brasileirao: true, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'bastos': { brasileirao: true, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'alexander barboza': { brasileirao: true, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'vitinho': { brasileirao: true, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'cuiabano': { brasileirao: true, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'alex telles': { brasileirao: true, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'marlon freitas': { brasileirao: true, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'gregore': { brasileirao: true, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'allan loureiro': { brasileirao: true, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'carlos eduardo': { brasileirao: true, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'thiago almada': { brasileirao: true, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'luiz henrique': { brasileirao: true, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'jefferson savarino': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'savarino': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'júnior santos': { brasileirao: true, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'igor jesus': { brasileirao: true, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'tiquinho soares': { brasileirao: true, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'matheus martins': { brasileirao: true, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'tchê tchê': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'gatito fernández': { brasileirao: true, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'john': { brasileirao: true, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'danilo': { brasileirao: false, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'rafael': { brasileirao: true, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'robert arboleda': { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'arboleda': { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'alan franco': { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: true },
  'rafinha': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'welington': { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'pablo maia': { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'alisson': { brasileirao: true, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'rodrigo nestor': { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'michel araújo': { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'luciano': { brasileirao: true, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'jonathan calleri': { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'calleri': { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'lucas moura': { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: true },
  'wellington rato': { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'jandrei': { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'fábio': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'samuel xavier': { brasileirao: false, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'thiago silva': { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'felipe melo': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'diogo barbosa': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'martinelli': { brasileirao: false, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'matheus martinelli': { brasileirao: false, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'paulo henrique ganso': { brasileirao: false, copaDoBrasil: true, libertadores: true, sulamericana: true },
  'ganso': { brasileirao: false, copaDoBrasil: true, libertadores: true, sulamericana: true },
  'jhon arias': { brasileirao: false, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'keno': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'germán cano': { brasileirao: false, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'cano': { brasileirao: false, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'john kennedy': { brasileirao: false, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'lima': { brasileirao: false, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'guga': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'manoel': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'renato augusto': { brasileirao: true, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'hugo souza': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'fagner': { brasileirao: true, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'gustavo henrique': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'ángel romero': { brasileirao: true, copaDoBrasil: false, libertadores: false, sulamericana: false },
  'romero': { brasileirao: true, copaDoBrasil: false, libertadores: false, sulamericana: false },
  'cássio': { brasileirao: true, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'zé ivaldo': { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: true },
  'lucas romero': { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'lucas silva': { brasileirao: true, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'walace': { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'gabriel veron': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'lautaro díaz': { brasileirao: false, copaDoBrasil: false, libertadores: false, sulamericana: true },
  'geromel': { brasileirao: false, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'pedro geromel': { brasileirao: false, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'kannemann': { brasileirao: false, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'walter kannemann': { brasileirao: false, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'pepê': { brasileirao: true, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'edenilson': { brasileirao: true, copaDoBrasil: false, libertadores: false, sulamericana: false },
  'diego costa': { brasileirao: true, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'rafael cabral': { brasileirao: false, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'gabriel mercado': { brasileirao: false, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'renê': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'thiago maia': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'alan patrick': { brasileirao: false, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'rafael borré': { brasileirao: false, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'lucas alario': { brasileirao: false, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'everton ribeiro': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'thaciano': { brasileirao: true, copaDoBrasil: false, libertadores: false, sulamericana: false },
  'ademir': { brasileirao: true, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'gil': { brasileirao: true, copaDoBrasil: false, libertadores: false, sulamericana: false },
  'giuliano': { brasileirao: false, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'willian': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'willian bigode': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'neymar': { brasileirao: false, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'neymar jr': { brasileirao: false, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'maicon': { brasileirao: false, copaDoBrasil: false, libertadores: false, sulamericana: true },
  'léo pelé': { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'hugo moura': { brasileirao: true, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'jair': { brasileirao: true, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'david': { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'philippe coutinho': { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'coutinho': { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'alex teixeira': { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'thiago heleno': { brasileirao: true, copaDoBrasil: true, libertadores: false, sulamericana: true },
  'madson': { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'erick': { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: true },
  'nikão': { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: true },
  'pablo': { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: true },
  'fernandinho': { brasileirao: false, copaDoBrasil: false, libertadores: false, sulamericana: false },
  'eduardo sasha': { brasileirao: true, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'sasha': { brasileirao: true, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'matheus fernandes': { brasileirao: true, copaDoBrasil: false, libertadores: false, sulamericana: false },
  'helinho': { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'tinga': { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'marinho': { brasileirao: false, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'wellington nem': { brasileirao: true, copaDoBrasil: false, libertadores: false, sulamericana: false }
};

console.log(`Starting enrichment of ${players.length} players...`);

let processed = 0;
let errors = 0;

for (let i = 0; i < players.length; i++) {
  const p = players[i];
  try {
    const tData = fetchJson(`https://tmapi.transfermarkt.technology/transfer/history/player/${p.id}`)?.data;
    if (tData) {
      const clubIds = tData.clubIds || [];
      getClubsBatch(clubIds);

      const transfers = [...(tData.history?.terminated || [])].reverse();
      const rawEvents = [];

      for (let j = 0; j < transfers.length; j++) {
        const tr = transfers[j];
        const src = globalClubCache.get(String(tr.transferSource?.clubId));
        const dst = globalClubCache.get(String(tr.transferDestination?.clubId));
        const isLoan = tr.typeDetails?.type === 'ACTIVE_LOAN_TRANSFER';
        const isReturn = tr.typeDetails?.type === 'RETURNED_FROM_PREVIOUS_LOAN';

        if (!dst) continue;

        const srcIsYouth = isYouthOrReserve(src?.name);
        const dstIsYouth = isYouthOrReserve(dst?.name);

        if (srcIsYouth && dstIsYouth) continue;
        if (isReturn) continue;

        if (isLoan) {
          const parentSenior = getSeniorClub(src?.shortName || src?.name);
          if (rawEvents.length === 0 && parentSenior && !isYouthOrReserve(parentSenior)) {
            rawEvents.push({
              club: parentSenior,
              logo: src?.crestUrl || '',
              type: 'def',
              isLoan: false
            });
          }
          if (!dstIsYouth) {
            const seniorDst = normalizeName(dst.shortName || dst.name);
            rawEvents.push({
              club: seniorDst,
              logo: dst?.crestUrl || '',
              type: 'emp',
              isLoan: true
            });
          }
          continue;
        }

        if (srcIsYouth && !dstIsYouth) {
          const seniorDst = normalizeName(dst.shortName || dst.name);
          if (rawEvents.length === 0) {
            rawEvents.push({
              club: seniorDst,
              logo: dst?.crestUrl || '',
              type: 'def',
              isLoan: false
            });
          }
          continue;
        }

        if (!dstIsYouth) {
          const seniorDst = normalizeName(dst.shortName || dst.name);
          rawEvents.push({
            club: seniorDst,
            logo: dst?.crestUrl || '',
            type: 'def',
            isLoan: false
          });
        }
      }

      // Deduplicate consecutive identical clubs
      const dedup = [];
      for (const ev of rawEvents) {
        const prev = dedup[dedup.length - 1];
        if (!prev) {
          dedup.push(ev);
        } else if (prev.club !== ev.club) {
          dedup.push(ev);
        } else {
          if (ev.type === 'def') {
            prev.type = 'def';
            prev.isLoan = false;
          }
        }
      }

      // Ensure current team is represented
      if (p.team) {
        const normTeam = normalizeName(p.team);
        if (dedup.length === 0) {
          dedup.push({
            club: normTeam,
            logo: p.teamLogo || '',
            type: 'def',
            isLoan: false
          });
        } else if (dedup[dedup.length - 1].club !== normTeam) {
          dedup.push({
            club: normTeam,
            logo: p.teamLogo || '',
            type: 'def',
            isLoan: false
          });
        }
      }

      p.careerHistory = dedup;
      p.careerTeams = dedup.map(d => d.club);
    }

    // Trophies resolution
    const normPlayerName = p.name.toLowerCase().trim();
    const known = KNOWN_TROPHIES[normPlayerName] || seedMap.get(normPlayerName);

    if (known) {
      p.trophies = {
        brasileirao: Boolean(p.trophies?.brasileirao || known.brasileirao),
        copaDoBrasil: Boolean(p.trophies?.copaDoBrasil || known.copaDoBrasil),
        libertadores: Boolean(p.trophies?.libertadores || known.libertadores),
        sulamericana: Boolean(p.trophies?.sulamericana || known.sulamericana),
      };
    } else if (!p.trophies) {
      p.trophies = {
        brasileirao: false,
        copaDoBrasil: false,
        libertadores: false,
        sulamericana: false,
      };
    }

    processed++;
  } catch (err) {
    errors++;
  }

  // Periodic save and progress report
  if ((i + 1) % 25 === 0 || i === players.length - 1) {
    fs.writeFileSync(PLAYERS_FILE, JSON.stringify(players, null, 2), 'utf8');
    console.log(`[${i + 1}/${players.length}] players processed. Cached ${globalClubCache.size} clubs.`);
  }
}

console.log(`\nDONE! Processed ${processed} players (${errors} errors).`);
