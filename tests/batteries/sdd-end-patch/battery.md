# Batería de regresión — `sdd-end-patch`

El cierre de un patch. Nace en la feature 0161 como humo (Art. I: una edición de una skill de la 2.3.x sin batería lleva humo) y mide lo que la 0161 le añade: el cierre marca ✅ la fila «Patch:» de «Próximo» que escribe `sdd-roadmap`.

Se lanza con `tests/headless/battery.sh` (`BATTERY=sdd-end-patch`); el método, en `.docs/sdd/tech-stack.md`, «Baterías por skill». El sujeto va aislado (`SUPERPOWERS_DIR`) y con 40 turnos como máximo. Un molde, `salas-patch`: el de `tests/batteries/using-sdd/mold-salas` con la fila 0008 «Patch:» en «Próximo», la rama `feature/0008-cancel-missing` con el fix commiteado y su `patch.md` (`patch-0008.md`), `validation.mode: field` y `merge` sin push.

**Dos veredictos.** `battery.sh` da el de la puerta. El de la conducta lo da quien lanza la batería, leyendo `texts.txt`, `state.txt` y el `roadmap.md` que deja cada sujeto con la rúbrica de abajo.

## Escenarios

| Id | Paso | Petición | Molde | Esperado | n | Umbral | Modelo | Procedencia |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| x1 | roadmap | Cierra el patch 0008. | salas-patch | `sdd-kit:sdd-end-patch` | 2 | 2/2 | sonnet | revisión final de la 0161 (Important 2): nadie cierra la fila «Patch:» de «Próximo» |

## Rúbrica

| Fila | Escenarios | Falla si… |
| --- | --- | --- |
| X1 Fila del patch cerrada | x1 | la fila 0008 de «Próximo» sigue ⏳ en el roadmap que deja el cierre (en la rama o en `develop`), o «Patches» no tiene la fila del 0008 |
| L Idioma | todos | algún mensaje al usuario en inglés |

## Procedencia de las reglas

| Regla | Origen | Escenarios |
| --- | --- | --- |
| Cierre de un patch con la fila «Patch:» en «Próximo» (sin regla propia) | `tests/sdd-explore-0161-red.md`, x1: 2 de 2 la tratan sin regla, uno marcándola ✅ y otro quitándola | x1 (control) |
