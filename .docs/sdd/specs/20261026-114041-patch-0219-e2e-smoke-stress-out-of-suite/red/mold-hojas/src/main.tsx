import { createRoot } from 'react-dom/client';
import { InvoiceList } from './invoices/InvoiceList';
import { Grid } from './sheet/Grid';

const invoices = [
  { number: 'F-014', client: 'Norte SL', amount: 120, status: 'emitida' as const },
  { number: 'F-015', client: 'Sur SA', amount: 80, status: 'cobrada' as const },
];

const sheet = location.pathname.match(/^\/hojas\/(\w+)/)?.[1];
createRoot(document.getElementById('root')!).render(sheet ? <Grid sheet={sheet} /> : <InvoiceList invoices={invoices} />);
