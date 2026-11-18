const fs = require('fs');
const path = require('path');

const PLAYERS_FILE = path.resolve('src/data/players.json');
const players = JSON.parse(fs.readFileSync(PLAYERS_FILE, 'utf-8'));

console.log(`Starting sanitization of ${players.length} players...`);

// 1. Dicionário de equivalência oficial de clubes profissionais
const CLUB_CANONICAL = {
  // Principais do Brasil
  'grêmio foot-ball porto alegrense': 'Grêmio',
  'grêmio fbpa': 'Grêmio',
  'grêmio fpa': 'Grêmio',
  'grêmio': 'Grêmio',

  'são paulo futebol clube': 'São Paulo',
  'são paulo fc': 'São Paulo',
  'são paulo': 'São Paulo',

  'clube de regatas do flamengo': 'Flamengo',
  'cr flamengo': 'Flamengo',
  'flamengo': 'Flamengo',

  'sociedade esportiva palmeiras': 'Palmeiras',
  'se palmeiras': 'Palmeiras',
  'palmeiras': 'Palmeiras',

  'sport club corinthians paulista': 'Corinthians',
  'sc corinthians': 'Corinthians',
  'corinthians': 'Corinthians',

  'clube atlético mineiro': 'Atlético-MG',
  'atlético mineiro': 'Atlético-MG',
  'atlético-mg': 'Atlético-MG',

  'esporte clube bahia': 'Bahia',
  'ec bahia': 'Bahia',
  'bahia': 'Bahia',

  'fluminense football club': 'Fluminense',
  'fluminense fc': 'Fluminense',
  'fluminense': 'Fluminense',

  'club athletico paranaense': 'Athletico-PR',
  'athletico paranaense': 'Athletico-PR',
  'athletico-pr': 'Athletico-PR',

  'santos futebol clube': 'Santos',
  'santos fc': 'Santos',
  'santos': 'Santos',

  'sport club internacional': 'Internacional',
  'sc internacional': 'Internacional',
  'internacional': 'Internacional',

  'botafogo de futebol e regatas': 'Botafogo',
  'botafogo fr': 'Botafogo',
  'botafogo': 'Botafogo',

  'club de regatas vasco da gama': 'Vasco',
  'cr vasco da gama': 'Vasco',
  'vasco da gama': 'Vasco',
  'vasco': 'Vasco',

  'cruzeiro esporte clube': 'Cruzeiro',
  'cruzeiro ec': 'Cruzeiro',
  'cruzeiro': 'Cruzeiro',

  'red bull bragantino': 'Red Bull Bragantino',
  'rb bragantino': 'Red Bull Bragantino',
  'bragantino': 'Red Bull Bragantino',

  'coritiba foot ball club': 'Coritiba',
  'coritiba fc': 'Coritiba',
  'coritiba': 'Coritiba',

  'associação chapecoense de futebol': 'Chapecoense',
  'chapecoense': 'Chapecoense',

  'esporte clube vitória': 'Vitória',
  'ec vitória': 'Vitória',
  'vitória': 'Vitória',

  'mirassol futebol clube': 'Mirassol',
  'mirassol fc': 'Mirassol',
  'mirassol': 'Mirassol',

  'clube do remo': 'Remo',
  'remo': 'Remo',

  'fortaleza esporte clube': 'Fortaleza',
  'fortaleza ec': 'Fortaleza',
  'fortaleza': 'Fortaleza',

  'ceará sporting club': 'Ceará',
  'ceará sc': 'Ceará',
  'ceará': 'Ceará',

  'goiás esporte clube': 'Goiás',
  'goiás ec': 'Goiás',
  'goiás': 'Goiás',

  'cuiabá esporte clube': 'Cuiabá',
  'cuiabá ec': 'Cuiabá',
  'cuiabá': 'Cuiabá',

  'américa futebol clube': 'América-MG',
  'américa mineiro': 'América-MG',
  'américa-mg': 'América-MG',

  'sport club do recife': 'Sport',
  'sport recife': 'Sport',
  'sport': 'Sport',

  'associação atlética ponte preta': 'Ponte Preta',
  'aa ponte preta': 'Ponte Preta',
  'ponte preta': 'Ponte Preta',

  'associação portuguesa de desportos': 'Portuguesa',
  'portuguesa': 'Portuguesa',

  'criciúma esporte clube': 'Criciúma',
  'criciúma ec': 'Criciúma',
  'criciúma': 'Criciúma',

  'avaí futebol clube': 'Avaí',
  'avaí fc': 'Avaí',
  'avaí': 'Avaí',

  'figueirense futebol clube': 'Figueirense',
  'figueirense fc': 'Figueirense',
  'figueirense': 'Figueirense',

  'paraná clube': 'Paraná',
  'paraná': 'Paraná',

  'guarani futebol clube': 'Guarani',
  'guarani': 'Guarani',

  'vila nova futebol clube': 'Vila Nova',
  'vila nova': 'Vila Nova',

  'atlético clube goianiense': 'Atlético-GO',
  'atlético goianiense': 'Atlético-GO',
  'atlético-go': 'Atlético-GO',

  'juventude esporte clube': 'Juventude',
  'esporte clube juventude': 'Juventude',
  'ec juventude': 'Juventude',
  'juventude': 'Juventude',

  'londrina esporte clube': 'Londrina',
  'londrina': 'Londrina',

  'paysandu sport club': 'Paysandu',
  'paysandu': 'Paysandu',

  'clube náutico capibaribe': 'Náutico',
  'náutico capibaribe': 'Náutico',
  'náutico': 'Náutico',

  'santa cruz futebol clube': 'Santa Cruz',
  'santa cruz': 'Santa Cruz',

  'sampaio corrêa futebol clube': 'Sampaio Corrêa',
  'sampaio corrêa': 'Sampaio Corrêa',

  'operário ferroviário esporte clube': 'Operário-PR',
  'operário ferroviário': 'Operário-PR',
  'operário-pr': 'Operário-PR',

  'associação desportiva são caetano': 'São Caetano',
  'são caetano': 'São Caetano',

  'grêmio esportivo brasil': 'Brasil de Pelotas',
  'brasil de pelotas': 'Brasil de Pelotas',

  'clube de regatas brasil': 'CRB',
  'crb': 'CRB',

  'centro sportivo alagoano': 'CSA',
  'csa': 'CSA',

  'abc futebol clube': 'ABC',
  'abc': 'ABC',

  'botafogo futebol clube (sp)': 'Botafogo-SP',
  'botafogo futebol clube': 'Botafogo-SP',
  'botafogo-sp': 'Botafogo-SP',

  'grêmio novorizontino': 'Novorizontino',
  'novorizontino': 'Novorizontino',

  'ituano futebol clube': 'Ituano',
  'ituano': 'Ituano',

  'associação ferroviária de esportes': 'Ferroviária',
  'ferroviária': 'Ferroviária',

  'associação desportiva confiança': 'Confiança',
  'confiança': 'Confiança',

  'volta redonda futebol clube': 'Volta Redonda',
  'volta redonda fc': 'Volta Redonda',
  'volta redonda': 'Volta Redonda',

  'tombense futebol clube': 'Tombense',
  'tombense': 'Tombense',

  'bangu atlético clube': 'Bangu',
  'bangu': 'Bangu',

  'madureira esporte clube': 'Madureira',
  'madureira': 'Madureira',

  'boavista sport club': 'Boavista-RJ',
  'boavista-rj': 'Boavista-RJ',

  'associação desportiva cabofriense': 'Cabofriense',
  'cabofriense': 'Cabofriense',

  'audax rio de janeiro': 'Audax-RJ',
  'grêmio osasco audax': 'Audax-SP',
  'desportivo brasil': 'Desportivo Brasil',

  // Internacionais
  'futbol club barcelona': 'Barcelona',
  'fc barcelona': 'Barcelona',
  'barcelona': 'Barcelona',

  'real madrid club de fútbol': 'Real Madrid',
  'real madrid cf': 'Real Madrid',
  'real madrid': 'Real Madrid',

  'club atlético de madrid': 'Atlético de Madrid',
  'atlético de madrid': 'Atlético de Madrid',

  'sevilla fútbol club': 'Sevilla',
  'sevilla fc': 'Sevilla',
  'sevilla': 'Sevilla',

  'valencia club de fútbol': 'Valencia',
  'valencia cf': 'Valencia',
  'valencia': 'Valencia',

  'villarreal club de fútbol': 'Villarreal',
  'villarreal cf': 'Villarreal',
  'villarreal': 'Villarreal',

  'real betis balompié': 'Betis',
  'real betis': 'Betis',
  'betis': 'Betis',

  'rcd espanyol': 'Espanyol',
  'espanyol': 'Espanyol',

  'real sociedad de fútbol': 'Real Sociedad',
  'real sociedad': 'Real Sociedad',

  'athletic club': 'Athletic Bilbao',
  'athletic bilbao': 'Athletic Bilbao',

  'manchester city football club': 'Manchester City',
  'manchester city fc': 'Manchester City',
  'manchester city': 'Manchester City',

  'manchester united football club': 'Manchester United',
  'manchester united fc': 'Manchester United',
  'manchester united': 'Manchester United',

  'liverpool football club': 'Liverpool',
  'liverpool fc': 'Liverpool',
  'liverpool': 'Liverpool',

  'chelsea football club': 'Chelsea',
  'chelsea fc': 'Chelsea',
  'chelsea': 'Chelsea',

  'arsenal football club': 'Arsenal',
  'arsenal fc': 'Arsenal',
  'arsenal': 'Arsenal',

  'tottenham hotspur football club': 'Tottenham',
  'tottenham hotspur fc': 'Tottenham',
  'tottenham hotspur': 'Tottenham',
  'tottenham': 'Tottenham',

  'newcastle united football club': 'Newcastle',
  'newcastle united fc': 'Newcastle',
  'newcastle united': 'Newcastle',
  'newcastle': 'Newcastle',

  'aston villa football club': 'Aston Villa',
  'aston villa fc': 'Aston Villa',
  'aston villa': 'Aston Villa',

  'west ham united football club': 'West Ham',
  'west ham united fc': 'West Ham',
  'west ham united': 'West Ham',
  'west ham': 'West Ham',

  'wolverhampton wanderers fc': 'Wolverhampton',
  'wolverhampton wanderers': 'Wolverhampton',
  'wolves': 'Wolverhampton',

  'everton football club': 'Everton',
  'everton fc': 'Everton',
  'everton': 'Everton',

  'fulham football club': 'Fulham',
  'fulham fc': 'Fulham',
  'fulham': 'Fulham',

  'nottingham forest football club': 'Nottingham Forest',
  'nottingham forest fc': 'Nottingham Forest',
  'nottingham forest': 'Nottingham Forest',

  'juventus football club': 'Juventus',
  'juventus fc': 'Juventus',
  'juventus': 'Juventus',

  'football club internazionale milano': 'Inter de Milão',
  'fc internazionale milano': 'Inter de Milão',
  'fc internazionale': 'Inter de Milão',
  'inter de milão': 'Inter de Milão',
  'inter milan': 'Inter de Milão',
  'inter': 'Inter de Milão',

  'associazione calcio milan': 'Milan',
  'ac milan': 'Milan',
  'milan': 'Milan',

  'associazione sportiva roma': 'Roma',
  'as roma': 'Roma',
  'roma': 'Roma',

  'società sportiva lazio': 'Lazio',
  'ss lazio': 'Lazio',
  'lazio': 'Lazio',

  'società sportiva calcio napoli': 'Napoli',
  'ssc napoli': 'Napoli',
  'napoli': 'Napoli',

  'acf fiorentina': 'Fiorentina',
  'fiorentina': 'Fiorentina',

  'atalanta bergamasca calcio': 'Atalanta',
  'atalanta bc': 'Atalanta',
  'atalanta': 'Atalanta',

  'bologna football club 1909': 'Bologna',
  'bologna fc': 'Bologna',
  'bologna': 'Bologna',

  'torino football club': 'Torino',
  'torino fc': 'Torino',
  'torino': 'Torino',

  'udinese calcio': 'Udinese',
  'udinese': 'Udinese',

  'fußball-club bayern münchen': 'Bayern de Munique',
  'fc bayern münchen': 'Bayern de Munique',
  'bayern münchen': 'Bayern de Munique',
  'bayern munich': 'Bayern de Munique',
  'bayern de munique': 'Bayern de Munique',

  'borussia dortmund': 'Borussia Dortmund',
  'bayer 04 leverkusen': 'Bayer Leverkusen',
  'bayer leverkusen': 'Bayer Leverkusen',

  'rasenballsport leipzig': 'RB Leipzig',
  'rb leipzig': 'RB Leipzig',

  'vfl wolfsburg': 'Wolfsburg',
  'wolfsburg': 'Wolfsburg',

  'eintracht frankfurt': 'Eintracht Frankfurt',
  'fc schalke 04': 'Schalke 04',
  'schalke 04': 'Schalke 04',

  'paris saint-germain football club': 'Paris Saint-Germain',
  'paris saint-germain fc': 'Paris Saint-Germain',
  'paris saint-germain': 'Paris Saint-Germain',
  'psg': 'Paris Saint-Germain',

  'olympique de marseille': 'Olympique de Marselha',
  'olympique de marselha': 'Olympique de Marselha',

  'olympique lyonnais': 'Lyon',
  'olympique lyon': 'Lyon',
  'lyon': 'Lyon',

  'as monaco': 'Monaco',
  'monaco': 'Monaco',

  'losc lille': 'Lille',
  'lille': 'Lille',

  'sport lisboa e benfica': 'Benfica',
  'sl benfica': 'Benfica',
  'benfica': 'Benfica',

  'futebol clube do porto': 'Porto',
  'fc porto': 'Porto',
  'porto': 'Porto',

  'sporting clube de portugal': 'Sporting',
  'sporting cp': 'Sporting',
  'sporting': 'Sporting',

  'sporting clube de braga': 'Braga',
  'sc braga': 'Braga',
  'braga': 'Braga',

  'afc ajax': 'Ajax',
  'ajax': 'Ajax',

  'psv eindhoven': 'PSV',
  'psv': 'PSV',

  'feyenoord rotterdam': 'Feyenoord',
  'feyenoord': 'Feyenoord',

  'club atlético river plate': 'River Plate',
  'ca river plate': 'River Plate',
  'river plate': 'River Plate',

  'club atlético boca juniors': 'Boca Juniors',
  'ca boca juniors': 'Boca Juniors',
  'boca juniors': 'Boca Juniors',

  'racing club': 'Racing',
  'racing': 'Racing',

  'club atlético independiente': 'Independiente',
  'ca independiente': 'Independiente',
  'independiente': 'Independiente',

  'club atlético san lorenzo de almagro': 'San Lorenzo',
  'san lorenzo': 'San Lorenzo',

  'club atlético vélez sarsfield': 'Vélez Sarsfield',
  'vélez sarsfield': 'Vélez Sarsfield',

  'club atlético lanús': 'Lanús',
  'lanús': 'Lanús',

  'club atlético newell\'s old boys': 'Newell\'s Old Boys',
  'newell\'s old boys': 'Newell\'s Old Boys',

  'club atlético rosario central': 'Rosario Central',
  'rosario central': 'Rosario Central',

  'estudiantes de la plata': 'Estudiantes',
  'estudiantes': 'Estudiantes',

  'club nacional de football': 'Nacional-URU',
  'nacional': 'Nacional-URU',

  'club atlético peñarol': 'Peñarol',
  'peñarol': 'Peñarol',

  'defensor sporting club': 'Defensor Sporting',
  'defensor': 'Defensor Sporting',

  'club olimpia': 'Olimpia',
  'olimpia': 'Olimpia',

  'club cerro porteño': 'Cerro Porteño',
  'cerro porteño': 'Cerro Porteño',

  'club libertad': 'Libertad',
  'libertad': 'Libertad',

  'club atlético nacional': 'Atlético Nacional',
  'atlético nacional': 'Atlético Nacional',

  'millonarios fc': 'Millonarios',
  'millonarios': 'Millonarios',

  'américa de cali': 'América de Cali',
  'independiente santa fe': 'Santa Fe',
  'junior fc': 'Junior Barranquilla',
  'junior de barranquilla': 'Junior Barranquilla',

  'liga deportiva universitaria de quito': 'LDU',
  'ldu quito': 'LDU',
  'ldu': 'LDU',

  'independiente del valle': 'Independiente del Valle',
  'barcelona sporting club': 'Barcelona-EQU',

  'al-hilal saudi fc': 'Al-Hilal',
  'al-hilal sfc': 'Al-Hilal',
  'al-hilal': 'Al-Hilal',

  'al-nassr fc': 'Al-Nassr',
  'al-nassr': 'Al-Nassr',

  'al-ittihad club': 'Al-Ittihad',
  'al-ittihad': 'Al-Ittihad',

  'al-ahli sfc': 'Al-Ahli',
  'al-ahli': 'Al-Ahli',

  'al-shabab fc': 'Al-Shabab',
  'al-shabab': 'Al-Shabab',

  'al-duhail sc': 'Al-Duhail',
  'al-duhail': 'Al-Duhail',

  'al-sadd sc': 'Al-Sadd',
  'al-sadd': 'Al-Sadd',

  'shakhtar donetsk': 'Shakhtar Donetsk',
  'dynamo kyiv': 'Dínamo de Kiev',

  'galatasaray spor kulübü': 'Galatasaray',
  'galatasaray sk': 'Galatasaray',
  'galatasaray': 'Galatasaray',

  'fenerbahçe spor kulübü': 'Fenerbahçe',
  'fenerbahçe sk': 'Fenerbahçe',
  'fenerbahçe': 'Fenerbahçe',

  'beşiktaş jimnastik kulübü': 'Beşiktaş',
  'beşiktaş jk': 'Beşiktaş',
  'beşiktaş': 'Beşiktaş',

  'olympiacos fc': 'Olympiacos',
  'panathinaikos fc': 'Panathinaikos',
  'zenit st. petersburg': 'Zenit',
  'zenit são petersburgo': 'Zenit',
  'spartak moscow': 'Spartak Moscou',
  'cska moscow': 'CSKA Moscou',

  'inter miami cf': 'Inter Miami',
  'los angeles fc': 'Los Angeles FC',
  'los angeles galaxy': 'LA Galaxy',
  'la galaxy': 'LA Galaxy',
  'atlanta united fc': 'Atlanta United',
  'new york city fc': 'New York City',
  'orlando city sc': 'Orlando City',

  'club américa': 'América-MEX',
  'cf monterrey': 'Monterrey',
  'monterrey': 'Monterrey',
  'tigres uanl': 'Tigres',
  'tigres': 'Tigres',
  'cruz azul': 'Cruz Azul',
  'deportivo toluca fc': 'Toluca',
  'cd guadalajara': 'Chivas',
  'chivas': 'Chivas',
};

// Trajetórias cronológicas exatas consagradas dos maiores craques da Série A
const EXACT_CAREER_OVERRIDES = {
  'gabigol': ['Santos', 'Inter de Milão', 'Benfica', 'Santos', 'Flamengo', 'Cruzeiro', 'Santos'],
  'gabriel barbosa': ['Santos', 'Inter de Milão', 'Benfica', 'Santos', 'Flamengo', 'Cruzeiro', 'Santos'],
  'neymar jr': ['Santos', 'Barcelona', 'Paris Saint-Germain', 'Al-Hilal', 'Santos'],
  'neymar': ['Santos', 'Barcelona', 'Paris Saint-Germain', 'Al-Hilal', 'Santos'],
  'arrascaeta': ['Defensor Sporting', 'Cruzeiro', 'Flamengo'],
  'giorgian de arrascaeta': ['Defensor Sporting', 'Cruzeiro', 'Flamengo'],
  'hulk': ['Vitória', 'Kawasaki Frontale', 'Consadole Sapporo', 'Tokyo Verdy', 'Porto', 'Zenit', 'Shanghai Port', 'Atlético-MG', 'Fluminense'],
  'thiago silva': ['Juventude', 'Porto', 'Fluminense', 'Milan', 'Paris Saint-Germain', 'Chelsea', 'Fluminense'],
  'paulo henrique ganso': ['Santos', 'São Paulo', 'Sevilla', 'Amiens', 'Fluminense'],
  'ganso': ['Santos', 'São Paulo', 'Sevilla', 'Amiens', 'Fluminense'],
  'lucas moura': ['São Paulo', 'Paris Saint-Germain', 'Tottenham', 'São Paulo'],
  'cássio': ['Grêmio', 'PSV', 'Sparta Rotterdam', 'Corinthians', 'Cruzeiro'],
  'everton ribeiro': ['Corinthians', 'São Caetano', 'Coritiba', 'Cruzeiro', 'Al-Ahli', 'Flamengo', 'Bahia'],
  'weverton': ['Corinthians', 'América-RN', 'Botafogo-SP', 'Portuguesa', 'Athletico-PR', 'Palmeiras', 'Grêmio'],
  'dudu': ['Cruzeiro', 'Coritiba', 'Dínamo de Kiev', 'Grêmio', 'Palmeiras', 'Al-Duhail', 'Palmeiras', 'Athletico-PR'],
  'gustavo scarpa': ['Fluminense', 'Red Bull Brasil', 'Palmeiras', 'Nottingham Forest', 'Olympiacos', 'Atlético-MG'],
  'pedro': ['Fluminense', 'Fiorentina', 'Flamengo'],
  'bruno henrique': ['Itumbiara', 'Goiás', 'Wolfsburg', 'Santos', 'Flamengo'],
  'gerson': ['Fluminense', 'Roma', 'Fiorentina', 'Flamengo', 'Olympique de Marselha', 'Cruzeiro'],
  'felipe melo': ['Flamengo', 'Cruzeiro', 'Grêmio', 'Mallorca', 'Racing Santander', 'Almería', 'Fiorentina', 'Juventus', 'Galatasaray', 'Inter de Milão', 'Palmeiras', 'Fluminense'],
  'david luiz': ['Vitória', 'Benfica', 'Chelsea', 'Paris Saint-Germain', 'Arsenal', 'Flamengo'],
  'rafinha': ['Coritiba', 'Schalke 04', 'Genoa', 'Bayern de Munique', 'Flamengo', 'Olympiacos', 'Grêmio', 'São Paulo'],
  'willian bigode': ['Guarani', 'Athletico-PR', 'Vila Nova', 'Figueirense', 'Corinthians', 'Metalist', 'Cruzeiro', 'Palmeiras', 'Fluminense', 'Athletico-PR', 'Santos'],
  'philippe coutinho': ['Vasco', 'Inter de Milão', 'Espanyol', 'Liverpool', 'Barcelona', 'Bayern de Munique', 'Aston Villa', 'Al-Duhail', 'Vasco'],
  'coutinho': ['Vasco', 'Inter de Milão', 'Espanyol', 'Liverpool', 'Barcelona', 'Bayern de Munique', 'Aston Villa', 'Al-Duhail', 'Vasco'],
  'marcos rocha': ['Atlético-MG', 'América-MG', 'Ponte Preta', 'Palmeiras'],
  'mayke': ['Cruzeiro', 'Palmeiras'],
  'raphael veiga': ['Coritiba', 'Athletico-PR', 'Palmeiras'],
  'rony': ['Remo', 'Cruzeiro', 'Náutico', 'Albirex Niigata', 'Athletico-PR', 'Palmeiras'],
  'everson': ['São Paulo', 'Ceará', 'Santos', 'Atlético-MG'],
  'guilherme arana': ['Corinthians', 'Sevilla', 'Atalanta', 'Atlético-MG'],
  'fábio': ['Vasco', 'Cruzeiro', 'Fluminense'],
  'germán cano': ['Lanús', 'Chacarita Juniors', 'Colón', 'Deportivo Pereira', 'Nacional-PAR', 'Independiente Medellín', 'Pachuca', 'León', 'Vasco', 'Fluminense'],
  'fagner': ['Corinthians', 'PSV', 'Vasco', 'Wolfsburg', 'Corinthians'],
  'geromel': ['Chaves', 'Vitória de Guimarães', 'Colônia', 'Mallorca', 'Grêmio'],
  'kannemann': ['San Lorenzo', 'Atlas', 'Grêmio'],
  'alan patrick': ['Santos', 'Shakhtar Donetsk', 'Internacional', 'Palmeiras', 'Flamengo', 'Internacional'],
};

function normalizeClubName(raw) {
  if (!raw) return '';
  const trimmed = raw.trim();
  const lower = trimmed.toLowerCase();

  if (CLUB_CANONICAL[lower]) {
    return CLUB_CANONICAL[lower];
  }

  const clean = trimmed
    .replace(/\s+(Futebol Clube|Foot-Ball Club|Football Club|Esporte Clube|Sporting Club|Sport Club)\b/i, '')
    .replace(/\s+(FC|EC|SC|AC|CF|CA|SE|CR|CD)\b/i, '')
    .replace(/^(FC|EC|SC|AC|CF|CA|SE|CR|CD)\s+/i, '')
    .replace(/\s*\([^)]*\)/g, '')
    .trim();

  const cleanLower = clean.toLowerCase();
  if (CLUB_CANONICAL[cleanLower]) {
    return CLUB_CANONICAL[cleanLower];
  }

  return clean || trimmed;
}

function isYouthOrB(raw) {
  if (!raw) return true;
  const t = raw.trim();
  const lower = t.toLowerCase();

  if (
    lower.includes('sem clube') ||
    lower.includes('without club') ||
    lower.includes('unknown') ||
    lower.includes('desconhecido') ||
    lower === '-'
  ) {
    return true;
  }

  if (/\bU[12]\d\b/i.test(t)) return true;
  if (/\bsub-?[12]\d\b/i.test(t)) return true;
  if (/\b(youth|jgd|junioren|nachwuchs|academy|base)\b/i.test(t)) return true;
  if (/\(-20\d\d\)/i.test(t)) return true;

  if (/\s+B\b/i.test(t)) return true;
  if (/\s+II\b/i.test(t)) return true;

  return false;
}

function cleanCareer(teams, currentClub, playerName) {
  const pNameLower = playerName.trim().toLowerCase();
  if (EXACT_CAREER_OVERRIDES[pNameLower]) {
    return [...EXACT_CAREER_OVERRIDES[pNameLower]];
  }

  if (!Array.isArray(teams)) return currentClub ? [currentClub] : [];

  const cleaned = [];
  for (const t of teams) {
    if (isYouthOrB(t)) continue;
    const norm = normalizeClubName(t);
    if (!norm) continue;

    // Evita repetições consecutivas imediatas
    if (cleaned.length === 0 || cleaned[cleaned.length - 1] !== norm) {
      cleaned.push(norm);
    }
  }

  if (cleaned.length === 0 && currentClub) {
    cleaned.push(currentClub);
  }

  if (currentClub && cleaned[cleaned.length - 1] !== currentClub) {
    cleaned.push(currentClub);
  }

  return cleaned;
}

// 2. Mapeamento Consolidado de Craques e Campeões (Títulos Oficiais)
const KNOWN_TROPHIES = {
  // FLAMENGO
  'gabigol': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'gabriel barbosa': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'arrascaeta': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'giorgian de arrascaeta': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'bruno henrique': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'pedro': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'gerson': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'nicolás de la cruz': { brasileirao: false, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'agustín rossi': { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: true },
  'léo pereira': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: true },
  'léo ortiz': { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'ayrton lucas': { brasileirao: false, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'alex sandro': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'fabrício bruno': { brasileirao: false, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'allan': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'erick pulgar': { brasileirao: false, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'luiz araújo': { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'everton cebolinha': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'david luiz': { brasileirao: false, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'michael': { brasileirao: true, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'matheus cunha': { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'wesley': { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'guillermo varela': { brasileirao: false, copaDoBrasil: true, libertadores: true, sulamericana: false },

  // PALMEIRAS
  'weverton': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'gustavo gómez': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'murilo': { brasileirao: true, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'marcos rocha': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'mayke': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'joaquín piquerez': { brasileirao: true, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'piquerez': { brasileirao: true, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'zé rafael': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'gabriel menino': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'richard ríos': { brasileirao: true, copaDoBrasil: false, libertadores: false, sulamericana: false },
  'raphael veiga': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: true },
  'dudu': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'rony': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: true },
  'flaco lópez': { brasileirao: true, copaDoBrasil: false, libertadores: false, sulamericana: false },
  'josé manuel lópez': { brasileirao: true, copaDoBrasil: false, libertadores: false, sulamericana: false },
  'marcelo lomba': { brasileirao: true, copaDoBrasil: true, libertadores: false, sulamericana: false },

  // ATLÉTICO-MG
  'everson': { brasileirao: true, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'junior alonso': { brasileirao: true, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'guilherme arana': { brasileirao: true, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'otávio': { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: true },
  'matías zaracho': { brasileirao: true, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'zaracho': { brasileirao: true, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'gustavo scarpa': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'bernard': { brasileirao: false, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'hulk': { brasileirao: true, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'deyverson': { brasileirao: true, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'igor rabello': { brasileirao: true, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'alan kardec': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'mariano': { brasileirao: true, copaDoBrasil: true, libertadores: false, sulamericana: false },

  // BOTAFOGO
  'bastos': { brasileirao: true, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'alexander barboza': { brasileirao: true, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'vitinho': { brasileirao: true, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'cuiabano': { brasileirao: true, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'alex telles': { brasileirao: true, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'marlon freitas': { brasileirao: true, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'gregore': { brasileirao: true, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'allan loureiro': { brasileirao: true, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'carlos eduardo': { brasileirao: true, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'thiago almada': { brasileirao: true, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'luiz henrique': { brasileirao: true, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'jefferson savarino': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'savarino': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'júnior santos': { brasileirao: true, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'igor jesus': { brasileirao: true, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'tiquinho soares': { brasileirao: true, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'matheus martins': { brasileirao: true, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'tchê tchê': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'gatito fernández': { brasileirao: true, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'john': { brasileirao: true, copaDoBrasil: false, libertadores: true, sulamericana: false },

  // SÃO PAULO
  'rafael': { brasileirao: true, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'robert arboleda': { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'arboleda': { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'alan franco': { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: true },
  'rafinha': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'welington': { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'pablo maia': { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'alisson': { brasileirao: true, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'rodrigo nestor': { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'michel araújo': { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'luciano': { brasileirao: true, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'jonathan calleri': { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'calleri': { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'lucas moura': { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: true },
  'wellington rato': { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'jandrei': { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: false },

  // FLUMINENSE
  'fábio': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'samuel xavier': { brasileirao: false, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'thiago silva': { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'felipe melo': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'diogo barbosa': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'martinelli': { brasileirao: false, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'matheus martinelli': { brasileirao: false, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'paulo henrique ganso': { brasileirao: false, copaDoBrasil: true, libertadores: true, sulamericana: true },
  'ganso': { brasileirao: false, copaDoBrasil: true, libertadores: true, sulamericana: true },
  'jhon arias': { brasileirao: false, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'keno': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'germán cano': { brasileirao: false, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'cano': { brasileirao: false, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'john kennedy': { brasileirao: false, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'lima': { brasileirao: false, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'guga': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'manoel': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'renato augusto': { brasileirao: true, copaDoBrasil: true, libertadores: false, sulamericana: false },

  // CORINTHIANS
  'hugo souza': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'fagner': { brasileirao: true, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'gustavo henrique': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'ángel romero': { brasileirao: true, copaDoBrasil: false, libertadores: false, sulamericana: false },
  'romero': { brasileirao: true, copaDoBrasil: false, libertadores: false, sulamericana: false },

  // CRUZEIRO
  'cássio': { brasileirao: true, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'zé ivaldo': { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: true },
  'lucas romero': { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'lucas silva': { brasileirao: true, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'walace': { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'gabriel veron': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'lautaro díaz': { brasileirao: false, copaDoBrasil: false, libertadores: false, sulamericana: true },

  // GRÊMIO
  'geromel': { brasileirao: false, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'pedro geromel': { brasileirao: false, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'kannemann': { brasileirao: false, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'walter kannemann': { brasileirao: false, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'pepê': { brasileirao: true, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'edenilson': { brasileirao: true, copaDoBrasil: false, libertadores: false, sulamericana: false },
  'diego costa': { brasileirao: true, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'rafael cabral': { brasileirao: false, copaDoBrasil: true, libertadores: true, sulamericana: false },

  // INTERNACIONAL
  'gabriel mercado': { brasileirao: false, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'renê': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'bruno henrique': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'thiago maia': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'alan patrick': { brasileirao: false, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'wesley': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'rafael borré': { brasileirao: false, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'lucas alario': { brasileirao: false, copaDoBrasil: false, libertadores: true, sulamericana: false },

  // BAHIA
  'everton ribeiro': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'thaciano': { brasileirao: true, copaDoBrasil: false, libertadores: false, sulamericana: false },
  'ademir': { brasileirao: true, copaDoBrasil: true, libertadores: false, sulamericana: false },

  // SANTOS
  'gil': { brasileirao: true, copaDoBrasil: false, libertadores: false, sulamericana: false },
  'giuliano': { brasileirao: false, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'willian': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'willian bigode': { brasileirao: true, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'neymar': { brasileirao: false, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'neymar jr': { brasileirao: false, copaDoBrasil: true, libertadores: true, sulamericana: false },

  // VASCO
  'maicon': { brasileirao: false, copaDoBrasil: false, libertadores: false, sulamericana: true },
  'léo pelé': { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'hugo moura': { brasileirao: true, copaDoBrasil: false, libertadores: true, sulamericana: false },
  'jair': { brasileirao: true, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'david': { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'philippe coutinho': { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'coutinho': { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'alex teixeira': { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: false },

  // ATHLETICO-PR
  'thiago heleno': { brasileirao: true, copaDoBrasil: true, libertadores: false, sulamericana: true },
  'madson': { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'erick': { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: true },
  'nikão': { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: true },
  'pablo': { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: true },
  'fernandinho': { brasileirao: false, copaDoBrasil: false, libertadores: false, sulamericana: false },

  // RED BULL BRAGANTINO
  'eduardo sasha': { brasileirao: true, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'sasha': { brasileirao: true, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'matheus fernandes': { brasileirao: true, copaDoBrasil: false, libertadores: false, sulamericana: false },
  'helinho': { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: false },

  // FORTALEZA / VITÓRIA / OUTROS
  'tinga': { brasileirao: false, copaDoBrasil: true, libertadores: false, sulamericana: false },
  'marinho': { brasileirao: false, copaDoBrasil: true, libertadores: true, sulamericana: false },
  'wellington nem': { brasileirao: true, copaDoBrasil: false, libertadores: false, sulamericana: false },
};

let cleanedCareersCount = 0;
let updatedTrophiesCount = 0;

players.forEach(p => {
  // 1. Limpeza de carreira
  const oldCareer = JSON.stringify(p.careerTeams || []);
  const newCareer = cleanCareer(p.careerTeams, p.team, p.name);
  p.careerTeams = newCareer;
  if (oldCareer !== JSON.stringify(newCareer)) {
    cleanedCareersCount++;
  }

  // 2. Validação e enriquecimento de títulos
  const pNameLower = p.name.trim().toLowerCase();
  const known = KNOWN_TROPHIES[pNameLower];
  if (known) {
    p.trophies = {
      brasileirao: Boolean(p.trophies?.brasileirao || known.brasileirao),
      copaDoBrasil: Boolean(p.trophies?.copaDoBrasil || known.copaDoBrasil),
      libertadores: Boolean(p.trophies?.libertadores || known.libertadores),
      sulamericana: Boolean(p.trophies?.sulamericana || known.sulamericana),
    };
    updatedTrophiesCount++;
  } else if (!p.trophies) {
    p.trophies = {
      brasileirao: false,
      copaDoBrasil: false,
      libertadores: false,
      sulamericana: false,
    };
  }
});

fs.writeFileSync(PLAYERS_FILE, JSON.stringify(players, null, 2), 'utf-8');

console.log(`Sanitization complete!`);
console.log(`- Careers sanitized and unified: ${cleanedCareersCount} players`);
console.log(`- Trophies validated and updated: ${updatedTrophiesCount} players`);
