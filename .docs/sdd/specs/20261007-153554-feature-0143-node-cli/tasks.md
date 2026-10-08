# Tasks — CLI `sdd` en Node

Registro vivo: estado y commit de cada task del [plan](plan.md).

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — Herramientas, esqueleto y pre-commit | hecha | 2db22128 |
| 2 — `capability index/check/merge` | hecha | 176d14ab |
| 3 — `roadmap check` | hecha | f4b4117d |
| 4 — Cerrojo e `id next` | hecha | fd855c0e |
| 5 — `estimation log` | hecha | b71a1d6e |
| 6 — `merge` | hecha | fd74e477 |
| 7 — `roadmap publish` | hecha | 71145c5f |
| 8 — `session tokens` y `watch` | hecha | 7d313dbd |
| 9 — `hook session-start` | hecha | 80cdba06 |
| 10 — Bash de superpowers y `ledger rulings` | hecha | 951728d5 |
| 11 — Skills y capacidades a los verbos | hecha | bb9f588e |
| 12 — Documentos y ADR 0011 | hecha | 07ba89d0 |
| 13 — Humo de las skills | hecha | 566e2033 |
| 14 — Evaluación de `claude plugin eval` | hecha | ac10359b |
- Cuelgue: implementador de la task 5 (Sonnet), sin respuesta tras un Bash, 8 min, relanzado

Revisión final: sdd-kit:effort-high + opus, con arreglos (1 Critical, 5 Important), sobre ac10359b
Pasada de fix: juntada en el cierre, 8 hallazgos (RED→GREEN en 1, 2, 3, 4, 6 y 7)
Re-revisión: juntada en el cierre, sdd-kit:effort-high + sonnet, limpia (3 Minor: 1 arreglado en el hilo, 2 a deuda)

## Rulings

- Ruling: `run(argv: string[], io: Io, verbs: Verb[] = VERBS)` — los tests de T1 necesitan un registro de prueba y el plan fija `run(argv, io)` — si es erróneo, un parámetro opcional de más.
- Ruling: los `.ps1` se borran en T11, no tras cada port (decisión 4 del plan) — las skills los llaman hasta T11 — si es erróneo, nada: la paridad sigue antes del borrado.
- Task 1: Ruling: `@types/node` entra como devDependency y sale el shim `node-shims.d.ts` — TS 7 no trae tipos de Node y un shim en `any` deja sin typecheck los `node:*`; solo tipos, no viaja al proyecto — si es erróneo, una devDependency más que borrar.
- Task 1: Ruling: la verificación de versión mínima es `proto run node 22.18.0 -- cli/bin/sdd.js --help` (proto ya ejecuta node) — error de redacción del plan — nada.
- Task 1: Ruling: `--path` de `roadmap check` es la carpeta `.docs/sdd`, como `Test-Roadmap.ps1 -Path`; el plan decía el fichero — paridad con el script — nada.
- Task 1: minor (deferred): writes utf-8 test mira stderr y no processIo().out; los tests de paridad de T2 cubren stdout UTF-8 con tildes.
- Task 1: minor (deferred): toUsageError convierte cualquier error sin code en error de uso; filtrar por ERR_PARSE_ARGS_.
- Task 1: minor (deferred): sdd <noun> <verb> --help da «opción desconocida».
- Task 1: minor (deferred): test-min llama a node_modules/vitest/vitest.mjs por ruta interna.
- Task 1: minor (deferred): .moon/workspace.yml fija defaultBranch develop (no pedido).
- Task 2: Ruling: io.json imprime JSON compacto en una línea y todos los verbos lo usan — el RED de index json lo pide en una línea — si es erróneo, cambiar io.json.
- Task 2: Ruling: la Kind del delta se conserva como está escrita en los mensajes — paridad byte a byte — nada.
- Task 2: minor (deferred): \b ASCII en JS frente a Unicode en .NET (palabra clave pegada a letra acentuada).
- Task 2: minor (deferred): files.ts excluye symlinks y no excluye ocultos de Windows; localeCompare frente a Sort-Object.
- Task 2: minor (deferred): dos tests de CRLF en merge.test.ts duplicados.
- Task 2: minor (deferred): artifactOption indirecto y existsSync repetido en verbs.ts.
- Task 2: minor (deferred): check --json con artefacto inexistente no emite JSON.
- Ruling: la cabecera de estimation-log.md («AUTO-GENERADO por Build-EstimationLog.ps1») se conserva en T5 por paridad y pasa a nombrar `sdd estimation log` en T11, que regenera el log y ajusta la verificación de v1.0.0.md — la cabecera no puede nombrar un script borrado — si es erróneo, un literal en una cabecera.
- Ruling: docs-claims admite `tools/sdd/Build-EstimationLog.ps1` (copia local heredada de los proyectos que v1.0.0 retira) — es un fichero del proyecto, no del kit — nada.
- Task 3: minor (deferred): \b ASCII en check.ts:134 (`# Roadmapé`); mismo patrón que T2 — triar en la revisión final.
- Task 3: minor (deferred): comparaciones sensibles a mayúsculas donde PS no lo es (secciones en minúsculas, ya inválidas).
- Task 3: minor (deferred): HEADERS[kind]/ITEM_COLUMN[kind] sobre objetos planos devuelven miembros del prototipo (`## constructor`); usar Map u Object.hasOwn.
- Task 3: minor (deferred): fila de Backlog corta da '' en vez de reventar como PS (divergencia deliberada).
- Task 3: minor (deferred): BOM literal invisible en regex de check.ts:122.
- Task 3: minor (deferred): datedLines con 4 parámetros (límite 3).
- Task 3: minor (deferred): tableBlocks reparsea secciones.
- Task 3: minor (deferred): allowlist de FeatureRename más ancho de lo necesario (cli/test/fixtures/.*\.md).
- Task 3: minor (deferred): sin tests de --json con errores, falta de --path ni id de release Unicode.
- Task 4: Ruling: el hilo arregla el arnés de paridad (run-utf8.ps1 y expectParity), que fallaba por la vista de errores de PowerShell y un $LASTEXITCODE heredado, no por el port — los RED son del hilo — entra en la review de T4.
- Task 4: Ruling: withLock pasa a withLock(lock: Lock, timeoutMinutes, body) con Lock = { path, label, io, owner: { branch, worktree } } — la firma del plan tenía 5 parámetros (Art. X, Important plan-mandated) y el dueño salía de process.cwd() — si es erróneo, una interfaz que T6 y T7 consumen ya ajustada en el plan.
- Task 4: minor (deferred): el test de GIT_COMMON_DIR no usa grafía en minúsculas, no prueba la insensibilidad.
- Task 4: minor (deferred): Lock.owner.branch usa '' como centinela; líneas >120 columnas en next.ts y reserve.slow.test.ts.
- Task 4: minor (deferred): BOM literal invisible en regex (scan.ts, lock.ts); contador con \n frente a CRLF; helper git duplicado en tests.
- Task 5: minor (deferred): regex de BOM con carácter literal repetida en capabilities/document.ts, capabilities/sections.ts, roadmap/check.ts, git/lock.ts, ids/scan.ts — unificar con estimation/text.ts readText en la revisión final.
- Task 5: minor (deferred): localeCompare frente a Sort-Object (empates por mayúsculas, Sort-Object inestable); enumeración de carpetas con ocultos/symlinks.
- Task 5: minor (deferred): row.estimate ?? 0 parche de tipos; orden de imports en verbs.ts.
- Task 6: Ruling: el hilo estabiliza la paridad de merge (asuntos ordenados + asunto de la punta) — git log no fija el orden de commits del mismo segundo — entra en la review de T6.
- Ruling: el cuerpo del commit de merge («Fusión hecha con Invoke-SddMerge.ps1 (sdd-kit).») se conserva en T6 por paridad y pasa a nombrar `sdd merge` en T11, junto con la cabecera del estimation-log.
- Task 6: minor (deferred): verify.ts comparte un lineSink entre stdout y stderr (líneas parciales mezcladas).
- Task 6: minor (deferred): retry y aviso de temp-worktree sin test; literal partido en el warn por defecto.
- Task 6: minor (deferred): nombre del log de verify distinto del script (UTC sin guion).
- Task 7: minor (deferred): republicar ficheros idénticos a la rama de integración sale con 1 («nothing to commit») en vez de ser idempotente — decidirlo es salida observable que la spec no fija.
- Task 7: minor (deferred): EISDIR al copiar un directorio y symlink que rechaza con 2; configuredMergeInto repite configPath.
- Task 7: minor (deferred): rmSync del rollback puede tapar el error original; fichero ignorado por .gitignore sobrescrito; git() da 1 si git no se ejecuta.
- Task 7: minor (deferred): gitLines devuelve [] ante error de git en branch --show-current y merge-base.
- Task 8: Ruling: sdd-kit.json o .meta.json corruptos abortan con exit 1 y mensaje en castellano, como el script — la regla es «los mismos resultados» y el «sin tabla pricing» engaña — si es erróneo, un cierre que se para en vez de seguir sin precio.
- Task 8: minor (deferred): watch readDescription tolera .meta.json corrupto (session ya aborta); orden y duplicado de imports de records.ts.
- Task 8: minor (deferred): orden de modelos por inserción; uniqueByPath conserva la última ruta; formato de objetos/arrays en el diagnóstico frente a PowerShell.
- Task 9: Ruling: el hilo autoriza añadir .gitkeep a la fixture projects/no-config/.docs/sdd/ — es dato de fixture que git no versionaba vacío, no cambia ninguna aserción.
- Task 9: minor (deferred): Pester Slow de Hook.Tests.ps1 siguen ejecutando el bash hook (se retira en T11); no-sdd.json sin uso; no-config.json igual a up-to-date.json.
- Task 10: Ruling: las guardas de review package y task not found salen con 1 (el bash, con 3) — la decisión 6 de la spec fija 0/1/2 — si algo de superpowers mira el 3, la 0147 lo ajusta al copiar las skills.
- Task 10: minor (deferred): output() de package.ts ignora el código de git; línea en blanco extra con stat o diff vacíos; stdin 'ignore' frente a heredado; error de spawn (EACCES) reportado como 127.
- Task 10: minor (deferred): rel.startsWith('..') con carpetas «..foo»; marker absoluto D:/x frente a /d/x de Git Bash para planes fuera del repo; ledger rulings crea el workspace como efecto lateral.
- Task 11: Ruling: el hilo ajusta docs-claims para no prohibir task-done/review-package dentro de rutas tests/*.md (evidencia que no se renombra); las citas quitadas se restauran — trazabilidad de las reglas (Art. II).
- Task 11: minor (deferred): docs-claims no detecta un sustantivo mal escrito (filtra por knownNoun); sdd-end-feature en 4500/4500 palabras; feature-flow conserva el cuerpo de los requisitos REMOVED hasta la fusión del cierre; caso negativo del marcador MSYS de otro plan sin test.
- Final: Ruling: la cosecha de rulings pasa al paso 6 de sdd-start-feature, al volver la revisión final y antes de que superpowers borre el workspace, a una sección «Rulings» de tasks.md que el paso 1 de sdd-end-feature copia; ledger rulings no crea el workspace — la decisión 15 lo ponía en el cierre, cuando el workspace ya no existe; el THEN («ejecutado antes de que el workspace se borre») no cambia — si es erróneo, una frase de skill que mover.
- Final: Ruling: --verify de sdd merge usa pwsh si está y, si no, powershell.exe en Windows (sh -c fuera) — la ADR 0011 dice que pwsh deja de ser dependencia — si es erróneo, un gate escrito para pwsh 7 que no corre en 5.1.
- Final: Ruling: capability check --json pasa de valid (número) a validCount, y roadmap check conserva valid (booleano) — contrato nuevo aún sin publicar — nada.
