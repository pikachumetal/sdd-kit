---
id: 20261103-130212-feature-0299-own-skills-audit
feature: 0299
title: Walkthrough — Auditoría de las skills con las tres reglas del dev-lead
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-03
---

# Walkthrough — Auditoría de las skills con las tres reglas del dev-lead

## 1. Cambios realizados

Solo la carpeta del spike; ninguna skill, plantilla ni test cambia.

- Apertura: `spec.md` y `plan.md` (`ff8e93b2`).
- Task 1, candidatos mecánicos: `scripts/rules.mjs` y `out/exceptions.md`, `out/shared.md` y `out/tickets.md` sobre `skills/` en `8e22a49f`: 59 excepciones, 148 bloques repetidos y 78 citas de ticket (`59bf3435`).
- Task 2, las 11 propias: `own.md`, `findings-own.json` y `scripts/render.mjs`, que escribe cada hallazgo con su frase literal, su `fichero:línea` y su sha de `git blame`: 20 hallazgos (`fbd31fa`).
- Task 3, la capa del kit de las 11 copias: `copies.md` y `findings-copies.json`: 36 hallazgos, con los 5 de `fork-audit.md` citados (`db227bb`).
- Task 4: `research.md`, con la tabla por skill de las 22, las reglas repetidas, los descartes, lo no leído y la propuesta de §5 (`bd8a58e`).
- Pasada de fix de la revisión final (juntada en el cierre): los 630 bloques bajo el umbral, leídos con 3 subagentes Sonnet (`out/shared-low*.md`), el veredicto por id de las citas de ticket (`out/tickets-verdicts.md`), K22 retirado, K37 y K38 y P21 nuevos, O5 medido sobre la pareja; y el arreglo de la re-revisión en `ticket-verdicts.mjs`.

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 3,5h
- Esfuerzo real: 0,95 h — reloj de la sesión 2,01 h desde 2026-11-03T13:00Z, sin 64 min de espera al dev-lead (6 esperas)
- Desviación: −2,55 h (−73 %)
- Causa de la desviación: 64 min de espera al dev-lead fuera del esfuerzo (13:03Z 38 min; 13:42Z 3 min; 13:46Z 5 min; 13:51Z 1 min; 13:53Z 3 min; 14:23Z 13 min); la lectura de los 630 bloques bajo el umbral la hicieron 3 subagentes en paralelo (6-10 min cada uno), fuera del reloj del hilo
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: 40.135.755 — claude-opus-5-5 40.135.755
- Tokens de subagentes: 19.563.086 en 5 despachos — Bloques bajo umbral S359-S568 claude-sonnet-5-5 5.403.190 / 9 min; Re-revisión única del spike 0299 claude-opus-5-5 3.244.134 / 6 min; Bloques bajo umbral S149-S358 claude-sonnet-5-5 4.242.514 / 10 min; Bloques bajo umbral S569-S778 claude-sonnet-5-5 2.381.573 / 6 min; Final review — Spec axis claude-opus-5-5 4.291.675 / 7 min
- Coste de la sesión: 24,29 $ (hilo 14,81 $ + subagentes 9,47 $)
- Coste de sujetos: no aplica
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- Las Tasks 2 y 3 se leyeron en una sola pasada y se commitearon por separado: los candidatos cruzan propias y copias.
- `render.mjs` no estaba en el plan: sale de la Restricción de código de citar con la frase literal y el sha, sin depender de copiarlos a mano.
- El O5 (la distancia entre las dos frases) entró en la spec en el gate, por la idea del dev-lead de agrupar las reglas.
- Desvío: el freno de 300 de la spec se esquivó en la Task 1 con un umbral de 5 frases (285 candidatos en vez de 915). Lo vio la revisión final; el dev-lead eligió leer los 630 restantes con subagentes (enmienda de la spec, «1»).

### Decisiones tomadas sin el dev-lead

- Task 1: Ruling: umbrales que el plan no fija — compartidas con >= 5 frases de 6 palabras (las de 1-4 son frases hechas: 630 de 778) y tickets solo como cita (tests/…-red.md, field-reports/, «ticket de la», «dev-lead, 20»), no la palabra «ticket», que en sdd-feedback y sdd-roadmap es el dominio — coste si es erróneo: una regla repetida en menos de 10 palabras queda sin candidato
- Task 1: Ruling: base movida (fila 0300 nueva en roadmap de develop; la 0299 no cambia; solo .docs/sdd/roadmap.md, que la task no toca) — sigo — coste si es erróneo: ninguno
- Task 2: Ruling: las Tasks 2 y 3 se leyeron en una pasada, porque los candidatos cruzan propias y copias (un mismo bloque repetido tiene un sitio en cada lado); cada hallazgo va a la skill donde está su primer sitio — coste si es erróneo: ninguno, la tabla por skill cita también los sitios secundarios
- Task 2: Ruling: el sha de las citas es el de git blame (último commit que tocó la línea); el commit que introdujo cada frase, cuando difiere y se rastreó con git log -S, va en la nota del hallazgo — coste si es erróneo: un origen que apunta al commit que movió o tradujo el texto (4597d47e, 0490c649, 33d0d0b7, 2d738fbd), como avisa provenance.md
- Final: Ruling: el subagente 3 leyó unidades largas cortadas a ~650 caracteres y el 2 decidió 53 descartes de plantilla/preámbulo/frontmatter/fuente por la frase compartida — se declara en research §2.5, sin otra relectura — coste si es erróneo: alguna regla repetida más sin contar en esas clases
- Final: Ruling: el hilo reclasificó a fuente S149, S150, S218, S219, S295 y S334 (superpowers 7.0.0 ya repite el texto) y S211 de K2 a K5 — contrastado con el clon de superpowers v7.0.0 — coste si es erróneo: 6 parejas menos en sdd-agent-writing y sdd-tdd

**✋** sin revisar: el arreglo posterior a la re-revisión, juntado en el cierre — veredicto leído de las citas de ticket sin origen rastreable (`ticket-verdicts.mjs`) y los Minor de la re-revisión

## 4. Verificación

### 4.1 Builds

- Gate: la rama solo toca `.docs/` y `*.md` (los scripts del spike viven en `.docs/sdd/specs/…/scripts/`): no corre nada («Running a gate» de `sdd-verify`, punto 1). Los scripts se ejecutaron en la sesión y reproducen sus salidas commiteadas (`rules.mjs`, `render.mjs`, `low-summary.mjs`, `ticket-verdicts.mjs`).

### 4.2 Smoke / tests

- Validación en campo: 2026-11-03 · objetivos O1-O6 con ejecución real de los scripts sobre `8e22a49f` · revisión final Spec opus+high sobre bd8a58e4, con fixes; re-revisión opus+high, 5 de 6 resueltos y el sexto arreglado en el hilo, 1 sin revisar

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| O1 — las 11 propias, 100 % de candidatos resuelto | ejecución real | 21 hallazgos y 23 parejas nuevas; cada candidato con veredicto por id |
| O2 — la capa del kit de las 11 copias | ejecución real | 37 hallazgos y 41 parejas nuevas; los 5 de `fork-audit.md` citados |
| O3 — `fichero:línea`, tipo, dos frases y commit | ejecución real | `render.mjs` reproduce `own.md` y `copies.md` desde `8e22a49f`; las 135 parejas bajo el umbral, sin commit de origen |
| O4 — reglas repetidas entre skills | ejecución real | 33 en §2.3 y 68 parejas bajo el umbral |
| O5 — distancia | ejecución real | C/X 10 de 10 en la unidad; D 31 de 47 en otra skill |
| O6 — research con 22 filas, descartes, no leído y §5 | ejecución real | `research.md`, 22 filas comprobadas por script |

### 4.3 Residuales / deuda generada

- La propuesta de §5 del research va a `sdd-roadmap`, en la sesión `develop`, con las filas «por abrir» y las entradas «para la 0300».

## 5. Aprendizajes

- Las excepciones pegadas están al lado de su regla y las reglas repetidas, en otra skill: agrupar por tema no habría evitado las primeras; una fuente única por regla, sí, las segundas → `research.md` §4 y §5, para la propuesta de `sdd-roadmap` y la 0300.
- Cinco de las nueve excepciones pegadas se añadieron en un cierre o en la pasada de fix de una revisión final → `research.md` §2.2.
- Un umbral para que quepa en el freno es esquivar el freno: el freno se compara con la definición de la spec, y si no cabe se para → ticket del kit.

Retro: documento o skill desmentido → ticket del kit: «Deviations and rulings» de `sdd-implement` enumera los frenos de alcance (tercer arreglo, salida observable, fila o líneas cambiadas en la base) y no nombra el freno que declara la propia spec de un spike («si pasa de 300, para»); la sesión lo resolvió con un ruling, cambiando la definición de candidato, y solo lo paró la revisión final.

## 6. Adendas
