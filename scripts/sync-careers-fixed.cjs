const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const PLAYERS_FILE = path.resolve('src/data/players.json');
const players = JSON.parse(fs.readFileSync(PLAYERS_FILE, 'utf8'));

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
  'sport club corinthians paulista': 'Corinthians',
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
  'clube atlético mineiro': 'Atlético-MG',
  'ec cruzeiro': 'Cruzeiro',
  'cruzeiro esporte clube': 'Cruzeiro',
  'cruzeiro': 'Cruzeiro',
  'sc internacional': 'Internacional',
  'internacional': 'Internacional',
  'sport club internacional': 'Internacional',
  'grêmio fbpa': 'Grêmio',
  'grêmio foot-ball porto alegrense': 'Grêmio',
  'grêmio': 'Grêmio',
  'ec bahia': 'Bahia',
  'esporte clube bahia': 'Bahia',
  'bahia': 'Bahia',
  'fortaleza ec': 'Fortaleza',
  'fortaleza': 'Fortaleza',
  'athletico paranaense': 'Athletico-PR',
  'club athletico paranaense': 'Athletico-PR',
  'athletico-pr': 'Athletico-PR',
  'coritiba fbc': 'Coritiba',
  'coritiba': 'Coritiba',
  'red bull bragantino': 'RB Bragantino',
  'rb bragantino': 'RB Bragantino',
  'clube do remo': 'Remo',
  'remo': 'Remo',
  'mirassol fc': 'Mirassol',
  'mirassol': 'Mirassol',
  'juventude': 'Juventude',
  'ec vitória': 'Vitória',
  'vitória': 'Vitória',
  'criciúma ec': 'Criciúma',
  'criciúma': 'Criciúma',
  'atlético goianiense': 'Atlético-GO',
  'atlético-go': 'Atlético-GO',
  'cuiabá ec': 'Cuiabá',
  'cuiabá': 'Cuiabá',
  'psv eindhoven': 'PSV Eindhoven',
  'sparta rotterdam': 'Sparta Rotterdam',
  'fc barcelona': 'Barcelona',
  'barcelona': 'Barcelona',
  'real madrid': 'Real Madrid',
  'al-hilal': 'Al-Hilal',
  'al-hilal sfc': 'Al-Hilal'
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

function isFreeAgent(name) {
  if (!name) return true;
  return /sem clube|without club|unknown|desconhecido/i.test(name.trim());
}

function isYouthOrReserve(name) {
  if (!name) return false;
  const lower = name.toLowerCase();
  if (/juv|youth|jgd|junioren|nachwuchs|academy|base|sub-?[12]\d|\bu[12]\d\b|\bs[12]\d\b/i.test(lower)) return true;
  if (/\s+b\b|\s+ii\b/i.test(lower)) return true;
  return false;
}

const clubCache = new Map();

function getClubs(ids) {
  const missing = ids.filter(id => !clubCache.has(String(id)));
  if (missing.length > 0) {
    for (let i = 0; i < missing.length; i += 30) {
      const slice = missing.slice(i, i + 30);
      const query = slice.map(c => `ids[]=${c}`).join('&');
      const res = fetchJson(`https://tmapi.transfermarkt.technology/clubs?${query}`);
      (res?.data || []).forEach(c => clubCache.set(String(c.id), c));
    }
  }
}

function reconstructCareer(playerId) {
  const tData = fetchJson(`https://tmapi.transfermarkt.technology/transfer/history/player/${playerId}`)?.data;
  if (!tData) return null;

  getClubs(tData.clubIds || []);

  const transfers = [...(tData.history?.terminated || [])].reverse();
  const rawEvents = [];

  for (let j = 0; j < transfers.length; j++) {
    const tr = transfers[j];
    const src = clubCache.get(String(tr.transferSource?.clubId));
    const dst = clubCache.get(String(tr.transferDestination?.clubId));
    const isLoan = tr.typeDetails?.type === 'ACTIVE_LOAN_TRANSFER';
    const isReturn = tr.typeDetails?.type === 'RETURNED_FROM_PREVIOUS_LOAN';

    if (!dst) continue;

    const srcName = src?.name || '';
    const dstName = dst?.name || '';

    // Ignore if dst is free agent or unknown
    if (isFreeAgent(dstName)) continue;

    // Ignore if both are youth/reserve
    const srcIsYouth = isYouthOrReserve(srcName);
    const dstIsYouth = isYouthOrReserve(dstName);
    if (srcIsYouth && dstIsYouth) continue;

    // Ignore return from loan
    if (isReturn) continue;

    // If destination is youth/reserve, ignore
    if (dstIsYouth) continue;

    const seniorDst = normalizeName(dst.shortName || dst.name);
    let dstLogo = dst?.crestUrl || '';
    if (seniorDst === 'Barcelona' || seniorDst === 'FC Barcelona') {
      dstLogo = 'https://img.a.transfermarkt.technology/wappen/big/131.png';
    }

    // If this is the very first event and src was a senior club (not youth, not free agent), add src first!
    if (rawEvents.length === 0 && src && !srcIsYouth && !isFreeAgent(srcName)) {
      const seniorSrc = normalizeName(src.shortName || src.name);
      let srcLogo = src?.crestUrl || '';
      if (seniorSrc === 'Barcelona' || seniorSrc === 'FC Barcelona') {
        srcLogo = 'https://img.a.transfermarkt.technology/wappen/big/131.png';
      }
      rawEvents.push({
        club: seniorSrc,
        logo: srcLogo,
        type: 'def',
        isLoan: false
      });
    }

    if (isLoan) {
      rawEvents.push({
        club: seniorDst,
        logo: dstLogo,
        type: 'emp',
        isLoan: true
      });
    } else {
      rawEvents.push({
        club: seniorDst,
        logo: dstLogo,
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

  return dedup;
}

console.log(`Starting scan and update of ${players.length} players...`);
let updatedCount = 0;

for (let i = 0; i < players.length; i++) {
  const p = players[i];
  const newCareer = reconstructCareer(p.id);

  if (newCareer && newCareer.length > 0) {
    const oldClubs = (p.careerHistory || []).map(x => x.club).join(' -> ');
    const newClubs = newCareer.map(x => x.club).join(' -> ');

    if (oldClubs !== newClubs) {
      console.log(`[#${i + 1}] ${p.name}:`);
      console.log(`  OLD: ${oldClubs}`);
      console.log(`  NEW: ${newClubs}`);
      p.careerHistory = newCareer;
      p.careerTeams = newCareer.map(x => x.club);
      updatedCount++;
    }
  }

  if ((i + 1) % 50 === 0 || i === players.length - 1) {
    console.log(`Progress: ${i + 1}/${players.length} players (Updated so far: ${updatedCount})`);
    fs.writeFileSync(PLAYERS_FILE, JSON.stringify(players, null, 2), 'utf8');
  }
}

console.log(`\nDONE! Updated careers for ${updatedCount} players.`);
