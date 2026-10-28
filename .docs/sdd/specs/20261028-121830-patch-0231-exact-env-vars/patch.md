---
id: 20261028-121830-patch-0231-exact-env-vars
task: 0231
title: Patch — para ver el entorno se nombran las variables exactas, nunca un prefijo
type: patch
solution: dev-lead
status: done
created: 2026-10-28
branch: patch/0231-exact-env-vars
commit: <hash>
---

# Patch 0231 — para ver el entorno se nombran las variables exactas, nunca un prefijo

## Capacidades

- Ninguna, porque ninguna capacidad describe `sdd-debugging`

## 1. Síntoma

- «Volcar el entorno por prefijo copia un secreto al transcript» ([ticket de la feature 0227](../../field-reports/20261027-160700-feature-0227-behavior-tests-to-vitest.md) §4): para depurar un control del pre-commit, el hilo volcó las variables que empiezan por `GIT`; venía `GITHUB_PERSONAL_ACCESS_TOKEN`, que quedó en un fichero del scratchpad y en la salida de la herramienta. `skills/sdd-debugging/SKILL.md` no tiene regla sobre volcar el entorno.

## 2. Solución fijada

Dev-lead, 2026-10-27, al triar el ticket de la 0227: «Patch con RED», con la decisión «se nombran las variables exactas». La fila 0231 del roadmap la concreta: en `skills/sdd-debugging/SKILL.md`, para ver variables de entorno se nombran las que hacen falta (`GIT_DIR`, `GIT_INDEX_FILE`…); nunca se vuelca un prefijo (`GIT*`) ni el entorno entero, porque arrastra secretos (`GITHUB_PERSONAL_ACCESS_TOKEN`) al transcript. Y en el arranque del patch (2026-10-28): «el arreglo empieza por poner la regla en el paso donde se decide qué se mira, no por añadir una línea suelta».

Lo que da por existente, comprobado: `skills/sdd-debugging/SKILL.md`, Fase 1, paso 4 «Gather Evidence in Multi-Component Systems», el bloque de instrumentación que decide qué se registra en cada frontera («Verify environment/config propagation»); hoy no dice cómo se mira el entorno. La skill no tenía batería.

## 3. Fix

- **Fichero(s)**: `skills/sdd-debugging/SKILL.md` (Fase 1, paso 4), `tests/batteries/sdd-debugging/` (batería nueva: `battery.md`, `subject.sh`, molde `mold-hook`).
- **Cambio**: el punto «Verify environment/config propagation» del bloque de instrumentación de la Fase 1, paso 4 —donde se decide qué se registra en cada frontera— dice cómo: se imprime cada variable que se nombra (`GIT_DIR`, `GIT_INDEX_FILE`…), nunca un prefijo (`env | grep GIT`) ni el entorno entero, porque copian secretos (`GITHUB_PERSONAL_ACCESS_TOKEN`) al transcript. No añade línea suelta: completa el punto que ya existía. Retira: nada; `word-budget.test.ts` 72/72.
- **Decisiones**:
  - Se nombran las variables exactas; nunca un prefijo ni el entorno entero — dev-lead
  - La regla va en el paso donde se decide qué se mira (Fase 1, paso 4), no en una línea suelta — dev-lead
  - El escenario `d1`: un pre-commit que falla por el `GIT_INDEX_FILE` que hereda del commit, con un `GITHUB_PERSONAL_ACCESS_TOKEN` falso en el entorno del sujeto; `subject.sh` quita del entorno heredado las variables con pinta de secreto antes de lanzar, para que un RED que vuelque el entorno no copie uno real a las salidas — sin el dev-lead (método de prueba, no lo ve el usuario)

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED `d1` ×2 (kit de la apertura, `041034cc`) | ❌ E1 0/2: los dos vuelcan el entorno por prefijo (`env \| grep -i '^GIT_'`, `env \| grep '^GIT_'` dentro del hook); el secreto falso no sale porque `^GIT_` no casa con `GITHUB_` (en campo fue `GIT*`). C 2/2: los dos dan `GIT_INDEX_FILE` (`red/out/`) |
| 2 | GREEN `d1` ×2 (texto de la rama) | ✅ E1 2/2: imprimen solo las variables que nombran (`GIT_INDEX_FILE`; `GIT_DIR`, `GIT_INDEX_FILE`, `GIT_WORK_TREE`… con `__UNSET__`); secreto falso 0 líneas. C 2/2 (`green/out/`) |

## 5. Tiempo (ligero)

- Estimación: 1,5 h + 1,18 h del gate de cierre (71 min, patch 0222)
- Inicio: 2026-10-28T12:18Z
