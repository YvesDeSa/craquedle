const fs = require('fs');
const path = require('path');

const PLAYERS_FILE = path.resolve('src/data/players.json');
const players = JSON.parse(fs.readFileSync(PLAYERS_FILE, 'utf8'));

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchPlayerPhotoWithRetry(id, name, maxRetries = 3) {
  const url = `https://www.transfermarkt.com.br/spieler/profil/spieler/${id}`;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': UA,
          'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
        },
      });

      if (res.status === 403 || res.status === 429) {
        console.warn(`[RATE LIMIT ${res.status}] Aguardando 4s antes de tentar novamente para ${name}...`);
        await sleep(4000);
        continue;
      }

      if (!res.ok) {
        console.warn(`[HTTP ${res.status}] para ${name} (${id})`);
        return null;
      }

      const html = await res.text();

      // 1. Tag og:image
      const ogMatch = html.match(/<meta property="og:image" content="([^"]+)"/i);
      if (ogMatch && ogMatch[1]) {
        const ogUrl = ogMatch[1];
        if (
          ogUrl.includes('/portrait/') &&
          !ogUrl.includes('default') &&
          !ogUrl.includes('placeholder') &&
          !ogUrl.includes('wappen')
        ) {
          return ogUrl
            .replace('/portrait/big/', '/portrait/header/')
            .replace('/portrait/medium/', '/portrait/header/');
        }
      }

      // 2. Imagem de perfil do header do TM
      const headerImgMatch = html.match(/class="[^"]*profile-image[^"]*"[^>]+src="([^"]+)"/i) ||
                             html.match(/src="([^"]+)"[^>]+class="[^"]*profile-image[^"]*"/i);
      if (headerImgMatch && headerImgMatch[1]) {
        const hUrl = headerImgMatch[1];
        if (hUrl.includes('/portrait/') && !hUrl.includes('default') && !hUrl.includes('placeholder')) {
          return hUrl
            .replace('/portrait/big/', '/portrait/header/')
            .replace('/portrait/medium/', '/portrait/header/');
        }
      }

      // 3. Qualquer imagem portrait no CDN com o ID do atleta
      const idRegex = new RegExp(
        `https?:\\/\\/img\\.a\\.transfermarkt\\.technology\\/portrait\\/(?:header|medium|big)\\/${id}-[^\s"'<>]+`,
        'i'
      );
      const match = html.match(idRegex);
      if (match) {
        return match[0]
          .replace('/portrait/big/', '/portrait/header/')
          .replace('/portrait/medium/', '/portrait/header/');
      }

      return null;
    } catch (err) {
      console.error(`Tentativa ${attempt} falhou para ${name} (${id}):`, err.message);
      if (attempt < maxRetries) await sleep(2000);
    }
  }

  return null;
}

async function main() {
  console.log('🔍 Iniciando busca de fotos oficiais no Transfermarkt...');

  const missingIndices = [];
  players.forEach((p, idx) => {
    if (!p.photo || p.photo.trim() === '') {
      missingIndices.push(idx);
    }
  });

  console.log(`Total de jogadores cadastrados: ${players.length}`);
  console.log(`Jogadores sem foto: ${missingIndices.length}`);

  let found = 0;
  let missing = 0;
  const stillMissing = [];

  for (let i = 0; i < missingIndices.length; i++) {
    const idx = missingIndices[i];
    const p = players[idx];

    const photoUrl = await fetchPlayerPhotoWithRetry(p.id, p.name);

    if (photoUrl) {
      p.photo = photoUrl;
      found++;
      console.log(`[${i + 1}/${missingIndices.length}] ✅ ${p.name} (${p.team}) -> ${photoUrl}`);
    } else {
      missing++;
      stillMissing.push({ id: p.id, name: p.name, team: p.team });
      console.log(`[${i + 1}/${missingIndices.length}] ❌ ${p.name} (${p.team}) [Sem foto oficial no TM]`);
    }

    // Salva a cada 10 jogadores processados
    if ((i + 1) % 10 === 0 || i + 1 === missingIndices.length) {
      fs.writeFileSync(PLAYERS_FILE, JSON.stringify(players, null, 2), 'utf8');
      console.log(`💾 Progresso salvo (${i + 1}/${missingIndices.length})... Encontradas: ${found}`);
    }

    // Intervalo de segurança (500ms) para evitar bloqueio por CloudFront
    await sleep(500);
  }

  fs.writeFileSync(PLAYERS_FILE, JSON.stringify(players, null, 2), 'utf8');

  console.log('\n=======================================');
  console.log('Processamento de Fotos Finalizado!');
  console.log(`Total de fotos encontradas e atualizadas: ${found}`);
  console.log(`Atletas sem foto no TM: ${missing}`);
  console.log('=======================================\n');

  fs.writeFileSync(
    'scripts/players-still-missing-photos.json',
    JSON.stringify(stillMissing, null, 2),
    'utf8'
  );
}

main();
