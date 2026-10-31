---
id: 20261031-160126-patch-0266-prose-questions
task: 0266
title: Patch — las skills preguntan en prosa con opciones numeradas
type: patch
solution: dev-lead
status: done
created: 2026-10-31
branch: patch/0266-prose-questions
commit: 46607f4d
---

# Patch 0266 — las skills preguntan en prosa con opciones numeradas

Validación: dev-lead — `validation.mode: field`: la valida el uso real, a través de los tickets.

## Capacidades

- Modificadas: `interviewing` — una decisión operativa va en prosa, como la de diseño
- Modificadas: `routing` — patch y config preguntan en prosa
- Modificadas: `feature-flow` — el gate de la spec, sus opciones y la validación, sin la herramienta

## 1. Síntoma

«lo de askuser tapa el ultimo mensaje»: en la 0224, el dev-lead rechazó el gate de la spec porque no podía leerlo. Repetido en prosa con tres opciones numeradas, se contestó con «Apruebo» ([ticket de la feature 0224](../../field-reports/20261030-131105-feature-0224-coherence-pass-and-cost-slot.md) §3).

## 2. Solución fijada

Del dev-lead, en el prompt de arranque: «Sustituir AskUserQuestion por la pregunta en prosa al final del mensaje, con las opciones numeradas y la recomendada primero; el turno acaba ahí». Sin clave en `sdd-config`, y una sola forma también en `sdd-grilling`. La causa es un bug del cliente, anthropics/claude-code#75182.

Comprobado lo que da por existente: las menciones que piden la herramienta están donde dice el prompt. Hay tres más, que la prohíben para la validación: la plantilla, `sdd-start-feature` paso 7 y `sdd-archive` paso 1.

## 3. Fix

- **Fichero(s)**: `skills/sdd-propose/SKILL.md`, `skills/sdd-grilling/SKILL.md`, `skills/sdd-start-feature/SKILL.md`, `skills/sdd-start-feature/references/control-profiles.md`, `skills/sdd-archive/SKILL.md`, `skills/sdd-templates/templates/validation-template.md`, `tests/batteries/sdd-propose/battery.md`, `.docs/sdd/mission.md`
- **Cambio**: las preguntas operativas y de gate van en prosa al final del mensaje, con las opciones numeradas, la recomendada primero, y el turno acaba ahí. Las prohibiciones de la validación dejan de hacer falta y salen.
- **Decisiones**:
  - Forma y alcance de la pregunta — dev-lead
  - Sin clave en `sdd-config` — dev-lead
  - `sdd-start-feature` paso 7 y `sdd-archive` paso 1 también pierden «nunca con `AskUserQuestion`», aunque el prompt no los nombra: es la misma excepción que la plantilla — sin el dev-lead (no cambia lo que el usuario ve)
  - `capabilities/` y `mission.md` se actualizan: son la verdad viva, no documentos históricos — sin el dev-lead (no cambia lo que el usuario ve)
  - `sdd-propose` paso 4: la tercera opción del gate se enuncia como «A third option», porque la primera redacción la perdió en 2 de 2 sujetos — sin el dev-lead (el gate no cambia)
  - Rúbrica G1: «la recomendada, la primera», sin exigir «Apruebo»; reescrita tras ver el GREEN: un sujeto que recomienda cambios por una spec con huecos ordena bien. Con esta fila el RED sigue en rojo, sin numerar — sin el dev-lead (no cambia lo que el usuario ve)
  - Se quedan `cli/src/session/clock.ts` y `capabilities/estimation.md`: miden las esperas de cualquier sesión, también las de antes de este patch; `tests/headless/lib.mjs`: el sujeto sigue sin la herramienta; `tech-stack.md`: hechos del arnés — sin el dev-lead (no cambia lo que el usuario ve)

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED, `g1` con el kit de la base, Opus, 2 sujetos | ❌ 2/2 esperado: viñetas sin numerar, «Cambios» primero, y `g1-2` dice «no tengo `AskUserQuestion`». 1,99 $ |
| 2 | GREEN, primera redacción, 2 sujetos | numeradas, al final y sin implementar 2/2, pero la opción de parar antes de la Task 1 cae en 2/2. Redacción descartada. 1,82 $ |
| 3 | GREEN, texto final, 2 sujetos (`green2/out/g1-1`, y `g1-2` leído del stream) | ✅ 2/2: pregunta en prosa, numerada, recomendada primero, tres opciones, sin escribir `plan.md` ni código y sin intentar la herramienta. 1,75 $ |
| 4 | `grep -rn AskUserQuestion skills` | ✅ sin resultados |
| 5 | Saldo con `wc -w`: `sdd-propose` 5352 a 5343, `sdd-grilling` 845 a 841, `sdd-start-feature` 1952 a 1950, `control-profiles` 4791 a 4791, `validation-template` 494 a 463, `sdd-archive` 4615 a 4612 | ✅ baja o igual |

Gate: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop` → kit:test-headless: corrió 269/269 · cli:test: corrió 1674/1686, 12 saltados · cli:typecheck: saltada (sin entradas cambiadas: `--affected`)

Validación en campo: 2026-10-31 · gate en verde y los casos de la tabla, corridos por el agente. No probado: el sujeto headless no tiene la herramienta, así que nada mide que una sesión interactiva no la llame.

## 5. Tiempo (ligero)

- Estimación: 0,75 h + 0,2 h del gate de cierre (12 min, patch 0245)
- Inicio: 2026-10-31T16:01Z
- Esfuerzo real: 0,36 h — reloj de la sesión 0,36 h desde 2026-10-31T15:59Z, sin 0 min de espera al dev-lead (0 esperas)
- Coste de sujetos: 5,56 $ en 6 sujetos Opus — RED 1,99 $; GREEN 1,82 $; GREEN final 1,75 $

## 6. Delta de capacidad

### Capacidad: `interviewing`

#### REMOVED — Una decisión de diseño va en texto con formato fijo; una operativa, con diálogo

#### ADDED — Toda pregunta va en texto: la de diseño con formato fijo, la operativa con sus opciones numeradas

- GIVEN una decisión cuyas alternativas solo se entienden con su consecuencia explicada (más de una línea por alternativa: un coste, una escena, un argumento), como el diseño del RED con o sin persona en bucle
- WHEN el agente la pregunta
- THEN la escribe en texto: ❓ título y cuerpo, las alternativas numeradas de 1 a N, tantas como tenga la decisión (1️⃣, 2️⃣…; 🔀 para una mezcla que se defiende sola), la recomendada como primera alternativa, y ➡️ la recomendada con su razón
- AND los iconos solo marcan alternativas de esa pregunta: para referirse a una de una pregunta anterior usa su nombre («primer turno»), no su icono
- AND una decisión operativa, cuyas alternativas se entienden en una línea sin explicar nada (aprobar o pedir cambios, seguir o parar, confirmar carril y perfil), va al final del mensaje, con las opciones numeradas y la recomendada primero, y el turno acaba ahí
- AND no llama a `AskUserQuestion`: su diálogo tapa el mensaje que explica la pregunta
- AND unas etiquetas cortas no hacen operativa una decisión de diseño: «¿1️⃣ o 2️⃣?» con costes distintos detrás lleva su formato fijo

### Capacidad: `routing`

#### MODIFIED — Un cambio sin comportamiento entra por el carril config

- GIVEN el molde `reservas`, con `operations.md` §Testing «Gate de cierre: `node --test`»
- WHEN el usuario escribe «sube `node` a 22.18 en los `engines` de `package.json`», o «corrige el typo "recervas" del README»
- THEN la primera skill que se invoca es `sdd-kit:sdd-propose`, que lo clasifica como config y pregunta en prosa antes de tocar nada
- REMOVED THEN la primera skill que se invoca es `sdd-kit:sdd-propose`, que lo clasifica como config y pregunta con `AskUserQuestion` antes de tocar nada
- AND con la confirmación hace el cambio, corre el «Build» si `operations.md` lo declara y `node --test`, y commitea en la rama en la que está con el comando y su resultado en el cuerpo del commit, sin spec, plan, carpeta, id, fila, changelog ni estimación
- AND si el gate falla, no commitea y lo dice
- AND en la rama estable del git-flow de la constitution (`main`) no commitea: en `pair` y `delegate` para y pregunta; en `unattended` lo deja sin commitear y lo cuenta en el informe final
- AND «corrige "Cancelacion" en el mensaje de `cancelar`» no es config: un texto que ve el usuario del producto, dado literal, es patch

#### MODIFIED — Full y spike anuncian y siguen; patch, lite y config preguntan

- GIVEN el molde `reservas` en `delegate`
- WHEN el usuario pide «que el responsable de sala pueda anular reservas de otros», que es feature full
- THEN `sdd-propose` anuncia el carril, el perfil y de qué nivel sale, y la frase para aprobar la spec por delegación, y sigue con la entrevista en el mismo mensaje, sin pregunta de confirmación
- AND con «si cancelo una reserva que no existe me dice "cancelada" igual», que es patch, pregunta en prosa antes de abrir rama, carpeta o id, con el 🦆 de lo que hará y, si existe `estimation.md`, la estimación en horas
- REMOVED AND con «si cancelo una reserva que no existe me dice "cancelada" igual», que es patch, pregunta con `AskUserQuestion` antes de abrir rama, carpeta o id, con el 🦆 de lo que hará y, si existe `estimation.md`, la estimación en horas
- AND con un cambio que cumple el predicado de lite, la pregunta ofrece lite citando sus condiciones una por una
- AND si la feature prevé más de 5 tasks, la pregunta de partir sustituye al anuncio y lleva la opción de aprobar la spec por delegación
- AND en `unattended` no pregunta: patch y config siguen, lite va en full y spike va como full

### Capacidad: `feature-flow`

#### MODIFIED — El gate de la spec en `delegate` ofrece parar tras el plan para bajar la sesión a gama media

- GIVEN una feature en `delegate`, una sesión con Opus 5.5 y la spec lista para el gate
- WHEN el agente presenta la spec
- THEN entre las opciones numeradas está «Apruebo; escribe el plan y, si sale Native, para antes de la Task 1 para que baje la sesión a gama media», que no es la recomendada, con el mismo motivo
- REMOVED THEN entre las opciones de `AskUserQuestion` está «Apruebo; escribe el plan y, si sale Native, para antes de la Task 1 para que baje la sesión a gama media», que no es la recomendada, con el mismo motivo
- AND si el usuario aprueba sin esa opción, el agente sigue sin parar hasta la validación, como hoy

#### MODIFIED — La pregunta del gate de la spec lleva opciones fijas

- GIVEN una feature en `pair` o `delegate`, con la spec lista para el gate
- WHEN el agente presenta la spec
- THEN la pregunta del gate va en prosa al final del mensaje, con las opciones numeradas y, al menos, «Apruebo (Recomendada)», la primera, y «Cambios»
- REMOVED THEN la pregunta del gate es una llamada a `AskUserQuestion` con, al menos, «Apruebo (Recomendada)» y «Cambios»
- AND el turno acaba ahí: no llama a `AskUserQuestion`, cuyo diálogo tapa el mensaje, ni implementa
- REMOVED AND no es una pregunta en prosa al final del mensaje

#### MODIFIED — La fila de «Aprobaciones» dice quién y cómo aprobó

- GIVEN una spec calcada de `spec-template.md` y aprobada por Ana con la opción «Apruebo (Recomendada)» de la pregunta del gate el 2026-10-18
- REMOVED GIVEN una spec calcada de `spec-template.md` y aprobada por Ana con la opción «Apruebo (Recomendada)» de `AskUserQuestion` el 2026-10-18
- WHEN el agente registra la aprobación
- THEN la tabla «Aprobaciones» tiene las columnas `Nombre | Fecha | Estado`, sin «Rol», y la fila dice `Ana | 2026-10-18 | aprobada (opción «Apruebo»)`
- AND si Ana escribe «sí, adelante», el Estado es `aprobada: «sí, adelante»`
- AND el frontmatter `approvers` lleva `name` y `approved_at`, sin `role`

#### MODIFIED — El guion arranca por el entorno y acaba en texto

- GIVEN la 0010, con servidor en `node scripts/env-up.mjs` y parada en `node scripts/env-down.mjs`, lista para validar en `validation.mode` `manual`
- WHEN el agente presenta la validación
- THEN el guion es lo último del mensaje y empieza por la rama, el worktree y el entorno, con un bloque de código sin lenguaje por terminal y cada comando en su línea, sin puntuación al final
- AND sigue con pasos de uno en uno, con sus datos y su resultado esperado, y acaba con cómo parar el entorno y «dime "validado" o qué paso falla», en texto
- REMOVED AND no usa `AskUserQuestion` para pedir la validación, porque tapa el guion: es una excepción a la norma de preguntar con esa herramienta
- AND con `validation.startEnvironment: true`, el guion dice que el entorno está arrancado, con su puerto, en vez de dar los comandos de arranque
