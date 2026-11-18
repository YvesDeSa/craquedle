const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PLAYERS_FILE = path.resolve('src/data/players.json');
const players = JSON.parse(fs.readFileSync(PLAYERS_FILE, 'utf8'));

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function fetchPlayerPhotoWithBackoff(id, name) {
  const url = `https://www.transfermarkt.com.br/jogador/profil/spieler/${id}`;
  const cmd = `curl.exe -s -L -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36" -H "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" -H "Accept-Language: pt-BR,pt;q=0.9" "${url}"`;

  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const out = execSync(cmd, { timeout: 15000 }).toString('utf8');

      if (out.includes('403 Forbidden') || out.includes('Error from cloudfront') || out.length < 150) {
        console.log(`  ⏳ [CloudFront Rate Limit] Pausando 45s antes de reprocessar ${name} (tentativa ${attempt}/4)...`);
        execSync('powershell -Command "Start-Sleep -Seconds 45"');
        continue;
      }

      // 1. og:image
      const ogMatch = out.match(/<meta property="og:image" content="([^"]+)"/i);
      if (ogMatch && ogMatch[1]) {
        const raw = ogMatch[1];
        if (
          raw.includes('/portrait/') &&
          !raw.includes('default') &&
          !raw.includes('placeholder') &&
          !raw.includes('wappen')
        ) {
          return raw.replace('/portrait/big/', '/portrait/header/').replace('/portrait/medium/', '/portrait/header/');
        }
      }

      // 2. Fallback classe profile-image
      const headerImgMatch = out.match(/class="[^"]*profile-image[^"]*"[^>]+src="([^"]+)"/i) ||
                             out.match(/src="([^"]+)"[^>]+class="[^"]*profile-image[^"]*"/i);
      if (headerImgMatch && headerImgMatch[1]) {
        const raw = headerImgMatch[1];
        if (raw.includes('/portrait/') && !raw.includes('default') && !raw.includes('placeholder')) {
          return raw.replace('/portrait/big/', '/portrait/header/').replace('/portrait/medium/', '/portrait/header/');
        }
      }

      // 3. Fallback regex direta com o ID
      const idRegex = new RegExp(
        `https?:\\/\\/img\\.a\\.transfermarkt\\.technology\\/portrait\\/(?:header|medium|big)\\/${id}-[^\s"'<>]+`,
        'i'
      );
      const match = out.match(idRegex);
      if (match) {
        return match[0].replace('/portrait/big/', '/portrait/header/').replace('/portrait/medium/', '/portrait/header/');
      }

      // Página carregou perfeitamente (HTTP 200), mas o atleta não tem foto oficial cadastrada no TM
      return null;
    } catch (err) {
      console.warn(`  ⚠️ Tentativa ${attempt} falhou para ${name}: ${err.message}. Pausando 30s...`);
      execSync('powershell -Command "Start-Sleep -Seconds 30"');
    }
  }

  return null;
}

async function main() {
  const missingIndices = [];
  players.forEach((p, idx) => {
    if (!p.photo || p.photo.trim() === '') {
      missingIndices.push(idx);
    }
  });

  console.log(`===============================================`);
  console.log(`🚀 Iniciando busca contínua com auto-backoff para ${missingIndices.length} atletas...`);
  console.log(`===============================================\n`);

  let found = 0;
  let noPhoto = 0;

  for (let i = 0; i < missingIndices.length; i++) {
    const idx = missingIndices[i];
    const p = players[idx];

    const photoUrl = fetchPlayerPhotoWithBackoff(p.id, p.name);

    if (photoUrl) {
      p.photo = photoUrl;
      found++;
      console.log(`[${i + 1}/${missingIndices.length}] ✅ [${p.team}] ${p.name} -> ${photoUrl}`);
    } else {
      noPhoto++;
      console.log(`[${i + 1}/${missingIndices.length}] ⚪ [${p.team}] ${p.name} (Sem foto cadastrada no TM)`);
    }

    // Salva a cada 5 atletas para garantir persistência imediata
    if ((i + 1) % 5 === 0 || i + 1 === missingIndices.length) {
      fs.writeFileSync(PLAYERS_FILE, JSON.stringify(players, null, 2), 'utf8');
      console.log(`💾 Progresso salvo (${i + 1}/${missingIndices.length}) - Fotos integradas até agora: ${found}`);
    }

    // Intervalo de cortesia de 2.2s entre requisições
    await sleep(2200);
  }

  fs.writeFileSync(PLAYERS_FILE, JSON.stringify(players, null, 2), 'utf8');

  console.log('\n===============================================');
  console.log(`🎉 Processamento de todas as fotos concluído!`);
  console.log(`Fotos encontradas e atualizadas: ${found}`);
  console.log(`Atletas da base/novos sem foto no TM: ${noPhoto}`);
  console.log('===============================================\n');
}

main();
