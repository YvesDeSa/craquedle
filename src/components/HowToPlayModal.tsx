import React from 'react';
import { X, ArrowUp, ArrowDown } from 'lucide-react';
import { TrophyBadge } from './TrophyBadge';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-[#061A12] border-4 border-[#FFDF00] p-5 shadow-arcade-lg text-white max-h-[85vh] overflow-y-auto">
        {/* Cantoneiras Pixel */}
        <div className="absolute top-1 left-1 w-3 h-3 bg-[#00DF81]" />
        <div className="absolute top-1 right-1 w-3 h-3 bg-[#FFFFFF]" />
        <div className="absolute bottom-1 left-1 w-3 h-3 bg-[#FFFFFF]" />
        <div className="absolute bottom-1 right-1 w-3 h-3 bg-[#00DF81]" />

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white p-1 hover:bg-[#0A2619] border border-transparent hover:border-black transition-all cursor-pointer"
        >
          <X size={18} />
        </button>

        <div className="text-center mb-4">
          <span className="font-arcade text-[10px] text-[#00DF81] tracking-widest">
            ❖ MANUAL DO CRAQUEDLE ❖
          </span>
          <h2 className="font-display font-black text-2xl sm:text-3xl italic tracking-tight text-white mt-0.5">
            COMO JOGAR?
          </h2>
        </div>

        <div className="space-y-3 text-xs font-sans text-gray-200">
          <p>
            Adivinhe o <strong>craque secreto do Brasileirão Série A</strong> de hoje! A cada chute selecionado no campo de busca, os blocos coloridos revelam pistas sobre o jogador secreto:
          </p>

          {/* Exemplos de cores */}
          <div className="space-y-1.5 font-display">
            <div className="flex items-center gap-2.5 bg-[#04160E] p-2 border border-black">
              <div className="w-7 h-7 bg-[#22C55E] flex items-center justify-center font-bold text-white border border-black text-sm">
                ✓
              </div>
              <div>
                <strong className="text-[#22C55E]">VERDE (CORRETO):</strong> O atributo coincide perfeitamente com o jogador secreto.
              </div>
            </div>

            <div className="flex items-center gap-2.5 bg-[#04160E] p-2 border border-black">
              <div className="w-7 h-7 bg-[#EAB308] flex items-center justify-center font-bold text-black border border-black text-sm">
                ~
              </div>
              <div>
                <strong className="text-[#EAB308]">AMARELO (PARCIAL):</strong>
                <div className="text-[11px] text-gray-300">
                  • <strong>Idade:</strong> Diferença de apenas 1 ou 2 anos.<br />
                  • <strong>Títulos:</strong> Tem pelo menos 1 troféu em comum.
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 bg-[#04160E] p-2 border border-black">
              <div className="w-7 h-7 bg-[#EF4444] flex items-center justify-center font-bold text-white border border-black text-sm">
                ✕
              </div>
              <div>
                <strong className="text-[#EF4444]">VERMELHO (INCORRETO):</strong> Nenhuma correspondência neste atributo.
              </div>
            </div>

            <div className="flex items-center gap-2.5 bg-[#04160E] p-2 border border-black">
              <div className="w-7 h-7 bg-[#0A2619] flex items-center justify-center text-[#FFDF00] border border-black">
                <ArrowUp size={14} />
                <ArrowDown size={14} />
              </div>
              <div>
                <strong className="text-[#FFDF00]">SETAS DE IDADE:</strong>
                <div className="text-[11px] text-gray-300">
                  <ArrowUp size={11} className="inline mr-1 text-[#FFDF00]" /> Segredo é <strong>mais velho</strong>.<br />
                  <ArrowDown size={11} className="inline mr-1 text-[#FFDF00]" /> Segredo é <strong>mais novo</strong>.
                </div>
              </div>
            </div>
          </div>

          {/* Troféus explicados */}
          <div className="bg-[#04160E] p-2.5 border border-[#FFDF00]/30 space-y-1.5">
            <strong className="text-[#FFDF00] font-display">SELO DOS TROFÉUS CONSIDERADOS:</strong>
            <div className="flex flex-wrap gap-2 text-[11px] font-display">
              <div className="flex items-center gap-1">
                <TrophyBadge type="BR" size="sm" />
                <span>Brasileirão Série A</span>
              </div>
              <div className="flex items-center gap-1">
                <TrophyBadge type="CDB" size="sm" />
                <span>Copa do Brasil</span>
              </div>
              <div className="flex items-center gap-1">
                <TrophyBadge type="LIB" size="sm" />
                <span>Libertadores</span>
              </div>
            </div>
          </div>

          <div className="bg-[#04160E] border-l-4 border-[#00DF81] p-2.5 text-[11px]">
            <strong>Dica Pro:</strong> Digite o nome do jogador e clique no item correspondente na lista com foto e bandeira. Chutes avulsos sem seleção são bloqueados!
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 py-2 bg-[#FFDF00] hover:bg-[#e6c900] text-black font-display font-black text-xs border-2 border-black shadow-arcade-sm transition-all cursor-pointer"
        >
          ENTENDI, BORA JOGAR!
        </button>
      </div>
    </div>
  );
};
