// Mapeamento de nacionalidades para códigos ISO de bandeiras (FlagCDN)
const COUNTRY_FLAG_MAP: Record<string, string> = {
  brasil: 'br',
  brazil: 'br',
  argentina: 'ar',
  uruguai: 'uy',
  uruguay: 'uy',
  colombia: 'co',
  colômbia: 'co',
  paraguai: 'py',
  paraguay: 'py',
  equador: 'ec',
  ecuador: 'ec',
  chile: 'cl',
  venezuela: 've',
  peru: 'pe',
  holanda: 'nl',
  netherlands: 'nl',
  dinamarca: 'dk',
  denmark: 'dk',
  portugal: 'pt',
  espanha: 'es',
  spain: 'es',
  frança: 'fr',
  france: 'fr',
  angola: 'ao',
  congo: 'cd',
  'república democrática do congo': 'cd',
  italia: 'it',
  itália: 'it',
  bolivia: 'bo',
  bolívia: 'bo',
};

export function getCountryFlagUrl(nationality: string): string {
  if (!nationality) return 'https://flagcdn.com/w40/br.png';
  const clean = nationality.trim().toLowerCase();
  const code = COUNTRY_FLAG_MAP[clean] || 'br';
  return `https://flagcdn.com/w40/${code}.png`;
}
