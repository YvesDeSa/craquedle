import React from 'react';
import type { PlayerTrophies } from '../types/player';

export type TournamentType = 'brasileirao' | 'copaDoBrasil' | 'libertadores' | 'sulamericana';

interface TournamentPatchProps {
  type: TournamentType;
  size?: number; // em pixels (ex: 34 a 42)
}

export const TournamentPatch: React.FC<TournamentPatchProps> = ({ type, size = 34 }) => {
  switch (type) {
    case 'brasileirao':
      return (
        <div
          title="Campeão Brasileiro Série A"
          className="relative flex-shrink-0 cursor-pointer transition-transform hover:scale-110 active:scale-95"
          style={{ width: size, height: size }}
        >
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]"
          >
            <defs>
              {/* Gradiente Dourado da Borda */}
              <linearGradient id="goldBorder" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF2A3" />
                <stop offset="30%" stopColor="#FFDF00" />
                <stop offset="70%" stopColor="#C69200" />
                <stop offset="100%" stopColor="#FFE552" />
              </linearGradient>

              {/* Fundo Azul Noturno CBF */}
              <radialGradient id="brBg" cx="50%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#0B2F21" />
                <stop offset="60%" stopColor="#041810" />
                <stop offset="100%" stopColor="#020B07" />
              </radialGradient>

              {/* Ouro da Taça */}
              <linearGradient id="cupGold" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#E2A900" />
                <stop offset="50%" stopColor="#FFF2A3" />
                <stop offset="100%" stopColor="#C68900" />
              </linearGradient>
            </defs>

            {/* Formato Escudo Patch */}
            <path
              d="M50 4 L88 16 C88 56 68 84 50 96 C32 84 12 56 12 16 Z"
              fill="url(#brBg)"
              stroke="url(#goldBorder)"
              strokeWidth="4"
            />

            {/* Linha de Costura Bordada Interna */}
            <path
              d="M50 9 L83 20 C83 53 65 79 50 90 C35 79 17 53 17 20 Z"
              fill="none"
              stroke="#FFDF00"
              strokeWidth="1.2"
              strokeDasharray="2.5 1.5"
              opacity="0.8"
            />

            {/* Silhueta da Taça do Brasileirão */}
            {/* Base */}
            <path d="M38 72 L62 72 L58 64 L42 64 Z" fill="url(#cupGold)" />
            {/* Haste central */}
            <path d="M46 64 L54 64 L53 48 L47 48 Z" fill="url(#cupGold)" />
            {/* Corpo / Vaso da Taça */}
            <path
              d="M34 26 C34 46 42 50 50 50 C58 50 66 46 66 26 Z"
              fill="url(#cupGold)"
            />
            {/* Alças */}
            <path
              d="M34 30 C26 32 26 44 36 44 M66 30 C74 32 74 44 64 44"
              fill="none"
              stroke="url(#cupGold)"
              strokeWidth="2.5"
            />
            {/* Esfera Central */}
            <circle cx="50" cy="36" r="3" fill="#00DF81" stroke="#000" strokeWidth="0.8" />

            {/* Faixa Inferior BRASILEIRÃO */}
            <rect x="22" y="76" width="56" height="11" rx="2" fill="#FFDF00" stroke="#000" strokeWidth="1" />
            <text
              x="50"
              y="84.5"
              textAnchor="middle"
              fill="#000"
              fontSize="7.5"
              fontWeight="900"
              fontFamily="'Chakra Petch', sans-serif"
              letterSpacing="0.5"
            >
              BRASIL
            </text>
          </svg>
        </div>
      );

    case 'copaDoBrasil':
      return (
        <div
          title="Campeão da Copa do Brasil"
          className="relative flex-shrink-0 cursor-pointer transition-transform hover:scale-110 active:scale-95"
          style={{ width: size, height: size }}
        >
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]"
          >
            <defs>
              <linearGradient id="cdbBorder" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00DF81" />
                <stop offset="50%" stopColor="#FFDF00" />
                <stop offset="100%" stopColor="#1D4ED8" />
              </linearGradient>

              <radialGradient id="cdbBg" cx="50%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#003B1E" />
                <stop offset="55%" stopColor="#001F10" />
                <stop offset="100%" stopColor="#000E07" />
              </radialGradient>

              <linearGradient id="cupSilverGold" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FFDF00" />
                <stop offset="50%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#FACC15" />
              </linearGradient>
            </defs>

            {/* Formato Escudo Pentagonal da Copa do Brasil */}
            <path
              d="M50 5 L88 18 C88 58 70 85 50 96 C30 85 12 58 12 18 Z"
              fill="url(#cdbBg)"
              stroke="url(#cdbBorder)"
              strokeWidth="4"
            />

            {/* Linha de Costura Bordada */}
            <path
              d="M50 10 L83 22 C83 54 66 80 50 90 C34 80 17 54 17 22 Z"
              fill="none"
              stroke="#00DF81"
              strokeWidth="1.2"
              strokeDasharray="2.5 1.5"
              opacity="0.8"
            />

            {/* Taça da Copa do Brasil (com formato robusto característico) */}
            <path d="M36 71 L64 71 L60 63 L40 63 Z" fill="url(#cupSilverGold)" />
            <path d="M47 63 L53 63 L53 49 L47 49 Z" fill="url(#cupSilverGold)" />
            {/* Bojo e asas largas */}
            <path
              d="M32 28 C32 46 40 50 50 50 C60 50 68 46 68 28 Z"
              fill="url(#cupSilverGold)"
            />
            {/* Alças em arco característico */}
            <path
              d="M32 32 C22 35 22 46 34 47 M68 32 C78 35 78 46 66 47"
              fill="none"
              stroke="#FFDF00"
              strokeWidth="3"
            />
            {/* Laço verde/amarelo central */}
            <circle cx="50" cy="38" r="4" fill="#1D4ED8" stroke="#FFDF00" strokeWidth="1" />

            {/* Faixa Inferior COPA DO BRASIL */}
            <rect x="18" y="75" width="64" height="12" rx="2" fill="#1D4ED8" stroke="#FFDF00" strokeWidth="1" />
            <text
              x="50"
              y="84"
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize="7"
              fontWeight="900"
              fontFamily="'Chakra Petch', sans-serif"
            >
              C. BRASIL
            </text>
          </svg>
        </div>
      );

    case 'libertadores':
      return (
        <div
          title="Campeão da CONMEBOL Libertadores"
          className="relative flex-shrink-0 cursor-pointer transition-transform hover:scale-110 active:scale-95"
          style={{ width: size, height: size }}
        >
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]"
          >
            <defs>
              <linearGradient id="libGoldBorder" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFE066" />
                <stop offset="50%" stopColor="#B38600" />
                <stop offset="100%" stopColor="#FFF2A3" />
              </linearGradient>

              <radialGradient id="libBg" cx="50%" cy="40%" r="65%">
                <stop offset="0%" stopColor="#221C11" />
                <stop offset="60%" stopColor="#120E08" />
                <stop offset="100%" stopColor="#000000" />
              </radialGradient>

              <linearGradient id="libCupGold" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#C69200" />
                <stop offset="40%" stopColor="#FFF4B8" />
                <stop offset="70%" stopColor="#FFDF00" />
                <stop offset="100%" stopColor="#9E7300" />
              </linearGradient>
            </defs>

            {/* Formato Losango / Escudo CONMEBOL Nobre */}
            <path
              d="M50 4 L90 26 C90 62 68 88 50 97 C32 88 10 62 10 26 Z"
              fill="url(#libBg)"
              stroke="url(#libGoldBorder)"
              strokeWidth="4"
            />

            {/* Costura Bordada */}
            <path
              d="M50 9 L85 28 C85 58 66 82 50 91 C34 82 15 58 15 28 Z"
              fill="none"
              stroke="#FFDF00"
              strokeWidth="1.2"
              strokeDasharray="2.5 1.5"
              opacity="0.75"
            />

            {/* Silhueta da Taça Libertadores (Jogador chutando bola no topo da esfera) */}
            {/* Base de madeira redonda */}
            <rect x="41" y="62" width="18" height="11" rx="1.5" fill="#42250F" stroke="#FFDF00" strokeWidth="0.8" />
            <line x1="41" y1="66" x2="59" y2="66" stroke="#FFDF00" strokeWidth="0.6" />
            {/* Haste prateada */}
            <path d="M46 62 L54 62 L52 46 L48 46 Z" fill="url(#libCupGold)" />
            {/* Esfera do mundo */}
            <circle cx="50" cy="40" r="8" fill="url(#libCupGold)" stroke="#000" strokeWidth="0.6" />
            {/* Jogadorzinho de bronze no topo */}
            <path d="M49 32 L51 32 L52 24 L50 22 L48 24 Z" fill="url(#libCupGold)" />
            <circle cx="50" cy="21" r="2" fill="url(#libCupGold)" />

            {/* Faixa Inferior LIBERTADORES */}
            <rect x="18" y="75" width="64" height="12" rx="2" fill="#000000" stroke="#FFDF00" strokeWidth="1.2" />
            <text
              x="50"
              y="84"
              textAnchor="middle"
              fill="#FFDF00"
              fontSize="6.8"
              fontWeight="900"
              fontFamily="'Chakra Petch', sans-serif"
              letterSpacing="0.4"
            >
              LIBERTADORES
            </text>
          </svg>
        </div>
      );

    case 'sulamericana':
      return (
        <div
          title="Campeão da CONMEBOL Sul-Americana"
          className="relative flex-shrink-0 cursor-pointer transition-transform hover:scale-110 active:scale-95"
          style={{ width: size, height: size }}
        >
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]"
          >
            <defs>
              <linearGradient id="sulaSilverBorder" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="40%" stopColor="#94A3B8" />
                <stop offset="80%" stopColor="#CBD5E1" />
                <stop offset="100%" stopColor="#FFDF00" />
              </linearGradient>

              <radialGradient id="sulaBg" cx="50%" cy="35%" r="70%">
                <stop offset="0%" stopColor="#0F2B5C" />
                <stop offset="60%" stopColor="#081838" />
                <stop offset="100%" stopColor="#020919" />
              </radialGradient>

              <linearGradient id="sulaCupSilver" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#94A3B8" />
                <stop offset="50%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#64748B" />
              </linearGradient>
            </defs>

            {/* Formato Escudo Oficial Sul-Americana */}
            <path
              d="M50 4 L89 20 C89 60 69 86 50 96 C31 86 11 60 11 20 Z"
              fill="url(#sulaBg)"
              stroke="url(#sulaSilverBorder)"
              strokeWidth="4"
            />

            {/* Linha de Costura Bordada */}
            <path
              d="M50 9 L84 24 C84 55 66 80 50 89 C34 80 16 55 16 24 Z"
              fill="none"
              stroke="#38BDF8"
              strokeWidth="1.2"
              strokeDasharray="2.5 1.5"
              opacity="0.8"
            />

            {/* Silhueta da Taça Sul-Americana (Prata com alças anguladas características) */}
            {/* Base redonda de madeira */}
            <path d="M38 72 L62 72 L58 64 L42 64 Z" fill="#334155" stroke="#FFFFFF" strokeWidth="0.8" />
            {/* Coluna prateada */}
            <path d="M47 64 L53 64 L52 48 L48 48 Z" fill="url(#sulaCupSilver)" />
            {/* Bojo clássico cônico */}
            <path
              d="M34 26 L66 26 L58 48 L42 48 Z"
              fill="url(#sulaCupSilver)"
            />
            {/* Alças angulares finas de prata */}
            <path
              d="M34 29 C24 33 25 45 42 47 M66 29 C76 33 75 45 58 47"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2.2"
            />
            {/* Faixa dourada no meio */}
            <line x1="39" y1="36" x2="61" y2="36" stroke="#FFDF00" strokeWidth="2" />

            {/* Faixa Inferior SUL-AMERICANA */}
            <rect x="18" y="75" width="64" height="12" rx="2" fill="#0284C7" stroke="#FFFFFF" strokeWidth="1" />
            <text
              x="50"
              y="84"
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize="6.8"
              fontWeight="900"
              fontFamily="'Chakra Petch', sans-serif"
              letterSpacing="0.3"
            >
              SUL-AMERICANA
            </text>
          </svg>
        </div>
      );

    default:
      return null;
  }
};

interface TournamentPatchGridProps {
  trophies: PlayerTrophies;
}

export const TournamentPatchGrid: React.FC<TournamentPatchGridProps> = ({ trophies }) => {
  const activeTypes: TournamentType[] = [];
  if (trophies.brasileirao) activeTypes.push('brasileirao');
  if (trophies.copaDoBrasil) activeTypes.push('copaDoBrasil');
  if (trophies.libertadores) activeTypes.push('libertadores');
  if (trophies.sulamericana) activeTypes.push('sulamericana');

  if (activeTypes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-1 text-center select-none">
        <span className="font-display font-black text-[10px] sm:text-xs text-white/90 bg-black/60 px-2 py-0.5 border border-black uppercase tracking-wider">
          SEM TÍTULOS
        </span>
      </div>
    );
  }

  // Se tiver 1 título: exibe grande centralizado
  if (activeTypes.length === 1) {
    return (
      <div className="flex items-center justify-center p-0.5">
        <TournamentPatch type={activeTypes[0]} size={42} />
      </div>
    );
  }

  // Se tiver 2 a 4 títulos: Gradezinha 2x2 elegante
  return (
    <div className="grid grid-cols-2 gap-1 place-items-center justify-center items-center p-0.5 max-w-[85px] mx-auto">
      {activeTypes.map((t) => (
        <TournamentPatch key={t} type={t} size={33} />
      ))}
    </div>
  );
};
