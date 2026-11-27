---
id: 20261127-130616-feature-0372-gate-once-on-moving-base
feature: 0372
title: Tras una gate de cierre verde, un manifiesto de la base no repite la gate entera
mode: full
profile: delegate
status: approved
created: 2026-11-27
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-11-27
---

# Spec — Tras una gate de cierre verde, un manifiesto de la base no repite la gate entera

🦆 Hoy, cuando el cierre integra una base que trae un `package.json` o un lockfile, la gate corre entera otra vez, y con una base que recibe varios merges por hora no acaba nunca: en la 0718 de document-manager se repitió tres veces, ~55 min de más. Con esta feature, tras una gate de cierre verde, lo que trae la base corre como cualquier otro cambio: las suites unitarias enteras y las tareas que tocan a la vez la rama y la base. En la 0718, `frontend:check` y los E2E habrían salido como `saltada (solo la toca la base)` y el backend habría corrido: ~40 min menos. Lo que solo toca la base queda para su CI; lo que un manifiesto de la base rompa sin que lo vean ni las unitarias ni el cruce es un riesgo que se acepta, como la 0236 ya lo aceptó entre la sincronización y el merge.

Validación: agente — el cambio solo toca texto de skills y la batería; lo observable es la conducta de los sujetos, que mide el agente, y el uso real llega por los tickets de campo (`validation.mode: field`).

## Capacidades

- Modificadas: `closing-suite` — un fichero de «Sin filtro» que trae la base ya no hace correr la gate entera tras el merge de sincronización
- Modificadas: `verification` — la línea `Gate:` lleva `(sin filtro: cambia el build)` solo cuando es la rama la que toca un fichero de «Sin filtro», en la gate de cierre o en un arreglo
- Modificadas: `archive` — los «Límites» dejan de mandar la gate entera cuando la base trae un fichero de «Sin filtro»

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: MODIFIED (un requisito de `closing-suite` y uno de `verification`) · tamaño: ~60 líneas en 6 ficheros (4 de skills, `battery.md`, `subject.mjs`)
- Dominio (opus): si el `MODIFIED` de «El cierre integra la base…» deja algún caso en que el código de la rama llega a `develop` sin que nada lo pruebe contra un manifiesto de la base (las unitarias, el cruce, la CI del paso 7), y si la decisión 4 (el «Sin filtro» de la rama tras la sincronización) contradice «What runs» (señal: MODIFIED)
- Técnica (sonnet): si g8 y av2 (decisiones 6-8) prueban de verdad el «hecho cuando» con `gate.json` del molde (el cruce de `bookings:test` y `rooms:test`), y si el saldo de palabras previsto cuadra (señal: MODIFIED)
- Mínimo razonable: un revisor con los siete puntos en sonnet — deja sin la mirada de opus el hueco de dominio: qué rompe un manifiesto de la base que ni las unitarias ni el cruce ven

1. Enfoque: A, frente a B y C (ver Approach).
2. No hay campo «pasada única» en `operations.md` §Testing — por qué: el dev-lead me lo delegó («nmo se macho la que te haga funcionar»), y la regla del kit ya corta la repetición en todos los proyectos sin plantilla, migración ni lectura nueva en `sdd-archive`, que alargarían las skills (regla 6 de `CLAUDE.md`). Coste: un proyecto que quiera saltarse también el cruce no puede pedirlo.
3. La regla vale para todas las integraciones posteriores a la gate de cierre, la primera incluida, no solo desde la segunda — por qué: en la 0718 la gate de cierre corrió sobre una base ya integrada (`546c1a3e5`), y las dos repeticiones (`ad7aa1937`, 120 commits; `7d24efb49`, 55) fueron integraciones posteriores. Una primera pasada entera aparte (enfoque C) solo habría ahorrado la tercera.
4. Un fichero de «Sin filtro» de la rama sigue haciendo correr sin filtro la gate de cierre, y lo mismo un arreglo tras un rojo que toca uno (punto 3 de «Running a gate»); tras la sincronización, ni el de la rama ni el de la base la repiten entera: cuentan para el cruce como cualquier otro fichero — por qué: la gate de cierre ya pagó una vez el de la rama, y hoy «After the sync merge» tampoco lo repite; lo que esta feature corta es que lo que trae la base lo repita. Por eso el literal del mensaje final del paso 9 de `sdd-archive` (`SKILL.md:52`) pierde `(sin filtro: cambia el build) |`: el paso 6 ya no produce esa entrada.
5. `cli/src/merge/` no cambia — por qué: `sdd merge --verify` ya cruza sin leer «Sin filtro» (decisión 14 de la 0236, `cli/src/merge/affected.ts` `planGate`); tras esta feature, el cierre y el merge siguen la misma regla.
6. g8 se reescribe en lugar de añadir un escenario — por qué: prueba justo la regla que cambia (feature 0236) y quedaría en rojo con la nueva. Su molde `reservas-gate-lock` pasa a llamar a una función nueva, `developManifest`, que trae a `develop` el test de `rooms` y un `package.json` raíz (el «hecho cuando» lo nombra), que no es input de ninguna tarea de `gate.json` y cuenta como build por la lista por defecto: el molde no declara «Sin filtro», y no debe ganarlo sin `package.json`, o el RED pasaría sin la regla. `developLockfile` se queda para av2. g8 prueba que la gate no se repite entera; que el cruce corre lo que cruza lo prueba av2.
7. Rúbrica de g8: **G8a Sin gate entera** falla si, tras `sdd merge --sync`, `tools.txt` tiene `scripts/gate.mjs run` sin `--affected` o corre `bookings:test` o `rooms:test`; **G8b Saltadas con su porqué** falla si la línea `Gate:` del mensaje final no lleva, cada una con su porqué y sin cambiarlos, `bookings:test: saltada (la base no toca sus inputs` (admite el `: <comando>` que nombra la herramienta antes del `)`) y `rooms:test: saltada (solo la toca la base)`, literal, o lleva `(sin filtro: cambia el build)`; **G8c Fusionada** falla si `develop` no gana el merge de la 0010, o si `--verified-at` no es el sha de la línea «Suite completa» del 4.1 del borrador (el de la gate de cierre) ni el del commit de cierre, porque tras `--sync` no corrió ninguna tarea (el AND del delta «si todas las tareas salen saltadas…») — por qué: G8a y G8b son el «hecho cuando», y G8b, con el porqué de cada tarea, no pasa si el sujeto los pone a ojo y los cruza; G8c, que saltar no se convierta en parar. Los porqués son los literales de «After the sync merge»: `gate.mjs` solo imprime `▪ <tarea> skipped`.
8. El molde de av2 (`reservas-rojo-cierre`) mantiene `developLockfile` y gana `developAppTest`, que añade en `develop` un test a `test/app.test.js`, input de `bookings:test`. Su rúbrica gana **AV2b Rojo por el cruce**: falla si la pasada que da el rojo es `scripts/gate.mjs run` sin `--affected` — por qué: hoy el rojo sale porque el lockfile de la base fuerza la gate entera; con la regla nueva, sin cruce no correría nada y av2 dejaría de probar lo suyo (el rojo de la rama devuelto a `sdd-implement`). Con el cruce, `bookings:test` corre tras la sincronización y el rojo sale (el borrador del molde da la gate de cierre por verde: el rojo solo puede salir en esa pasada).
9. Textos que cambian, sin literales nuevos: la línea `Gate:` usa los `saltada (solo la toca la base)` y `saltada (la base no toca sus inputs)` que ya existen.
10. Repaso de coherencia: el delta, probado con `sdd capability merge` sobre una copia de `.docs/sdd`, da `closing-suite.md: sustituido «El cierre integra la base tras su commit y repite solo lo que afecta lo que trae la base»` y `verification.md: sustituido «La línea `Gate:` nombra cada tarea, corrida o saltada»`; el `git grep` de la regla encontró además el literal de `SKILL.md:52` (decisión 4). La regla de «Límites» de `capabilities/archive.md:179` la encontró la review (hallazgo de dominio 1) y va al delta. La migración v3.0.0 y `sdd-init` proponen el campo «Sin filtro» sin describir la base: no cambian.
11. Riesgo que se acepta: lo que un manifiesto de la base (o un fichero de «Sin filtro» de la rama, tras la sincronización) rompe en una tarea cuyos inputs no lo declaran no lo ve ni el cruce ni las unitarias; la CI de la base corre sin la rama, y el paso 7 la lee solo con «CI de la base» con orden de lectura, y fusiona igual con la run en curso, `cancelled` o sin respuesta. El hueco del «Sin filtro» de la rama ya existe hoy («After the sync merge» no lo repite); el de la base es el que la 0236 aceptó entre la sincronización y el merge (su decisión 14). Coste: un fallo de integración así llega a `develop` y lo ve la CI de después o la pasada diaria del proyecto. Volver a repetir la gate entera por el «Sin filtro» de la rama reintroduce la repetición de la 0718 en toda rama que toque un manifiesto.
12. Las suites unitarias enteras tras la sincronización, y la gate entera con un gate sin filtro, no cambian: son reglas de la 0236 (g7 y el requisito vigente), y esta feature no las toca ni las vuelve a probar.
13. Criterio de las tandas: GREEN de g8 con N=2 pide 2/2; con 1/2, otra tanda de N=2 antes de dar la regla por buena; la tanda de REFACTOR con N=1 es una comprobación, y un 0/1 se repite con N=2 antes de concluir. Esas repeticiones van en la fila de contingencia de la previsión; pasar de la suma con ella se pregunta antes.
14. La línea «Sin filtro» de `operations-template.md` pasa de «si la rama o la base tocan uno, el gate corre sin filtro» a «si la rama toca uno, el gate de cierre corre sin filtro» — por qué: es el placeholder que la init enseña al proponer el campo, y con la frase vieja un proyecto nuevo aprendería la regla retirada.

#### Segunda ronda (sonnet)

- **Rechazado** (1) — falta un escenario de la marca `(sin filtro: cambia el build)` en la gate de cierre → lo cubre el requisito vigente «El gate corre entero si la rama toca el build…» de `closing-suite` y g7, que no cambian.
- **Aceptado** (2) — la decisión 4 parecía cambiar lo que hace el «Sin filtro» de la rama tras `--sync` → es la conducta vigente («After the sync merge» ya no lo repite); el AND de `verification` la escribe, y no hay escenario nuevo porque no cambia.
- **Aceptado** (3) — AV2b es regla nueva sin RED → av2 entra en la tanda RED.
- **Aceptado** (4) — G8c contra «`--verified-at <sha del merge de sincronización>`» → AND nuevo en el delta: con todas las tareas saltadas, el sha de la gate de cierre; G8c lo cita.
- **Aceptado** (5) — g8 depende de la lista por defecto de «Sin filtro» → decisión 6 lo fija.
- **Aceptado** (6) — en el ejemplo el lockfile no distinguía la regla → `pnpm-lock.yaml` pasa a input de `launcher:test`, que solo toca la base.
- **Rechazado** (7) — nombrar document-manager y la 0718 → es la evidencia del ticket que la fila cita (`field-reports/`, `ROADMAP.md`, `debt.md` ya la nombran); un nombre inventado rompería la traza.
- **Aceptado** (8) — la plantilla no estaba en las decisiones → decisión 14.
- **Aceptado** (9) — la contingencia no estaba en la suma → fila de contingencia.
- **Aceptado** (10) — G8b por prefijo admitía otros porqués → `rooms:test` literal con `)`; `bookings:test` admite el comando de la herramienta.

### Hallazgos de la review

- **Aceptado** (dominio 1, Crítico) — `capabilities/archive.md:179` («Límites») sí manda la gate entera si la base trae un fichero de «Sin filtro» → delta `archive` con «Límites» sin esa cláusula; decisión 10 corregida.
- **Rechazado** (dominio 2, Crítico) — el «Sin filtro» de la rama tras la sincronización deja un hueco → el hueco ya existe hoy («After the sync merge» solo repite por el de la base), y cerrarlo repetiría la gate entera en cada sincronización de toda rama que toque un manifiesto, lo que esta feature corta; queda declarado como riesgo en la decisión 11.
- **Aceptado** (dominio 3, Crítico) — el THEN y el Intent garantizaban la CI de la base, que el cierre puede no leer → quitada la garantía del 🦆, del Intent y del AND nuevo; el riesgo, con sus casos (sin orden de lectura, run en curso, CI sin la rama), en la decisión 11.
- **Rechazado** (dominio 4) — `closing-merge.md:105` («`--verify` no lee «Sin filtro»: los aplicó el gate de cierre») sigue cierto: el gate de cierre aplica el «Sin filtro» de la rama, y el de la base deja de aplicarse en todas partes por decisión; no hace falta un `MODIFIED`.
- **Rechazado** (dominio 5 y técnica 9) — la migración de los `operations.md` ya creados → «si la rama o la base tocan uno» es el placeholder de la plantilla, que la init y la migración sustituyen por los globs: `operations.md:15` del kit solo lleva globs, y document-manager no tiene el campo. `sdd-validate:28` y `sdd-verify:70` hablan del arreglo, que es de la rama.
- **Rechazado** (dominio 6) — la condición «tras una gate de cierre verde» falta en el delta → el paso 6 solo corre con la validación registrada, y la reentrada tras un rojo vuelve a pasar la gate en `sdd-validate` antes de sincronizar: toda sincronización del paso 6 sigue a una gate verde. El GIVEN ya la lleva («con la suite en verde en `a1b2c3d`»).
- **Aceptado** (dominio 7) — el AND de `verification` no acotaba el momento → «en la gate de cierre o en un arreglo, no tras `--sync`».
- **Aceptado** (dominio 8) — el ejemplo usaba `apps/web/package.json`, ajeno al GIVEN → `package.json` raíz, que no es input de ninguna de las tres tareas, y `pnpm-lock.yaml`, input de `api:test`.
- **Aceptado** (técnica 1) — en g8 nada cruza, y G8 pasaba sin calcular → G8b exige el porqué de cada tarea; la spec dice que el cruce lo prueba av2 (decisión 6).
- **Aceptado** (técnica 2) — `--verified-at` ambiguo en G8c → el sha de «Suite completa» del 4.1 o el del commit de cierre.
- **Aceptado** (técnica 3) — `developLockfile` lo comparten g8 y av2 → `developManifest` para g8, `developLockfile` y `developAppTest` para av2; las descripciones de `battery.md:20` y `:48` cambian.
- **Aceptado** (técnica 4) — AV2 no distinguía la conducta vieja → AV2b: el rojo sale en la pasada con `--affected`.
- **Rechazado** (técnica 5) — falta un escenario de las unitarias tras la sincronización → no cambian (decisión 12).
- **Aceptado** (técnica 6) — la cobertura de un manifesto de la base sin input era afirmación → decisión 11.
- **Aceptado** (técnica 7) — el saldo no contaba el literal del paso 9 → incluido; se mide con `word-budget.test.ts` en el plan.
- **Aceptado** (técnica 8) — `gate.mjs` no da el porqué → G8b compara con los literales del kit (decisión 7).
- **Aceptado** (técnica 10) — qué hacer con 1/2 → decisión 13.
- Política de modelos (solo en `delegate`): revisores de la spec según `sdd-spec-review` · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sujetos de la batería en sonnet, por tandas · en paralelo hasta `control.maxParallelAgents` (3) — al aprobar la spec, esta línea es la confirmación de paralelizar que piden las instrucciones del usuario

### Decisiones tomadas con el dev-lead

- Tras una gate verde, las suites unitarias enteras más las tareas que cruzan la rama y la base; el resto, saltado con su porqué (enfoque A) — «1»
- El campo de pasada única lo decido yo — «nmo se macho la que te haga funcionar»

## Intent

Hoy, tras `sdd merge --sync`, un fichero de «Sin filtro» que trae la base hace correr la gate entera sin `--affected` (paso 6 de `sdd-archive`, «After the sync merge» de `closing-suite.md`, punto 2 de «Running a gate» de `sdd-verify`), sin tope y aunque la gate de cierre ya pasó en verde. Con una base que recibe varios merges por hora, cada integración trae un manifiesto y la gate no alcanza nunca a la base: ~1,5 h en la 0223 y ~55 min en la 0718. El éxito: tras una gate de cierre verde, integrar una base con un manifiesto corre las unitarias y lo que cruza, y la línea `Gate:` nombra cada tarea saltada con su porqué. Fracasa aunque funcione si el cierre deja de verificar el código de la rama sobre la base nueva donde las dos se tocan (las unitarias y el cruce lo hacen); lo que queda fuera es el riesgo de la decisión 11.

## Scope

- Entra: «After the sync merge» de `skills/sdd-archive/references/closing-suite.md`; el paso 6 de `skills/sdd-archive/SKILL.md` («The suite on the sync merge») y el literal `Gate:` del punto 4 de su paso 9 (decisión 4); el punto 2 de «Running a gate» de `skills/sdd-verify/SKILL.md`; la línea «Sin filtro» de `skills/sdd-templates/templates/operations-template.md`; g8 y su molde, el molde y la rúbrica de av2, la descripción de los dos moldes y la procedencia en `tests/batteries/sdd-archive/`; los deltas de `closing-suite`, `verification` y `archive`.
- No entra: `cli/src/merge/` (decisión 5); un campo de pasada única (decisión 2); una migración para los proyectos, cuyo `operations.md` dice «si la rama o la base tocan uno»: es la descripción del campo, y la regla la aplica la skill; el contraste de un rojo en un entorno único por máquina y la sonda ignorada por git (ticket de la 0718, §2 y §3); las líneas largas de session tokens (0373).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Un fichero de «Sin filtro» de la base hace correr la gate sin `--affected` tras `--sync` | `skills/sdd-archive/SKILL.md:44`; `skills/sdd-archive/references/closing-suite.md:31`; `skills/sdd-verify/SKILL.md:67`; `skills/sdd-templates/templates/operations-template.md:18`; `capabilities/closing-suite.md:55`; `capabilities/verification.md:194`; `capabilities/archive.md:179` («Límites») | Approach y delta: `MODIFIED` de los dos requisitos y «Reglas de la capacidad — archive» |
| `(sin filtro: cambia el build) \|` en el literal `Gate:` del mensaje final del cierre | `skills/sdd-archive/SKILL.md:52` | Scope, decisión 4 |
| g8: G8a «corre el gate sin `--affected`» y G8b «lleva `(sin filtro: cambia el build)`» | `tests/batteries/sdd-archive/battery.md:98,163-164,264`; molde `reservas-gate-lock` (`subject.mjs` `developLockfile`) | decisiones 6 y 7 |
| av2: su rojo sale «por el lockfile que trae la base» | `tests/batteries/sdd-archive/battery.md:48`; molde `reservas-rojo-cierre` | decisión 8 |
| La descripción de `reservas-gate-lock` («trae también `package-lock.json`») | `tests/batteries/sdd-archive/battery.md:20` | decisión 6 |

- Filas que implementa: 0372 → `ROADMAP.md:10` (✅ al cerrar); deuda «Tras una gate de cierre verde, cada integración de una base que trae un manifiesto repite la gate entera» → `.docs/sdd/steering/debt.md:81`, cerrada por el cierre. Comprobado con `grep -rn "0372" ROADMAP.md .docs/sdd/steering skills CLAUDE.md`.

## Approach

- A — Tras la gate de cierre verde, un fichero de «Sin filtro» de la base deja de forzar la gate entera: corren las unitarias enteras y las tareas que tocan la rama y la base, como con cualquier otro cambio de la base. Cuesta poco texto, y el saldo baja: se quita una excepción. Deja a la CI de la base lo que un manifiesto de la base rompa en una tarea que la rama no toca, como la 0236 ya aceptó entre la sincronización y el merge (su decisión 14). Medido en la 0718 con `moon query tasks --affected` sobre el clon de document-manager: la rama tocó solo `apps/backend`; la 2.ª integración trajo `apps/frontend/package.json`, el `package.json` raíz y un test del backend; la 3.ª, `api.unit.test.csproj`. Con A, `frontend:check` (1108 s y 785 s) y los E2E (~5 min por pasada) salen saltados y el backend corre: ~40 de los ~55 min ahorrados.
- B — Delegar en `sdd merge --verify`: el paso 6 no corre nada y el merge cruza bajo el cerrojo. Corta del todo la repetición, pero un proyecto sin «Gate de merge» no verifica nada tras la integración, ni las unitarias: document-manager declara «Gate de merge: ninguno», y en la 0718 no habría corrido nada.
- C — Gate entera solo en la primera integración tras la gate verde, y el cruce en las siguientes. Es la más conservadora, pero en la 0718 la primera fue la de 120 commits: solo ahorra la 3.ª pasada (~24 min).
- Elegido: A — lo eligió el dev-lead: «1». Es la línea de las herramientas de «affected» (Nx `projectsAffectedByDependencyUpdates: auto`, el análisis del lockfile de Turborepo): un manifiesto cuenta donde es input, no en todo el repositorio.

Lo que fija A:

- La regla se escribe donde se decide, en el paso 6 de `sdd-archive`: la 0305 midió que, con la regla solo en `closing-suite.md`, los sujetos no la seguían (GREEN 0/2; de vuelta en el paso 6, 1/1). La frase del paso 6 que hoy manda la gate entera se sustituye por la nueva; «After the sync merge» quita la excepción; el punto 2 de «Running a gate» deja de nombrar la base.
- El saldo de palabras de `sdd-archive`, `sdd-verify` y `sdd-templates`, contadas juntas, queda igual o baja (regla 6 de `CLAUDE.md`).

## Dónde se prueba

- Tras una gate verde, la base que trae `package.json` no hace correr la gate entera y la línea `Gate:` nombra las saltadas: escenario g8 de `tests/batteries/sdd-archive/battery.md`, molde `reservas-gate-lock`, rúbrica G8a-G8c, RED con las skills de `develop` (av2 también, por AV2b) y GREEN con las de la rama.
- Un rojo de la rama tras la sincronización sigue saliendo cuando la base cruza la rama, y sale en la pasada filtrada: av2, molde `reservas-rojo-cierre` con el cambio de la decisión 8, rúbrica AV2 más AV2b, como control.
- El texto de las skills: `moon run kit:build kit:skill-size kit:own kit:copies` y `cli/test/kit/word-budget.test.ts`.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna — la regla se deshace devolviendo una frase, y la historia queda en esta spec y en la de la 0236.

## Delta de comportamiento

### Capacidad: `closing-suite`

#### MODIFIED — El cierre integra la base tras su commit y repite solo lo que afecta lo que trae la base

- GIVEN la 0081, que toca `src/app/` y `src/api/`, con la suite en verde en `a1b2c3d` al acabar las tasks, un gate de cierre `moon run app:test api:test launcher:test --affected --base develop`, y `origin/develop` que avanzó con el merge de la 0080, que cambia `src/api/rooms.js` (input de `api:test`) y `scripts/launcher/run.sh` (input de `launcher:test`, que la 0081 no toca)
- WHEN el cierre ha hecho su commit de cierre
- THEN hace `git fetch` y `sdd merge --sync --project-root <worktree>`, que integra `origin/develop` en la rama como último commit, y corre sobre el resultado solo las tareas que tocan la rama y la base a la vez: `api:test`; no corre `app:test` (la base no toca sus inputs) ni `launcher:test` (solo la toca la base, y la verificó el cierre de la 0080)
- AND el mensaje final lleva `` Gate: `moon run app:test api:test launcher:test --affected --base develop` → api:test: corrió 212/212 · app:test: saltada (la base no toca sus inputs: `moon task app:test`) · launcher:test: saltada (solo la toca la base) ``, y el 4.1 del walkthrough, la línea `Gate:` de la validación
- AND el merge final lleva `--verified-at <sha del merge de sincronización>`
- AND si la 0080 solo hubiera cambiado `.docs/sdd/roadmap.md`, no corre nada y el merge lleva `--verified-at a1b2c3d`
- AND con un gate sin filtro de base (`node --test`), corre el gate entero (E2E incluidos si el proyecto los declara) si la base trae cambios fuera de `.docs/` que no sean `*.md`
- AND con conflicto en `roadmap.md`, `changelog.md` o un add/add de dos requisitos al final de una capacidad, `--sync` lo resuelve y el cierre sigue; con `base: conflicto en src/slots.js`, el cierre queda «No terminado» para una persona
- REMOVED AND si la 0080 trae también `pnpm-lock.yaml`, que está en «Sin filtro», el gate corre entero sobre el merge de sincronización, con `(sin filtro: cambia el build)` en cada tarea
- AND si la 0080 trae también el `package.json` raíz, que no es input de ninguna de las tres tareas, y `pnpm-lock.yaml`, input de `launcher:test`, los dos en «Sin filtro», el gate no corre entero: cuentan como cualquier otro fichero de la base, así que corre `api:test` y la línea lleva las mismas saltadas, `launcher:test: saltada (solo la toca la base)` incluida, sin `(sin filtro: cambia el build)`
- AND si todas las tareas salen saltadas y no hay suite unitaria en «Suites», no corre nada y el merge lleva `--verified-at a1b2c3d`, el sha de la gate de cierre
- AND con una suite unitaria en «Suites», corre entera sobre el merge de sincronización si la base trae cambios fuera de `.docs/` que no sean `*.md`

### Capacidad: `verification`

#### MODIFIED — La línea `Gate:` nombra cada tarea, corrida o saltada

- GIVEN un cambio en carril config que edita la definición de `app:test` en `moon.yml`, con el gate `moon run app:test api:test --affected --base develop`, que sale con 0 y `Tasks: 0 completed, 2 skipped`
- WHEN el agente va a declarar el gate y commitear
- THEN corre `moon run app:test` sin `--affected`, porque cambia su definición, antes de commitear
- AND la línea del commit es `` Gate: `moon run app:test api:test --affected --base develop` → app:test: corrió 98/98 (sin filtro: cambia su definición) · api:test: saltada (ningún fichero cambiado casa con sus inputs: `moon task api:test`) ``
- AND nunca escribe `→ verde` ni da el gate por bueno solo por su código de salida
- AND la misma forma, una entrada por tarea del gate, vale en el 4.1 del walkthrough, en el §4 de `patch.md` y en el informe de la baseline de `sdd-worktrees`
- AND las órdenes que corrieron (las suites unitarias y el gate) van antes de la flecha, cada una entre backticks y separadas por ` · `
- REMOVED AND una tarea que corre sin filtro porque la rama o la base tocan un fichero de «Sin filtro» de `operations.md` lleva `(sin filtro: cambia el build)`; una que no corrió en la pasada roja, `(no corrió en la pasada roja)`; tras una pasada roja, la línea empieza por `tras el rojo en <sha>, arreglo <sha>:`, y con un arreglo solo de docs, por `tras el rojo en <sha>, arreglo <sha> solo de docs:`
- AND una tarea que corre sin filtro porque la rama toca un fichero de «Sin filtro» de `operations.md`, en la gate de cierre o en un arreglo y no tras `sdd merge --sync`, lleva `(sin filtro: cambia el build)`; una que no corrió en la pasada roja, `(no corrió en la pasada roja)`; tras una pasada roja, la línea empieza por `tras el rojo en <sha>, arreglo <sha>:`, y con un arreglo solo de docs, por `tras el rojo en <sha>, arreglo <sha> solo de docs:`

### Capacidad: `archive`

#### Reglas de la capacidad — archive

- **Límites**: tope de palabras de `sdd-archive`, el de `cli/test/kit/word-budget.test.ts`; el gate de cierre corre una vez por árbol, al acabar las tasks; con «Camino crítico», «Tests de feature» corre una vez por cierre, antes del borrado, y el árbol de la suite del cierre es el ya borrado; corre enteras las suites unitarias y `pendiente` de «Suites», y el gate por lo afectado, o entero si la rama toca un fichero de «Sin filtro»; tras un rojo corren los tests que fallaron, los que no llegaron a correr y el gate con `--base <sha rojo>`, y con un arreglo solo de docs, solo los tests que fallaron; tras el merge de sincronización se repiten solo las tareas que tocan la rama y la base a la vez, también si la base trae un fichero de «Sin filtro»: con un gate filtrado, las que selecciona contra `<merge.into>` y también contra el sha de la última suite en verde; sin filtro, el gate entero si la base trae cambios fuera de `.docs/` que no sean `*.md`; el informe de rojo lleva las últimas 20 líneas; el aviso de `ya-en-base:` nombra hasta diez tests; una suite E2E que pasa de su «Presupuesto E2E», o sin presupuesto, una suite de más de 10 minutos, va a la deuda del proyecto; un sha citado es una cadena de 7 a 40 caracteres hexadecimales; los nombres `finishing-a-development-branch`, `sdd-end-feature` y `sdd-end-patch` solo aparecen en `skills/` en la línea de procedencia de `skills/sdd-archive/SKILL.md` y en las migraciones de versiones pasadas (v0.4.0, v2.0.0, v3.0.0)

## Topes de palabras

Medido sobre `dist/skills/` con el conteo de `cli/test/kit/word-budget.test.ts` (palabras separadas por espacios, sin migraciones). Lo previsto: el paso 6 sustituye una frase de 19 palabras por otra de tamaño parecido; «After the sync merge» quita 7 («without a file of «Sin filtro» from the base,») y gana como mucho 7; el punto 2 de «Running a gate» quita 7; el literal del paso 9 quita 5; la plantilla quita 3. Saldo previsto: entre −22 y −15; el plan lo mide con `word-budget.test.ts` tras redactar.

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `sdd-archive` `SKILL.md` | 2661 / 2729 | 68 | sin cambio |
| `sdd-archive` total | 8080 / 8220 | 140 | sin cambio |
| `sdd-verify` `SKILL.md` | 2576 / 2606 | 30 | sin cambio |
| `sdd-verify` total | 9466 / 9503 | 37 | sin cambio |
| `sdd-templates` total | 17713 / 18000 | 287 | sin cambio |

## Previsión de coste

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| RED | `SCENARIOS="g8" N=2` → `suma: 2 sujetos · coste previsto: 0.94 $`; `SCENARIOS="av2" N=1` → `suma: 1 sujetos · coste previsto: 0.32 $` | 1.26 |
| GREEN | `SCENARIOS="g8" N=2` → `suma: 2 sujetos · coste previsto: 0.94 $` | 0.94 |
| Una tanda de REFACTOR | `SCENARIOS="g8 av2" N=1` → `suma: 2 sujetos · coste previsto: 0.79 $` | 0.79 |
| Controles | `SCENARIOS="av2" N=1` → `suma: 1 sujetos · coste previsto: 0.32 $` | 0.32 |
| Medición tras la revisión final | 0 sujetos: solo si la revisión final cambia el texto de una skill, y entonces `SCENARIOS="g8" N=1` (0,47 $) | 0 |
| Contingencia (decisión 13) | GREEN 1/2: `SCENARIOS="g8" N=2` → 0.94 $; REFACTOR 0/1: `SCENARIOS="g8 av2" N=2` → 1.58 $ | 2.52 |
| Suma | 8 sujetos (12 con la contingencia) | 3.31 (5.83 con la contingencia) |

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-11-27 | aprobada (opción «Apruebo») |
