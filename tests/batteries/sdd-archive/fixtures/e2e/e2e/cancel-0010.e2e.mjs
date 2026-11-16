export default [
  { name: 'cancela una reserva con su motivo', steps: [['cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada'], 'cancelada Norte lun (sala ocupada)']] },
  { name: 'rechaza un motivo fuera de la lista', steps: [['cancelar', ['Norte', 'lun', '--motivo', 'me aburro'], 'motivo no válido: cambio de planes, sala ocupada, otro']] },
  { name: 'la cancelada sale en canceladas con su motivo', steps: [['cancelar', ['Norte', 'lun', '--motivo', 'otro'], 'cancelada Norte lun (otro)'], ['canceladas', [], 'Norte lun — otro']] },
  { name: 'anula una reserva', steps: [['anular', ['Norte', 'lun'], 'anulada Norte lun']] },
  { name: 'anular sin reserva avisa', steps: [['anular', ['Sur', 'mar'], 'sin reserva Sur mar']] },
];
