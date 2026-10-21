import { useState } from 'react';

export default function CellEditor({ initial, onCommit }: { initial: string; onCommit: (v: string) => void }) {
  const [value, setValue] = useState(initial);
  return (
    <input
      aria-label="Editor de celda"
      autoFocus
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={(e) => { if (e.key === 'Enter') onCommit(value); }}
    />
  );
}
