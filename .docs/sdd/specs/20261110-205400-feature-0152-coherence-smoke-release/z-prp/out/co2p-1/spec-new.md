---
id: 20261112-160354-feature-0014-notice-room
feature: 0014
title: Párrafo de conserjería al final de la plantilla de aviso
mode: full
profile: delegate
status: draft
created: 2026-11-12
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Párrafo de conserjería al final de la plantilla de aviso

🦆 La plantilla `docs/plantillas/aviso.md` hoy solo dice «Aviso de sala: {sala} el {dia}.». Con este cambio, cada aviso termina con un párrafo fijo que dice a quién llamar (conserjería, ext. 5500, de lunes a viernes de 8:00 a 20:00; fuera de horario, seguridad, ext. 5599) y qué dejar recogido al salir (sillas, pizarra, proyector, ventanas). Por ejemplo, el aviso «Aviso de sala: Norte el lun.» saldrá seguido de ese párrafo. Por dentro solo se edita un documento y se sube el tope de palabras del test que vigila esa carpeta, porque con el párrafo ya no cabe.

Validación: agente — es un documento y un test; no hay pantalla ni flujo que una persona observe y el agente no mida.

## Capacidades

- Ninguna, porque docs

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor — señales: ninguna de las ocho (sin capacidad, sin contrato público, sin MODIFIED, sin datos, sin dependencias, sin roles); se revisa por el cálculo del tope y la transcripción literal · tamaño: ~45 líneas en 3 ficheros
- Dominio+técnica (sonnet, los siete puntos): si el tope nuevo de `test/words.test.js` es coherente con lo medido (52 + 42 palabras) y si el párrafo literal queda idéntico al del dev-lead (sin señal: es la única cifra que puede romper el gate)
- Mínimo razonable: sin review — deja sin mirar el cálculo del tope y la transcripción literal del párrafo

1. **El tope de palabras de `docs/plantillas` sube de 60 a 114.** Hoy `aviso.md` (6) + `recibo.md` (46) = 52 palabras; el párrafo añade 42, total 94, y `node --test`, que es el gate de cierre, fallaría con el tope de 60. Tope propuesto = 94 + 20 de margen (los 20 son la regla de topes del kit; la cifra del margen la propongo yo). Nadie dijo qué hacer con el tope: lo decido yo. Frente a recortar `recibo.md` (no es del alcance) o dejar el test en rojo (incumple la constitution, art. 2).
2. **El párrafo va tras la línea actual, separado por una línea en blanco, y con el texto literal del dev-lead**, sin tocar `{sala}` ni `{dia}`. La separación en blanco es mía.
3. **El test nuevo `test/aviso.test.js` comprueba que `aviso.md` (con `trim()` al final) conserva la línea actual, que va seguida de una línea en blanco y que termina con el párrafo literal; el texto del test es copia literal del de esta spec y un cambio de redacción actualiza ambos.** Es la costura más alta que existe para un documento (no hay código que lo use); el patrón es el de `test/words.test.js`.
4. **El título de `test/words.test.js` pasa a decir 114 palabras** para que no mienta.
5. **Enfoque: A (editar el documento y subir el tope), frente a B (recortar `recibo.md`) y C (excluir `aviso.md` del tope)** (ver Approach).
6. **Sin entrada de CHANGELOG ahora:** la escribe el corte de `sdd-end-release`.
7. **Delta probado en una copia:** `sdd capability merge` → «Sin delta que fusionar» (exit 0); coherente con «Ninguna, porque docs».
- Política de modelos: un revisor de la spec en sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo · en paralelo hasta `control.maxParallelAgents`

### Hallazgos de la review

- **Aceptado** — [Importante] cálculo del margen sin citar → decisión 1 dice que los 20 son la regla de topes del kit y la cifra, propuesta mía.
- **Aceptado** — [Importante] el test no fija el final del fichero ni la línea en blanco → decisión 3 (`trim()`, línea en blanco, copia literal).
- **Aceptado** — [Importante] cabecera contradictoria (señal) → reformulada.
- **Aceptado** — [Importante] PRODUCT dice un solo usuario → Intent lo reconoce: es una plantilla de texto fijo, sin configuración; no se tocan los Terminology.
- **Aceptado** — [Menor] título del test fuera del Scope → Scope lo nombra. [Menor] Intent más amplio que lo entregado → acotado a la plantilla.
- **Rechazado** — [Importante] `scripts/lint.mjs` sin respaldo → está en el gate de cierre de `operations.md` (`node --test && node scripts/lint.mjs`) y no hay `.tab` que lo rompa; no se cita de nuevo.
- **Rechazado** — [Menor] dejar evidencia de la fusión en la copia y separar mecánicas de producto → la decisión 7 ya lleva el resultado; la separación no aporta a un cambio de dos ficheros.

### Decisiones tomadas con el dev-lead

- Texto del párrafo y su sitio (al final de `docs/plantillas/aviso.md`) — «Conserjería: extensión 5500, de lunes a viernes de 8:00 a 20:00. Fuera de ese horario llama a seguridad, extensión 5599. Antes de salir, recoge las sillas, borra la pizarra, apaga el proyector y cierra las ventanas para quien reserve la sala después.»
- Carril feature — «paso 4, carril feature»

## Intent

Hoy el aviso de sala solo dice sala y día, y quien reserva no sabe a quién llamar ni qué dejar recogido para quien venga después. Se quiere que la plantilla de aviso lleve ese párrafo; es texto fijo, no configuración, y quien la consuma queda fuera (hoy ningún código de `src/` la lee). Éxito: `aviso.md` termina con el párrafo literal y `node --test && node scripts/lint.mjs` sigue en verde. Sería un fracaso que el párrafo entrara pero el gate quedara en rojo, o que se alterara el texto del dev-lead.

## Scope

- Entra: añadir el párrafo al final de `docs/plantillas/aviso.md`; subir el tope de `test/words.test.js` y su título; test nuevo del párrafo.
- No entra: tocar `recibo.md`; código de `src/app.js` (no usa las plantillas); cambiar `{sala}` o `{dia}`; entrada de CHANGELOG.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Tope de 60 palabras de `docs/plantillas` | `test/words.test.js:5` (título) y `:8` (`<= 60`) | Scope y decisión 1: pasa a 114 |
| Plantilla `aviso.md` de una sola línea | `docs/plantillas/aviso.md:1` | Scope: la línea se conserva, se le añade el párrafo |

- Filas que implementa: nada: comprobado con `git grep -n "0014\|Aviso de sala\|aviso.md"` (solo `aviso.md:1` y la ruta de la carpeta en el test)

## Approach

- A. Editar `aviso.md` y subir el tope del test a 114 — dos ficheros y un test nuevo; el tope sigue vigilando la carpeta con margen de 20.
- B. Recortar `recibo.md` hasta que quepa — toca un documento que nadie pidió y 46 palabras que no sé para qué sirven.
- C. Excluir `aviso.md` del tope — quita la vigilancia justo del fichero que crece.
- Elegido: A — es el cambio mínimo que mantiene el test con sentido y respeta el alcance.

Ficheros: `docs/plantillas/aviso.md`, `test/words.test.js`, `test/aviso.test.js` (nuevo).

## Dónde se prueba

- El aviso conserva su línea y termina con el párrafo literal: `test/aviso.test.js`, leyendo el fichero como `test/words.test.js`.
- El tope de palabras: `test/words.test.js` existente, con el tope nuevo.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

No aplica: sin capacidades.

## Topes de palabras

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `docs/plantillas` (suma de `aviso.md` y `recibo.md`) | 52 / 60 (`wc -w docs/plantillas/*` → 52) | 8 | 52 + 42 (`wc -w` del párrafo → 42) + 20 = 114 |

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
