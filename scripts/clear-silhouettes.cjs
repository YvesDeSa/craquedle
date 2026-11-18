const fs = require('fs');
const players = JSON.parse(fs.readFileSync('src/data/players.json', 'utf8'));
let cleared = 0;
for (const p of players) {
  if (p.photo && (p.photo.includes('silhuetas') || p.photo.includes('clubes_2026/silhuetas'))) {
    p.photo = '';
    cleared++;
  }
}
console.log(`Cleared ${cleared} silhouette placeholders back to empty!`);
fs.writeFileSync('src/data/players.json', JSON.stringify(players, null, 2), 'utf8');
