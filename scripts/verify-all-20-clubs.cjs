const { execSync } = require('child_process');
const fs = require('fs');

const players = JSON.parse(fs.readFileSync('src/data/players.json', 'utf8'));
const existingIds = new Set(players.map(p => p.id));
console.log('Existing players in database:', players.length);

const CLUBS = [
  { team: 'Flamengo', id: '614' },
  { team: 'Palmeiras', id: '1023' },
  { team: 'Cruzeiro', id: '609' },
  { team: 'Corinthians', id: '199' },
  { team: 'Vasco', id: '978' },
  { team: 'Botafogo', id: '537' },
  { team: 'Bahia', id: '10010' },
  { team: 'Fluminense', id: '2462' },
  { team: 'Santos', id: '221' },
  { team: 'Atlético-MG', id: '330' },
  { team: 'Athletico-PR', id: '679' },
  { team: 'São Paulo', id: '585' },
  { team: 'Internacional', id: '6600' },
  { team: 'Grêmio', id: '210' },
  { team: 'Red Bull Bragantino', id: '8793' },
  { team: 'Vitória', id: '2125' },
  { team: 'Coritiba', id: '776' },
  { team: 'Chapecoense', id: '486' },
  { team: 'Mirassol', id: '29124' },
  { team: 'Remo', id: '4223' }
];

function fetchJson(url) {
  try {
    const cmd = `curl.exe -s -H "Accept: application/json" -H "Accept-Language: pt-BR,pt;q=0.9" "${url}"`;
    const res = execSync(cmd, { timeout: 10000 }).toString('utf8');
    return JSON.parse(res);
  } catch (e) {
    return null;
  }
}

// Check how many players each club has in database
CLUBS.forEach(c => {
  const count = players.filter(p => p.team === c.team).length;
  console.log(`${c.team} (ID: ${c.id}): ${count} players in DB`);
});
