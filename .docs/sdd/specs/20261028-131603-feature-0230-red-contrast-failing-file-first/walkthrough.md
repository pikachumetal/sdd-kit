---
id: 20261028-131603-feature-0230-red-contrast-failing-file-first
feature: 0230
title: Walkthrough — El contraste de un rojo corre primero el fichero que falla, en la rama y en la base, con el entorno preparado
spec: ./spec.md
status: done
created: 2026-10-28
---

# Walkthrough — El contraste de un rojo corre primero el fichero que falla, en la rama y en la base, con el entorno preparado

## 1. Cambios realizados

- **Guidance** (`f4ab9d91`): «A red suite» de `skills/sdd-archive/references/merge-recipe.md` pasa a tres pasos: worktree de la base preparado como el Step 2 de `sdd-worktrees`, el fichero rojo solo con el runner del proyecto en la rama y en la base a la vez, y la lectura de los dos resultados; la tarea entera sin `--affected` solo si el fichero pasa en los dos y su error no es un tiempo agotado ni un recurso de la máquina. «Integrated base» define «el sha de la validación» como el del commit de cierre cuando el cierre lo junta. El paso 2 de `SKILL.md` (el 4.1 dice «sobre el commit de cierre») y el paso 6 (el contraste) lo resumen.
- **Batería de `sdd-archive`** (`f4ab9d91`): escenarios `a3a` (molde `reservas-gate-red`: test de `bookings:test` que falla una vez con `EBUSY` e importa una dependencia local) y `g3d` (molde `reservas-start-down`: `env-up` en error); rúbricas C1, C4-C6, G5a-G5c (a la intersección rama ∩ base), N0 y S2 (al sha del cierre), G6 con `g3d`; cuatro filas de procedencia. El `gate.mjs` del molde vuelca la salida de una tarea en rojo.
- **Evidencia**: [RED](../../../../tests/red-contrast-0230-red.md) y [GREEN](../../../../tests/red-contrast-0230-green.md).
- **Capacidad `archive`**: dos requisitos sustituidos por el delta.

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (de la spec): 1,5h + 1,17 h del gate de cierre (70 min, patch 0222)
- Esfuerzo real: 1,58 h — reloj de la sesión 2,69 h desde 2026-10-28T13:09Z, sin 67 min de espera al dev-lead (5 esperas)
- Desviación: +0,08 h (+5 %) sobre la implementación; el gate de cierre corre en el paso 6, después del commit de cierre, y el reloj no lo cuenta
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: 32.822.745 — claude-opus-5-5 32.822.745
- Tokens de subagentes: 4.617.636 en 3 despachos — Eje Código revisión final 0230 claude-sonnet-5-5 958.201 / 2 min; Re-revisión única de la 0230 claude-opus-5-5 1.767.985 / 5 min; Eje Spec revisión final 0230 claude-opus-5-5 1.891.450 / 5 min
- Coste de la sesión: 13,75 $ (hilo 10,56 $ + subagentes 3,19 $)
- Coste de sujetos: 8,24 $ en 15 sujetos Sonnet — RED 2,80 $ (4); GREEN 4,17 $ (9); GREEN2 1,27 $ (2)
- Review de spec: no (lite) · revisión final: Spec opus+high, con arreglos (3 Important, 5 Minor) · Código sonnet+high, con arreglos (2 Important, 4 Minor) · Arquitectura no (lite, sin señales), sobre `f4ab9d91`; pasada de fix juntada en el cierre, 12 hallazgos, sin test que los reproduzca (moldes y texto) · re-revisión del tramo de la pasada, sdd-kit:effort-high + opus, limpia (13 resueltos, 1 Minor adjudicado)

## 3. Desviaciones del plan

- Enmienda del 2026-10-28, aprobada: el GREEN baja a 9 sujetos y el techo sube a 13 sujetos y 9 $, porque el RED costó 0,70 $ por sujeto. Después, el dev-lead eligió repetir `a3a` ×2 con el molde arreglado (opción «Repetir a3a ×2»): 15 sujetos, 8,24 $.

### Decisiones tomadas sin el dev-lead

- El commit de apertura esperó a que acabara la línea base; los RED (moldes y escenarios) se escribieron antes, sin commitear — el pre-commit corre `cli:test` y competía con ella — coste si está mal: ninguno.
- `RUNS_DIR` del GREEN en `.temp/r30` del worktree, no en el scratchpad — en el RED la ruta del scratchpad dio `Filename too long` en git — coste si está mal: ninguno, `.temp` está ignorado.
- El `gate.mjs` del molde vuelca la salida de una tarea en rojo, como moon — sin ella `a3a` no puede medir C4 — coste si está mal: `g5`, `g6` y `w2` ven más salida en un rojo, que no tienen.
- `g5` falla 0/1 y no se abre REFACTOR, por el techo de sujetos: fila de deuda — coste si está mal: la regla de la intersección sigue sin cumplirse hasta la próxima edición.
- G5c (eje Código) se mantiene: la validación de `g5` corre sobre el commit de `tasks.md`, que el cierre junta, y `--verified-at` es el del commit de cierre — coste si está mal: G5c puntúa en rojo una conducta válida.
- La rama «el rojo no se explica» lleva un contraejemplo en la receta y su escenario va a la deuda (eje Spec, ADR 0003) — coste si está mal: la salida fácil sigue sin medir.
- El paso 6 de `SKILL.md` no repite los dos casos nuevos de la receta (rojo solo sin la rama, rojo sin fichero) y remite a ella (Minor de la re-revisión) — coste si está mal: quien lea solo el paso 6 no los ve.
- `g4-2` se colgó 1 h tras el servidor de `g4-1` y se paró por su PID — coste si está mal: un sujeto sin medir.

## 4. Verificación

### 4.1 Builds

- Línea base: `moon run kit:test cli:typecheck cli:test-min` (sin filtro: rama recién abierta) → 3/3 tareas en verde, 32 min 49 s con los sujetos del RED en paralelo, sobre `b07b148b`.
- Pre-commit del commit de la task (`moon run cli:typecheck cli:test kit:test-fast kit:roadmap`): 4 tareas en verde.

### 4.2 Smoke / tests

Validación en campo: 2026-10-28 · verificación del agente: batería de `sdd-archive` con el kit de la rama (GREEN 9 + GREEN2 2 sujetos: C4 2/2 fichero primero y 1/2 a la vez, C5 2/2, C6 2/2, S2 1/1, `a3r` 1/1, plan B `g3d` 1/1 y `g4` 1/1; `g5` 0/1) · `cli/test/kit/` en el pre-commit · revisión final Spec y Código sobre `f4ab9d91` con pasada de fix y re-revisión limpia · la suite del gate de cierre corre una sola vez sobre el merge de sincronización (otras ramas abiertas y la base 41 commits por delante) · no probado: la tarea entera tras un verde sin explicación, el cerrojo de otra rama

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| El worktree de la base se prepara como el Step 2 de `sdd-worktrees` antes de correr nada | ejecución real: `a3a` GREEN C5 | 2/2 |
| El fichero rojo corre primero, en la rama y en la base a la vez | ejecución real: `a3a` RED C4 0/2; GREEN2 con el molde arreglado | 2/2 el fichero solo antes que la tarea; 1/2 las dos pasadas en el mismo turno |
| Rojo también sin la rama: `base: en rojo: …`, deuda y parada | ejecución real: `a3r` GREEN | 1/1 |
| Verde en los dos con un error que lo explica: «No se repite» y fila de intermitentes | ejecución real: `a3a` GREEN2 | 2/2 |
| Verde en los dos sin explicación: la tarea entera sin `--affected` en los dos | no probado | ningún escenario lo provoca |
| Gate `--affected` con un rojo y un worktree recién creado: veredicto sin el cerrojo de otra rama | no probado | el molde no tiene cerrojo (decisión 4 de la spec) |
| El 4.1 dice «sobre el commit de cierre» y `--verified-at` lleva su sha | ejecución real: `a8` RED en rojo; `a8-2` GREEN | 1/1 |

### 4.3 Residuales / deuda generada

- `g5` (intersección rama ∩ base del paso 6) falla 0/1: tras el sync corre lo que toca la rama. Fila de deuda.
- La rama «el rojo no se explica» (la tarea entera en los dos) sin escenario. Fila de deuda.

## 5. Aprendizajes

- Las campañas de `sdd-archive` cuestan ~0,70 $ por sujeto, no 0,30 $: cada sujeto cierra una feature entera → `tech-stack.md`, «Baterías por skill».
- `RUNS_DIR` en una ruta corta (con la del scratchpad, git da `Filename too long`) y el kit sin commitear copiado sin `.docs/` ni `tests/` → `tech-stack.md`, «Baterías por skill».

## 6. Adendas
