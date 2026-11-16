---
id: 20261109-135213-patch-0325-privacy-test-bounded-read
task: 0325
title: Patch — el test de privacidad de la evidencia lee en paralelo y solo lo que git conoce
type: patch
solution: causa raíz
status: done
created: 2026-11-09
branch: patch/0325-privacy-test-bounded-read
commit: 8473a12e
---

# Patch 0325 — el test de privacidad de la evidencia lee en paralelo y solo lo que git conoce

Validación: agente, «Perfil delegate» con `validation.mode: field` — cambia un test del repo: no hay nada que una persona observe que la suite y el fichero plantado no midan.

## Capacidades

- Ninguna, porque ninguna capacidad describe `cli/test/kit/subject-output-privacy.slow.test.ts`.

## 1. Síntoma

Fila 0325 del roadmap (sesión de coordinación, 2026-11-09, comprobaciones del corte de la 3.0.0): `node cli/bin/sdd.js lock run -- moon run cli:test-slow cli:test-min` dio en `cli:test-min` 1 fichero rojo de 136: `test/kit/subject-output-privacy.slow.test.ts` > «La evidencia de los sujetos no lleva el home de la máquina», `Error: Hook timed out in 10000ms.` en el `beforeAll` de la línea 241. Solo, con `pnpm --dir cli exec vitest run test/kit/subject-output-privacy.slow.test.ts --test-timeout 120000`, el mismo rojo en 27 s.

## 2. Causa raíz

El `beforeAll` hace en síncrono, en el hilo del worker, todo el trabajo de E/S de la evidencia, y ese trabajo crece con cada campaña:

- `repoEvidence()` (`subject-output-privacy.slow.test.ts:225`) recorre cada subcarpeta de las 310 tareas con `readdirSync(..., { recursive: true })` y hace un `statSync` por cada una de las 25.674 entradas para quedarse con los ficheros.
- `readEvidence()` (`privacy.ts:47`) lee después con `readFileSync`, uno tras otro, los 21.257 ficheros: 71 M caracteres.

Medido fuera de vitest con el mismo código (un script en el scratchpad de la sesión), la primera vez: 0,7 s de `readdirSync`, 2,1 s de `statSync` y 6,9 s de lectura, 9,6 s en total; repetido con la caché del disco caliente, la lectura baja a 2,6 s. Solo con vitest y Node 26 el fichero pasó en 13,9 s (99 % en tests). El tope del hook es el de vitest por omisión, 10 s, y `cli:test-min` no lo cambia: con 8 workers compitiendo por disco y CPU y la caché fría, el mismo trabajo pasa de 10 s. Cuantos más ficheros, menos carga hace falta para el rojo.

Alternativas medidas sobre los 21.562 ficheros que lista `git ls-files` (otro script del scratchpad, caché caliente, dos pasadas):

| Lectura | Listar | Leer |
| --- | --- | --- |
| `readdirSync` + `statSync` + `readFileSync` en serie (hoy) | 2.700 ms | 2.594–2.693 ms |
| `git ls-files` + `readFile` en paralelo | 59–81 ms | 865–1.052 ms |
| `git ls-files` + `git cat-file --batch` | 60–84 ms | 37.636–39.421 ms |

Acotar a lo que cambió desde la última release no basta: desde `v2.3.4` cambiaron 14.671 de los 21.257 ficheros, solo un 30 % menos, y si cambia un patrón de `privacy.ts` los ficheros de antes del tag no se vuelven a mirar con él.

## 3. Fix

- **Fichero(s)**: `cli/test/kit/privacy.ts`, `cli/test/kit/subject-output-privacy.slow.test.ts`, `cli/test/kit/subject-output-privacy.test.ts`
- **Cambio**: `repoEvidence()` lista la evidencia con un solo `git ls-files -- .docs/sdd/specs tests` en vez de recorrer las carpetas con un `statSync` por entrada; `readEvidence()` pasa a asíncrona y lee 32 ficheros a la vez con `fs/promises`. El test del pre-commit, que también la usa, la espera con `await`. Lo que comprueba la revisión no cambia.
- **Decisiones**:
  - Acelerar la lectura en vez de acotarla: el `beforeAll` baja de ~10 s a 1,5–1,7 s (cronometrado dentro de vitest con `cli:test-min` corriendo a la vez, caché caliente) y cada fichero de evidencia se sigue mirando en cada pasada; acotar por release quitaba un 30 % y, si cambia un patrón de `privacy.ts`, dejaba sin mirar con él los ficheros de antes del tag — sin el dev-lead (método; la fila deja las dos vías abiertas)
  - Solo los ficheros del índice (`git ls-files` sin `--others` ni `--deleted`): las dos opciones costaban otro segundo dentro del hook (0,7 s y 0,4 s medidos con carga), y lo que aún no está en el índice lo mira el test del pre-commit al añadirlo. Antes se leían también los ficheros sin añadir; un fichero versionado borrado sin `git rm` hace fallar el hook con `ENOENT` y su ruta — sin el dev-lead (método)
  - Tope de 32 lecturas a la vez: sin tope, `Promise.all` abriría los 21.000 ficheros a la vez, más de los que deja abrir macOS por proceso; con 32, la lectura mide lo mismo que sin tope (1.390–1.560 ms frente a 1.383 ms, con carga) — sin el dev-lead (método)

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | Antes del fix: `node cli/bin/sdd.js lock run -- moon run cli:test-min` | ❌ reproducido: `Test Files  1 failed \| 135 passed (136)`, `Tests  2922 passed \| 19 skipped (2941)`, `FAIL test/kit/subject-output-privacy.slow.test.ts > La evidencia de los sujetos no lleva el home de la máquina`, `Error: Hook timed out in 10000ms.` en `:241:3`; 536 s |
| 2 | RED, antes del fix: `pnpm --dir cli exec vitest run test/kit/subject-output-privacy.slow.test.ts --test-timeout 120000 --hook-timeout 3000` | ❌ `Error: Hook timed out in 3000ms.`, `Tests  18 passed \| 7 skipped (25)` |
| 3 | GREEN, con el fix: `pnpm --dir cli exec vitest run test/kit/subject-output-privacy.slow.test.ts test/kit/subject-output-privacy.test.ts --test-timeout 120000 --hook-timeout 3000` | ✅ `Test Files  2 passed (2)`, `Tests  31 passed (31)`, con `cli:test-min` corriendo a la vez; el `beforeAll`, cronometrado con un log temporal ya quitado: listar 176–206 ms y leer 1.333–1.476 ms, 21.561 ficheros (los 21.257 de las subcarpetas de las tareas y las 304 campañas de `tests/` que leía el recorrido: el mismo conjunto) |
| 4 | Un fichero de evidencia con una ruta de usuario: `red/planted.txt` en la carpeta de este patch, con `tmp: C:\Users\alice\AppData\Local\Temp\x` y en el índice (`git add`), y la orden de la fila 2 sin `--hook-timeout` | ❌ como se espera: `FAIL … > ningún fichero de specs/*/red\|green\|refactor/ tiene una ruta de usuario`, con la ruta del plantado en el diff; `Tests  1 failed \| 24 passed (25)`. Retirado con `git rm --cached` y borrado |
| 5 | Después del fix: `node cli/bin/sdd.js lock run -- moon run cli:test-min` | ✅ `Test Files  136 passed (136)`, `Tests  2929 passed \| 12 skipped (2941)`, 500 s: el `beforeAll` cabe en el tope de 10 s con los 8 workers (los 7 saltados de menos son los tests del describe que antes no llegaban a correr) |

Revisor (sonnet, effort medium), sin Críticos ni Importantes; sus cuatro Menores:

- Las medidas de §3 sin decir en qué condiciones → arreglado: §3 dice que se cronometró dentro de vitest con `cli:test-min` a la vez y la caché caliente; la fila 5 lo mide con los 8 workers.
- `repoEvidence()` vacío con código 0 daría el fallo de forma indirecta → rechazado: el primer test del describe exige salidas de `battery`, `fix` y `campaign`, y falla con una lista vacía; un `expect` más dentro de la lista no añade nada.
- La cifra «21.000 ficheros» del comentario de `privacy.ts` envejece → arreglado: «decenas de miles de ficheros».
- `commit:` y la fila de `cli:test-min` sin rellenar → rellenados al cerrar.

Validación en campo: 2026-11-09 · smoke 2/2 por ejecución real (fila 5: `cli:test-min` 136/136 con el `beforeAll` dentro de su tope de 10 s; fila 4: un fichero de evidencia con una ruta de usuario sigue dando rojo) · el gate de cierre corre en el merge de sincronización, porque la `patch/0324` sigue abierta: su línea `Gate:` va en el mensaje final.

## 5. Tiempo (ligero)

- Estimación: 0,75 h + 0,07 h del gate de cierre (4 min, patch 0286)
- Inicio: 2026-11-09T13:52Z
- Esfuerzo real: 0,41 h — reloj de la sesión 0,41 h desde 2026-11-09T13:46Z, sin 0 min de espera al dev-lead (0 esperas). −50 % sobre la estimación (0,82 h con el gate): sin esperas ni huecos; la fila ya traía el rojo medido y su orden, y el gate de cierre aún no ha corrido (va en el merge de sincronización)
- Coste de sujetos: no aplica
