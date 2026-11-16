---
kit_version: 2.3.4
lane: feature
id: 20261105-135744-feature-0315-copies-reader-and-guards
task: 0315
mode: full
date: 2026-11-05
---

# Ticket para el kit — feature 0315: kit:copies no deja pasar un bloque que se come el original, y los lectores de skills/ y los own con texto de terceros dan rojo

## Contexto

- Carril y modo: feature full, perfil `delegate`, `validation.mode: field`, ejecución Native
- Skills del kit usadas: `using-sdd`, `sdd-propose`, `sdd-grilling`, `sdd-rubber-duck`, `sdd-implement`, `sdd-worktrees`, `sdd-tdd`, `sdd-verify`, `sdd-parallel-agents`, `sdd-archive`, `sdd-retro`, `add-to-changelog`, `sdd-feedback`
- Proyecto: el repo del propio kit (plugin de Claude Code, TypeScript sobre Node, moon, Vitest), una persona
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: Sonnet 5.5 (revisor de spec, eje Código), Opus 5.5 (ejes Spec y Arquitectura, re-revisión)
- Coste en reloj: 1,21 h de esfuerzo frente a 2 h estimadas (reloj de sesión 1,99 h, 47 min de espera al dev-lead)
- Coste en tokens: 63.137.757 del hilo y 5.900.942 de subagentes, 25,21 $

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. La spec aprobada llevaba una regla que no cubría el caso real que la motivaba, y salió como desvío en la Task 1

- **Qué pasó**: la fila 0315 pedía «da rojo cuando un bloque `add` contiene una racha de líneas iguales a las del original», citando como caso real `skills/sdd-worktrees/SKILL.md:115-121`. La spec copió «solo `add`» con un porqué mío («un `sustituye` ya tiene su cita»). Al empezar la Task 1, un prototipo sobre la fuente de antes de `57be1a76` mostró que ese caso era un `sustituye: «Node.js»` sin `fin` que se comía 7 líneas: con la regla aprobada seguía en verde. Hubo que parar con una enmienda.
- **Fuente**: enmienda del 2026-11-05 en `spec.md` de la 0315 («aprobada: «ok»»); salida del prototipo `ANTES sdd-worktrees:115 sustituye racha 7 desde «# Rust»`; `git show 57be1a76^:skills/sdd-worktrees/SKILL.md`, líneas 115-121.
- **Dónde en el kit**: `skills/sdd-propose/SKILL.md`, paso 4, «Coherence pass»: comprueba literales y `MODIFIED`, no que el caso real que cita la spec dé el THEN.
- **Por qué el kit no lo evitó**: el repaso de coherencia compara la spec consigo misma y con el código que implementa un `MODIFIED`; un caso real citado en la fila o el prompt no se ejecuta contra la regla hasta la implementación.
- **Coste**: una parada del dev-lead y una enmienda (spec, enmienda del 2026-11-05).
- **Propuesta**: en el paso 4, sustituir la frase del repaso «checking each literal that appears in more than one place…» por una que incluya también «and each real case the spec cites (a file:line, a sha) against the THEN that should catch it», sin frase nueva al lado.
- **Verificada**: sí — el prototipo del scratchpad dio la racha en el `sustituye` y 0 en las copias de `develop`.
- **Criterio de aceptación**: GIVEN una fila que cita un caso real (`fichero:línea` antes de un sha) y una regla de la spec que no lo cubre WHEN `sdd-propose` hace el repaso de coherencia THEN el ✋ nombra el caso y si la regla lo atrapa, antes del gate.

### 2. La rúbrica de review de spec volvió a dar «ninguna» y el dev-lead tuvo que preguntar por la revisión

- **Qué pasó**: con tres señales (contrato público, `MODIFIED`, área no explorada), la rúbrica dio «ninguna» y presenté la spec sin revisor. El dev-lead preguntó «has hecho revisión?». El revisor (Sonnet, siete puntos) devolvió 10 hallazgos, 7 Important, y acepté 8.
- **Fuente**: «Hallazgos de la review» de `spec.md` de la 0315; `review-spec.md` §2 («0–3 señales no proponen review»).
- **Dónde en el kit**: `skills/sdd-propose/references/review-spec.md`, §2.
- **Por qué el kit no lo evitó**: la rúbrica cuenta señales y no pesa que una spec sea un contrato que leen varias features siguientes; los tickets de la 0312 §6 y de la 0304 §1 ya lo contaban.
- **Coste**: un turno del dev-lead, ~1 $ del revisor (`sdd session tokens`: 131.490 tokens, 1 min).
- **Propuesta**: sustituir «Por defecto, ninguna. 0–3 señales no proponen review» por un umbral que recomiende un revisor con contrato público y dos señales más.
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN una spec con contrato público, `MODIFIED` y área no explorada WHEN `sdd-propose` aplica la rúbrica THEN propone un revisor antes de presentar la spec.

### 3. Una línea del Review Focus del plan contradecía la spec, y lo cazó la revisión final

- **Qué pasó**: escribí en el Review Focus del plan que un `fin` dentro de una valla posterior, sin otra marca antes, no alarga el bloque del texto. La spec dice que el bloque acaba en `fin` si es la marca siguiente. El eje Spec lo marcó Important porque faltaba el test, y al arreglarlo resultó que la línea del plan era la equivocada.
- **Fuente**: ledger, `Final: Ruling: el Review Focus 1 del plan decía…`; informe del eje Spec, I-1.
- **Dónde en el kit**: `skills/sdd-propose/references/plan-writing.md`, «Self-review», punto 4 (Review Focus).
- **Por qué el kit no lo evitó**: el self-review pide que cada línea del Review Focus tenga su test, no que su comportamiento esperado sea el de la spec.
- **Coste**: un Important de la revisión final y un ruling; ~10 min.
- **Propuesta**: en el punto 4, sustituir «for each input or failure the spec implies, a task's tests exercise it» por una frase que pida además contrastar el comportamiento esperado de cada línea con el THEN que lo cubre.
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN un Review Focus cuya línea contradice un AND de la spec WHEN `sdd-propose` hace el self-review del plan THEN la línea se corrige antes de ejecutar.

## Lo que hice por iniciativa propia

- Antes de escribir los RED de la Task 1, medí la regla nueva con un prototipo desechable sobre todas las copias de `develop` y sobre el caso real: así salió el desvío del hallazgo 1 antes de tocar código, y se confirmó que las copias anotadas no daban rojos nuevos.
- Con `sdd merge --sync` parado por los `dist/` que solo cambiaban de finales de línea, `git add -u -- dist` refrescó el índice sin cambiar ningún blob (staged 0, sucios 0), y el merge siguió.

## Funcionó, no tocar

- La revisión final en tres ejes encontró un fallo real que ningún test tenía: una versión ausente del clon salía además como «git grep falló». La re-revisión cazó un Important que había metido la propia pasada de fix.
- `sdd capability merge` sobre una copia de `.docs/sdd` antes del gate: la fusión real del cierre no dio sorpresas.
- La validación en campo: sin guion ni espera, con la tabla de THEN y la evidencia de cada fila.

## Menores

- El bloque «De código» del plan copiaba el mensaje de antes de la enmienda aprobada; lo corregí al despachar los ejes. — `skills/sdd-implement/SKILL.md`, «Deviations and rulings» (la enmienda no dice que se pongan al día los literales que el plan copia de la spec)
- La pasada de fix copió `abbreviate` en otro fichero para romper un ciclo, y lo tuvo que deshacer el arreglo posterior a la re-revisión: la regla existía (decálogo, punto 5). — `skills/sdd-implement/references/implementer-prompt.md`, «Quality decalogue»
- El prompt de arranque daba por hecha la feature cuando `kit:upstream` pasara, y `kit:upstream` ya sale en rojo en `develop` con 6 líneas de fuentes nuevas que tienen dueño. — `skills/sdd-templates/templates/launch-prompt-template.md`
- `sdd merge --sync` se paró por los `dist/` que solo cambiaban de finales de línea: esta rama no tenía aún el patch 0318. — ya saldado por la 0318
