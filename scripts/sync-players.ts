/**
 * CRAQUEDLE (Série A 2026) - Sincronização Oficial Exclusiva via Transfermarkt.
 *
 *  1. Fonte Primária Exclusiva: Transfermarkt (elencos ativos dos 20 clubes da Série A 2026).
 *  2. Fotos Oficiais: retratos em alta resolução com padrão de cabeça/ombros do Transfermarkt.
 *     Se faltar portrait oficial (ex: badge/wappen genérico), usa string vazia para exibir
 *     o avatar estilizado de iniciais retro arcade.
 *  3. Dados Extraídos por Atleta:
 *     - Nome oficial e apelido consagrado (com Overrides de craques)
 *     - Idade e data de nascimento exata
 *     - Altura (ex: "1.85 m")
 *     - Pé dominante ('Destro' | 'Canhoto' | 'Ambidestro')
 *     - Posição ('Goleiro' | 'Defensor' | 'Meia' | 'Atacante')
 *     - Nacionalidade (PT-BR)
 *     - Histórico de carreira real (clubes profissionais anteriores limpos)
 *     - Títulos oficiais (4 principais: Brasileirão, Copa do Brasil, Libertadores, Sul-Americana)
 *
 * Uso: npm run sync
 */
import fs from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';
import type { Position, DominantFoot, PlayerTrophies } from '../src/types/player';

const OUTPUT = path.resolve('src/data/players.json');
const TROPHIES_SEED = path.resolve('scripts/trophies-seed.json');

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

interface ClubMeta {
  team: string;
  tmId: string;
  slug: string;
  logo: string;
}

const CLUBS: ClubMeta[] = [
  {
    team: 'Flamengo',
    tmId: '614',
    slug: 'flamengo-rio-de-janeiro',
    logo: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/96/Clube_de_Regatas_do_Flamengo_logo.svg/250px-Clube_de_Regatas_do_Flamengo_logo.svg.png',
  },
  {
    team: 'Palmeiras',
    tmId: '1023',
    slug: 'se-palmeiras-sao-paulo',
    logo: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/68/Sociedade_Esportiva_Palmeiras_logo_%281_red_star%29.svg/250px-Sociedade_Esportiva_Palmeiras_logo_%281_red_star%29.svg.png',
  },
  {
    team: 'Cruzeiro',
    tmId: '609',
    slug: 'ec-cruzeiro-belo-horizonte',
    logo: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/90/Cruzeiro_Esporte_Clube_%28logo%29.svg/250px-Cruzeiro_Esporte_Clube_%28logo%29.svg.png',
  },
  {
    team: 'Corinthians',
    tmId: '199',
    slug: 'corinthians-sao-paulo',
    logo: 'https://thumb.wikimedia.org/wikipedia/pt/thumb/b/b4/Corinthians_simbolo.png/250px-Corinthians_simbolo.png',
  },
  {
    team: 'Vasco',
    tmId: '978',
    slug: 'vasco-da-gama-rio-de-janeiro',
    logo: 'https://thumb.wikimedia.org/wikipedia/pt/thumb/8/8b/EscudoDoVascoDaGama.svg/250px-EscudoDoVascoDaGama.svg.png',
  },
  {
    team: 'Botafogo',
    tmId: '537',
    slug: 'botafogo-rio-de-janeiro',
    logo: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/52/Botafogo_de_Futebol_e_Regatas_logo.svg/250px-Botafogo_de_Futebol_e_Regatas_logo.svg.png',
  },
  {
    team: 'Bahia',
    tmId: '10010',
    slug: 'esporte-clube-bahia',
    logo: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2c/Esporte_Clube_Bahia_logo.svg/250px-Esporte_Clube_Bahia_logo.svg.png',
  },
  {
    team: 'Fluminense',
    tmId: '2462',
    slug: 'fluminense-rio-de-janeiro',
    logo: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/12/Fluminense_Football_Club.svg/250px-Fluminense_Football_Club.svg.png',
  },
  {
    team: 'Santos',
    tmId: '221',
    slug: 'fc-santos',
    logo: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0e/Santos_Futebol_Clube_logo_%28with_stars_and_crown%29.png/250px-Santos_Futebol_Clube_logo_%28with_stars_and_crown%29.png',
  },
  {
    team: 'Atlético-MG',
    tmId: '330',
    slug: 'clube-atletico-mineiro',
    logo: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/27/Clube_Atl%C3%A9tico_Mineiro_logo.svg/250px-Clube_Atl%C3%A9tico_Mineiro_logo.svg.png',
  },
  {
    team: 'Athletico-PR',
    tmId: '679',
    slug: 'club-athletico-paranaense',
    logo: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/43/Athletico_Paranaense_%28Logo_2019%29.svg/250px-Athletico_Paranaense_%28Logo_2019%29.svg.png',
  },
  {
    team: 'Red Bull Bragantino',
    tmId: '8793',
    slug: 'red-bull-bragantino',
    logo: 'https://thumb.wikimedia.org/wikipedia/pt/thumb/9/9e/RedBullBragantino.png/250px-RedBullBragantino.png',
  },
  {
    team: 'São Paulo',
    tmId: '585',
    slug: 'fc-sao-paulo',
    logo: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f4/S%C3%A3o_Paulo_Futebol_Clube_logo_%282022%29.svg/250px-S%C3%A3o_Paulo_Futebol_Clube_logo_%282022%29.svg.png',
  },
  {
    team: 'Grêmio',
    tmId: '210',
    slug: 'gremio-porto-alegre',
    logo: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/08/Gremio_logo.svg/250px-Gremio_logo.svg.png',
  },
  {
    team: 'Internacional',
    tmId: '6600',
    slug: 'sc-internacional-porto-alegre',
    logo: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c5/Sport_Club_Internacional_logo.svg/250px-Sport_Club_Internacional_logo.svg.png',
  },
  {
    team: 'Vitória',
    tmId: '2125',
    slug: 'esporte-clube-vitoria',
    logo: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/15/Esporte_Clube_Vit%C3%B3ria_%282024%29.svg/250px-Esporte_Clube_Vit%C3%B3ria_%282024%29.svg.png',
  },
  {
    team: 'Coritiba',
    tmId: '776',
    slug: 'coritiba-fc',
    logo: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bd/Coritiba_Foot_Ball_Club_logo.svg/250px-Coritiba_Foot_Ball_Club_logo.svg.png',
  },
  {
    team: 'Mirassol',
    tmId: '3876',
    slug: 'mirassol-futebol-clube-sp-',
    logo: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fd/Mirassol_Futebol_Clube_logo_%283_stars%29.png/250px-Mirassol_Futebol_Clube_logo_%283_stars%29.png',
  },
  {
    team: 'Remo',
    tmId: '10997',
    slug: 'clube-do-remo-pa-',
    logo: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/70/Clube_do_Remo.svg/250px-Clube_do_Remo.svg.png',
  },
  {
    team: 'Chapecoense',
    tmId: '17776',
    slug: 'chapecoense',
    logo: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4e/Logo_Associa%C3%A7%C3%A3o_Chapecoense_de_Futebol.svg/250px-Logo_Associa%C3%A7%C3%A3o_Chapecoense_de_Futebol.svg.png',
  },
];

const OVERRIDES: Record<
  string,
  {
    name: string;
    photo?: string;
    position?: Position;
    trophies?: PlayerTrophies;
  }
> = {
  'gabriel barbosa': {
    name: 'Gabigol',
    photo: 'https://img.a.transfermarkt.technology/portrait/header/244275-1779755625.jpg?lm=4711',
    position: 'Atacante',
    trophies: { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  },
  gabigol: {
    name: 'Gabigol',
    photo: 'https://img.a.transfermarkt.technology/portrait/header/244275-1779755625.jpg?lm=4711',
    position: 'Atacante',
    trophies: { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  },
  arrascaeta: {
    name: 'Arrascaeta',
    photo: 'https://img.a.transfermarkt.technology/portrait/header/248410-1668501457.jpg?lm=4711',
    position: 'Meia',
    trophies: { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  },
  'giorgian de arrascaeta': {
    name: 'Arrascaeta',
    photo: 'https://img.a.transfermarkt.technology/portrait/header/248410-1668501457.jpg?lm=4711',
    position: 'Meia',
    trophies: { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  },
  pedro: {
    name: 'Pedro',
    photo: 'https://img.a.transfermarkt.technology/portrait/header/432895-1668696996.jpg?lm=4711',
    position: 'Atacante',
    trophies: { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  },
  hulk: {
    name: 'Hulk',
    photo: 'https://img.a.transfermarkt.technology/portrait/header/80562-1563436073.jpg?lm=4711',
    position: 'Atacante',
    trophies: { brasileirao: true, copaDoBrasil: true, libertadores: false, sulamericana: false },
  },
  neymar: {
    name: 'Neymar Jr',
    photo: 'https://img.a.transfermarkt.technology/portrait/header/68290-1692601435.jpg?lm=4711',
    position: 'Atacante',
    trophies: { brasileirao: false, copaDoBrasil: true, libertadores: true, sulamericana: false },
  },
  'neymar jr': {
    name: 'Neymar Jr',
    photo: 'https://img.a.transfermarkt.technology/portrait/header/68290-1692601435.jpg?lm=4711',
    position: 'Atacante',
    trophies: { brasileirao: false, copaDoBrasil: true, libertadores: true, sulamericana: false },
  },
  'memphis depay': {
    name: 'Memphis Depay',
    position: 'Atacante',
  },
  'philippe coutinho': {
    name: 'Philippe Coutinho',
    position: 'Meia',
    trophies: { brasileirao: false, copaDoBrasil: false, libertadores: false, sulamericana: false },
  },
  'german cano': {
    name: 'Germán Cano',
    position: 'Atacante',
    trophies: { brasileirao: false, copaDoBrasil: true, libertadores: true, sulamericana: false },
  },
  'yuri alberto': {
    name: 'Yuri Alberto',
    position: 'Atacante',
  },
  gerson: {
    name: 'Gerson',
    position: 'Meia',
    trophies: { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  },
  'thiago silva': {
    name: 'Thiago Silva',
    position: 'Defensor',
    trophies: { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: false },
  },
  'lucas moura': {
    name: 'Lucas Moura',
    position: 'Atacante',
    trophies: { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: true },
  },
  'jonathan calleri': {
    name: 'Jonathan Calleri',
    position: 'Atacante',
    trophies: { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: false },
  },
  calleri: {
    name: 'Jonathan Calleri',
    position: 'Atacante',
    trophies: { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: false },
  },
  'raphael veiga': {
    name: 'Raphael Veiga',
    position: 'Meia',
    trophies: { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: true },
  },
  weverton: {
    name: 'Weverton',
    position: 'Goleiro',
    trophies: { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  },
  'gustavo gomez': {
    name: 'Gustavo Gómez',
    position: 'Defensor',
    trophies: { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  },
  ganso: {
    name: 'Paulo Henrique Ganso',
    position: 'Meia',
    trophies: { brasileirao: false, copaDoBrasil: true, libertadores: true, sulamericana: true },
  },
  'everton ribeiro': {
    name: 'Everton Ribeiro',
    position: 'Meia',
    trophies: { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  },
  'matheus pereira': {
    name: 'Matheus Pereira',
    position: 'Meia',
  },
  cassio: {
    name: 'Cássio',
    position: 'Goleiro',
    trophies: { brasileirao: true, copaDoBrasil: false, libertadores: true, sulamericana: false },
  },
  vegetti: {
    name: 'Pablo Vegetti',
    position: 'Atacante',
  },
  'pablo vegetti': {
    name: 'Pablo Vegetti',
    position: 'Atacante',
  },
  'alan patrick': {
    name: 'Alan Patrick',
    position: 'Meia',
    trophies: { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  },
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const norm = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

function mapPosition(raw: string): Position {
  const p = norm(raw);
  if (/goleiro|guarda redes|torwart/.test(p)) return 'Goleiro';
  if (/zagueiro|lateral|defesa|defensor|abwehr|defender|back/.test(p)) return 'Defensor';
  if (/volante|meio campo|meia|mittelfeld|midfield/.test(p)) return 'Meia';
  if (/ponta|extremo|centroavante|atacante|avancado|sturm|forward|striker/.test(p))
    return 'Atacante';
  return 'Meia';
}

function mapFoot(raw: string): DominantFoot {
  const f = norm(raw);
  if (/esquerdo|canhoto|left/.test(f)) return 'Canhoto';
  if (/ambidestro|beidfuessig|both/.test(f)) return 'Ambidestro';
  return 'Destro';
}

function formatHeight(raw: string): string {
  if (!raw) return '1.80 m';
  const clean = raw.replace(',', '.').replace(/[^\d.]/g, '');
  const num = parseFloat(clean);
  if (isNaN(num) || num <= 0) return '1.80 m';
  if (num > 3) return `${(num / 100).toFixed(2)} m`;
  return `${num.toFixed(2)} m`;
}

function cleanClubName(c: string): string {
  if (!c) return '';
  return c
    .replace(/:.*/, '')
    .replace(/€.*/, '')
    .replace(/Ablöse.*/, '')
    .replace(/Fim de.*/, '')
    .trim();
}

async function fetchClubSquad(club: ClubMeta) {
  const url = `https://www.transfermarkt.com.br/${club.slug}/kader/verein/${club.tmId}/plus/1`;
  const res = await fetch(url, {
    headers: { 'User-Agent': UA, 'Accept-Language': 'pt-BR,pt;q=0.9' },
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  const html = await res.text();
  const $ = cheerio.load(html);

  const players: any[] = [];

  // #yw1 contém estritamente o elenco ativo do clube (sem jogadores emprestados a outros)
  const $table = $('#yw1 table.items > tbody > tr').length
    ? $('#yw1 table.items > tbody > tr')
    : $('table.items > tbody > tr');

  $table.each((_, el) => {
    const $tr = $(el);
    if (
      $tr.hasClass('bg_Torwart') ||
      $tr.hasClass('bg_Abwehr') ||
      $tr.hasClass('bg_Mittelfeld') ||
      $tr.hasClass('bg_Sturm')
    ) {
      return;
    }

    const $link = $tr.find('td.posrela .hauptlink a');
    const rawName = $link.text().trim();
    const profilePath = $link.attr('href') || '';
    const idMatch = profilePath.match(/spieler\/(\d+)/);
    const tmId = idMatch ? Number(idMatch[1]) : 0;
    if (!rawName || !tmId) return;

    // Foto oficial do Transfermarkt (resolução header limpa)
    const $img = $tr.find('td.posrela img');
    let photo = $img.attr('data-src') || $img.attr('src') || '';
    // Se for wappen (escudo placeholder) ou data:image, limpa a foto para usar fallback de iniciais
    if (photo.includes('data:image') || photo.includes('/wappen/') || !photo.includes('/portrait/')) {
      photo = '';
    } else if (photo.includes('/portrait/medium/')) {
      photo = photo.replace('/portrait/medium/', '/portrait/header/');
    }

    // Posição detalhada
    const detailedPos = $tr.find('td.posrela tr:last-child td').text().trim();

    // Data de nascimento e Idade (td[2])
    const dobText = $tr.find('> td').eq(2).text().trim();
    const ageMatch = dobText.match(/(\d{2}\/\d{2}\/\d{4})\s*\((\d+)\)/);
    const age = ageMatch ? Number(ageMatch[2]) : 25;

    // Nacionalidade (td[3])
    const nat = $tr.find('> td').eq(3).find('img').attr('title') || 'Brasil';

    // Altura (td[4])
    const rawHeight = $tr.find('> td').eq(4).text().trim();
    const altura = formatHeight(rawHeight);

    // Pé Dominante (td[5])
    const rawFoot = $tr.find('> td').eq(5).text().trim();
    const pe_dominante = mapFoot(rawFoot);

    // Clube Anterior (td[7])
    const rawPrevClub =
      $tr.find('> td').eq(7).find('img').attr('title') ||
      $tr.find('> td').eq(7).text().trim();
    const prevClub = cleanClubName(rawPrevClub);

    players.push({
      id: tmId,
      name: rawName,
      photo,
      detailedPos,
      age,
      nat,
      altura,
      pe_dominante,
      prevClub,
    });
  });

  return players;
}

async function main() {
  console.log('🚀 Iniciando sincronização EXCLUSIVA via Transfermarkt (Série A 2026)...');

  // Carrega sementes de títulos e dados anteriores para complementar histórico de carreira
  const existingPlayers: any[] = fs.existsSync(OUTPUT)
    ? JSON.parse(fs.readFileSync(OUTPUT, 'utf8'))
    : [];
  const existingMap = new Map<string, any>();
  for (const p of existingPlayers) {
    existingMap.set(norm(p.name), p);
    existingMap.set(`${p.team}|${norm(p.name)}`, p);
  }

  const trophiesSeed: any[] = fs.existsSync(TROPHIES_SEED)
    ? JSON.parse(fs.readFileSync(TROPHIES_SEED, 'utf8'))
    : [];
  const trophyMap = new Map<string, PlayerTrophies>();
  for (const t of trophiesSeed) {
    trophyMap.set(norm(t.name), t.trophies);
    trophyMap.set(`${t.team}|${norm(t.name)}`, t.trophies);
  }

  const finalPlayers: any[] = [];
  const seenIds = new Set<number>();

  for (const club of CLUBS) {
    console.log(`🌐 Buscando elenco do ${club.team} no Transfermarkt...`);
    try {
      const athletes = await fetchClubSquad(club);
      console.log(`  ✅ ${athletes.length} jogadores encontrados no ${club.team}`);

      for (const a of athletes) {
        if (seenIds.has(a.id)) continue;
        seenIds.add(a.id);

        const ov = OVERRIDES[norm(a.name)];
        const playerName = ov?.name ?? a.name;
        const photo = ov?.photo ?? a.photo;
        const position = ov?.position ?? mapPosition(a.detailedPos);

        // Histórico de carreira consolidado
        const oldData =
          existingMap.get(`${club.team}|${norm(playerName)}`) ??
          existingMap.get(norm(playerName));
        const career = new Set<string>();
        if (a.prevClub && a.prevClub.length > 2) {
          career.add(a.prevClub);
        }
        if (oldData?.careerTeams) {
          for (const c of oldData.careerTeams) {
            const clean = cleanClubName(c);
            if (clean && clean.length > 2) career.add(clean);
          }
        }
        career.add(club.team);

        // Títulos
        const trophies =
          ov?.trophies ??
          trophyMap.get(`${club.team}|${norm(playerName)}`) ??
          trophyMap.get(norm(playerName)) ??
          oldData?.trophies ?? {
            brasileirao: false,
            copaDoBrasil: false,
            libertadores: false,
            sulamericana: false,
          };

        finalPlayers.push({
          id: a.id,
          name: playerName,
          photo,
          team: club.team,
          teamLogo: club.logo,
          careerTeams: Array.from(career).slice(0, 15),
          age: a.age,
          altura: a.altura,
          pe_dominante: a.pe_dominante,
          position,
          nationality: a.nat || 'Brasil',
          trophies,
        });
      }
    } catch (e) {
      console.error(`  ❌ Erro ao buscar ${club.team}:`, (e as Error).message);
    }
    await sleep(750);
  }

  if (finalPlayers.length < 300) {
    console.error(`❌ Menos de 300 atletas coletados (${finalPlayers.length}). Abortando.`);
    process.exit(1);
  }

  // Ordenar alfabeticamente por clube e nome
  finalPlayers.sort((a, b) => a.team.localeCompare(b.team) || a.name.localeCompare(b.name));

  fs.writeFileSync(OUTPUT, JSON.stringify(finalPlayers, null, 2), 'utf8');

  console.log(`\n🎉 SUCESSO! Base Transfermarkt salva em ${OUTPUT}`);
  console.log(`⚽ Total de jogadores ativos na Série A 2026: ${finalPlayers.length}`);
  const withPhoto = finalPlayers.filter((p) => p.photo && p.photo.length > 5).length;
  console.log(
    `📸 Com retrato oficial Transfermarkt: ${withPhoto} (${Math.round(
      (withPhoto / finalPlayers.length) * 100
    )}%)`
  );

  const byTeam: Record<string, number> = {};
  for (const p of finalPlayers) {
    byTeam[p.team] = (byTeam[p.team] || 0) + 1;
  }
  console.table(byTeam);
}

main().catch((err) => {
  console.error('Falha geral:', err);
  process.exit(1);
});
