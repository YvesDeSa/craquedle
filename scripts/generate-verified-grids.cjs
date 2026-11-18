const fs = require('fs');

const players = JSON.parse(fs.readFileSync('src/data/players.json', 'utf8'));

function getClubs(p) {
  const set = new Set();
  if (p.team) set.add(p.team);
  if (Array.isArray(p.careerTeams)) p.careerTeams.forEach(c => set.add(c));
  if (Array.isArray(p.careerHistory)) p.careerHistory.forEach(s => set.add(s.club));
  return Array.from(set);
}

const pairCount = new Map();
for (const p of players) {
  const clubs = getClubs(p);
  for (let i = 0; i < clubs.length; i++) {
    for (let j = 0; j < clubs.length; j++) {
      if (i === j) continue;
      const key = `${clubs[i]}|${clubs[j]}`;
      pairCount.set(key, (pairCount.get(key) || 0) + 1);
    }
  }
}

// Clubes populares para o Grid
const POPULAR_SERIE_A = [
  'Flamengo', 'Palmeiras', 'Corinthians', 'São Paulo', 'Santos',
  'Cruzeiro', 'Atlético-MG', 'Fluminense', 'Botafogo', 'Vasco',
  'Grêmio', 'Internacional', 'Bahia', 'Athletico-PR', 'Red Bull Bragantino'
];

const POPULAR_INTERNATIONAL = [
  'Barcelona', 'Real Madrid', 'Milan', 'Chelsea', 'PSG',
  'Porto', 'Benfica', 'Sporting', 'Arsenal', 'Liverpool',
  'Juventus', 'Inter de Milão', 'Atlético de Madrid', 'Roma'
];

function isGridValid(cols, rows) {
  for (const r of rows) {
    for (const c of cols) {
      if (r === c) return false;
      if (!pairCount.has(`${r}|${c}`)) return false;
    }
  }
  return true;
}

const verifiedGrids = [];
const allClubsPool = [...POPULAR_SERIE_A, ...POPULAR_INTERNATIONAL];

// Busca combinações válidas
for (let i = 0; i < POPULAR_SERIE_A.length; i++) {
  for (let j = i + 1; j < POPULAR_SERIE_A.length; j++) {
    for (let k = j + 1; k < POPULAR_SERIE_A.length; k++) {
      const cols = [POPULAR_SERIE_A[i], POPULAR_SERIE_A[j], POPULAR_SERIE_A[k]];

      // Tenta achar 3 rows (2 nacionais + 1 internacional, ou 1 nacional + 2 internacionais)
      const possibleRows = allClubsPool.filter(c => !cols.includes(c));
      
      for (let r1 = 0; r1 < possibleRows.length; r1++) {
        for (let r2 = r1 + 1; r2 < possibleRows.length; r2++) {
          for (let r3 = r2 + 1; r3 < possibleRows.length; r3++) {
            const rows = [possibleRows[r1], possibleRows[r2], possibleRows[r3]];
            if (isGridValid(cols, rows)) {
              verifiedGrids.push({ cols, rows });
              if (verifiedGrids.length >= 60) break;
            }
          }
          if (verifiedGrids.length >= 60) break;
        }
        if (verifiedGrids.length >= 60) break;
      }
      if (verifiedGrids.length >= 60) break;
    }
    if (verifiedGrids.length >= 60) break;
  }
  if (verifiedGrids.length >= 60) break;
}

console.log(`Found ${verifiedGrids.length} guaranteed solvable 3x3 grids!`);
console.log('Sample grid 1:', verifiedGrids[0]);
console.log('Sample grid 2:', verifiedGrids[1]);
console.log('Sample grid 3:', verifiedGrids[2]);
fs.writeFileSync('scripts/verified-grids.json', JSON.stringify(verifiedGrids, null, 2), 'utf8');
