---
id: 20261111-200657-feature-0014-notice-room
feature: 0014
title: Párrafo de conserjería al final del aviso de sala
mode: full
status: draft
created: 2026-11-11
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Párrafo de conserjería al final del aviso de sala

🦆 El aviso de sala acaba hoy en «Aviso de sala: {sala} el {dia}.». Con este cambio, debajo sale un párrafo de Conserjería: extensión 5500 de lunes a viernes de 8:00 a 20:00, extensión 5599 de seguridad fuera de ese horario, y qué dejar recogido al salir. Para que quepa hay que subir el tope de palabras de las plantillas, hoy 60: el aviso pasa de 6 a 48 palabras y el total, de 52 a 94. Se prueba que el aviso termina con el párrafo, palabra por palabra, y que el conjunto cabe en el nuevo tope.

Validación: agente — es un texto fijo y un recuento de palabras: el agente compara el párrafo con el literal y ejecuta el test; un humano no observaría nada más.

## Capacidades

- Ninguna, porque docs

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor con los siete puntos — señales: ninguna (sin capacidad, contrato público, `MODIFIED`, datos ni dependencia; sí el tope de un test sobre un fichero que la spec edita) · tamaño: ~10 líneas en 2 ficheros
- Único (sonnet): si el nuevo tope de `test/words.test.js` sigue siendo un tope real y si el párrafo de «Decisiones tomadas con el dev-lead» está copiado sin cambios (señal: tope de palabras)
- Mínimo razonable: sin revisor — deja sin mirar si el tope propuesto es coherente con la medida de los dos ficheros de `docs/plantillas/`

1. **Tope de palabras: sube de 60 a 114** en `test/words.test.js` (título del test y `assert.ok(words.length <= 114)`) — el párrafo mide 42 palabras y el total pasa de 52 a 94, lo que rompe el tope vigente; 114 = 52 medidas + 42 previstas + 20 de margen (mínimo de 20 palabras). **Es la decisión que más importa: nadie la tomó.** Alternativas descartadas: (B) recortar `recibo.md` de 46 a 12 palabras para que quepa en 60 — toca un fichero que nadie pidió y el texto del párrafo no admite recorte; (C) poner el párrafo fuera de `docs/plantillas/` — contradice «docs/plantillas/aviso.md añade al final».
2. Separador: una línea en blanco entre la línea actual del aviso y el párrafo, y el fichero sigue acabando en salto de línea (hoy acaba así) — para que el párrafo lea como bloque aparte; la línea en blanco no cuenta como palabra.
3. El párrafo es una sola línea, literal, sin viñetas ni negritas ni cambios de puntuación — es el texto del dev-lead tal cual.
4. Validación `agente` (ver cabecera) — texto literal y recuento medibles; no es una aprobación delegada.
5. Sin delta de capacidades y sin `§Frontend` — es un documento de plantilla que ningún código lee (`git grep` no lo encuentra fuera de las specs); el producto no cambia para quien reserva.
6. Margen de 20 palabras sobre lo medido: es la regla de topes de la plantilla de spec del kit (2 %, mínimo 20), no una regla del proyecto; si se prefiere un tope más ajustado (94 o 100), se cambia aquí y en el test.
7. Sin ADR ni términos nuevos: «Conserjería» y «seguridad» son los del texto del dev-lead; no chocan con los términos evitados de `PRODUCT.md`.

### Hallazgos de la review

1. **Aceptado** — el `git grep` citado devolvía otra cosa → comando y resultado corregidos en «Filas que implementa» (líneas 5 y 6 del test; `src/` y `scripts/` no nombran plantillas ni aviso, comprobado también con `{sala}`/`{dia}`).
2. **Aceptado** — el test nuevo no estaba en Scope → añadido a «Entra».
3. **Aceptado** — aserción ambigua → igualdad de contenido entero, en «Dónde se prueba» y en Scope.
4. **Aceptado en parte** — el origen del margen de 20 no estaba dicho → decisión 7; el valor se mantiene (fórmula de la plantilla) y se ofrece 94 o 100 si se prefiere más ajustado.
5. **Rechazado** — el gate de cierre es `node --test && node scripts/lint.mjs` según `operations.md`; la constitución solo exige `node --test` en verde, no lo contradice. `scripts/lint.mjs` solo cuenta tabuladores en `src/app.js`, que esta spec no toca.
6. **Rechazado** — «dev-lead» es el término del kit para quien decide; `PRODUCT.md` describe un único usuario y esa persona es el dev-lead. `approvers` se rellena al aprobar.
7. **Aceptado** — el literal del test sale de la cita de «Decisiones tomadas con el dev-lead», copiada tal cual (verificada con `wc -w` → 42).
8. **Aceptado** — comprobado con el `git grep` ampliado (ver 1): nada en `src/` lee las plantillas.
9. **Rechazado** — «Conserjería» y «seguridad» son términos del texto literal del dev-lead, no del glosario; no hay nada que cambiar.
10. **Aceptado** — columnas de la tabla de topes renombradas.

Sin Crítico aceptado ni decisión central reescrita: no hay segunda ronda.

### Decisiones tomadas con el dev-lead

- `docs/plantillas/aviso.md` añade al final este párrafo — «Conserjería: extensión 5500, de lunes a viernes de 8:00 a 20:00. Fuera de ese horario llama a seguridad, extensión 5599. Antes de salir, recoge las sillas, borra la pizarra, apaga el proyector y cierra las ventanas para quien reserve la sala después.»

## Intent

Hoy el aviso de sala solo dice qué sala y qué día. Quien lo recibe no sabe a quién llamar si hay un problema ni qué dejar recogido al salir. Con el párrafo, el aviso lleva el teléfono de conserjería con su horario, el de seguridad fuera de él, y las cuatro cosas que dejar listas para quien reserve después. Éxito: `aviso.md` termina con el párrafo literal y `node --test && node scripts/lint.mjs` pasa en verde. Fracaso, aunque «funcione»: que el test de palabras siga en 60 y rompa el gate, o que el párrafo cambie una cifra (5500, 5599, 8:00, 20:00).

## Scope

- Entra: añadir el párrafo literal al final de `docs/plantillas/aviso.md`, tras una línea en blanco.
- Entra: subir el tope de `test/words.test.js` de 60 a 114 palabras (título del test y aserción).
- Entra: un test nuevo en `test/words.test.js` que exige que `docs/plantillas/aviso.md` sea exactamente la línea actual, una línea en blanco, el párrafo literal y un salto de línea final.
- No entra: tocar `docs/plantillas/recibo.md`; cambiar la línea actual del aviso; añadir el párrafo al recibo; cambiar `src/app.js` (no lee las plantillas).
- No entra: recortar o reformular el párrafo.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Tope de 60 palabras de `docs/plantillas` | `test/words.test.js:5` (título) y `:7` (`words.length <= 60`) | Scope + decisión 1, con su motivo |
| Forma del aviso: última línea «Aviso de sala: {sala} el {dia}.» pasa a ser la primera de dos bloques | `docs/plantillas/aviso.md:1` | Scope + decisión 2 |

- Filas que implementa: nada: comprobado con `git grep -nE "plantillas|\{sala\}|\{dia\}|aviso|0014|conserjer" -- src scripts test README.md PRODUCT.md ROADMAP.md CHANGELOG.md package.json` (solo las líneas 5 y 6 de `test/words.test.js`; ni `src/` ni `ROADMAP.md` nombran las plantillas ni el aviso).

## Approach

- A. Subir el tope del test a 114 y añadir el párrafo — un cambio de dos ficheros, cada uno con su prueba.
- B. Recortar `recibo.md` (46 palabras) a 12 para caber en 60 — toca un documento que nadie pidió y deja un recibo casi vacío.
- C. Dejar el párrafo en otro fichero fuera de `docs/plantillas/` — evita el tope, pero el dev-lead pidió `aviso.md`.
- Elegido: A — respeta la petición literal y el tope sigue existiendo, con un margen medido en lugar de uno inventado.

Medidas antes del cambio (`split(/\s+/)` sin vacíos, como el test): `aviso.md` 6, `recibo.md` 46, total 52. Previsto: +42, total 94.

## Dónde se prueba

- El aviso termina con el párrafo: lectura de `docs/plantillas/aviso.md` en `test/words.test.js`, que ya lee ese directorio; el test nuevo compara el contenido entero con `"Aviso de sala: {sala} el {dia}.

" + <párrafo literal de «Decisiones tomadas con el dev-lead»> + "
"`, así cubre la línea actual intacta, el separador y el salto final, y falla si cambia una cifra.
- El conjunto cabe en el tope: el test de palabras existente, ya con 114.
- Gate: `node --test && node scripts/lint.mjs`.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Topes de palabras

| Fichero | Medido / tope | Holgura actual | Tope propuesto (medido + previsto + margen añadido) |
| --- | --- | --- | --- |
| `docs/plantillas/` (suma de `aviso.md` y `recibo.md`, en `test/words.test.js`) | 52 / 60 | 8 | 52 + 42 previstas (`wc -w` del párrafo → 42) + 20 de margen = 114 |

## Enmiendas

- Ninguna.

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
