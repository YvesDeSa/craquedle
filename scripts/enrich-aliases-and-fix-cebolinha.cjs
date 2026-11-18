const fs = require('fs');
const path = require('path');

const PLAYERS_FILE = path.resolve('src/data/players.json');
const players = JSON.parse(fs.readFileSync(PLAYERS_FILE, 'utf8'));

const ALIAS_MAP = {
  // Everton Cebolinha (Santos - ID: 321239)
  321239: {
    name: 'Everton Cebolinha',
    aliases: ['Everton', 'Cebolinha', 'Everton Sousa Soares'],
    trophies: { brasileirao: false, copaDoBrasil: true, libertadores: true, sulamericana: false }
  },
  // Gabigol (Santos - ID: 244275)
  244275: {
    name: 'Gabigol',
    aliases: ['Gabriel Barbosa', 'Gabriel', 'Gabi']
  },
  // Neymar Jr (Santos - ID: 68290)
  68290: {
    name: 'Neymar Jr',
    aliases: ['Neymar', 'Neymar da Silva Santos Júnior']
  },
  // Paulo Henrique Ganso (Fluminense - ID: 67920)
  67920: {
    name: 'Paulo Henrique Ganso',
    aliases: ['Ganso', 'PH Ganso']
  },
  // Arrascaeta (Flamengo - ID: 248410)
  248410: {
    name: 'Arrascaeta',
    aliases: ['Giorgian de Arrascaeta', 'De Arrascaeta']
  },
  // Gustavo Scarpa (Atlético-MG - ID: 330085)
  330085: {
    name: 'Gustavo Scarpa',
    aliases: ['Scarpa']
  },
  // Hulk (Fluminense - ID: 80562)
  80562: {
    name: 'Hulk',
    aliases: ['Givanildo', 'Givanildo Vieira de Souza']
  },
  // Rony (Santos - ID: 371009)
  371009: {
    name: 'Rony',
    aliases: ['Rony Rústico', 'Ronielson']
  },
  // Philippe Coutinho (Santos - ID: 80444)
  80444: {
    name: 'Philippe Coutinho',
    aliases: ['Coutinho', 'Phil Coutinho']
  },
  // Lucas Paquetá (Flamengo / Cruzeiro - ID: 341705)
  341705: {
    name: 'Lucas Paquetá',
    aliases: ['Paquetá']
  },
  // Lucas Moura (São Paulo - ID: 77100)
  77100: {
    name: 'Lucas Moura',
    aliases: ['Lucas']
  },
  // Pedro (Flamengo - ID: 432895)
  432895: {
    name: 'Pedro',
    aliases: ['Pedro Guilherme']
  },
  // Yuri Alberto (Corinthians - ID: 489893)
  489893: {
    name: 'Yuri Alberto',
    aliases: ['Yuri']
  },
  // Tchê Tchê (Vasco - ID: 364261)
  364261: {
    name: 'Tchê Tchê',
    aliases: ['Danilo das Neves']
  },
  // Dudu (Atlético-MG - ID: 114937)
  114937: {
    name: 'Dudu',
    aliases: ['Eduardo Pereira Rodrigues']
  },
  // Cássio (Cruzeiro - ID: 50144)
  50144: {
    name: 'Cássio',
    aliases: ['Cássio Ramos']
  },
  // Weverton (Grêmio - ID: 69400)
  69400: {
    name: 'Weverton',
    aliases: ['Weverton Pereira']
  }
};

let updated = 0;
players.forEach(p => {
  const custom = ALIAS_MAP[p.id];
  if (custom) {
    if (custom.name) p.name = custom.name;
    if (custom.aliases) p.aliases = custom.aliases;
    if (custom.trophies) p.trophies = custom.trophies;
    updated++;
  }
});

fs.writeFileSync(PLAYERS_FILE, JSON.stringify(players, null, 2), 'utf8');
console.log(`Updated ${updated} players with aliases.`);
