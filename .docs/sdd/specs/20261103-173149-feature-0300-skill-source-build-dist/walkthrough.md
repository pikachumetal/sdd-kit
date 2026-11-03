---
id: 20261103-173149-feature-0300-skill-source-build-dist
feature: 0300
title: Walkthrough — La base, con la fuente intermedia, el build y dist/ sin las tripas del kit
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-03
---

# Walkthrough — La base, con la fuente intermedia, el build y dist/ sin las tripas del kit

## 1. Cambios realizados

- **Build y `dist/`** (`63d27d13`):
  - `build/dist.ts` construye `dist/` desde la lista blanca, con los ficheros de `git ls-files --cached --others --exclude-standard`.
  - Quita de los `.md` las líneas `<!-- kit: … -->`, fuera de los bloques de código. Una marca mal puesta para el build sin tocar `dist/`.
  - Sincroniza `dist/` sin vaciarlo.
  - `dist/` va commiteado (ADR 0023), con `-diff linguist-generated` y fuera de `rg` por `.ignore`.
  - `cli/test/kit/dist.test.ts` falla si `dist/` no es lo que sale del build. El marketplace pasa a `"./dist"`, `kit:skill-size` mide `dist/skills/`, y el Art. VIII admite la copia generada.
- **La sesión de desarrollo y los sujetos** (`31004bf3`):
  - `start-kit-session.mjs` construye `dist/` y arranca con `--plugin-dir dist`; si el build falla, no arranca.
  - El hook `kit-session-source.mjs` y las reglas 1, 3, 4 y 5 de `CLAUDE.md` llevan a `dist/skills/`.
  - La copia del kit para sujetos sale de `git archive <commit>:dist`.
- **Registro de fuentes** (`f92e19cb`):
  - `upstream.json` guarda 24 entradas (copias y conceptos), con su fuente, versión, rutas y fichero del kit.
  - `build/notices.ts` genera de él la sección «Fuentes» de `THIRD_PARTY_NOTICES.md` y los 11 `NOTICE`, con el mismo texto legal y cabeceras nuevas.
  - `tests/upstream/check.ts` compara solo las rutas de cada entrada con el último tag de su fuente.
- **Prueba de instalación y glosario** (`e3e544b6`): `install/install.mjs` instala con Claude Code 2.1.317 la base y la actualiza a `HEAD`. Deja su informe en [`install/install.md`](install/install.md).

## 2. Tiempo y coste: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (del plan): 4h
- Esfuerzo real: 1,30 h — reloj de la sesión 1,35 h desde 2026-11-03T17:17Z, sin 3 min de espera al dev-lead (1 espera)
- Desviación: −2,70 h (−67 %)
- Causa de la desviación: Esperas y huecos: 17:39Z 3 min; la desviación no viene de esperas, sino de una estimación holgada para cuatro tasks con el diseño ya medido en la apertura
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado (spec, plan y ejecución)
- Tokens del hilo: 96.265.978 — claude-opus-5-5 96.265.978
- Tokens de subagentes: 15.529.665 en 5 despachos — Final review — Code axis claude-sonnet-5-5 2.800.412 / 5 min; Revisión adversarial de la spec 0300 claude-sonnet-5-5 251.443 / 2 min; Final review — Architecture axis claude-opus-5-5 5.089.248 / 5 min; Final review — Spec axis claude-opus-5-5 6.314.711 / 6 min; Re-review final 0300 claude-opus-5-5 1.073.851 / 3 min
- Coste de la sesión: 37,49 $ (hilo 29,17 $ + subagentes 8,32 $)
- Coste de sujetos: no aplica
- Review de spec: 1 revisor (siete puntos, Sonnet) · hallazgos 10, aceptados 10 (uno en parte, uno como «no aplica» con motivo)

## 3. Desviaciones del plan

- La Task 3 da rojo en `kit:upstream` en más copias que las de superpowers que preveía: también OpenSpec y mattpocock. Es el estado real.
- `build/package.json` y la corrección de `cli/test/kit/skills.test.ts:96`, que el plan no listaba.
- La pasada de fix de la revisión final, juntada en el cierre:
  - el render y la plantilla MIT pasan de `build/sources.ts` a `build/notices.ts`, para que el aviso «sin plantilla en build/notices.ts» señale el fichero que la tiene;
  - `BuildError` pasa a `build/errors.ts`;
  - `kit:notices` borra los `NOTICE` huérfanos y reconstruye `dist/`.
- La retro: `cli:typecheck` lee el repo entero en sus `inputs` (`cli/moon.yml`).

### Decisiones tomadas sin el dev-lead

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

## 4. Verificación

### 4.1 Builds

- Gate: `moon run kit:test-headless cli:typecheck cli:test` → kit:test-headless: corrió 399/399 (sin filtro: cambia el build) · cli:typecheck: corrió, verde (sin filtro: cambia el build; caché de moon del mismo hash) · cli:test: corrió 2103/2115, 12 saltados (sin filtro: cambia el build) · 102 s · configuración: la del gate · sobre el commit de cierre (la rama toca `build/package.json`, un `package.json`)
- Tras la retro, que cambia la definición de `cli:typecheck` (`cli/moon.yml`): `moon run cli:typecheck` → cli:typecheck: corrió, verde (sin filtro: cambia su definición), y con un error de tipos puesto a mano en `build/errors.ts` da `error TS2322` en vez de la caché
- Además: `moon run cli:test-slow` → 486/486 en 423 s; y `install/install.mjs` → las cuatro comprobaciones en «sí» ([install.md](install/install.md))

### 4.2 Smoke / tests

- Validación en campo: 2026-11-03 · gate 399/399 · 2103/2115 · `cli:test-slow` 486/486 · smoke de 6 THEN y 21 AND con ejecución real o suite (tabla) · instalación real con Claude Code 2.1.317 desde un marketplace git local · revisión final en tres ejes sobre e3e544b6 (Spec opus+high, Código sonnet+high y Arquitectura opus+high: con arreglos), pasada de fix con 6 hallazgos RED→GREEN y re-revisión opus+high que cumple · byte a byte: 93 ficheros de `skills/` de la base iguales en `dist/skills/` de HEAD, y los 11 `NOTICE` distintos · la actualización con el marketplace `github` real queda para el corte de la 3.0.0 (0311)

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| Lo que viaja: la caché de la versión nueva solo con la lista blanca | ejecución real (`install.mjs`: 234 ficheros, `.claude-plugin`, `agents`, `cli`, `hooks`, `skills`, `LICENSE`, `THIRD_PARTY_NOTICES.md` y `.in_use` de Claude Code) | cumple |
| Lo que viaja: sin `.docs/`, `tests/`, `cli/test/` ni una línea `<!-- kit:` | ejecución real (`install.md`, «Ninguna línea `<!-- kit:`»: sí) | cumple |
| Sale limpia: la marca de `skills/sdd-tdd/SKILL.md` no llega a `dist/` y el resto queda byte a byte | ejecución real: una marca `<!-- kit: 0186 · sustituye: «x» -->` en la fuente, `moon run kit:build`, 0 marcas en `dist/skills/sdd-tdd/SKILL.md` e idéntico a la fuente original; marca retirada y `dist/` limpio | cumple |
| Sale limpia: sin marcas sale idéntica · una marca en un bloque de código se copia | suite (`copies a source without marks byte for byte`, `keeps a kit mark inside a fenced code block`, `… nested in a list`) | cumple |
| Sale limpia: una marca mal puesta para el build y `dist/` no cambia | ejecución real: `x <!-- kit: prueba -->` al final de `skills/sdd-tdd/SKILL.md` y `node start-kit-session.mjs --version` → `skills/sdd-tdd/SKILL.md:322: marca mal puesta: …`, `start-kit-session: arregla la fuente…`, exit 1, sin lanzar claude; `git status dist` vacío | cumple |
| dist/ = build: un cambio sin reconstruir da el rojo con su mensaje | ejecución real: una línea de más en `dist/skills/sdd-tdd/SKILL.md` → `dist/ no es lo que sale del build: ejecuta moon run kit:build` con la ruta | cumple |
| dist/ = build: tras `moon run kit:build` pasa | ejecución real (el mismo test en verde tras reconstruir) | cumple |
| dist/ = build: lo ignorado no entra | suite (`takes only tracked or addable files of the whitelist`) | cumple |
| Avisos: un `NOTICE` editado a mano da el rojo · `kit:notices` lo rehace | ejecución real: `version v7.0.0` → `v7.0.1` en `skills/sdd-tdd/NOTICE` → `skills/sdd-tdd/NOTICE no es lo que sale de upstream.json: ejecuta moon run kit:notices`; `moon run kit:notices` lo reescribe y los tests vuelven a verde | cumple |
| El corte: rutas sin cambios pasan · rutas que cambian, que faltan, versión que falta, versión commit, sin `SDD_UPSTREAM_DIR` | suite (`upstream-watch.slow.test.ts`, 15 casos) y ejecución real de `moon run kit:upstream` contra los siete clones (rojo en las copias que no siguen su última versión, sin «falta» ni «no existe») | cumple |
| 2.3.4 actualiza sin pasos: caché nueva limpia y la 2.3.4 con `.orphaned_at` | ejecución real en local (`install.md`); con GitHub, post-merge en el corte de la 3.0.0 | cumple en local |

- Verificado por el agente: todo lo de arriba. Reportado por el usuario: nada.
- Comprobación legal de la Task 3, antes de sustituir los `NOTICE`: los once conservan sus líneas `Copyright` y el texto MIT (`sdd-verify` pasa de 2 cuerpos MIT compartidos a 4, uno por fuente).

### 4.3 Residuales / deuda generada

- Las versiones de las fuentes siguen escritas en el texto de 7 skills (`sdd-tdd/SKILL.md:10`, `sdd-debugging/SKILL.md:10`, `sdd-agent-writing/SKILL.md:8`, `sdd-propose/references/spec-writing.md:3` y `plan-writing.md:3`, `sdd-verify/references/architecture-reviewer-prompt.md:87` y `code-reviewer-prompt.md:210`): en esta feature ninguna frase de skill cambia, y la 0302 las saca o las vigila contra `upstream.json` (eje Spec, I2).
- El registro empareja `paths` y `kit` como listas sueltas: la 0302, que fusiona fichero a fichero con `git merge-file`, tendrá que emparejarlos (eje Arquitectura).
- `kit:upstream` en rojo con las copias que no siguen su última versión: superpowers 7.0.1 (implement, propose, grilling, agent-writing, `cli/src/tasks`), OpenSpec 1.16.0 y mattpocock 1.3.2. Lo saldan la 0296 y la 0302, antes del corte de la 3.0.0.
- La actualización con un marketplace `github` real se valida al publicar la 3.0.0 (0311).

## 5. Aprendizajes

- Para medir lo que recibe un usuario hay que instalar desde un marketplace git servido por HTTP: `file://` no se acepta y una carpeta local se carga en el sitio → `tech-stack.md`, «Distribución».
- ADR: dist/ commiteado en develop, no una rama dist publicada en el corte → decisions/0023-dist-committed.md

Retro: error que cazaría un chequeo → `cli:typecheck` con `inputs: ['@group(testInputs)']`: un error de tipos en `build/` salía de la caché en verde (`cli/moon.yml`)

## 6. Adendas
