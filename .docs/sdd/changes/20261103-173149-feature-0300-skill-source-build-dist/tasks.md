---
id: 20261103-173149-feature-0300-skill-source-build-dist
title: Tasks — La base, con la fuente intermedia, el build y dist/ sin las tripas del kit
spec: ./spec.md
plan: ./plan.md
created: 2026-11-03
---

# Tasks — La base, con la fuente intermedia, el build y dist/ sin las tripas del kit (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0300-skill-source-build-dist`

## Estado de las tasks

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Build, `dist/` y marketplace | done | 63d27d13 | |
| 2 | La sesión de desarrollo y la copia para sujetos desde `dist/` | done | 31004bf3 | |
| 3 | El registro de fuentes y los avisos generados | done | f92e19cb | |
| 4 | Prueba de instalación, byte a byte y glosario | done | e3e544b6 | |

## Verificación por task

- [x] Task 1 — `vitest run test/kit/dist.test.ts test/kit/skill-size.test.ts test/kit/path-length.test.ts`, `dist.slow.test.ts`, `moon run kit:build kit:skill-size`, `cli:typecheck`
- [x] Task 2 — `kit-session-source.slow.test.ts`, `moon run kit:test-headless`, `manifests.slow.test.ts`, el `rg` de la spec y el fallo de build a mano
- [x] Task 3 — `notices.test.ts`, `dist.test.ts`, `upstream-watch.slow.test.ts`, `moon run kit:upstream`
- [x] Task 4 — `install.mjs` y la comparación byte a byte

## Revisión final

Revisión final: Spec opus+high, con arreglos (2 Important, 6 Minor) · Código sonnet+high, con arreglos (2 Important, 8 Minor) · Arquitectura opus+high, con arreglos (1 Important, 8 Minor), sobre e3e544b6

Pasada de fix: juntada en el cierre, 6 hallazgos RED→GREEN (más 10 arreglos de docs, nombres y estructura con la suite en verde)

Re-revisión: e3e544b6..pasada de fix (juntada en el cierre), sdd-kit:effort-high + opus, cumple: sin fallos nuevos Critical ni Important; 4 Minor adjudicados

## Fixes adicionales

Ninguno.

## Rulings

- Task 1: Ruling: build/package.json con "type": "module", que el plan no listaba — sin él tsc trata build/dist.ts como CommonJS (TS1470, TS1309) y Node avisa MODULE_TYPELESS_PACKAGE_JSON; es el patrón de tests/upstream/ — coste si falla: ninguno
- Task 1: Ruling: el filtro de existencia vive solo en buildDist, no en listSources — una sola comprobación basta y el test «skips listed files that no longer exist» la fija — coste si falla: un fichero borrado listado por listSources
- Task 1: Ruling: cli/test/kit/skills.test.ts:96 fijaba source '.', y la tabla de retiradas no lo recogía (la búsqueda no casaba toBe('.')) — pasa a './dist' — coste si falla: ninguno
- Task 2: Ruling: start-kit-session.mjs necesita git (construye dist/ antes de buscar claude); el test existente «says so when claude is not on the PATH» pasa a darle el directorio de git en el PATH — es el único cambio respecto a la copia RED de kit-session-source.slow.test.ts — coste si falla: ninguno, el test sigue probando la falta de claude
- Task 2: Ruling: CLAUDE.md, reglas 3 y 4, también pasan a dist/skills/ (control-profiles.md y launch-prompt-template.md), que la tabla de retiradas no listaba — llevaban al agente a leer la fuente — coste si falla: ninguno
- Task 3: Ruling: noticeFiles recibe también repoRoot (noticeFiles(registry, repoRoot)), porque THIRD_PARTY_NOTICES.md conserva a mano la introducción y «Skills de desarrollo» y solo se sustituye «## Fuentes» — coste si falla: ninguno, una firma interna
- Task 3: Ruling: los conceptos llevan la «versión vista» de hoy de su fuente (to-spec y domain-modeling v1.3.2, impeccable skill-v4.8.0), que es la última revisada (decisión 7 de la spec); la decisión 8 solo fijaba las de las copias — coste si falla: un cambio de esas rutas entre la versión tomada y la vista no se vuelve a revisar
- Task 3: Ruling: kit:upstream da rojo en más copias que las de superpowers que preveía el plan: también OpenSpec (sdd-verify, v1.14.1 → v1.16.0) y mattpocock (code-review v1.3.1, grilling 85f83d3, rubber-duck v1.2.3 → v1.3.2). Es el estado real: esas copias tampoco siguen su última versión; kit:upstream solo corre en el corte — coste si falla: el corte de la 3.0.0 tendrá que actualizar o anotar esas copias (0302)
- Task 3: Ruling: una ruta que falta en el último tag da solo «la ruta … no existe en …», sin el diff de esa entrada; y sin upstream.json, «Sin el registro de fuentes en <ruta>.», literal que la spec no fijaba (sustituye a «Sin la tabla de «Fuentes vigiladas»…») — coste si falla: ninguno
- Task 3: Ruling: THIRD_PARTY_NOTICES.md se reestructuró una vez a mano (introducción, «## Fuentes» y «Skills de desarrollo de este repo») antes de generarlo; las dos listas de prosa con versiones salen
- Task 4: Ruling: install.mjs sube la versión de prueba al parche siguiente (2.3.5) en vez de «<versión>-test»: la medida de la apertura actualizó de 2.3.4 a 2.3.5, y una prerelease por debajo de 2.3.4 en SemVer no está probada — coste si falla: ninguno, es solo el commit de prueba
- Final: Ruling: Spec I2, las versiones de las fuentes escritas en el texto de 7 skills (sdd-tdd:10, sdd-debugging:10, sdd-agent-writing:8, spec-writing.md:3, plan-writing.md:3, architecture-reviewer-prompt.md:87, code-reviewer-prompt.md:210) — no se tocan porque ninguna frase de skill cambia en esta feature; va como deuda para la 0302 en el walkthrough y el ticket — coste si falla: dos versiones divergentes cuando la 0302 suba una entrada
- Final: Ruling: Spec m7, versiones de concepto = versión vista (ruling de la Task 3) — la decisión 7 la respalda; se lo digo al dev-lead para que lo confirme — coste si falla: un cambio entre la versión tomada y la vista sin revisar
- Final: Ruling: Código m8, los mensajes de campaign.mjs y lib.mjs conservan «(antes de la feature 0300: git archive <commit> skills …)» — lo pide la decisión 12 de la spec para medir commits anteriores; es texto para quien lanza una campaña, no un comentario — coste si falla: ninguno
- Final: Ruling: Arq m5, dist/THIRD_PARTY_NOTICES.md viaja con «Skills de desarrollo» y enlaces a .docs/ que en la caché no resuelven — es un aviso legal-informativo y la sección dice que no forma parte del plugin; partirlo exigiría otro generador — coste si falla: enlaces muertos en un aviso que el agente no carga
- Final: Ruling: Arq m8, los ficheros sin trackear y no ignorados entran en dist/ — decisión 6 de la spec, aprobada: incluye lo que se commitearía, también un fichero nuevo sin add; la CI lo caza — coste si falla: publicar un fichero sin su fuente commiteada
- Final: Ruling: Código m7, los main de build/dist.ts y build/notices.ts sin test — tres líneas que convierten BuildError en exit 1, y start-kit-session, que usa el mismo patrón, sí lo tiene — coste si falla: un error de build sin mensaje
- Final: Ruling: re-revisión m1, notices.test.ts usa mkdtempSync con try/finally en vez de tempDirs() — un solo uso, borra lo que crea — coste si falla: ninguno
- Final: Ruling: re-revisión m2, toyKitWithMisplacedMark y fakeClaude dejan carpetas en el tmpdir de vitest — es el patrón que ya seguía launchWithFakeClaude, y temp-setup.ts barre las carpetas vitest-* de más de 24 h — coste si falla: carpetas temporales en .temp/
- Final: Ruling: re-revisión m3, FENCE con ^\s* toma como valla una línea ``` sangrada 4 espacios fuera de una lista — ninguna skill la tiene hoy y el porqué está escrito; el caso contrario (valla en lista anidada) borraba marcas de un ejemplo sin avisar — coste si falla: una marca que no se quita, y la caza el test «dist has no kit mark»
- Final: Ruling: re-revisión, removeOrphanNotices sin test unitario — lo vigila «has no NOTICE outside the registry» contra el repo, que muerde con un NOTICE de más (comprobado) — coste si falla: un NOTICE huérfano tras kit:notices, que el test caza
