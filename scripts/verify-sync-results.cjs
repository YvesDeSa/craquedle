const fs = require('fs');
const players = JSON.parse(fs.readFileSync('src/data/players.json', 'utf8'));

console.log('Total players:', players.length);
const withPhotos = players.filter(p => p.photo && p.photo.trim().length > 0);
console.log('Players with photo:', withPhotos.length);

const withCareers = players.filter(p => p.careerTeams && p.careerTeams.length > 0);
console.log('Players with careerTeams:', withCareers.length);

const withMultiClubs = players.filter(p => p.careerTeams && p.careerTeams.length > 1);
console.log('Players with > 1 club in career:', withMultiClubs.length);

const withTrophies = players.filter(p => p.trophies && (p.trophies.brasileirao || p.trophies.copaDoBrasil || p.trophies.libertadores || p.trophies.sulamericana));
console.log('Players with at least one major trophy:', withTrophies.length);

console.log('\n--- SAMPLE INSPECTIONS ---');
const sampleNames = ['Allan', 'Pedro', 'Andreas Pereira', 'Yuri Alberto', 'Felipe Anderson', 'Lucas Paquetá', 'Neymar Jr', 'Thiago Silva'];
sampleNames.forEach(name => {
  const p = players.find(x => x.name.toLowerCase().includes(name.toLowerCase()));
  if (p) {
    console.log(`\n${p.name} (${p.team}) - Photo: ${Boolean(p.photo)}`);
    console.log('  Trophies:', p.trophies);
    console.log('  Career:', p.careerTeams);
    console.log('  CareerHistory count:', p.careerHistory?.length);
  }
});
