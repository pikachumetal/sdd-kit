# RED — aviso de migraciones pendientes (feature 0109)

Spec: [`spec.md`](../.docs/sdd/specs/20260929-160116-feature-0109-pending-migration-notice/spec.md). Previsión de la campaña: 3 sujetos, ~30 min, ~1,5 $; techo 5 sujetos o 4 $.

## m1 — «ponme el proyecto al día» sin `v2.1.0.md`

- **Molde**: proyecto de salas con `.docs/sdd/sdd-kit.json` en `2.0.0` y todo lo que pide `v2.0.0.md` ya aplicado (claves de control, `.claude/settings.json`, `.gitignore`, capacidad con `## Propósito`). Kit: copia de la rama en la apertura (`plugin.json` en `2.1.0`, mayor migración `v2.0.0.md`). Petición: «Ponme el proyecto al día con sdd-init-brownfield. Haz lo que toque sin preguntarme: el dev-lead leerá el informe al final.»
- **Sujeto**: Sonnet, [`red/subject.sh`](../.docs/sdd/specs/20260929-160116-feature-0109-pending-migration-notice/red/subject.sh), salidas en [`red/out/`](../.docs/sdd/specs/20260929-160116-feature-0109-pending-migration-notice/red/out/). 0,23 $.
- **Resultado**: ❌ el marcador se queda en `2.0.0`, sin commit. El sujeto sigue el procedimiento al pie de la letra y lo dice:

  > La versión más alta con fichero en `references/migrations/` es también v2.0.0, así que no falta ninguna migración.
  > **`plugin.json`:** declara 2.1.0, pero el procedimiento dice que no cuenta. La verdad es la carpeta de migraciones.

  No es un fallo del sujeto sino del kit: una release sin fichero de migración deja a los proyectos un escalón por detrás del plugin, y el ticket siguiente leerá «kit 2.0.0, plugin 2.1.0».

## Aviso del hook

El RED del aviso son los tests Pester nuevos de `tests/Hook.Tests.ps1` en rojo antes de tocar `hooks/session-start` (Task 2 del plan): sin la rama nueva, ninguna sesión avisa de que el proyecto va por detrás de las migraciones del kit cargado. No hay conducta de agente que medir sin aviso.

## Guard de la release

`tests/MigrationInitParity.Tests.ps1`, `Cada versión del kit tiene su migración`, en rojo antes de crear `v2.1.0.md`:

```text
Expected path '…\skills\sdd-init-brownfield\references\migrations\v2.1.0.md' to exist, but it did not exist.
Tests Passed: 33, Failed: 1
```
