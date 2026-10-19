---
id: 20261019-142606-feature-0199-v3-migration-texts
feature: 0199
parent: 0197
proposal: 0131
title: Migración v3.0.0 — textos, reglas del proyecto y marcador
mode: full
profile: delegate
status: approved
created: 2026-10-19
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-10-19
---

# Spec — Migración v3.0.0: textos, reglas del proyecto y marcador

🦆 Tras migrar a la 3.0.0, un proyecto ya no tiene textos que nombren skills que no existen: «cierra con `sdd-end-feature`» de su `CLAUDE.md` pasa a `sdd-archive`, y `/sdd-consult` de sus comandos, a `sdd-explore`. Su `estimation.md` gana las dos reglas nuevas del método, y la ruta `` `.docs/sdd/roadmap.md` `` escrita entre backticks pasa a `ROADMAP.md`. Al final, el agente enseña una tabla con las reglas del proyecto que ya fija el kit (como «el id se elige a mano»), con la ruta del kit que las cubre, y quita solo las que apruebas. El marcador lo escribe `sdd upgrade --mark 3.0.0`, y la revisión de reglas va después, en su propio commit: si nadie la responde, el proyecto sube de versión igual.

## Capacidades

- Modificadas: `migration` — cinco requisitos nuevos de la v3.0.0 (nombres de skills, estimación, rutas entre backticks, revisión de reglas y lo que deja un paso pendiente) y la «Verificación» de los nombres de la v2.0.0, que pasa a `git grep`.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: ninguna — señales: MODIFIED (un requisito de `migration`) · tamaño: ~170 líneas en 7 ficheros
- Mínimo razonable: ninguna — deja sin segunda lectura los literales de los pasos nuevos; los mide la batería (RED/GREEN) y la revisión final en tres ejes
```

1. **Skills renombradas, además de las dos de la petición**: `sdd-consult` → `sdd-explore` y `sdd-init-greenfield` y `sdd-init-brownfield` → `sdd-init`, junto a `sdd-end-feature` y `sdd-end-patch` → `sdd-archive`. Son las otras skills de la 2.3.4 que la 3.0.0 retira. El changelog de la 0161 dice que la migración avisa de `/sdd-consult`, y la fila de deuda l.269 dice «skills que la 3.0.0 renombra o retira» (sección 1, «¿va bien?» → «si»).
2. **Dónde busca el paso de nombres**: `CLAUDE.md`, `AGENTS.md`, `.docs/sdd/*.md`, `.docs/sdd/steering/*.md`, `.docs/sdd/capabilities/*.md`, `.claude/skills/` y `.claude/commands/`. No toca `specs/`, `changes/`, `releases/`, `kit-feedback/`, `decisions/` ni `CHANGELOG.md`, que son historia. Va sin gate, porque solo sustituye un nombre, y el informe lista los ficheros.
3. **Estimación**: el paso sustituye sin gate solo si encuentra los literales de la plantilla 2.x:
   - «Los patches registran solo el tiempo real.»;
   - «El `walkthrough.md` registra el tiempo real. Si la desviación…».
   Con cualquier otro texto de método (reescrito, o «Método: horas por task.»), presenta en un gate su texto y el nuevo, y no toca nada sin el «sí».
4. **Rutas entre backticks**: el paso 4 corrige también las rutas viejas entre backticks (`` `.docs/sdd/<doc>.md` ``) en `CLAUDE.md`, `AGENTS.md` y `README.md`, y solo ahí.
5. **Búsquedas con `git grep … --untracked`**: es como ve ficheros sin commitear de `.claude/` y no falla si falta una ruta. Ningún paso nuevo usa `Select-String`.
6. **Revisión de reglas**:
   - **Cuándo**: tras el commit de la versión, con su propio commit `chore(sdd): reglas del proyecto que ya cubre el kit`. Pendiente no frena el marcador: es limpieza, y frenarlo dejaría sin subir de versión a un proyecto sin dev-lead (sección 2, «ok»).
   - **Dónde mira**: `CLAUDE.md`, `AGENTS.md`, `PRODUCT.md` y `.docs/sdd/steering/*.md`, no las capacidades.
   - **La tabla**: una fila por regla con columnas «Regla del proyecto · Dónde (fichero:línea) · Kit (ruta del plugin) · Choca o repite · Propuesta (quitar · dejar · reescribir)».
   - **Sin ruta no hay fila**: una regla sin ruta del kit que la cubra no entra.
   - **Sin nada que listar**: el paso se salta y lo dice.
7. **Dónde vive la revisión de reglas**: es el último paso de `v3.0.0.md`, y «Writing a new migration» de `sdd-upgrade` exige ese paso a toda migración nueva. No va como paso del procedimiento de `SKILL.md`: así se lee en la migración que se aplica, como los demás.
8. **«Writing a new migration» gana tres reglas**: el paso final de reglas; el paso que actualiza la copia del proyecto cuando la release cambia una regla que una plantilla copió (salda la fila l.174 en su parte de migración); y ninguna ruta opcional a `Select-String` (salda la fila l.308).
9. **La parte de `sdd-propose` de la fila l.174 no entra**: «el paso del plan mete en el Scope la plantilla que copia la regla» no lo pide el prompt. La fila pasa a `parcial` con eso como lo que queda.
10. **`v2.0.0.md`**: su línea de «Verificación» de los nombres pasa de `Select-String … -ErrorAction SilentlyContinue` a `git grep -nE 'sdd-(start|end)-task' -- CLAUDE.md AGENTS.md ':(glob).docs/sdd/*.md' ':(glob).docs/sdd/capabilities/*.md' ':!.docs/sdd/changelog.md' ':!.docs/sdd/client-changelog.md' ':!.docs/sdd/roadmap.md'`. Es la que daba falso verde sin `AGENTS.md`.
11. **Los seis menores de la re-revisión de la 0197**, en `v3.0.0.md`:
    1. El predicado del paso 4 incluye el paso 3.
    2. Si el paso 3 queda pendiente tras aplicar el 2, el informe nombra las «Decisiones abiertas» con `git show <sha>:.docs/sdd/tech-stack.md`.
    3. Un enlace sin carpeta entre hermanos de `steering/` no cuenta como roto, ni en el paso 4 ni en la «Verificación».
    4. Toda fila `parcial` va a su sección, anterior o posterior a la última release.
    5. El diff del log sale antes del gate con `sdd estimation log --root "<raíz>" --out <tmp>/estimation-log.md`, comparado con el actual; tras el «sí», se regenera en su sitio.
    6. Un enlace relativo de la «Evidencia» que pasa a `steering/debt.md` gana `../`.
12. **Sin el dev-lead**: el paso de nombres y la sustitución literal de la estimación corren, porque van sin gate, y quedan en el working tree sin commit, como cualquier paso aplicado con un gate pendiente. La revisión de reglas queda pendiente con su tabla en el informe.
13. **Molde v2x**, cambios:
    - `CLAUDE.md` gana «Cierra cada feature con `sdd-end-feature`.» y «El roadmap vive en `.docs/sdd/roadmap.md`.»;
    - nuevo `.claude/commands/pregunta.md` con «Usa `/sdd-consult` para responder.»;
    - `estimation.md` pasa a tener el método de la plantilla 2.x;
    - la constitution gana «**Ids**: el id de una feature se elige a mano, el siguiente libre del roadmap.»;
    - una deuda gana evidencia relativa (`field-reports/…`).
14. **Rúbrica**: `v1` gana V7 (nombres), V8 (estimación), V9 (backticks), V10 (tabla de reglas con la regla de ids y su ruta) y V11 (marcador 3.0.0 y commit de la versión antes del de reglas). `v2` gana V12: la tabla de reglas queda pendiente y la constitution no cambia.
15. **Previsión de sujetos: 11, ~2,5 $**:
    - RED `v1` ×2;
    - GREEN `v1` ×2 y `v2` ×1;
    - REFACTOR n = 2 por cada regla nueva con literal: nombres, estimación y tabla de reglas.
    Antes del primer RED, `DRY_RUN=1` del molde. Paro antes del sujeto 12 (sección 3, «ok»).
16. **Topes**: `sdd-upgrade` `SKILL.md` de 900 a 980, y el kit de 87500 a 87600 (tabla de abajo).

- Política de modelos: ningún revisor de la spec · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sujetos de la batería por tandas, hasta `control.maxParallelAgents` (3) — al aprobar la spec, esta línea es la confirmación de paralelizar.
- Delta probado con `sdd capability merge` sobre una copia de `capabilities/`: 5 añadidos y 1 sustituido, sin rechazos; la copia da `Capacidades válidas: 20`.

### Decisiones tomadas con el dev-lead

- Las del prompt de arranque (2026-10-19): no migra sin preguntar ni en bloque, y pregunta antes de borrar o reestructurar; los puntos 2 y 3 del método en `estimation.md`; un paso final con gate de reglas (antiguo B6); `sdd-end-feature` y `sdd-end-patch` → `sdd-archive` en `CLAUDE.md`, `AGENTS.md` y `.docs/sdd/*.md`, mirando también `.claude/skills` y `.claude/commands`; marcador con `sdd upgrade --mark 3.0.0`; punteros en code span de `CLAUDE.md`, `AGENTS.md` y `README.md`; delta con REMOVED + ADDED y probado con `sdd capability merge`; REFACTOR n = 2 por regla con literal, `DRY_RUN=1` por molde nuevo y parar antes de pasar la previsión; saldar las filas de destino 0199; perfil `delegate`; `sdd merge --push`.
- Diseño por secciones: sección 1 «si», sección 2 «ok», sección 3 «ok» (2026-10-19).

## Intent

Hoy, un proyecto migrado con el kit de `develop` queda marcado 3.0.0 con textos que nombran skills retiradas, con un `estimation.md` sin las reglas de la 0188, con punteros entre backticks a rutas que ya no existen y con reglas propias que el kit ya cubre, a veces de otra forma (11 en la primera migración a la 2.0.0 de un proyecto del equipo). El éxito: tras «actualízame al kit», `git grep` de los nombres viejos no devuelve nada en los documentos vivos, el método de estimación es el de la plantilla, ningún puntero vivo apunta a una ruta 2.x, y el dev-lead ha visto la tabla de reglas que se repiten o chocan, con la ruta del kit. Fracaso, aunque funcione: tocar la historia (`specs/`, ADR, `CHANGELOG.md`), borrar una regla sin el «sí», o que una tabla sin responder deje el proyecto sin marcador.

## Scope

- Entra:
  - `skills/sdd-upgrade/references/migrations/v3.0.0.md`: pasos 5 (nombres de skills), 6 (estimación), 7 (marcador) y 8 (revisión de reglas); el paso 4 con los backticks; los seis menores; `**Escribe**:` y la «Verificación».
  - `skills/sdd-upgrade/SKILL.md`: las tres reglas de «Writing a new migration».
  - `skills/sdd-upgrade/references/migrations/v2.0.0.md`: la línea de «Verificación» de los nombres.
  - `tests/batteries/sdd-upgrade/`: molde, rúbrica y `subject.sh`, que vuelca los ficheros nuevos.
  - `tests/WordBudget.Tests.ps1`: los topes.
  - `.docs/sdd/capabilities/migration.md`: vía delta, al cerrar.
  - El roadmap: la 0199 a ✅; las filas l.269 y l.308, saldadas; la l.174, `parcial`.
- No entra:
  - la parte de `sdd-propose` de la fila l.174 (decisión 9);
  - migrar este repo, que es la 0198;
  - cambiar la CLI: `sdd upgrade --mark` ya existe;
  - un Pester del texto de `v3.0.0.md` (menor diferido de la 0197);
  - que `sdd-upgrade` frene el marcador con una «Verificación» en rojo (conducta previa, fuera).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| La «Verificación» de nombres de `v2.0.0.md` con `Select-String … -ErrorAction SilentlyContinue` | `skills/sdd-upgrade/references/migrations/v2.0.0.md` (Verificación); `capabilities/migration.md`, «La migración a v2.0.0 cambia los nombres de las skills de feature», último AND | delta, `MODIFIED` |
| Predicado del paso 4, «Si el paso 1 o el 2 movieron algo» | `v3.0.0.md` paso 4 y su texto de «Cómo se aplica cada paso» («el 4, solo si el 1 o el 2…») | Scope (decisión 11) |
| Frase «Las menciones a nombres de skills no son de este paso» | `v3.0.0.md` paso 4 | Scope: pasa a decir que son del paso 5 |
| Fila de deuda «parcial → la sección de su Destino» sin decir «anterior o posterior» | `v3.0.0.md` paso 3 | Scope (decisión 11) |

- Filas que implementa: 0199 → `.docs/sdd/roadmap.md` (fila, y su mención en la 0198 «tras 0199») y la frase «Los textos, el gate de reglas y el marcador llegan en la 0199» de `.docs/sdd/changelog.md`, que es historia y se queda · l.174, l.269 y l.308 → `.docs/sdd/roadmap.md`, saldadas por el cierre (la l.174 `parcial`) · comprobado con `git grep -n 0199 -- skills .docs/sdd/capabilities .docs/sdd/*.md CLAUDE.md README.md`

## Approach

Cuatro pasos nuevos en `v3.0.0.md`, tras los cuatro de la 0197 y en este orden: nombres de skills (5), estimación (6), marcador (7) y revisión de reglas (8). Los pasos 5 y 6 leen lo que dejó el paso 1 (`steering/`). El 7 es `sdd upgrade --mark 3.0.0` tras la «Verificación», con el commit de la versión. El 8 va después, con su propio commit, y no bloquea. Cada búsqueda es un `git grep … --untracked`, y los menores de la 0197 se corrigen en el texto existente. La prueba es la batería de `sdd-upgrade` con el molde v2x ampliado.

## Dónde se prueba

- Nombres de skills en `CLAUDE.md` y `.claude/commands/`: batería `sdd-upgrade`, escenario `v1`, por el volcado de `CLAUDE.md` y `.claude/commands/pregunta.md` (V7).
- Estimación: `v1`, con el volcado de `steering/estimation.md` (V8).
- Backticks: `v1`, con `CLAUDE.md` (V9).
- Tabla de reglas con la ruta del kit, y lo que el dev-lead aprueba: `v1`, por la conversación con la persona y la constitution final (V10).
- Marcador y orden de commits: `v1`, con `sdd-kit.json` y `git log` (V11).
- Sin el dev-lead, la revisión de reglas queda pendiente: `v2` (V12).
- La «Verificación» de `v2.0.0.md` sin `AGENTS.md`: ejecutando la línea `git grep` en una carpeta temporal sin `AGENTS.md`, en el RED de la task.
- Los seis menores: por lectura en la revisión final. Los casos no están en el molde (un paso 3 pendiente con el 2 aprobado, hermanos de `steering/`), y montar un escenario para cada uno pasaría la previsión de sujetos.
- Topes y paridad: `kit:test` (`WordBudget`, `MigrationInitParity`).

## Términos y ADR

- Términos resueltos: ninguno.
- ADR candidatas: ninguna.

## Delta de comportamiento

### Capacidad: `migration`

**ADDED — La migración a v3.0.0 cambia los nombres de las skills retiradas**
- GIVEN un proyecto en 2.3.4 cuyo `CLAUDE.md` dice «Cierra cada feature con `sdd-end-feature`.», con `.claude/commands/pregunta.md` que dice «Usa `/sdd-consult` para responder.» y con una carpeta de `specs/` cuyo `walkthrough.md` cita `sdd-end-feature`
- WHEN se aplica la v3.0.0
- THEN `CLAUDE.md` dice «Cierra cada feature con `sdd-archive`.» y `pregunta.md` dice «Usa `/sdd-explore` para responder.», sin gate
- AND `sdd-end-patch` pasa a `sdd-archive`, y `sdd-init-greenfield` y `sdd-init-brownfield` a `sdd-init`, en `CLAUDE.md`, `AGENTS.md`, `.docs/sdd/*.md`, `.docs/sdd/steering/*.md`, `.docs/sdd/capabilities/*.md`, `.claude/skills/` y `.claude/commands/`
- AND el `walkthrough.md` de `specs/` sigue citando `sdd-end-feature`, y tampoco cambian `CHANGELOG.md`, `decisions/`, `releases/` ni `kit-feedback/`
- AND el informe lista los ficheros cambiados; sin ninguna mención, el paso se salta y lo dice
- AND la «Verificación», con `git grep --untracked -nE 'sdd-(end-feature|end-patch|consult|init-greenfield|init-brownfield)'` sobre esas rutas (las carpetas con `:(glob)`), no devuelve nada, también sin `AGENTS.md` ni `.claude/`

**ADDED — La migración a v3.0.0 lleva el método nuevo al `estimation.md` del proyecto**
- GIVEN un proyecto cuyo `steering/estimation.md` tiene las líneas de la plantilla 2.x «El `walkthrough.md` registra el tiempo real. Si la desviación supera el ±30 %, …» y «Los patches registran solo el tiempo real.»
- WHEN se aplica la v3.0.0
- THEN la primera gana, tras «registra el tiempo real.», «Cuenta desde el arranque de la sesión que abre el trabajo, con la investigación previa; una espera a una respuesta del dev-lead va aparte, con su duración.», y la segunda pasa a ser la línea de patches de `estimation-template.md` con `(post hoc)`, sin gate
- AND las «Notas de calibración» del proyecto no cambian
- AND con un método que no tiene esos literales («Método: horas por task.»), el agente presenta el texto del proyecto y las dos líneas nuevas, y no cambia el fichero sin el «sí»
- AND sin `estimation.md`, el paso se salta y lo dice

**ADDED — La migración a v3.0.0 corrige las rutas viejas escritas entre backticks**
- GIVEN un proyecto cuyo `CLAUDE.md` dice «El roadmap vive en `.docs/sdd/roadmap.md`.» y cuyo `README.md` cita `` `.docs/sdd/constitution.md` ``
- WHEN se aplica la v3.0.0 y el dev-lead aprueba las tablas de los pasos 1 y 3
- THEN `CLAUDE.md` dice «El roadmap vive en `ROADMAP.md`.» y `README.md` cita `` `.docs/sdd/steering/constitution.md` ``
- AND solo cambian las rutas entre backticks de `CLAUDE.md`, `AGENTS.md` y `README.md` cuyo documento se movió en un paso aprobado

**ADDED — La migración a v3.0.0 cierra con el marcador y después revisa las reglas del proyecto**
- GIVEN un proyecto que migra a v3.0.0 con el dev-lead presente, cuya `steering/constitution.md` dice «**Ids**: el id de una feature se elige a mano, el siguiente libre del roadmap.»
- WHEN se aplican y aprueban los pasos de la v3.0.0
- THEN `sdd-kit.json` queda con `version` `3.0.0`, escrito con `sdd upgrade --mark 3.0.0`, y hay un commit `chore(sdd): migrar al kit v3.0.0`
- AND después el agente presenta una tabla con cada regla de `CLAUDE.md`, `AGENTS.md`, `PRODUCT.md` y `steering/` que repite o contradice el kit instalado, con su fichero y línea, la ruta del kit que la cubre y su propuesta; la regla de los ids sale con la ruta de `skills/sdd-start-feature/references/nombrado.md`
- AND solo cambia lo que el dev-lead aprueba, en un commit `chore(sdd): reglas del proyecto que ya cubre el kit`
- AND una regla sin una ruta del kit que la cubra no sale en la tabla; sin ninguna, el paso se salta y lo dice
- AND sin el dev-lead, la tabla va al informe como pendiente, con cómo reanudarla, y ni la constitution ni el marcador dependen de ella

**ADDED — La migración a v3.0.0 enseña lo que un gate deja pendiente o regenera**
- GIVEN un proyecto cuyo `tech-stack.md` tiene en «Decisiones abiertas» «¿avisos por correo?», con el paso 2 aprobado y el paso 3 rechazado
- WHEN acaba la migración
- THEN el informe nombra «¿avisos por correo?» junto al paso 3 pendiente, con `git show <sha>:.docs/sdd/tech-stack.md`
- AND la `estimation-log.md` regenerada se enseña antes del gate del paso 1, generada en una carpeta temporal con `sdd estimation log --out`, y la del proyecto solo se regenera tras el «sí»

**MODIFIED — La migración a v2.0.0 cambia los nombres de las skills de feature** (antes: «la verificación … con `Select-String …` … no devuelve nada»)
- GIVEN un proyecto en el kit v1.1.0 cuyo `CLAUDE.md` dice «arranca el trabajo con `sdd-start-task`», cuyo `.docs/sdd/constitution.md` cita `sdd-end-task`, y con `specs/20260910-080000-task-0012-login/spec.md`, que también cita `sdd-end-task`
- WHEN se migra al kit v2.0.0
- THEN `CLAUDE.md` dice «arranca el trabajo con `sdd-start-feature`» y `constitution.md` cita `sdd-end-feature`, sin gate
- AND `specs/20260910-080000-task-0012-login/spec.md` sigue citando `sdd-end-task`, y la carpeta no se renombra
- AND el informe lista los ficheros cambiados; sin ninguna mención, el paso se salta y lo dice
- REMOVED AND la verificación de la migración, con `Select-String -Path CLAUDE.md, AGENTS.md, .docs/sdd/*.md, .docs/sdd/capabilities/*.md -Exclude changelog.md, client-changelog.md, roadmap.md -Pattern 'sdd-(start|end)-task' -ErrorAction SilentlyContinue` (sin `AGENTS.md`, esa ruta no cuenta), no devuelve nada
- AND la verificación de la migración, con `git grep -nE 'sdd-(start|end)-task' -- CLAUDE.md AGENTS.md ':(glob).docs/sdd/*.md' ':(glob).docs/sdd/capabilities/*.md' ':!.docs/sdd/changelog.md' ':!.docs/sdd/client-changelog.md' ':!.docs/sdd/roadmap.md'`, no devuelve nada, también en un proyecto sin `AGENTS.md`

## Topes de palabras

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `skills/sdd-upgrade/SKILL.md` (SkillMd y Total) | 850 / 900 | 50 | 980 (850 + ~110 previstas + 20) |
| Kit entero | 87391 / 87500 | 109 | 87600 (87391 + ~110 previstas + ~100 para la pasada de fix) |

## Enmiendas

- 2026-10-19 — el `git grep` de la decisión 10, del MODIFIED de la v2.0.0 y de la «Verificación» de nombres lleva `:(glob)` en las carpetas y `--untracked` antes del patrón — sin `:(glob)`, el `*` de git entra en `specs/` y la historia da un falso rojo; con `--untracked` tras el patrón, git sale con 128 (Task 2, comprobado en una carpeta temporal) — sin aprobar: corrige el literal sin cambiar la conducta que el THEN pide

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-10-19 | aprobada (opción «Apruebo») |
