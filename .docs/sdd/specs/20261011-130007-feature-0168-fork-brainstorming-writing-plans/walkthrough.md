---
id: 20261011-130007-feature-0168-fork-brainstorming-writing-plans
feature: 0168
title: Walkthrough — propose sin superpowers: fork de brainstorming y writing-plans en referencias de sdd-propose
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-11
---

# Walkthrough — propose sin superpowers: `spec-writing.md` y `plan-writing.md`

## 1. Cambios realizados

- **RED** (`e553fc26`): escenarios `pb`, `pb-c`, `adr`, `adr-c`, `adr6` y `h1` en la batería de `sdd-propose`, y `sk`, `sk-c` en la de `sdd-grilling`, con la ADR plantada (`fixtures/adr-0003-bookings-in-memory.md`, `fixtures/decisions-6/`) y el molde web (`mold-web/`). Evidencia: `tests/superpowers-fork-red.md`.
- **Fork** (`89cc7e5d`): `skills/sdd-propose/references/spec-writing.md` (de `brainstorming` 7.0.0) y `plan-writing.md` (de `writing-plans` 7.0.0, idéntica a la 6.4.2), con `skills/sdd-propose/NOTICE` y la fila de `THIRD_PARTY_NOTICES.md` que enlaza el anexo de procedencia de la spec. Los pasos 4 y 5 de `sdd-propose` empiezan por leerlas; `sdd-roadmap`, `sdd-init-greenfield` y `using-sdd` entrevistan con `sdd-grilling`; salen cinco filas de `overrides-superpowers.md`; constitution (Art. IV), `architecture.md`, `mission.md`, `control-profiles.md`, `sdd-config`, las plantillas y el README (de 8 a 6 skills de superpowers invocadas) dejan de nombrar las dos skills. Siete Pester actualizados.
- **Diseño por secciones** (`96d9a3d0`): «Design by sections» en `spec-writing.md` y la frase que lo dispara en el paso 4.
- **Boceto** (`18e17e92`): la regla de `sdd-grilling` dice con qué se enseña (app real con `§Frontend`, Artifact, o texto con escena y motivo), con el contraejemplo «no he arrancado la app» y la parada por PID o puerto.

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 4h
- Esfuerzo real: 2,3h — reloj del hilo desde la apertura (15:16) hasta el cierre, sin el corte de luz (~15 min); la entrevista, la spec, su review y el plan, antes, unas 2h
- Desviación: −1,7h (−42 %)
- Causa de la desviación: los sujetos corrieron en segundo plano y en paralelo mientras el hilo escribía (`estimation.md`, tercer aviso); la regla de las ADR salió por RED limpio y no se escribió
- Compactación: no
- Modelo del hilo: Opus 5.5, effort por defecto de la sesión (spec, plan y ejecución Native)
- Tokens del hilo: 156.046.409 — claude-opus-5-5 156.046.409 (incluye la migración a 2.3.4, el precio de Haiku 5.5 y la entrevista, anteriores a la rama)
- Tokens de subagentes: 3.488.953 en 3 despachos — Revisión de dominio spec 0168 claude-opus-5-5 399.372 / 1 min; Revisión técnica spec 0168 claude-sonnet-5-5 132.104 / 1 min; Revisión final de rama 0168 claude-opus-5-5 2.957.477 / 8 min
- Coste de la sesión: 45,75 $ (hilo 42,74 $ + subagentes 3,01 $)
- Coste de sujetos: 14,95 $ en 33 sujetos Sonnet — RED 6,53 $ (9 válidos y 7 invalidados por el molde); GREEN 8,42 $ (15 válidos y 2 invalidados)
- Review de spec: 2 revisores (dominio Opus, técnica Sonnet) · hallazgos 20, aceptados 18, en parte 1, rechazado 1

## 3. Desviaciones del plan

- La regla de las ADR sale por RED limpio, 4 de 4 con una ADR y con seis (enmienda de la spec, con la condición que puso el dev-lead).
- La Task 4 necesitó un REFACTOR: el primer GREEN de `sk` usó el respaldo con «no he arrancado la app».
- El techo de sujetos subió de 28 a 34, dos veces por decisión del dev-lead; el de coste (18 $) no se pasó.

- `sdd-explore` entró en Scope solo para cambiar la forma de su prohibición de `brainstorming` (enmienda aprobada tras la revisión final).
- La Task 4 añadió a `sdd-grilling` la parada por PID o puerto de `sdd-implement`, sin GREEN propio, por lo que hizo `sk-4`.

### Decisiones tomadas sin el dev-lead

- Molde: `pb-1`, `pb-3`, `pb-4` y `sk-1`…`sk-4` del RED, y `sk-1`, `sk-2` del GREEN, invalidados por el molde y apartados (`red-molde/`, `green-molde/`); su coste cuenta en el techo — peticiones de `pb` y `sk` y datos de `mold-web` corregidos.
- La regla de las ADR sale por RED limpio también con seis ADR; Review Focus 1 del plan deja de aplicar.
- `sdd-explore`: «NEVER `superpowers:brainstorming`» pasa a «NEVER superpowers' `brainstorming`» para que el README no la cuente como invocada (después, enmienda aprobada).
- El pre-commit rechazó el commit de la Task 2: `CommitMilestones` y `LocalConfig` fijaban en overrides y en el paso 5 dos frases que pasaron a `plan-writing.md`; sus asserts apuntan allí.
- `sk` y `sk-c` llevan «Carril feature, modo full:» para llegar a la decisión de cómo se ve.
- REFACTOR del boceto con el contraejemplo «"I haven't started the app" is not a reason».
- `sdd-grilling` gana «stop what you started by its PID or port, never by name» tras ver a `sk-4` parar su servidor con `taskkill //IM node.exe` — coste si está mal: una entrevista puede matar procesos node del dev-lead.
- Cuentas de coste de la evidencia recalculadas desde los streams antes del veredicto de la revisión final.
- Recuperación tras un corte de luz: se retomó en la repetición del gate; nada que rehacer.
- Minors diferidos de la revisión final: `sdd-grilling` no dice dónde se guarda la captura; la spec aún nombra la regla de ADR en 🦆, ✋15 y Approach; `adr6` hereda 40 turnos en `subject.sh`; dos líneas en blanco en la batería de `sdd-propose`; `spec-writing.md` sin el encabezado `## Purpose` que prometían las Interfaces de la Task 2.

## 4. Verificación

### 4.1 Builds

- Pre-commit (`cli:typecheck cli:test kit:test-fast kit:roadmap`) en verde en cada commit; el último, 1040 Pester y 26 ficheros de Vitest.
- Suite completa: `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min` → con las cinco en paralelo, `cli:test-slow` y `cli:test-min` fallan en dos tests de cerrojos de merge por tiempo (`publish.slow.test.ts` «waits for the merge lock then publishes», `lock-and-base.slow.test.ts` «el segundo proceso espera…», 120 s) y `kit:test` se corta · 922 s. Repetidos aislados: los dos lentos 24/24 (171 s); `kit:test` 1094/1095 (451 s), y el rojo, `FastSuiteBudget` (33,3 s frente a 30), falla igual en `develop` (32,9 s): previo, no de esta feature.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-11 · Pester 1094/1095 (el rojo, previo) · CLI 26/26 y lentos 24/24 aislados · smoke: 13 de 18 filas con ejecución real · revisión final opus con arreglos sobre 18e17e92, pasada de fix juntada en el cierre

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| feature-flow · la pregunta sigue `sdd-grilling` | ejecución real (`n-1`, `f2-1`, `sk-3`…`sk-5`) | una decisión por turno, formato fijo |
| feature-flow · spec con `spec-writing.md` y plan con `plan-writing.md`, sin invocar las dos skills | ejecución real (`h1-1`, `h1-2`) | leen las dos referencias; ningún `>>> Skill` de `brainstorming` ni `writing-plans` |
| secciones · 5 tasks → secciones con «¿va bien?» antes de la spec | ejecución real (`pb-1`, `pb-2`) | sección 1 y «¿Va bien?», sin `spec.md` |
| secciones · lo corregido entra antes de escribir | no probado | en `claude -p` no hay segundo turno: campo |
| secciones · recuento al entrar en el paso 4 (subida de carril, pieza tras partir) | no probado | sin escenario |
| secciones · 2 tasks, lite o spike → sin secciones | ejecución real (`pb-c-1`, 2 tasks) | spec sin secciones; lite y spike, no probado |
| secciones · spec delegada, `unattended` o empezar ya → sin secciones | no probado | sin escenario |
| secciones · turnos dentro de la parada de la spec, en `pair` y `delegate` | ejecución real en `delegate` (`pb-1`, `pb-2`) | `pair`, no probado |
| empezar ya · no ofrece saltarse las preguntas | ejecución real (`n-1`) | no la ofrece |
| empezar ya · spec con huecos en ✋ y gate | ejecución real (`y-1`) | «Pedir empezar ya no aprueba la spec» |
| routing · la primera skill es `sdd-propose` | ejecución real (`f2-1`) | `sdd-kit:sdd-propose` |
| routing · `brainstorming` no se invoca nunca | ejecución real (`h1`, `pb`, `n`, `y`, `f2`, `sk`, `g2`, `g4`) | 0 invocaciones en GREEN |
| interviewing · escena con datos por alternativa | ejecución real (`sk-4`, `sk-5`) | filas con los datos de `reservas.json` |
| interviewing · pantalla existente → app real con `§Frontend` | ejecución real (`sk-4` arranca la app) | sin navegador: respaldo con motivo concreto |
| interviewing · pantalla nueva → Artifact | ejecución real (`sk-c-2`) | sin Artifact en `claude -p`: respaldo con motivo |
| interviewing · sin app ni Artifact → texto con escena y motivo | ejecución real (`sk-4`, `sk-5`, `sk-c-2`) | pasa |
| sin superpowers · Pester de forma | suite | `SuperpowersCompat` en verde |
| `sdd-roadmap` y `sdd-init-greenfield` con `sdd-grilling` | ejecución real (`g2-1`, `g4-1`) | `g4` acaba en el roadmap, sin spec |

### 4.3 Residuales / deuda generada

- Filas de deuda nuevas en el roadmap: modelo de plantillas de OpenSpec (0152), patch frente a lite, regla de las ADR en espera de caso, herramientas de campaña (molde que no llega a la decisión medida, parada por nombre de los sujetos, `extract.mjs` con líneas largas), conjunto rápido por encima de 30 s en `develop` y cerrojos de merge con la suite en paralelo.

## 5. Aprendizajes

- Un sujeto de una entrevista solo mide la decisión que se busca si la petición cierra todo lo demás y el molde tiene los datos que la petición da por hechos: 9 sujetos se perdieron así (fecha que no existe, estado que no existe, recuento por debajo del umbral, carril lite), y la comprobación en seco no lo ve → fila de deuda «herramientas de campaña», junto a la 0170.
- Un sujeto headless que arranca la app la para por nombre en la máquina de la campaña → misma fila: el lanzador carga por defecto el `deny-kill.mjs` de la feature 0036.
- `extract.mjs` no parsea una línea larga del stream → misma fila.
- Con las cinco suites del gate en paralelo, los tests de cerrojos de merge se pasan de tiempo → fila de deuda, en espera de 2.º caso.

## 6. Adendas
