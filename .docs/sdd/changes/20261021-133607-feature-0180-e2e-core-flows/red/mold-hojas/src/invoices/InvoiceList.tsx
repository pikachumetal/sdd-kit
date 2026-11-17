import { useState } from 'react';

export type Invoice = { number: string; client: string; amount: number; status: 'borrador' | 'emitida' | 'cobrada' };
const STATUSES = ['todas', 'borrador', 'emitida', 'cobrada'] as const;

export function InvoiceList({ invoices }: { invoices: Invoice[] }) {
  const [status, setStatus] = useState<(typeof STATUSES)[number]>('todas');
  const shown = status === 'todas' ? invoices : invoices.filter((i) => i.status === status);
  return (
    <section aria-label="Facturas">
      <label>
        Estado
        <select value={status} onChange={(e) => setStatus(e.target.value as (typeof STATUSES)[number])}>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </label>
      <ul>
        {shown.map((i) => <li key={i.number}>{i.number} · {i.client} · {i.amount} € · {i.status}</li>)}
      </ul>
    </section>
  );
}
