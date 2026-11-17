---
id: 20261007-153554-feature-0143-node-cli
feature: 0143
title: Walkthrough — CLI sdd en Node
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-08
---

# Walkthrough — CLI `sdd` en Node

## 1. Cambios realizados

- **Herramientas y esqueleto** (`2db22128`): `.prototools` (node 26.10.0, pnpm 12.9.1, moon 2.6.0), workspace de pnpm con `cli/` en TypeScript ejecutado por type stripping, Vitest, `@types/node`; `cli/bin/sdd.js` comprueba Node ≥ 22.18.0 antes de cargar `src/`; despacho sustantivo + verbo con `parseArgs` (0/1/2). El pre-commit pasa a `moon run cli:typecheck cli:test kit:test-fast kit:roadmap`.
- **Ports con paridad** contra cada `.ps1` antes de borrarlo: `capability index|check|merge` (`176d14ab`), `roadmap check` (`f4b4117d`), cerrojo e `id next` (`fd855c0e`), `estimation log` (`b71a1d6e`), `merge` (`fd74e477`), `session tokens` y `watch subagent|command` (`7d313dbd`).
- **Nuevos**: `roadmap publish` (0049, `71145c5f`) y `ledger rulings` (0054, en `951728d5`).
- **Hook** (`80cdba06`): `hook session-start` en JS plano que corre en cualquier Node, `hooks.json` en forma exec; fixtures generadas con el hook bash.
- **Bash de superpowers** (`951728d5`): `task start|done|brief`, `review package`, `workspace`, con su workspace y su ledger, para convivir con superpowers 6.4.2 (MIT, aviso en `THIRD_PARTY_NOTICES.md`).
- **Skills y capacidades** (`bb9f588e`): llamadas a `node "${CLAUDE_PLUGIN_ROOT}/cli/bin/sdd.js" <verbo>`, barrido literal de `capabilities/`, migraciones viejas, borrado de los 12 `.ps1`, del hook bash, de sus Pester y de la paridad; test `docs-claims`.
- **Documentos** (`07ba89d0`): README (Node obligatorio, sin `npx skills add`), `tech-stack.md`, `architecture.md`, Art. X, ADR 0011.
- **Humo** (`566e2033`) y **evaluación de `claude plugin eval`** (`ac10359b`, [research.md](research.md)).
- **Cierre**: arreglos de la revisión final y del gate (`bcf25692`…`1226726a`, juntados en el commit de cierre).

## 2. Tiempo y coste: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (del plan): 12-18h (punto medio 15h)
- Esfuerzo real: ~5,5h — reloj del hilo aproximado por las marcas de los commits: 2026-10-07 21:17-23:00 y 2026-10-08 08:00-11:45 (la noche, pausa del dev-lead). Spec y plan, ~3,5h más el 2026-10-07 por la tarde.
- Desviación: -9,5h (-63 %)
- Causa de la desviación: la estimación sumó el reloj de los subagentes; los ports corrieron en subagentes con el hilo coordinando, y el reloj del hilo es el de las revisiones y los arreglos. Mismo sesgo que el aviso de T10 en `estimation.md`.
- Modelo del hilo: Opus 5.5 (effort no registrado) en toda la feature; implementadores y revisores de task Sonnet 5.5, revisor final Opus 5.5 effort high.
- Tokens del hilo: 181.265.203 — claude-opus-5-5 181.265.203
- Tokens de subagentes: 104.710.649 en 41 despachos — implementadores Sonnet (T11 21,6 M / 34 min, pasada de fix 13,1 M / 22 min, T12 7,2 M, T8 5,4 M, T10 5,0 M…), revisores Sonnet (0,1-3,2 M / 0-3 min), revisor final Opus 14,4 M / 10 min, dos consultas de documentación Haiku 1,6 M
- Coste de la sesión: sin precio (modelos sin precio: claude-haiku-5-5)
- Coste de sujetos: 2,71 $ en 14 sujetos Sonnet y 1 Haiku — humo 1,46 $ (11 sujetos), evaluación `plugin eval` 0,45 $ + `battery.sh` 0,80 $, smoke del hook 0,003 $ (previsión de la spec: ~12 $)
- Review de spec: 2 revisores (dominio y técnica) · hallazgos 20, aceptados 20

## 3. Desviaciones del plan

- **TypeScript sin build y Vitest** en lugar de JS plano y `node:test`: enmienda aprobada por el dev-lead el 2026-10-07 («la verdad preferiria typescript pero una cosa ... no veo cual seria el problema de usar vitest»).
- **Borrado de los `.ps1` en T11**, no tras cada port: las skills los llamaban hasta T11.
- **`withLock(lock, timeout, body)`** con el dueño explícito, en vez de la firma de 5 parámetros del plan (Art. X).
- **La cosecha de rulings** pasa del paso 1 de `sdd-end-feature` al paso 6 de `sdd-start-feature` (al volver la revisión final): superpowers borra el workspace antes del cierre. Lo encontró la revisión final.
- **THEN de «La CLI se ejecuta con Node…»**: enumera los verbos en vez de remitir a «la decisión 4», porque la fusión de capacidades rechaza que una capacidad cite la spec (enmienda de redacción del 2026-10-08).

### Decisiones tomadas sin el dev-lead

- `run(argv, io, verbs = VERBS)`: los tests inyectan un registro — coste si mal: un parámetro opcional de más.
- `@types/node` como tercera devDependency en lugar de un shim en `any` — coste: una devDependency.
- `--path` de `roadmap check` es la carpeta `.docs/sdd`, como el script — coste: nada.
- `io.json` compacto en una línea para todos los verbos; la `Kind` del delta conserva su grafía en los mensajes — coste: nada.
- La cabecera de `estimation-log.md` y el cuerpo del commit de merge nombran `sdd estimation log` y `sdd merge` desde T11 — coste: un literal.
- `docs-claims` admite `tools/sdd/Build-EstimationLog.ps1` (copia heredada de los proyectos que v1.0.0 retira), no barre las rutas de evidencia `tests/*.md` ni `capabilities/cli.md` — coste: nada.
- El arnés de paridad escribe solo el mensaje de cada error de PowerShell y sale con el código de `-File`; la paridad de merge compara los asuntos ordenados — coste: nada.
- Un `sdd-kit.json` o `.meta.json` corrupto aborta con 1, como el script — coste: un cierre que para en vez de seguir sin precio.
- Las guardas de `review package` y `task not found` salen con 1 (el bash, con 3) — coste: si superpowers mira el 3, la 0147 lo ajusta.
- El workspace de `sdd` reconoce el marcador de superpowers en cualquier grafía (`/d/…`, `D:/…`, relativa) — coste: nada.
- `--verify` de `sdd merge` usa `pwsh` y, sin él, `powershell.exe` — coste: un gate de pwsh 7 con `&&` que no corre en 5.1.
- `capability check --json` emite `validCount` (número) — coste: nada, contrato aún sin publicar.
- Suites lentas con 120 s por test y helper de `id` que copia a una ruta ASCII (Node 22.18 no copia con `cpSync` a un destino no ASCII) — coste: nada.
- Cuelgue: implementador de la task 5 (Sonnet), sin respuesta tras un Bash, 8 min, relanzado.
- Minors diferidos (de los Rulings y minors del ledger): `\b` ASCII frente a .NET, `localeCompare` frente a `Sort-Object`, comparaciones sensibles a mayúsculas en secciones ya inválidas, symlinks y ocultos, fila corta del Backlog, `gitLines` que devuelve `[]` ante error, EACCES como 127, `lineSink` compartido, nombre del log de verify, retry sin test, marcador MSYS fuera del repo, sustantivo mal escrito en `docs-claims`, `sdd-end-feature` en el tope de palabras, republicar sin cambios sale con 1 — a la deuda del roadmap.

## 4. Verificación

### 4.1 Builds

- `moon run cli:typecheck` → limpio.
- Suite completa: `moon run cli:typecheck cli:test cli:test-slow cli:test-min kit:test kit:roadmap` → `cli:test` 629/629, `cli:test-slow` 143/143, `cli:test-min` (Node 22.18.0) 772/772, `kit:test` (Pester) 973 sin fallos, `Roadmap válido` · 226 s.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-08 · suite completa en verde · smoke 16/16 THEN (12 con ejecución real) · humo 10/10 skills · revisión final opus effort high con arreglos sobre ac10359b, pasada de fix y re-revisión limpia sobre 1226726a

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cli` · `--help` lista los verbos y sale con 0; sin `dependencies` | ejecución real (humo h10 y `node cli/bin/sdd.js --help`) | ✅ |
| `cli` · Node 20.11.0 → mensaje y 2, sin `SyntaxError` | suite (`bin exits 2 on old node without loading src`) | ✅ |
| `cli` · verbo, opción o tope desconocido → 2 | suite (`unknown verb/option exits 2`, `count 0 exits 2`) | ✅ |
| `cli` · `capability index --json` | suite (`index json`) y ejecución real (humo h2, texto) | ✅ |
| `cli` · hook: mismo JSON que el bash, nada sin `.docs/sdd/`, aviso con Node viejo | ejecución real (sesión headless con `--plugin-dir`) y suite (fixtures del bash) | ✅ |
| `cli` · las skills solo nombran verbos que existen | suite (`docs-claims`) y ejecución real (humo 10/10) | ✅ |
| `feature-flow` · rulings cosechados en orden; `Sin rulings` sin ledger | ejecución real (`sdd ledger rulings` sobre el ledger de esta feature: 55 líneas) y suite | ✅ |
| `feature-flow` · minors diferidos al walkthrough desde los rulings | ejecución real (este walkthrough, §3) | ✅ |
| `feature-flow` · task Native con `sdd task start`/`task done` en el ledger | ejecución real (herramienta PowerShell, 2026-10-08) | ✅ |
| `feature-flow` · desde PowerShell: ruta Windows, `→ (sin salida)` | ejecución real: `brief: C:\…\task-1-brief.md`, `Task 1: complete (…, tests: pwsh -NoProfile -Command 'Invoke-Pester … -CI -Output None' → (sin salida))` | ✅ |
| `feature-flow` · test en rojo no registra y sale con su código; comando inexistente, 127 | ejecución real: `exit=1` sin ledger; `exit=127` | ✅ |
| `release-flow` · publica en el worktree con `develop` sacada | suite (`publish.slow`) | ✅ |
| `release-flow` · worktree temporal sin `develop` sacada | suite | ✅ |
| `release-flow` · espera el cerrojo; se rinde a los 30 min con 1 | suite (`waits for the merge lock`, `gives up`) | ✅ |
| `release-flow` · rechaza si `develop` cambió el fichero, destino sucio, sin rama o fuera de `.docs/sdd` | suite | ✅ |
| `release-flow` · proyecto en una subcarpeta del repositorio | suite (`publishes a project that lives in a repository subfolder`) | ✅ |

### 4.3 Residuales / deuda generada

- El vigía de silencio (`watch subagent`, igual que el `.ps1`) da `TERMINADO:` al instante con un subagente reanudado con `SendMessage`: las rondas de fix por reanudación quedan sin vigía real.
- `plugin eval` no mide la primera skill invocada: no sustituye a las baterías de enrutado ([research.md](research.md)); recomendado para el humo de la 0152.
- `tasks-template.md` no tiene la sección `## Rulings` que ahora pide el paso 6.
- `--verify` con `powershell.exe` 5.1 no admite `&&`; `merge-recipe.md` no lo avisa.
- Los minors diferidos de §3.

## 5. Aprendizajes

- **Node 22.18 `cpSync` no copia a un destino con caracteres no ASCII** y no da error → `tech-stack.md` (Contenido y build): los tests copian a una ruta ASCII y renombran.
- **superpowers borra el workspace al dar limpia la revisión final**, antes del cierre: lo que haya que sacar del ledger se saca al volver el revisor → `sdd-start-feature` paso 6 (hecho en la feature).
- **Un fixture que se compara byte a byte necesita `eol=lf`** en `.gitattributes`: con `core.autocrlf=true` un checkout nuevo lo deja en CRLF y el test solo falla en otro worktree → `tech-stack.md`.
- **Los RED del hilo también fallan**: tres veces el test de contrato tenía un defecto (vista de errores de PowerShell, orden de `git log` en el mismo segundo, nombre de evidencia como literal prohibido). Correcto: el hilo arregla su test y lo registra como ruling, sin que el implementador lo toque.
