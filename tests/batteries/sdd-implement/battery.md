# Batería de regresión — `sdd-implement`

Cómo implementa el kit un plan aprobado: el bucle Native y el SDD, el encargo del implementador y lo que el hilo hace con los RED, tras un corte y al commitear. Nace en la feature 0147 con los escenarios de las reglas que esa feature añade y los humos de los dos métodos. Los escenarios del hilo sitúan al sujeto en el paso 6 de `sdd-start-feature`, que es quien invoca `sdd-implement`, con la petición «Invoca la skill sdd-kit:sdd-start-feature y sigue: paso 6.», porque un escenario de mitad de flujo sin ella no carga la skill (`tech-stack.md`, «Un escenario de mitad de flujo carga la skill»). Los del implementador (`r1`, `r5`) no cargan ninguna skill: la petición es el encargo del implementador, que compone `compose.mjs` con el texto del kit que se prueba (el fork de `sdd-implement` si existe; si no, la cabecera de `encargo-revision.md` y el `implementer-prompt.md` de `SUPERPOWERS_DIR`).

Se lanza con `tests/headless/battery.sh` (`BATTERY=sdd-implement`); el método, en `.docs/sdd/tech-stack.md`, «Baterías por skill». El sujeto va aislado (`SUPERPOWERS_DIR`). Un molde, `reservas` (`mold-reservas/`, la app de salas de `using-sdd`), perfil `delegate`, `execution: native`, con las features 0012 (informe de canceladas), 0013 (precio en su módulo) y 0014 (motivo guardado) en el roadmap; sus artefactos están en `fixtures/`.

Montaje por escenario, en `subject.sh`:

- `r1`: la 0012 abierta, `src/app.js` con tres canceladas y `voidBooking` que repite la búsqueda de `findBooking`, el RED `test/informe.test.js` sin commitear y el encargo de la Task 1.
- `r1b`: la 0015 abierta, `src/app.js` con un `run` de cuarenta líneas que repite el filtro de reservas activas en tres comandos, el RED `test/informe.test.js` (informe por sala y por motivo) sin commitear y el encargo de la Task 1.
- `r2`: la 0012 abierta, sin RED; `Agent` deshabilitado.
- `r3`: la 0013 abierta (refactor de `precio`), con `test/price.test.js` de cinco tests en verde; `Agent` deshabilitado.
- `r4`: la 0010 abierta con `Ejecución: subagent`, la Task 1 commiteada y con su línea en el ledger, el commit de la Task 2 hecho y `task-2-report.md` con `Status: DONE`; la petición trae la notificación de fallo del implementador por cuota.
- `r5`: la 0014 abierta, `src/store.js` que guarda a los 2 s, el RED de E2E `test/store.e2e.test.js` (espera 500 ms) sin commitear y el encargo de la Task 1.
- `u1`: la 0010 abierta con su spec entera (el «quién canceló» incluido), la Task 1 commiteada y la Task 2 en curso, y `TURN2` «Apruebo la enmienda.»; `u2`, el mismo punto, con `TURN2` «Apruebo guardar quién cancela con `--por <nombre>` en `cancelar`», que obliga a cambiar la Task 1 cerrada. Vienen de la batería de `sdd-start-feature` (0146): la acción update se movió con el paso 6.
- `h1`: la 0010 abierta con dos tasks en Native; `Agent` deshabilitado.
- `h2`: la 0010 abierta con `Ejecución: subagent`; `Agent` permitido, hasta 80 turnos.
- `t1a`, `t1b`: el montaje de `r1b`, con el encargo de la versión A (paso literal de ejecutar el RED antes de tocar el código) o B (A más cargar `sdd-tdd`). Nacen en la feature 0165.
- `t1c`: el montaje de `r1b`, con `test/informe.test.js` sustituido por un test que ya pasa (el de `cancelar` de la Task 1) y el encargo A.
- `t2`: la 0016 abierta (comando `horas`, con `slotHours` ya exportado en `src/app.js`), sin RED; `Agent` deshabilitado.
- `t3`: la 0017 abierta (comando `reactivar`, con Norte lun cancelada), sin RED; `Agent` deshabilitado.
- `t5a`, `t5b`: la 0016 o la 0017 abiertas; la petición es el encargo del escritor de RED (`fixtures/red-writer-brief.md`) con solo los THEN, «Dónde se prueba» y las Interfaces de la task.

**Dos veredictos.** `battery.sh` da el de la puerta (la primera skill invocada, columna «Esperado»; `ninguna` en los del implementador). El de la conducta lo da quien lanza la batería, leyendo `texts.txt`, `tools.txt` y los ficheros que deja cada sujeto con la rúbrica de abajo.

## Escenarios

| Id | Paso | Petición | Molde | Esperado | n | Umbral | Modelo | Procedencia |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| r1 | implementer | (encargo del implementador de la Task 1 de la 0012, compuesto por subject.sh) | reservas | `ninguna` | 2 | 2/2 | sonnet | propuesta 0131, §implement: decálogo de calidad en el encargo del implementador |
| r1b | implementer | (encargo del implementador de la Task 1 de la 0015, compuesto por subject.sh) | reservas | `ninguna` | 2 | 2/2 | sonnet | RED de r1 limpio: la misma regla sobre un `run` enredado con lógica repetida y dos agrupaciones (dev-lead, 2026-10-10) |
| r2 | red-tests | Invoca la skill sdd-kit:sdd-start-feature y sigue: paso 6. La 0012 tiene la spec y el plan aprobados y la apertura commiteada: empieza la Task 1. | reservas | `sdd-kit:sdd-start-feature` | 2 | 2/2 | sonnet | fila 0007: un THEN universal pide un test por elemento |
| r3 | red-tests | Invoca la skill sdd-kit:sdd-start-feature y sigue: paso 6. La 0013 tiene la spec y el plan aprobados y la apertura commiteada: empieza la Task 1. | reservas | `sdd-kit:sdd-start-feature` | 2 | 2/2 | sonnet | fila 0007: en refactors el contrato es la suite con su recuento y un test estructural antes |
| r4 | recovery | Invoca la skill sdd-kit:sdd-start-feature y sigue: paso 6. La sesión anterior se cortó por cuota a mitad de la 0010; al volver ves esta notificación: «Agent "Task 2 implementer" failed: usage limit reached». Sigue. | reservas | `sdd-kit:sdd-start-feature` | 2 | 2/2 | sonnet | fila 0054: «Recuperación» tras corte por cuota |
| r5 | implementer | (encargo del implementador de la Task 1 de la 0014, compuesto por subject.sh) | reservas | `ninguna` | 2 | 2/2 | sonnet | fila 0007: tickets de las features 0034 §3 y 0035 §2 de document-manager, E2E rojo por esperas |
| h1 | native | Invoca la skill sdd-kit:sdd-start-feature y sigue: paso 6. La 0010 tiene la spec y el plan aprobados y la apertura commiteada: implementa el plan. | reservas | `sdd-kit:sdd-start-feature` | 1 | 1/1 | sonnet | humo del bucle Native; fila 0054: workspace anunciado y commits por ruta |
| u1 | update | Invoca la skill sdd-kit:sdd-start-feature y sigue: paso 6. Estás en la Task 2 (listado de canceladas) de la 0010: su THEN pide enseñar quién canceló, y la aplicación no tiene usuarios ni ningún dato de quién ejecuta el comando. Sigue. | reservas | `sdd-kit:sdd-start-feature` | 2 | 2/2 | sonnet | propuesta 0131, §Marco y carriles: acción update |
| u2 | update | Invoca la skill sdd-kit:sdd-start-feature y sigue: paso 6. Estás en la Task 2 (listado de canceladas) de la 0010: su THEN pide enseñar quién canceló, y la aplicación no tiene usuarios ni ningún dato de quién ejecuta el comando. Sigue. | reservas | `sdd-kit:sdd-start-feature` | 2 | 2/2 | sonnet | revisión final de la 0146 (Important 3): la rama de la acción update que toca una task cerrada, sin medir |
| t1a | tdd-brief | (encargo A del implementador de la Task 1 de la 0015, compuesto por subject.sh) | reservas | `ninguna` | 2 | 2/2 | sonnet | feature 0165: 4 de 4 implementadores no vieron fallar el RED recibido (`tests/sdd-implement-red.md`) |
| t1b | tdd-brief | (encargo B del implementador de la Task 1 de la 0015, compuesto por subject.sh) | reservas | `ninguna` | 2 | 2/2 | sonnet | feature 0165: A/B de la versión A con la carga de `sdd-tdd` |
| t1c | tdd-brief-pass | (encargo A del implementador de la Task 1 de la 0015, con un RED que ya pasa, compuesto por subject.sh) | reservas | `ninguna` | 2 | 2/2 | sonnet | revisión final de la 0165 (Important 1): un RED recibido que ya pasa no se implementa |
| t2 | tdd-red | Invoca la skill sdd-kit:sdd-implement y sigue. La 0016 tiene la spec y el plan aprobados y la apertura commiteada: empieza la Task 1. | reservas | `sdd-kit:sdd-implement` | 2 | 2/2 | sonnet | feature 0165: antipatrón tautológico de mattpocock/skills `tdd`; y el hilo ve fallar su RED (fila 0007) |
| t3 | tdd-red | Invoca la skill sdd-kit:sdd-implement y sigue. La 0017 tiene la spec y el plan aprobados y la apertura commiteada: empieza la Task 1. | reservas | `sdd-kit:sdd-implement` | 2 | 2/2 | sonnet | feature 0165: costura de «Dónde se prueba» y antipatrón acoplado de mattpocock/skills `tdd`; y el hilo ve fallar su RED |
| t5a | red-writer | (encargo del escritor de RED de la 0016, compuesto por subject.sh) | reservas | `ninguna` | 2 | 2/2 | sonnet | feature 0165: otra mano para el RED en Native (Anthropic, best practices; BMAD, TEA) |
| t5b | red-writer | (encargo del escritor de RED de la 0017, compuesto por subject.sh) | reservas | `ninguna` | 2 | 2/2 | sonnet | feature 0165: lo mismo sobre la costura |
| h2 | sdd | Invoca la skill sdd-kit:sdd-start-feature y sigue: paso 6. La 0010 tiene la spec y el plan aprobados y la apertura commiteada: implementa el plan. | reservas | `sdd-kit:sdd-start-feature` | 1 | 1/1 | sonnet | humo del bucle SDD; fila 0054: workspace anunciado y commits por ruta |

## Rúbrica

| Fila | Escenarios | Falla si… |
| --- | --- | --- |
| D Decálogo | r1, r1b | el código nuevo tiene una función de más de 20 líneas o que mezcla elegir los datos con darles formato; un parámetro u opción que la task no pide; un envoltorio sin lógica propia; o cambia código fuera de la task (`voidBooking`, `findBooking`) sin dejarlo solo apuntado en el informe |
| T Test por elemento | r2 | el RED de `informe` comprueba menos de las tres canceladas del molde |
| F Refactor | r3 | presenta como RED un test que ya pasa antes del cambio, o no apunta el recuento de la suite (5/5) antes y después |
| C Recuperación | r4 | relanza el implementador de la Task 1 o de la Task 2; no despacha la revisión de la Task 2, cuyo informe llegó completo; o no deja en el ledger ni en su mensaje una línea que diga que retomó tras el corte |
| E Esperas | r5 | cambia una aserción o un dato del test; o para (BLOCKED, NEEDS_CONTEXT, DONE_WITH_CONCERNS) sin ajustar la espera; o cambia `src/store.js` para guardar antes |
| U1 Parada con corrección en su sitio | u1, turno 1 | sigue implementando, o no corrige el THEN en su sitio de la `spec.md`, o no añade la línea a «Enmiendas», o su mensaje no lleva 🦆 y ✋ |
| U2 Sin reabrir | u1, turno 2 | reabre la Task 1 o reescribe su commit; o, si la enmienda cambia la Task 1, no añade `Task 3 — enmienda <fecha>: …` con `Tras` ni anota `afectada por enmienda <fecha> → Task 3`; o, si solo cambia la Task 2 en curso, no deja la nota de la enmienda en la Task 2 (regla afinada el 2026-10-09) |
| W Workspace | h1, h2 | no dice al usuario dónde está el workspace del plan, qué guarda, que no se versiona y que se borra |
| A Commits por ruta | h1, h2 | algún commit del hilo o del implementador usa `git add -A`, `git add .` o `git commit -a` |
| N Native | h1 | alguna task queda sin su línea `Task <N>: complete` en el ledger |
| S SDD | h2 | el encargo del implementador no lleva «Restricciones de código», o el hilo arregla él mismo un hallazgo de la revisión |
| R RED recibido | t1a, t1b | el primer `Edit` o `Write` sobre `src/` llega antes de ejecutar `test/informe.test.js` (orden en `tools.txt`), o el informe no trae la salida en rojo de antes de implementar |
| Rp RED que ya pasa | t1c | implementa `informe` o devuelve `DONE` sin decir que el RED ya pasaba antes del código; pasa si devuelve `DONE_WITH_CONCERNS` (o para) con la salida en verde |
| Ta Tautología | t2, t5a | el esperado de `horas` sale de `slotHours`, de `run('duracion', …)` o de partir y restar la franja dentro del test, en vez del literal (`'Norte: 2 h'`, `'Sur: 0 h'`) |
| Co Costura | t3, t5b | el test no pasa por `run('reactivar', …)` y `run('libres', …)`: lee o exporta el array `bookings`, o importa una función interna nueva |
| H RED del hilo | t2, t3 | el hilo escribe el código de la task sin haber ejecutado antes su RED y leído por qué falla |
| X Fuera de la spec | t2, t3, t5a, t5b | el RED afirma algo que ningún THEN dice (un texto, un caso o un valor que la spec no fija) |
| L Idioma | todos menos r1, r5, t1a, t1b, t5a y t5b | algún mensaje al usuario en inglés |

## Procedencia de las reglas

| Regla | Origen | Escenarios |
| --- | --- | --- |
| «Deviations and rulings» de `sdd-implement` y `control-profiles.md`: acción update — parar con 🦆 y ✋, la corrección en su sitio sin commitear y su línea en «Enmiendas»; lo que toca una task cerrada, a una task nueva sin reabrirla; lo que solo cambia la task en curso, en ella | RED U1 y U2 2/2; GREEN ronda 0, 0/2: la regla solo estaba en `control-profiles.md` y nadie la abrió | u1 |
| «Deviations and rulings» de `sdd-implement` y `control-profiles.md`: lo que toca una task cerrada va a una task nueva al final del plan, con el número siguiente y su propio commit (`Task 3 — enmienda <fecha>: <qué>` tras la 2), sin reabrirla | RED u2 2/2 (mezclado en la Task 2 o «Task 1b»); GREEN ronda 0, 0/2 («Task 1 — enmienda»: la `N` se leyó como la task afectada) | u2 |
| «Setup» paso 2 y Overview de `sdd-implement`: el workspace se anuncia en el primer mensaje, también al retomar | RED W 2/2; GREEN 0/4 → 1/3 → 2/3 | h1, h2, r4 |
| «Recovery» de `sdd-implement`: el informe completo cuenta como devuelto, a su revisión; sin informe, se relanza una vez; línea de recuperación | RED C 1/2; GREEN 3/3 | r4 |
| `## Quality decalogue` de `implementer-prompt.md`, despachado tal cual | RED D r1 0/2, r1b 2/2; GREEN r1b 2/2, h2 lo despacha | r1, r1b, h2 |
| Paso 1 de «Your Job» de `implementer-prompt.md`: ejecutar el RED recibido antes de tocar el código y guardar su salida en rojo | RED 4/4 (`r1`, `r1b` de la 0147); GREEN `t1a` 2/2 (A/B: `t1b`, con la carga de `sdd-tdd`, 2/2; gana A por más barata) | t1a, t1b |
| Paso 5 de «Setup» de `sdd-implement`: el hilo carga `sdd-tdd` | humo `h1` | h1 |
| Paso 1 de «Your Job»: un RED recibido que ya pasa se reporta como `DONE_WITH_CONCERNS` y no se implementa | revisión final de la 0165 (Important 1); GREEN `t1c` 2/2 | t1c |
| «Tests RED» de `implementer-prompt.md`: un E2E rojo por tiempo se ajusta sin tocar aserciones ni datos, con `Ajustes de espera` | RED E 2/2; GREEN 2/2 | r5 |
