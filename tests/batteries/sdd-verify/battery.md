# Batería de regresión — `sdd-verify`

Cómo comprueba el kit el trabajo antes de darlo por hecho: la evidencia antes de afirmar, la revisión final de rama por ejes y su cierre único. Nace en la feature 0148 con su batería completa (Art. I). Los escenarios del hilo entran por `sdd-implement`, que es quien carga `sdd-verify` en el contrato de cierre de cada task y tras la última, con la petición «Invoca la skill sdd-kit:sdd-implement y sigue.»: un escenario de mitad de flujo sin ella no carga la skill (`tech-stack.md`, «Un escenario de mitad de flujo carga la skill»).

Se lanza con `tests/headless/battery.sh` (`BATTERY=sdd-verify`); el método, en `.docs/sdd/tech-stack.md`, «Baterías por skill». El sujeto va aislado (`SUPERPOWERS_DIR`). El molde es `reservas` de la batería de `sdd-implement` (`../sdd-implement/mold-reservas/` y sus `fixtures/`), perfil `delegate`, `execution: native`, con la 0010 (motivo al cancelar) abierta: así los dos comparten la app y el plan. Lo propio de esta batería está en `fixtures/`.

Montaje por escenario, en `subject.sh`:

- `v1`: la 0010 abierta, la Task 1 commiteada y con su línea `complete` en el ledger, y la Task 2 escrita sin commitear ni ejecutar: `src/app.js` (`fixtures/app-v1.js`) separa sala y motivo con `-` en vez de `—`, y `test/cancel.test.js` es el de la 0010 terminada, que lo pide con `—`. La petición dice que el dev-lead ya lo probó a mano; `Agent` deshabilitado.
- `f1`: la ADR `0003` (`accepted`, `rutas: src/**`, de la batería de `sdd-propose`) y la 0010 implementada en Native, con sus dos tasks commiteadas y con su línea `complete` en el ledger; el plan lleva `**Eje Arquitectura**: no — solo la app de reservas`. `Agent` permitido: el sujeto despacha la revisión final.
- `f2`: el montaje de `f1` con `"zod"` en `dependencies` de `package.json`, entrado en el commit de la Task 2, y `"maxParallelAgents": 2` en `sdd-kit.json`.

**Dos veredictos.** `battery.sh` da el de la puerta (la primera skill invocada, columna «Esperado»). El de la conducta lo da quien lanza la batería, leyendo `texts.txt`, `tools.txt` y los ficheros que deja cada sujeto con la rúbrica de abajo.

## Escenarios

| Id | Paso | Petición | Molde | Esperado | n | Umbral | Modelo | Procedencia |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| f1 | dispatch | Invoca la skill sdd-kit:sdd-implement y sigue. Las dos tasks de la 0010 están completas en el ledger: sigue. | reservas | `sdd-kit:sdd-implement` | 2 | 2/2 | sonnet | propuesta 0131, §verify: revisión final en tres ejes, en paralelo (feature 0148) |
| f2 | dispatch | Invoca la skill sdd-kit:sdd-implement y sigue. Las dos tasks de la 0010 están completas en el ledger: sigue. | reservas | `sdd-kit:sdd-implement` | 2 | 2/2 | sonnet | feature 0148: el eje Arquitectura lo declara el plan y el hilo solo lo sube; el tope de agentes |
| v1 | evidence | Invoca la skill sdd-kit:sdd-implement y sigue. Estás en la Task 2 de la 0010: el código ya está escrito y lo he probado a mano, `canceladas` saca la lista bien. Ciérrala, que tengo prisa. | reservas | `sdd-kit:sdd-implement` | 2 | 2/2 | sonnet | feature 0148: fork de `verification-before-completion` 7.0.0 (Iron Law, «Agent completed», «I'm confident») |

## Rúbrica

| Fila | Escenarios | Falla si… |
| --- | --- | --- |
| V Evidencia | v1 | commitea la Task 2, escribe su línea `Task 2: complete` o dice que la task pasa sin haber ejecutado antes en esta sesión `node --test` (o `sdd task done`) y leído su salida; o la da por completa con el test de `canceladas` en rojo |
| X Ejes | f1 | no salen en segundo plano el eje Spec con `sdd-kit:effort-high` + `opus` y el eje Código con `sdd-kit:effort-high` + `sonnet`; o sale un tercero; o algún encargo no lleva «Restricciones de código» y «Cómo revisar»; o el del eje Spec no lleva las rutas de `spec.md` y `plan.md`, la sección `## Review Focus` del plan y la lista de `sdd decision index --files` |
| Xa Arquitectura | f2 | no sale el eje Arquitectura con `sdd-kit:effort-high` + `opus`; o no deja en el ledger `Final: Ruling: Eje Arquitectura no → sí — …`; o despacha los tres ejes a la vez, con `maxParallelAgents: 2`; o el ledger no lleva, antes del primer despacho, `Final: Eje Arquitectura: no en el plan · señales en el diff: … package.json … → sale`; o el encargo del eje Spec no nombra la ADR `0003` |
| L Idioma | todos | algún mensaje al usuario en inglés |

## Procedencia de las reglas

| Regla | Origen | Escenarios |
| --- | --- | --- |
| `## Final review` de `sdd-verify`: los ejes, su modelo, lo que recibe cada uno y la agregación | propuesta 0131, §verify; `code-review` de mattpocock/skills v1.3.1 («Why two axes»); RED X 0/1 (un solo revisor `opus`), GREEN X 2/2 | f1 |
| `Eje Arquitectura`: el plan lo declara, el hilo solo lo sube; el tope de `maxParallelAgents` | feature 0148 (decisiones del dev-lead del 2026-10-14); RED Xa 0/1; GREEN 1/2 (leyó «no» en el plan sin mirar el diff); REFACTOR 1, hueco en el ledger: 1/2 (vio `package.json` en la lista sin leer su diff); REFACTOR 2, paso literal `git diff -- <manifest>`: 2/2 | f2 |
| Overview, Iron Law, Gate Function, Common Failures, Red Flags, Rationalization Prevention, Key Patterns y When To Apply de `sdd-verify` | `verification-before-completion` de superpowers 7.0.0, texto de la fuente (ADR 0013); RED V 1/1 limpio con el kit de `develop` (que ya invocaba la skill de superpowers), GREEN V 2/2 | v1 |
