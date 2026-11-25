# Walkthrough — Motivo al cancelar (0010)

`cancelar` pide un motivo de una lista cerrada (cambio de planes, sala ocupada, otro) y `canceladas` enseña cada reserva cancelada con su motivo.

## Qué cambia

- `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)».
- Un motivo fuera de la lista, o sin `--motivo` → «motivo no válido: cambio de planes, sala ocupada, otro».
- `canceladas` → «Norte lun — sala ocupada». Las reservas viven en memoria hasta la 0014.
- Tras cancelar, `libres 10:00-12:00` devuelve «Norte, Sur».

## Verificación

- Gate: `node --test test/ && node e2e/run.mjs` → unit: corrió 8/8 · e2e: corrió 5/5.
- Validación en campo: 2026-11-25 · el agente ejecutó cada THEN contra el entorno real (`scripts/env-up.mjs`, sesión propia): motivo fuera de la lista y sin `--motivo` → el mensaje de la spec; cancelar con «sala ocupada» → «cancelada Norte lun (sala ocupada)»; `canceladas` → «Norte lun — sala ocupada»; `libres 10:00-12:00` → «Norte, Sur». Evidencia: `ejecución real`. `no probado`: persistencia entre procesos (la 0014).
- Revisión final: Spec y Code, con 4 Important cerrados en una pasada (754f709) y 1 re-revisión limpia. 4 Minors aplazados (ver `tasks.md`).

## Lo que falló en la validación

El paso «Se prueba en la aplicación» daba «Sur» en vez de «Norte, Sur»: `1e27a06` hizo que una reserva cancelada siguiera ocupando la sala. Se arregló en la Task 3 (`ab883aa`) con su test en RED primero.

## Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test.
- Task 3: el test de regresión va en un fichero propio.
- Final: se retiran dos e2e que no son flujo core.
- Final: la spec trae un ADDED que debería ser MODIFIED y no se toca.

## Retro

Retro: documento o skill desmentido → una línea en operations.md (.docs/sdd/steering/operations.md): el gate de cierre no levantaba el entorno que el e2e necesita

## Tiempo

- Esfuerzo real: pendiente
