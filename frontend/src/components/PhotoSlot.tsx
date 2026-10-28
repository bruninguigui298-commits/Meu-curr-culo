import { profile } from '../lib/profile';
import { Monogram } from './Monogram';

/** Mostra a foto do Bruno quando existir; até lá, o monograma. Nunca uma foto gerada. */
export function PhotoSlot({ size = 280 }: { size?: number }) {
  if (profile.photo) {
    return <img className="photo" src={profile.photo.src} alt={profile.photo.alt} width={size} height={size} />;
  }
  return (
    <div className="photo photo--mono" style={{ width: size, height: size }}>
      <Monogram size={size * 0.6} label="Monograma BP de Bruno Pereira (foto em breve)" />
    </div>
  );
}
