# GREEN — aviso de migraciones pendientes (feature 0109)

Spec: [`spec.md`](../.docs/sdd/specs/20260929-160116-feature-0109-pending-migration-notice/spec.md). RED: [`pending-migration-notice-red.md`](pending-migration-notice-red.md).

## m1 — «ponme el proyecto al día» con `v2.1.0.md`

- **Molde y petición**: los del RED, con el mismo [`red/subject.sh`](../.docs/sdd/specs/20260929-160116-feature-0109-pending-migration-notice/red/subject.sh) y `PHASE=green`. Kit: la copia del RED más `migrations/v2.1.0.md`.
- **Sujeto**: Sonnet, salidas en [`green/out/`](../.docs/sdd/specs/20260929-160116-feature-0109-pending-migration-notice/green/out/). 0,14 $.
- **Resultado**: ✅ frente al ❌ del RED.
  - `sdd-kit.json` pasa a `"version": "2.1.0"` y `"updated": "2026-09-29"`; `channel`, `ids`, `control`, `merge` y `execution` intactos.
  - `git diff --stat` del molde: solo `.docs/sdd/sdd-kit.json`, 1 línea.
  - Commit `chore(sdd): migrar al kit v2.1.0`; sin gates pendientes.
  - Control del paso vecino (Art. I, el GREEN mide también lo que el RED ya cumplía): no hace onboarding ni reescribe documentos de anclaje, igual que en el RED.

## Aviso del hook

- **Tests Pester** (`tests/Hook.Tests.ps1`): ✅ `avisa de migraciones pendientes con las dos versiones y la frase de migrar`, en rojo antes del cambio de `hooks/session-start` («Expected regular expression 'el proyecto tiene aplicado el kit 2\.0\.0' to match $null»). Controles en verde antes y después: `no avisa de migraciones con el proyecto al día o sin sdd-kit.json` y `no avisa ni se cae sin carpeta de migraciones en el kit cargado`. Los doce tests anteriores del fichero siguen en verde (15/15).
- **Sesión headless** (molde del patch 0100): Haiku, proyecto con `sdd-kit.json` en `2.0.0`, kit de la rama por `--plugin-dir` junto a superpowers y `--setting-sources ""`, petición «¿Qué hace la skill sdd-consult? Responde en una frase.». Salida en [`green/hook-1.txt`](../.docs/sdd/specs/20260929-160116-feature-0109-pending-migration-notice/green/hook-1.txt). 0,03 $.
  - ✅ El `hook_response` trae en `systemMessage` y al principio de `additionalContext`: «AVISO sdd-kit: el proyecto tiene aplicado el kit 2.0.0 (.docs/sdd/sdd-kit.json) y el kit cargado trae migraciones hasta la 2.1.0. Para aplicarlas, pide «ponme el proyecto al día con sdd-init-brownfield».»
  - ✅ El agente responde a la pregunta en un turno, sin tool calls: no invoca `sdd-init-brownfield` ni toca `sdd-kit.json`.
  - Observación: el agente no menciona el aviso en su respuesta. La spec no lo pide (el usuario ya lo ve como `systemMessage`), así que no es un fallo; se anota por si un ticket de campo pide que el agente lo repita.

## Control tras la revisión final

La revisión final marcó que la «Verificación» de `v2.1.0.md` (`git diff --stat HEAD~1` de la migración solo lista `.docs/sdd/sdd-kit.json`) da un fallo falso si se ejecuta antes del commit en una migración encadenada. Reproducido en un repo simulado 1.1.0 → 2.0.0 → 2.1.0: con la v2.1.0 aún sin commitear, `git diff --stat HEAD~1` lista también el `.gitignore` de la v2.0.0. La línea pasa a «Antes del commit de la migración, `git status --short` solo lista `.docs/sdd/sdd-kit.json`», que en el mismo repo solo lista `sdd-kit.json`.

- **m1-2** (control, Sonnet, kit con la verificación nueva): ✅ igual que m1-1 — marcador en `2.1.0`, solo `sdd-kit.json` cambiado, commit `chore(sdd): migrar al kit v2.1.0`; el sujeto ejecuta `git status --short` antes del commit y lo cita en su informe. 0,12 $.

## Coste acumulado de la campaña

4 sujetos, 0,52 $: uno más que la previsión (3 sujetos, ~1,5 $) por el control tras la revisión final, dentro del techo (5 sujetos o 4 $).
