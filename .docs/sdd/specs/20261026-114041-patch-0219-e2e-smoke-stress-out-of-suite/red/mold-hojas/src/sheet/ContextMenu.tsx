export function ContextMenu({ x, y, onPaste, onClose }: { x: number; y: number; onPaste: () => void; onClose: () => void }) {
  return (
    <div role="menu" aria-label="Menú de celda" style={{ position: 'fixed', left: x, top: y }} onMouseLeave={onClose}>
      <button role="menuitem" onClick={onPaste}>Pegar</button>
    </div>
  );
}
