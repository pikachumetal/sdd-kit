export default [
  { name: 'cancela una reserva', steps: [['cancelar', ['Norte', 'lun'], 'cancelada Norte lun']] },
  { name: 'anula una reserva', steps: [['anular', ['Norte', 'lun'], 'anulada Norte lun']] },
  { name: 'anular sin reserva avisa', steps: [['anular', ['Sur', 'mar'], 'sin reserva Sur mar']] },
];
