import React from 'react';
import { X, ArrowUp, ArrowDown } from 'lucide-react';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-[#0A0B1E] border-4 border-[#6D28D9] p-6 shadow-arcade-lg text-white max-h-[90vh] overflow-y-auto">
        {/* Cantoneiras Pixel */}
        <div className="absolute top-1 left-1 w-3 h-3 bg-[#B8FF01]" />
        <div className="absolute top-1 right-1 w-3 h-3 bg-[#B8FF01]" />
        <div className="absolute bottom-1 left-1 w-3 h-3 bg-[#B8FF01]" />
        <div className="absolute bottom-1 right-1 w-3 h-3 bg-[#B8FF01]" />

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white p-1 hover:bg-[#15193B] border border-transparent hover:border-black transition-all cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-5">
          <span className="font-arcade text-[10px] text-[#B8FF01] tracking-widest">
            ❖ MANUAL DO JOGADOR ❖
          </span>
          <h2 className="font-display font-black text-2xl sm:text-3xl italic tracking-tight text-white mt-1">
            COMO JOGAR?
          </h2>
        </div>

        <div className="space-y-4 text-xs sm:text-sm font-sans text-gray-200">
          <p>
            Adivinhe o <strong>craque secreto do Brasileirão Série A</strong> de hoje! A cada chute, as cores dos blocos revelam pistas sobre o jogador secreto:
          </p>

          {/* Exemplos de cores */}
          <div className="space-y-2 font-display">
            <div className="flex items-center gap-3 bg-[#08091A] p-2 border border-black">
              <div className="w-8 h-8 bg-[#22C55E] flex items-center justify-center font-bold text-white border border-black">
                ✓
              </div>
              <div>
                <strong className="text-[#22C55E]">VERDE (CORRETO):</strong> O atributo coincide perfeitamente com o jogador secreto.
              </div>
            </div>

            <div className="flex items-center gap-3 bg-[#08091A] p-2 border border-black">
              <div className="w-8 h-8 bg-[#EAB308] flex items-center justify-center font-bold text-black border border-black">
                ~
              </div>
              <div>
                <strong className="text-[#EAB308]">AMARELO (PARCIAL):</strong>
                <ul className="list-disc list-inside text-xs text-gray-300 mt-0.5">
                  <li><strong>Idade:</strong> Diferença de apenas 1 ou 2 anos.</li>
                  <li><strong>Títulos:</strong> Tem pelo menos 1 título em comum.</li>
                </ul>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-[#08091A] p-2 border border-black">
              <div className="w-8 h-8 bg-[#EF4444] flex items-center justify-center font-bold text-white border border-black">
                ✕
              </div>
              <div>
                <strong className="text-[#EF4444]">VERMELHO (INCORRETO):</strong> Nenhuma correspondência neste atributo.
              </div>
            </div>

            <div className="flex items-center gap-3 bg-[#08091A] p-2 border border-black">
              <div className="w-8 h-8 bg-[#12163A] flex items-center justify-center text-[#38BDF8] border border-black">
                <ArrowUp size={16} />
                <ArrowDown size={16} />
              </div>
              <div>
                <strong className="text-[#38BDF8]">SETAS DE IDADE:</strong>
                <div className="text-xs text-gray-300 mt-0.5">
                  <ArrowUp size={12} className="inline mr-1 text-[#38BDF8]" /> Segredo é <strong>mais velho</strong>.<br />
                  <ArrowDown size={12} className="inline mr-1 text-[#38BDF8]" /> Segredo é <strong>mais novo</strong>.
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#12163A] border-l-4 border-[#B8FF01] p-3 text-xs">
            <strong>Dica Pro:</strong> Use o autocomplete com foto e nome. Chutes livres aleatórios não são permitidos para garantir a fidelidade às estatísticas reais!
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-2.5 bg-[#B8FF01] hover:bg-[#a6e600] text-black font-arcade text-xs border-2 border-black shadow-arcade-sm transition-all cursor-pointer font-bold"
        >
          ENTENDI, BORA JOGAR!
        </button>
      </div>
    </div>
  );
};
