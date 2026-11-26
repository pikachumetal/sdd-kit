---
kit_version: 3.0.4
lane: feature
id: 20261125-175529-feature-0367-validate-no-stops-in-delegate
task: 0367
mode: full
date: 2026-11-25
---

# Ticket para el kit — feature 0367: `sdd-validate` en `delegate` no para antes de volver a `sdd-implement` ni antes de `sdd-archive`

## Contexto

- Carril y modo: feature full, perfil `delegate`, `validation.mode: field`
- Skills del kit usadas: `sdd-propose`, `sdd-spec-writing`, `sdd-grilling`, `sdd-spec-approval`, `sdd-spec-review`, `sdd-plan-writing`, `sdd-implement`, `sdd-implement-native`, `sdd-worktrees`, `sdd-tdd`, `sdd-validate`, `sdd-verify`, `sdd-archive`, `sdd-retro`, `sdd-feedback`
- Proyecto: el propio kit (skills en Markdown, CLI en Node, baterías headless); una persona
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: revisores de spec opus y sonnet; ejes de la revisión final opus (Spec) y sonnet (Código); re-revisión opus; sujetos sonnet
- Coste en reloj: 1,78 h frente a 1,5 h estimadas (+19 %)
- Coste en tokens: hilo 39.413.217; subagentes 3.277.250 en 5 despachos; sesión 16,28 $; sujetos 20,75 $ en 11

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Quité una regla del paso sin poner la que el plan pedía, y la revisión final lo devolvió como Important

- **Qué pasó**: el plan (Task 2, Step 1) pedía que «A failure goes back to `sdd-implement`» perdiera «without asking» y dijera que la vuelta no es una parada. El RED mostró que la vuelta no paraba (0 de 2), y quité la frase sin poner nada en su sitio y sin `Ruling:`. El eje Spec lo marcó Important («decisión del dev-lead cubierta a medias»), y la pasada de fix añadió «at once», recortó otra frase para cuadrar el saldo de palabras y repitió `vf10`.
- **Fuente**: `.docs/sdd/changes/20261125-155223-feature-0367-validate-no-stops-in-delegate/plan.md`, Task 2 Step 1; `tasks.md`, líneas `Revisión final:` y `Pasada de fix:`; `walkthrough.md` §2, «Coste de sujetos» (`fix 4,65 $`)
- **Dónde en el kit**: `skills/sdd-implement-native/SKILL.md`, «2. Work the steps» («The plan is wrong — … Rule on the smallest change … ledger it»)
- **Por qué el kit no lo evitó**: la regla existía y no la apliqué: leí el resultado del RED como permiso para no escribir la frase, sin anotarlo como ruling contra el paso del plan.
- **Coste**: una pasada de fix, una re-revisión opus (959.749 tokens) y una tanda de `vf10` (4,65 $); respaldado por `tasks.md` y `walkthrough.md`
- **Propuesta**: en «2. Work the steps», que un paso del plan cuyo texto el RED hace innecesario sea un caso nombrado de «The plan is wrong»: ruling antes de dejarlo sin hacer.
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN un plan cuyo paso dice «sustituye la frase X por la regla Y» y un RED que muestra que la conducta ya es la correcta · WHEN el hilo ejecuta el paso · THEN o escribe Y o el ledger lleva `Ruling:` con el RED antes del commit de la task.

### 2. El comando de una tanda de batería del plan no lleva las variables de la campaña

- **Qué pasó**: la «Verificación» de la Task 1 daba `SCENARIOS="vf10" N=2 BATTERY=sdd-validate node tests/headless/battery.mjs run …`. En PowerShell falló tres veces seguidas antes de lanzar un sujeto: `define SPEC_DIR`, `define KIT_DIR`, `define COST_CAP (previsión de la spec)`. Hubo que buscar en `operations.md` y en `tests/headless/` las seis variables (`SPEC_DIR`, `KIT_DIR`, `RUNS_DIR`, `PHASE`, `COST_CAP`, `SUBJECT_CAP`). La 0365 tuvo el mismo hueco con `battery.mjs verdict` sin carpeta (su ticket, «Menores»).
- **Fuente**: salidas de las tres tandas fallidas en esta sesión; `tests/headless/campaign.mjs`, líneas 10-13 (`define SUBJECT_SH`, `define COST_CAP (previsión de la spec)`); `plan.md` de la 0367, Task 1, «Verificación»
- **Dónde en el kit**: `skills/sdd-templates/templates/plan-template.md`, campo «Verificación»; `skills/sdd-plan-writing/SKILL.md`, «What a Step Contains» («A verification step: the command to run»)
- **Por qué el kit no lo evitó**: la plantilla pide «los comandos de esas superficies» sin exigir que se puedan correr tal cual; la lista de variables vive repartida en `operations.md`.
- **Coste**: ~10 min y tres lanzamientos; sin respaldo en commit (solo en la sesión)
- **Propuesta**: que `battery.mjs` imprima de una vez todas las variables que faltan, con un ejemplo (una orden antes que texto, ADR 0025); o un hueco en la «Verificación» de la plantilla para la línea completa de la campaña.
- **Verificada**: sí — reproducido con `node tests/headless/battery.mjs run tests/batteries/sdd-validate/battery.md` en PowerShell 7, solo con `SCENARIOS`, `N` y `BATTERY` → `define SPEC_DIR`
- **Criterio de aceptación**: GIVEN `battery.mjs run` sin `SPEC_DIR`, `KIT_DIR` ni `COST_CAP` · WHEN se lanza · THEN sale con un único mensaje que nombra las tres que faltan, no solo la primera.

### 3. El repaso de coherencia no buscó el requisito vivo que un ADDED repetía

- **Qué pasó**: la spec llegó a la review con un `ADDED` en `validation` que repetía un requisito vivo y chocaba con otro («no pasa a `sdd-archive` hasta que el dev-lead valida»). Lo había apuntado yo mismo en la propuesta de review, pero no lo corregí en el repaso. El revisor lo dio como Crítico, el delta pasó a dos `MODIFIED` y la regla de §4 de `sdd-spec-review` obligó a una segunda ronda, que trajo otros 10 hallazgos.
- **Fuente**: `spec.md` de la 0367, «Hallazgos de la review» (primera y segunda ronda); `walkthrough.md` §2, «Review de spec: … hallazgos 20»
- **Dónde en el kit**: `skills/sdd-spec-approval/SKILL.md`, «1. Coherence pass» («Each `MODIFIED`»): mira los `MODIFIED`, no los `ADDED` que solapan un requisito vivo
- **Por qué el kit no lo evitó**: el repaso solo busca fuera de la spec lo que un `MODIFIED` cambia; el solape de un `ADDED` lo mira el revisor (punto 1 de su encargo), después.
- **Coste**: una segunda ronda de review (sonnet, 229.406 tokens) y ~15 min de hilo; respaldado por `spec.md`
- **Propuesta**: en el repaso de coherencia, cada `ADDED` se busca en la capacidad viva por su THEN; un requisito vivo que dice lo mismo o lo contrario lo convierte en `MODIFIED` antes de despachar al revisor.
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN una spec con un `ADDED` cuyo THEN contradice un AND vivo de su capacidad · WHEN corre el repaso de coherencia · THEN la spec que llega al revisor ya lleva ese cambio como `MODIFIED`.

## Lo que hice por iniciativa propia

- Tras juntar la pasada de fix en el cierre, volví a correr el gate con `--affected --base <sha del último gate>`, aunque la base solo trajo `.docs/`, porque la pasada tocó `skills/` después del gate de `sdd-validate`; así `--verified-at` apunta a un árbol que corrió. Funcionó (801/801 y 2591/2606).
- Releí el primer GREEN con la fila VF10 endurecida por la revisión antes de darlo por bueno. Funcionó: lo cumplía.

## Funcionó, no tocar

- Una fila de rúbrica que mide la acción en `tools.txt` (commit, `sdd-archive`, `sdd merge`) y no la forma de la frase: la parada del RED era una afirmación sin «?».
- Leer el motivo literal de los sujetos del RED antes de redactar: los dos citaron el merge, y la frase salió con el saldo de palabras a cero.

## Menores

- El vigilante de silencio dio un `SILENCIO:` falso: lancé la tanda con `| Select-Object -Last 30`, que retiene la salida, y la vigilé con `watch command --path`; lanzarla con `watch command -- <comando>` lo habría evitado — `skills/sdd-propose/references/control-profiles.md`, «Silence watch»
- El harness sirvió `sdd-validate` con el texto del arranque tras editarlo en la sesión; lo cubre la regla 1 de `CLAUDE.md` y seguí el de `dist/` — no localizado en el kit
