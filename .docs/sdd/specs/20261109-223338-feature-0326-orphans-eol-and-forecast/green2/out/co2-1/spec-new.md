---
id: 20261110-110049-feature-0014-notice-room
feature: 0014
title: Teléfono de conserjería en la plantilla del aviso
mode: full
status: draft
created: 2026-11-10
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Teléfono de conserjería en la plantilla del aviso

🦆 El aviso de sala gana una segunda línea con el teléfono de conserjería: «Aviso de sala: Norte el 2026-11-12.» seguido de «Conserjería: 5500». Solo cambia el texto de la plantilla `docs/plantillas/aviso.md`; ningún comando la lee todavía. Un test nuevo fija la línea, y el tope de 60 palabras de las plantillas sigue cumpliéndose (de 52 a 54).

Validación: agente — es un documento de texto y un test mide el literal; si prefieres verlo tú, dilo en el gate y pasa a `dev-lead`.

## Capacidades

- Ninguna, porque docs (plantilla de texto; el proyecto no tiene `capabilities/` y ningún comando consume la plantilla).

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor con los siete puntos — señales: ninguna (sin capacidad, sin contrato público, sin `MODIFIED`, sin datos) · tamaño: ~2 líneas en 2 ficheros
- Dominio+técnica (sonnet): si el literal «Conserjería: 5500» es idéntico en Intent, Scope y los THEN de «Dónde se prueba», y si el tope de 60 palabras de `test/words.test.js` se mide bien (52 → 54) (señal: tope de palabras sobre `docs/plantillas/`)
- Mínimo razonable: sin revisión — deja sin mirar una incoherencia de literales o un conteo de palabras mal hecho en una spec de dos líneas

1. **Carril y modo**: feature, modo full, porque pediste la spec; el cambio cabría en lite o patch, pero un carril que el usuario fija no baja.
2. **Enfoque**: A, añadir la línea al final de `aviso.md`, frente a B y C (ver Approach).
3. **Posición y forma**: la línea va **después** de la existente, en línea propia, sin punto final (tal cual tu literal «Conserjería: 5500») y con el salto de línea final que ya tiene el fichero.
4. **Test nuevo** `test/aviso.test.js` que lee `docs/plantillas/aviso.md` y comprueba que contiene la línea `Conserjería: 5500`: la constitución pide tests antes que código y sin él nada fija el literal. Alternativa: sin test nuevo, solo el de palabras (más barato, pero un borrado de la línea pasaría el gate).
5. **Sin capacidad ni delta**: no hay `capabilities/` en el proyecto y nada renderiza la plantilla, así que no hay comportamiento observable que fusionar. Por eso no hay prueba del delta sobre una copia (`sdd capability merge`): no hay delta que probar.
6. **Validación: agente** (ver arriba): documento medido por un test. Si no estás de acuerdo, cámbialo a `dev-lead`.
7. **Sin fila de roadmap**: el roadmap no tiene fila para la 0014 (la rama `feature/0014-notice-room` ya existía y `sdd id claim` confirmó que la 0014 vale, «contador local»). No la añado: el cierre decide si hace falta.
8. **Política de modelos**: revisor de la spec: uno, sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` (3 por defecto).
9. **Gate de cierre**: el del proyecto (`operations.md`): `node --test && node scripts/lint.mjs`; no lo cambio.
10. **Nombre del test**: `test/aviso.test.js`, junto a los demás de `test/`. Compara cada línea con `split(/\r?\n/)` y de forma exacta, sin `trim`.
11. **Fila de roadmap**: decido que no se añade (la 0014 no la tiene); si la quieres, dímelo en el gate.
12. **El 5500** es un dato que diste tú; la spec no lo parametriza ni declara reglas de datos (no hay `capabilities/` donde declararlas).

### Hallazgos de la review

- **Aceptado** — 2: «termina con» no lo fija el THEN → dos escenarios más: la última línea no vacía es la nueva, y la original se mantiene.
- **Aceptado** — 3: separador y GIVEN poco claros → `split(/\r?\n/)`, comparación exacta y GIVEN como estado inicial real (decisión 10, «Dónde se prueba»).
- **Aceptado** — 4: decisiones sueltas en el cuerpo → decisiones 9, 10 y 12.
- **Aceptado** — 5: regla de conteo sin citar → «Topes de palabras» cita `split(/\s+/)` del test.
- **Aceptado** — 6: decisión diferida sin responsable → decisión 11, la tomo yo.
- **Aceptado** — 1 (en parte): «cliente» fuera del 🦆. **Rechazado** lo demás → «dev-lead» es el rol que el kit y tú usáis para quien decide; la salida de la validación a `dev-lead` se queda.
- **Rechazado** — 7: declarar el 5500 como regla de datos → el proyecto no tiene capacidades ni «Reglas de producto» donde ponerla y es un literal dado por ti.

### Decisiones tomadas con el dev-lead

- Añadir a `docs/plantillas/aviso.md` una línea con el teléfono de conserjería — «Conserjería: 5500»

## Intent

Hoy el aviso de sala dice solo `Aviso de sala: {sala} el {dia}.` y quien lo recibe no sabe a quién llamar si algo falla. El dev-lead decidió que la plantilla lleve el teléfono de conserjería. Éxito: `aviso.md` termina con la línea `Conserjería: 5500` y el conjunto de `docs/plantillas/` sigue en 60 palabras o menos. Fracaso aunque «funcione»: que la línea haga pasar el tope (52 + 2 = 54, hay margen) o que se pierda sin que ningún test lo note.

## Scope

- Entra: `docs/plantillas/aviso.md` gana la línea `Conserjería: 5500`, después de la existente.
- Entra: `test/aviso.test.js`, test nuevo que fija esa línea.
- No entra: `docs/plantillas/recibo.md`, `{sala}` y `{dia}`, cualquier código que lea o rellene plantillas (no existe), el aviso por correo de la fila 1 del roadmap, cualquier otro teléfono o formato de número.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `aviso.md` gana una línea fija (cambio de forma de la plantilla) | `docs/plantillas/aviso.md:1` | Scope |
| Tope de 60 palabras del directorio de plantillas | `test/words.test.js:5-6` | Tabla «Topes de palabras»: 52 → 54, no cambia el test |
| «Avisos por correo antes de la reserva» (nombra «aviso», otra cosa) | `.docs/sdd/roadmap.md:9` | Sin cambio: es la fila 1, no usa esta plantilla |

- Filas que implementa: 0014 → nada: comprobado con `git grep -n -iE "Conserjer|5500|0014"` (sin resultados antes de crear la carpeta; ni el literal ni el id aparecen en el repo).

## Approach

- A. Añadir la línea al final de `aviso.md` — cuesta una línea y 2 palabras; sin infraestructura.
- B. Un fichero nuevo `docs/plantillas/conserjeria.md` — cuesta más palabras del tope y nadie lo incluye en el aviso: no hay mecanismo de inclusión.
- C. Un marcador `{telefono}` en el aviso, rellenado por código — ningún código rellena plantillas hoy y el dev-lead dio el literal.
- Elegido: A — es lo que se pidió, literal, y es la única vía que no inventa infraestructura.

El RED es el test nuevo: falla hoy porque `aviso.md` no contiene la línea; con la línea, pasa. El tope de palabras lo cubre `test/words.test.js`, que ya existe.

## Dónde se prueba

- La línea del aviso: `test/aviso.test.js`, mismo patrón que `test/words.test.js` (lee el fichero de `docs/plantillas/` con `node:fs`; `node --test`). Se parte con `split(/\r?\n/)` y se compara exacto.
  - GIVEN `aviso.md` con la línea añadida · WHEN se lee y se parte por líneas · THEN la última línea no vacía es exactamente `Conserjería: 5500`.
  - GIVEN `aviso.md` con la línea añadida · WHEN se lee y se parte por líneas · THEN la primera línea sigue siendo `Aviso de sala: {sala} el {dia}.`
  - RED: hoy falla porque `aviso.md` tiene una sola línea y su última línea no vacía es la del aviso.
- El tope: `test/words.test.js` existente (52 → 54 ≤ 60). Gate de cierre: `node --test && node scripts/lint.mjs`.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Topes de palabras

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `docs/plantillas/` (suma de `aviso.md` 6 + `recibo.md` 46; `test/words.test.js`, que cuenta con `split(/\s+/)`: `{sala}` y `Conserjería:` son una palabra cada una) | 52 / 60 | 8 | sin cambio (medido 52 + previsto 2 = 54, margen 6) |

## Enmiendas

_Ninguna._

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
