---
id: 20261110-181442-feature-0198-migrate-repo-v3
feature: 0198
title: Migrar este repo a la 3.0.0
mode: full
profile: delegate
status: approved
created: 2026-11-10
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-11-10
---

# Spec — Migrar este repo a la 3.0.0

🦆 Este repo pasa sus documentos a la forma de la 3.0.0. Lo que lee la persona va a la raíz: `PRODUCT.md` (hoy `mission.md`), `ROADMAP.md` (Now, Next y Later) y `CHANGELOG.md`. Lo que lee el agente va a `.docs/sdd/steering/`: `constitution.md`, `architecture.md`, `operations.md` (hoy `tech-stack.md`), `debt.md` (la deuda, hoy dentro del roadmap) y la estimación. Es la primera vez que la migración corre en un repo real, y leída contra este repo tiene huecos que le pasarían a cualquier proyecto 2.x: dejaría unos 800 enlaces rotos, mandaría a Now 64 patches ya publicados y renumeraría filas que ya tienen id. Primero se arregla la migración y después se aplica aquí. Las tablas de destino que tienes que aprobar van en dos páginas: una antes de la marca de versión y otra después.

Validación: agente — este repo valida en campo (`validation.mode: field`); lo que se ve son documentos, la batería de la migración y comprobaciones que el agente corre.

## Capacidades

- Modificadas: `migration` — el aviso de versión y los nombres de skills de la v3.0.0 (MODIFIED), y cuatro requisitos nuevos: enlaces, lo publicado, la release por prefijo y los ids del Backlog

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor con los siete puntos — señales: zona sin leer (la migración nunca corrió en un repo real) · tamaño: 9 documentos, la migración y ~10 ficheros del repo
- Hecha: un revisor opus en tres rondas: 10 hallazgos (2 Críticos), 10 (1 Crítico) tras reescribir el enfoque y 10 (1 Crítico) sobre lo cambiado, todos aceptados
- Mínimo razonable: este mismo revisor en sonnet — la lectura de la migración entera contra este repo es la parte difícil

1. **Enfoque: arreglar en `migrations/v3.0.0.md` cada hueco que este repo destapa, y aplicarla aquí con `sdd-upgrade`**, frente a aplicarla literal con desvíos anotados (la 3.0.0 saldría con la migración rota) o escribir los documentos a mano (no la prueba). Decisión central.
2. **Arreglos de la migración**, en el paso que decide, sin añadir ni renumerar pasos (`operations-gate-fields.test.ts` corta el paso 2 por su número) y sin tocar la línea `**Writes**:` (`migration-init-parity.test.ts`):
   - (a) pasos 1 a 3: cada documento que se mueve o se crea en otra carpeta reescribe sus enlaces relativos para su carpeta nueva —los en línea `](…)` y los de referencia `[x]: …`; no los de dentro de código, ni las URL, ni los que solo llevan ancla—; en `CHANGELOG.md`, solo la parte que llega de `.docs/sdd/changelog.md`. El paso 4 y la «Verification» dejan de excluir `CHANGELOG.md` para esos enlaces. Aquí quedarían rotos ~400 en `ROADMAP.md`, ~385 en `CHANGELOG.md`, 4 en `PRODUCT.md` y ~33 en `operations.md`;
   - (b) paso 3: lo publicado se decide por la etiqueta git de la última release cerrada (la versión más nueva de `changelog.md`, aquí `v2.3.4`): una fila salió si el commit que añadió su artefacto de cierre (`walkthrough.md` o `patch.md`) está en esa etiqueta (`git merge-base --is-ancestor`), como hizo la 0153. No por el commit que añadió la fila (las 0128, 0116, 0129 y 0122 entraron antes de la 2.3.0 y se cerraron después; la fila del hotfix 0167 entró en `develop` sin etiqueta, y su `patch.md` está en `v2.3.4`), ni por fechas, ni por la tabla «Releases cerradas» (aquí acaba en la 2.3.0). Una fila sin artefacto va a la tabla; sin etiquetas, una sola pregunta para todas. Vale para «Patches», «Próximo» y la deuda saldada;
   - (c) paso 3: una release en preparación también se reconoce por el prefijo de las filas de «Próximo»: «**Release <N>**» con N en SemVer, con «Patch: » delante o sin él y cualquier puntuación detrás; dos N distintos, o un N que no es SemVer («**Release siguiente**»), van a la tabla con su pregunta;
   - (d) paso 3: con release en preparación, una fila ✅ o 🧪 de «Próximo» que no salió (arreglo b) va a Now; una que salió, o que la fila marca absorbida o descartada, sale, nombrada en la tabla; a Next solo van las pendientes;
   - (e) paso 3: una fila de «Patches» cuyo id ya está en «Próximo» se une a esa fila;
   - (f) paso 3: una fila del «Backlog» con id de la secuencia lo conserva, y la reserva es solo para las que no lo tienen; una fila sin id con un estado que Later no admite (`🔄`) va a la tabla con su pregunta;
   - (g) paso 5: lo que encuentra en `.docs/sdd/capabilities/` va a una tabla con gate, en vez de reescribirse: allí un nombre viejo puede ser el dato de un escenario («`sdd-end-patch` pasa a `sdd-archive`»). La tabla propone mantener la línea que nombra el viejo y el nuevo, y reemplazar las demás. La «Verification» del paso 5 deja fuera lo que el dev-lead mantiene.
   Las marcas en castellano van entre comillas latinas o en código, como el resto de la migración (`tests/own`, `spanish.ts`). Antes de editarla, `sdd-agent-writing`; después, `moon run kit:build`.
3. **Dos páginas de aprobación** (artifacts privados): la primera con las tablas de los pasos 1, 2, 3 y 6, antes de la marca; la segunda con los pasos 8 y 10, tras el commit de la marca, que no la frena, como dice la migración.
4. **«Tamaño»**: la migración lo deja al dev-lead en cada fila de Now y Next, ✅ incluidas, y `roadmap check` no admite otra cosa que `S`, `M` o `L`. La primera página deja la columna en «lo decide el dev-lead» y te ofrece una regla para decidirlas de una vez: el tamaño que la fila ya escribe («Tamaño S», 97 filas), y si no lo escribe, `S` en un patch y `M` en una feature.
5. **Fila «1» (Estreno real, `🔄`, sin id)**: a Later como `⏸️ aparcada: uso en campo continuo, lo alimentan los tickets`, con id de la reserva (arreglo 2f).
6. **Secciones de `tech-stack.md` sin sitio en `operations-template.md`**: «Contenido y build», «Distribución» y «Referencias de vigilancia» → `steering/architecture.md` (~2.590 palabras), salvo lo que ya fija un manifest (`.prototools`, `package.json`), que sale por la regla «Tecnologías» del paso 2; «Cómo se testean las skills» (15.103), «Entorno de trabajo del equipo» y «Aprendizajes por task» (3.284) → `steering/operations.md`, tras `## Testing`, sin reescribir: la plantilla dice «se reescribe, no se le añade», pero reescribirlas no es migrar (desvío aceptado). Los campos nuevos de `## Testing` («Sin filtro», «Lint», nivel por suite, «Temporales» y `--include-relations` del gate), como dice el paso 2, en la tabla.
7. **Topes de palabras**: el contenido se mueve sin crecer; cada tope sigue a su contenido (ver «Topes de palabras»). `anchorBudgets` de `cli/test/kit/word-budget.test.ts` pasa a rutas desde la raíz, para leer `PRODUCT.md`.
8. **Herramientas del repo**, en el mismo commit que la marca: `CLAUDE.md` (reglas 2, 4, 5, 6 y 7, y el índice «Dónde está cada cosa»; el triaje de la regla 6 escribe en `ROADMAP.md` y `steering/debt.md`), `README.md`, los comentarios de `.github/workflows/ci.yml` y la tabla de documentos de `steering/architecture.md`. En `capabilities/` y `.docs/workflow/`, solo los enlaces del paso 4: allí los nombres de documento describen lo que hace el kit, y `.docs/workflow/` se relee entera en la 0152.
9. **Art. V de la constitution**: su ruta `.docs/sdd/changelog.md` pasa a `CHANGELOG.md` (decisión 13 de la 0144). El Art. VII se queda: el kit sigue escribiendo en `.docs/sdd/specs/`. Sin ADR: cambia una ruta, no una regla.
10. **Las dos filas de deuda «Actuar → 0198»**: el aprendizaje del gate por partes va a `## Testing` de `operations.md`; la nota de la batería, si sigue viva tras pasar `run.sh` a Node (0238), va a «Cómo se testean las skills»; si no, sale de la deuda con su motivo.
11. **Aviso de versión**: con la marca 3.0.0 y `plugin.json` en 2.3.4 hasta la 0152, cada sesión diría «actualiza con `claude plugin update`», que es falso. `versionWarning` de `cli/bin/session-start.js` no avisa si el kit cargado trae la migración de la versión que pide el proyecto; con su test.
12. **`roadmap.md` congelado en `develop` mientras viva la rama**: ningún cierre ni triaje lo edita, porque chocaría con su borrado en la rama (modify/delete). Solo trabaja esta sesión, que es también la de coordinación: no hay a quién avisar. La migración corre en el worktree de `feature/0198-migrate-repo-v3`.
13. **Superpowers** (paso 10): la segunda página recomienda quitar su activación de `.claude/settings.json`: el kit lleva sus copias anotadas y no lo usa (0279).
14. **RED y GREEN con la batería de la migración**, sin cambiar los escenarios que comparten `mold-v2x` (`v1` a `v4`, `g1`, `g2`, `s4`):
   - `subject.mjs` etiqueta en `main` el commit de la release del molde, que contiene el `patch.md` del 0017, y el del 0023 entra después en `develop`: el arreglo (b) decide lo mismo que hoy la fecha, y V2 y V3 siguen fijas;
   - una variante `v2x-release`, con escenario propio `v5`, lleva los casos de este repo: un enlace `specs/…` en una fila y en el changelog, «**Release 3.0.0**» en filas ✅ y ⏳, una fila ✅ sin prefijo con su walkthrough fuera de la etiqueta, el mismo id en «Patches» y en «Próximo», una fila del Backlog con id, una fila sin id en `🔄` y `capabilities/cierre.md`, una capacidad completa cuyo escenario dice «`sdd-end-patch` pasa a `sdd-archive`»;
   - `v2xReport` enseña además `CHANGELOG.md`, `.docs/sdd/capabilities/*.md` y `git tag`; `persona-v2x.md` contesta a la tabla de `capabilities/` («mantén la línea del cambio de nombre») y al estado de la fila `🔄` («`⏸️ aparcada: uso en campo`»); V5 deja de eximir `capabilities/`;
   - una fila de rúbrica por arreglo, con una cadena exacta (`](.docs/sdd/specs/` en `ROADMAP.md` y en `CHANGELOG.md`);
   - RED: `v5` con el kit de `develop`, n = 2. GREEN: `v5` con la rama, n = 2, y `v1`, n = 2, porque el texto que corre `v1` cambia.
   Este repo es además un caso real: los recuentos de la decisión 2, medidos con la migración de `develop`.
15. **Validación: agente**, con la validación en campo de este repo. Delta probado en una copia: `migration.md`, cuatro sustituidos y cuatro añadidos.
- Política de modelos: revisor de la spec, uno en opus · ejes de la revisión final: Spec opus+high, Código sonnet+high · en paralelo hasta `control.maxParallelAgents`

### Hallazgos de la review

- **Aceptado** — 1 (Crítico): los enlaces relativos de los documentos movidos se rompen → arreglo 2a y test de enlaces.
- **Aceptado** — 2 (Crítico): la última release cerrada y los patches duplicados → arreglos 2b y 2e; el recuento pasa a un cruce por id.
- **Aceptado** — 3: las filas hechas de «Próximo» sin prefijo → arreglo 2d.
- **Aceptado** — 4: la fila «1» y los ids del Backlog → arreglo 2f y decisión 5.
- **Aceptado** — 5: una sola página contradecía el orden de la migración → decisión 3, con el paso 6 dentro.
- **Aceptado** — 6: el Tamaño propuesto era deducirlo → decisión 4: lo decides tú, con una regla opcional.
- **Aceptado** — 7: el paso 5 reescribiría las líneas que describen el renombre → arreglo 2g.
- **Aceptado** — 8: Art. V y las dos filas de deuda → decisiones 9 y 10.
- **Aceptado** — 9: aviso de versión falso, choque del triaje y regla 7 → decisiones 11, 12 y 8.
- **Aceptado** — 10: topes medibles y lectura de `PRODUCT.md` → decisiones 6 y 7.
- **Aceptado** (segunda ronda) — 1 (Crítico): la migración sí tiene batería (`v1`, `mold-v2x`) → decisión 14 y previsión con sujetos.
- **Aceptado** (segunda ronda) — 2: el arreglo (g) no protegía las líneas de `capabilities/` → (g) con tabla y gate, y MODIFIED del requisito de nombres.
- **Aceptado** (segunda ronda) — 3: lo publicado por fechas falla con los hotfix → arreglo (b) por etiqueta.
- **Aceptado** (segunda ronda) — 4: el prefijo literal dejaba fuera variantes → arreglo (c) con SemVer y pregunta.
- **Aceptado** (segunda ronda) — 5: faltaban MODIFIED y un escenario por arreglo → delta reescrito.
- **Aceptado** (segunda ronda) — 6: el arreglo (a) no decía qué enlaces ni contaba con el paso 4 → (a) concreto.
- **Aceptado** (segunda ronda) — 7: tests que leen la migración → decisión 2 y «Dónde se prueba».
- **Aceptado** (segunda ronda) — 8: el congelado solo cubría el triaje → decisión 12.
- **Aceptado** (segunda ronda) — 9: topes sin medir y el 2 % → medidos en el ensayo, sin margen.
- **Aceptado** (segunda ronda) — 10: secciones enteras a `operations.md` → decisión 6, desvío aceptado y regla «Tecnologías».
- **Aceptado** (tercera ronda) — 1 (Crítico): el commit de la fila falla en los dos sentidos → arreglo (b) por el artefacto de cierre.
- **Aceptado** (tercera ronda) — 2: `mold-v2x` no tiene etiquetas → `subject.mjs` etiqueta la release (decisión 14).
- **Aceptado** (tercera ronda) — 3 y 7: crecer `mold-v2x` cambiaba siete escenarios → variante `v2x-release` con `v5`, y `v1` en el GREEN.
- **Aceptado** (tercera ronda) — 4: el roadmap y la deuda deciden «posterior» por la etiqueta → dos MODIFIED más.
- **Aceptado** (tercera ronda) — 5: el informe del sujeto no enseñaba `CHANGELOG.md`, `capabilities/` ni `git tag` → `v2xReport` y filas con cadena exacta.
- **Aceptado** (tercera ronda) — 6: qué propone la tabla de `capabilities/`, la persona y V5 → arreglo (g), decisión 14.
- **Aceptado** (tercera ronda) — 8: `cierre.md` como capacidad completa → decisión 14.
- **Aceptado** (tercera ronda) — 9: la relación etiqueta-commit al revés → ADDED reescrito.
- **Aceptado** (tercera ronda) — 10: topes sin medir → enmienda con las cifras antes de aplicar.

### Decisiones tomadas con el dev-lead

- Entera, sin partir (2026-11-10, «1»).
- La hace esta sesión, desde el checkout de `develop` («ok pues dale, 198, hazklla aqui»): tiempos por fase sin medir.
- Primera página (pasos 1, 2, 3 y 6) aprobada con mis propuestas, y el resto en `unattended`: la segunda página la decide el agente y una enmienda pasa por un revisor opus cuyo resultado se acepta — «sigue, dale caña, unattended por qu eme tengo que ir un rato de casa, si encuentras una enmienda haz una review opus y acepta el resultado» (2026-11-10).

## Intent

La 3.0.0 cambia dónde viven los documentos de un proyecto, y la migración que lo hace no ha corrido nunca en un repo real. Este repo es el primero, y su lectura ya destapa huecos que romperían cualquier proyecto 2.x. Éxito: la migración sin esos huecos, y este repo con la forma de la 3.0.0, `sdd-kit.json` en 3.0.0, ningún enlace roto ni fila perdida, el gate y la CI en verde, y la coordinación trabajando con las rutas nuevas. Fracaso aunque funcione: un documento reescrito sin que lo pida la migración, una fila del roadmap o de la deuda perdida, o un hueco de la migración tapado a mano solo aquí.

## Scope

- Entra: los arreglos de la decisión 2 en `skills/sdd-upgrade/references/migrations/v3.0.0.md`, `mold-v2x` y las filas de rúbrica de `v1`, y `dist/`.
- Entra: los pasos 1 a 10 de la migración sobre este repo, con sus tablas aprobadas.
- Entra: las herramientas y documentos de las decisiones 7 a 11.
- No entra: subir `plugin.json` ni cortar la release (0152); releer `.docs/workflow/` (0152).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `.docs/sdd/mission.md` | `CLAUDE.md`, `README.md`, `.docs/workflow/`, `capabilities/` | `PRODUCT.md` (paso 2) |
| `.docs/sdd/tech-stack.md` | `CLAUDE.md` (reglas 5 y 7, índice), `.github/workflows/ci.yml`, comentarios de tests, `word-budget.test.ts` | `steering/operations.md` y `steering/architecture.md` (paso 2, decisión 6) |
| `.docs/sdd/roadmap.md` | `CLAUDE.md` (reglas 2, 4 y 6, índice), `moon.yml` (`kit:roadmap`, por `--path .docs/sdd`) | `ROADMAP.md` y `steering/debt.md` (paso 3) |
| `.docs/sdd/changelog.md` | `CLAUDE.md`, constitution Art. V | `CHANGELOG.md` (paso 1, decisión 9) |
| `.docs/sdd/constitution.md`, `architecture.md`, `estimation.md`, `estimation-log.md` | `CLAUDE.md`, `word-budget.test.ts` | `.docs/sdd/steering/` (paso 1) |
| Enlaces a las rutas viejas | `capabilities/` (16 ficheros), `decisions/` (5 ADR), `.docs/workflow/` (3) | Enlaces Markdown: el paso 4; las ADR no se tocan (inmutables) y sus enlaces rotos van al informe |
| Rutas en código | `cli/src/cli/layout.ts`, `ids/scan.ts`, `merge/registries.ts`, `estimation/`, `session/timing.ts`, `tests/headless/lib.mjs` (ejemplo) | Se quedan: la CLI lee las dos formas (`resolveDocument`, `KEYED_REGISTRIES`) |
| Frases de la migración de la decisión 2 | `migrations/v3.0.0.md`, pasos 1, 2, 3 y 5 | Scope, decisión 2 |
| Filas de deuda «Actuar → 0198» | `roadmap.md`, Deuda técnica | Decisión 10 |

- Filas que implementa: 0198 → `.docs/sdd/roadmap.md` (Próximo); salda las dos filas de deuda «Actuar → 0198» · comprobado con `git grep -n "0198"` fuera de las carpetas de evidencia.

## Approach

- A — arreglar la migración con lo que este repo destapa y aplicarla: prueba la migración en un repo real y la 3.0.0 sale con ella sana; cuesta los arreglos y dos páginas de tablas.
- B — aplicarla literal y anotar los huecos: este repo quedaría con ~800 enlaces rotos y 64 patches duplicados, y la 3.0.0 saldría con la migración rota.
- C — escribir los documentos a mano: rápido, pero no prueba la migración.
- Elegido: A.

## Dónde se prueba

- Arreglos (a) a (g): `v5` de `tests/batteries/sdd-upgrade/battery.md`, RED con `develop` y GREEN con la rama, n = 2, con sus filas de rúbrica; `v1` en el GREEN, n = 2, sin regresión (decisión 14). Los recuentos de este repo con la migración de `develop`, en `tests/sdd-upgrade-0198-red.md`.
- Los tests que leen la migración siguen en verde: `operations-gate-fields.test.ts`, `migration-init-parity.test.ts` y `moon run kit:own` (`tests/own`).
- Enlaces de este repo: un test nuevo en `cli/test/kit/` pasa el comprobador de enlaces relativos de `workflow-docs.test.ts` por `PRODUCT.md`, `ROADMAP.md`, `CHANGELOG.md` y `.docs/sdd/steering/`.
- Nada perdido: un cruce por id: cada id de `roadmap.md` (Próximo, Backlog, Patches, Deuda técnica) está en `ROADMAP.md`, en `steering/debt.md` o nombrado en la tabla aprobada como fila que sale.
- La forma: la «Verification» de la migración, punto a punto, en el walkthrough; `sdd roadmap check --path .docs/sdd` → `Roadmap válido`; `sdd capability check --path .docs/sdd`.
- El aviso de versión: test de `sessionStartOutput` con el proyecto en 3.0.0, el kit en 2.3.4 y `v3.0.0.md` entre sus migraciones.
- Las herramientas: el gate de cierre, `moon run kit:build kit:skill-size kit:own kit:copies`, `word-budget.test.ts` y la CI de la rama.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna — la estructura la fijan la 0144 (ADR 0012) y la propuesta 0131

## Delta de comportamiento

### Capacidad: `migration`

#### MODIFIED — La sesión avisa cuando carga un kit menor que el del proyecto

- GIVEN un proyecto con `.docs/sdd/sdd-kit.json` a `2.0.0` y una sesión de Claude Code que carga el plugin `sdd-kit` `1.1.0`
- WHEN arranca la sesión
- THEN el usuario ve un aviso con las dos versiones, `claude plugin update sdd-kit@sdd-kit --scope project` y que hay que reiniciar Claude Code, porque `/reload-plugins` no aplica una actualización de ámbito proyecto
- AND el agente recibe el mismo aviso al principio de su contexto
- AND con la versión cargada igual o mayor, o sin `sdd-kit.json`, no hay aviso
- AND con el proyecto en `3.0.0` y el kit cargado en `2.3.4` con `migrations/v3.0.0.md` entre las suyas, no hay aviso: ese kit ya sabe leer la forma del proyecto

#### MODIFIED — La migración a v3.0.0 cambia los nombres de las skills retiradas

- GIVEN un proyecto en 2.3.4 cuyo `CLAUDE.md` dice «Cierra cada feature con `sdd-end-feature`.», con `.claude/commands/pregunta.md` que dice «Usa `/sdd-consult` para responder.», con una carpeta de `specs/` cuyo `walkthrough.md` cita `sdd-end-feature` y con `capabilities/cierre.md` cuyo escenario dice «`sdd-end-patch` pasa a `sdd-archive`»
- WHEN se aplica la v3.0.0
- THEN `CLAUDE.md` dice «Cierra cada feature con `sdd-archive`.» y `pregunta.md` dice «Usa `/sdd-explore` para responder.», sin gate
- AND `sdd-end-patch` pasa a `sdd-archive`, y `sdd-init-greenfield` y `sdd-init-brownfield` a `sdd-init`, en `CLAUDE.md`, `AGENTS.md`, `.docs/sdd/*.md`, `.docs/sdd/steering/*.md`, `.claude/skills/` y `.claude/commands/`
- AND lo que encuentra en `.docs/sdd/capabilities/*.md` va a una tabla con gate, y `cierre.md` sigue diciendo «`sdd-end-patch` pasa a `sdd-archive`» si el dev-lead lo mantiene
- AND el `walkthrough.md` de `specs/` sigue citando `sdd-end-feature`, y tampoco cambian `CHANGELOG.md`, `decisions/`, `releases/` ni `kit-feedback/`
- AND el informe lista los ficheros cambiados; sin ninguna mención, el paso se salta y lo dice
- AND la «Verification», con `git grep --untracked -nE 'sdd-(end-feature|end-patch|consult|init-greenfield|init-brownfield)'` sobre esas rutas (las carpetas con `:(glob)`, y sin `changelog.md`, `client-changelog.md` ni `roadmap.md` de `.docs/sdd/`), solo devuelve las líneas de su tabla con gate que el dev-lead mantiene, también sin `AGENTS.md` ni `.claude/`

#### MODIFIED — La migración a v3.0.0 lleva el roadmap a Now, Next y Later

- GIVEN un `roadmap.md` 2.x sin release en preparación, con la 0021 y la 0022 en «Próximo» (la 0022 con «tras 0021» y «`proposal: 0019`»), B3 en «Backlog», el patch 0023 posterior a la última release cerrada y el 0017 anterior, y la release cerrada con `validaciones pendientes: 0016`, con la etiqueta git de la última release cerrada, que no contiene el `patch.md` del 0023, en un proyecto en modo `sequence`
- WHEN se aplica la v3.0.0 y el dev-lead aprueba la tabla, con el Tamaño `M` para la 0021 y la 0022
- THEN `ROADMAP.md` tiene en Now la 0021 y la 0022 con su brief plegado (la 0022 con «Tras» 0021 y `**Requisitos:**` hacia la propuesta 0019), Tamaño `M`, y el patch 0023 con `✅` y `**Carril:** patch`; en Later, el ítem de la B3 con el id `0024`, de la reserva de la migración, y ningún `B<n>`
- AND no aparecen ni el 0017 ni la 0016, y la tabla y el informe nombran la 0016 como validación pendiente que sigue en su walkthrough
- AND la tabla deja el Tamaño como «lo decide el dev-lead» antes de su respuesta, sin proponer uno
- AND `sdd roadmap check --path .docs/sdd` escribe `Roadmap válido`, y no queda `.docs/sdd/roadmap.md`

#### MODIFIED — La migración a v3.0.0 lleva la deuda a `debt.md` sin inventar celdas

- GIVEN una «Deuda técnica» 2.x con una fila `**Actuar** → 0022` cuyo «Ítem» enlaza su ticket, una `**Actuar** → sin fila` sin evidencia, una `**Esperar 2.º ticket**`, una `**Descartada**: duplica la 0018`, una con destino `versión siguiente`, una saldada cuyo artefacto de cierre no contiene la etiqueta de la última release cerrada, una `**Actuar** → 0030 · causa: prueba o molde · arreglo: mover regla`, y una `**Esperar 2.º ticket** · causa: fusión de registros — falta reproducirlo`
- WHEN se aplica la v3.0.0 y el dev-lead aprueba la tabla
- THEN `.docs/sdd/steering/debt.md` tiene la primera en «Lista» con destino 0022 y el ticket como evidencia, y la saldada en «Lista» con su prefijo `**[… saldada …]**` intacto
- AND la de `sin fila` y la de `versión siguiente` están en «Por triar», la de `**Esperar**` en «En espera», y la `**Descartada**` no está en `debt.md`: sigue en el `roadmap.md` 2.x que guarda git
- AND cada «Fecha» es la del commit que añadió su fila al roadmap, y la tabla dice de dónde salió
- AND `sdd roadmap check --path .docs/sdd` escribe `Roadmap válido`
- AND la de la 0030 tiene «Causa» `prueba o molde` y «Arreglo» `mover regla`, y la de `fusión de registros` tiene esa «Causa» y «Falta» `reproducirlo`, sin las marcas
- AND las que no traen causa o arreglo los llevan propuestos en la tabla, marcados como propuesta, leyendo su «Ítem»; si el dev-lead rechaza la causa de una, esa fila va a «Por triar»
- AND el «Remedio temporal» sale de `· remedio:`; sin él, es `—` en una fila de un caso, y la tabla lo pregunta en una con dos o más enlaces

#### ADDED — La v3.0.0 enseña antes las mediciones fechadas

- GIVEN un `tech-stack.md` 2.x con la línea «Una validación escrita de antemano no valida (task 0012): 2 de 2 sujetos de `sdd-end-patch` pararon en el paso 0 a preguntar.»
- WHEN se aplica la v3.0.0
- THEN la línea va a la tabla con gate del paso 5, con la propuesta de mantenerla
- AND con el dev-lead de acuerdo, `steering/operations.md` la conserva con `sdd-end-patch`

#### ADDED — Los enlaces relativos de lo que la v3.0.0 mueve siguen apuntando a su sitio

- GIVEN un `roadmap.md` 2.x cuya fila enlaza `[walkthrough](specs/x/walkthrough.md)`, un `changelog.md` que enlaza `[ref](specs/x/walkthrough.md)` y un `mission.md` que cita `[no es enlace](decisions/0001.md)` dentro de código
- WHEN se aplica la v3.0.0 y el dev-lead aprueba las tablas
- THEN `ROADMAP.md` y `CHANGELOG.md`, en la raíz, enlazan `.docs/sdd/specs/x/walkthrough.md`
- AND el texto dentro de código de `PRODUCT.md` no cambia

#### ADDED — La v3.0.0 decide lo publicado por la etiqueta de la última release

- GIVEN «Releases cerradas» hasta la 2.3.0, `changelog.md` hasta la 2.3.4 con su etiqueta `v2.3.4`, el patch 0130 cuyo `patch.md` entró en un commit que la etiqueta `v2.3.4` contiene, el patch 0164 cuyo `patch.md` entró en `develop` en un commit que ninguna etiqueta contiene, y la 0128, cuya fila entró antes de la 2.3.0 y cuyo `walkthrough.md` ninguna etiqueta contiene
- WHEN se aplica la v3.0.0 y el dev-lead aprueba la tabla
- THEN el 0130 no está en `ROADMAP.md`, y el 0164 y la 0128 están en Now con `✅`

#### ADDED — La v3.0.0 reconoce la release en preparación por el prefijo de sus filas

- GIVEN «Próximo» sin `## Release <N>`, con la 0040 «**Release 3.0.0**. …» en `✅`, la 0041 «**Release 3.0.0** (dev-lead, …).» en `⏳`, la 0042 sin prefijo en `✅` que ninguna etiqueta contiene, la 0043 sin prefijo en `⏳`, y en «Patches» otra fila 0040
- WHEN se aplica la v3.0.0 y el dev-lead aprueba la tabla
- THEN Now se titula `## Now — 3.0.0 · en preparación` y tiene la 0040 una sola vez, la 0041 y la 0042; Next tiene la 0043

#### ADDED — La v3.0.0 conserva los ids del Backlog

- GIVEN un «Backlog» con la 0050 y con una fila sin id, y una fila sin id en «Próximo» con estado `🔄 en curso`, en un proyecto en modo `sequence`
- WHEN se aplica la v3.0.0 y el dev-lead aprueba la tabla
- THEN Later tiene la 0050 con su id, y la fila sin id del Backlog con uno de la reserva
- AND la tabla pregunta qué estado lleva en Later la fila `🔄`, que Later no admite

## Topes de palabras

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `constitution.md` → `steering/` | 2.250 / 2.250 | 0 | el mismo en la ruta nueva · sin cambio |
| `architecture.md` → `steering/` | 2.252 / 2.252 | 0 | 2.252 + lo que recibe de `tech-stack.md` (`split(/\s+/)` de «Contenido y build», «Distribución» y «Referencias de vigilancia» → 2.590, menos lo que fija un manifest: sin medir, y al ✋: decisión 6) |
| `mission.md` → `PRODUCT.md` | 1.808 / 1.808 | 0 | lo que mida con los títulos de la plantilla, medido en el ensayo de la primera página y escrito en una enmienda antes de aplicarla (sin medir, y al ✋: decisión 7) |
| `tech-stack.md` → `steering/operations.md` | 23.166 / 23.169 | 3 | 23.169 − lo que pasa a `architecture.md` + los campos nuevos de `## Testing` y las dos notas de la decisión 10, medido igual (sin medir, y al ✋: decisiones 6 y 10) |

## Previsión de coste

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| RED | `v5` × 2: `SCENARIOS="v1" N=2 node tests/headless/battery.mjs plan tests/batteries/sdd-upgrade/battery.md` → `suma: 2 sujetos · coste previsto: 0.95 $`, a precio de `v1` porque `v5` aún no existe | 0,95 |
| GREEN | `v5` × 2 y `v1` × 2: la misma línea, dos veces | 1,90 |
| Una tanda de REFACTOR | 0: las frases son la forma mínima | 0 |
| Controles | 0: el RED corre con la migración de hoy | 0 |
| Medición tras la revisión final | `v5` × 2 tras la review de la enmienda (`green2`) y `v5` × 2 tras la revisión final (`green3`): la misma línea, dos veces | 1,90 |
| Suma | 10 sujetos | 4,75 |

`v2x-release` es más grande que `v2x`, y un sujeto de `v5` puede costar más que la media de `v1`: si lo gastado pasa de 3,80 $, se para y se pregunta. Enmienda del 2026-11-10: con el «dale caña» del dev-lead, la Suma pasa a 10 sujetos; lo medido va a ~5,80 $.

## Enmiendas

- 2026-11-10, en `unattended` (dev-lead: «si encuentras una enmienda haz una review opus y acepta el resultado»; la review opus dio 5 Importantes y 3 Menores, todos aceptados):
  1. **Topes medidos** tras los pasos 1 y 2, con `split(/\s+/)`: `PRODUCT.md` 1.799 (de 1.808: cambian los títulos); `steering/constitution.md` 2.250, sin cambio; `steering/architecture.md` 4.877 = 2.252 + 1.467 («Contenido y build») + 704 («Distribución») + 419 («Referencias de vigilancia») + 35 (la fila de `debt.md` en su tabla de documentos, decisión 8); `steering/operations.md` 20.785 = 23.166 medido − 2.590 + 115 (`## Testing`: los campos nuevos y la nota del gate por partes) + 77 (la nota de la batería, en «Cómo se testean las skills») + 18 (`## Comandos`, nueva) − 1 (el título). «Entorno de trabajo del equipo» y «Aprendizajes por task» pasan idénticas. `anchorBudgets` lleva esas cifras.
  2. **Regla «Tecnologías»**: «Herramientas del repo» repetía las versiones de `.prototools`; pasa a «`.prototools` fija las versiones de node, pnpm y moon». `--include-relations`: la primera página propuso no añadirlo, aprobado con ella.
  3. **Paso 5 en este repo, un hueco más de la migración**: también nombraría como instrucción una medición fechada («2 de 2 sujetos de `sdd-end-patch` pararon…»). Arreglo en `v3.0.0.md`, como los de la decisión 2: una línea que registra una medición o un hecho fechado va a la tabla con gate del paso 5, junto a las de `capabilities/`, y la «Verification» admite las líneas que el dev-lead mantiene. Fila `V20` en `v5`, medida con un GREEN más de `v5` × 2 (la fila «Medición tras la revisión final»): la campaña pasa de la Suma de 3,80 $ con el «dale caña» del dev-lead.
  4. **La tabla del paso 5, resuelta por delegación** (decisión 3 no la llevaba a ninguna página): se mantienen las líneas de `capabilities/` (`archive.md:80,266`, `migration.md:142,265,268,269,351`), que son datos de escenarios, y las mediciones fechadas de `steering/architecture.md:55,60`, `steering/operations.md:96,124,232,249,258,305` y `steering/debt.md:18`; `debt.md:9` cita la ruta `skills/sdd-end-feature/`, que va al informe.
  5. **Instrucciones obsoletas**, no mediciones: `steering/operations.md:248` (un escenario que mide el paso 7 de `sdd-start-feature`) y `:307` (el ledger del paso 6 de `sdd-start-feature`, con superpowers) apuntan a una skill y un paso que no existen; renombrarlas a `sdd-propose` falsearía el texto. Van al informe y al ticket como instrucciones que hay que reescribir contra el kit 3.0.0, en la 0152, que relee los documentos.
  6. **Revisión final** (eje Spec, 6 Importantes y 3 Menores, todos aceptados): la migración arregla también el paso 4 (`CHANGELOG.md` ya no se excluye de los enlaces a documentos movidos) y aclara la propuesta del paso 5 (solo se mantienen las líneas donde el nombre viejo es un dato; en un escenario de capacidad que no lo es, se reemplaza); el molde gana la 0029, publicada en `v1.2.0`, para la mitad «sale» de lo publicado; la previsión gana otra `v5` × 2 (`green3`). La «Verification» del paso 5 en este repo devuelve además `operations.md:248,307` y `debt.md:9`, que van al informe: desvío anotado en el walkthrough.
  7. **El fichero de la spec**: el commit de apertura pegó una copia de la versión anterior dentro de la fila RED de «Previsión de coste» (un `$` del texto de reemplazo del script); fila rehecha.

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-11-10 | aprobada («1») |
