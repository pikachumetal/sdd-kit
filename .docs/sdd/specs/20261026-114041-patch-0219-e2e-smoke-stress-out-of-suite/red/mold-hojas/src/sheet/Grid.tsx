import { lazy, Suspense, useState } from 'react';
import { copyRange, lastCopied } from './clipboard';
import { ContextMenu } from './ContextMenu';

const CellEditor = lazy(() => import('./CellEditor'));

const COLUMNS = ['A', 'B', 'C', 'D'];
const ROWS = [1, 2, 3, 4, 5];

export function Grid({ sheet }: { sheet: string }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState('A1');
  const [editing, setEditing] = useState<string | null>(null);
  const [menu, setMenu] = useState<{ cell: string; x: number; y: number } | null>(null);

  const save = async (cell: string, value: string) => {
    setValues((v) => ({ ...v, [cell]: value }));
    setEditing(null);
    await fetch(`/api/sheets/${sheet}/cells/${cell}`, { method: 'PUT', body: JSON.stringify({ value }) });
  };

  const onKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !editing) setEditing(selected);
    if (e.key === 'c' && (e.ctrlKey || e.metaKey)) await copyRange({ sheet, range: selected, values: [[values[selected] ?? '']] });
  };

  const paste = async (cell: string) => {
    setMenu(null);
    const copied = await lastCopied();
    if (copied) await save(cell, copied.values[0][0]);
  };

  return (
    <table role="grid" aria-label="Hoja" tabIndex={0} onKeyDown={onKeyDown}>
      <tbody>
        {ROWS.map((row) => (
          <tr key={row}>
            {COLUMNS.map((col) => {
              const cell = `${col}${row}`;
              return (
                <td
                  key={cell}
                  role="gridcell"
                  aria-label={cell}
                  aria-selected={selected === cell}
                  data-testid={`cell-${cell}`}
                  onClick={() => setSelected(cell)}
                  onContextMenu={(e) => { e.preventDefault(); setSelected(cell); setMenu({ cell, x: e.clientX, y: e.clientY }); }}
                >
                  {editing === cell ? (
                    <Suspense fallback={null}>
                      <CellEditor initial={values[cell] ?? ''} onCommit={(v) => save(cell, v)} />
                    </Suspense>
                  ) : (values[cell] ?? '')}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
      {menu && <ContextMenu x={menu.x} y={menu.y} onPaste={() => paste(menu.cell)} onClose={() => setMenu(null)} />}
    </table>
  );
}
