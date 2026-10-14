---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-14
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada; `canceladas` lista «sala día — motivo» (4f99a6f, e4bf7af).
- `src/app.js`: `canceladas` sin canceladas responde «sin canceladas» (fix posterior a la revisión final; no estaba en la spec, ver 3).
- `test/cancel.test.js`: pruebas de cancelar con motivo, motivo fuera de la lista, listado y listado vacío.
- `.docs/sdd/capabilities/bookings.md`: capacidad nueva, creada al cerrar.

## 2. Tiempo y coste

- Tokens del hilo: 709.748 — claude-sonnet-5-5 709.748
- Tokens de subagentes: 115.988 en 1 despacho — Re-revisión tramo 4f99a6f..HEAD claude-opus-5-5 115.988 / 1 min
- Coste de la sesión: sin precio (sin tabla pricing en sdd-kit.json)
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- Fuera del plan y de la spec: `canceladas` vacío responde «sin canceladas» (fc0aa33). Se añadió tras la revisión final; la re-revisión pidió test y enmienda, y ambos se hicieron (spec, «Enmiendas»).

### Decisiones tomadas sin el dev-lead

- Texto «sin canceladas» para el listado vacío — nadie lo dijo en la entrevista — si no gusta, es una línea en `src/app.js` y su test.
- La capacidad `bookings` se declara «Nuevas», no «Modificadas»: no existía `capabilities/bookings.md` y el fusionador no puede modificar lo que no existe. Solo recoge los dos requisitos de esta feature; reservar, libres y cancelar sin motivo siguen sin capacidad — si quieres otro nombre o alcance, dilo.
- `src/app.js` vuelve a CRLF (7fb968d): el fix original lo había pasado a LF y reescribía las 48 líneas del fichero.

## 4. Verificación

### 4.1 Builds

- Suite completa: `node --test` → 6/6 en verde · ~0,6 s (sobre 7fb968d, antes de los docs de cierre).

### 4.2 Smoke / tests

- Validado por el dev-lead: 2026-10-14 · «probé cancelar con motivo y sale en canceladas». No detalló con qué entrada ni por qué vía (CLI o `run`); no cubre el motivo fuera de la lista ni el listado vacío.
- Revisión final (Spec opus+high, Código sonnet+high, limpia, sobre 4f99a6f) y re-revisión del tramo 4f99a6f..fc0aa33 (effort-high + opus): 3 hallazgos (test faltante, CRLF, `tasks.md`), los tres corregidos. El último arreglo (7fb968d) y los commits de cierre no se han revisado en un despacho aparte: ✋ `sin revisar: 7fb968d — restaura CRLF en app.js (diff neto contra 4f99a6f: 1 línea de código) y añade 1 test de 4 líneas`.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| Cancelar con motivo de la lista responde «cancelada Norte lun (sala ocupada)» | suite · ejecución real (`node src/app.js cancelar Norte lun --motivo "sala ocupada"`) | ✔ |
| Motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | suite · ejecución real (`--motivo "me aburro"`) | ✔ |
| `canceladas` con la de Norte lun cancelada responde «Norte lun — sala ocupada» | suite · ejecución real vía `run('cancelar')` + `run('canceladas')` en un proceso; **no** con dos invocaciones de CLI | ✔ en un proceso · ✘ entre dos invocaciones (ver 4.3) |

### 4.3 Residuales / deuda generada

- **`canceladas` no ve nada entre dos invocaciones de la CLI.** `bookings` vive en memoria del proceso (`src/app.js:4`): `node src/app.js cancelar …` seguido de `node src/app.js canceladas` responde «sin canceladas». La spec no lo decía y los tests no lo ven, porque corren en un solo proceso. Es lo que cubre la fila 0014 «Motivo guardado» del roadmap; hasta entonces, la feature no es utilizable de punta a punta desde la terminal. Pendiente de que el dev-lead lo confirme.
- Los ficheros de código y configuración del repo están en CRLF y `core.autocrlf=true` los normaliza a LF al hacer `git add` si el índice los tenía en LF: para conservar CRLF, `git -c core.autocrlf=false add`.

## 5. Aprendizajes

- Los `.js` y `package.json` del repo están en CRLF; un editor o script que los pase a LF reescribe todo el fichero en el diff → `constitution.md`, regla 5.
- El comportamiento observable de `cancelar` y `canceladas` → `capabilities/bookings.md` (fusionado con `sdd capability merge`).

## 6. Adendas

- _Ninguna_
