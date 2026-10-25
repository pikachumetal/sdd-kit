---
id: 20261025-152402-feature-0213-campaign-control
feature: 0213
title: Walkthrough — Control de campaña en tests/headless/run.sh
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-25
---

# Walkthrough — Control de campaña en `tests/headless/run.sh`

## 1. Cambios realizados

- **Ensayo en seco y coste por carpeta** (Task 1): con `DRY_RUN=1` las salidas van a `RUNS_DIR/dry/<fase>/out` y los techos cuentan solo esas; `campaign_root` de `tests/headless/lib.sh` decide la raíz para `run.sh` y `battery.sh`, que ahora cargan `lib.sh`. Al acabar, `run.sh` imprime una línea por carpeta de salida (`green: 6 sujetos · 2.10 $ · 1 sin RESULTADO`). `REPO_ROOT` de `run.sh` ya no sale del cwd cuando Pester lo lanza con una ruta Windows.
- **Recuento de sujetos** (Task 2): cada sujeto deja su PID en `RUNS_DIR/live/<fase>.<etiqueta>` (en seco, `RUNS_DIR/dry/live/`); `run.sh` no relanza una etiqueta guardada ni una en curso («ya existe p1-2: sube SUBJECT»), espera con `MAX_PARALLEL` (5) sujetos en curso, también los de otro `run.sh` sobre el mismo `RUNS_DIR`, con un cerrojo `mkdir` entre mirar el cupo y lanzar; para si lo gastado más (en curso + 1) × `SUBJECT_COST` (`COST_CAP / SUBJECT_CAP`) pasa de `COST_CAP`, y un sujeto cortado sin salida cuenta como sujeto y como `SUBJECT_COST`. El recuento usa builtins: con subshells, bajo carga, lanzar tardaba más que un sujeto. `battery.sh` deja sus tandas de 5 y aborta si una etiqueta del plan ya tiene salida.
- **`claude` anidado** (Task 3): `run_claude` antepone `tests/headless/no-claude/` al `PATH` del sujeto; su `claude` (y `claude.cmd`) imprime «claude anidado bloqueado en un sujeto: run.sh no ve su coste» y sale con 1. `.gitattributes` fija LF para el `claude` sin extensión.
- **`tech-stack.md`** (Task 4): la regla del techo trae el coste mediano por tipo de sujeto (1328 `tools.txt`); la descripción del lanzador nombra lo nuevo; sale la regla de la tanda que reutilizaba la etiqueta. Tope de `tech-stack.md` a 19663 (aprobado en la spec).
- **Pasada de fix** de la revisión final: el seco mide la ruta que tendrá la salida en `SPEC_DIR` (C1), marcas separadas por modo (I1), `battery.sh` con etiquetas guardadas (I2), validación de `MAX_PARALLEL` y `SUBJECT_CAP`, cerrojo abandonado, y el ruido de `read` en stderr tras el smoke.

## 2. Tiempo y coste: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (del plan): 2,5h
- Esfuerzo real: 2,57 h — reloj de la sesión 4,22 h desde 2026-10-25T15:19Z, sin 99 min de espera al dev-lead (3 esperas)
- Desviación: +0,07h (+3 %)
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado (toda la feature)
- Tokens del hilo: 64.972.640 — claude-opus-5-5 64.972.640
- Tokens de subagentes: 3.252.987 en 3 despachos — Final review — Code axis claude-sonnet-5-5 768.400 / 3 min; Re-review final fix range 0213 claude-opus-5-5 736.403 / 4 min; Final review — Spec axis claude-opus-5-5 1.748.184 / 7 min
- Coste de la sesión: 26,55 $ (hilo 22,92 $ + subagentes 3,63 $)
- Coste de sujetos: 0,01 $ en 1 sujeto haiku — sonda del `claude` anidado 0,0096 $
- Review de spec: no · hallazgos 0, aceptados 0

Las «esperas» incluyen dos caídas del PC durante la verificación de la Task 2 y una actualización de PowerShell (`pwsh.dll` ausente unos segundos).

## 3. Desviaciones del plan

- Task 2: el plan decía «sin demonio ni lock»; el test de dos lanzadores dio 2 sujetos a la vez con `MAX_PARALLEL=1`, y entró un cerrojo `mkdir` en `RUNS_DIR/live/.lock`.
- Task 2: el recuento pasó a builtins y variables; con subshells no se solapaban dos sujetos.
- Task 2: los tests de `MAX_PARALLEL` fijan «exactamente 1» con `MAX_PARALLEL=1` en lugar de «exactamente 2».
- Pasada de fix: las marcas en seco van a `RUNS_DIR/dry/live/`, no a `RUNS_DIR/live/`, para que un cortado de un modo no cuente en el otro.
- Task 4: la tabla clasifica por la primera skill del kit que carga el sujeto.

### Decisiones tomadas sin el dev-lead

- Task 1: `run.sh` y `battery.sh` cargan `lib.sh` y la raíz de salidas vive en `campaign_root`, no duplicada — el plan solo decía «la misma raíz» — si es un error: un source de más en `battery.sh`.
- Task 1: `REPO_ROOT` de `run.sh` con la ruta Windows arreglada (rojo de la línea base, también en `develop`) — fichero que la task ya toca — si es un error: un rojo que ya existía.
- Task 1: copia RED tomada antes de editar los tests; no cambiaron entre el RED y el verde — si es un error: ninguno.
- Task 2: recuperación tras caída del PC: código y RED en el árbol, se relanzó la verificación — si es un error: ninguno.
- Task 2: tests de `MAX_PARALLEL` a `MAX_PARALLEL=1` y sueño de 4 s; con `MAX_PARALLEL=5` el mismo test sale rojo — si es un error: el límite con n>1 no lo fija un test.
- Task 2: recuento con builtins (`count_live`, `count_finished`, un `awk` con `ENDFILE` por carpeta) — si es un error: con un awk que no sea gawk, `spent` da 0.
- Task 2: cerrojo `mkdir` entre mirar el cupo y crear la marca — si es un error: un `run.sh` muerto con el cerrojo retrasa al siguiente.
- Task 3: la sonda real se leyó del `.jsonl` (`subject_save` cortó su ruta de 158 caracteres, antes del arreglo C1) — si es un error: ninguno.
- Task 3: el `claude` falso del test lleva la guarda `FAKE_NESTED` — sin bloqueo se llamaría a sí mismo sin fin — si es un error: ninguno.
- Task 3: carpeta del test `nested-claude` (chocaba con `nested`) — si es un error: ninguno.
- Task 3: `.gitattributes` con `tests/headless/no-claude/claude text eol=lf` — si es un error: ninguno.
- Task 4 y final (M4): tabla con los tipos de la decisión 10 (arranque, cierre, migración, init, otros), clasificada por la primera skill del kit que carga el sujeto; enrutado y primera pregunta no se separan con estos datos — si es un error: una previsión de enrutado alta (0,35 $ frente a ~0,2 $).
- Final m1: `ENDFILE` de gawk se queda: el arnés solo corre en Git Bash — si es un error: con otro awk, el techo de coste no salta.
- Final m7: un sujeto que acaba entre `count_live` y `count_finished` cuenta dos veces: conservador — si es un error: una parada de más en el borde del techo.
- Final m8: globales `RUNNING`, `CUT`, `FINISHED` entre funciones, en un script de ~150 líneas — si es un error: un `total_spent` con un `CUT` viejo.
- Final M6: el plan no se reescribe; el cerrojo consta aquí — si es un error: un plan que no describe el código final.
- Final I1 y el Important de la re-revisión: marcas en seco en `RUNS_DIR/dry/live` (decisión 7: todo el seco bajo `RUNS_DIR/dry`); las reales siguen en `RUNS_DIR/live/<fase>.<etiqueta>` de la decisión 4 — si es un error: el CUT de un sujeto real no lo fija un test en modo real.
- Final, Minor nuevos de la re-revisión (contador `tries` del cerrojo, `label_taken` fuera del cerrojo, `versioned_out` sin `SPEC_DIR` en disco): fila de deuda «Actuar → 0214» — si es un error: `MAX_PARALLEL` pasado en uno en una carrera rara.

## 4. Verificación

### 4.1 Builds

- Suite completa: `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min` → verde · 10 min · configuración: la del gate · sobre la pasada de fix (juntada en el cierre): `kit:test` 1389 pasados, 0 fallos, 13 omitidos; `cli:test` 1164/1164; `cli:test-min` 1459/1459; `cli:typecheck` y `cli:test-slow` en caché (la CLI no cambia).
- Tras el arreglo del ruido de `read`: `Invoke-Pester -Path tests/HeadlessLauncher.Tests.ps1, tests/Battery.Tests.ps1 -CI` → 58/58, con «en seco deja las salidas en RUNS_DIR/dry…» fijando que no sale «No such file or directory» (RED→GREEN).
- Línea base: dos rojos ajenos, también en `develop`: «acepta RUNS_DIR bajo .temp/ del repo» (arreglado en la Task 1) y `FastSuiteBudget` 31,6 s con la máquina cargada (fila del patch 0190, parcial).

### 4.2 Smoke / tests

- Validación en campo: 2026-10-25 · gate de cierre verde sobre la pasada de fix (juntada en el cierre) · Pester de `tests/headless/` verde tras el último arreglo · smoke en seco real desde el scratchpad de la sesión · sujeto real haiku para el `claude` anidado · revisión final Spec y Código sobre `2bdb2f87`, re-revisión de `2bdb2f87` a la pasada de fix con 1 Important y 4 Minor adjudicados · 1 sin revisar (el arreglo del ruido de `read`)

| THEN (decisión de la spec) | Evidencia | Resultado |
| --- | --- | --- |
| 1. Etiqueta existente: «ya existe a-1: sube SUBJECT» y sigue | ejecución real (smoke en seco, tanda 2) | sale el literal; `a-1` no se relanza |
| 2-3. Techo con lo lanzado y su mensaje | ejecución real (smoke: `COST_CAP=2.5`, `SUBJECT_COST=1`) | «techo de 2.5 $ alcanzado (1.50 $ gastados, 1 en curso a 1 $)» |
| 4. En curso entre lanzadores | suite (`MAX_PARALLEL cuenta los sujetos de otro run.sh…`) | máximo 1 a la vez con `MAX_PARALLEL=1` |
| 5. Cortados sin salida | suite (`cuenta un sujeto cortado…`, `un sujeto cortado de una tanda real…`) | «cortados sin salida: 1 (contados a 5 $ cada uno)» |
| 6. `MAX_PARALLEL` y su espera | ejecución real (smoke, tanda 1) | «esperando hueco: 1 sujetos en curso (MAX_PARALLEL=1)», 3 sujetos en serie |
| 7. Seco fuera de la spec | ejecución real (smoke) | salidas en `RUNS_DIR/dry/red/out`; `SPEC_DIR/red` solo con `subject.sh` |
| 8. `claude` anidado bloqueado | ejecución real (sujeto haiku, Bash y PowerShell) | «claude anidado bloqueado en un sujeto: run.sh no ve su coste», exit 1 en los dos |
| 9. Coste por carpeta | ejecución real (smoke) | «red: 3 sujetos · 1.50 $»; `green-premature` y «sin RESULTADO» por suite |
| 10. Tabla de coste en `tech-stack.md` | lectura y recálculo con el script | 5 tipos, 1328 sujetos; «otros» recalculado tras fundir (271, 0,19 $) |

### 4.3 Residuales / deuda generada

- Fila de deuda «Tres carreras del recuento de `run.sh` quedan abiertas» → **Actuar → 0214**.
- `estimation.md` sigue diciendo «0,6–0,9 $ por sujeto de un turno»; la mediana medida es 0,16–0,35 $. No se tocó: es del método de estimación, no del lanzador.

## 5. Aprendizajes

- En Git Bash bajo carga, cada proceso cuenta: un bucle de lanzamiento con subshells tardaba ~16 s por escenario y anulaba el paralelismo → comentario en `run.sh` (`count_finished`).
- `cmd < fichero 2>/dev/null` imprime el error del `<`: bash procesa las redirecciones de izquierda a derecha → arreglado en `run.sh`; regla general de bash, sin documento de anclaje.
- Con el scratchpad dentro del repo (`Start-KitSession.ps1`), toda ruta que se mida contra `REPO_ROOT` pasa de 140 caracteres → `out_path` mide en seco la ruta versionada; `tech-stack.md` («`DRY_RUN=1` … con las salidas en `RUNS_DIR/dry`»).
- Revisión de skills: no aplica, porque la feature no toca `skills/` ni `.claude/skills/` (comprobado con `git diff --name-only 37deadd4..HEAD`).

## 6. Adendas
