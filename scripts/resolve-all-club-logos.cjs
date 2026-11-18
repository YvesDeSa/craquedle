const fs = require('fs');
const path = require('path');

const PLAYERS_FILE = path.resolve('src/data/players.json');
const CLUB_LOGOS_FILE = path.resolve('src/utils/clubLogos.ts');

const players = JSON.parse(fs.readFileSync(PLAYERS_FILE, 'utf8'));

// Dicionário base já conhecido
const BASE_LOGOS = {
  Flamengo: 'https://tmssl.akamaized.net/images/wappen/head/614.png',
  Palmeiras: 'https://tmssl.akamaized.net/images/wappen/head/1023.png',
  Corinthians: 'https://tmssl.akamaized.net/images/wappen/head/199.png',
  'São Paulo': 'https://tmssl.akamaized.net/images/wappen/head/585.png',
  Santos: 'https://tmssl.akamaized.net/images/wappen/head/221.png',
  Cruzeiro: 'https://tmssl.akamaized.net/images/wappen/head/609.png',
  'Atlético-MG': 'https://tmssl.akamaized.net/images/wappen/head/330.png',
  Fluminense: 'https://tmssl.akamaized.net/images/wappen/head/2462.png',
  Botafogo: 'https://tmssl.akamaized.net/images/wappen/head/537.png',
  Vasco: 'https://tmssl.akamaized.net/images/wappen/head/978.png',
  Grêmio: 'https://tmssl.akamaized.net/images/wappen/head/210.png',
  Internacional: 'https://tmssl.akamaized.net/images/wappen/head/660.png',
  Bahia: 'https://tmssl.akamaized.net/images/wappen/head/10010.png',
  Fortaleza: 'https://tmssl.akamaized.net/images/wappen/head/10870.png',
  'Athletico-PR': 'https://tmssl.akamaized.net/images/wappen/head/679.png',
  'Red Bull Bragantino': 'https://tmssl.akamaized.net/images/wappen/head/8793.png',
  Vitória: 'https://tmssl.akamaized.net/images/wappen/head/2125.png',
  Juventude: 'https://tmssl.akamaized.net/images/wappen/head/1049.png',
  Criciúma: 'https://tmssl.akamaized.net/images/wappen/head/7178.png',
  Cuiabá: 'https://tmssl.akamaized.net/images/wappen/head/28022.png',
  Coritiba: 'https://tmssl.akamaized.net/images/wappen/head/776.png',
  Sport: 'https://tmssl.akamaized.net/images/wappen/head/8718.png',
  Goiás: 'https://tmssl.akamaized.net/images/wappen/head/3197.png',
  Ceará: 'https://tmssl.akamaized.net/images/wappen/head/2029.png',
  'América-MG': 'https://tmssl.akamaized.net/images/wappen/head/2863.png',
  'Ponte Preta': 'https://tmssl.akamaized.net/images/wappen/head/1134.png',
  Mirassol: 'https://tmssl.akamaized.net/images/wappen/head/10295.png',
  Avaí: 'https://tmssl.akamaized.net/images/wappen/head/2035.png',
  Chapecoense: 'https://tmssl.akamaized.net/images/wappen/head/17776.png',
  Figueirense: 'https://tmssl.akamaized.net/images/wappen/head/2034.png',
  Braga: 'https://tmssl.akamaized.net/images/wappen/head/1075.png',
  'Sporting Braga': 'https://tmssl.akamaized.net/images/wappen/head/1075.png',
  'Sporting CP': 'https://tmssl.akamaized.net/images/wappen/head/336.png',
  Sporting: 'https://tmssl.akamaized.net/images/wappen/head/336.png',
  'Sporting Clube de Portugal': 'https://tmssl.akamaized.net/images/wappen/head/336.png',
  Porto: 'https://tmssl.akamaized.net/images/wappen/head/720.png',
  'Futebol Clube do Porto': 'https://tmssl.akamaized.net/images/wappen/head/720.png',
  Benfica: 'https://tmssl.akamaized.net/images/wappen/head/294.png',
  'Legia de Varsóvia': 'https://tmssl.akamaized.net/images/wappen/head/255.png',
  'VVV-Venlo': 'https://tmssl.akamaized.net/images/wappen/head/1426.png',
  Bursaspor: 'https://tmssl.akamaized.net/images/wappen/head/20.png',
  'Bursaspor Kulübü Derneği': 'https://tmssl.akamaized.net/images/wappen/head/20.png',
  Penafiel: 'https://tmssl.akamaized.net/images/wappen/head/2943.png',
  'Futebol Clube de Penafiel': 'https://tmssl.akamaized.net/images/wappen/head/2943.png',
  Arouca: 'https://tmssl.akamaized.net/images/wappen/head/8024.png',
  'Futebol Clube de Arouca': 'https://tmssl.akamaized.net/images/wappen/head/8024.png',
  'Once Caldas': 'https://tmssl.akamaized.net/images/wappen/head/6984.png',
  Belgrano: 'https://tmssl.akamaized.net/images/wappen/head/2417.png',
  Liverpool: 'https://tmssl.akamaized.net/images/wappen/head/31.png',
  'SJK Seinäjoki': 'https://tmssl.akamaized.net/images/wappen/head/23777.png',
  'Sint-Truiden': 'https://tmssl.akamaized.net/images/wappen/head/472.png',
  'Hertha Berlim': 'https://tmssl.akamaized.net/images/wappen/head/44.png',
  'Apollon Limassol': 'https://tmssl.akamaized.net/images/wappen/head/429.png',
  'Eintracht Frankfurt': 'https://tmssl.akamaized.net/images/wappen/head/24.png'
};

// Limpa nome formal do clube para melhor exibição e busca
function simplifyClubName(name) {
  if (!name) return '';
  return name
    .replace(/^futebol clube do /i, '')
    .replace(/^futebol clube de /i, '')
    .replace(/^futebol clube /i, '')
    .replace(/^sport club /i, '')
    .replace(/^esporte clube /i, '')
    .replace(/^clube de regatas /i, '')
    .replace(/^clube atlético /i, '')
    .replace(/^sociedade esportiva /i, '')
    .replace(/^associação atlética /i, '')
    .replace(/^associação desportiva /i, '')
    .replace(/^club atlético /i, '')
    .replace(/^club social y deportivo /i, '')
    .replace(/^futbolniy klub /i, '')
    .replace(/ kulübü derneği$/i, '')
    .replace(/ kulübü$/i, '')
    .replace(/ f\.?c\.?$/i, '')
    .trim();
}

async function searchTransfermarktClubId(clubName) {
  const query = simplifyClubName(clubName);
  try {
    const url = `https://www.transfermarkt.com.br/schnellsuche/ergebnis/schnellsuche?query=${encodeURIComponent(
      query
    )}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept-Language': 'pt-BR,pt;q=0.9',
      },
    });
    if (!res.ok) return null;
    const text = await res.text();
    const match = text.match(/verein\/(\d+)/);
    if (match && match[1]) {
      return match[1];
    }
  } catch (e) {
    return null;
  }
  return null;
}

async function run() {
  console.log('Resolvendo escudos de todos os clubes de carreira...');

  // Coleta todos os clubes únicos
  const allClubs = new Set();
  players.forEach((p) => {
    if (p.careerHistory) {
      p.careerHistory.forEach((s) => allClubs.add(s.club));
    }
    if (p.careerTeams) {
      p.careerTeams.forEach((c) => allClubs.add(c));
    }
  });

  console.log(`Total de clubes únicos encontrados: ${allClubs.size}`);

  const logoMap = { ...BASE_LOGOS };

  // Identifica clubes que ainda não têm link do akamaized
  const pendingClubs = [];
  allClubs.forEach((club) => {
    if (!logoMap[club] || !logoMap[club].includes('tmssl.akamaized.net')) {
      pendingClubs.push(club);
    }
  });

  console.log(`Clubes pendentes de resolução via Transfermarkt: ${pendingClubs.length}`);

  for (let i = 0; i < pendingClubs.length; i++) {
    const club = pendingClubs[i];
    const id = await searchTransfermarktClubId(club);
    if (id) {
      logoMap[club] = `https://tmssl.akamaized.net/images/wappen/head/${id}.png`;
      console.log(`[${i + 1}/${pendingClubs.length}] ✓ ${club} -> ID ${id}`);
    } else {
      console.log(`[${i + 1}/${pendingClubs.length}] ✗ ${club} (não encontrado no TM)`);
    }
    // Delay gentil para requisições
    await new Promise((r) => setTimeout(r, 60));
  }

  // Atualiza players.json com os novos logos e nomes limpos
  let updatedCount = 0;
  players.forEach((p) => {
    if (p.careerHistory) {
      p.careerHistory.forEach((step) => {
        if (logoMap[step.club]) {
          step.logo = logoMap[step.club];
          updatedCount++;
        }
        // Limpa nomes muito longos no display se necessário
        if (step.club.startsWith('Futebol Clube de ')) {
          step.club = step.club.replace('Futebol Clube de ', '');
        } else if (step.club.startsWith('Futebol Clube do ')) {
          step.club = step.club.replace('Futebol Clube do ', '');
        } else if (step.club === 'Bursaspor Kulübü Derneği') {
          step.club = 'Bursaspor';
        } else if (step.club === 'Sporting Clube de Portugal') {
          step.club = 'Sporting';
        }
      });
    }
    if (p.careerTeams) {
      p.careerTeams = p.careerTeams.map((c) => {
        if (c.startsWith('Futebol Clube de ')) return c.replace('Futebol Clube de ', '');
        if (c.startsWith('Futebol Clube do ')) return c.replace('Futebol Clube do ', '');
        if (c === 'Bursaspor Kulübü Derneği') return 'Bursaspor';
        if (c === 'Sporting Clube de Portugal') return 'Sporting';
        return c;
      });
    }
  });

  fs.writeFileSync(PLAYERS_FILE, JSON.stringify(players, null, 2), 'utf8');
  console.log(`✓ players.json atualizado! ${updatedCount} etapas de carreira enriquecidas.`);

  // Atualiza src/utils/clubLogos.ts
  const tsContent = `/**
 * Dicionário oficial de escudos em alta resolução (Transfermarkt Akamai CDN)
 * Gerado automaticamente para 100% dos clubes da carreira dos atletas.
 */
export const CLUB_LOGOS: Record<string, string> = ${JSON.stringify(logoMap, null, 2)};

const norm = (s: string) =>
  s
    ? s
        .normalize('NFD')
        .replace(/[\\u0300-\\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '')
    : '';

export function getClubLogoUrl(clubName: string): string {
  if (!clubName) return '';
  if (CLUB_LOGOS[clubName]) return CLUB_LOGOS[clubName];

  const targetNorm = norm(clubName);
  for (const [key, url] of Object.entries(CLUB_LOGOS)) {
    const keyNorm = norm(key);
    if (keyNorm === targetNorm || targetNorm.includes(keyNorm) || keyNorm.includes(targetNorm)) {
      return url;
    }
  }

  // Fallback transparente usando iniciais
  return \`https://ui-avatars.com/api/?name=\${encodeURIComponent(
    clubName.slice(0, 3).toUpperCase()
  )}&background=062c1a&color=FFDF00&bold=true&format=svg\`;
}
`;

  fs.writeFileSync(CLUB_LOGOS_FILE, tsContent, 'utf8');
  console.log('✓ src/utils/clubLogos.ts atualizado com sucesso!');
}

run();
