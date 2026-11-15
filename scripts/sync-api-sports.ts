import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = process.env.VITE_API_SPORTS_KEY || process.env.API_SPORTS_KEY;
const BASE_URL = 'https://v3.football.api-sports.io';
const OUTPUT_FILE = path.resolve(__dirname, '../src/data/players.json');

interface ApiSportsPlayerSquad {
  id: number;
  name: string;
  age: number;
  number: number | null;
  position: string;
  photo: string;
}

interface ApiSportsTrophy {
  league: string;
  country: string;
  season: string;
  place: string;
}

function mapPosition(apiPos: string): 'Goleiro' | 'Defensor' | 'Meia' | 'Atacante' {
  const p = apiPos.toLowerCase();
  if (p.includes('goalkeeper')) return 'Goleiro';
  if (p.includes('defender')) return 'Defensor';
  if (p.includes('midfielder')) return 'Meia';
  return 'Atacante';
}

async function fetchFromApi(endpoint: string) {
  if (!API_KEY) {
    throw new Error('API Key não informada! Defina VITE_API_SPORTS_KEY no arquivo .env.');
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'x-apisports-key': API_KEY,
    },
  });

  if (!res.ok) {
    throw new Error(`Erro na API (${res.status}): ${res.statusText}`);
  }

  const json = await res.json();
  if (json.errors && Object.keys(json.errors).length > 0) {
    console.error('Erros reportados pela API-Sports:', json.errors);
  }
  return json.response;
}

async function syncPlayers() {
  console.log('⚽ Iniciando sincronização com a API-Sports...');

  if (!API_KEY) {
    console.warn('⚠️ AVISO: VITE_API_SPORTS_KEY não encontrada no .env.');
    console.log('ℹ️ Mantendo o arquivo local `src/data/players.json` com os dados atuais já populados.');
    return;
  }

  try {
    // 1. Buscar os times da Série A (league=71, season=2026)
    console.log('Buscando times do Brasileirão Série A...');
    const teamsData = await fetchFromApi('/teams?league=71&season=2026');

    const syncedPlayers: any[] = [];

    // Limitar para não estourar a cota da API em testes gratuitos
    const teamsToFetch = (teamsData || []).slice(0, 10);

    for (const item of teamsToFetch) {
      const team = item.team;
      console.log(`Buscando elenco do ${team.name}...`);
      const squadData = await fetchFromApi(`/players/squads?team=${team.id}`);

      if (!squadData || squadData.length === 0) continue;
      const playersList: ApiSportsPlayerSquad[] = squadData[0].players || [];

      // Seleciona até 5 jogadores de destaque por time para criar uma base rica
      for (const p of playersList.slice(0, 5)) {
        console.log(`  -> Processando atleta: ${p.name} (#${p.id})`);
        
        // Consultar troféus
        let trophiesMap = {
          brasileirao: false,
          copaDoBrasil: false,
          libertadores: false,
        };

        try {
          const trophies: ApiSportsTrophy[] = await fetchFromApi(`/trophies?player=${p.id}`);
          if (Array.isArray(trophies)) {
            for (const t of trophies) {
              if (t.place === 'Winner' || t.place === '1st') {
                const leg = t.league?.toLowerCase() || '';
                if (leg.includes('serie a') || leg.includes('brasileiro') || leg.includes('brasileirão')) {
                  trophiesMap.brasileirao = true;
                }
                if (leg.includes('copa do brasil')) {
                  trophiesMap.copaDoBrasil = true;
                }
                if (leg.includes('libertadores')) {
                  trophiesMap.libertadores = true;
                }
              }
            }
          }
        } catch (e) {
          console.warn(`    Não foi possível obter títulos de ${p.name}:`, (e as Error).message);
        }

        syncedPlayers.push({
          id: p.id,
          name: p.name,
          photo: p.photo || `https://media.api-sports.io/football/players/${p.id}.png`,
          team: team.name,
          teamLogo: team.logo,
          careerTeams: [team.name],
          age: p.age || 26,
          position: mapPosition(p.position),
          nationality: 'Brasil',
          trophies: trophiesMap,
        });
      }
    }

    if (syncedPlayers.length > 0) {
      fs.writeFileSync(OUTPUT_FILE, JSON.stringify(syncedPlayers, null, 2), 'utf-8');
      console.log(`✅ Sincronização concluída! ${syncedPlayers.length} jogadores salvos em ${OUTPUT_FILE}`);
    } else {
      console.log('Nenhum dado retornado da API.');
    }
  } catch (error) {
    console.error('❌ Falha na sincronização:', error);
  }
}

syncPlayers();
