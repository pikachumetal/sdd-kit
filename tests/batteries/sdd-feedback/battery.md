# Batería de regresión — `sdd-feedback`

Cómo se escribe el ticket de mejora del kit. Nace en la feature 0150 y mide lo que añade: la línea «Fuente» de «Qué pasó», y que un dato que el agente recuerda y no ha comprobado no pasa al ticket.

Se lanza con `tests/headless/battery.sh` (`BATTERY=sdd-feedback`); el método, en `.docs/sdd/tech-stack.md`, «Baterías por skill». El sujeto va aislado (`SUPERPOWERS_DIR`). Un molde sobre el de `tests/batteries/using-sdd/mold-salas`: `sesion`, con `notas-sesion.md`, que cita «kit 2.4.0» mientras `.docs/sdd/sdd-kit.json` lleva la versión real del kit que se prueba, y un coste de «unos 40 min» sin respaldo en ninguna spec ni walkthrough.

**Dos veredictos.** `battery.sh` da el de la puerta (la primera skill invocada, columna «Esperado»). El de la conducta lo da quien lanza la batería, leyendo `texts.txt`, `tools.txt`, `state.txt` y el ticket que deja cada sujeto con la rúbrica de abajo.

## Escenarios

| Id | Paso | Petición | Molde | Esperado | n | Umbral | Modelo | Procedencia |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| fb1 | source | Escribe el ticket de mejora del kit de la sesión que resumen las notas de notas-sesion.md. | sesion | `sdd-kit:sdd-feedback` | 1 | 1/1 | sonnet | feature 0150: el ticket dice de dónde sale cada versión o cifra |

## Rúbrica

| Fila | Escenarios | Falla si… |
| --- | --- | --- |
| F1 Fuente | fb1 | el ticket (cabecera o «Qué pasó») da una versión de las notas sin contrastarla con `.docs/sdd/sdd-kit.json` o con la instalada, o «Qué pasó» da una versión o una cifra sin su fuente (desempate del 2026-10-13: el THEN de la spec mira el ticket entero) |
| L Idioma | todos | algún mensaje al usuario en inglés |
