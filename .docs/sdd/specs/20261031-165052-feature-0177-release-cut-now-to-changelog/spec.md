---
id: 20261031-165052-feature-0177-release-cut-now-to-changelog
feature: 0177
parent: 0150
proposal: 0131
title: El corte saca lo hecho de Now al changelog, sin changelog de cliente ni email
mode: full
profile: delegate
status: approved
created: 2026-10-31
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-10-31
---

# Spec — El corte saca lo hecho de Now al changelog, sin changelog de cliente ni email

🦆 Hoy, al cerrar la 1.4.0 de un proyecto ya migrado, el agente improvisa: uno sella el changelog y fusiona dejando las reservas exportadas en Now, otro borra de Now un aviso por correo sin validar y nadie vuelve a reclamarlo. Con esta feature, el corte convierte cada fila hecha de Now en su línea de `CHANGELOG.md` y la saca de Now. El aviso sin validar sigue en Now con su disparador nuevo. Las filas de deuda en espera desde hace dos releases caducan solas, y al cliente solo le quedan las release notes. Las features y los patches dejan de escribir en el changelog al cerrarse: su fila en Now basta hasta el corte.

Validación: agente — `validation.mode: field` en `sdd-kit.json`: se cierra con tests, smoke y RED/GREEN, y el uso real llega con los tickets.

## Capacidades

- Modificadas: `release-flow` — el corte sale de Now, caduca la deuda y retira el email y la forma 2.x
- Modificadas: `archive` — con `ROADMAP.md`, el cierre no escribe el changelog y todo cambio tiene fila en Now
- Modificadas: `onboarding` — `client-changelog-template.md` ya no existe

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: contrato público (la forma de `CHANGELOG.md`), MODIFIED y REMOVED (11 requisitos), tres capacidades · tamaño: ~400 líneas en ~12 ficheros. 3 señales: la rúbrica no propone revisor, y la revisión final de rama sigue en pie.
- Mínimo razonable: ninguna — deja sin segunda lectura la decisión 1, por eso va la primera aquí.

1. **El changelog se escribe en el corte, no al cerrar cada cambio** (lectura literal de «sale de ahí al changelog» y de §archive). La alternativa, cerrar con entrada en `[Unreleased]` y que el corte solo saque la fila, da dos registros del mismo hecho y cuesta menos en contexto: quien cierra sabe la categoría, y el corte la tiene que leer del artefacto. Prefiero la literal: un solo registro y sin conflictos de `[Unreleased]` entre ramas. **Si prefieres la otra, dilo aquí: cambia la Task 2 y dos requisitos.**
2. **Un cambio sin fila en Now la gana al cerrarse**, con su brief, porque si no el corte no lo ve. El sujeto `h` ya lo hizo solo; ahora es regla.
3. **Una fila `🧪` no validada se queda en Now con el disparador nuevo**, y su línea sí entra en el changelog. Al validarse en un corte posterior, sale sin segunda línea. El motivo: la 3.0.0 no tiene «Releases cerradas» donde poner `validaciones pendientes:`, y 6 de 9 sujetos sacaron la fila de Now, con lo que la pendiente quedó en el walkthrough y, como mucho, en una nota del changelog.
4. **Una entrada no se duplica**: un id que `[Unreleased]` ya nombra (lo dejó un cierre 2.x antes de migrar) no gana otra línea.
5. **La línea de smoke va bajo la cabecera de la versión en `CHANGELOG.md`**, con su forma actual. Su sitio anterior, «Releases cerradas», no existe.
6. **Sin `CHANGELOG.md`** (es opcional en la init): las filas salen igual, el mensaje del tag las nombra, y una fila con esos ids en «Tras» pasa a `—`, porque si no el validador falla. No caduca nada, porque no hay releases que contar.
7. **`sdd-end-release` solo corta en la forma 3.0.0.** Con `.docs/sdd/roadmap.md` y sin `ROADMAP.md`, para y ofrece `sdd-upgrade`. Se va la rama 2.x del colapso, y con ella el saldo de palabras negativo; un proyecto 2.x con entrega urgente migra antes o sigue con el kit anterior. `sdd-archive` conserva su forma 2.x, porque este repo y los proyectos sin migrar siguen cerrando.
8. **La caducidad la aplica el corte sin preguntar**, después de sellar para que la versión nueva cuente: la fila avisada pasa a «Descartadas» con «Motivo» `caducada` y la fecha del corte, y el resumen la nombra. Sale de «Descartadas» la que el validador avisa. `sdd-roadmap` sigue proponiendo la caducidad en un triaje entre cortes.
9. **Las release notes siguen solo con `release.hasRecipient: true`**: sin destinatario no se escriben, como hoy. No retiro `feedback-template.md` ni la retro: no los nombra la fila.
10. **`client-changelog.md` de un proyecto no se borra**: se queda como historia, sin lector ni escritor. Los `client-changelog` de `migrations/v1.1.0`, `v2.0.0` y `v3.0.0` se quedan: describen versiones pasadas o excluyen ese fichero de un `grep`.
11. **Rescate de las `validaciones pendientes:` heredadas**: en el primer corte tras migrar (el commit que borró `.docs/sdd/roadmap.md` es posterior a la última versión sellada), el corte las lee de ese `roadmap.md` en git y pregunta por ellas en el smoke. La no validada gana una fila `🧪` en Now con su brief, por la decisión 3.
12. **Filas de deuda «Actuar → 0177»**, medidas con un sujeto cada una:
    - l.270 (el atajo se rompe con un patch del smoke): no se reproduce, `f` aplicó el atajo. Sale de la spec; pasa a «Esperar 2.º ticket» al cerrar.
    - l.305 (nada comprueba la forma del changelog): `g` vio la cabecera rota y la dijo. Sale de la spec, sin verbo nuevo en la CLI; pasa a «Esperar 2.º ticket».
    - l.321 (pareja «tras» pendiente): `e-2` lo dijo y lo dejó a decidir. Sale de la spec; pasa a «Esperar 2.º ticket». `e-1` no vale: su molde no tenía walkthrough de la 0018.
    - l.328 (cuatro menores): la reescritura salda (1) y (4); (2) y (3) ya no existen. Se salda al cerrar.
    - l.516 (hotfix a mano) dice «Esperar 2.º ticket»: no entra.
13. **Frente limpio que se queda**: en `d`, la fila saldada de «Lista» salió y la 0007 se encontró con la skill actual. No añado guía para eso, pero la reescritura debe conservarlo, y el GREEN lo vuelve a medir, porque es alcance tuyo y porque el texto que lo consigue está en lo que se reescribe.
14. **Saldo de palabras**: `sdd-end-release` baja, medido con el conteo de `word-budget.test.ts`. No es imposible por ser reescritura: la tabla de abajo es el compromiso.
- Delta probado en una copia: `sdd capability merge` aplica el delta sin rechazos y `sdd capability check` escribe `Capacidades válidas: 20`.
- Política de modelos: sin revisores de spec · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura sonnet+high · sujetos con Sonnet, en serie (`MAX_PARALLEL=1`), sin paralelo · implementación Native.

### Decisiones tomadas con el dev-lead

Todas de la petición de arranque, 2026-10-31:

- Lo hecho queda en Now y sale de ahí — «Lo hecho queda en Now hasta el corte, y sale de ahí al changelog.»
- Release notes sí; cliente y email no — «Se quedan las release notes en releases/; se van el changelog de cliente y el email.»
- Caducidad — «Una fila en espera caduca tras dos releases sin 2.º caso, y una release es una versión X.Y.0 del changelog: los patches no cuentan.»
- Frentes limpios fuera — «Un frente que sale limpio se saca de la spec y se dice.»

## Intent

Los proyectos en la forma 3.0.0 tienen lo hecho en Now, pero `sdd-end-release` aún describe un colapso a «Releases cerradas» que su roadmap rechaza. En el RED, `f-1` no selló nada y etiquetó la v1.4.0 con las filas aún en Now, `e-2` propuso desmigrar el roadmap a la forma 2.x, y `c-1` escribió email y changelog de cliente. Éxito: con un molde 3.0.0, el sujeto corta, las filas pasan al changelog, la fila en espera caduca, quedan las release notes y no aparece ni changelog de cliente ni email. Fracasa aunque funcione si una validación diferida deja de reclamarse o si un cambio cerrado no llega al changelog.

### Evidencia del RED (`red/out/`, 9 sujetos, 2,58 $, skill actual)

| Frente | Sujeto | Resultado |
| --- | --- | --- |
| Now → changelog | `a-1`, `f-1`, `e-2` | ❌ `a-1` saca la 0014 🧪 y pierde el smoke; `f-1` no encuentra el changelog y etiqueta sin cortar; `e-2` deja el paso pendiente para migrar a la forma 2.x |
| Caducidad | `b-1` | ❌ avisada por el validador, no la aplica: «lo decide `sdd-roadmap`» |
| Cliente y email | `c-1` | ❌ escribe `email-entrega.md` y una entrada en `client-changelog.md` |
| Herencia de la 0197 | `d-1` | ✅ limpio; la 0007 queda solo en su walkthrough, que cubre la decisión 3 |
| Pareja «tras» (l.321) | `e-2` | ✅ limpio |
| Atajo con patch del smoke (l.270) | `f-1` | ✅ limpio en el atajo; falla en el primer frente |
| Forma del changelog (l.305) | `g-1` | ✅ limpio |
| Cierre (`sdd-archive`) | `h-1` | ❌ escribe en `[Unreleased]`; ✅ crea la fila que faltaba |

n = 1 por frente, como pediste: un limpio no prueba que nunca falle.

## Scope

- Entra:
  - `skills/sdd-end-release/SKILL.md`, reescrita en inglés; `references/notas-y-roadmap.md` pasa a `references/release-notes.md` con solo lo que queda; `references/versionado.md` y `retro.md`, en inglés.
  - `skills/add-to-changelog/SKILL.md`: la invoca el corte; recibe las categorías del patch que hoy están en `sdd-archive`; sin «changelog de cliente»; en inglés.
  - `skills/sdd-archive/SKILL.md`, `references/records.md`; `skills/sdd-start-feature/SKILL.md` paso 7 y `references/nombrado.md`, `commit-milestones.md`: el borrador de entrada, solo en 2.x.
  - Retirada: `skills/sdd-templates/templates/client-changelog-template.md`, su fila en `sdd-templates/SKILL.md`, la frase del email de `release-notes-template.md`; `changelog-template.md` (quién escribe).
  - La descripción de `sdd-end-release` y su fila en `using-sdd` sin «email»; `.docs/workflow/greenfield.md:31` sin `client-changelog.md`.
  - Capacidades `release-flow`, `archive`, `onboarding`; las líneas de deuda de la decisión 12.
- No entra: tendencia de vueltas y vigilancia de fuentes (`release-flow` en la propuesta las nombra, la fila 0177 no; lo he comprobado y creo que no deben entrar: `moon run kit:upstream` y la 0152 cubren lo urgente) · la beta de `release/3.0.0` de §Release, que es del corte real · retirar `sdd-start-feature` y `sdd-start-patch` (0206) · migrar este repo (0198) · verbo de la CLI para el corte o para la forma del changelog · `feedback-template.md` y la retro.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `client-changelog-template.md` | `sdd-templates/SKILL.md:27`; `capabilities/onboarding.md:118`; `.docs/workflow/greenfield.md:31`; `add-to-changelog/SKILL.md:10`; la propia plantilla | Scope y delta `onboarding` |
| `client-changelog.md` del proyecto | `migrations/v1.1.0.md`, `v2.0.0.md`, `v3.0.0.md`; `capabilities/migration.md:76,145,268` | Se quedan, decisión 10 |
| Borrador de email | `sdd-end-release/SKILL.md:3,21,55,124`; `notas-y-roadmap.md:8`; `release-notes-template.md:11`; `capabilities/release-flow.md:64,68` | Scope y delta |
| Colapso a «Releases cerradas», `validaciones pendientes:` de cada corte | `sdd-end-release/SKILL.md:59-82,114`; `notas-y-roadmap.md`; `capabilities/release-flow.md` (cinco requisitos); `migrations/v3.0.0.md:61` | Scope y delta; la migración se queda: describe qué hace con lo viejo |
| Entrada de changelog al cerrar, en 3.0.0 | `sdd-archive/SKILL.md:44`; `sdd-start-feature/SKILL.md:24`; `nombrado.md:17`; `commit-milestones.md:13` | Scope y delta `archive`; en 2.x sigue |
| Rama 2.x de `sdd-end-release` y su paso a `migrations/v2.3.0.md` | `sdd-end-release/SKILL.md:59-67`; `capabilities/release-flow.md:116` | Delta, decisión 7 |

- Filas que implementa: 0177 → `roadmap.md:99` (✅ al cerrar), `:112` y `:113` (la nombran como dependencia, se quedan), `sdd-templates/SKILL.md:27` y `onboarding.md:118` (arriba). Líneas 270, 305, 321, 328 y 516: decisión 12.

## Approach

Orden del corte en la skill reescrita: gate de entrada → forma (2.x para) → scope y versión desde las filas `✅` y `🧪` de Now → smoke y diferidas → changelog (una línea por fila con `add-to-changelog`, categoría del artefacto, sellado, línea de smoke) → filas fuera de Now y título a `## Now` → deuda (`sdd roadmap check` tras sellar, aplicar sus avisos, saldadas fuera de «Lista») → release notes si hay destinatario → validador → bump, merge y tag con su gate y su atajo sin cambios.

## Dónde se prueba

- Cada frente: sujeto headless sobre `red/subject.mjs`, leyendo `CHANGELOG.md`, `ROADMAP.md`, `debt.md` y `releases/` guardados.
- Plantilla retirada y nombres: `cli/test/kit/skills.test.ts` y `word-budget.test.ts`, como las retiradas anteriores.
- El delta: `sdd capability merge` y `check`.

## Términos y ADR

- Términos resueltos: corte — el paso de `sdd-end-release` que publica una versión; se evita «colapso», que era del roadmap 2.x.
- ADR candidatas: el changelog se escribe solo en el corte — alternativa descartada: entrada en cada cierre (decisión 1).

## Delta de comportamiento

### Capacidad: `release-flow`

#### ADDED — El corte saca lo hecho de Now al changelog

- GIVEN un `ROADMAP.md` con Now `## Now — 1.4.0 · en preparación`, la 0012 ✅, el patch 0013 ✅, la 0014 `🧪 validación diferida a el smoke de la 1.4` y la 0015 ⏳, un `CHANGELOG.md` con `## [Unreleased]` vacío, y un dev-lead que confirma la 1.4.0 y dice que probó exportar, sin mencionar la 0014
- WHEN `sdd-end-release` corta el 2026-10-31
- THEN `CHANGELOG.md` tiene `## [1.4.0] - 2026-10-31` con una línea de la 0012 en `### Added`, una de la 0013 en `### Fixed` y una de la 0014, y un `## [Unreleased]` vacío encima
- AND en Now quedan la 0015 ⏳ y la 0014 con `🧪 validación diferida a <disparador nuevo>`; la 0012 y la 0013 salen, y el título es `## Now`
- AND la categoría sale del artefacto de la fila: en un patch, la que da su clase
- AND `sdd roadmap check` escribe `Roadmap válido` antes de proponer merge y tag

#### ADDED — Una fila validada en un corte posterior sale sin otra entrada

- GIVEN la 0014 🧪 en Now, con su línea en `## [1.4.0]`, o un id que `[Unreleased]` ya nombra
- WHEN el corte de la 1.5.0 la publica, o el dev-lead dice que la probó
- THEN esa fila sale de Now y `CHANGELOG.md` no gana una segunda línea de ese id
- AND una fila 🧪 validada gana su adenda fechada en el walkthrough

#### ADDED — Sin changelog, el mensaje del tag nombra lo publicado

- GIVEN un proyecto sin `CHANGELOG.md`, con la 0012 ✅ en Now y la 0016 de Next con «Tras» `0012`
- WHEN se corta la 1.4.0
- THEN la 0012 sale de Now, el mensaje del tag anotado la nombra y el «Tras» de la 0016 pasa a `—`
- AND no se crea `CHANGELOG.md` y no caduca ninguna fila de `debt.md`

#### ADDED — El corte caduca la deuda en espera

- GIVEN un `CHANGELOG.md` con `## [1.3.0] - 2026-08-01` y `## [1.2.0] - 2026-06-01`; en «En espera», filas del 2026-05-01, 2026-07-01 y 2026-08-15; en «Descartadas», filas del 2026-05-01 y 2026-08-15
- WHEN el corte sella la 1.4.0
- THEN las dos primeras de «En espera» pasan a «Descartadas» con «Motivo» `caducada` y la fecha del corte, y la del 2026-08-15 se queda: solo tiene una release después
- AND la descartada del 2026-05-01 sale, y la del 2026-08-15 se queda
- AND un `## [1.3.1]` no cuenta, y el resumen de cierre nombra lo caducado
- AND el agente no pregunta

#### ADDED — El corte saca de «Lista» lo saldado

- GIVEN en «Lista» de `debt.md` una fila con prefijo `**[Feature 0009, 2026-07-20: saldada — …]**` y otra sin prefijo
- WHEN se corta la 1.4.0
- THEN la primera sale y la segunda se queda

#### ADDED — El primer corte rescata las validaciones pendientes de la migración

- GIVEN un commit que borró `.docs/sdd/roadmap.md` tras la `1.3.0`, cuyo contenido anterior dice `validaciones pendientes: 0007`, y el walkthrough de la 0007 con disparador en la 1.4
- WHEN se corta la 1.4.0 y el dev-lead valida el smoke sin mencionar la 0007
- THEN el corte la nombra en la petición de smoke, su walkthrough gana una adenda fechada con el disparador nuevo y Now gana una fila `🧪 validación diferida a <disparador nuevo>`
- AND mencionada por el dev-lead, gana la adenda con lo que probó y no gana fila
- AND en el corte siguiente, sin ese commit posterior a la última versión sellada, no se busca

#### ADDED — Solo se corta en la forma 3.0.0

- GIVEN un proyecto con `.docs/sdd/roadmap.md` y sin `ROADMAP.md`
- WHEN el usuario ordena «cierra la release»
- THEN el agente no sella ni toca el roadmap, dice que el corte pide la forma 3.0.0 y ofrece `sdd-upgrade`

#### ADDED — Sin changelog de cliente ni email

- GIVEN `release.hasRecipient: true`, un `.docs/sdd/client-changelog.md` de antes y el usuario que dice «el cliente espera sus novedades hoy»
- WHEN se corta la 1.4.0
- THEN existe `.docs/sdd/releases/v1.4.0/release-notes.md`, destilada del changelog sellado
- AND no se escribe ningún borrador de email y `client-changelog.md` no cambia

#### ADDED — Sin destinatario no hay release notes

- GIVEN `release.hasRecipient: false`
- WHEN se cierra una release
- THEN no se escribe `release-notes.md` y el paso no aplica

#### REMOVED — Sin destinatario no hay release notes ni email

- motivo: el email se retira; lo sustituye «Sin destinatario no hay release notes»

#### REMOVED — El corte no arranca desde una sección fuera de la plantilla sin decirlo

- motivo: era de la forma 2.x; lo sustituye «Solo se corta en la forma 3.0.0»

#### REMOVED — El corte deja el roadmap válido

- motivo: describía «Releases cerradas» y las secciones 2.x; lo sustituye «El corte saca lo hecho de Now al changelog»

#### REMOVED — Se puede cerrar una release que no se abrió

- motivo: en la 3.0.0 no se abre ninguna sección de release: lo sustituye «El corte saca lo hecho de Now al changelog», con Now sin versión

#### REMOVED — El smoke de la release valida las features diferidas a él

- motivo: su línea `validaciones pendientes:` no existe en la 3.0.0; lo sustituyen «El corte saca lo hecho de Now al changelog», «Una fila validada en un corte posterior sale sin otra entrada» y «El primer corte rescata las validaciones pendientes de la migración»

#### MODIFIED — El carril release es opcional (antes: "sus entradas van a `[Unreleased]`")

- GIVEN un proyecto que trabaja solo con feature y patch, sin sección de release abierta en el roadmap
- WHEN se cierran features y patches
- REMOVED THEN sus entradas van a `[Unreleased]` y ninguna skill de feature o patch pide abrir una release
- THEN sus filas quedan en Now hasta el corte (en 2.x, sus entradas van a `[Unreleased]`) y ninguna skill de feature o patch pide abrir una release
- AND el id de una feature sin fila reservada sigue lo que declara [`feature-ids.md`](feature-ids.md) («Una feature no planificada obtiene su id con un script determinista»)

#### MODIFIED — La versión se propone desde el changelog (antes: "lo que contiene `[Unreleased]`")

- REMOVED GIVEN un `[Unreleased]` con entradas
- GIVEN filas ✅ o 🧪 en Now, o un `[Unreleased]` con entradas
- WHEN `sdd-end-release` propone la versión en el paso 1
- REMOVED THEN la propuesta sale de lo que contiene `[Unreleased]` (en pre-1.0, según `versionado.md`) y va con su motivo
- THEN la propuesta sale de esas filas y de esas entradas (en pre-1.0, según `versionado.md`) y va con su motivo
- AND la versión sigue esperando la confirmación explícita del usuario

#### MODIFIED — En modo tracker, el cierre lista los tickets (antes: "de las entradas de `[Unreleased]`")

- GIVEN `ids.mode: tracker`
- WHEN se presenta el resumen de cierre
- REMOVED THEN incluye los ids de ticket de las entradas de `[Unreleased]` que entran en la versión
- THEN incluye los ids de ticket de las filas de Now que entran en la versión

#### MODIFIED — La línea de smoke se cuenta igual en todas las releases (antes: "en el roadmap")

- GIVEN el cierre de una release
- REMOVED WHEN se escribe la línea de smoke en el roadmap
- WHEN se escribe la línea de smoke bajo la cabecera de la versión en `CHANGELOG.md`
- THEN tiene la forma `smoke: <fecha> · <N> hallazgos (<qué se ejecutó>; <M> corregidos en la release)`, donde N cuenta solo defectos del comportamiento entregado detectados por el smoke sobre la rama integrada
- AND si no se ejecutó smoke, la línea es `smoke: pendiente`

#### MODIFIED — La retro es opcional (antes: "si el roadmap ya está colapsado, se añade su enlace a la entrada de la release")

- GIVEN un proyecto con `.docs/sdd/estimation-log.md`
- WHEN `sdd-end-release` propone la versión en el paso 1
- THEN la misma propuesta ofrece la retro en una línea, sin pregunta aparte
- REMOVED AND solo se escribe si el usuario la pide, en `.docs/sdd/releases/vX.Y.Z/retro.md`, y no retiene los demás pasos: si el roadmap ya está colapsado, se añade su enlace a la entrada de la release
- AND solo se escribe si el usuario la pide, en `.docs/sdd/releases/vX.Y.Z/retro.md`, y no retiene los demás pasos
- AND sin `estimation-log.md` no se ofrece

### Capacidad: `archive`

#### ADDED — Con `ROADMAP.md`, el cierre no escribe el changelog

- GIVEN un proyecto con `ROADMAP.md` y `CHANGELOG.md` en la raíz, y el patch 0021 sin fila en Now
- WHEN `sdd-archive` cierra el patch
- THEN `CHANGELOG.md` no cambia
- AND Now gana la fila 0021 con su brief y `✅`, y `sdd roadmap check` escribe `Roadmap válido`
- AND con `.docs/sdd/roadmap.md` y `.docs/sdd/changelog.md` (2.x), el cierre sigue añadiendo su entrada con `add-to-changelog`

### Capacidad: `onboarding`

#### MODIFIED — `sdd-templates` ofrece las plantillas de los documentos de la 3.0.0 (antes: "`client-changelog-template.md` y `roadmap-template.md` siguen")

- GIVEN el skill `sdd-templates`
- WHEN se lista su índice de plantillas de documentos
- THEN tiene `PRODUCT-template.md` → `PRODUCT.md` en la raíz, `constitution-template.md` → `.docs/sdd/steering/constitution.md`, `operations-template.md` → `.docs/sdd/steering/operations.md`, `architecture-template.md` → `.docs/sdd/steering/architecture.md`, `estimation-template.md` → `.docs/sdd/steering/estimation.md`, `now-next-later-template.md` → `ROADMAP.md` en la raíz, `debt-template.md` → `.docs/sdd/steering/debt.md`, `changelog-template.md` → `CHANGELOG.md` en la raíz y `adr-template.md` → `.docs/sdd/decisions/`
- REMOVED AND `client-changelog-template.md` y `roadmap-template.md` siguen, marcadas «2.x» con la feature que las retira (0177 la de cliente; 0157 la del roadmap), y `mission-template.md`, `tech-stack-template.md` y `environments-template.md` ya no existen
- AND `roadmap-template.md` sigue, marcada «2.x» con la feature que la retira (0157), y `client-changelog-template.md`, `mission-template.md`, `tech-stack-template.md` y `environments-template.md` ya no existen

## Topes de palabras

Conteo de `word-budget.test.ts` sin migraciones. El tope no sube; el compromiso es el saldo de la regla 6 de `CLAUDE.md`.

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `sdd-end-release/SKILL.md` | 2.040 / 1.900 (2.375 con holgura) | 335 | sin cambio; saldo ≤ 2.040 |
| `sdd-end-release`, total | 2.608 / 2.500 (3.125 con holgura) | 517 | sin cambio; saldo ≤ 2.608 |
| `add-to-changelog` | 403 / 500 (625 con holgura) | 222 | sin cambio; saldo ≤ 403 |
| `sdd-archive/SKILL.md` | 4.613 / 3.920 (4.900 con holgura) | 287 | sin cambio; saldo ≤ 4.613: la categoría del patch se va a `add-to-changelog` |

## Previsión de coste

Precio medido en el RED: 0,29 $ por sujeto.

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| RED | 9 (medido) | 2,58 |
| GREEN | 8: `a`, `b`, `c`, `d`, `f`, `h`, sin changelog y 2.x que para | 2,50 |
| Una tanda de REFACTOR | 8 | 2,50 |
| Controles | `e` y `g`, que salieron limpios; tramo de la batería de `sdd-archive`, 3 sujetos a 0,70 $ | 2,70 |
| Medición tras la revisión final | 2 (`a`, `h`) | 0,60 |
| Suma | 32 | 10,88 |

El lanzador se arrancó con techo de 24 sujetos y 24 $. Al aprobar esta tabla, `SUBJECT_CAP` sube a 32; el techo de 24 $ no cambia.

## Enmiendas

- Ninguna.

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-10-31 | aprobada (opción «Apruebo») |
