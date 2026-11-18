const fs = require('fs');
const path = require('path');

const players = JSON.parse(fs.readFileSync('src/data/players.json', 'utf8'));

function getClubs(p) {
  const set = new Set();
  if (p.team) set.add(p.team);
  if (Array.isArray(p.careerTeams)) p.careerTeams.forEach(c => set.add(c));
  if (Array.isArray(p.careerHistory)) p.careerHistory.forEach(s => set.add(s.club));
  return Array.from(set);
}

const pairPlayers = new Map();
for (const p of players) {
  const clubs = getClubs(p);
  for (let i = 0; i < clubs.length; i++) {
    for (let j = 0; j < clubs.length; j++) {
      if (i === j) continue;
      const key = `${clubs[i]}|${clubs[j]}`;
      if (!pairPlayers.has(key)) pairPlayers.set(key, []);
      pairPlayers.get(key).push(p.name);
    }
  }
}

// Catálogo com curadoria de 30 grids 3x3 garantidos com pelo menos 1 atleta em cada interseção!
// Inclui combinações de Série A e gigantes internacionais (Barcelona, Real Madrid, Milan, PSG, Chelsea, Porto, etc.)
const curatedGrids = [
  // Grid 1
  {
    cols: ['Flamengo', 'Santos', 'Palmeiras'],
    rows: ['Corinthians', 'Cruzeiro', 'Barcelona']
  },
  // Grid 2
  {
    cols: ['Flamengo', 'Palmeiras', 'Atlético-MG'],
    rows: ['São Paulo', 'Corinthians', 'Cruzeiro']
  },
  // Grid 3
  {
    cols: ['Flamengo', 'Santos', 'Corinthians'],
    rows: ['Fluminense', 'Grêmio', 'Internacional']
  },
  // Grid 4
  {
    cols: ['Palmeiras', 'São Paulo', 'Cruzeiro'],
    rows: ['Flamengo', 'Santos', 'Grêmio']
  },
  // Grid 5
  {
    cols: ['Flamengo', 'Corinthians', 'Fluminense'],
    rows: ['Atlético-MG', 'Vasco', 'Botafogo']
  },
  // Grid 6
  {
    cols: ['Flamengo', 'Santos', 'Palmeiras'],
    rows: ['Corinthians', 'Cruzeiro', 'Real Madrid']
  },
  // Grid 7
  {
    cols: ['Corinthians', 'Flamengo', 'Palmeiras'],
    rows: ['Santos', 'Cruzeiro', 'Milan']
  },
  // Grid 8
  {
    cols: ['Palmeiras', 'Santos', 'Flamengo'],
    rows: ['Corinthians', 'Bahia', 'Cruzeiro']
  },
  // Grid 9
  {
    cols: ['Flamengo', 'São Paulo', 'Corinthians'],
    rows: ['Palmeiras', 'Santos', 'Fluminense']
  },
  // Grid 10
  {
    cols: ['Cruzeiro', 'Flamengo', 'Palmeiras'],
    rows: ['Corinthians', 'Santos', 'Atlético-MG']
  },
  // Grid 11
  {
    cols: ['Flamengo', 'Santos', 'Palmeiras'],
    rows: ['Corinthians', 'Fluminense', 'Barcelona']
  },
  // Grid 12
  {
    cols: ['Corinthians', 'Flamengo', 'Santos'],
    rows: ['Cruzeiro', 'Palmeiras', 'Vasco']
  },
  // Grid 13
  {
    cols: ['Flamengo', 'Palmeiras', 'Corinthians'],
    rows: ['Santos', 'São Paulo', 'Botafogo']
  },
  // Grid 14
  {
    cols: ['Flamengo', 'Santos', 'Cruzeiro'],
    rows: ['Corinthians', 'Palmeiras', 'Grêmio']
  },
  // Grid 15
  {
    cols: ['Palmeiras', 'Flamengo', 'Corinthians'],
    rows: ['Santos', 'Cruzeiro', 'Porto']
  },
  // Grid 16
  {
    cols: ['Flamengo', 'Palmeiras', 'São Paulo'],
    rows: ['Santos', 'Corinthians', 'Fluminense']
  },
  // Grid 17
  {
    cols: ['Flamengo', 'Santos', 'Palmeiras'],
    rows: ['Corinthians', 'Cruzeiro', 'PSG']
  },
  // Grid 18
  {
    cols: ['Corinthians', 'Palmeiras', 'Flamengo'],
    rows: ['Santos', 'Cruzeiro', 'Internacional']
  },
  // Grid 19
  {
    cols: ['Flamengo', 'Santos', 'Palmeiras'],
    rows: ['São Paulo', 'Corinthians', 'River Plate']
  },
  // Grid 20
  {
    cols: ['Flamengo', 'Corinthians', 'Palmeiras'],
    rows: ['Santos', 'Fluminense', 'Atlético-MG']
  },
  // Grid 21
  {
    cols: ['Cruzeiro', 'Santos', 'Flamengo'],
    rows: ['Palmeiras', 'Corinthians', 'Barcelona']
  },
  // Grid 22
  {
    cols: ['Flamengo', 'Palmeiras', 'Santos'],
    rows: ['Corinthians', 'Cruzeiro', 'Chelsea']
  },
  // Grid 23
  {
    cols: ['São Paulo', 'Flamengo', 'Palmeiras'],
    rows: ['Corinthians', 'Santos', 'Cruzeiro']
  },
  // Grid 24
  {
    cols: ['Flamengo', 'Santos', 'Corinthians'],
    rows: ['Palmeiras', 'Cruzeiro', 'Juventus']
  },
  // Grid 25
  {
    cols: ['Palmeiras', 'Flamengo', 'Santos'],
    rows: ['Corinthians', 'Cruzeiro', 'Benfica']
  },
  // Grid 26
  {
    cols: ['Flamengo', 'Corinthians', 'Santos'],
    rows: ['Palmeiras', 'Cruzeiro', 'Sporting']
  },
  // Grid 27
  {
    cols: ['Santos', 'Palmeiras', 'Flamengo'],
    rows: ['Corinthians', 'Cruzeiro', 'Liverpool']
  },
  // Grid 28
  {
    cols: ['Flamengo', 'Palmeiras', 'Corinthians'],
    rows: ['Santos', 'Cruzeiro', 'Manchester City']
  },
  // Grid 29
  {
    cols: ['Flamengo', 'Santos', 'Palmeiras'],
    rows: ['Corinthians', 'Cruzeiro', 'Inter de Milão']
  },
  // Grid 30
  {
    cols: ['Corinthians', 'Flamengo', 'Palmeiras'],
    rows: ['Santos', 'Cruzeiro', 'Atlético de Madrid']
  }
];

// Valida cada grid
const validatedGrids = [];
for (let g = 0; g < curatedGrids.length; g++) {
  const grid = curatedGrids[g];
  let allCellsValid = true;
  for (const r of grid.rows) {
    for (const c of grid.cols) {
      const key = `${r}|${c}`;
      const count = (pairPlayers.get(key) || []).length;
      if (count === 0) {
        console.log(`Grid ${g + 1} INVALID on ${r} x ${c}`);
        allCellsValid = false;
      }
    }
  }
  if (allCellsValid) {
    validatedGrids.push(grid);
  }
}

console.log(`Validated ${validatedGrids.length} of ${curatedGrids.length} grids!`);
fs.writeFileSync('src/data/dailyGrids.json', JSON.stringify(validatedGrids, null, 2), 'utf8');
