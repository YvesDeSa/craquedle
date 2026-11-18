const fs = require('fs');
const path = require('path');

const PLAYERS_FILE = path.resolve('src/data/players.json');
const players = JSON.parse(fs.readFileSync(PLAYERS_FILE, 'utf8'));

// Dicionário com os IDs do Transfermarkt para Akamai CDN
const TM_CLUB_IDS = {
  Flamengo: 614,
  Palmeiras: 1023,
  Corinthians: 199,
  'São Paulo': 585,
  Santos: 221,
  Cruzeiro: 609,
  'Atlético-MG': 330,
  Fluminense: 2462,
  Botafogo: 537,
  Vasco: 978,
  Grêmio: 210,
  Internacional: 660,
  Bahia: 10010,
  Fortaleza: 10870,
  'Athletico-PR': 679,
  'Red Bull Bragantino': 8793,
  Vitória: 2125,
  Juventude: 1049,
  Criciúma: 7178,
  Cuiabá: 28022,
  Coritiba: 776,
  Sport: 8718,
  Goiás: 3197,
  Ceará: 2029,
  'América-MG': 2863,
  'Ponte Preta': 1134,
  Mirassol: 10295,
  Avaí: 2035,
  Chapecoense: 17776,
  Figueirense: 2034,

  // Internacionais
  Liverpool: 31,
  'SJK Seinäjoki': 23777,
  'Sint-Truiden': 472,
  'Hertha Berlim': 44,
  'Apollon Limassol': 429,
  'Eintracht Frankfurt': 24,
  Barcelona: 131,
  'Real Madrid': 418,
  Milan: 5,
  'Inter de Milão': 46,
  Chelsea: 631,
  Arsenal: 11,
  'Manchester United': 985,
  'Manchester City': 281,
  Juventus: 506,
  Porto: 720,
  Benfica: 294,
  Sporting: 336,
  PSG: 583,
  'Bayern de Munique': 27,
  'Borussia Dortmund': 16,
  'Shakhtar Donetsk': 660,
  Roma: 12,
  Napoli: 6195,
  Sevilla: 368,
  'Atlético de Madrid': 13,
  Betis: 150,
  Tottenham: 148,
  'Al-Hilal': 1114,
  'Al-Nassr': 18544,
  'Al-Ittihad': 8023,
  'Al-Ahli': 18545,
  'Al-Duhail': 23309,
  'Aston Villa': 405,
  Espanyol: 714,
  PSV: 383,
  Lyon: 1041,
  'Olympique de Marselha': 244,
  Zenit: 964,
  'Kawasaki Frontale': 3435,
  'Consadole Sapporo': 9842,
  'Tokyo Verdy': 3412,
  'Shanghai Port': 29969,
  'Defensor Sporting': 2493,
  Fiorentina: 430
};

function getLogo(club) {
  if (TM_CLUB_IDS[club]) {
    return `https://tmssl.akamaized.net/images/wappen/head/${TM_CLUB_IDS[club]}.png`;
  }
  const norm = club.toLowerCase().replace(/[^a-z0-9]/g, '');
  for (const [k, id] of Object.entries(TM_CLUB_IDS)) {
    const kNorm = k.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (kNorm === norm || norm.includes(kNorm) || kNorm.includes(norm)) {
      return `https://tmssl.akamaized.net/images/wappen/head/${id}.png`;
    }
  }
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(club.slice(0, 3).toUpperCase())}&background=062c1a&color=FFDF00&bold=true&format=svg`;
}

players.forEach(p => {
  if (p.careerHistory && Array.isArray(p.careerHistory)) {
    p.careerHistory.forEach(step => {
      step.logo = getLogo(step.club);
    });
  }
});

fs.writeFileSync(PLAYERS_FILE, JSON.stringify(players, null, 2), 'utf8');
console.log('Career logos updated across players.json!');
