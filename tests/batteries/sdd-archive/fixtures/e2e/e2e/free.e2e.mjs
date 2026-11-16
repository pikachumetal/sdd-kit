export default [
  { name: 'libres de 12:00 a 14:00 enseña las dos salas', steps: [['libres', ['12:00-14:00'], 'Norte, Sur']] },
  { name: 'reservar cada semana crea la reserva semanal', steps: [['reservar', ['Sur', 'mar', '--cada-semana'], 'reserva semanal creada']] },
];
