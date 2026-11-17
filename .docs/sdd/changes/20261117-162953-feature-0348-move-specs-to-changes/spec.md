---
id: 20261117-162953-feature-0348-move-specs-to-changes
feature: 0348
title: La 3.0.1 mueve specs/ a changes/
mode: full
profile: delegate
status: approved
created: 2026-11-17
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-11-17
---

# Spec — La 3.0.1 mueve `specs/` a `changes/`

🦆 Hoy un proyecto en la 3.0.0 tiene dos carpetas de artefactos: `specs/` con lo viejo y `changes/` con lo nuevo. El agente crea la carpeta nueva junto a la vecina que ve, y así la 0341, la 0342 y el proyecto de templates nacieron en la vieja. Con la 3.0.1, «actualízame al kit» mueve todas las carpetas de `specs/` a `changes/` en un commit, con dos comandos que se copian y pegan. En otro commit reescribe los enlaces de los `.md`: el roadmap que apuntaba a `.docs/sdd/specs/2026…-feature-0079-b/walkthrough.md` pasa a apuntar a `.docs/sdd/changes/2026…-feature-0079-b/walkthrough.md`. El log de estimación sigue contando cada carpeta en la release en que nació, y este repo se migra con el mismo paso y sube a 3.0.1.

Validación: agente — es una migración de ficheros y enlaces. Lo que vería el dev-lead lo mide el agente con `git grep`, `sdd roadmap check`, `sdd estimation log` y la suite: la carpeta movida, los enlaces que resuelven, la tabla de releases igual que antes y el pre-commit en verde. Además, la validación de este repo es en campo (`validation.mode: field`).

## Capacidades

- Modificadas: `migration` — requisitos nuevos de la migración a la 3.0.1
- Modificadas: `estimation` — «El log agrupa por release»: una carpeta movida cuenta desde el commit que la creó

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: dos revisores — señales: datos o migración (mueve todas las carpetas de artefactos del proyecto), contrato público (la estructura de `.docs/sdd/` que leen la CLI y las skills), zona sin explorar (los enlaces de `tests/*.md`, `CHANGELOG.md` y `field-reports/`) · tamaño: ~150 líneas escritas en 14 ficheros, más el reemplazo mecánico en 512 `.md`
- Dominio (sonnet): si el THEN del requisito nuevo cubre el proyecto con carpetas en `specs/` y sin ellas, si «sin gate» choca con el paso 3 de `sdd-upgrade` y si la regla de copia de evidencia deja fuera algo que el dev-lead quería reescrito (señal: migración)
- Técnica (sonnet): si los dos comandos `node -e` corren igual en pwsh y en bash, si `git grep -lz` falla limpio sin coincidencias, y si `statistics.test.ts`, `battery.mjs` y `upstream.json` son todo el código que lee `specs/` de este repo (señal: contrato público)
- Mínimo razonable: un revisor técnico — deja sin mirar si el alcance de la reescritura es el que el dev-lead quería
```

1. **Enfoque: A, dos comandos `node -e` en el texto de la migración**, frente a B (un verbo `sdd upgrade --move-specs`) y C (prosa que el agente aplica carpeta a carpeta). Ver Approach.
2. **Sin gate.** Los pasos de mover y reescribir se marcan «no gate»: el «actualízame al kit» basta y el dev-lead los revisa en el diff, como pide «lo más mecánico posible». El paso 3 de `sdd-upgrade` ya admite la marca. `sdd-upgrade/SKILL.md` deja de prohibirlo, sin crecer (977 de 980 palabras; la edición resta 7):
   - En el Overview, «you never move content in bulk, and you ask before deleting or restructuring anything» pasa a «you ask before deleting, moving or restructuring anything a step doesn't mark «no gate»».
   - El paso 5 pierde «and moving content in bulk (the `specs/` folders stay where they are)».
   - En el paso 5, «touching historical specs or walkthroughs» pasa a «rewriting historical specs or walkthroughs beyond a step's paths».
3b. **⚠ El tope de longitud de ruta sube de 140 a 142 caracteres** (`cli/test/kit/path-length.test.ts`), y es tuya: cambia un límite que protege a quien clona el plugin en Windows. `changes` tiene 2 letras más que `specs`, y en el clon migrado 26 rutas de copias de evidencia quedan en 140 o 141, en 6 carpetas (13 de la task 0008). Alternativas: renombrar dentro de la evidencia, que contradice «se mueven tal cual», o acortar el nombre de esas 6 carpetas, que rompe sus enlaces e ids. Con 142, el margen para la carpeta base del clon baja de ~120 a ~118 caracteres; el comentario del test lo dice.
3. **Qué es copia de evidencia**: todo fichero dentro de una subcarpeta de `changes/<carpeta>/` (`red/`, `green/`, `c-arc/`…). Se mueve y su texto no cambia, aunque un enlace relativo suyo deje de resolver: el dev-lead decidió «se mueven tal cual». Los `.md` de primer nivel de cada carpeta (`spec.md`, `plan.md`, `walkthrough.md`…) sí se reescriben.
4. **Qué se reescribe**:
   - En todo `.md` versionado, `.docs/sdd/specs/` pasa a `.docs/sdd/changes/`.
   - En los `.md` de dentro de `.docs/sdd/`, `../specs/` pasa a `../changes/` a cualquier profundidad (`../../specs/` de `releases/` incluido).
   - En los `.md` sueltos de `.docs/sdd/` (`changelog-cliente.md`), `](specs/` pasa a `](changes/`.
   - Fuera de `.docs/sdd/`, `../specs/` no se toca: en un proyecto puede ser otra carpeta.

   Solo cambia la cadena de la ruta, sea un enlace o una ruta citada entre comillas invertidas; el resto del texto no se toca. En este repo, en `decisions/`, `releases/` y `CHANGELOG.md` todas las apariciones son enlaces (`git grep` sin enlace: 0). En `field-reports/` hay unas 60 rutas citadas en «Fuente:» y «Dónde en el kit»: se reescriben igual que los enlaces, porque son la ruta y el ticket no cambia de sentido. Así lee «solo la ruta del enlace» del dev-lead una ruta citada, y una ADR inmutable conserva su texto. Los `tests/*.md` (registros de campaña) entran igual. Fuera de los enlaces, la reescritura toca prosa que sigue siendo cierta o que pasa a serlo:
   - `operations.md:149` (ningún `.sh` fuera de la evidencia) y `:187` (las exclusiones del paquete de revisión), que pasan a la carpeta correcta;
   - `operations.md:209`, un ejemplo histórico de ruta larga;
   - `cli.md:51` y `:264`, que la CLI cumple con las dos carpetas (`DIFF_PATHS` y `docs-claims` las excluyen).
5. **Lo que no se reescribe pero se lista**: código y JSON que nombran `.docs/sdd/specs/` (`git grep -n -F ".docs/sdd/specs/" -- ":(exclude)*.md"`). El informe lista cada uno, sin tocarlo.
6. **Para y no escribe el marcador**, en estos casos:
   - el árbol está sucio (`git status --short` del repo entero no vacío);
   - `specs/` tiene algo sin versionar o ignorado (`git ls-files -o -- .docs/sdd/specs`, con lo ignorado incluido) o una carpeta vacía: el comando los lista antes de mover nada;
   - hay una entrada del mismo nombre en `specs/` y en `changes/`: no mueve nada;
   - un `git mv` falla a mitad. Como antes de mover el árbol estaba limpio y todo lo de `specs/` versionado, el informe da `git reset --hard HEAD` para volver al punto de partida sin perder nada, y lo ejecuta el dev-lead.

   El informe dice qué falló y nombra cada entrada. Para reanudar: renombrar, versionar o borrar lo listado y volver a pedir «actualízame al kit». Con `specs/` sin entradas, el comando la borra y no hay commit de mover. Probado en el clon: `No se mueve nada; ya existen en changes/: 20260722-103807-task-0000-carril-rama-worktree`, exit 1, `git status` vacío.
7. **Dos commits.** El de mover (`chore(sdd): mover specs/ a changes/`) va solo, con renombrados al 100 %, para que `git log --follow` no se corte cuando la reescritura cambia el contenido de un `patch.md` corto. Después, reescribir y escribir el marcador en `chore(sdd): migrar al kit v3.0.1`. Probado en el clon: `git log --follow` de `patch-0000-grilling-reference/patch.md` da 3 commits.
8. **Este repo, fuera de la reescritura**, que lleva sus exclusiones en el segundo comando:
   - las migraciones publicadas (`skills/sdd-upgrade/references/migrations/`: una migración no se reescribe);
   - `dist/`, que regenera `moon run kit:build`;
   - las fixtures de las baterías (`tests/batteries/**`: sus moldes son proyectos 2.3.4 con su propio `specs/`);
   - la carpeta de esta feature.

   Tras el comando, con Edit inverso, cuatro líneas de capacidades que describen la lectura 2.x de la CLI, que sigue hasta la 4.0.0: `estimation.md:11`, `feature-ids.md:46` y `:48`, y `migration.md:398` (lo que hace la migración v3.0.0). La fila 0348 de `ROADMAP.md` y la entrada de la 3.0.1 de `CHANGELOG.md` se escriben después del comando, nombrando `specs/` sin el prefijo `.docs/sdd/`. El criterio de hecho del prompt se cumple fuera de esas zonas y de los requisitos nuevos de `migration`, que citan las rutas viejas para describir el paso. La verificación lista cada zona con su `git grep`.
9. **Código y datos de este repo.**
   - Leen `specs/` del propio repo y pasan a `changes/`: `cli/test/estimation/statistics.test.ts:201-202`, `tests/headless/battery.mjs:30` (`SPECS_ROOT`, de donde saca los precios de las campañas guardadas) y las seis notas de `upstream.json` que enlazan una spec (de ellas sale `THIRD_PARTY_NOTICES.md` en el build).
   - Ya leen las dos carpetas y no cambian: `cli/src/comments/verbs.ts:24`, `tests/upstream/check.ts:166`, `no-shell-scripts.test.ts` y `subject-output-privacy.slow.test.ts:222`.
   - Los tests que montan un proyecto con `specs/` prueban la lectura 2.x y se quedan.
   - `skills-3x-paths.test.ts` pierde de `ALLOWED` las entradas de `add-to-changelog/SKILL.md` y `coherence-pass.md`, que dejan de nombrar una ruta 2.x.
10. **`sdd estimation log` cuenta una carpeta movida desde su nacimiento.** `addedCommits` (`cli/src/estimation/releases.ts:40`) lee el commit que añadió cada fichero con `--no-renames`, carpeta a carpeta. Tras mover, todas nacen en el commit de la migración. RED en el clon: la tabla de releases pasa de 16 versiones (3.0.0 con 165 artefactos) a `| 3.0.0 | 1 |` y `| sin publicar | 313 |`. El arreglo hace un solo `git log` sobre `changes` y `specs` juntas, y gana el commit más viejo. `cli/src/roadmap/releases.ts:73` no cambia: su `ARTIFACT_LINK` solo casa enlaces que empiezan por `specs/` o `changes/` (el `roadmap.md` 2.x). Los de `ROADMAP.md` en la raíz empiezan por `.docs/sdd/` y van por fecha.
11. **Textos que dicen que `specs/` se queda**, todos sin crecer:
    - `add-to-changelog` pierde «(`.docs/sdd/specs/` for older ones)».
    - `coherence-pass.md` quita `.docs/sdd/specs/` de las carpetas de evidencia.
    - `CLAUDE.md:20`, `constitution.md:47` y `:73`, `architecture.md:92`, `sdd-templates/SKILL.md:73` («The `specs/` folders from before 3.0.0 are read and not moved») y las guías `greenfield.md:105` y `brownfield.md:60` dejan de nombrar `specs/` como carpeta viva.
    - En `CLAUDE.md`, «no se editan» de `field-reports/` pasa a «no se editan, salvo la ruta de un enlace que mueve una migración».
    - Las tres guías de `.docs/workflow/` suben su marcador a «kit v3.0.1», que `workflow-docs.test.ts` exige al subir `plugin.json`.
12. **Se quedan**: las skills que buscan en «`changes/` o `specs/`» (`sdd-end-release/SKILL.md:21`, `patch-lane.md:32`) y `roadmap-template.md` (2.x, solo la lee `v2.3.0.md`): un proyecto que aún no migró a la 3.0.1 sigue teniendo `specs/`, como la CLI.
13. **ADR 0036** sustituye a la 0034: repite su decisión con un cambio, «las carpetas de `specs/` se mueven a `changes/` con la migración a la 3.0.1». La 0034 pasa a `status: superseded by 0036`. Su consecuencia: la CLI sigue leyendo `specs/` hasta la 4.0.0.
14. **Reglas del proyecto**: el paso que pide `sdd-upgrade` (el paso 8 de `v3.0.0.md`) se salta si la v3.0.0 se aplicó en la misma sesión. En este repo también se salta: es el kit, y su `CLAUDE.md` lo mantiene cada feature.
15. **Reglas de la capacidad `migration`**: la «Regla ante conflicto» gana una frase: un paso «no gate» que choca con el estado del proyecto (árbol sucio, carpeta repetida, algo sin versionar) para sin escribir nada y lo dice. Los avisos de la sesión, los datos, los nombres y los límites no cambian: el mensaje de colisión es la salida de un paso y vive en su escenario.
16. **Sin campaña de sujetos**: lo que cambia en las skills es una ruta en tres frases, dos frases de `sdd-upgrade` y la migración nueva, que se prueba aplicándola, en un clon de este repo (hecho) y en este repo. No hay regla de conducta que medir con RED/GREEN. El arreglo de `addedCommits` va con test-first en `releases.slow.test.ts`.
17. **Delta en una copia**: `sdd capability merge` da 4 añadidos en `migration.md` y «sustituido «El log agrupa por release»» en `estimation.md`; `sdd capability check`: `Capacidades válidas: 23`. Tras la segunda ronda, además «regla «Regla ante conflicto» sustituida».
- Política de modelos: revisores de la spec, dos en sonnet, y la segunda ronda, uno en sonnet · revisión final: Spec opus+high, Código sonnet+high · ningún otro despacho en paralelo · hasta `control.maxParallelAgents` (3).

### Hallazgos de la review

- **Aceptado** — D1 (Crítico): el Overview y el paso 5 de `sdd-upgrade` siguen prohibiendo mover en bloque → decisión 2.
- **Aceptado** — D2 (Crítico): la evidencia con enlaces `../specs/` contradecía «sin cambiar» → decisión 3: se mueve tal cual aunque el enlace deje de resolver. El escenario lo afirma y el Intent lo excluye.
- **Aceptado** — D3: `tests/*.md` es evidencia fuera de la definición → decisión 4: solo cambia la ruta del enlace, como en `field-reports/`.
- **Aceptado** — D4: Intent frente a decisión 7, y `constitution.md:47` → Intent reformulado; `:47` en la decisión 11.
- **Aceptado** — D5 y T8: ADR y changelog → decisión 4, con la medida de que solo hay enlaces.
- **Aceptado** — D6 y T7: escenarios sin su GIVEN → cuatro requisitos con su propio GIVEN. `changes/` inexistente lo crea el comando (`mkdirSync`). El enlace sin prefijo se lista (decisión 5).
- **Rechazado** — D7: faltan las cinco reglas → la sección es opcional y solo con entradas que cambian. Ninguna cambia (decisión 15).
- **Aceptado** — D8: la revisión de reglas dos veces → decisión 14.
- **Aceptado** — D9: cómo reanudar tras parar → decisión 6.
- **Aceptado** — D10: `CLAUDE.md` dice que los tickets no se editan → decisión 11.
- **Aceptado** — T1 (Crítico): `--no-renames` en `addedCommits` → medido en el clon y arreglado (decisión 10, `MODIFIED` de `estimation`). `roadmap/releases.ts` comprobado: no le afecta.
- **Aceptado** — T2 (Crítico): `skills-3x-paths.test.ts` → decisión 9.
- **Aceptado** — T3 (Crítico): el comando no excluía las zonas de este repo → decisión 8: exclusiones en el comando de este repo, Edit inverso de cuatro líneas, y la fila y el changelog después.
- **Aceptado** — T4: `specs/` vacía quedaba en disco → `rmdirSync` tras comprobar que está vacía; probado en el clon (`specs-gone`).
- **Aceptado** — T5: fallos parciales → árbol limpio entero, mensaje y exit 1 por `git mv`, `maxBuffer: 1e9`, y el `catch` solo traga el exit 1 de `git grep`. Una entrada suelta (un fichero) en `specs/` se mueve igual, como su carpeta.
- **Aceptado** — T6: `--follow` con un solo commit → decisión 7, dos commits.
- **Aceptado** — T9: `dist/` → decisión 8, se reconstruye y se commitea.
- **Aceptado** — T10: la decisión 8 «es todo el código» → decisión 9, con lo que ya lee las dos.

Segunda ronda (un revisor, siete puntos):

- **Aceptado** — R1 (Crítico): `path-length.test.ts` → medido en el clon (26 rutas en 140-141) → decisión 3b, que es tuya.
- **Aceptado** — R2 (Crítico): fallo a mitad sin retroceso, y algo sin versionar en `specs/` → decisión 6: comprobación previa y `git reset --hard HEAD` como retroceso seguro.
- **Aceptado** — R3: `](specs/` en `.md` sueltos de `.docs/sdd/` → tercera regla del comando 2 (decisión 4).
- **Aceptado** — R4: `sdd-templates/SKILL.md:73` → decisión 11 y tabla.
- **Aceptado** — R5: «you ask before deleting or restructuring anything» → decisión 2.
- **Aceptado** — R6: prosa reescrita fuera de los enlaces → decisión 4, medida y listada. Corrige mi medida anterior: `field-reports/` tiene rutas citadas, no solo enlaces.
- **Aceptado** — R7: «Regla ante conflicto» → decisión 15 y entrada en el delta.
- **Aceptado** — R8: `specs/` sin entradas → decisión 6, sin commit de mover.
- **Aceptado** — R9: el comando de este repo, literal → lo escribe el plan, en el scratchpad, y se prueba en un clon nuevo antes de aplicarlo.
- **Aceptado** — R10: `THIRD_PARTY_NOTICES.md` y un `git grep` de `'specs'` → Scope y «Dónde se prueba».

### Decisiones tomadas con el dev-lead

- Mover, no bloquear carpetas nuevas en `specs/`, porque con dos carpetas el agente copia a la vecina — «en templates ya se estaba liando» (2026-11-17)
- Lo más mecánico posible y publicar la 3.0.1 hoy — «quería publicar 3.0.1 ya hoy con este sdd-upgrade» (2026-11-17)
- En `field-reports/` se reescribe solo la ruta del enlace; el texto del ticket no cambia (prompt de arranque, 2026-11-17)
- Las copias de evidencia RED/GREEN se mueven tal cual (prompt de arranque, 2026-11-17)
- Fuera de alcance: quitar la lectura de `specs/` de la CLI, hasta la 4.0.0; el aviso de inicio con un template sin inicializar, en la 0347 (prompt de arranque, 2026-11-17)
- Revisión de la spec: dos revisores en paralelo, los dos en Sonnet — opción «1» (2026-11-17)

## Intent

Con `specs/` y `changes/` vivas a la vez, el agente crea la carpeta de un cambio nuevo junto a la que ve. La 0341 y la 0342 nacieron en `specs/` con la regla de `changes/` ya en su base, y en el proyecto de templates se mezclaban. El éxito: tras «actualízame al kit» en un proyecto 3.0.0, `specs/` no existe y ningún `.md` vivo enlaza a ella (salvo las zonas de la decisión 8), sin que el agente decida nada carpeta a carpeta. Fracasa aunque funcione si rompe un enlace que hoy resuelve fuera de la evidencia, si reescribe el texto de la evidencia, si el log de estimación pierde las releases o si la 3.0.1 no sale hoy.

## Scope

- Entra:
  - `skills/sdd-upgrade/references/migrations/v3.0.1.md`.
  - Las frases de `sdd-upgrade/SKILL.md`, `add-to-changelog/SKILL.md` y `sdd-propose/references/coherence-pass.md`.
  - El arreglo de `addedCommits` en `cli/src/estimation/releases.ts`, con su test.
  - El mismo paso aplicado a este repo, `field-reports/` y `tests/*.md` incluidos, en sus dos commits.
  - `CLAUDE.md`, `constitution.md`, `architecture.md` y las tres guías de `.docs/workflow/`.
  - El código y los datos de la decisión 9, `dist/` y `THIRD_PARTY_NOTICES.md` reconstruidos, y `estimation-log.md` regenerado.
  - El tope de `path-length.test.ts` a 142 (decisión 3b).
  - La ADR 0036 y el `status` de la 0034.
  - Los requisitos de `migration` y de `estimation`.
  - La versión 3.0.1 en `.claude-plugin/plugin.json` y su entrada en `CHANGELOG.md`.
  - Este repo marcado en 3.0.1 con `sdd upgrade --mark`.
- No entra:
  - Quitar la lectura de `specs/` de la CLI (`cli/src/cli/layout.ts:40`, `cli/src/ids/scan.ts:38`): hasta la 4.0.0.
  - Las fixtures de baterías y los tests de la CLI que montan un proyecto con `specs/`: prueban la lectura 2.x, que sigue.
  - `cli/src/roadmap/releases.ts`: decisión 10.
  - El aviso de inicio con un template sin inicializar: la 0347.
  - El corte y la publicación de la release: los hace `sdd-end-release`.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| «las carpetas de `specs/` se leen y no se mueven» | ADR 0034 §Decisión | ADR 0036, decisión 13 |
| «you never move content in bulk», «moving content in bulk (the `specs/` folders stay…)», «touching historical specs or walkthroughs» | `skills/sdd-upgrade/SKILL.md`, Overview y paso 5 | decisión 2 |
| «(`.docs/sdd/specs/` for older ones)» | `skills/add-to-changelog/SKILL.md:22` | decisión 11 |
| `.docs/sdd/specs/` como carpeta de evidencia | `skills/sdd-propose/references/coherence-pass.md:7` | decisión 11 |
| `specs/` como carpeta viva de artefactos | `CLAUDE.md:20`, `constitution.md:47` y `:73`, `architecture.md:92`, `greenfield.md:105`, `brownfield.md:60` | decisión 11 |
| «The `specs/` folders from before 3.0.0 are read and not moved» | `skills/sdd-templates/SKILL.md:73` | decisión 11 |
| `MAX_RELATIVE_LENGTH = 140` | `cli/test/kit/path-length.test.ts:8` | decisión 3b |
| entradas de `ALLOWED` | `cli/test/kit/skills-3x-paths.test.ts:11` y `:15` | decisión 9 |
| «What doesn't move: … `specs/`» | `migrations/v3.0.0.md:5` | se queda: una migración publicada no se reescribe (decisión 8) |
| «`changes/` o `specs/`» | `sdd-end-release/SKILL.md:21`, `patch-lane.md:32`, capacidades `estimation` y `feature-ids` | se queda (decisión 12) |
| `migration.md:236` y `:273`, «`specs/` sigue donde estaba» | escenarios de la v3.0.0 y de la v2.3.4 | se quedan: describen esas migraciones |
| Lectura de `specs/` del propio repo | `statistics.test.ts:201-202`, `battery.mjs:30`, `upstream.json` (6 notas) | decisión 9 |

- Filas que implementa: 0348 → `ROADMAP.md:7`, que `sdd-archive` cierra; su texto, decisión 8.

## Approach

- A, dos comandos `node -e` en `v3.0.1.md`: una línea cada uno, se pegan igual en pwsh, Git Bash y cmd (sin `$`, sin `!`, sin comillas dobles dentro), y ya están probados en un clon. Cuesta leer un comando largo en la migración.
- B, un verbo `sdd upgrade --move-specs`: código nuevo en la CLI con sus tests y su entrada en la capacidad `cli`. No cabe en «publicar hoy» y añade un verbo para un uso único.
- C, prosa que el agente aplica carpeta a carpeta: 319 `git mv` en este repo, y el agente decide en cada enlace. Es lo contrario de «mecánico».
- Elegido: A — es lo más mecánico que cabe hoy, sin código que mantener tras la migración.

Pasos de `v3.0.1.md`, con predicado «existe `.docs/sdd/specs/`»; sin ella, solo el marcador:

1. **Punto de partida**: `git status --short` vacío en todo el repo; si no, para y lo dice.
2. **Mover** (no gate): el primer comando para sin mover nada si una entrada de `specs/` ya existe en `changes/`. Si no, hace `git mv` de cada una, para con exit 1 en el primer fallo y borra `specs/` si queda vacía; si no queda vacía, lista lo que queda. Después, el commit `chore(sdd): mover specs/ a changes/`.
3. **Reescribir** (no gate): el segundo comando, con las reglas de las decisiones 3 y 4. Imprime cuántos ficheros reescribió.
4. **Lo que se lista**: lo de la decisión 5, para el informe.
5. **Marcador**: «Verification», `sdd upgrade --mark 3.0.1` y el commit `chore(sdd): migrar al kit v3.0.1`.
6. **Reglas del proyecto**: el paso 8 de `v3.0.0.md`, en su propio commit, salvo lo que dice la decisión 14.

## Dónde se prueba

- Los dos comandos: en un clon de este repo (hecho: 319 entradas, 512 `.md`, colisión, `specs/` borrada, `--follow`) y en este repo, con el criterio de hecho y las zonas de la decisión 8 listadas con `git grep`.
- `addedCommits`: en `cli/test/estimation/releases.slow.test.ts`, como el test de las dos releases del mismo día. Un repo con una carpeta en `specs/` que entra en el tag `v1.0.0` y se mueve después a `changes/` sigue en `1.0.0`. En este repo, `sdd estimation log` da la misma tabla de releases antes y después de migrar.
- Los requisitos de `migration`: los cumple este repo al migrar y el clon con la colisión; `sdd capability check` valida su forma.
- La versión y su migración: `cli/test/kit` (cada `version` de `plugin.json` tiene su `vX.Y.Z.md`, paridad migración–init, marcador de las guías, `skills-3x-paths`).
- Los enlaces: `sdd roadmap check` y el pre-commit entero, `path-length.test.ts` incluido.
- Lo que lee `specs/` sin escribir la ruta entera: `git grep -n -e "'specs'" -e '"specs"' -e "specs/" -- "*.ts" "*.mjs" "*.js" "*.json"` fuera de `dist/` y de las fixtures, cada resultado clasificado como en la decisión 9.

## Términos y ADR

- Términos resueltos: copia de evidencia — fichero dentro de una subcarpeta de `changes/<carpeta>/`, que se mueve y no se reescribe.
- ADR candidatas: la 0036 (decisión 13) — alternativa descartada: bloquear carpetas nuevas en `specs/` y dejar las viejas.

## Delta de comportamiento

### Capacidad: `migration`

#### ADDED — La migración a la 3.0.1 junta `specs/` en `changes/`

- GIVEN un proyecto con `.docs/sdd/sdd-kit.json` a `3.0.0`, el árbol limpio y estas piezas:
  - la carpeta `.docs/sdd/specs/20261001-100000-feature-0079-b/`, con `walkthrough.md` y con `red/out/notas.md`, que enlaza `../../../../specs/20261001-100000-feature-0079-b/spec.md`;
  - la carpeta `.docs/sdd/changes/20261110-090000-feature-0160-c/`;
  - un `ROADMAP.md` que enlaza `[walkthrough](.docs/sdd/specs/20261001-100000-feature-0079-b/walkthrough.md)`;
  - un `.docs/sdd/steering/debt.md` que enlaza `[walkthrough](../specs/20261001-100000-feature-0079-b/walkthrough.md)`;
  - un `docs/guia.md` que enlaza `../specs/api.md`.
- WHEN el usuario pide «actualízame al kit» con el kit 3.0.1 cargado
- THEN `.docs/sdd/specs/` no existe y `.docs/sdd/changes/` tiene las dos carpetas
- AND un commit `chore(sdd): mover specs/ a changes/` solo lleva renombrados, y `git log --follow` de `walkthrough.md` llega a su commit de `specs/`
- AND `ROADMAP.md` enlaza `.docs/sdd/changes/20261001-100000-feature-0079-b/walkthrough.md` y `debt.md`, `../changes/20261001-100000-feature-0079-b/walkthrough.md`
- AND `red/out/notas.md`, copia de evidencia, conserva su texto, también el enlace a `specs/`
- AND `docs/guia.md` no cambia: está fuera de `.docs/sdd/`
- AND no hay gate: el «actualízame al kit» basta
- AND el informe lista cada fichero que no es `.md` y nombra `.docs/sdd/specs/`, sin tocarlo
- AND `sdd-kit.json` queda en `3.0.1`, escrito con `sdd upgrade --mark 3.0.1`, en un commit `chore(sdd): migrar al kit v3.0.1`

#### ADDED — La migración a la 3.0.1 no mueve nada con una carpeta repetida

- GIVEN un proyecto con `.docs/sdd/sdd-kit.json` a `3.0.0`, el árbol limpio y `20261001-100000-feature-0079-b/` en `.docs/sdd/specs/` y en `.docs/sdd/changes/`
- WHEN el usuario pide «actualízame al kit» con el kit 3.0.1 cargado
- THEN ninguna carpeta se mueve, `git status --short` sale vacío y `sdd-kit.json` sigue en `3.0.0`
- AND el informe dice «No se mueve nada; ya existen en changes/: 20261001-100000-feature-0079-b» y que, tras renombrar una de las dos, se vuelve a pedir «actualízame al kit»

#### ADDED — La migración a la 3.0.1 para con el árbol sucio

- GIVEN un proyecto con `.docs/sdd/sdd-kit.json` a `3.0.0`, carpetas en `.docs/sdd/specs/` y `ROADMAP.md` modificado sin commitear
- WHEN el usuario pide «actualízame al kit» con el kit 3.0.1 cargado
- THEN no se mueve ni se reescribe nada, `sdd-kit.json` sigue en `3.0.0` y el informe nombra `ROADMAP.md`
- AND con el árbol limpio pero `.docs/sdd/specs/20261001-100000-feature-0079-b/notas.log` ignorado por `.gitignore`, tampoco se mueve nada y el informe nombra `notas.log`

#### ADDED — Sin `specs/`, la migración a la 3.0.1 solo avanza el marcador

- GIVEN un proyecto con `.docs/sdd/sdd-kit.json` a `3.0.0` y sin `.docs/sdd/specs/`
- WHEN el usuario pide «actualízame al kit» con el kit 3.0.1 cargado
- THEN `sdd-kit.json` queda en `3.0.1` en un commit `chore(sdd): migrar al kit v3.0.1`, y ningún otro fichero cambia

#### Reglas de la capacidad — migration

- **Regla ante conflicto**: un paso que su migración marca «no gate» se ejecuta sin preguntar aunque borre o reestructure; la regla del gate de un paso que borra o reestructura cubre solo los pasos sin marca. Un paso «no gate» que choca con el estado del proyecto (árbol sucio, una carpeta repetida en el destino, algo sin versionar) para sin escribir nada y lo dice. Un documento que una migración lleva a la raíz y ya existe allí (`PRODUCT.md` de impeccable, un `CHANGELOG.md`) se funde sección a sección con gate: ninguno pisa al otro.

### Capacidad: `estimation`

#### MODIFIED — El log agrupa por release

- GIVEN un `CHANGELOG.md` en la raíz del proyecto (3.0.0) o un `<docs>/changelog.md` (2.x) con versiones `## [X.Y.Z] - AAAA-MM-DD` (o con `—`)
- WHEN se genera el log
- THEN aparece una tabla Release | Artefactos | Horas reales | Mediana | Sujetos ($) | Sesión ($), de la release más antigua a la más reciente
- AND con los dos changelogs, manda `CHANGELOG.md` y escribe por stderr que también existe `<docs>/changelog.md`
- AND `Sesión ($)` suma las cifras de los artefactos de la release que la tienen; sin ninguna, `—`
- AND cada artefacto va a la primera versión cuyo tag `vX.Y.Z` contiene el commit que lo añadió, y a la primera con fecha igual o posterior a la de su fila (la de cierre) si la versión no tiene tag; dos versiones del mismo día van de la anterior a la siguiente; los que no caen en ninguna van a «sin publicar», y los que no tienen fecha, a «sin fecha»
- AND una carpeta que nació en `specs/`, entró en el tag `v1.0.0` y se movió después a `changes/` con `git mv` va a `1.0.0`: el commit que la añadió es el de `specs/`, no el del movimiento
- AND sin changelog, o sin versiones con fecha, la tabla no aparece

## Topes de palabras

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `dist/skills/sdd-upgrade/SKILL.md` | 977 / 980 | 3 | sin cambio: la edición de la decisión 2 resta 2 palabras |
| `dist/skills/sdd-templates/SKILL.md` | 1.579 / 1.614 | 35 | sin cambio: la frase se acorta |
| `dist/skills/add-to-changelog/SKILL.md` | 339 / 500 | 161 | sin cambio: quita 4 palabras |
| `sdd-propose` (total) | 13.753 / 13.927 | 174 | sin cambio: quita 1 palabra |
| `.docs/sdd/steering/constitution.md` | 2.239 / 2.250 | 11 | sin cambio: la edición acorta |
| `.docs/sdd/steering/architecture.md` | 4.872 / 4.877 | 5 | sin cambio: la edición acorta |
| `.docs/sdd/steering/operations.md` | 20.703 / 20.785 | 82 | sin cambio: solo cambia rutas |

Medido con `wc -w`, el mismo corte por espacios que `word-budget.test.ts`.

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-11-17 | aprobada (opción «Apruebo») |
