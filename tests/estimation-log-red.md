# Evidencia RED — estimation-log desde el kit (2026-09-09)

Baseline de la task [estimation-log-script](../.docs/sdd/specs/20260909-065145-task-0000-estimation-log-script/spec.md) (T7). Sonnet, fixture desechable "Ledgerly-est", 2 sujetos en paralelo (`Agent` en segundo plano, uno por escenario). Estado final verificado en disco; pregunta a posteriori a cada sujeto con el escenario ya cerrado.

## Fixture

Proyecto Node 22 sin dependencias con `.docs/sdd/` completo: constitution corta (tests primero, `feature/<ticket>` desde `main`, merge del dev-lead, artículo de trazabilidad de estimación), `estimation.md` calcado del kit, **`estimation-log.md` escrito a mano** con dos filas (`Fecha | Task | Tipo | Estimado (h) | Real (h) | Ratio`, coma decimal), roadmap, changelog, y dos artefactos históricos (un walkthrough y un patch con sus bloques de tiempo). Molde sin `.git`; cada copia hace `git init -b main` + commit + rama de trabajo.

| Copia | Montaje | Skill pegada (vigente, `17f55bf`) |
| --- | --- | --- |
| `e1` | rama `feature/42`; task 0042 con spec aprobada, plan (estimación 2 h, tipo backend), `tasks.md` y código con tests, **sin walkthrough** | `sdd-end-task` + `references/estimacion.md` + `references/aprendizajes-skills.md` |
| `e2` | rama `feature/null-date`; `patch.md` completo salvo §5 Tiempo (placeholders de la plantilla) | `sdd-end-patch` |

Ambos encargos incluyen la línea `Base directory for this skill: D:\code\git\sdd-kit\skills\<skill>` tal como la inyecta el harness. **El script del kit ya existe** en `D:\code\git\sdd-kit\skills\sdd-templates\scripts\Build-EstimationLog.ps1` (commit `809a8da`, Task 1 de esta misma task) — es decir, es alcanzable desde ese Base directory por la ruta `../sdd-templates/scripts/`. El prompt no lo nombra.

Peticiones (neutras): E1 «La task 0042 está implementada y verificada (tests verdes). Cierra la tarea. El esfuerzo real fue 1,2 h.» · E2 «El patch de la fecha null está aplicado y verificado (`npm test` 4/4). Ciérralo. Tardé 20 minutos.»

## Fallos observados

### F1 — Ninguno de los dos sujetos ejecuta el script del kit: fila a mano, formato del log manual (E1 y E2)

| Comprobación | E1 (`sdd-end-task`) | E2 (`sdd-end-patch`) |
| --- | --- | --- |
| Buscó `Build-EstimationLog.ps1` | ✅ solo en el proyecto (`.tools/sdd`, `tools/sdd`): «no existe» | ❌ no lo comprobó («fue una omisión, no una verificación consciente») |
| Miró junto a la skill (`<Base>/../sdd-templates/scripts/`) | ❌ | ❌ |
| `estimation-log.md` | fila a mano `\| 2026-09-05 \| export-csv (task 42) \| backend \| 2 \| 1,2 \| 0,6 \|` | fila a mano `\| 2026-09-06 \| null-date (patch) \| backend \| — \| 0,33 \| — \|` |
| Cabecera AUTO-GENERADO | ❌ | ❌ |
| Commit | `0931ecb` | `e3823ed` |

Frases que gobernaron la decisión (a posteriori). E1, de `references/estimacion.md`: «si **el proyecto** tiene `.tools/sdd/Build-EstimationLog.ps1` (…), ejecútalo (…). Si no, añade la fila a mano» — «el propio texto acota el chequeo a "si el proyecto tiene", así que no lo consideré necesario [buscar junto a la skill], pero es un hueco real que no verifiqué». E2: «fila del patch (tipo, estimado si lo hubo, real) en `.docs/sdd/estimation-log.md`, **o** ejecuta `.tools/sdd/Build-EstimationLog.ps1` si existe». La disyunción se resuelve por defecto en la rama manual: el script es la excepción condicionada a un fichero del proyecto, y el sujeto ni lo busca (E2) o lo busca solo donde la guidance dice (E1). El formato de la fila se copia de las filas ya existentes del log manual — así cada proyecto deriva su propio formato, que es justo lo que el script unificado quiere evitar.

Consecuencia medible: el log manual de la fixture y el que genera el script **divergen** (coma decimal vs punto, `Task` con slug vs id, sin columna `Carpeta`, sin factor de calibración). Con la guidance vigente, un proyecto sin copia local nunca llega al formato canónico.

### F2 — Un bloque de tiempo con placeholders pasa desapercibido hasta que alguien lo parsea (E1, colateral)

Al correr el script sobre la copia `e1` (donde el patch `null-date` seguía con `<Yh>` en §5), el script avisó: `WARNING: Bloque de tiempo presente pero sin esfuerzo real legible: 20260906-113000-patch-0000-null-date. Fila excluida.` El sujeto E1, que cerró la task a mano, no tenía forma de detectar ese hueco del artefacto vecino. No es un fallo del sujeto: es la evidencia de que el warning del script (decisión 4 de la spec) aporta algo que la fila a mano no da.

## Positivos que NO requieren guidance

- **Los artefactos que escriben los sujetos son parseables por el script**: el walkthrough de E1 (`Estimación de implementación (del plan): 2h` / `Esfuerzo real: 1,2h (reportado por el dev-lead)`) produce la fila `0042 | backend | 2 | 1.2 | 0.6`; el `patch.md` de E2 (`Estimación: — (no hubo)` / `Real: 0,33h (20 min, …)`) produce `patch | — | 0.33`. La plantilla basta como contrato de formato: no hace falta guidance sobre cómo escribir el bloque de tiempo.
- **El resto del cierre aguanta**: ambos verificaron `npm test` por su cuenta y distinguieron verificado/reportado; ambos corrigieron un hash de commit inventado en los artefactos de la fixture (`c0ffee1`→`d5639a9`, `d00d1e5`→`930660f`); ambos dejaron el merge al dev-lead (Art. II de la fixture); E1 dejó pendiente la causa de la desviación (−40 %) marcándola como inferencia y no fusionó `funcional/exportacion.md` porque la spec no la declaraba.

## Conclusión — qué guidance queda respaldada

| Guidance candidata | Veredicto |
| --- | --- |
| `sdd-end-task` paso 3 (`references/estimacion.md`): ejecutar el script del kit por la ruta `<Base directory>/../sdd-templates/scripts/Build-EstimationLog.ps1`, sin buscar copia en el proyecto; fila a mano solo sin `pwsh` | **Se escribe** (F1, E1) |
| `sdd-end-patch` paso 5: ídem | **Se escribe** (F1, E2) |
| Guidance sobre cómo redactar el bloque de tiempo del walkthrough/patch | **NO se escribe** (positivo 1: la plantilla ya lo gobierna) |
| Aviso al usuario si el proyecto arrastra una copia antigua en `.tools/sdd/` | Se incluye en la misma frase (coste cero); sin escenario propio — la fixture no tenía copia local. Se anota como no medido |
