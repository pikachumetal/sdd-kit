---
kit_version: 1.1.0
superpowers_version: 6.4.2
lane: patch
id: 20260927-152924-patch-0090-config-dir-mold-guard
task: 0090
mode:
date: 2026-09-27
---

# Ticket para el kit — patch 0090: transcripts de todas las configuraciones y guarda del molde

## Contexto

- Carril y modo: patch
- Skills del kit usadas: `sdd-start-patch`, `sdd-end-patch`, `sdd-feedback`; scripts `Measure-SessionTokens.ps1`, `Test-Capabilities.ps1`, `Build-EstimationLog.ps1`, `Invoke-SddMerge.ps1`
- Proyecto: el propio kit (PowerShell, Pester y bash), una persona
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: no aplica
- Coste en reloj: ~0,7 h hasta el merge, ~0,1 h más de ticket
- Coste en tokens: 9.529.052 tokens del hilo, 4,04 $ (medido con el script del propio patch, sin `-ProjectsRoot`)

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. El commit del fix borró la fila de deuda que el patch salda

- **Qué pasó**: al actualizar los docs dentro del fix, borré de «Deuda técnica» la fila que este patch resolvía y la incluí en el commit del fix. En el cierre, `sdd-end-patch` paso 4 pedía cerrarla con prefijo y texto intacto, así que tuve que reponerla desde `git show <base>:roadmap.md`.
- **Dónde en el kit**: `skills/sdd-start-patch/SKILL.md` paso 5 (el commit del fix lleva «código, tests y `patch.md`»), frente a `skills/sdd-end-patch/SKILL.md` paso 4.
- **Por qué el kit no lo evitó**: el paso 5 dice qué entra en el commit del fix, pero no dice que el roadmap y el changelog no entran. La regla del cierre de la deuda solo aparece en `sdd-end-patch`, que se lee después.
- **Coste**: bajo, unos 3 minutos y un comando más en el cierre. Sin el paso 4, la fila habría desaparecido sin rastro.
- **Propuesta**: una frase en el paso 5 de `sdd-start-patch`: «Roadmap, changelog y capacidades no entran en el commit del fix: los escribe `sdd-end-patch`. Una fila de deuda que el patch salda no se borra, se cierra en el paso 4 del cierre».
- **Criterio de aceptación**: GIVEN un patch cuya fila de «Deuda técnica» describe el fallo que arregla, WHEN el sujeto hace el commit del fix, THEN `git show <fix> -- .docs/sdd/roadmap.md` no borra esa fila. Y tras el cierre, la fila empieza por `**[Patch <id>, <fecha>: saldada — …]**` con el texto original.

## Lo que hice por iniciativa propia

- **El dev-lead amplió la decisión de la fila durante el patch** (de «`CLAUDE_CONFIG_DIR` si existe, `~/.claude` si no» a «todas las configuraciones a la vez»). Lo registré en `patch.md` §2 con su frase literal, y reescribí la celda de la fila de la release con la fecha y «ampliado por el dev-lead». Ninguna skill dice dónde va una redefinición del alcance que hace el dev-lead a mitad de un patch. Funcionó, y es candidato a una línea en `sdd-start-patch`.
- **RED del script sin sujetos**: copié la versión de `HEAD` sobre el script, corrí los tests nuevos (3 fallos, con valores medidos) y restauré la nueva (GREEN). Es barato y deja el RED con evidencia en `patch.md` §4.
- **Compatibilidad de la guarda con las campañas guardadas**: antes de dar por buena la guarda de `g`, busqué en los 50 `subject.sh` versionados los que llaman a `g` antes de `g init`. Todas las coincidencias eran definiciones de función.
- **No ofrecí el ticket en el mensaje final del cierre** (`sdd-end-patch` paso 7), porque el dev-lead había pedido «no generar más tickets de problemas» para cerrar la 2.0.0. Lo pidió después con «feedback».

## Funcionó, no tocar

- La pregunta de validación del paso 0 de `sdd-end-patch`, con el disparador de «Diferir» ya relleno. El dev-lead eligió sin escribir nada y no hubo un turno de más.
- La receta de conflicto solo en los registros (`merge-recipe.md`). El script falló en `changelog.md`, `roadmap.md` y `estimation-log.md` por el patch 0088; el merge de sincronización y el relanzamiento único lo resolvieron en dos comandos.
- `GitEnvConvention.Tests.ps1` detectó que el test nuevo ejecutaba git sin `Clear-GitEnv`.

## Errores míos, no huecos del kit

- En `patch.md` §5 escribí «Estimación: S» (el tamaño de la fila), cuando la plantilla pide horas (`<Xh>`). `Build-EstimationLog.ps1` dejó el estimado en «—». Lo corregí al escribir este ticket (0,5 h).
- Un `.Replace()` de PowerShell con here-strings no casó por los finales de línea y aplicó el cambio a medias sin error. Lo revertí y usé `Edit`.
