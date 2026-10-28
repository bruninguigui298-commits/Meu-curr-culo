/** Monograma "BP" — fica no lugar da foto até o Bruno mandar fotos reais. */
export function Monogram({ size = 40, label }: { size?: number; label?: string }) {
  return (
    <span
      className="monogram"
      style={{ width: size, height: size, fontSize: size * 0.5 }}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      BP
    </span>
  );
}
