const fs = require('fs');
const path = require('path');

const PLAYERS_FILE = path.resolve('src/data/players.json');
const CLUB_LOGOS_FILE = path.resolve('src/utils/clubLogos.ts');

const players = JSON.parse(fs.readFileSync(PLAYERS_FILE, 'utf8'));
const fileContent = fs.readFileSync(CLUB_LOGOS_FILE, 'utf8');

// Collect all clubs from careerHistory and careerTeams
const allClubs = new Map();

players.forEach(p => {
  if (Array.isArray(p.careerHistory)) {
    p.careerHistory.forEach(h => {
      if (h.club && h.logo) {
        allClubs.set(h.club, h.logo);
      }
    });
  }
  if (p.team && p.teamLogo) {
    allClubs.set(p.team, p.teamLogo);
  }
});

console.log('Total distinct clubs in player histories:', allClubs.size);

// Read current CLUB_LOGOS object from clubLogos.ts
// We will merge all new clubs into CLUB_LOGOS
const logoMapMatches = fileContent.match(/export const CLUB_LOGOS:\s*Record<string,\s*string>\s*=\s*\{([\s\S]*?)\};/);

if (logoMapMatches) {
  let existingLines = logoMapMatches[1].trim();
  
  // Extract existing keys
  const existingKeys = new Set();
  const keyRegex = /['"]([^'"]+)['"]\s*:/g;
  let match;
  while ((match = keyRegex.exec(existingLines)) !== null) {
    existingKeys.add(match[1].toLowerCase());
  }

  console.log('Existing keys in clubLogos.ts:', existingKeys.size);

  const newEntries = [];
  allClubs.forEach((logo, club) => {
    if (!existingKeys.has(club.toLowerCase())) {
      newEntries.push(`  '${club}': '${logo}',`);
      existingKeys.add(club.toLowerCase());
    }
  });

  console.log('New clubs to add to clubLogos.ts:', newEntries.length);

  if (newEntries.length > 0) {
    const updatedMapContent = `export const CLUB_LOGOS: Record<string, string> = {\n${existingLines}\n${newEntries.join('\n')}\n};`;
    const newFileContent = fileContent.replace(logoMapMatches[0], updatedMapContent);
    fs.writeFileSync(CLUB_LOGOS_FILE, newFileContent, 'utf8');
    console.log('Updated src/utils/clubLogos.ts successfully!');
  }
}
