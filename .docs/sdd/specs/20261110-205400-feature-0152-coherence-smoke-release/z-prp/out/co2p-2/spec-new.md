---
id: 20261112-163056-feature-0014-notice-room
feature: 0014
title: Párrafo de conserjería en la plantilla de aviso
mode: full
status: draft
created: 2026-11-12
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Párrafo de conserjería en la plantilla de aviso

🦆 Quien reciba el aviso de una sala verá, tras la línea de siempre, cómo contactar con conserjería y qué dejar recogido al salir. Hoy `docs/plantillas/aviso.md` es solo `Aviso de sala: {sala} el {dia}.`; después lleva debajo el párrafo «Conserjería: extensión 5500, de lunes a viernes de 8:00 a 20:00. Fuera de ese horario llama a seguridad, extensión 5599. Antes de salir, recoge las sillas, borra la pizarra, apaga el proyector y cierra las ventanas para quien reserve la sala después.». Por dentro, el cambio es una edición de texto más un test que fija ese párrafo; además hay que subir el tope de 60 palabras de `docs/plantillas`, porque con el párrafo se pasa (94).

Validación: agente — es un documento de texto literal que un test compara; nadie vería nada que el test no mida.

## Capacidades

- Ninguna, porque docs

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor — señales: ninguna (sin capacidades, contrato público ni `MODIFIED`) · tamaño: ~15 líneas en 3 ficheros
- Dominio+técnica (sonnet): si el tope de palabras de `words.test.js` (60) y el párrafo literal (+42 palabras) son compatibles y si el test del literal falla hoy (señal: Topes de palabras)
- Mínimo razonable: sin revisión — deja sin mirar el choque con el tope de 60 palabras, que es justo lo que descubrió el repaso

1. **Tope de palabras (decisión que necesitas validar)**: `test/words.test.js` limita `docs/plantillas` (todos sus ficheros juntos) a 60 palabras; hoy hay 52 (`aviso.md` 6 + `recibo.md` 46) y el párrafo añade 42, total 94 → el gate `node --test` fallaría. Propongo subir el tope a **114** (94 + 20 de margen, regla de «Topes de palabras»). Dejo intacto el texto que dijiste y `recibo.md`.
2. Enfoque: A, subir el tope, frente a B (recortar `recibo.md` hasta que quepan 60 palabras: toca una plantilla que no pediste y quedaría en 12 palabras) y C (sacar el párrafo a otro fichero fuera de `docs/plantillas`: no es lo que dijiste, «al final de `aviso.md`») (ver Approach).
3. El párrafo va **separado por una línea en blanco** de la línea `Aviso de sala: {sala} el {dia}.`, y el fichero acaba en salto de línea como hoy.
4. El párrafo va literal, con tildes y sin cambios, incluidos `8:00`, `20:00`, `5500` y `5599`; no lleva marcadores `{…}`.
5. Se añade el test `test/aviso.test.js`: lee `docs/plantillas/aviso.md`, normaliza `
` a `
` (por si Windows con `autocrlf`) y lo compara entero con `Aviso de sala: {sala} el {dia}.` + línea en blanco + el párrafo + salto final.
6. Validación: `agente` (ver arriba), no `dev-lead`.
7. Carril feature, modo full, perfil `delegate` (de `sdd-kit.json`); el id 0014 es el de la rama y no tiene fila en `ROADMAP.md` (no la creo: lo dices tú).
8. Las extensiones 5500 y 5599 y el horario son datos que tú aportaste: no los verifico ni son ficticios por mi parte.
- Política de modelos: un revisor de spec (sonnet) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo

### Hallazgos de la review

- **Aceptado** — el test no fijaba la línea en blanco ni el salto final → compara el contenido entero (decisión 5).
- **Aceptado** — el 🦆 citaba un ejemplo en vez del literal real → corregido a `Aviso de sala: {sala} el {dia}.`.
- **Aceptado** — línea del `assert` es la 7, no la 8 → corregido en la tabla.
- **Aceptado** — «son 94» no lo fija ningún test → criterio reformulado a «no superan 114».
- **Aceptado** — el título del test también cambia → añadido al Scope.
- **Aceptado** — el tope no tiene RED propio salvo en cierto orden → fijado en «Dónde se prueba».
- **Aceptado** — riesgo `
` en Windows → el test normaliza saltos de línea.
- **Rechazado** — `lint.mjs` sobre `docs/plantillas`: `scripts/lint.mjs` solo revisa tabuladores en `src/app.js`, no objeta al párrafo; el gate `node --test && node scripts/lint.mjs` es el de `operations.md`.
- **Aceptado** — extensiones y horario no verificados → decisión 8 en ✋.
- **Aceptado** — margen de 20 sin cita → regla citada; un tope más ajustado (100) es la alternativa que tú decides.

### Decisiones tomadas con el dev-lead

- El texto que se añade al final de `docs/plantillas/aviso.md` — «Conserjería: extensión 5500, de lunes a viernes de 8:00 a 20:00. Fuera de ese horario llama a seguridad, extensión 5599. Antes de salir, recoge las sillas, borra la pizarra, apaga el proyector y cierra las ventanas para quien reserve la sala después.»
- Carril feature — «carril feature»

## Intent

Hoy el aviso de sala solo dice `Aviso de sala: {sala} el {dia}.` y quien usa la sala no sabe a quién llamar ni qué dejar recogido. Se añade al final de `docs/plantillas/aviso.md` el párrafo de conserjería decidido con el dev-lead. Éxito: el fichero termina con ese párrafo, letra por letra, y `node --test && node scripts/lint.mjs` sigue en verde. Fracaso aunque «funcione»: que el gate falle por el tope de palabras, o que el párrafo cambie una letra (extensión u horario erróneos).

## Scope

- Entra: añadir el párrafo literal al final de `docs/plantillas/aviso.md`, tras una línea en blanco; subir a 114 el tope de `test/words.test.js` (número y título del test); test nuevo `test/aviso.test.js`.
- No entra: tocar `recibo.md`, la línea `Aviso de sala: {sala} el {dia}.`, `src/app.js` (nada lo consume hoy), `README.md` o `CHANGELOG.md` (lo escribe el cierre de la release).

Criterios de aceptación:

- GIVEN `docs/plantillas/aviso.md` actualizado · WHEN se lee · THEN la primera línea es `Aviso de sala: {sala} el {dia}.`, sigue una línea en blanco y el resto es exactamente el párrafo de conserjería, con un salto de línea final.
- GIVEN los ficheros de `docs/plantillas` · WHEN se cuentan las palabras como hace `words.test.js` · THEN no superan el tope (114); que el párrafo esté completo lo fija `aviso.test.js`, no este tope.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Tope de 60 palabras de `docs/plantillas` → 114 | `test/words.test.js:5` y `:7` (título del test y `assert.ok(words.length <= 60)`) | Scope y decisión 1 |
| Contenido de `aviso.md` (se añade un párrafo) | `docs/plantillas/aviso.md:1` | Scope |

- Filas que implementa: 0014 → ninguna fila en `ROADMAP.md` | nada: comprobado con `git grep -n "0014\|Conserjer" -- . ':!.docs/sdd/changes'` (sin resultados); `aviso`/`plantillas` solo aparecen en `ROADMAP.md:9` (fila 0008, otro asunto) y en `test/words.test.js`.

## Approach

- A. Subir el tope de `words.test.js` de 60 a 114 — coste: cambia un límite que alguien puso a propósito; se compensa con margen mínimo (20 palabras).
- B. Recortar `recibo.md` (46 palabras) a ≤12 para que quepan 60 — coste: borra contenido de una plantilla que nadie pidió tocar.
- C. Poner el párrafo en otro fichero — coste: no cumple «al final de `aviso.md`».
- Elegido: A — respeta el texto y los ficheros que dijo el dev-lead, y el único cambio colateral es un número del test, a la vista en ✋.

Detalle: el párrafo se añade con una línea en blanco delante; el test del literal compara contra la cadena exacta.

## Dónde se prueba

- Párrafo en `aviso.md`: `test/aviso.test.js` nuevo, leyendo el fichero como `words.test.js` (`node:test`, `readFileSync`); RED hoy porque el fichero acaba en `{dia}.`.
- Tope de palabras: `test/words.test.js` existente, con el tope en 114 y el título actualizado. Su RED aparece al añadir el párrafo con el tope aún en 60 (94 > 60); el plan fija ese orden: párrafo y test del literal primero, tope después.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Topes de palabras

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `docs/plantillas/` (suma de `aviso.md` y `recibo.md`, `test/words.test.js`) | 52 / 60 | 8 | 52 + 42 previstas (`wc -w` del párrafo → 42) + 20 (el 2 % de 94 son 2 palabras, así que rige el mínimo de 20 de la regla de «Topes de palabras») = **114** |

## Enmiendas

Ninguna.

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
