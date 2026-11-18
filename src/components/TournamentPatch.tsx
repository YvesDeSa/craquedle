import React, { useState } from 'react';
import type { PlayerTrophies } from '../types/player';

export type TournamentType = 'brasileirao' | 'copaDoBrasil' | 'libertadores' | 'sulamericana';

interface TournamentPatchProps {
  type: TournamentType;
  size?: number; // em pixels (opcional se className for passado)
  className?: string;
}

const TOURNAMENT_CONFIG: Record<
  TournamentType,
  {
    title: string;
    imageUrl: string;
    alt: string;
    short: string;
  }
> = {
  brasileirao: {
    title: 'Campeão Brasileiro Série A',
    imageUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c2/Campeonato_Brasileiro_S%C3%A9rie_A_logo_%282026%29.svg/250px-Campeonato_Brasileiro_S%C3%A9rie_A_logo_%282026%29.svg.png',
    alt: 'Brasileirão Série A',
    short: 'BR',
  },
  copaDoBrasil: {
    title: 'Campeão da Copa do Brasil',
    imageUrl:
      'https://thumb.wikimedia.org/wikipedia/pt/thumb/9/96/CopaDoBrasil.png/250px-CopaDoBrasil.png',
    alt: 'Copa do Brasil',
    short: 'CDB',
  },
  libertadores: {
    title: 'Campeão da CONMEBOL Libertadores',
    imageUrl:
      'https://thumb.wikimedia.org/wikipedia/pt/thumb/9/95/Conmebol_Libertadores_logo.svg/250px-Conmebol_Libertadores_logo.svg.png',
    alt: 'CONMEBOL Libertadores',
    short: 'LIB',
  },
  sulamericana: {
    title: 'Campeão da CONMEBOL Sul-Americana',
    imageUrl:
      'https://thumb.wikimedia.org/wikipedia/pt/thumb/e/e4/Conmebol_Sudamericana_logo.png/250px-Conmebol_Sudamericana_logo.png',
    alt: 'CONMEBOL Sul-Americana',
    short: 'SULA',
  },
};

export const TournamentPatch: React.FC<TournamentPatchProps> = ({
  type,
  size,
  className = '',
}) => {
  const [hasError, setHasError] = useState(false);
  const config = TOURNAMENT_CONFIG[type];

  return (
    <div
      title={config.title}
      style={size ? { width: size, height: size } : undefined}
      className={`relative flex-shrink-0 cursor-pointer transition-transform hover:scale-115 active:scale-95 flex items-center justify-center p-0.5 ${className}`}
    >
      {!hasError ? (
        <img
          src={config.imageUrl}
          alt={config.alt}
          referrerPolicy="no-referrer"
          onError={() => setHasError(true)}
          className="w-full h-full object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)] pointer-events-none select-none"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center font-display font-black text-[9px] bg-black text-[#FFDF00] uppercase border border-[#FFDF00]/40 rounded">
          {config.short}
        </div>
      )}
    </div>
  );
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
      <div className="flex flex-col items-center justify-center p-1 text-center select-none w-full h-full">
        <span className="font-display font-black text-[9px] sm:text-[10px] text-white/90 bg-black/60 px-2 py-1 border border-black uppercase tracking-wider">
          SEM TÍTULOS
        </span>
      </div>
    );
  }

  // 1 título: grande e destacado ocupando o centro da célula
  if (activeTypes.length === 1) {
    return (
      <div className="flex items-center justify-center p-1 w-full h-full">
        <TournamentPatch
          type={activeTypes[0]}
          className="w-12 h-12 sm:w-14 sm:h-14"
        />
      </div>
    );
  }

  // 2 títulos: lado a lado em tamanho generoso
  if (activeTypes.length === 2) {
    return (
      <div className="flex items-center justify-center gap-1.5 sm:gap-2 p-1 w-full h-full">
        {activeTypes.map((t) => (
          <TournamentPatch
            key={t}
            type={t}
            className="w-9 h-9 sm:w-11 sm:h-11"
          />
        ))}
      </div>
    );
  }

  // 3 ou 4 títulos: grade 2x2 grande preenchendo a célula
  return (
    <div className="grid grid-cols-2 gap-1 sm:gap-1.5 place-items-center justify-center items-center p-1 w-full max-w-[105px] sm:max-w-[125px] mx-auto h-full">
      {activeTypes.map((t) => (
        <TournamentPatch
          key={t}
          type={t}
          className="w-7 h-7 sm:w-8 sm:h-8"
        />
      ))}
    </div>
  );
};
