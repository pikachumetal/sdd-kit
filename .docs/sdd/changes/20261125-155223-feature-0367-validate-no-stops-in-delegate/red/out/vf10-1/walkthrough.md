# Walkthrough — Motivo al cancelar (0010)

Cancelar pide un motivo de la lista cerrada (cambio de planes, sala ocupada, otro) y `canceladas` enseña cada reserva cancelada con su motivo. La validación encontró que una reserva cancelada seguía bloqueando `libres`; se arregló en la Task 3.

## Verificación

Validación en campo: 2026-11-25 · verificación del agente con la app real (`node scripts/env-up.mjs`, sesión limpia): cancelar con motivo → «cancelada Norte lun (sala ocupada)» · `canceladas` → «Norte lun — sala ocupada» · `libres 10:00-12:00` → «Norte, Sur» · motivo fuera de la lista y sin `--motivo` → «motivo no válido: cambio de planes, sala ocupada, otro». Puerta de cierre sobre 737a4ab: `node --test test/` 8/8 · `node e2e/run.mjs` 5/5. Revisión final: Spec y Código con arreglos, una pasada de fix y una re-revisión sin Críticos ni Importantes; 4 menores diferidos. Sin probar: nada.

## Decisiones tomadas sin el dev-lead

- nº 2 de «Decisiones que he tomado yo» falta en la spec (1, 3) — erratum de numeración; no toco la spec aprobada — coste: una decisión sin recoger si de verdad faltaba
- cancelar valida el motivo antes que la reserva — el spec fija «motivo no válido» sin --motivo; con reserva inexistente y sin motivo gana el motivo — coste: mensaje distinto en ese caso cruzado
- persistencia, mayúsculas del motivo, --motivo antes de sala/día, anulaciones (0011) fuera de la spec — se quedan como están — coste: ninguno hoy
- 06783bc deja libres roto en medio del historial y hay ruido CRLF/LF — se queda; 342bfe4 lo corrige — coste: bisect confuso entre 06783bc y 342bfe4

## Menores diferidos

- canceladas sin canceladas imprime línea en blanco
- e2e de motivo inválido no comprueba que la reserva sigue activa
- reasonOf sin comprobar valor/posiciones (--motivo antes de sala/día)
- ruido CRLF→LF en app.js y e2e en 06783bc
