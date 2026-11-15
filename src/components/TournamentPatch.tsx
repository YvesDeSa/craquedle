import React, { useState } from 'react';
import type { PlayerTrophies } from '../types/player';

export type TournamentType = 'brasileirao' | 'copaDoBrasil' | 'libertadores' | 'sulamericana';

interface TournamentPatchProps {
  type: TournamentType;
  size?: number; // em pixels (ex: 32 a 42)
}

const PATCH_CONFIG: Record<
  TournamentType,
  {
    title: string;
    imageUrl: string;
    alt: string;
    cropClass: string;
  }
> = {
  brasileirao: {
    title: 'Campeão Brasileiro Série A',
    imageUrl:
      'https://images.tcdn.com.br/img/img_prod/1323066/patch_participao_brasileiro_2026_oficial_1_20260420110457_f931ffa4e1bf.png',
    alt: 'Patch Brasileirão Série A',
    // Recorte para focar no escudo/taça e ocultar o ano na base
    cropClass: 'w-full h-[126%] object-cover object-top -mb-2 scale-105',
  },
  copaDoBrasil: {
    title: 'Campeão da Copa do Brasil',
    imageUrl:
      'https://images.tcdn.com.br/img/img_prod/1323066/patch_participao_copa_do_brasil_2026_1_20260420172538_1364cba4ea5b.png',
    alt: 'Patch Copa do Brasil',
    cropClass: 'w-full h-[126%] object-cover object-top -mb-2 scale-105',
  },
  libertadores: {
    title: 'Campeão da CONMEBOL Libertadores',
    imageUrl:
      'https://images.tcdn.com.br/img/img_prod/1323066/patch_participacao_libertadores_2022_oficial_conmebol_59_1_dc31216c6c3d1dd9a1956849ea0e26cc.png',
    alt: 'Patch CONMEBOL Libertadores',
    cropClass: 'w-full h-[126%] object-cover object-top -mb-2 scale-105',
  },
  sulamericana: {
    title: 'Campeão da CONMEBOL Sul-Americana',
    imageUrl:
      'https://images.tcdn.com.br/img/img_prod/1323066/patch_participacao_sudamericana_2022_oficial_conmebol_51_1_378ec508bad0536558e76f47925555a3.jpg',
    alt: 'Patch CONMEBOL Sul-Americana',
    cropClass: 'w-full h-[126%] object-cover object-top -mb-2 scale-105',
  },
};

export const TournamentPatch: React.FC<TournamentPatchProps> = ({ type, size = 34 }) => {
  const [hasError, setHasError] = useState(false);
  const config = PATCH_CONFIG[type];

  return (
    <div
      title={config.title}
      style={{ width: size, height: size }}
      className="relative overflow-hidden flex-shrink-0 cursor-pointer rounded-sm border border-black/40 shadow-sm transition-transform hover:scale-110 active:scale-95 bg-black/30 flex items-center justify-center"
    >
      {!hasError ? (
        <img
          src={config.imageUrl}
          alt={config.alt}
          referrerPolicy="no-referrer"
          onError={() => setHasError(true)}
          className={`${config.cropClass} drop-shadow-[0_2px_3px_rgba(0,0,0,0.85)] pointer-events-none select-none`}
        />
      ) : (
        // Fallback estilizado em caso de falha de carregamento
        <div className="w-full h-full flex items-center justify-center font-display font-black text-[9px] bg-black text-[#FFDF00] uppercase border border-[#FFDF00]/40">
          {type === 'brasileirao'
            ? 'BR'
            : type === 'copaDoBrasil'
            ? 'CDB'
            : type === 'libertadores'
            ? 'LIB'
            : 'SULA'}
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
      <div className="flex flex-col items-center justify-center p-1 text-center select-none">
        <span className="font-display font-black text-[9px] sm:text-[10px] text-white/90 bg-black/60 px-1.5 py-0.5 border border-black uppercase tracking-wider">
          SEM TÍTULOS
        </span>
      </div>
    );
  }

  // Se tiver 1 título: exibe grande centralizado
  if (activeTypes.length === 1) {
    return (
      <div className="flex items-center justify-center p-0.5">
        <TournamentPatch type={activeTypes[0]} size={40} />
      </div>
    );
  }

  // Se tiver de 2 a 4 títulos: Grade 2x2
  return (
    <div className="grid grid-cols-2 gap-1 place-items-center justify-center items-center p-0.5 max-w-[85px] mx-auto">
      {activeTypes.map((t) => (
        <TournamentPatch key={t} type={t} size={31} />
      ))}
    </div>
  );
};
