---
kit_version: 1.1.0
superpowers_version: 6.4.2 (superpowers-marketplace)
lane: patch
id: 20260927-134851-patch-0087-roadmap-header-fast-suite
task: 0087
mode:
date: 2026-09-27
---

# Ticket para el kit — patch 0087: cabecera de la release del roadmap y conjunto rápido del pre-commit

## Contexto

- Carril y modo: patch con dos piezas decididas por el dev-lead en la petición, id reservado de antemano
- Skills del kit usadas: `sdd-start-patch`, `sdd-end-patch` (editada en esta sesión: se siguió su texto del working tree), `sdd-feedback`, `sdd-templates` (plantillas `patch`, `roadmap` y `kit-feedback`; scripts `Build-EstimationLog.ps1`, `Test-Capabilities.ps1` e `Invoke-SddMerge.ps1`). Sesión arrancada desde el worktree
- Proyecto: este repo (el kit), un solo mantenedor
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: no aplica; 5 sujetos headless Sonnet
- Coste en reloj: ~1,3 h (estimado 0,5 h)
- Coste en tokens: no medido; sujetos 3,07 $
- Harness de Claude Code: la herramienta `PowerShell` bloqueó un comando que llamaba a `.Remove(` sobre un string, con «Remove-Item on system path 's:' is blocked». Falso positivo: se rehízo con `Edit`

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Un sujeto headless lanzado en paralelo acaba en el repo del kit y no en el molde

- **Qué pasó**: 2 de 5 sujetos (`red-1` y `green-2`, lanzados en paralelo con otro) leyeron el working tree del kit como su proyecto. Pararon con «Repo actual es sdd-kit […] No hay patch 0013». Los lanzados solos cerraron el patch del molde. Cada uno costó una tanda más o un resultado de menos: el GREEN quedó en 1/1 válido y la campaña pasó del techo (3,07 $ de 3 $).
- **Dónde en el kit**: el lanzador del patch (`.docs/sdd/specs/20260927-131408-patch-0087-roadmap-header-fast-suite/red/subject.sh`), copiado del de la 0075, frente a `subject_init` de `tests/headless/lib.sh`. No está localizado si la causa es el `--add-dir` del kit, el `cd` o la concurrencia.
- **Por qué el kit no lo evitó**: ni `tech-stack.md` ni `sdd-start-patch` dicen que el lanzador de un patch sale de `lib.sh`. Lo más cerca era el lanzador de un patch anterior, y se copió ese.
- **Coste**: 0,61 $ de ruido y un GREEN incompleto.
- **Propuesta**: reproducir con `lib.sh` y dos sujetos en paralelo. Si sale, separar el `cd` y el `--add-dir` del kit, o darle al sujeto una ruta de kit que no parezca un proyecto. Y decir en `tech-stack.md` que un lanzador nuevo se escribe sobre `lib.sh`.
- **Criterio de aceptación**: GIVEN el molde `salas` y el escenario del patch 0087, WHEN se lanzan dos sujetos a la vez con `lib.sh`, THEN los dos trabajan en su molde (0 de 2 preguntan por el repo del kit).

### 2. Un patch que edita una skill no cabe en «menos de 30 min»

- **Qué pasó**: la pieza 1 pedía editar `sdd-end-patch` paso 4. El Art. I exige RED/GREEN con sujetos para una conducta nueva. Solo esa campaña se llevó ~0,5 h de reloj y 3 $, y el patch acabó en 1,3 h frente a 0,5 h estimadas.
- **Dónde en el kit**: `skills/sdd-start-patch/SKILL.md`, «¿Es de verdad un patch?» («típicamente de menos de 30 minutos»), frente a `.docs/sdd/constitution.md` Art. I (dimensionar la campaña).
- **Por qué el kit no lo evitó**: el diagrama de decisión mide el tiempo del fix y no el de la evidencia que exige el Art. I. Una edición de skill siempre trae su campaña.
- **Coste**: la estimación salió 2,6 veces corta.
- **Propuesta**: que `sdd-start-patch` diga que el tiempo de un patch que edita una skill incluye su campaña RED/GREEN y que se declara la previsión antes del primer sujeto, como en una feature. O que el criterio de «<30 min» excluya la campaña y lo diga.
- **Criterio de aceptación**: GIVEN un patch que edita el texto de una skill, WHEN `sdd-start-patch` lo arranca, THEN `patch.md` §5 lleva una estimación que incluye la campaña, y la previsión de sujetos y coste se declara antes del primer sujeto.

### 3. El prefijo 🧪 de la fila de Patches se omitió 2/2 en el baseline

- **Qué pasó**: en el RED, los dos sujetos válidos cerraron en `unattended` con `Validación diferida:` en `patch.md`, pero la fila de Patches quedó sin `🧪 validación diferida a <disparador> — `. Esa regla ya estaba en `sdd-end-patch` paso 0. En el GREEN (1/1), con la frase nueva del paso 4, que nombra el 🧪, el sujeto puso el prefijo en las dos tablas.
- **Dónde en el kit**: `skills/sdd-end-patch/SKILL.md` paso 0 (salida «Diferido»), que define el formato de una fila que se escribe en el paso 4.
- **Por qué el kit no lo evitó**: la regla vive en un paso distinto de donde se escribe la fila. Este patch no lo midió aparte: es una observación lateral del RED.
- **Coste**: sin la fila con 🧪, el cierre de la release no ve el patch diferido.
- **Propuesta**: medirlo como escenario propio. Si se confirma, el paso 4 repite el formato de la fila diferida, o el paso 0 lo remite al paso 4.
- **Criterio de aceptación**: GIVEN el molde del patch 0087 sin sección de release, WHEN un sujeto cierra en `unattended`, THEN la fila de Patches empieza por `🧪 validación diferida a` (2/2).

## Lo que hice por iniciativa propia

- Medir antes el tiempo por fichero con el mismo comando de `FastSuiteBudget`. Si el test pasa, no imprime el desglose, así que lancé su comando aparte. Esa medición cambió el diagnóstico: el conjunto rápido pasaba de 30 s también aislado (35,2 s), no solo con carga. Candidato: que el test imprima siempre el desglose por fichero, pase o falle.
- Dejar en el conjunto rápido «Las capacidades del repo» de `Test-Capabilities`, aunque el fichero pasó a `Slow`: valida las capacidades reales en cada commit y tarda menos de 0,2 s.
- Aplicar la regla nueva del paso 4 al propio patch 0087: su fila entró en la tabla de la release con el 🧪 en «Estado».
- Alinear las 60 filas con un script (estado a «Estado», `Tamaño: X.` al final de la celda) en vez de a mano. Funcionó y el test lo vigila.

## Funcionó, no tocar

- `RoadmapStructure.Tests.ps1`: el test nuevo sale del texto de `roadmap-template.md`, no de una cadena copiada, así que sigue a la plantilla si cambia.
- La suite completa antes del commit cazó dos cosas que no veía el conjunto rápido del momento: `ReleaseFlow` (una skill de patch no nombra `sdd-end-release`) y `SubjectOutputPrivacy` (salidas de sujetos sin limpiar).
- El techo de la campaña del Art. I: al pasarlo, una pregunta con «Cerrar con lo medido» resolvió en un turno.

## Errores míos, no huecos del kit

- Generé las salidas de los sujetos con el `tools.mjs` de la 0055, que no quita el home, en vez de con `tests/headless/extract.mjs`. Lo cazó `SubjectOutputPrivacy`.
- `git commit -F -` con un here-string por tubería falla en la herramienta `PowerShell`. Se usó `-F <fichero>`.
