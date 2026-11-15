import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

export const Legend: React.FC = () => {
  return (
    <div className="w-full bg-[#08091A] border-2 border-[#6D28D9] p-3 shadow-arcade-sm my-3">
      <div className="font-arcade text-[10px] text-[#B8FF01] mb-2 text-center">
        ❖ LEGENDA DE CORES & DICAS ❖
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-display">
        {/* Verde */}
        <div className="flex items-center gap-2 bg-[#12163A] p-2 border border-black">
          <div className="w-4 h-4 bg-[#22C55E] border border-black flex-shrink-0" />
          <span className="text-gray-200 text-xs">
            <strong className="text-white">Verde:</strong> Exato
          </span>
        </div>

        {/* Amarelo */}
        <div className="flex items-center gap-2 bg-[#12163A] p-2 border border-black">
          <div className="w-4 h-4 bg-[#EAB308] border border-black flex-shrink-0" />
          <span className="text-gray-200 text-xs">
            <strong className="text-white">Amarelo:</strong> Parcial (±2 anos / Título)
          </span>
        </div>

        {/* Vermelho */}
        <div className="flex items-center gap-2 bg-[#12163A] p-2 border border-black">
          <div className="w-4 h-4 bg-[#EF4444] border border-black flex-shrink-0" />
          <span className="text-gray-200 text-xs">
            <strong className="text-white">Vermelho:</strong> Incorreto
          </span>
        </div>

        {/* Setas */}
        <div className="flex items-center gap-2 bg-[#12163A] p-2 border border-black">
          <div className="flex items-center text-[#38BDF8]">
            <ArrowUp size={14} strokeWidth={3} />
            <ArrowDown size={14} strokeWidth={3} />
          </div>
          <span className="text-gray-200 text-xs">
            <strong className="text-white">Setas:</strong> Segredo é Maior/Menor
          </span>
        </div>
      </div>
    </div>
  );
};
