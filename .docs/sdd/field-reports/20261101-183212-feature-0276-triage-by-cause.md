---
kit_version: 2.3.4
superpowers_version: 7.0.1
lane: feature
id: 20261101-183212-feature-0276-triage-by-cause
task: 0276
mode: full
date: 2026-11-01
---

# Ticket para el kit — feature 0276: triaje de la deuda por causa

## Contexto

- Carril y modo: feature full, perfil `delegate`, validación en campo
- Skills del kit usadas: `sdd-propose`, `sdd-parallel-agents`, `sdd-implement`, `sdd-worktrees`, `sdd-tdd`, `sdd-verify`, `sdd-archive`, `sdd-feedback`
- Proyecto: el propio kit
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: Opus y Sonnet
- Coste en reloj: 1,72 h, frente a 2,5 h estimadas
- Coste en tokens: 18,36 $ de sesión y 7,61 $ de sujetos

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. El tope de palabras no frena hasta un 25 % por encima, y el hilo declaró el saldo sin medirlo

- **Qué pasó**: la spec prometía «sin cambio» en `sdd-roadmap`; `word-budget.test.ts` siguió verde con 3.692 palabras contra 3.600 y `sdd-debugging` con 1.672 contra 1.600. Lo cazaron los dos ejes de la revisión final.
- **Fuente**: `cli/test/kit/word-budget.test.ts:12` → `slack = 1.25`; `wc -w skills/sdd-roadmap/SKILL.md` → 3692.
- **Dónde en el kit**: `skills/sdd-propose/SKILL.md` paso 5 y `cli/test/kit/word-budget.test.ts`.
- **Por qué el kit no lo evitó**: el test deja pasar lo que la spec promete no hacer, y ningún paso pide medir contra el tope nominal antes del commit de la task. Yo tampoco medí contra él.
- **Coste**: una pasada de fix y la re-medición `green-fix`, 2,78 $ ([walkthrough](../specs/20261101-163507-feature-0276-triage-by-cause/walkthrough.md) §2).
- **Propuesta**: que `sdd task done` avise si una skill editada pasa de su tope nominal, aunque quepa en el margen.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN una skill con 3.692 palabras y tope 3.600 WHEN corre `sdd task done` THEN escribe el aviso con las dos cifras.

### 2. Un plan que dice «si el RED sale limpio, para» choca con el Art. I, que pide otra tanda

- **Qué pasó**: el RED de `d2` salió 2/2 limpio porque los sujetos encontraban la fila con un `grep` del literal, que también estaba en el remedio. El plan mandaba parar; `tech-stack.md` manda otra tanda si la fuente es incidental. Seguí sin parar, y el eje Spec lo marcó como desvío.
- **Fuente**: `plan.md`, Task 2 Step 2, de la carpeta de la spec; `red-d2/out/d2-1.tools.txt`; `red-d2b/out/d2-1.texts.txt`.
- **Dónde en el kit**: `skills/sdd-implement/SKILL.md`, «Deviations and rulings».
- **Por qué el kit no lo evitó**: ninguna regla dice cuál manda cuando el plan y el método de campaña discrepan a mitad de una task.
- **Coste**: una parada del dev-lead para confirmarlo.
- **Propuesta**: en `plan-writing.md`, que un paso de RED limpio remita a «mira de dónde sacó la conducta», en lugar de fijar la parada.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN un RED limpio con fuente incidental WHEN el plan sigue la nueva forma THEN el hilo lanza otra tanda sin desvío.

### 3. Un control que falla no dice si es regresión: el hilo declaró 2/2 leyendo solo la puerta

- **Qué pasó**: `battery.mjs` dio `m3 · 2/2 · verde`, que es la puerta, y escribí en la batería «Control: `m3` y `m5` 2/2». El eje Spec leyó la rúbrica y `m3` fallaba en los dos sujetos. Con el kit de la apertura, `m3-2` también falló en la fila caducada: la conducta ya era inestable.
- **Fuente**: `green/out/m3-1.texts.txt:17`; `base-ctl/out/m3-2.texts.txt:24`.
- **Dónde en el kit**: `.docs/sdd/tech-stack.md`, «Baterías por skill»; `tests/headless/battery.mjs`.
- **Por qué el kit no lo evitó**: la regla de los dos veredictos existe y no la apliqué bien: el «verde» de la salida invita a leerlo como el de la conducta.
- **Coste**: un Important de la revisión final y `base-ctl`, 0,59 $.
- **Propuesta**: que `verdict` escriba `puerta 2/2` en lugar de `verde`, y que los controles lleven siempre su medida con el kit base.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN un escenario sin filas `tools:` WHEN corre `verdict` THEN su línea dice `puerta`, no `verde`.

### 4. El molde `hook` de `sdd-debugging` dejó de medir su causa

- **Qué pasó**: el pre-commit en CommonJS cae sobre `"type": "module"` del molde base, y `d1` da otra causa que la rúbrica C. Nadie corrió `d1` desde entonces.
- **Fuente**: `green-fix/out/d1-2.texts.txt`; `tests/batteries/sdd-debugging/mold-hook/.githooks/pre-commit:3`.
- **Dónde en el kit**: `tests/batteries/sdd-debugging/mold-hook/`.
- **Por qué el kit no lo evitó**: un cambio de molde no relanza los escenarios que lo usan.
- **Coste**: bajo; fila de deuda abierta.
- **Propuesta**: renombrar el hook a `.cjs` o dar al molde su `package.json`.
- **Verificada**: sí — reproducido por `d1-2`.
- **Criterio de aceptación**: GIVEN `d1` WHEN corre THEN los sujetos llegan a `GIT_INDEX_FILE`.

## Menores

- `RUNS_DIR` en el scratchpad: el lanzador lo rechaza por 177 caracteres, aunque la skill dice scratchpad; luego pide `git archive` y el techo cuenta toda la campaña: tres arranques en vacío.
- `sdd merge --sync` dijo `base: conflicto en` dos ficheros y dejó el índice sin conflictos ni marcas.
- El gate de cierre dio timeouts con la máquina al 81 %, y la misma suite pasó en el hook y en la CI.
- Un heredoc de Git Bash con script de Node falló una vez con `unexpected EOF`; reescribí la spec con `Write`.

## Iniciativa propia

- Añadí `defecto del producto` y `sin determinar` a la lista cerrada del dev-lead, tras un hallazgo de la review, y lo elevé en el gate: el vocabulario es de fallos del kit, y la plantilla rige en todos los proyectos.
