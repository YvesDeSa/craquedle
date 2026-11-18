const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PLAYERS_FILE = path.resolve('src/data/players.json');
const players = JSON.parse(fs.readFileSync(PLAYERS_FILE, 'utf8'));

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  const missingIndices = [];
  players.forEach((p, idx) => {
    if (!p.photo || p.photo.trim() === '') {
      missingIndices.push(idx);
    }
  });

  console.log(`===============================================`);
  console.log(`🔍 Varredura Oficial de Fotos Transfermarkt`);
  console.log(`Total de jogadores na base: ${players.length}`);
  console.log(`Jogadores sem foto: ${missingIndices.length}`);
  console.log(`===============================================\n`);

  let found = 0;
  let noPhotoOnTM = 0;
  const noPhotoList = [];

  for (let i = 0; i < missingIndices.length; i++) {
    const idx = missingIndices[i];
    const p = players[idx];

    try {
      const url = `https://www.transfermarkt.com.br/jogador/profil/spieler/${p.id}`;
      const cmd = `curl.exe -s -L -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36" -H "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" -H "Accept-Language: pt-BR,pt;q=0.9" "${url}"`;
      const out = execSync(cmd, { timeout: 12000 }).toString('utf8');

      // 1. og:image
      const ogMatch = out.match(/<meta property="og:image" content="([^"]+)"/i);
      let photoUrl = null;

      if (ogMatch && ogMatch[1]) {
        const raw = ogMatch[1];
        if (
          raw.includes('/portrait/') &&
          !raw.includes('default') &&
          !raw.includes('placeholder') &&
          !raw.includes('wappen')
        ) {
          photoUrl = raw.replace('/portrait/big/', '/portrait/header/').replace('/portrait/medium/', '/portrait/header/');
        }
      }

      // 2. Fallback para imagem de perfil do header
      if (!photoUrl) {
        const headerImgMatch = out.match(/class="[^"]*profile-image[^"]*"[^>]+src="([^"]+)"/i) ||
                               out.match(/src="([^"]+)"[^>]+class="[^"]*profile-image[^"]*"/i);
        if (headerImgMatch && headerImgMatch[1]) {
          const raw = headerImgMatch[1];
          if (raw.includes('/portrait/') && !raw.includes('default') && !raw.includes('placeholder')) {
            photoUrl = raw.replace('/portrait/big/', '/portrait/header/').replace('/portrait/medium/', '/portrait/header/');
          }
        }
      }

      // 3. Fallback regex direta com o ID
      if (!photoUrl) {
        const idRegex = new RegExp(
          `https?:\\/\\/img\\.a\\.transfermarkt\\.technology\\/portrait\\/(?:header|medium|big)\\/${p.id}-[^\s"'<>]+`,
          'i'
        );
        const match = out.match(idRegex);
        if (match) {
          photoUrl = match[0].replace('/portrait/big/', '/portrait/header/').replace('/portrait/medium/', '/portrait/header/');
        }
      }

      if (photoUrl) {
        p.photo = photoUrl;
        found++;
        console.log(`[${i + 1}/${missingIndices.length}] ✅ [${p.team}] ${p.name} -> ${photoUrl}`);
      } else {
        noPhotoOnTM++;
        noPhotoList.push({ id: p.id, name: p.name, team: p.team });
        console.log(`[${i + 1}/${missingIndices.length}] ⚪ [${p.team}] ${p.name} (Sem foto cadastrada no TM)`);
      }
    } catch (err) {
      console.error(`[${i + 1}/${missingIndices.length}] ⚠️ Erro ao buscar ${p.name} (${p.id}):`, err.message);
    }

    // Salva a cada 10 jogadores e na última iteração
    if ((i + 1) % 10 === 0 || i + 1 === missingIndices.length) {
      fs.writeFileSync(PLAYERS_FILE, JSON.stringify(players, null, 2), 'utf8');
      console.log(`💾 Progresso salvo (${i + 1}/${missingIndices.length}) - Encontradas: ${found}`);
    }

    await sleep(350);
  }

  fs.writeFileSync(PLAYERS_FILE, JSON.stringify(players, null, 2), 'utf8');

  console.log('\n===============================================');
  console.log(`🎉 Varredura Concluída com Sucesso!`);
  console.log(`Fotos encontradas e integradas: ${found}`);
  console.log(`Atletas sem foto no Transfermarkt (base sub-20/novos): ${noPhotoOnTM}`);
  console.log(`===============================================\n`);

  fs.writeFileSync(
    'scripts/players-still-missing-photos.json',
    JSON.stringify(noPhotoList, null, 2),
    'utf8'
  );
}

main();
