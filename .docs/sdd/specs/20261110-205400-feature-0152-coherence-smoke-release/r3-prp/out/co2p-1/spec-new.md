---
id: 20261111-192314-feature-0014-notice-room
feature: 0014
title: Aviso de sala con conserjería y normas de salida
mode: full
profile: delegate
status: draft
created: 2026-11-11
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Aviso de sala con conserjería y normas de salida

🦆 La plantilla `docs/plantillas/aviso.md` pasa de una línea (`Aviso de sala: {sala} el {dia}.`) a llevar debajo un párrafo fijo: la extensión de conserjería (5500, L-V de 8:00 a 20:00), la de seguridad fuera de horario (5599) y las cuatro cosas que hay que dejar hechas al salir (sillas, pizarra, proyector, ventanas). Para que quepa hay que subir el tope de 60 palabras de `docs/plantillas`, que hoy está en 52 y con el párrafo quedaría en 94.

Validación: agente — es un documento de texto y un test; lo que se ve es el literal del párrafo, que el test compara carácter a carácter.

## Capacidades

- Ninguna, porque docs.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor con los siete puntos — señales: ninguna (sin capacidad, contrato, MODIFIED, datos ni dependencia; área leída entera en esta sesión) · tamaño: ~60 líneas en 3 ficheros
- Único (sonnet): si el tope nuevo de `test/words.test.js` y la fila de «Topes de palabras» cuadran con 52 + 42 palabras medidas, y si el THEN literal del párrafo coincide carácter a carácter con el pedido (señal: tope de palabras)
- Mínimo razonable: el mismo revisor — sin él quedaría sin mirar que el conteo del test (`split(/\s+/)`) y el mío coinciden

1. **El choque con el tope.** `test/words.test.js` limita `docs/plantillas` a 60 palabras (hoy 52: `aviso.md` 6 + `recibo.md` 46). Con el párrafo, 94, y el gate de cierre (`node --test`) fallaría. Propongo **subir el tope a 114** (94 + 20 de margen: el mínimo que fija el método de topes del kit, criterio mío y no del proyecto) y renombrar el test a «tope de 114 palabras». Alternativa descartada: recortar `recibo.md` (46 «palabra» de relleno) a ≤ 12 palabras (60 − 6 − 42): toca un fichero que nadie pidió y deja el tope de 60 casi sin margen. **Esta es la decisión que más te pido que mires**: el tope parece una restricción deliberada y no sé por qué es 60.
2. El párrafo va **tal cual lo dijiste**, sin cambiar una coma, separado de la línea de aviso por **una línea en blanco**, y `aviso.md` acaba en salto de línea (la línea en blanco y el salto final no cuentan palabras).
3. La línea `Aviso de sala: {sala} el {dia}.` **no cambia**: el párrafo se añade debajo.
4. Se prueba con **un fichero de test nuevo, `test/aviso.test.js`** (el literal de una plantilla no es un tope de palabras, y `words.test.js` se queda solo con el tope, que sí hay que editar: título y valor). La aserción es la igualdad exacta del fichero, con `PARRAFO` definido una sola vez en el test: `'Aviso de sala: {sala} el {dia}.

' + PARRAFO + '
'`, tras normalizar `
` a `
` al leerlo (en Windows `core.autocrlf` puede dejar CRLF; no cambia el conteo de palabras). Cubre a la vez la línea 1 intacta, la línea en blanco y el salto final.
5. **Sin capacidad ni delta**: es un documento. `sdd capability merge` sobre copia: no aplica (sin delta).
6. **No hay fila `0014` en `ROADMAP.md`**: la rama `feature/0014-notice-room` ya traía el id y `sdd id claim` lo confirma (sin remoto: contador local). Decido **no añadir la fila**: cerrado, no queda tarea de cierre.
7. Enfoque: A, frente a B y C (ver Approach).
- Política de modelos: revisor de la spec: uno, sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents`.

### Hallazgos de la review

- **Aceptado** — Crítico: sin escenarios GIVEN/WHEN/THEN → añadidos en «Dónde se prueba».
- **Aceptado** — aserción exacta del test → decisión 4 (igualdad del fichero entero).
- **Rechazado** — el gate cita `scripts/lint.mjs` y la constitución solo `node --test` → `operations.md` fija el gate de cierre con ambos; Intent ya lo dice.
- **Aceptado** — 🦆 con el literal real de `aviso.md` → corregido.
- **Rechazado** — «dev-lead» sin otras personas en el proyecto → es el rol del kit y es quien da las decisiones (el propio usuario).
- **Aceptado** — origen del margen de 20 → dicho en la decisión 1 como criterio del método, no del proyecto; el origen del 60 sigue abierto para el gate.
- **Aceptado** — dónde va el test → decisión 4: `test/aviso.test.js` nuevo.
- **Aceptado** — fila «no cambia» → quitada de la tabla de retiros.
- **Rechazado** — mover la política de revisión fuera de ✋ → la plantilla exige que el bloque la abra.
- **Aceptado** — fila del roadmap como pregunta abierta → cerrada en la decisión 6.

Segunda ronda (sin Críticos; sin tercera): aceptados los 7 — tres ficheros en vez de dos, CRLF normalizado, escenario 2 como verificación del RED, margen marcado como criterio mío, lint leído (solo tabuladores en `src/app.js`), expresión del test con `PARRAFO`, fila de roadmap cerrada.

### Decisiones tomadas con el dev-lead

- Texto del párrafo y sitio (al final de `docs/plantillas/aviso.md`) — «docs/plantillas/aviso.md añade al final este párrafo: «Conserjería: extensión 5500, de lunes a viernes de 8:00 a 20:00. Fuera de ese horario llama a seguridad, extensión 5599. Antes de salir, recoge las sillas, borra la pizarra, apaga el proyector y cierra las ventanas para quien reserve la sala después.»»

## Intent

Hoy el aviso de sala solo dice qué sala y qué día. Quien reserva no sabe a quién llamar ni qué dejar hecho al salir. Éxito: `aviso.md` termina con el párrafo de conserjería exacto y el gate de cierre de `operations.md` (`node --test && node scripts/lint.mjs`; la constitución pide `node --test` entero) sigue en verde. Fracaso aunque «funcione»: que el párrafo salga con una palabra cambiada, o que el gate quede en rojo por el tope de palabras.

## Scope

- Entra: añadir el párrafo al final de `docs/plantillas/aviso.md`; subir el tope de `test/words.test.js` a 114; un test del literal en `test/aviso.test.js`.
- No entra: tocar `recibo.md`; sustituir `{sala}` y `{dia}` (ningún código lee hoy estas plantillas); añadir fila al roadmap; cambiar `src/app.js`.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Tope de 60 palabras de `docs/plantillas` | `test/words.test.js:5` (título) y `:7` (`<= 60`) | Scope y decisión 1: pasa a 114 |

- Filas que implementa: nada: comprobado con `git grep -niE "0014|conserjer|5500|5599" -- . ':!.docs/sdd/specs'` (sin resultados; `0008` «Avisos por correo» es otra cosa, no lee `aviso.md`).

## Approach

- A — Añadir el párrafo y subir el tope del test a 114: tres ficheros (`aviso.md`, `words.test.js`, `aviso.test.js` nuevo), el texto queda como se pidió, el margen de 20 palabras evita volver a tocar el test por una errata.
- B — Añadir el párrafo y recortar `recibo.md` hasta que quepa en 60: no cambia el test, pero edita un documento no pedido y deja el tope casi sin margen.
- C — Quitar el tope: el test deja de proteger nada.
- Elegido: A — es lo único que cumple lo decidido (texto literal) sin tocar nada más; si el tope es una restricción que quieres mantener, B es la alternativa y lo dices en el gate.

El párrafo se añade con una línea en blanco de separación.

## Dónde se prueba

- Párrafo presente y literal: `test/aviso.test.js` (nuevo), igualdad exacta del fichero, leyendo `docs/plantillas/aviso.md` como lo hace el test de palabras.
- Tope: el test existente de palabras, con el valor nuevo.
- Gate: `node --test && node scripts/lint.mjs`.

Escenarios (no son delta de capacidad: es un documento):

- GIVEN `aviso.md` con `Aviso de sala: {sala} el {dia}.` · WHEN se añade el párrafo · THEN el fichero es exactamente `Aviso de sala: {sala} el {dia}.` + línea en blanco + `Conserjería: extensión 5500, de lunes a viernes de 8:00 a 20:00. Fuera de ese horario llama a seguridad, extensión 5599. Antes de salir, recoge las sillas, borra la pizarra, apaga el proyector y cierra las ventanas para quien reserve la sala después.` + salto de línea.
- GIVEN `aviso.md` con el párrafo (42 palabras) y `recibo.md` (46) · WHEN corre `node --test` con el tope en 114 · THEN el total es 94 ≤ 114 y pasa. Este escenario no prueba el párrafo (lo prueba el 1): es la verificación del RED, que antes de editar el valor el test de palabras con el párrafo añadido falle con 94 > 60.
- Lint: `scripts/lint.mjs` solo cuenta tabuladores en `src/app.js`; no mira `docs/` ni `test/`, y el spec no lo toca. Línea base: `node --test` pasa 5/5 hoy.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Topes de palabras

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `docs/plantillas` (`aviso.md` + `recibo.md`) | 52 / 60 (`node -e` con el `split(/\s+/)` del test → 52) | 8 | 52 + 42 + 20 = **114** (el párrafo mide 42 con `wc -w`; el 20 es criterio mío, el mínimo del método de topes del kit) |

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
