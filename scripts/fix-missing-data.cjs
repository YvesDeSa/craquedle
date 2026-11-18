const fs = require('fs');
const path = require('path');

const PLAYERS_FILE = path.resolve('src/data/players.json');
const players = JSON.parse(fs.readFileSync(PLAYERS_FILE, 'utf8'));

// 1. Dicionário oficial de títulos dos principais campeões da Série A
const OFFICIAL_TROPHIES = {
  // Allan (385271) - Brasileirão 2021 (Atlético-MG), Copa do Brasil 2021 (Atlético-MG) e 2024 (Flamengo)
  385271: { brasileirao: true, copaDoBrasil: true, libertadores: false, sulamericana: false },
  // Allan (126422) - Botafogo - Libertadores 2024, Brasileirão 2024
  126422: { brasileirao: true, copaDoBrasil: false, libertadores: true, sulamericana: false },

  // Goleiros
  'weverton': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'cassio': { brasileirao: true, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'agustin rossi': { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'everson': { brasileirao: true, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'fabio': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'marcelo lomba': { brasileirao: true, copaDoBrasil: false, libertadores: false, sulamericana: false },
  'santos': { brasileirao: false, copaDoBrasil: true, libertadores: true, sulamericana: true },
  'hugo souza': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'matheus cunha': { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'joao paulo': { brasileirao: false, copaDoBrasil: false, libertadores: false, sulamericana: false },

  // Zagueiros / Laterais
  'gustavo gomez': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'marcos rocha': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'mayke': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'murilo': { brasileirao: true, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'joaquin piquerez': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'thiago silva': { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'fabricio bruno': { brasileirao: false, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'leo ortiz': { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'ayrton lucas': { brasileirao: false, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'alex sandro': { brasileirao: false, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'guilherme arana': { brasileirao: true, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'junior alonso': { brasileirao: true, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'samuel xavier': { brasileirao: false, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'fagner': { brasileirao: true, copaDoBrasil: false, libertadores: false, sulamericana: false },
  'reinaldo': { brasileirao: false, copaDoBrasil: false, libertadores: false, sulamericana: false },
  'alex telles': { brasileirao: true, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'bastos': { brasileirao: true, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'alexander barboza': { brasileirao: true, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'danilo': { brasileirao: false, copaDoBrasil: true, libertadores: true, sulamericana: false },

  // Meias
  'arrascaeta': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'gerson': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'nicolas de la cruz': { brasileirao: false, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'erick pulgar': { brasileirao: false, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'raphael veiga': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: true },
  'ze rafael': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'richard rios': { brasileirao: true, copaDoBrasil: false, libertadores: false, sulamericana: false },
  'everton ribeiro': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'paulo henrique ganso': { brasileirao: false, copaDoBrasil: true, libertadores: true, sulamericana: true },
  'jhon arias': { brasileirao: false, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'alan patrick': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'lucas moura': { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: true },
  'rodrigo nestor': { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'alisson': { brasileirao: true, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'otavio': { brasileirao: false, copaDoBrasil: false, libertadores: false, sulamericana: false },
  'zaracho': { brasileirao: true, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'marlon freitas': { brasileirao: true, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'gregore': { brasileirao: true, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'eduardo': { brasileirao: true, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'thiago almada': { brasileirao: true, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'tche tche': { brasileirao: true, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'philippe coutinho': { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: false },

  // Atacantes
  'pedro': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'bruno henrique': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'gabigol': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'dudu': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'rony': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: true },
  'flaco lopez': { brasileirao: true, copaDoBrasil: false, libertadores: false, sulamericana: false },
  'hulk': { brasileirao: true, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'paulinho': { brasileirao: false, copaDoBrasil: false, libertadores: false, sulamericana: false },
  'german cano': { brasileirao: false, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'jonathan calleri': { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'luciano': { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'neymar jr': { brasileirao: false, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'neymar': { brasileirao: false, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'yuri alberto': { brasileirao: false, copaDoBrasil: false, libertadores: false, sulamericana: false },
  'memphis depay': { brasileirao: false, copaDoBrasil: false, libertadores: false, sulamericana: false },
  'luiz henrique': { brasileirao: true, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'igor jesus': { brasileirao: true, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'junior santos': { brasileirao: true, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'yeferson soteldo': { brasileirao: false, copaDoBrasil: false, libertadores: false, sulamericana: false },
  'diego costa': { brasileirao: true, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'enner valencia': { brasileirao: false, copaDoBrasil: false, libertadores: false, sulamericana: false },
  'borre': { brasileirao: false, copaDoBrasil: false, libertadores: true, sulamericana: false }
};

const norm = (s) =>
  s
    ? s
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
    : '';

let titlesUpdated = 0;
players.forEach((p) => {
  // Atualiza títulos por ID ou por nome
  if (OFFICIAL_TROPHIES[p.id]) {
    p.trophies = { ...OFFICIAL_TROPHIES[p.id] };
    titlesUpdated++;
  } else {
    const key = norm(p.name);
    if (OFFICIAL_TROPHIES[key]) {
      p.trophies = { ...OFFICIAL_TROPHIES[key] };
      titlesUpdated++;
    }
  }
});

console.log(`Títulos calibrados com sucesso para ${titlesUpdated} atletas.`);

// 2. Busca e completa fotos reais do Transfermarkt para os jogadores sem foto
async function fillMissingPhotos() {
  const missing = players.filter((p) => !p.photo);
  console.log(`Buscando fotos no Transfermarkt para ${missing.length} atletas pendentes...`);

  let fetched = 0;
  for (let i = 0; i < missing.length; i++) {
    const p = missing[i];
    try {
      const url = `https://www.transfermarkt.com.br/spieler/profil/spieler/${p.id}`;
      const res = await fetch(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept-Language': 'pt-BR,pt;q=0.9',
        },
      });

      if (!res.ok) continue;

      const html = await res.text();
      // Procura foto no perfil do atleta:
      // Ex: https://img.a.transfermarkt.technology/portrait/big/191614-1765458332.png
      const match = html.match(
        /https:\/\/img\.a\.transfermarkt\.technology\/portrait\/(?:big|header|medium)\/[^"]+/
      );

      if (match && !match[0].includes('placeholder') && !match[0].includes('wappen')) {
        p.photo = match[0].replace(/&amp;/g, '&');
        fetched++;
        console.log(`[${i + 1}/${missing.length}] ✓ Foto encontrada para ${p.name} (${p.team}): ${p.photo}`);
      }
      
      // Delay gentil para não sobrecarregar
      await new Promise((r) => setTimeout(r, 120));
    } catch (err) {
      // Ignora e continua
    }
  }

  console.log(`Fotos atualizadas: ${fetched} novas fotos reais adicionadas.`);
  fs.writeFileSync(PLAYERS_FILE, JSON.stringify(players, null, 2), 'utf8');
  console.log('Arquivo players.json salvo com sucesso!');
}

fillMissingPhotos();
