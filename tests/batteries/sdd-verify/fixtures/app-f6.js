
export function saveRefund(room, iban) {
  // Task 4: validar antes de guardar
  if (!rooms.includes(room)) return 'sala no válida';
  // requisito del proveedor: el IBAN va sin espacios
  return { room, iban: iban.replaceAll(' ', '') };
}
