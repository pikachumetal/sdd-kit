---
id: 20261109-223338-feature-0326-orphans-eol-and-forecast
feature: 0326
title: Plan de implementación — El lanzador no se cuelga por un huérfano, kit:copies mira el índice y «Previsto» se mide
spec: ./spec.md
status: approved
created: 2026-11-10
---

# Plan de implementación — El lanzador no se cuelga por un huérfano, `kit:copies` mira el índice y «Previsto» se mide

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort**: Native, el hilo implementa las tres tasks; la revisión final con los ejes de `sdd-verify` (Spec `sdd-kit:effort-high` + `opus`, Código `sdd-kit:effort-high` + `sonnet`).
2. **Ejecución**: Native, porque son tres tasks sin interfaz entre ellas, un error lo caza el test de su task y el plan cabe en un contexto.
3. **`launch` reenvía con `child.stdout.pipe(process.stdout, { end: false })`** y lo mismo con stderr; `exited` espera `close` del hijo, y un temporizador de 5 s tras `exit` destruye los dos streams si `close` no llega. Un sujeto se reenvía a la salida de la tanda, que `run.mjs` ya deja a quien lo lanza.
4. **`eolVerdict(indexEol, text)`** vive en `tests/copies/annotated.ts` (función pura, junto a `checkVerbatim`); la consulta a git, en `check.ts` (`indexEols(repoRoot, files)`), una sola llamada con `-z`; un fallo de git o ningún repo devuelve un `Map` vacío.
5. **Riesgo alto**: en Windows, el nieto con `stdio: 'inherit'` hereda los pipes del sujeto, no los de la tanda; si el test ya pasa antes del arreglo, el RED no es RED y se para por desvío (decisión 5 de la spec).
6. **Coste**: ~2 h de implementación; sujetos 1,08 $ (spec); sin otros despachos hasta la revisión final.
7. Review Focus: 3 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: que la tanda termine aunque un sujeto deje un nieto vivo, que `kit:copies` juzgue el CRLF por el índice y que la plantilla exija el origen de lo previsto.

**Architecture**: dos cambios en herramientas del repo (`tests/headless/real-deps.mjs`, `tests/copies/`) con tests en `cli/test/kit/`, y una sustitución de texto en una plantilla medida con `co2`. Sin módulos ni dependencias nuevas: `git` ya es dependencia del repo.

**Tech Stack**: Node 26.10.0, pnpm, moon; Vitest en `cli/test/`; los lentos con `--test-timeout 120000`.

**Spec**: `./spec.md`

**Ejecución**: native, porque 3 tasks independientes, un error lo caza el test de su task y el plan cabe en un contexto (`execution: auto` en `sdd-kit.json`). Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — herramientas del repo y una plantilla; ningún módulo ni dependencia de manifest nuevos.

## Restricciones globales

### De código

- `launch` no mata ningún proceso: ni por nombre, ni por fecha, ni por PID ajeno (decisión 2 de la spec).
- La entrada estándar del sujeto sigue en `inherit`; solo salida y error pasan a pipe (decisión 4).
- `git ls-files --eol` se invoca con `execFile`, `-z` y `--` antes de las rutas; `i/crlf` e `i/mixed` → aviso; `i/lf` → comparar en LF; cualquier otro caso → el disco decide (decisiones 6 y 7).
- El aviso sigue siendo literal `tiene finales de línea CRLF; la fuente de una copia va en LF`.
- Plantilla: la celda pasa a «medido + previsto (`<comando> → <n>` \| sin medir, y al ✋) + 2 % · sin cambio», la ayuda gana «, y lo previsto igual, sobre lo que entra y sale», «para la pasada de fix de la revisión final,» pasa a «para la pasada de fix,» y las líneas 34 y 106 a su forma corta; `sdd-templates` no pasa de 16.978 palabras (decisiones 9 y 10, enmienda del 2026-11-10).
- El aviso del tope del lanzador es literal `[<id>] colgado: tope de <N> s, sujeto cortado` (decisión 12).
- Art. X: sin comentarios que repitan el código ni que citen documentos; clean code; funciones cortas.

### De proceso

- Native; el hilo implementa. Commits: tipo/scope en inglés, título y cuerpo en castellano, con la línea `Co-Authored-By` de la sesión.
- Tests que crean repos git o lanzan procesos van en `*.slow.test.ts` y se corren con `--test-timeout 120000` (`tech-stack.md` §Testing).

## Review Focus

- Sujeto que escribe 64 KB y sale sin esperar al drenado → la tanda reenvía todo, nada se corta · Task 1, `reenvía la cola entera del sujeto`
- `git ls-files --eol` con una ruta con espacios o no ASCII → se lee bien gracias a `-z` · Task 2, `lee una ruta con espacios y acentos`
- Spec que añade un párrafo dado a un fichero con tope → la fila cita el comando que lo contó y su cifra (`wc -w` del párrafo → 42), o dice `sin medir` y va al ✋ · Task 3, filas `CO2P`, `CO2P-C` y `CO2P-M` de `co2p`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: tres cambios mínimos, sin abstracción nueva más allá de `eolVerdict`.
- [x] **YAGNI gate**: nada con menos de 3 usos: `eolVerdict` lo usan `checkCopy` y `checkVerbatim` por `check.ts`.
- [x] **Brownfield gate**: `launch` conserva su contrato (`{ pid, exited }`); `checkCopy` y `checkVerbatim` no cambian de firma.
- [x] **Constitution check**: Art. I (RED antes de la plantilla, con `co2`), Art. X.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `cli/test/kit/headless/launch.slow.test.ts` — la tanda termina con un nieto vivo; la cola del sujeto llega entera.
- `cli/test/kit/copies-eol.slow.test.ts` — `indexEols` con un repo git real: `i/lf w/crlf`, `i/crlf w/lf`, `i/mixed`, sin seguir, fuera de un repo.

**Modificar**:

- `tests/headless/real-deps.mjs` — `launch` con pipes, reenvío y espera de `close` con 5 s de gracia.
- `tests/copies/annotated.ts` — `eolVerdict`.
- `tests/copies/check.ts` — `indexEols` y su uso en `checkFile`.
- `cli/test/kit/copies.test.ts` — tests de `eolVerdict` con texto.
- `skills/sdd-templates/templates/spec-template.md` — la celda y la ayuda de «Topes de palabras».
- `tests/batteries/sdd-propose/battery.md` y `subject.mjs` — el escenario `co2p` y sus filas.
- `tests/headless/lib.mjs` y `cli/test/kit/headless/lib.test.ts` — el aviso del tope dice `colgado` (Task 4).
- `dist/` — `moon run kit:build`.

**NO se tocan**:

- `tests/headless/lib.mjs`, salvo el aviso — `killProcess` y el tope de 1800 s siguen como están.
- `tests/headless/deny-kill.mjs` — no se añade ningún patrón.
- `.docs/sdd/capabilities/` — los fusiona `sdd-archive`.

### 1.6 Dependencias

`git` ≥ 2.10 (`--eol`), ya exigido por el repo.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El nieto con `inherit` hereda los pipes del sujeto y el RED no reproduce el cuelgue | media | el arreglo no demuestra nada | el test lanza la tanda con la salida en pipe y espera `close`; si no vence antes del arreglo, parada por desvío |
| `git ls-files --eol` tarda con muchas copias | baja | `kit:copies` más lento | una sola llamada con todas las rutas |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — La tanda termina aunque el sujeto deje un nieto vivo

**Tras**: —
**Modelo**: Native, el hilo; sin despacho.
**Tests RED**: hilo principal · `cli/test/kit/headless/launch.slow.test.ts`, TDD del propio hilo.

**Superficies**: tooling.
**Verificación**: `pnpm --dir cli exec vitest run test/kit/headless/launch.slow.test.ts --test-timeout 120000` → `Tests  2 passed (2)`.
**Verificación lenta**: omitida.

**Interfaces**:
- Consume: `launch({ subjectSh, args, env })` → `{ pid, exited: Promise<number> }` de `tests/headless/real-deps.mjs`.
- Produce: la misma firma; `exited` resuelve tras `close` (o 5 s tras `exit`).

**Ficheros**: crear `cli/test/kit/headless/launch.slow.test.ts`; modificar `tests/headless/real-deps.mjs`.

- [ ] **Step 1: Implementación**
  - Test `la tanda termina con un nieto que hereda la salida`: escribe en un tmp un `subject.mjs` que hace `spawn(process.execPath, ['-e', 'setTimeout(() => {}, 120000)'], { stdio: 'inherit', detached: process.platform !== 'win32' })`, guarda `child.pid` en `<tmp>/grandchild.pid` y sale con 0. El test lanza `node tests/headless/run-launch.mjs`… no: lanza directamente con `spawn(process.execPath, ['-e', '<script que importa realDeps().launch y espera exited>'], { stdio: ['ignore', 'pipe', 'pipe'] })` y espera `close` del proceso de la tanda con `Promise.race` contra un temporizador de 60 s; `expect(cerradoAntesDe60s).toBe(true)`. En `afterEach`, lee `grandchild.pid` y lo para con `killProcess(pid)` de `lib.mjs`.
  - Test `reenvía la cola entera del sujeto`: `subject.mjs` escribe `'x'.repeat(65536) + '\nFIN\n'` con `process.stdout.write` y sale con `process.exit(0)` en el callback; la tanda de prueba captura su stdout; `expect(out.endsWith('FIN\n')).toBe(true)`.
  - `real-deps.mjs`, `launch`: `spawn(process.execPath, [subjectSh, ...args], { env, stdio: ['inherit', 'pipe', 'pipe'], windowsHide: true })`; `child.stdout.pipe(process.stdout, { end: false })`, `child.stderr.pipe(process.stderr, { end: false })`; `exited` resuelve con el código en `close`; en `exit`, `setTimeout(() => { child.stdout.destroy(); child.stderr.destroy(); }, 5000)` con `unref()`, y se cancela en `close`.
- [ ] **Step 2: Build** — `node --check tests/headless/real-deps.mjs`.
- [ ] **Step 3: Verificación** — el comando de arriba; antes del arreglo el primer test vence (RED), después `2 passed`.
- [ ] **Step 4: Commit de la task** — `fix(headless): la tanda termina aunque el sujeto deje un nieto con su salida`.

### Task 2 — `kit:copies` juzga el CRLF por el índice

**Tras**: —
**Modelo**: Native, el hilo; sin despacho.
**Tests RED**: hilo principal · `cli/test/kit/copies.test.ts` (texto) y `cli/test/kit/copies-eol.slow.test.ts` (repo git).

**Superficies**: tooling.
**Verificación**: `pnpm --dir cli exec vitest run test/kit/copies.test.ts test/kit/copies-eol.slow.test.ts --test-timeout 120000` → `Tests  N passed (N)` con N = los de hoy + 9; y `moon run kit:copies` → `Copias al día: 31 ficheros.`.

**Interfaces**:
- Consume: `checkCopy(input: CopyInput)` y `checkVerbatim(...)` de `annotated.ts`; `checkFile` de `check.ts`.
- Produce: `export type IndexEol = 'lf' | 'crlf' | 'mixed' | 'none' | 'other'`; `export function eolVerdict(indexEol: IndexEol | undefined, text: string): { problem: 'crlf' } | { text: string }` en `annotated.ts`; `export async function indexEols(repoRoot: string, files: string[]): Promise<Map<string, IndexEol>>` en `check.ts`.

**Ficheros**: modificar `tests/copies/annotated.ts`, `tests/copies/check.ts`, `cli/test/kit/copies.test.ts`; crear `cli/test/kit/copies-eol.slow.test.ts`.

- [ ] **Step 1: Implementación**
  - `eolVerdict`: `indexEol === 'crlf' || indexEol === 'mixed'` → `{ problem: 'crlf' }`; `indexEol === 'lf'` → `{ text: text.replace(/\r\n/g, '\n') }`; en otro caso, `text.includes('\r')` → `{ problem: 'crlf' }`, si no `{ text }`. `checkCopy` y `checkVerbatim` conservan su comprobación de `\r` (ya reciben el texto limpio cuando toca).
  - `indexEols`: `execFile('git', ['ls-files', '--eol', '-z', '--', ...files], { cwd: repoRoot })`; parsea cada registro `i/<eol>\tw/<eol>\tattr/...\t<ruta>`; en error o fuera de un repo, `new Map()`.
  - `checkFile`: lee el disco, aplica `eolVerdict(eols.get(file), annotated)`; con `problem`, devuelve `[formatProblem({ file, message: MESSAGES.crlf })]`; si no, sigue con `text`. `checkRegistryCopies` llama a `indexEols` una vez con todas las rutas `kit` de las entradas `copy`.
  - Tests de texto (`copies.test.ts`): `eolVerdict('lf', 'a\r\nb')` → `{ text: 'a\nb' }`; `('crlf', 'a\nb')` → crlf; `('mixed', 'a\nb')` → crlf; `(undefined, 'a\r\nb')` → crlf; `(undefined, 'a\nb')` → `{ text: 'a\nb' }`.
  - Tests con repo (`copies-eol.slow.test.ts`): `git init` en tmp con `.gitattributes` `* text eol=lf`, `core.autocrlf=true`; fichero commiteado en LF y reescrito en CRLF → `indexEols` da `lf`; fichero añadido con CRLF y `-c core.autocrlf=false` → `crlf`; ruta `sub dir/áé.md` → se lee; fichero sin `git add` → ausente del `Map`; carpeta sin repo → `Map` vacío.
- [ ] **Step 2: Build** — `moon run cli:typecheck`.
- [ ] **Step 3: Verificación** — los comandos de arriba.
- [ ] **Step 4: Commit de la task** — `fix(copies): el CRLF de una copia lo decide el índice de git`.

### Task 3 — «Previsto» lleva su origen

*(Enmienda del 2026-11-10: pasa de `co2` a `co2p`; ver la spec, decisiones 9 a 11.)*

**Tras**: —
**Modelo**: Native, el hilo; sujetos de `co2p` en sonnet, `N=2`.
**Tests RED**: `SCENARIOS="co2p" N=2 PHASE=red node tests/headless/battery.mjs run tests/batteries/sdd-propose/battery.md` con `KIT_DIR` del kit de `develop` y la batería de la rama.

**Superficies**: docs (skill), tooling (batería).
**Verificación**: `SCENARIOS="co2p" N=2 PHASE=green node tests/headless/battery.mjs run …` → `co2p · 2/2` y las filas `CO2P`, `CO2P-C` y `CO2P-M` en verde; `pnpm --dir cli exec vitest run test/kit/word-budget.test.ts` en verde con `sdd-templates` a 16.978; `moon run kit:build kit:skill-size kit:own`.
**Verificación lenta**: las tandas de `co2p` (sujetos de pago, ~1,31 $ cada una) se lanzan en segundo plano.

**Interfaces**:
- Consume: nada.
- Produce: nada.

**Ficheros**: modificar `skills/sdd-templates/templates/spec-template.md`, `tests/batteries/sdd-propose/battery.md` y `tests/batteries/sdd-propose/subject.mjs` (`steps.co2p`); `cli/test/kit/word-budget.test.ts` vuelve a 16.978; `dist/` por el build.

- [ ] **Step 1: Implementación**
  - Escenario `co2p`: el molde de `co2` y un párrafo de 42 palabras en la petición, «carril feature»; `co2` sin cambios.
  - Filas `CO2P` (juicio), `CO2P-C` (`tools:` con una llamada que cuenta y contiene «pizarra») y `CO2P-M` (`file: spec-new.md`, la fila con `→` o `sin medir`).
  - RED con el kit de `develop` (`git archive origin/develop:dist`), n = 2: se espera rojo.
  - Plantilla: la celda «medido + previsto (`<comando> → <n>` \| sin medir, y al ✋) + 2 % · sin cambio», «, y lo previsto igual, sobre lo que entra y sale», «para la pasada de fix,» y los recortes de las líneas 34 y 106.
  - `moon run kit:build`; GREEN con la rama, n = 2: 2/2. Medir `word-budget.test.ts`: `sdd-templates` 16.978.
- [ ] **Step 2: Build** — `moon run kit:build`.
- [ ] **Step 3: Verificación** — los comandos de arriba; evidencia en `tests/sdd-templates-0326-red.md` y `-green.md`.
- [ ] **Step 4: Commit de la task** — `feat(sdd-templates): lo previsto de los topes de palabras lleva su origen`.

### Task 4 — El aviso del tope dice `colgado`

*(Enmienda del 2026-11-10; spec, decisión 12 y Scope (4).)*

**Tras**: —
**Modelo**: Native, el hilo.
**Tests RED**: `pnpm --dir cli exec vitest run test/kit/headless/lib.test.ts -t "SUBJECT_TIMEOUT mata"` con el literal nuevo → falla.

**Superficies**: tooling.
**Verificación**: `pnpm --dir cli exec vitest run test/kit/headless/lib.test.ts` en verde.

**Interfaces**:
- Consume: nada.
- Produce: el aviso `[<id>] colgado: tope de <N> s, sujeto cortado` en el error de la tanda.

**Ficheros**: modificar `tests/headless/lib.mjs` y `cli/test/kit/headless/lib.test.ts`.

- [ ] **Step 1: Implementación** — test con el literal nuevo (RED), y `lib.mjs:492` (GREEN).
- [ ] **Step 2: Verificación** — el comando de arriba.
- [ ] **Step 3: Commit de la task** — `fix(headless): el aviso del tope de un sujeto dice colgado`.

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 1,2h
- Estimación de implementación: 2h
- Estimación de revisión: 0,5h
- Estimación de cierre: 0,5h
- Base de la estimación: 3 tasks independientes; la incertidumbre está en el RED de la Task 1 en Windows; referencia: 0321 (4 arreglos de herramienta, 0,28 h) y 0320.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop`
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- `kit-distribution` THEN (blob `i/crlf` o `i/mixed` → aviso) → Task 2, `copies-eol.slow.test.ts` (`crlf`) y `eolVerdict('crlf'|'mixed')`. ✓
- AND no `.md` que difiere en LF → N/A, sin cambios (`checkVerbatim`). ✓
- AND `.gitattributes` → N/A, sin cambios. ✓
- AND `i/lf w/crlf` igual a su original → sin aviso, `Copias al día` → Task 2, `indexEols` da `lf` y `eolVerdict('lf')`; `moon run kit:copies` en el checkout. ✓
- AND sin seguir con CRLF → aviso → Task 2, ausente del `Map` + `eolVerdict(undefined, crlf)`. ✓
- AND fuera de un repo con CRLF → aviso → Task 2, `Map` vacío + `eolVerdict(undefined, crlf)`. ✓
- Regla ante conflicto → la fusiona `sdd-archive`; su conducta es la de arriba. ✓
- `feature-flow` THEN y AND de la fórmula → N/A, sin cambios. ✓
- AND lo previsto lleva el comando y su cifra (o `sin medir`, y al ✋) → Task 3, filas `CO2P`, `CO2P-C` y `CO2P-M` de `co2p`. ✓
- Decisión 12, aviso `colgado` → Task 4, test del tope de `lib.test.ts`. ✓
- AND recorte con RED, AND sin topes → N/A, sin cambios. ✓
- Éxito «la tanda de la 0311 termina sola» → Task 1, `la tanda termina con un nieto que hereda la salida`. ✓
- Éxito «no se pierden las últimas líneas» → Task 1, `reenvía la cola entera del sujeto`. ✓
- Anti-objetivo «no matar procesos de otra tanda» → restricción de código; sin test (el código no llama a `kill`). ⚠ avisado en las decisiones.
- Tabla «Lo que se retira»: celda y ayuda de la plantilla → Task 3; `feature-flow.md:630` → delta; `real-deps.mjs:14` → Task 1. ✓
- Review Focus → Tasks 1, 2 y 3, los tests nombrados. ✓
