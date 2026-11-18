import React, { useState } from 'react';
import { User } from 'lucide-react';

export const ArcadeFilterDefs: React.FC = () => null;

interface PixelatedPlayerAvatarProps {
  id?: string | number;
  photo: string;
  name: string;
  /** Classes CSS adicionais para o container */
  className?: string;
}

const initials = (name: string) => {
  const parts = name
    .replace(/\(.*\)/, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return '??';
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
};

/**
 * Avatar do Jogador com Fallback Duplo Inteligente:
 *  1º Lugar: Pixel Art Estilizado Local (/players/pixel/{id}.png);
 *  2º Lugar: Foto Oficial Limpa do Transfermarkt;
 *  3º Lugar: Badge Arcade Retrô com Iniciais.
 */
export const PixelatedPlayerAvatar: React.FC<PixelatedPlayerAvatarProps> = ({
  id,
  photo,
  name,
  className = '',
}) => {
  const [pixelFailed, setPixelFailed] = useState(false);
  const [photoFailed, setPhotoFailed] = useState(!photo);

  const hasPixel = Boolean(id) && !pixelFailed;
  const currentSrc = hasPixel ? `/players/pixel/${id}.png` : photo;
  const isPixel = hasPixel;

  const handleImageError = () => {
    if (hasPixel) {
      // Se a arte de pixel local não existir ou falhar, faz fallback imediato para a foto oficial
      setPixelFailed(true);
    } else {
      // Se a foto oficial também falhar, exibe o fallback com iniciais
      setPhotoFailed(true);
    }
  };

  return (
    <div
      title={name}
      className={`relative w-full h-full overflow-hidden flex items-center justify-center bg-[#062c1a] select-none ${className}`}
    >
      {/* Imagem Principal (Pixel Art Local 1º Lugar, Foto Oficial 2º Lugar) */}
      {currentSrc && !photoFailed ? (
        <img
          key={currentSrc}
          src={currentSrc}
          alt={name}
          referrerPolicy="no-referrer"
          loading="lazy"
          onError={handleImageError}
          style={isPixel ? { imageRendering: 'pixelated' } : undefined}
          className={`relative z-10 w-full h-full object-contain ${
            isPixel ? '' : 'filter contrast-[1.05] saturate-[1.05]'
          }`}
        />
      ) : (
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center bg-[#062c1a] border border-[#FFDF00]/50 p-1 text-center select-none shadow-inner">
          <div className="w-6 h-6 rounded-none bg-black/40 border border-[#00DF81]/40 flex items-center justify-center mb-0.5">
            <User size={13} className="text-[#00DF81]" />
          </div>
          <span className="text-[#FFDF00] font-display font-black text-[10px] sm:text-[11px] tracking-wider drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
            {initials(name)}
          </span>
        </div>
      )}
    </div>
  );
};

export const PlayerAvatar = PixelatedPlayerAvatar;


