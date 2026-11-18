const fs = require('fs');

const content = fs.readFileSync('src/utils/clubLogos.ts', 'utf8');

const startIdx = content.indexOf('export const CLUB_LOGOS: Record<string, string> = {');
const endIdx = content.indexOf('};', startIdx);

const body = content.substring(startIdx, endIdx + 2);
const rest = content.substring(endIdx + 2);

const map = new Map();
const lines = body.split('\n');
for (const line of lines) {
  const m = line.match(/^\s*['"]([^'"]+)['"]:\s*['"]([^'"]+)['"],?/);
  if (m) {
    // Keep normalized key
    map.set(m[1].trim(), m[2].trim());
  }
}

let newBody = 'export const CLUB_LOGOS: Record<string, string> = {\n';
for (const [k, v] of map.entries()) {
  newBody += `  "${k}": "${v}",\n`;
}
newBody += '};\n';

fs.writeFileSync('src/utils/clubLogos.ts', content.substring(0, startIdx) + newBody + rest, 'utf8');
console.log('Deduplicated CLUB_LOGOS to', map.size, 'entries');
