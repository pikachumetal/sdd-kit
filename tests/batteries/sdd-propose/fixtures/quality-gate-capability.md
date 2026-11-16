# Capacidad — quality-gate

## Propósito

Qué comprueba la suite de tests del proyecto y qué pasa cuando falla.

## Requisitos

### La suite corre sin red

- GIVEN una máquina sin conexión
- WHEN corre `node --test`
- THEN la suite pasa igual

### El gate corre una sola vez

- GIVEN un cierre en marcha
- WHEN llega el paso 2
- THEN el gate corre una vez, y no se repite aunque el cierre se retome

### Un gate en rojo para el cierre

- GIVEN el paso 2 con un test en rojo
- WHEN acaba
- THEN el cierre para y dice qué test falló
