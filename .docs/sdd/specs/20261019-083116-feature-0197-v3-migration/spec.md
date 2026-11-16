---
id: 20261019-083116-feature-0197-v3-migration
feature: 0197
parent: 0157
proposal: 0131
title: Migración v3.0.0 — los documentos a la estructura de la 3.0.0
mode: full
profile: delegate
status: approved
created: 2026-10-19
author: Àngel Delgado
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-10-19
---

# Spec — Migración v3.0.0: los documentos a la estructura de la 3.0.0

🦆 Un proyecto que ya usa el kit tiene hoy sus documentos con la forma vieja: la misión, el stack, el roadmap y el changelog, todos dentro de la carpeta del kit. La 3.0.0 los quiere en otro sitio: lo que lee la persona (`PRODUCT.md`, `ROADMAP.md`, `CHANGELOG.md`) en la raíz, y lo que lee el agente, en una subcarpeta. Al pedir «actualízame al kit», el agente te enseña una tabla con cada documento, a dónde va y cómo cambia; por ejemplo, el roadmap viejo pasa a «ahora / siguiente / más tarde», y la deuda va a su propio fichero, repartida en por triar, en espera, lista y descartada. Lo que la forma nueva exige y la vieja no tenía (el tamaño de cada tarea, la fecha de una deuda) sale de un dato que se puede comprobar, o te lo pregunta en la tabla. No mueve nada hasta tu «sí», las carpetas de trabajo pasadas se quedan donde están, y lo que falta de esta migración (los nombres de skills en tus textos, la revisión de reglas repetidas y apuntar la versión) llega en la 0199.

## Capacidades

- Modificadas: `migration` — requisitos nuevos de la migración a v3.0.0; un proyecto migrado sigue sin regenerarse desde cero; dónde viven los datos, el idioma de los nombres y la regla ante conflicto de un fichero de la raíz que ya existe

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: dos revisores — señales: contrato público (la estructura de documentos que leen las skills y la CLI), datos (una migración que mueve y reescribe documentos del proyecto) · tamaño: ~250 líneas en ~6 ficheros
- Dominio: si las recetas de destino (decisiones 3, 4, 7 y 8) pierden algo en silencio (una sección, una fila de deuda) y si el Tamaño propuesto por el agente choca con «no deduzcas el dato» (señal: datos)
- Técnica: si ROADMAP.md y debt.md salen con lo que exige `sdd roadmap check` (brief, Tamaño, `—`) y si `**Escribe**:` pasa la paridad (señal: contrato público)
- Mínimo razonable: un revisor Sonnet con los siete puntos — deja menos mirado si las recetas pierden contenido
```

Elegido por el dev-lead: «Dos: dominio Opus, técnica Sonnet (Recomendada)», 2026-10-19. El delta pasó `sdd capability merge` y `sdd capability check` sobre una copia de `.docs/sdd` antes y después de la review.

1. **Un fichero, dos features**: la 0197 escribe `skills/sdd-upgrade/references/migrations/v3.0.0.md` con los pasos de estructura y de roadmap; la 0199 le añade los de textos, el gate B6 y el marcador. Hasta la 0199 el fichero acaba sin marcador: un proyecto que lo aplicara se quedaría en 2.3.4 y la sesión le seguiría ofreciendo la 3.0.0. Solo pasa con el kit de `develop` (este repo no se migra hasta la 0198), no con el plugin publicado, que sale de `main`.
2. **El patrón de la v2.3.0** para todo paso que reestructura: punto de partida (`git status --short` vacío en lo que toca y el sha de `HEAD` apuntado), tabla de destinos (una fila por bloque, con su destino según la receta y, para cada valor que la forma nueva exige, de dónde sale), **gate** sobre la tabla, aplicar, y validar. **El contenido no se reescribe**, con dos excepciones: los enlaces, y lo que la tabla aprobada enseña con su texto resultante (Terminology, la condensación de `environments.md`). Con el dev-lead ausente, pendiente explícito sin tocar nada.
3. **Orden de los pasos**, porque cada uno lee lo que deja el anterior:
   1. `changelog.md` → `CHANGELOG.md`, porque `sdd roadmap check` lo lee para los «Tras».
   2. Los documentos de estado a `steering/`.
   3. El log de estimación.
   4. `PRODUCT.md` y `operations.md`.
   5. `ROADMAP.md` y `debt.md`, al final.
4. **`mission.md` → `PRODUCT.md`** (raíz), en la forma de `PRODUCT-template.md`. «Por qué existe» va a `## Product Purpose`, «Usuarios y roles» a `## Users` y «Qué es y qué no es» a `## Capabilities and Constraints`. «Dominio» va a `## Terminology`, en el formato `**Término**:`; `_Evitar_:` solo si el original nombra el sinónimo que se evita, y el texto resultante va en la tabla. Una sección que no está en la plantilla va a la tabla con su destino propuesto. Si ya hay un `PRODUCT.md` en la raíz (lo deja impeccable), la tabla dice sección por sección qué se funde: no se pisa ninguno.
5. **`tech-stack.md` y `environments.md` → `.docs/sdd/steering/operations.md`**, en la forma de `operations-template.md`:
   - `## Comandos`, `## Testing` y `## Frontend` pasan tal cual.
   - `environments.md` se condensa en `## Entornos`, y la tabla enseña el texto resultante.
   - De «Tecnologías» sale lo que ya dicen los manifests. Lo que no está en ningún manifest (un servicio, una versión de runtime fijada a mano) va a `architecture.md`, con la fila en la tabla.
   - Cada «Decisión abierta» pasa a Later en `ROADMAP.md`, con el `B<n>` siguiente al mayor del Backlog, como la v2.3.0.
   - El resto (por ejemplo, una sección de aprendizajes que añadió el proyecto) va a la tabla con destino propuesto: `operations.md`, `architecture.md`, `constitution.md` o fuera.
6. **`constitution.md`, `architecture.md`, `estimation.md` y `estimation-log.md` → `.docs/sdd/steering/`**, con `git mv`. El contenido queda intacto salvo los enlaces relativos que se rompen al bajar un nivel (`decisions/0001-…` pasa a `../decisions/0001-…`). Después, si hay `estimation.md`, `sdd estimation log --root .` regenera el log en `steering/`; sin `estimation.md` no hay log que mover.
7. **`changelog.md` → `CHANGELOG.md`** en la raíz, con `git mv`. Si ya hay un `CHANGELOG.md` en la raíz, la tabla propone fundirlos sección a sección: no se pisa ninguno.
8. **`roadmap.md` → `ROADMAP.md` (raíz)**, con la tabla de equivalencias de `sdd-roadmap` y estas reglas:
   - Con una `## Release <N>`, sus filas van a Now, con el título `## Now — <versión> · en preparación`, y las de «Próximo» a Next. Sin release, «Próximo» va a Now.
   - «Backlog» pasa a Later con su `B<n>`. Su «Origen» va al final del one-liner, una fila saldada sale y una `parcial` se queda con el «Ítem» reescrito a lo que queda. En Later, Tamaño y Tras llevan `—`.
   - De «Patches», los posteriores a la última release cerrada van a Now con `✅`: título = su «Descripción», brief con `**Carril:** patch`, la fecha en el one-liner y `**Requisitos:**` hacia su `patch.md` si la descripción lo enlaza. Los anteriores salen.
   - «Releases cerradas» sale, porque vive en `CHANGELOG.md` y en `releases/`. **Sus `validaciones pendientes:` no van a Now**: la capacidad `roadmap` no admite en una sección abierta una feature de una release cerrada. La tabla los lista, el informe los nombra y siguen en su walkthrough o su `patch.md`.
   - **Cada fila de Now y Next, con la forma de la plantilla**:
     - Título y one-liner salen del «Ítem» (o de «Feature» en una release).
     - El brief se monta con estas fuentes: `**Carril:**` del prefijo «Patch:» (sin él, feature); `**Requisitos:**` de `proposal:`; «Tras» de «tras NNNN»; `**Toca:**` de «Ficheros que toca»; `**Salda:**` de la fila de deuda que la apunta con `**Actuar**`. Lo demás lleva `—`.
     - «Externo» lleva el id de Jira, Azure DevOps o GitHub que nombre el «Ítem»; sin id, `—`.
     - **El Tamaño no se deduce**: la tabla lo deja como «lo decide el dev-lead» y el gate no se cierra sin él (la capacidad «La migración del roadmap no inventa datos» sigue en pie).
   - **Estados**: `⏳`, `🔄`, `✅`, `🧪` y `⏸️` pasan igual. Cualquier otro (`❌ descartado`) va a la tabla con la pregunta de su destino.
   - **«Tras» a un id que sale**: si el id está en `CHANGELOG.md`, se queda; si no, la tabla lo marca y la celda pasa a `—`, con aviso.
   - Una fila sin id (un hito) va a la tabla con la pregunta: Later o un id nuevo con `sdd id next --reserve`.
   - `Perfil de control: <perfil>` solo si la release 2.x lo decía.
9. **La deuda → `.docs/sdd/steering/debt.md`**, por su «Destino», sin inventar celdas:
   - `**Actuar**` → <id> o `sin fila` va a «Lista», con ese «Destino». Su «Evidencia» es la del «Ítem» (la plantilla 2.x pide la evidencia ahí: un enlace, un ticket, una cifra). Una fila sin evidencia va a «Por triar».
   - `**Esperar 2.º ticket**` va a «En espera», con lo que falta como «Falta».
   - `**Descartada**` va a «Descartadas», con su motivo (tu frase del 2026-10-16: «Dejarlas hasta la 0157»).
   - Una fila saldada o `parcial` (`**[…: saldada …]**` / `parcial`) anterior a la última release cerrada sale. La posterior va a «Lista» con su prefijo intacto, porque el corte de la release siguiente la cuenta.
   - Cualquier otro destino (`versión siguiente`, una frase) va a «Por triar». Es lo que la 0150 pide para los destinos fuera de la forma, y salda la fila de deuda l.415.
   - **Origen**: el enlace al ticket o al walkthrough que cite el «Ítem»; sin ninguno, `roadmap 2.x`.
   - **Fecha**: la del commit que añadió la fila al roadmap, con `git log -S"<primeras palabras del ítem>" --format=%as --reverse -- .docs/sdd/roadmap.md`, la primera. Es un dato comprobable, y la tabla dice de dónde sale cada una. Sin resultado, la tabla la pide al dev-lead.
   - «Impacto» pasa tal cual; «Motivo», del texto tras `**Descartada**`.
10. **Qué queda donde está**: `capabilities/`, `decisions/`, `specs/`, `releases/`, `kit-feedback/`, `sources/`, `sdd-kit.json` y `sdd-kit.local.json`. Los cambios nuevos nacen en `changes/`, y la CLI lee las dos carpetas (0144, decisión 3). `client-changelog.md` no se toca: lo retira la 0177.
11. **Enlaces**: tras mover cada documento, se buscan en todo el repo los enlaces a las nueve rutas viejas (`git grep`), fuera de la historia (`specs/`, `changes/`, `releases/`, `kit-feedback/`, `field-reports/`). Se corrigen en los documentos vivos: `CLAUDE.md`, `AGENTS.md`, `README.md`, `capabilities/` y los que se mueven. Las ADR no se tocan porque son inmutables; el informe lista sus enlaces rotos. Las menciones a skills viejas son de la 0199.
12. **Recuperación**: el informe y el cuerpo del commit dicen `git show <sha>:<ruta vieja>` para cada documento reestructurado (`mission.md`, `tech-stack.md`, `environments.md`, `roadmap.md`), como la v2.3.0. Lo que solo cambia de ruta se sigue con `git log --follow`.
13. **«Verificación»** de la v3.0.0:
    - `sdd roadmap check --path .docs/sdd` escribe `Roadmap válido`.
    - `sdd capability check --path .docs/sdd` sigue en verde.
    - No queda ninguna de las nueve rutas viejas en `.docs/sdd/`.
    - Existen los documentos nuevos que corresponden a lo que había.
    - El `git grep` de la decisión 11 solo devuelve las ADR listadas.
    - `git status --short` solo lista lo que la tabla aprobada nombra.
14. **`**Escribe**:`** de la v3.0.0: `PRODUCT.md`, `ROADMAP.md`, `CHANGELOG.md`, `steering/operations.md`, `steering/debt.md`, `steering/constitution.md`, `steering/architecture.md`, `steering/estimation.md` y `steering/estimation-log.md`. Todos los escribe ya `sdd-init` (0156), y `MigrationInitParity` lo comprueba. Las ediciones de enlaces en `CLAUDE.md`, `AGENTS.md`, `README.md` y `capabilities/` van en su frase «Además…», como la v2.0.0: `AGENTS.md` no está en el corpus de `sdd-init`.
15. **`roadmap-template.md` queda deprecada** (tu decisión, abajo): sigue en `sdd-templates`, marcada «2.x, deprecada: la leen `migrations/v2.3.0.md` y los proyectos sin migrar; se borra en la 4.0.0», y una fila de Later del roadmap lo recuerda. `sdd-roadmap`, `records.md`, `v2.3.0.md` y los tests que la usan no cambian.
16. **Topes restaurados con valores re-medidos**, como decidiste en la 0144: `sdd-templates` vuelve a tener tope de `SKILL.md` y total, y el kit entero vuelve a tener tope global. Los valores son los que midan al cerrar, redondeados a la centena de arriba. Hoy: `sdd-templates` 1.597 de `SKILL.md` (el tope viejo era 1.500) y 14.580 en total (11.990); el kit, 86.274 (54.595). La subida viene de los forks y las skills nuevas de la 0144 a la 0157, no de esta feature. Sale `$Suspended` de `WordBudget.Tests.ps1`.
17. **Una pieza entra, otra sale** (Art. I): entra `v3.0.0.md`, que no cuenta en ningún tope porque `WordBudget` excluye `references/migrations/`. Sale la suspensión de los topes, que vuelven a vigilar `sdd-templates` y el kit, y `roadmap-template.md` queda con fecha de salida. «Nada más» se justifica así: la migración es lo que cuesta llevar los proyectos de la 2.x a la 3.0.0.
18. **Previsión de la prueba** (Art. I), con REFACTOR de n = 2 por regla nueva con literal y `DRY_RUN=1` en cada molde nuevo:
    - **Molde**: `salas` de `using-sdd`, en 2.3.4, con `mission.md`, `tech-stack.md` (sus «Tecnologías» cubiertas por `package.json`), `roadmap.md` y `changelog.md`. El roadmap lleva:
      - Próximo con «tras» y `proposal:`;
      - Backlog;
      - Deuda técnica con una fila de cada destino: `**Actuar**` con evidencia, `**Actuar** → sin fila`, `**Esperar 2.º ticket**`, `**Descartada**` y `versión siguiente`, más una saldada posterior a la última release;
      - Patches de antes y de después de la release;
      - Releases cerradas con una `validaciones pendientes:`.
    - **La persona** (`subject_converse`, Haiku) aprueba las tablas como vienen y da el Tamaño `M` a cada fila.

    | Paso | Escenario | RED | GREEN |
    | --- | --- | --- | --- |
    | Estructura, roadmap y deuda (lo mide el disco del molde y `sdd roadmap check` = `Roadmap válido`) | `v1`: «Actualízame al kit.», con la persona | 1 | 2 |
    | Dev-lead ausente: nada se mueve | `v2`: «Actualízame al kit, el dev-lead no está.» | — | 1 |
    | REFACTOR (2 reglas con literal: la receta del roadmap y la de la deuda) | `v1` | — | 4 |

    **Total: 8 sujetos, ~6 $ y ~60 min** (un sujeto que migra conversando cuesta ~0,7 $). En el RED, el kit sin `v3.0.0.md` dice «ya está al día» y no migra.

### Hallazgos de la review

Dominio (Opus):

- **Aceptado** — (Crítico) `—` en Evidencia y Fecha hace fallar el check, y la 2.x no tiene esos datos → Evidencia sale del «Ítem», y sin ella la fila va a «Por triar»; Fecha sale del commit que añadió la fila, con su fuente en la tabla, o la pide el dev-lead (decisión 9).
- **Aceptado** — que el agente proponga el Tamaño choca con «no inventa datos» → lo decide el dev-lead en la tabla, y cada etiqueta del brief tiene su fuente o `—` (decisión 8).
- **Aceptado** — `validaciones pendientes:` en Now choca con la regla de `roadmap` → no van a Now; los patches posteriores van con `✅` y su fecha en el one-liner (decisión 8).
- **Aceptado** — columnas de Backlog y Release que se perdían, y el Backlog saldado o `parcial` → receta por columna (decisión 8).
- **Aceptado** — las saldadas posteriores a la última release desaparecían antes del corte → van a «Lista» con su prefijo; un `parcial` igual (decisión 9).
- **Aceptado** — «contenido intacto» contra los enlaces y las reescrituras de la tabla → la regla dice «salvo los enlaces y lo que la tabla aprobada enseña con su texto» (decisiones 2, 5 y 6), y el molde cubre «Tecnologías» con `package.json`.
- **Aceptado** — enlaces rotos fuera de `CLAUDE.md` y `AGENTS.md` → `git grep` en todo el repo, corrigiendo los vivos y listando las ADR (decisión 11, Scope y Verificación).
- **Aceptado** — «Reglas de la capacidad» sin tocar → MODIFIED de «Dónde viven los datos», «Idioma de los nombres» y «Regla ante conflicto».
- **Aceptado** — Release N con Próximo, un hito sin id, y la numeración de `B<n>` → decisiones 5 y 8.
- **Aceptado** — «no regenera los documentos de anclaje» contra una migración que los reestructura → MODIFIED de «Un proyecto ya inicializado se migra».

Técnica (Sonnet):

- **Aceptado** — (Crítico) el mismo que el Crítico de dominio → decisión 9; el escenario ya no exige `—` donde el check pide un dato.
- **Aceptado** — «Destino» de Lista con `sin fila` y la fuente de la «Evidencia» → decisión 9 y escenario con una fila `sin fila`.
- **Aceptado** — un «Tras» a un id que sale rompe el check → decisión 8.
- **Aceptado** — estados fuera de los cinco, «Externo» y `Perfil de control` → decisión 8.
- **Aceptado** — brief de las `validaciones pendientes:` y de los patches → las primeras no van a Now; los patches, con su fuente (decisión 8).
- **Aceptado, distinto** — `**Escribe**:` sin `CLAUDE.md` ni `AGENTS.md` → declara los documentos que nacen, también `steering/estimation-log.md`; las ediciones de enlaces van en «Además…», como la v2.0.0, porque `AGENTS.md` no está en el corpus de `sdd-init` y declararlo rompería la paridad (decisión 14).
- **Aceptado** — orden de los pasos y proyecto sin `estimation.md` → decisiones 3 y 6.
- **Aceptado** — `B<n>` de las decisiones abiertas y `—` en Later → decisiones 5 y 8.
- **Aceptado** — el Tamaño y un predicado propio del roadmap → el Tamaño lo da el dev-lead, y `v1` mide `Roadmap válido` (decisión 18).
- **Aceptado** — «una pieza entra» citaba un tope que no cuenta las migraciones → decisión 17.

### Decisiones tomadas con el dev-lead

- Partir la 0197 en dos: esta (estructura, roadmap y deuda, plantilla y topes) y la 0199 (textos, gate B6 y marcador) — «Partir en dos (Recomendada)», 2026-10-19
- `roadmap-template.md` no se borra: se depreca y se borra en la 4.0.0 — «podemos deprecarlo... y marcamos que se borrra en la v4», 2026-10-19
- Review de la spec con dos revisores, dominio en Opus y técnica en Sonnet — «Dos: dominio Opus, técnica Sonnet (Recomendada)», 2026-10-19
- Aprobación de la spec, con los topes re-medidos (decisión 16) y la previsión de la prueba (decisión 18) — «Apruebo (Recomendada)», 2026-10-19
- Del prompt de arranque (2026-10-18): no migra sin preguntar, no mueve contenido en bloque y pregunta antes de borrar o reestructurar; restaura los topes de `sdd-templates` (`SKILL.md` y total) y del kit entero con valores re-medidos; las filas Descartada de la deuda siguen en la tabla hasta esta feature y la migración dice qué se hace con ellas; un requisito renombrado va como REMOVED + ADDED y el delta se prueba con `sdd capability merge` sobre una copia antes del gate; REFACTOR de n = 2 por regla nueva con literal y `DRY_RUN=1` en cada molde nuevo; perfil `delegate`; al fusionar, `sdd merge --push`

## Intent

Un proyecto en la 2.x no tiene cómo llegar a la estructura de la 3.0.0: las plantillas, `sdd-init` y la CLI ya hablan la forma nueva, pero no hay migración. El éxito: un proyecto como `salas` en 2.3.4 pide «actualízame al kit», aprueba una tabla por documento y acaba con `PRODUCT.md`, `ROADMAP.md` y `CHANGELOG.md` en la raíz y `steering/` con lo demás. `sdd roadmap check` pasa, no se ha perdido ninguna fila ni sección sin decirlo, ningún enlace vivo queda roto y lo de antes se recupera con `git show`. Fracaso aunque funcione: que se pierda una fila de deuda o una sección sin decirlo, que se invente un dato (un tamaño, una fecha), que se mueva algo sin el «sí», o que se toquen `specs/` o los walkthroughs.

## Scope

- Entra: los pasos de estructura y de roadmap de `skills/sdd-upgrade/references/migrations/v3.0.0.md`, con su `**Escribe**:`, su «Además…» y su «Verificación»; la corrección de enlaces de la decisión 11; la deprecación de `roadmap-template.md` en el índice de `sdd-templates` y su fila en Later; los topes de `WordBudget.Tests.ps1`; la batería de `sdd-upgrade` con `v1` y `v2`; el delta de `migration`; la fila de deuda l.415 saldada.
- No entra: los nombres de skills en los textos del proyecto, `.claude/skills|commands`, las rutas opcionales en `Select-String`, `estimation.md` con los puntos 2 y 3, el gate B6, el aviso de plantillas cuya regla cambió y el marcador (0199); `client-changelog.md` (0177); migrar este repo (0198); borrar `roadmap-template.md` (4.0.0).

## Approach

Una migración de texto que el agente sigue con `sdd-upgrade`, sin código nuevo en la CLI. Cada documento que cambia de forma pasa por una tabla de destinos con gate, como el paso del roadmap de la v2.3.0, y cada traslado es un `git mv` que guarda la historia. Las recetas salen de lo que ya existe: los encabezados de las plantillas 3.0.0, la tabla de equivalencias de `sdd-roadmap` y lo que exige `sdd roadmap check`. Un dato que la forma nueva exige y la vieja no tiene sale de una fuente comprobable que la tabla nombra, o lo da el dev-lead.

## Dónde se prueba

- Que la migración deja la estructura, el roadmap y la deuda: sujetos headless, batería `tests/batteries/sdd-upgrade/` (`v1`, `v2`), con la persona de `subject_converse`; el resultado se lee en el disco del molde y con `sdd roadmap check` sobre él.
- `**Escribe**:` y la versión de `plugin.json` con su fichero: Pester `MigrationInitParity`.
- Topes: Pester `WordBudget`.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna — la estructura y su porqué ya están en la ADR 0012

## Delta de comportamiento

### Capacidad: `migration`

**MODIFIED — Un proyecto ya inicializado se migra, no se re-inicializa** (antes: «no regenera los documentos de anclaje ni vuelca `capabilities/`»)
- GIVEN un proyecto con `.docs/sdd/sdd-kit.json` sin la clave `init`, o con `.docs/sdd/mission.md` y sin `sdd-kit.json`, y la petición «actualízame al kit»
- WHEN el agente invoca `sdd-upgrade`
- THEN ejecuta `sdd upgrade --root <raíz>`, que lista las migraciones posteriores a la `version` de `sdd-kit.json` hasta la mayor del kit cargado, en orden SemVer
- AND sin `sdd-kit.json`, la pregunta de si es un proyecto anterior a la v0.2.0, la recomendada, o una init de la 2.x que se cortó la hace el predicado 4 de `sdd-init`: si la sesión aún no la respondió, `sdd-upgrade` invoca `sdd-init`; con «anterior a la v0.2.0», `sdd-upgrade` las aplica todas, y con «init cortada», sigue la init sin migrar
- AND las aplica en orden, con gate por fichero, y al acabar cada versión ejecuta su «Verificación», escribe el marcador con `sdd upgrade --mark <versión>` y hace su commit
- AND no regenera los documentos de anclaje desde cero ni vuelca `capabilities/`: una migración solo los reestructura con una tabla de destinos y su gate
- AND con la `version` igual a la mayor migración del kit cargado, `sdd upgrade` escribe «el proyecto ya está al día con el kit <versión>» y el agente no toca nada
- AND un `sdd-kit.json` con la clave `init` no se migra: `sdd upgrade` escribe «init en curso: sigue con sdd-init», y la init sigue por `sdd-init` ([`onboarding`](onboarding.md))
- AND pedida a `sdd-init`, la migración la hace `sdd-upgrade`: `sdd-init` no aplica ninguna migración

**ADDED — La migración a v3.0.0 lleva los documentos de producto y de operaciones a su sitio**
- GIVEN un proyecto en 2.3.4 con `.docs/sdd/mission.md` («Por qué existe», «Usuarios y roles», «Qué es y qué no es», «Dominio» con «**Franja**: una hora reservable»), `tech-stack.md` («Tecnologías» con Node 22 y Vitest, que ya fija `package.json`; «Comandos»; «Testing»; «Decisiones abiertas» con «¿avisos por correo?») y `environments.md`, todo commiteado, y el dev-lead presente
- WHEN pide «actualízame al kit»
- THEN el agente presenta una tabla con cada sección, su destino y el texto resultante de lo que se reescribe, y no mueve nada antes de su «sí»
- AND tras el «sí» hay un `PRODUCT.md` en la raíz con `## Users`, `## Product Purpose`, `## Capabilities and Constraints` y `## Terminology` con «**Franja**:», y un `.docs/sdd/steering/operations.md` con `## Comandos`, `## Testing` y `## Entornos`
- AND «¿avisos por correo?» es una fila de Later en `ROADMAP.md` con el `B<n>` siguiente al mayor del Backlog, «Tecnologías» no está en ningún documento, y no quedan `mission.md`, `tech-stack.md` ni `environments.md` en `.docs/sdd/`
- AND el informe y el cuerpo del commit dicen `git show <sha>:.docs/sdd/mission.md`, y lo mismo para los otros dos

**ADDED — La migración a v3.0.0 mueve los documentos de estado a `steering/` y el changelog a la raíz**
- GIVEN el mismo proyecto con `.docs/sdd/constitution.md` (que enlaza `decisions/0001-…`), `architecture.md`, `estimation.md`, `estimation-log.md` y `changelog.md`, un `CLAUDE.md` y un `README.md` que enlazan `.docs/sdd/constitution.md`, y una ADR que enlaza `../mission.md`
- WHEN se aplica la v3.0.0 y el dev-lead aprueba la tabla
- THEN los cuatro primeros están en `.docs/sdd/steering/` con su contenido intacto salvo el enlace, que pasa a `../decisions/0001-…`; `estimation-log.md` lo ha regenerado `sdd estimation log`, y `changelog.md` es `CHANGELOG.md` en la raíz
- AND los enlaces de `CLAUDE.md` y `README.md` apuntan a `.docs/sdd/steering/constitution.md`, la ADR no cambia y el informe la lista con su enlace roto
- AND `specs/`, `capabilities/`, `decisions/` y `releases/` siguen donde estaban

**ADDED — La migración a v3.0.0 lleva el roadmap a Now, Next y Later**
- GIVEN un `roadmap.md` 2.x sin release en preparación, con la 0021 y la 0022 en «Próximo» (la 0022 con «tras 0021» y «`proposal: 0019`»), B3 en «Backlog», el patch 0023 posterior a la última release cerrada y el 0017 anterior, y la release cerrada con `validaciones pendientes: 0016`
- WHEN se aplica la v3.0.0 y el dev-lead aprueba la tabla, con el Tamaño `M` para la 0021 y la 0022
- THEN `ROADMAP.md` tiene en Now la 0021 y la 0022 con su brief plegado (la 0022 con «Tras» 0021 y `**Requisitos:**` hacia la propuesta 0019), Tamaño `M`, y el patch 0023 con `✅` y `**Carril:** patch`; en Later, la B3
- AND no aparecen ni el 0017 ni la 0016, y la tabla y el informe nombran la 0016 como validación pendiente que sigue en su walkthrough
- AND la tabla deja el Tamaño como «lo decide el dev-lead» antes de su respuesta, sin proponer uno
- AND `sdd roadmap check --path .docs/sdd` escribe `Roadmap válido`, y no queda `.docs/sdd/roadmap.md`

**ADDED — La migración a v3.0.0 lleva la deuda a `debt.md` sin inventar celdas**
- GIVEN una «Deuda técnica» 2.x con una fila `**Actuar** → 0022` cuyo «Ítem» enlaza su ticket, una `**Actuar** → sin fila` sin evidencia, una `**Esperar 2.º ticket**`, una `**Descartada**: duplica la 0018`, una con destino `versión siguiente` y una saldada posterior a la última release cerrada
- WHEN se aplica la v3.0.0 y el dev-lead aprueba la tabla
- THEN `.docs/sdd/steering/debt.md` tiene la primera en «Lista» con destino 0022 y el ticket como evidencia, y la saldada en «Lista» con su prefijo `**[… saldada …]**` intacto
- AND la de `sin fila` y la de `versión siguiente` están en «Por triar», la de `**Esperar**` en «En espera» y la `**Descartada**` en «Descartadas» con «duplica la 0018» como motivo
- AND cada «Fecha» es la del commit que añadió su fila al roadmap, y la tabla dice de dónde salió
- AND `sdd roadmap check --path .docs/sdd` escribe `Roadmap válido`

**ADDED — Sin el dev-lead, la migración a v3.0.0 no mueve nada**
- GIVEN el mismo proyecto y la petición «actualízame al kit, el dev-lead no está»
- WHEN el agente llega a los pasos de la v3.0.0
- THEN ningún documento cambia de sitio ni de forma, y el informe lista cada tabla de destinos como pendiente, con cómo reanudarla
- AND no hay commit de la migración ni cambia el marcador

**Reglas de la capacidad**
- **Dónde viven los datos**: las migraciones viven en `skills/sdd-upgrade/references/migrations/vX.Y.Z.md`; la versión aplicada, en `.docs/sdd/sdd-kit.json` del proyecto, que escribe `sdd upgrade --mark`; lo que escribe cada migración, en su línea `**Escribe**:`. La memoria automática, en `~/.claude/projects/<project>/memory/` (o en `autoMemoryDirectory` si el proyecto la redefine), una por repositorio y compartida por sus worktrees; cada entrada es un fichero de memoria indexado en `MEMORY.md`. El roadmap anterior a la migración a v2.3.0, en el commit que nombran el informe y el commit de la migración. Los `mission.md`, `tech-stack.md`, `environments.md` y `roadmap.md` anteriores a la migración a v3.0.0, en el commit que nombran su informe y su commit (`git show <sha>:<ruta>`); los documentos de estado, en `.docs/sdd/steering/` tras ella.
- **Idioma de los nombres**: los nombres que una migración crea o renombra en el proyecto van en inglés kebab-case, salvo los tres documentos de la raíz que fija el Art. IV en mayúsculas: `PRODUCT.md`, `ROADMAP.md` y `CHANGELOG.md`.
- **Regla ante conflicto**: un paso que su migración marca «sin gate» se ejecuta sin preguntar aunque borre o reestructure; la regla del gate de un paso que borra o reestructura cubre solo los pasos sin marca. Un documento que una migración lleva a la raíz y ya existe allí (`PRODUCT.md` de impeccable, un `CHANGELOG.md`) se funde sección a sección con gate: ninguno pisa al otro.

## Enmiendas

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-10-19 | aprobada: «Apruebo (Recomendada)» |
