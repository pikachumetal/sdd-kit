import type { Json } from '../cli/records.ts';
import { costOfModel, type SessionCost } from './cost.ts';
import type { Dispatch, Session } from './session.ts';
import { CATEGORIES, mergeTotals, modelsByTokens, tokenSum, totalTokens, type ModelTotals } from './usage.ts';

export const formatTokens = (count: number): string => String(count).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

export function formatMoney(amount: number): string {
  const cents = Math.round(Number((amount * 100).toPrecision(15)));
  return (cents / 100).toFixed(2).replace('.', ',');
}

export const TABLE_HEADER = [
  '| Ámbito | Modelo | Entrada | Escritura 5m | Escritura 1h | Lectura | Salida | Total | Coste ($) |',
  '| --- | --- | --- | --- | --- | --- | --- | --- | --- |',
];

export function tableRows(scope: string, totals: ModelTotals, prices: Json | null): string[] {
  return [...totals].map(([model, usage]) => {
    const cost = prices === null ? null : costOfModel(usage, model, prices);
    const costText = cost === null ? 'sin precio' : formatMoney(cost);
    const cells = CATEGORIES.map((category) => formatTokens(usage[category])).join(' | ');
    return `| ${scope} | ${model} | ${cells} | ${formatTokens(tokenSum(usage))} | ${costText} |`;
  });
}

export function threadLine(totals: ModelTotals): string {
  const models = modelsByTokens(totals).map((model) => `${model} ${formatTokens(tokenSum(totals.get(model)!))}`);
  return `- Tokens del hilo: ${formatTokens(totalTokens(totals))} — ${models.join('; ')}`;
}

export const mainModel = (totals: ModelTotals): string | undefined => modelsByTokens(totals)[0];

function dispatchItem(dispatch: Dispatch): string {
  const state = dispatch.inProgress ? ', en curso' : '';
  const tokens = formatTokens(totalTokens(dispatch.totals));
  return `${dispatch.description} ${mainModel(dispatch.totals) ?? ''} ${tokens} / ${dispatch.minutes} min${state}`;
}

export function dispatchLine(dispatches: Dispatch[]): string {
  if (dispatches.length === 0) return '- Tokens de subagentes: no aplica';
  const total = dispatches.reduce((sum, dispatch) => sum + totalTokens(dispatch.totals), 0);
  const noun = dispatches.length === 1 ? 'despacho' : 'despachos';
  return `- Tokens de subagentes: ${formatTokens(total)} en ${dispatches.length} ${noun} — ${dispatches.map(dispatchItem).join('; ')}`;
}

export function costLine(cost: SessionCost): string {
  if (cost.kind === 'unpriced') return '- Coste de la sesión: sin precio (sin tabla pricing en sdd-kit.json)';
  if (cost.kind === 'missing') return `- Coste de la sesión: sin precio (modelos sin precio: ${cost.models.join(', ')})`;
  const thread = formatMoney(cost.thread);
  if (!cost.hasDispatches) return `- Coste de la sesión: ${thread} $ (hilo ${thread} $)`;
  const parts = `hilo ${thread} $ + subagentes ${formatMoney(cost.subagents)} $`;
  return `- Coste de la sesión: ${formatMoney(cost.thread + cost.subagents)} $ (${parts})`;
}

export function reportLines(session: Session, prices: Json | null, cost: SessionCost): string[] {
  const subagents = mergeTotals(session.dispatches.map((dispatch) => dispatch.totals));
  return [
    ...TABLE_HEADER,
    ...tableRows('Hilo', session.thread, prices),
    ...tableRows('Subagentes', subagents, prices),
    '',
    threadLine(session.thread),
    dispatchLine(session.dispatches),
    costLine(cost),
  ];
}

export function notMeasuredLines(reason: string): string[] {
  return ['Tokens del hilo', 'Tokens de subagentes', 'Coste de la sesión'].map((label) => `- ${label}: no medido (${reason})`);
}
