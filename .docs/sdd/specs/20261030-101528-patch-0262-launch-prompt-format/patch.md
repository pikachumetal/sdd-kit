---
id: 20261030-101528-patch-0262-launch-prompt-format
task: 0262
title: Patch — el prompt de arranque se ve distinto del resto del chat y va bien explicado
type: patch
solution: dev-lead
status: done
created: 2026-10-30
branch: patch/0262-launch-prompt-format
commit: 0fb90494
---

# Patch 0262 — El prompt de arranque se ve distinto del resto del chat y va bien explicado

## Capacidades

- Modificadas: `routing` — el prompt de un config sale con la forma nueva
- Modificadas: `planning` — el prompt de una fila sale con la forma nueva

## 1. Síntoma

Del dev-lead, 2026-10-30, al leer los prompts en el terminal: no los distingue del resto del chat y le llegan cada vez más esquemáticos («que lo escriba la skill de escribir para el agente»).

## 2. Solución fijada

Del dev-lead, en la fila 0262 del roadmap: título en `###` y cursiva con el emoji del carril (🩹 patch, ✨ feature, 🪶 lite, ⚙️ config, 🔬 spike); `***Nombre:***`, `***Base:***` y `***Carril:***` seguidos, con el valor en código en línea y sin líneas en blanco; `***Prompt***` en su línea; el texto en un bloque de código sin lenguaje; «si prefieres hacerlo en esta sesión, di "arráncalo"» en cursiva. El texto cuenta el alcance, lo que queda fuera con la fila que lo lleva, qué leer antes con sus rutas, la deuda que salda y cómo se cierra.

Lo que da por existente, comprobado: `launch-prompt-template.md`, `tests/batteries/sdd-explore/battery.md` (E2) y `tests/batteries/sdd-roadmap/battery.md` (M1).

## 3. Fix

- **Fichero(s)**: `skills/sdd-templates/templates/launch-prompt-template.md`, `tests/batteries/sdd-roadmap/battery.md`, `tests/batteries/sdd-explore/battery.md`, `tests/batteries/sdd-archive/battery.md`, `CLAUDE.md`
- **Cambio**: la plantilla pasa a la forma de la fila y su bloque «Cómo se redacta» y el hueco del prompt piden alcance, fuera de alcance, decisiones con su porqué, lecturas, deuda y criterio de hecho; «Decisiones ya tomadas» y «Al fusionar» siguen como estaban. Las filas M1, E2 y Q1 y la regla 4 de `CLAUDE.md` dejan de fijar la rama sola en su bloque.
- **Decisiones**:
  - Forma literal, bloque sin lenguaje y dos espacios al final de las etiquetas — dev-lead
  - `sdd-roadmap`, `sdd-explore` y `records.md` no se editan: trazan desde la plantilla — sin el dev-lead (saldo de palabras 0; la plantilla baja de 524 a 517)

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED: `m1` y `e2` con el kit de la base | ✅ 4/4 con la forma vieja (rama sola en su bloque, ```` ```text ````, sin alcance ni criterio): las filas nuevas M1 y E2 fallan |
| 2 | GREEN: `m1` y `e2` con la plantilla nueva (`red/out`, `green/out`) | ✅ 4/4 con título, etiquetas, bloque sin lenguaje, alcance, fuera de alcance, lecturas, criterio de hecho y frase en cursiva; 8:00 de la enmienda en m1; sin escrituras en el molde |
| 3 | Saldo de palabras | ✅ plantilla de 524 a 517; ninguna `SKILL.md` editada |
| 4 | Bloque sin lenguaje en azul en el terminal del dev-lead | ✅ visto en captura de Orca, en otra sesión con un bloque sin lenguaje |
| 5 | Dos espacios: las tres etiquetas en líneas seguidas en el terminal | no probado: la captura enseña otra sesión y no cambié la vista del dev-lead; `orca terminal read` no llega a la muestra de esta sesión |

Gate: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop` → kit:test-headless: corrió 256/256 · cli:test: corrió 1672/1684 · cli:typecheck: saltada (`--affected`: sus `inputs` no cambian), sobre 0fb90494

Validación en campo: 2026-10-30 · m1 y e2: RED 4/4 con la forma vieja, GREEN 4/4 con la nueva · azul del bloque sin lenguaje visto en captura de otra sesión · no probado: los saltos de línea de las tres etiquetas en el terminal del dev-lead

## 5. Tiempo (ligero)

- Estimación: 0,75 h + 0,2 h del gate de cierre (12 min, patch 0245)
- Inicio: 2026-10-30T10:15Z
- Esfuerzo real: 0,14 h — reloj de la sesión 0,14 h desde 2026-10-30T10:14Z, sin 0 min de espera al dev-lead (0 esperas). Por debajo de lo estimado porque la forma llegó literal en la fila
- Coste de sujetos: 1,21 $ en 8 sujetos Sonnet — RED 0,63 $; GREEN 0,58 $

## 6. Delta de capacidad

### Capacidad: `routing`

#### MODIFIED — Un config que sale de explore da su prompt directo

- GIVEN el molde `salas`, con `control.profile: delegate` y `merge.push: true` en `sdd-kit.json`
- WHEN el usuario escribe «Estoy pensando en subir `node` a 22.18 en los `engines` de `package.json`. ¿Rompe algo? Si no, dame el prompt para hacerlo en otro worktree.»
- THEN `sdd-explore` responde y termina con el prompt de arranque en la forma de `launch-prompt-template.md`: el título en `###` y cursiva con ⚙️, «Subir el mínimo de Node a 22.18», sin id; `***Nombre:***` con `feature/<slug>`, `***Base:***` con `develop` y `***Carril:***` con `config`, en líneas seguidas y con el valor en código en línea; `***Prompt***`; y un bloque de código sin lenguaje, que arranca con `sdd-propose` y su carril, con alcance, fuera de alcance, criterio de hecho, «Nada que saldar», `Perfil delegate` y «Al fusionar, `sdd merge --push`»
- AND no escribe fila en el roadmap ni reserva id
- AND «¿Podemos subir `node` a 22.18? Si se puede, lo quiero.», sin pedir el prompt, es una petición de cambio: entra por `sdd-propose` como config (0160)
- AND termina con *si prefieres hacerlo en esta sesión, di "arráncalo"*, en cursiva, y con «arráncalo» invoca `sdd-propose`

### Capacidad: `planning`

#### MODIFIED — Dame el prompt de una fila da su prompt de arranque

- GIVEN el molde `salas` con la fila pendiente 0013 «Aviso semanal a los responsables», `proposal: 0010`, `control.profile: delegate` y `merge.push: true` en `sdd-kit.json`
- WHEN el usuario escribe «dame el prompt de la 0013»
- THEN `sdd-roadmap` da el prompt de arranque en la forma de `launch-prompt-template.md`: el título en `###` y cursiva con el emoji del carril, «0013 — Aviso semanal a los responsables»; `***Nombre:***` con `feature/0013-<slug en inglés>`, `***Base:***` con `develop` y `***Carril:***`, en líneas seguidas y con el valor en código en línea; `***Prompt***`; y un bloque de código sin lenguaje, que arranca la 0013 con `sdd-propose`, con alcance, fuera de alcance, las lecturas con la propuesta 0010 y la fila, las decisiones de la propuesta y sus enmiendas que tocan a la 0013, las filas que salda o «Nada que saldar», el criterio de hecho, `Perfil delegate` y «Al fusionar, `sdd merge --push`»
- AND no escribe en el roadmap ni en la propuesta, no reserva id, no publica ni commitea, y no arranca la feature
- AND si la fila está cerrada (✅, 🧪) o en marcha (🔄 o rama `feature/0013-*` abierta), lo dice en vez de dar el prompt
