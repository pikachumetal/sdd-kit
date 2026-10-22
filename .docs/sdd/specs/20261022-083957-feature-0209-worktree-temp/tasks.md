---
id: 20261022-083957-feature-0209-worktree-temp
title: Tasks — Temporales por worktree
spec: ./spec.md
plan: ./plan.md
created: 2026-10-22
---

# Tasks — Temporales por worktree (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0209-worktree-temp`

## Estado de las tasks

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Los tests del repo en `.temp/` | done | c36b7093 | |
| 2 | Sesiones y sujetos headless en `.temp/` | done | fc94ace7 | |
| 3 | La init y la migración ignoran `.temp/` y apuntan los temporales | done | a5dca117 | afectada por enmienda 2026-10-22 (valor por defecto del runner), en la pasada de fix |

Revisión final: Spec opus+high, 3 Important y 7 Minor, 6 sin verificar · Código sonnet+high, 1 Important y 7 Minor · Arquitectura no (plan), sobre a5dca117
Pasada de fix: juntada en el cierre, 15 hallazgos (11 arreglados, 4 por ruling), enmienda aprobada y 3 sujetos con el texto final
Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, 15 ADDRESSED, 2 Minor nuevos (rulings)

## Verificación por task

- [x] Task 1 — `moon run cli:typecheck cli:test kit:test-fast`; `temp-dir.test.ts` 3/3 y `TempDir.Tests.ps1`
- [x] Task 2 — `Invoke-Pester tests/HeadlessLauncher.Tests.ps1 -CI` 31/31; sonda Haiku sin desvío
- [x] Task 3 — `moon run cli:typecheck cli:test kit:test-fast`; batería: RED 2, GREEN 4, REFACTOR 4, REFACTOR 2 3, final 3 (16 sujetos, 5,02 $)

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |

## Rulings

- Task 1: Ruling: la línea base corre en el working tree mientras escribo la Task 1: cli:test y typecheck salieron de la caché de moon (1124/1124) y kit:test arrancó antes de editar Invoke-KitTests.ps1; cli:test-slow y cli:test-min leerán ya cli/vitest.config.ts — coste si es erróneo: un rojo de la base que en realidad es de la Task 1, que el gate de cierre vuelve a medir
- Task 1: Ruling: el RED de TempDir.Tests.ps1 cambia tras guardarlo: Clear-GitEnv sin Restore-GitEnv dejaba el entorno git limpio para el resto de la suite; ahora try/finally — coste: ninguno, la aserción no cambia
- Task 1: Ruling: .gitignore acababa en «undefined» sin salto de línea (no es mío); le doy el salto y no lo borro — coste: una línea basura que sigue
- Task 2: Ruling: sonda Haiku (0,0065 $) desde .temp/ con CLAUDE_CODE_TMPDIR: sin CLAUDE.md del kit, sin el hook del repo (solo el SessionStart de superpowers) y solo skills de la copia, superpowers y builtins — sin desvío. El sujeto de un turno sin herramientas no crea carpeta en <tmp>/claude; la regla del nombre sale de 59 carpetas de campañas previas en %TEMP%/claude: ruta Windows del molde con lo no alfanumérico a «-» — coste si es erróneo: la carpeta de Claude del sujeto no se borra (aviso, no daño)
- Task 2: Ruling: el borrado va en un trap EXIT que subject_init arma (lib.sh), no en run.sh: run.sh no conoce el molde ni la etiqueta de cada sujeto, y el trap corre después de subject_save/subject_keep — coste si es erróneo: un subject.sh que haga exit antes de guardar pierde el molde (con KEEP_MOLD=1 no)
- Task 2: Ruling: el test de 'dos fases' gana KEEP_MOLD=1: mira el molde tras la campaña — coste: ninguno
- Task 2: Ruling: test nuevo de Start-KitSession.ps1 en TempDir.Tests.ps1, escrito tras el código y probado RED contra la versión de HEAD y GREEN contra la nueva — coste: ninguno
- Task 2: Ruling: la guarda de RUNS_DIR normaliza con cygpath -u antes de comparar con REPO_ROOT: Pester pasa rutas Windows — coste: ninguno
- Task 2: Ruling: Start-KitSession.ps1 restaura con Restore-EnvVar por nombre y no con un bucle: KitSessionSource.Tests.ps1 exige SDD_KIT_SESSION_ROOT escrito en el finally — coste: ninguno
- Task 3: Ruling: RED de sujetos con 2 (n6 de sdd-init y v3 de sdd-upgrade, n=1) en vez de 4: el texto que se mide no existe en la base (ni «Temporales» ni .temp/ en init y v3.0.0), así que un sujeto por skill basta para el baseline — coste si es erróneo: un RED con menos muestra; el GREEN lleva la n de la batería
- Task 3: Ruling: GREEN 1: n6 0/2 y v3 0/1 en la propuesta: «not in the config, no declarado» se leyó literal con un playwright.config.ts sin outputDir; REFACTOR 1: el sitio sale de la config o, si no lo fija, del valor por defecto del runner (Playwright: test-results/), sin cambiar la spec (su THEN ya lo exige) — coste si es erróneo: otra vuelta
- Task 3: Ruling: REFACTOR 1: v3 ✓ (propuesta y .gitignore), v1 ✓ .gitignore pero ✗ «Temporales» sin E2E (copió Testing «tal cual»), n6 ×2 paran en la pregunta de flujos core antes del borrador (sitio test-results/ en 1/2). REFACTOR 2 aprobado por el dev-lead («Sí, una vuelta más»): «Temporales» como frase propia en la fila de v3.0.0 (elemento omitido), y n6 con TURN2 para llegar al borrador — coste: ~3 sujetos
- Task 3: Ruling: AnchorTemplates.Tests.ps1 fijaba los doce campos de ## Testing; pasa a trece con «Temporales» tras «Motor de producción» — debió ir en el RED de la task; coste: ninguno
- Final: Ruling: Spec I1 es un desvío (la skill usa el valor por defecto del runner; la spec decía «no se lee de su config → no declarado»): enmienda aprobada por el dev-lead, «Apruebo la enmienda (Recomendada)», con las frases del «no» y de las filas del roadmap y los topes +10
- Final: Ruling: Código m3 guarda de RUNS_DIR repetida en run.sh y lib.sh — se queda: son dos puntos de entrada y lib.sh se carga desde subject.sh sin run.sh; `.temp/../` ya pasaba con *scratchpad* — coste: tocar dos líneas si cambia la guarda
- Final: Ruling: Código m5 Pester sin carpeta por pasada ni barrido — decisión 2 de la spec: lo que deje muere con el worktree; en el clon principal crece despacio — coste: restos de $TestDrive que Pester no borre en el clon principal
- Final: Ruling: Spec m4 sin aviso si la carpeta de Claude no existe — un sujeto sin herramientas no la crea (sonda), avisar sería ruido; la sesión que lanza tiene otro cwd y por construcción otro nombre — coste: si la regla del nombre cambia, la carpeta se queda sin aviso (corrijo el ruling de la Task 2, que decía «aviso»)
- Final: Ruling: Código m6 (TMPDIR en Linux/macOS) — el repo es solo Windows y no tiene CI; os.tmpdir() lee TMPDIR fuera de Windows — coste: temp-dir.test.ts falla si alguien corre la suite en macOS/Linux
- Final: Ruling: Código m7 (carpeta huérfana D:\sdd-fuera-<guid> si la guarda regresa) — el test solo crea la ruta si la guarda falla, y entonces el rojo lo dice — coste: una carpeta vacía en la raíz de la unidad en un RED
- Final: Ruling: re-revisión Minor lib.sh:46 cuatro sentencias en una línea para quedar en 20 — se queda: extraer un helper de dos líneas por un Minor de umbral añade un salto sin ganar lectura — coste: una línea densa
- Final: Ruling: re-revisión Minor temp-dir.test.ts doble resolve y escape del regex en línea — se queda: el test es correcto y lo endureció la revisión; reescribirlo abriría otro commit sin revisar — coste: un regex de lectura costosa
- Final: Ruling: plan.md conserva la regla anterior a la enmienda (§2 Task 3) — el plan es histórico; la enmienda vive en la spec — coste: ninguno
- Final: Ruling: el primer gate de cierre dio rojo en Battery.Tests.ps1 (1361/1362): lee el molde tras la campaña y el trap de lib.sh ya lo había borrado; gana KEEP_MOLD=1 como el test de «dos fases» de la Task 2, en un commit tras la re-revisión que va a ✋ como sin revisar — coste: ninguno, el test vuelve a mirar lo mismo
