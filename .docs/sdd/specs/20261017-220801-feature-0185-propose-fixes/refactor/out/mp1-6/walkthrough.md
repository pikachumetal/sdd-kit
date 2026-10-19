# Walkthrough — Motivo al cancelar

Cancelar pide un motivo de una lista cerrada (cambio de planes, sala ocupada, otro), y el comando `canceladas` lista las reservas canceladas con su motivo. Dos tasks en Native.

## Revisión

- Revisión final: Spec opus+high, With fixes · Código sonnet+high, With fixes · Arquitectura no (plan), sobre 300f2b8
- Pasada de fix: 921ea70, 3 hallazgos RED→GREEN (test sin `--motivo`, vuelve la regresión «sin reserva» del patch 0007, test de `canceladas` sin depender del orden)
- Re-revisión: 300f2b8..921ea70, sdd-kit:effort-high + opus, los 3 hallazgos resueltos; 2 Minor adjudicados

## Decisiones tomadas sin el dev-lead

- Las anulaciones no salen en `canceladas` — es el Scope (0011).
- No se parte `src/app.js` — Eje Arquitectura no.
- El motivo vive en memoria, como todo el proyecto.
- `--motivo` antes de sala y día responde «sin reserva --motivo otro» — la spec fija la sintaxis posicional.
- Un motivo con espacios sin comillas se rechaza — es la shell; el mensaje lista los motivos válidos.
- La regla de «antes de 24 h» de PRODUCT.md queda fuera — no está en el Scope.
- `test/cancel.test.js` pasó de CRLF a LF en 921ea70 — solo formato.
- Los tests de `cancel.test.js` comparten el estado del módulo — `node:test` respeta el orden en que se declaran.
- Bloque «Capacidades» de la spec: «Modificadas» → «Nuevas», porque `bookings` no existía y la fusión lo pedía.

## Minors diferidos

- `canceladas` sin canceladas imprime una línea vacía.
- `cancelar Norte --motivo otro` (sin día) responde «sin reserva Norte --motivo».
- `src/app.js:36`, de unas 120 columnas.

## Verificación

<!-- se completa con la validación -->

## Tiempo

<!-- se completa en el cierre -->
