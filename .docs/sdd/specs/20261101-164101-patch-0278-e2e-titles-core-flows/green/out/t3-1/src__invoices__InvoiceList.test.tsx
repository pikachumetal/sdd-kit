import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { InvoiceList } from './InvoiceList';

const invoices = [
  { number: 'F-014', client: 'Norte SL', amount: 120, status: 'emitida' as const },
  { number: 'F-015', client: 'Sur SA', amount: 80, status: 'cobrada' as const },
];

afterEach(cleanup);

describe('InvoiceList', () => {
  it('filtra por estado', () => {
    render(<InvoiceList invoices={invoices} />);
    fireEvent.change(screen.getByLabelText('Estado'), { target: { value: 'cobrada' } });
    expect(screen.queryByText(/F-014/)).toBeNull();
    expect(screen.getByText(/F-015/)).toBeTruthy();
  });

  it('la factura emitida que se marca como cobrada sale con el estado «cobrada»', () => {
    const marcada = [{ ...invoices[0], status: 'cobrada' as const }, invoices[1]];
    render(<InvoiceList invoices={marcada} />);
    fireEvent.change(screen.getByLabelText('Estado'), { target: { value: 'cobrada' } });
    expect(screen.getByText(/F-014/)).toBeTruthy();
    expect(screen.getByText(/F-015/)).toBeTruthy();
  });
});
