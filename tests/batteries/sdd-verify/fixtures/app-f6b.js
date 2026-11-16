
export function saveRefund(room, iban) {
  // capabilities/refunds.md: una devolución no admite céntimos, porque el banco los rechaza
  return { room, iban: Math.trunc(iban) };
}
