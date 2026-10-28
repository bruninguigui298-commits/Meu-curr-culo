import { profile } from '../lib/profile';

/** Vídeo de apresentação. Só aparece quando o arquivo existir (com legendas). */
export function VideoSlot() {
  const v = profile.video;
  if (!v) return null;
  return (
    <figure className="video">
      <video controls preload="metadata" poster={v.poster} width={960}>
        <source src={v.src} type="video/mp4" />
        <track kind="captions" src={v.captions} srcLang="pt-BR" label="Português" default />
      </video>
      <figcaption>Apresentação do Bruno em vídeo (com legendas).</figcaption>
    </figure>
  );
}
