import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

export const Legend: React.FC = () => {
  return (
    <div className="w-full bg-[#04160E] border border-[#FFDF00]/50 px-2.5 py-1 shadow-arcade-sm my-1 flex flex-wrap items-center justify-between gap-1 text-[10px] sm:text-[11px] font-display">
      <div className="flex items-center gap-1.5">
        <div className="w-2.5 h-2.5 bg-[#22C55E] border border-black" />
        <span className="text-gray-200">
          <strong className="text-white">Verde:</strong> Exato
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        <div className="w-2.5 h-2.5 bg-[#EAB308] border border-black" />
        <span className="text-gray-200">
          <strong className="text-white">Amarelo:</strong> Parcial (Título)
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        <div className="w-2.5 h-2.5 bg-[#EF4444] border border-black" />
        <span className="text-gray-200">
          <strong className="text-white">Vermelho:</strong> Incorreto
        </span>
      </div>

      <div className="flex items-center gap-1">
        <div className="flex items-center text-[#FFDF00]">
          <ArrowUp size={12} strokeWidth={3} />
          <ArrowDown size={12} strokeWidth={3} />
        </div>
        <span className="text-gray-200">
          <strong className="text-white">Setas:</strong> Idade / Altura (Maior/Menor)
        </span>
      </div>
    </div>
  );
};
