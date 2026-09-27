const SLOT = /^([01]\d|2[0-3]):[0-5]\d-([01]\d|2[0-3]):[0-5]\d$/;

export function isValidSlot(slot) {
  return typeof slot === 'string' && SLOT.test(slot);
}
