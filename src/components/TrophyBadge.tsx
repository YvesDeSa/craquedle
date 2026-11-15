import React from 'react';
import { Trophy, Award, ShieldAlert } from 'lucide-react';

export type TrophyType = 'BR' | 'CDB' | 'LIB';

interface TrophyBadgeProps {
  type: TrophyType;
  size?: 'sm' | 'md';
}

export const TrophyBadge: React.FC<TrophyBadgeProps> = ({ type, size = 'md' }) => {
  const isSm = size === 'sm';

  switch (type) {
    case 'BR':
      return (
        <div
          title="Campeão do Brasileirão Série A"
          className={`inline-flex items-center gap-1 font-display font-black border border-black shadow-sm ${
            isSm
              ? 'px-1.5 py-0.5 text-[9px] bg-gradient-to-r from-[#FFDF00] to-[#00DF81] text-black'
              : 'px-2 py-1 text-xs bg-gradient-to-r from-[#FFDF00] via-[#00DF81] to-[#FFDF00] text-black'
          }`}
        >
          <Trophy size={isSm ? 10 : 13} className="text-black fill-black" />
          <span>BR</span>
        </div>
      );

    case 'CDB':
      return (
        <div
          title="Campeão da Copa do Brasil"
          className={`inline-flex items-center gap-1 font-display font-black border border-black shadow-sm ${
            isSm
              ? 'px-1.5 py-0.5 text-[9px] bg-gradient-to-r from-[#1D4ED8] to-[#FFDF00] text-white'
              : 'px-2 py-1 text-xs bg-gradient-to-r from-[#1D4ED8] to-[#FACC15] text-white'
          }`}
        >
          <Award size={isSm ? 10 : 13} className="text-yellow-300" />
          <span className="text-white drop-shadow">CdB</span>
        </div>
      );

    case 'LIB':
      return (
        <div
          title="Campeão da CONMEBOL Libertadores"
          className={`inline-flex items-center gap-1 font-display font-black border border-black shadow-sm ${
            isSm
              ? 'px-1.5 py-0.5 text-[9px] bg-gradient-to-r from-slate-200 to-amber-300 text-black'
              : 'px-2 py-1 text-xs bg-gradient-to-r from-slate-100 via-amber-200 to-amber-400 text-black'
          }`}
        >
          <Trophy size={isSm ? 10 : 13} className="text-black" />
          <span>LIB</span>
        </div>
      );

    default:
      return null;
  }
};

interface TrophyGroupProps {
  trophies: {
    brasileirao: boolean;
    copaDoBrasil: boolean;
    libertadores: boolean;
  };
  size?: 'sm' | 'md';
}

export const TrophyGroup: React.FC<TrophyGroupProps> = ({ trophies, size = 'md' }) => {
  const hasAny = trophies.brasileirao || trophies.copaDoBrasil || trophies.libertadores;

  if (!hasAny) {
    return (
      <div className="inline-flex items-center gap-1 text-[10px] font-display text-gray-400 bg-black/40 px-2 py-0.5 border border-black/60">
        <ShieldAlert size={12} className="text-gray-400" />
        <span>Nenhum</span>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-1">
      {trophies.brasileirao && <TrophyBadge type="BR" size={size} />}
      {trophies.copaDoBrasil && <TrophyBadge type="CDB" size={size} />}
      {trophies.libertadores && <TrophyBadge type="LIB" size={size} />}
    </div>
  );
};
