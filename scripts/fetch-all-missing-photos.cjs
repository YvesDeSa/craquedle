const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const PLAYERS_FILE = path.resolve('src/data/players.json');
const players = JSON.parse(fs.readFileSync(PLAYERS_FILE, 'utf8'));

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

async function getPlayerPhotoFromTM(id, name) {
  const url = `https://www.transfermarkt.com.br/spieler/profil/spieler/${id}`;
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': UA,
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
      },
    });
    if (!res.ok) return null;
    const html = await res.text();
    const $ = cheerio.load(html);

    // 1. Procurar nas tags img de perfil do header
    const headerImgs = [
      $('div.data-header__profile-container img').attr('src'),
      $('div.data-header__profile-container img').attr('data-src'),
      $('div.modal-trigger img').attr('src'),
      $('div.modal-trigger img').attr('data-src'),
      $('.dataBild img').attr('src'),
      $('.dataBild img').attr('data-src'),
    ].filter(Boolean);

    for (const src of headerImgs) {
      if (
        src.includes('/portrait/') &&
        !src.includes('default') &&
        !src.includes('placeholder') &&
        !src.includes('wappen')
      ) {
        return src
          .replace('/portrait/medium/', '/portrait/header/')
          .replace('/portrait/big/', '/portrait/header/');
      }
    }

    // 2. Regex direta para imagem associada ao ID do atleta no CDN oficial
    const idRegex = new RegExp(
      `https?:\\/\\/img\\.a\\.transfermarkt\\.technology\\/portrait\\/(?:header|medium|big)\\/${id}-[^\s"'<>]+`,
      'i'
    );
    const match = html.match(idRegex);
    if (match) {
      return match[0]
        .replace('/portrait/medium/', '/portrait/header/')
        .replace('/portrait/big/', '/portrait/header/');
    }

    // 3. Qualquer portrait Akamai com o ID
    const akamaiRegex = new RegExp(
      `https?:\\/\\/tmssl\\.akamaized\\.net\\/images\\/portrait\\/(?:header|medium|big)\\/${id}-[^\s"'<>]+`,
      'i'
    );
    const akamaiMatch = html.match(akamaiRegex);
    if (akamaiMatch) {
      return akamaiMatch[0]
        .replace('/portrait/medium/', '/portrait/header/')
        .replace('/portrait/big/', '/portrait/header/');
    }

    return null;
  } catch (err) {
    console.error(`[ERRO] ${name} (${id}): ${err.message}`);
    return null;
  }
}

async function run() {
  const missingIndices = [];
  players.forEach((p, idx) => {
    if (!p.photo || p.photo.trim() === '') {
      missingIndices.push(idx);
    }
  });

  console.log(`Total de jogadores cadastrados: ${players.length}`);
  console.log(`Jogadores com foto ausente: ${missingIndices.length}`);

  let foundCount = 0;
  let notFoundCount = 0;
  const notFoundList = [];

  const CONCURRENCY = 4;
  for (let i = 0; i < missingIndices.length; i += CONCURRENCY) {
    const chunk = missingIndices.slice(i, i + CONCURRENCY);
    await Promise.all(
      chunk.map(async (idx) => {
        const p = players[idx];
        const photo = await getPlayerPhotoFromTM(p.id, p.name);
        if (photo) {
          p.photo = photo;
          foundCount++;
          console.log(`[SUCESSO] ${p.name} (${p.team}) -> ${photo}`);
        } else {
          notFoundCount++;
          notFoundList.push({ id: p.id, name: p.name, team: p.team });
          console.log(`[SEM FOTO TM] ${p.name} (${p.team})`);
        }
      })
    );

    // Salvar periodicamente para não perder progresso
    if ((i + CONCURRENCY) % 20 === 0 || i + CONCURRENCY >= missingIndices.length) {
      fs.writeFileSync(PLAYERS_FILE, JSON.stringify(players, null, 2), 'utf8');
      console.log(`💾 Progresso salvo (${i + chunk.length}/${missingIndices.length})...`);
    }

    // Pausa de cortesia para não sobrecarregar
    await new Promise((r) => setTimeout(r, 120));
  }

  fs.writeFileSync(PLAYERS_FILE, JSON.stringify(players, null, 2), 'utf8');
  console.log('\n=======================================');
  console.log(`Processamento concluído!`);
  console.log(`Fotos encontradas e atualizadas: ${foundCount}`);
  console.log(`Ainda sem foto oficial no TM: ${notFoundCount}`);
  console.log('=======================================\n');

  if (notFoundList.length > 0) {
    fs.writeFileSync(
      'scripts/players-still-missing-photos.json',
      JSON.stringify(notFoundList, null, 2),
      'utf8'
    );
    console.log(`Lista dos ainda sem foto salva em scripts/players-still-missing-photos.json`);
  }
}

run();
