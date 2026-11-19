---
id: 20261119-161159-feature-0014-aviso-conserjeria
feature: 0014
title: Párrafo de conserjería al final del aviso de sala
mode: lite
profile: delegate
status: draft
created: 2026-11-19
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Párrafo de conserjería al final del aviso de sala

🦆 El aviso de sala acaba con un párrafo nuevo: dice a quién llamar (conserjería, ext. 5500, de lunes a viernes de 8:00 a 20:00; fuera de ese horario, seguridad, ext. 5599) y qué dejar listo antes de salir (sillas, pizarra, proyector, ventanas). Es un cambio de la plantilla: hoy nada del programa lee `aviso.md`, así que el párrafo queda en el documento. Para que quepa hay que subir el tope de 60 palabras que el test impone a `docs/plantillas/`, porque hoy esa carpeta ya tiene 52 y el párrafo suma 42.

Validación: dev-lead — es un texto que leen personas y el tope de palabras es una regla suya.

## Capacidades

- Ninguna, porque docs.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: un revisor — señales: ninguna (sin capacidad nueva ni MODIFIED; docs) · tamaño: ~10 líneas en 2 ficheros
- Único (sonnet): si el test nuevo detecta la falta del párrafo aunque el tope de 114 pase, y si el 52 + 42 + 20 cuadra (Scope, ✋ 1)
- Mínimo razonable: sin review — deja sin mirar si el test nuevo falla de verdad sin el párrafo
```

1. **Tope de `docs/plantillas/` en `test/words.test.js`: de 60 a 114 palabras.** Pendiente de tu OK. Medido con el conteo del propio test: 52 palabras hoy (`aviso.md` 6 + `recibo.md` 46) + 42 del párrafo = 94, y 94 > 60: el test fallaría. Tope = 94 + margen de 20 (regla de la plantilla: 2 % con mínimo 20 palabras) = 114. Alternativas que no tomo: acortar el párrafo (contradice tu texto literal) o recortar `recibo.md` (otro documento que nadie ha pedido tocar).
2. El párrafo va **en una línea propia, separada del aviso por una línea en blanco**, y el fichero acaba en salto de línea como hoy — formato que nadie dijo.
3. El párrafo se copia **literal**, con su puntuación y tildes, sin variables `{…}`: no depende de la sala ni del día.
4. Id **0014** tomado del nombre de la rama `feature/0014-notice-room`; no hay fila 0014 en `ROADMAP.md` y no he podido reservarlo con `sdd id claim` (el comando `sdd` no está disponible aquí). Pendiente.
5. Slug de la carpeta `aviso-conserjeria` y modo `lite` (un fichero de texto y un test, menos de 4 tasks).
6. Test nuevo en `test/words.test.js` (no en un fichero aparte) y con `trimEnd()` para ignorar el salto final; texto del título del test: pasa a `docs/plantillas cabe en su tope de 114 palabras`, para que el nombre diga lo que mide.

- Política de modelos: revisor de la spec en sonnet (uno, lite) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents`

### Hallazgos de la review

Un revisor (Sonnet, los siete puntos: lite).

- **Rechazado** (Crítico) — «ningún requisito lleva escenario GIVEN/WHEN/THEN» → la spec no tiene delta (Capacidades: «Ninguna, porque docs», sin `capabilities/` en el proyecto); el escenario va en «Dónde se prueba». Lo útil del hallazgo sí entra: ahí se dice que el test del tope no ve la falta del párrafo y que la ve el test nuevo.
- **Aceptado** — `endsWith` fallaría por el salto de línea final → `trimEnd()` y comprobar `<línea en blanco> + párrafo`; el test nace en rojo.
- **Aceptado** — test nuevo y renombrado fuera de «Entra» → añadidos al Scope y a ✋ 6.
- **Aceptado** — el Intent prometía un efecto que nada entrega → Intent y 🦆 dicen que es cambio de plantilla; «No entra» anota que quién la consumirá es otra tarea.
- **Rechazado** — el gate debería ser solo `node --test` → el gate de cierre es el de `operations.md`, `node --test && node scripts/lint.mjs`; el Intent ya lo cita así.
- **Rechazado** — la rama no sigue `feature/<id>` y falta `develop` → `develop` existe (`git branch`); la rama `feature/0014-notice-room` ya lleva el id y es la que reserva `nombrado.md` (`feature/<id>-<slug>`).
- **Rechazado** — «dev-lead» no existe en PRODUCT.md → es el rol del kit para quien aprueba; aquí lo ejerce el único desarrollador. Los `approvers` se rellenan al aprobar.
- **Aceptado** — margen y columnas del tope → columnas separadas y el 20 mínimo explicado.
- **Rechazado** — fuente de los datos y glosario → la fuente es la decisión del dev-lead (abajo); «conserjería» y «seguridad» son palabras del párrafo, no términos del producto.
- **Aceptado** — fila de «Lo que se retira» que era una adición, «Filas que implementa» ambigua y CHANGELOG → fila quitada, línea reformulada, CHANGELOG en «No entra».

### Decisiones tomadas con el dev-lead

- `docs/plantillas/aviso.md` añade al final el párrafo de conserjería — «Conserjería: extensión 5500, de lunes a viernes de 8:00 a 20:00. Fuera de ese horario llama a seguridad, extensión 5599. Antes de salir, recoge las sillas, borra la pizarra, apaga el proyector y cierra las ventanas para quien reserve la sala después.»

## Intent

Hoy la plantilla del aviso de sala es una sola línea, `Aviso de sala: {sala} el {dia}.`, y no dice a quién acudir ni qué dejar recogido para quien reserve después. Éxito: la plantilla termina con el párrafo acordado, palabra por palabra, y el gate de cierre (`node --test && node scripts/lint.mjs`, el de `operations.md`) sigue en verde. Anti-goal: que el párrafo salga recortado o reescrito para esquivar el tope.

## Scope

- Entra: añadir el párrafo al final de `docs/plantillas/aviso.md`; en `test/words.test.js`, subir el tope a 114, renombrar su título y añadir el test nuevo del párrafo.
- No entra: tocar `recibo.md`; el código de `src/app.js` (nada lee hoy `aviso.md`: comprobado con grep; quién consumirá la plantilla es otra tarea, sin fila en el roadmap); cambiar el horario o las extensiones, o parametrizarlos; el `CHANGELOG.md` (lo escribe el corte de la release).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Tope «60 palabras» de `docs/plantillas` | `test/words.test.js:5` (título) y `:8` (`<= 60`) | decisión 1 y 6: pasa a 114 |

- Filas que implementa: nada: comprobado con `grep -n 0014 ROADMAP.md CHANGELOG.md` (sin resultados)

## Approach

- A. Subir el tope del test y conservar el párrafo literal — coste: dos números en un test; el límite sigue existiendo, más holgado.
- B. Acortar el párrafo hasta caber en 60 — descartado: contradice el texto literal decidido y, aun así, solo quedarían 8 palabras (60 − 52).
- C. Recortar `recibo.md` (46 palabras) para hacer sitio — descartado: toca un documento fuera de la petición.
- Elegido: A — el párrafo es decisión del dev-lead y el tope es una regla del proyecto que el propio dev-lead puede mover; se le pide el OK en el gate (✋ 1).

## Dónde se prueba

- Tope de palabras: `test/words.test.js`, el test existente de `docs/plantillas`, con el nuevo tope.
- Párrafo presente y al final de `aviso.md`: test nuevo en `test/words.test.js`, con `readFileSync` como el test actual. Escenario: GIVEN `aviso.md` con la línea del aviso y el párrafo, WHEN se lee y se le quita el salto de línea final (`trimEnd()`), THEN termina en una línea en blanco seguida del párrafo literal. Nace en rojo antes de tocar `aviso.md` (constitución, punto 2).
- Tope: el test existente, con 114. Por sí solo no detecta que falte el párrafo (52 ≤ 114): eso lo detecta el test nuevo; no se fija un piso del recuento, porque sería otro número que mantener.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Topes de palabras

| Fichero | Medido | Tope vigente | Margen | Tope propuesto |
| --- | --- | --- | --- | --- |
| `docs/plantillas/` (todos los ficheros, conteo de `test/words.test.js`) | 52 | 60 | 8 | 52 + 42 + 20 = 114 (el 2 % de 94 es 1,9, así que manda el mínimo de 20; el 42 sale de `node -e` con el mismo `split(/\s+/)`) |

### Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec: 0,3 h
- Estimación de implementación: 0,3 h
- Base de la estimación: dos ficheros, un texto literal y un número; sin incertidumbre.
- Confianza: alta

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
