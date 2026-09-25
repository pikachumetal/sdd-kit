---
kit_version: 1.1.0
superpowers_version: 6.4.1
lane: patch
id: 20260925-121956-patch-0076-reference-launcher
task: 0076
mode:
date: 2026-09-25
---

# Ticket para el kit — patch 0076: lanzador de sujetos de referencia en `tests/headless/`

## Contexto

- Carril y modo: patch, pedido así por el dev-lead desde una fila de deuda (no era un bug de ejecución: era una herramienta del repo que faltaba).
- Skills del kit usadas: `sdd-start-patch`, `sdd-end-patch`, `sdd-feedback`; de superpowers, `systematic-debugging`.
- Proyecto: el repo del propio kit (scripts PowerShell, bash y Node, suite Pester), un dev-lead, tres worktrees en paralelo.
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: no aplica
- Coste en reloj: ~35 min hasta el commit del fix; ~15 min más de cierre, con un conflicto en `roadmap.md`
- Coste en tokens: no medido

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. `patch.md` no tiene dónde anotar las decisiones tomadas sin el dev-lead, y el paso 8.1 de `sdd-end-patch` las lee de ahí

- **Qué pasó**: con perfil `delegate`, el patch tomó cinco decisiones de diseño sin preguntar: la carpeta `tests/headless/`, el fichero `stop` en `RUNS_DIR` y no en la carpeta de la spec, los techos obligatorios sin valor por defecto, el cambio del test de privacidad al extractor nuevo y el `eol=lf` en `.gitattributes`. El paso 8.1 manda contar «solo lo que su texto dice que se decidió sin el dev-lead», pero ninguna de las cinco está marcada así en `patch.md`: van repartidas por «Fix», como descripción del cambio. El mensaje final las listó de memoria de la sesión. Con otra sesión haciendo el cierre, no habrían salido.
- **Dónde en el kit**: `skills/sdd-templates/templates/patch-template.md` (sin sección) y `skills/sdd-end-patch/SKILL.md` paso 8.1.
- **Por qué el kit no lo evitó**: el paso 8.1 supone que `patch.md` dice qué se decidió sin el dev-lead, y la plantilla no lo pide. Un patch «determinista» se supone sin decisiones, pero uno que nace de una fila de deuda con «decídelo tú» las tiene.
- **Coste**: bajo en esta sesión; en un cierre hecho por otra sesión, decisiones que el dev-lead no ve.
- **Propuesta**: una línea opcional en la plantilla dentro de «3. Fix», `- **Decidido sin el dev-lead**: <una línea por decisión>`, que se borra si no hay ninguna. Y que el paso 3 de `sdd-start-patch` diga que se rellene con perfil `delegate`.
- **Criterio de aceptación**: GIVEN un patch con perfil `delegate` cuya petición dice «decídelo tú» sobre la ubicación de un fichero, WHEN una sesión nueva lo cierra con `sdd-end-patch` sin el contexto de la anterior, THEN el mensaje final nombra esa decisión. Hoy, con `patch.md` según la plantilla, el RED esperado es 0/N.

### 2. El merge del cierre choca en `roadmap.md` cuando hay patches en paralelo, aunque cada uno toque una fila distinta

- **Qué pasó**: `Invoke-SddMerge.ps1` falló con `merge: conflicto en .docs/sdd/roadmap.md`. Este patch había cerrado su fila de deuda con el prefijo, y `develop` había añadido una fila nueva justo debajo. La receta «Conflicto solo en los registros» lo resolvió: cada lado conservó su fila, el hook pasó y el segundo intento fusionó.
- **Dónde en el kit**: `skills/sdd-end-task/references/merge-recipe.md` § «Conflicto solo en los registros» (funcionó); el origen es el formato de cierre de `roadmap-template.md`, que edita la línea de la fila.
- **Por qué el kit no lo evitó**: dos filas contiguas caen en el mismo trozo del diff de git, y cerrar una fila la modifica. Con tres worktrees en paralelo sobre el mismo roadmap, será frecuente.
- **Coste**: ~5 min y un commit de merge más; sin pérdida.
- **Propuesta**: ninguna sobre el formato. Anotar en la receta que el caso más común es este (fila cerrada contigua a una fila nueva), para quien lo resuelva sin script. Si se repite en más cierres, estudiar un `merge=union` en `.gitattributes` para `roadmap.md`. No lo propongo sin medirlo: duplicaría las filas editadas por los dos lados.
- **Criterio de aceptación**: GIVEN dos ramas desde la misma base, una que cierra la fila N de «Deuda técnica» con el prefijo y otra que añade una fila justo después de N, WHEN la segunda ya está en `develop` y la primera se cierra con `sdd-end-patch`, THEN el cierre termina fusionado tras un solo relanzamiento del script. Hoy pasa (1/1 en esta sesión); el criterio vigila que siga pasando.

## Lo que hice por iniciativa propia

- **Una ejecución a mano con datos reales después del GREEN y antes del commit.** Los 11 casos Pester pasaban, pero un dry-run en el scratchpad dejó en `tools.txt` la ruta entera de la campaña (`/tmp/claude/…`): Git Bash escribe `%TEMP%` como `/tmp`, y node la recibe como `C:/…`. Los tests no lo veían porque solo comprobaban el home y el usuario, no `<run>`. Añadí el caso, lo vi fallar y lo arreglé. Candidato a regla del paso 4 de `sdd-start-patch` para fixes de scripts: tras el GREEN, una ejecución real de la ruta afectada, cuya salida se lee entera, no solo el código de salida.
- **`eol=lf` para los `.sh` que se ejecutan desde el checkout.** Con `core.autocrlf=true`, `git ls-files --eol` da `w/crlf` para los `run.sh` de las campañas cerradas. No verifiqué que bash los rechace desde el checkout (se lanzaban desde el scratchpad o sin tocar), pero el lanzador de referencia sí corre desde el checkout.

## Funcionó, no tocar

- `Get-NextSddId.ps1 -Reserve` y el renombrado de la rama antes del primer commit (`sdd-start-patch` paso 2): la rama quedó `feature/0076-reference-launcher` sin intervención.
- El paso 1 de `sdd-start-patch` hizo que la causa fuera medida, no la del ticket: el recuento de campañas afectadas (5 con el `tools.mjs` sin sanear, 17 sin la guarda del scratchpad) salió de un `grep`, y el dry-run destapó un fallo que la fila no nombraba.
- Evidencia para tres validaciones diferidas del roadmap: la 0009 (merge y push sin preguntar con `delegate` y el bloque `merge` completo), la 0018 (cierre de una fila de deuda con el prefijo `**[Patch <id>, <fecha>: saldada — …]**`) y la 0070 (`Test-Capabilities.ps1` con el bloque «Ninguna, porque ninguna capacidad describe…» dio «Capacidades válidas: 14»).
- La línea de terminado del paso 8, con el hash del merge y el push.

## Errores míos, no huecos del kit

- Una edición de un test con un heredoc de Python aplicó solo parte de los reemplazos, sin error (una cadena no casaba), y avisó de secuencias de escape. `tech-stack.md` ya advierte de los heredocs de Python con `\b` (task 0070). Lo vi en el `git diff --stat` y rehice esas dos ediciones con la herramienta de edición.
- En el primer borrador de `patch.md` afirmé que el `subject.sh` de la 0062 no tenía la guarda del scratchpad. El `grep -L` decía lo contrario, y lo corregí antes del commit.
- La primera versión de `run.sh` contaba dos veces un sujeto que terminaba durante el bucle (sujetos terminados más lanzados). Lo vi antes de ejecutarlo.
