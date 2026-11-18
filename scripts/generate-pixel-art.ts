import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface PlayerItem {
  id: number;
  name: string;
  team: string;
  photo: string;
}

const PLAYERS_FILE = path.resolve(__dirname, '../src/data/players.json');
const PIXEL_DIR = path.resolve(__dirname, '../public/players/pixel');

// Garante que a pasta de destino exista
if (!fs.existsSync(PIXEL_DIR)) {
  fs.mkdirSync(PIXEL_DIR, { recursive: true });
}

/**
 * Script de Automação para Gerenciamento e Geração de Pixel Art Local (Estilo Patternful.ai)
 * 
 * Uso:
 *   npx tsx scripts/generate-pixel-art.ts --status
 *   npx tsx scripts/generate-pixel-art.ts --id 385271
 *   npx tsx scripts/generate-pixel-art.ts --limit 5
 */
async function main() {
  const args = process.argv.slice(2);
  const players: PlayerItem[] = JSON.parse(fs.readFileSync(PLAYERS_FILE, 'utf-8'));

  const existingFiles = new Set(
    fs.readdirSync(PIXEL_DIR).filter((f) => f.endsWith('.png'))
  );

  console.log(`\n======================================================`);
  console.log(`🎨 BRASIDLE - GERADOR & GERENCIADOR DE PIXEL ART`);
  console.log(`======================================================`);
  console.log(`Total de Atletas na Base: ${players.length}`);
  console.log(`Artes em Pixel Art Locais Salvas: ${existingFiles.size}`);
  console.log(`Diretório de Armazenamento: public/players/pixel/\n`);

  if (args.includes('--status')) {
    console.log(`📋 Status das Artes Locais:`);
    const covered = players.filter((p) => existingFiles.has(`${p.id}.png`));
    const missing = players.filter((p) => !existingFiles.has(`${p.id}.png`));

    console.log(`✓ Atletas com Pixel Art gerada: ${covered.length}`);
    covered.forEach((p) => console.log(`   - [ID: ${p.id}] ${p.name} (${p.team}) -> /players/pixel/${p.id}.png`));

    console.log(`\n⏳ Atletas pendentes (usando fallback oficial): ${missing.length}`);
    return;
  }

  // Filtrar por ID específico
  const idIndex = args.indexOf('--id');
  let targetPlayers: PlayerItem[] = [];

  if (idIndex !== -1 && args[idIndex + 1]) {
    const searchId = Number(args[idIndex + 1]);
    const found = players.find((p) => p.id === searchId);
    if (!found) {
      console.error(`❌ Atleta com ID ${searchId} não encontrado no players.json`);
      return;
    }
    targetPlayers = [found];
  } else {
    // Filtrar atletas que ainda não têm pixel art
    const pending = players.filter((p) => !existingFiles.has(`${p.id}.png`) && Boolean(p.photo));
    const limitIndex = args.indexOf('--limit');
    const limit = limitIndex !== -1 && args[limitIndex + 1] ? Number(args[limitIndex + 1]) : 5;
    targetPlayers = pending.slice(0, limit);
  }

  console.log(`Processando ${targetPlayers.length} atleta(s)...`);

  for (const player of targetPlayers) {
    const destPath = path.join(PIXEL_DIR, `${player.id}.png`);
    console.log(`\n🔍 Atleta: ${player.name} (ID: ${player.id}, Time: ${player.team})`);

    // Exemplo de integração com API de IA ou download de arte gerada:
    // Se você tiver uma chave da API Replicate / Leonardo / Patternful configurada no .env:
    // const aiGeneratedBuffer = await callPixelArtAI(player.photo);
    // fs.writeFileSync(destPath, aiGeneratedBuffer);

    console.log(`   Foto Original: ${player.photo}`);
    console.log(`   Destino Local: public/players/pixel/${player.id}.png`);
    console.log(`   💡 Dica: Para adicionar artes geradas via Patternful.ai, salve o arquivo como ${player.id}.png dentro de public/players/pixel/`);
  }

  console.log(`\n✓ Concluído! O jogo automaticamente priorizará qualquer arquivo .png na pasta public/players/pixel/ com fallback para a foto oficial.\n`);
}

main().catch((err) => {
  console.error('Erro ao executar gerador:', err);
  process.exit(1);
});
