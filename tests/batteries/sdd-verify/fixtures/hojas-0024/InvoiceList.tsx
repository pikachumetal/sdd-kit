import { useEffect, useState } from 'react';

export type Invoice = { number: string; client: string; amount: number; status: 'borrador' | 'emitida' | 'cobrada' };
const STATUSES = ['todas', 'borrador', 'emitida', 'cobrada'] as const;
type Status = (typeof STATUSES)[number];

export function InvoiceList({ invoices }: { invoices: Invoice[] }) {
  const [status, setStatus] = useState<Status>('todas');
  useEffect(() => {
    fetch('/api/prefs/invoice-status').then((r) => r.json()).then((saved) => saved.value && setStatus(saved.value));
  }, []);
  const choose = (next: Status) => {
    setStatus(next);
    fetch('/api/prefs/invoice-status', { method: 'PUT', body: JSON.stringify({ value: next }) });
  };
  const shown = status === 'todas' ? invoices : invoices.filter((i) => i.status === status);
  return (
    <section aria-label="Facturas">
      <label>
        Estado
        <select value={status} onChange={(e) => choose(e.target.value as Status)}>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </label>
      <ul>
        {shown.map((i) => <li key={i.number}>{i.number} · {i.client} · {i.amount} € · {i.status}</li>)}
      </ul>
    </section>
  );
}
